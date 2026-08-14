# HockeyPlanner Landing: Timeweb VPS deployment

This guide prepares the existing Timeweb VPS for the static landing at
`https://хоккейный-планировщик.рф/` (`xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai`).

The bootstrap is performed once over SSH by the owner. Normal deployments then run from
GitHub Actions on pushes to `main`. The landing has no runtime secrets and does not call an API.

## Paths and verified infrastructure conventions

The existing production compose file is expected at `/opt/hockeyplanner/docker-compose.yml` and
is started from `/opt/hockeyplanner`. The current reference configuration uses:

- nginx service: `nginx`
- nginx container: `hockeyplanner-nginx`
- nginx config host path: `/opt/hockeyplanner/nginx/`
- Let's Encrypt host path: `/etc/letsencrypt`
- ACME webroot host path: `/opt/hockeyplanner/certbot/www`
- ACME webroot container path: `/var/www/certbot`

Before applying this guide, compare those facts with the actual VPS. Stop if they differ.

## A. Pre-flight

Sign in using the same Unix account that will be configured as `VPS_USER`. Do not install or
upgrade anything yet. Check the available tools and current compose configuration:

```bash
docker --version
docker compose version
git --version
node --version
npm --version
command -v certbot || true
certbot --version || true
cd /opt/hockeyplanner
docker compose config --services
docker compose ps
docker inspect hockeyplanner-nginx --format '{{range .Mounts}}{{println .Source "->" .Destination}}{{end}}'
```

Confirm that Node satisfies the version required by the lockfile/build and that the existing
nginx mounts include `/etc/letsencrypt` and `/var/www/certbot`. Do not create a second certificate
management scheme if the VPS uses a container, timer, or another mechanism instead of host certbot.

## B. DNS

Create one `A` record for the root domain:

```text
хоккейный-планировщик.рф
xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai
```

Point it to the current Timeweb VPS IPv4 address. Do not guess the address. Do not add `www`.
Do not add an `AAAA` record unless IPv6 is actually configured on the VPS and nginx is listening
on it.

After DNS propagation, verify the public result:

```bash
dig +short A xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai @1.1.1.1
nslookup xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai
```

The returned IPv4 must match the VPS before requesting a certificate.

## C. Directories

Create the source and persistent publish directories. They must be writable by the deployment
account, while nginx only receives a read-only mount:

```bash
sudo install -d -m 0755 -o "$USER" -g "$(id -gn)" /opt/hockeyplanner/landing-src
sudo install -d -m 0755 -o "$USER" -g "$(id -gn)" /opt/hockeyplanner/landing/dist
sudo install -d -m 0755 /opt/hockeyplanner/nginx/conf.d
```

## D. Initial repository clone

The repository is public, so no GitHub token or deploy key is needed for checkout:

```bash
git clone --branch main --single-branch \
  https://github.com/tracktorist237/hockeyplanner-landing.git \
  /opt/hockeyplanner/landing-src
cd /opt/hockeyplanner/landing-src
git branch --show-current
git remote -v
```

The branch must be `main` and `origin` must point to the repository above.

## E. Initial build and publish

```bash
cd /opt/hockeyplanner/landing-src
npm ci
npm run build
test -f dist/index.html

mkdir -p /opt/hockeyplanner/landing/dist
find /opt/hockeyplanner/landing/dist -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
cp -a /opt/hockeyplanner/landing-src/dist/. /opt/hockeyplanner/landing/dist/
test -f /opt/hockeyplanner/landing/dist/index.html
```

This clears only the contents of the persistent publish directory. It never removes the directory
itself, so the Docker bind mount remains stable.

## F. Docker Compose mounts

The current compose already mounts the whole nginx `conf.d` directory. Keep that mount unchanged.
The landing needs only one additional static-directory mount.

Current relevant section:

```yaml
services:
  nginx:
    image: nginx:1.27-alpine
    container_name: hockeyplanner-nginx
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./frontend/build:/usr/share/nginx/html:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
      - /opt/hockeyplanner-staging/frontend/build:/usr/share/nginx/staging-html:ro
```

Add only the marked landing dist volume without changing the existing mounts:

```yaml
services:
  nginx:
    image: nginx:1.27-alpine
    container_name: hockeyplanner-nginx
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro # existing; keep unchanged
      - ./frontend/build:/usr/share/nginx/html:ro
      - ./landing/dist:/usr/share/nginx/landing-html:ro # add
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
      - /opt/hockeyplanner-staging/frontend/build:/usr/share/nginx/staging-html:ro
```

Make a backup, edit the actual compose file, and validate it:

```bash
cd /opt/hockeyplanner
sudo cp docker-compose.yml docker-compose.yml.pre-landing
sudoedit docker-compose.yml
docker compose config >/dev/null
```

Do not recreate nginx yet. First install the temporary HTTP-only config described below, because the
HTTPS certificate does not exist at this point.

## G. HTTP-only nginx bootstrap

The source-controlled final config references certificate files. Activating it before certificate
issuance would make nginx configuration validation fail. Create a temporary HTTP-only config first:

```bash
sudo tee /opt/hockeyplanner/nginx/conf.d/hockeyplanner-landing.conf >/dev/null <<'NGINX'
server {
    listen 80;
    server_name xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        root /usr/share/nginx/landing-html;
        index index.html;
        try_files $uri =404;
    }
}
NGINX
```

The existing directory mount makes this file available in the container as
`/etc/nginx/conf.d/hockeyplanner-landing.conf`. Recreate only the nginx service once so the new
landing static-directory bind mount takes effect, then validate the running configuration:

```bash
cd /opt/hockeyplanner
docker compose up -d --no-deps nginx
docker exec hockeyplanner-nginx nginx -t
docker compose ps nginx
```

`docker compose up -d --no-deps nginx` is required once because adding the landing dist volume
requires container recreation. It does not restart PostgreSQL or the backend. Adding or changing a
file under the existing `./nginx/conf.d:/etc/nginx/conf.d:ro` directory mount does not require
another recreation. Subsequent landing application deployments do not restart or reload nginx.

Optionally verify the ACME path before requesting the certificate:

```bash
sudo install -d /opt/hockeyplanner/certbot/www/.well-known/acme-challenge
echo landing-ok | sudo tee /opt/hockeyplanner/certbot/www/.well-known/acme-challenge/landing-probe
curl --fail http://xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai/.well-known/acme-challenge/landing-probe
sudo rm -f /opt/hockeyplanner/certbot/www/.well-known/acme-challenge/landing-probe
```

## H. Let's Encrypt

First identify the existing certificate-management mechanism:

```bash
command -v certbot || true
certbot --version || true
sudo ls -la /etc/letsencrypt/live
systemctl list-timers --all | grep -i certbot || true
cd /opt/hockeyplanner
docker compose ps | grep -i certbot || true
```

Continue with the command below only if the VPS really uses host certbot and the existing renewal
process will cover certificates created by it. If certbot is containerized, installed through
another system, or `/etc/letsencrypt` is not the live host certificate store mounted into nginx,
**stop and establish the current certificate-management procedure first**.

For confirmed host certbot:

```bash
sudo certbot certonly \
  --webroot \
  --webroot-path /opt/hockeyplanner/certbot/www \
  --cert-name xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai \
  -d xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai
```

Do not add `www`. After success, verify the exact files expected by nginx:

```bash
sudo test -f /etc/letsencrypt/live/xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai/fullchain.pem
sudo test -f /etc/letsencrypt/live/xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai/privkey.pem
```

Do not reuse the `hockeyplanner.ru` certificate unless inspection proves that its SAN list contains
the landing IDN domain.

## I. Final nginx config and HTTPS

Copy the reviewed source-controlled config over the temporary HTTP-only file:

```bash
sudo cp \
  /opt/hockeyplanner/landing-src/deploy/nginx/hockeyplanner-landing.conf \
  /opt/hockeyplanner/nginx/conf.d/hockeyplanner-landing.conf

cd /opt/hockeyplanner
docker exec hockeyplanner-nginx nginx -t
docker exec hockeyplanner-nginx nginx -s reload
```

The existing container name is `hockeyplanner-nginx`. A successful `nginx -t` is mandatory before
reload. The reload is graceful and does not restart backend or PostgreSQL. Ordinary landing deploys
only update files in the mounted static directory and therefore need neither reload nor restart.

## J. GitHub repository secrets

Secrets from other repositories are not copied automatically. In
`tracktorist237/hockeyplanner-landing`, open **Settings → Secrets and variables → Actions** and create:

- `VPS_HOST` — the VPS host/IP already used by the production deployment account
- `VPS_USER` — the Unix deployment account that owns `landing-src` and `landing/dist`
- `VPS_SSH_KEY` — its existing private SSH key

The matching public key must already be present in that account's `authorized_keys`. Do not add a
password, `.env`, API key, Timeweb token, Cloudflare token, GitHub PAT, or application secret.

## K. First Actions deployment

After the bootstrap files have been reviewed and pushed to `main`, open GitHub **Actions** and select
**Deploy Landing to VPS**. Confirm that the job:

1. checks out the exact `origin/main` state in `/opt/hockeyplanner/landing-src`;
2. runs `npm ci` and `npm run build`;
3. verifies `dist/index.html`;
4. replaces only the contents of `/opt/hockeyplanner/landing/dist`;
5. completes without restarting Docker services.

## L. Smoke test

Run after the certificate and first deployment are complete:

```bash
curl -I http://xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai/
curl -I https://xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai/
curl -fsS https://xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai/ | grep -F '<title>HockeyPlanner — планировщик хоккейной команды</title>'
curl -I https://xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai/favicon.ico
curl -I https://xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai/robots.txt
curl -I https://xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai/sitemap.xml
curl -I https://xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai/og-image.png
curl -I https://xn----8sbgjrbcagaihxeflmw5fye5a.xn--p1ai/path-that-must-not-exist
```

Expected results:

- HTTP `/` returns `301` to HTTPS;
- HTTPS `/` returns `200` and the expected title;
- favicon, robots, sitemap, and OG image return `200`;
- the unknown path returns `404`, not `index.html`;
- all visible CTA links open `https://hockeyplanner.ru/`;
- mobile layout has no horizontal scroll and the browser console has no errors.

## Normal deployment sequence

Every push to `main` queues one production deployment. The workflow connects by SSH, resets the
dedicated production checkout to `origin/main`, installs locked dependencies, builds Vite, and copies
the new `dist` contents into the already-mounted publish directory. nginx immediately serves those
files; no Docker restart or nginx reload is part of a normal application deployment.

## Application rollback

Choose a known-good commit from GitHub or `git log`, then rebuild and republish it manually:

```bash
cd /opt/hockeyplanner/landing-src
git fetch --prune origin
git checkout main
git reset --hard <KNOWN_GOOD_COMMIT_SHA>
npm ci
npm run build
test -f dist/index.html
find /opt/hockeyplanner/landing/dist -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
cp -a dist/. /opt/hockeyplanner/landing/dist/
test -f /opt/hockeyplanner/landing/dist/index.html
```

For a durable rollback, also revert the faulty commit in GitHub and push that revert to `main`;
otherwise the next normal deployment will restore `origin/main`. Ordinary application rollback does
not require DNS, SSL, nginx, Docker Compose, backend, or PostgreSQL changes.

## VPS-dependent unknowns

These must be verified during bootstrap because they cannot be established from the repositories:

- actual VPS IPv4 and DNS propagation;
- whether `VPS_USER` has the required filesystem ownership and SSH authorization;
- installed Node/npm versions;
- actual certbot installation and automatic-renewal mechanism;
- current live compose file and nginx mounts matching the checked-in reference;
- firewall/Timeweb security-group access to ports 80 and 443;
- whether an existing certificate already contains the landing domain as a SAN.
