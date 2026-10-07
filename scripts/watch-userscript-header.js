import fs from "node:fs";
import path from "node:path";

export function watchUserscriptMetadata(filePaths, onChange) {
  const files = new Map(filePaths.map((filePath) => [path.resolve(filePath), fs.readFileSync(filePath, "utf8")]));
  const directories = new Map();
  let changeTimeout;

  for (const filePath of files.keys()) {
    const directory = path.dirname(filePath);
    if (!directories.has(directory)) directories.set(directory, new Set());
    directories.get(directory).add(path.basename(filePath));
  }

  const scheduleUpdate = () => {
    clearTimeout(changeTimeout);

    changeTimeout = setTimeout(() => {
      let changed = false;
      for (const [filePath, currentContents] of files) {
        let nextContents;
        try {
          nextContents = fs.readFileSync(filePath, "utf8");
        } catch {
          continue;
        }
        if (nextContents === currentContents) continue;
        files.set(filePath, nextContents);
        changed = true;
      }
      if (changed) onChange();
    }, 100);
  };

  const watchers = [...directories].map(([directory, names]) =>
    fs.watch(directory, (_eventType, filename) => {
      if (filename && !names.has(filename.toString())) return;
      scheduleUpdate();
    }),
  );

  return () => {
    clearTimeout(changeTimeout);
    watchers.forEach((watcher) => watcher.close());
  };
}
