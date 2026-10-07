import { readFile } from "node:fs/promises";
import * as esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const releaseBundlePath = "./dist/js/index.min.js";
const watchBundlePath = "./.dev-dist/js/index.js";
const stagingBundlePath = "./.build-tmp/js/index.min.js";
const headerFile = "./src/userscript/header.txt";
const licenseFile = "./LICENSE";
const thirdPartyNoticesFile = "./THIRD-PARTY-NOTICES.txt";
const isWatchMode = process.argv.includes("--watch");

const cssTextPlugin = {
  name: "css-text",
  setup(build) {
    build.onResolve({ filter: /^virtual-esbuild:styles$/ }, () => ({
      path: "virtual-esbuild:styles",
      namespace: "css-text",
    }));

    build.onLoad({ filter: /.*/, namespace: "css-text" }, async () => {
      const result = await esbuild.build({
        entryPoints: ["src/css/styles.css"],
        bundle: true,
        write: false,
        minify: true,
        metafile: true,
        loader: {
          ".css": "css",
          ".svg": "dataurl",
        },
      });

      const css = result.outputFiles[0].text;

      return {
        contents: `export default ${JSON.stringify(css)};`,
        loader: "js",
        watchFiles: Object.keys(result.metafile.inputs),
      };
    });
  },
};

async function createContext() {
  const [userscriptHeader, projectLicense, thirdPartyNotices] = await Promise.all([
    readFile(headerFile, "utf8"),
    readFile(licenseFile, "utf8"),
    readFile(thirdPartyNoticesFile, "utf8"),
  ]);

  return esbuild.context({
    entryPoints: ["src/js/index.js"],
    bundle: true,
    outfile: isWatchMode ? watchBundlePath : stagingBundlePath,
    minify: !isWatchMode,
    logLevel: "info",
    plugins: [cssTextPlugin],
    loader: {
      ".svg": "text",
    },
    banner: {
      js: userscriptHeader,
    },
    footer: {
      js: `\n/*\n${projectLicense}\n\n${thirdPartyNotices}\n*/`,
    },
  });
}

const outputBundlePath = isWatchMode ? watchBundlePath : stagingBundlePath;
const outputDirectory = path.dirname(outputBundlePath);
fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.mkdirSync(outputDirectory, { recursive: true });

let ctx = await createContext();

if (isWatchMode) {
  await ctx.watch();

  let headerMtimeMs = fs.statSync(headerFile).mtimeMs;
  let headerChangeTimeout;

  fs.watch(headerFile, () => {
    clearTimeout(headerChangeTimeout);

    headerChangeTimeout = setTimeout(async () => {
      const nextMtimeMs = fs.statSync(headerFile).mtimeMs;
      if (nextMtimeMs === headerMtimeMs) return;
      headerMtimeMs = nextMtimeMs;

      console.log(`Build started (change: "${headerFile}")`);
      await ctx.dispose();
      ctx = await createContext();
      await ctx.watch();
    }, 100);
  });

  console.log("Watching source files. Press Ctrl-C to stop.");
} else {
  await ctx.rebuild();
  await ctx.dispose();
  fs.mkdirSync(path.dirname(releaseBundlePath), { recursive: true });
  fs.renameSync(stagingBundlePath, releaseBundlePath);
  fs.rmSync("./.build-tmp", { recursive: true, force: true });
}
