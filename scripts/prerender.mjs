import { readFile, rm, writeFile } from "node:fs/promises";
import { render } from "../.prerender/entry-server.js";

const outputPath = new URL("../dist/index.html", import.meta.url);
const template = await readFile(outputPath, "utf8");
const marker = '<div id="root"></div>';

if (!template.includes(marker)) throw new Error("Prerender marker was not found in dist/index.html");

await writeFile(outputPath, template.replace(marker, `<div id="root">${render()}</div>`), "utf8");
await rm(new URL("../.prerender", import.meta.url), { recursive: true, force: true });
console.log("Prerendered / into dist/index.html");
