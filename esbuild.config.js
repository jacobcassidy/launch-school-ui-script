import * as esbuild from "esbuild";
import fs from "node:fs";
import { env } from "node:process";

const watchMode = env.WATCH_MODE === "true";
const distDir = "./dist/";

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
        loader: {
          ".css": "css",
        },
      });

      const css = result.outputFiles[0].text;

      return {
        contents: `export default ${JSON.stringify(css)};`,
        loader: "js",
        watchFiles: ["src/css/styles.css"],
      };
    });
  },
};

const buildOptions = {
  entryPoints: ["src/js/index.js"],
  bundle: true,
  outfile: `${distDir}/js/index.min.js`,
  minify: true,
  logLevel: "info",
  plugins: [cssTextPlugin],
};

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

if (watchMode) {
  let ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("Watching source files. Press Ctrl-C to stop.");
} else {
  await esbuild.build(buildOptions);
}
