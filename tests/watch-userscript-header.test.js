import assert from "node:assert/strict";
import { mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { sourceContext } from "./source-context.js";

test("header watcher follows repeated atomic saves", async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "launch-school-ux-kit-header-"));
  const headerPath = path.join(directory, "header.txt");
  await writeFile(headerPath, "@version 1\n");
  const changes = [];
  const timers = [];
  let watchDirectory;
  let onFsChange;
  let watcherClosed = false;
  const context = sourceContext("../scripts/watch-userscript-header.js", {
    fs: {
      readFileSync: fs.readFileSync,
      watch(directoryPath, callback) {
        watchDirectory = directoryPath;
        onFsChange = callback;
        return { close: () => (watcherClosed = true) };
      },
    },
    path,
    setTimeout(callback) {
      timers.push(callback);
      return timers.length;
    },
    clearTimeout() {},
  });
  const close = context.watchUserscriptHeader(headerPath, () => changes.push(true));
  t.after(async () => {
    close();
    await rm(directory, { recursive: true, force: true });
  });
  assert.equal(watchDirectory, directory);

  const saveAtomically = async (version, expectedUpdates) => {
    const temporaryPath = `${headerPath}.next`;
    await writeFile(temporaryPath, `@version ${version}\n`);
    await rename(temporaryPath, headerPath);
    onFsChange("rename", path.basename(headerPath));
    timers.at(-1)();
    assert.equal(changes.length, expectedUpdates);
  };

  await saveAtomically("2", 1);
  await saveAtomically("3", 2);
  assert.equal(await readFile(headerPath, "utf8"), "@version 3\n");
  close();
  assert.equal(watcherClosed, true);
});
