import fs from "node:fs";
import path from "node:path";

export function watchUserscriptHeader(headerPath, onChange) {
  let headerContents = fs.readFileSync(headerPath, "utf8");
  let changeTimeout;

  const watcher = fs.watch(path.dirname(headerPath), (_eventType, filename) => {
    if (filename && filename.toString() !== path.basename(headerPath)) return;

    clearTimeout(changeTimeout);

    changeTimeout = setTimeout(() => {
      let nextHeaderContents;
      try {
        nextHeaderContents = fs.readFileSync(headerPath, "utf8");
      } catch {
        return;
      }
      if (nextHeaderContents === headerContents) return;
      headerContents = nextHeaderContents;
      onChange();
    }, 100);
  });

  return () => {
    clearTimeout(changeTimeout);
    watcher.close();
  };
}
