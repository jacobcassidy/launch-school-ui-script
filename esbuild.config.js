import { readFile } from "node:fs/promises";
import * as esbuild from "esbuild";
import fs from "node:fs";
import process from "node:process";

const distDir = "./dist/";
const headerFile = "./src/userscript/header.txt";
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
  const userscriptHeader = await readFile(headerFile, "utf8");

  return esbuild.context({
    entryPoints: ["src/js/index.js"],
    bundle: true,
    outfile: `${distDir}/js/index.min.js`,
    minify: true,
    logLevel: "info",
    plugins: [cssTextPlugin],
    banner: {
      js: userscriptHeader,
    },
  });
}

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

let ctx = await createContext();

if (isWatchMode) {
  await ctx.watch();

  let headerChangeTimeout;

  fs.watch(headerFile, () => {
    clearTimeout(headerChangeTimeout);
    headerChangeTimeout = setTimeout(async () => {
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
}
