import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
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
  const watchers = new Map();
  const context = sourceContext("../scripts/watch-userscript-header.js", {
    fs: {
      readFileSync: fs.readFileSync,
      watch(directoryPath, callback) {
        watchers.set(directoryPath, callback);
        return { close: () => watchers.delete(directoryPath) };
      },
    },
    path,
    setTimeout(callback) {
      timers.push(callback);
      return timers.length;
    },
    clearTimeout() {},
  });
  const close = context.watchUserscriptMetadata([headerPath], () => changes.push(true));
  t.after(async () => {
    close();
    await rm(directory, { recursive: true, force: true });
  });
  assert.ok(watchers.has(directory));

  const saveAtomically = async (version, expectedUpdates) => {
    const temporaryPath = `${headerPath}.next`;
    await writeFile(temporaryPath, `@version ${version}\n`);
    await rename(temporaryPath, headerPath);
    watchers.get(directory)("rename", path.basename(headerPath));
    timers.at(-1)();
    assert.equal(changes.length, expectedUpdates);
  };

  await saveAtomically("2", 1);
  await saveAtomically("3", 2);
  assert.equal(await readFile(headerPath, "utf8"), "@version 3\n");
  close();
  assert.equal(watchers.size, 0);
});

test("watch build metadata includes license and third-party notice changes", async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "launch-school-ux-kit-notices-"));
  const sourceDirectory = path.join(directory, "src/userscript");
  await mkdir(sourceDirectory, { recursive: true });
  const headerPath = path.join(sourceDirectory, "header.txt");
  const licensePath = path.join(directory, "LICENSE");
  const noticesPath = path.join(directory, "THIRD-PARTY-NOTICES.txt");
  await Promise.all([
    writeFile(headerPath, "@version 1\n"),
    writeFile(licensePath, "License 1\n"),
    writeFile(noticesPath, "Notices 1\n"),
  ]);
  const changes = [];
  const timers = [];
  const watchers = new Map();
  const context = sourceContext("../scripts/watch-userscript-header.js", {
    fs: {
      readFileSync: fs.readFileSync,
      watch(directoryPath, callback) {
        watchers.set(directoryPath, callback);
        return { close: () => watchers.delete(directoryPath) };
      },
    },
    path,
    setTimeout(callback) {
      timers.push(callback);
      return timers.length;
    },
    clearTimeout() {},
  });
  const close = context.watchUserscriptMetadata([headerPath, licensePath, noticesPath], () => changes.push(true));
  t.after(async () => {
    close();
    await rm(directory, { recursive: true, force: true });
  });

  await writeFile(licensePath, "License 2\n");
  watchers.get(directory)("change", "LICENSE");
  timers.at(-1)();
  assert.equal(changes.length, 1);

  await writeFile(noticesPath, "Notices 2\n");
  watchers.get(directory)("change", "THIRD-PARTY-NOTICES.txt");
  timers.at(-1)();
  assert.equal(changes.length, 2);
});
