import assert from "node:assert/strict";
import test from "node:test";
import { sourceContext } from "./source-context.js";

function fixture() {
  const observers = [];
  const pending = new Map();
  const notify = (target, type) => {
    for (const observer of observers) {
      const options = observer.targets.get(target);
      if (options && ((type === "class" && options.attributes) || (type === "children" && options.childList))) {
        const records = pending.get(observer) || [];
        records.push({
          target,
          type: type === "class" ? "attributes" : "childList",
          attributeName: type === "class" ? "class" : null,
        });
        pending.set(observer, records);
      }
    }
  };
  const node = (kind) => {
    const classes = new Set();
    const el = {
      kind,
      dataset: {},
      children: [],
      classList: {
        add(...names) {
          names.forEach((name) => classes.add(name));
          notify(el, "class");
        },
        remove(name) {
          classes.delete(name);
          notify(el, "class");
        },
        contains: (name) => classes.has(name),
      },
      querySelectorAll(selector) {
        assert.equal(selector, ":scope > .is-new-icon");
        return this.children.filter((child) => child.classList.contains("is-new-icon"));
      },
      prepend(child) {
        child.parent = this;
        this.children.unshift(child);
        notify(this, "children");
      },
      remove() {
        if (!this.parent) return;
        const parent = this.parent;
        parent.children.splice(parent.children.indexOf(this), 1);
        this.parent = null;
        notify(parent, "children");
      },
      replaceChildren(...children) {
        this.children.forEach((child) => (child.parent = null));
        this.children = children;
        children.forEach((child) => (child.parent = this));
        notify(this, "children");
      },
    };
    return el;
  };
  const button = node("button");
  const collapse = node("collapse");
  const label = node("label");
  const nativeIcon = node("native-svg");
  const wrapper = node("native-wrapper");
  const nestedIcon = node("nested-svg");
  nestedIcon.classList.add("is-new-icon");
  wrapper.prepend(nestedIcon);
  button.replaceChildren(label, nativeIcon, wrapper);

  const globals = {
    document: { querySelector: () => collapse },
    MutationObserver: class {
      constructor(callback) {
        this.callback = callback;
        this.targets = new Map();
        observers.push(this);
      }
      observe(target, options) {
        this.targets.set(target, options);
      }
    },
  };
  const flush = () => {
    let deliveries = 0;
    while (pending.size) {
      assert.ok(deliveries++ < 10, "Icon changes must settle without an observer loop");
      const batch = [...pending];
      pending.clear();
      batch.forEach(([observer, records]) => observer.callback(records));
    }
  };
  const icons = () => button.children.filter((child) => ["run", "stop", "eye", "eye-off"].includes(child.kind));
  const injectIcons = (...kinds) => {
    kinds.forEach((kind) => {
      const icon = node(kind);
      icon.classList.add("is-new-icon");
      button.prepend(icon);
    });
  };
  const assertNativeContent = () => {
    for (const child of [label, nativeIcon, wrapper]) assert.ok(button.children.includes(child));
    assert.equal(wrapper.children[0], nestedIcon);
  };
  return {
    button,
    collapse,
    label,
    nativeIcon,
    wrapper,
    node,
    globals,
    observers,
    flush,
    icons,
    injectIcons,
    assertNativeContent,
  };
}

test("run-code transitions keep one correct icon and preserve native content", () => {
  const f = fixture();
  f.injectIcons("run");
  const context = sourceContext("../src/js/modules/utils/watch/buttons/run-code.js", f.globals);
  context.watchRunCodeBtn(
    f.button,
    () => f.node("run"),
    () => f.node("stop"),
  );
  context.watchRunCodeBtn(
    f.button,
    () => f.node("run"),
    () => f.node("stop"),
  );
  assert.equal(f.observers.length, 1);

  for (let i = 0; i < 12; i++) {
    const isStopped = i % 2 === 0;
    f.button.classList[isStopped ? "add" : "remove"]("stop-button");
    f.flush();
    assert.equal(f.icons().length, 1);
    assert.equal(f.icons()[0].kind, isStopped ? "stop" : "run");
    f.assertNativeContent();
    const icon = f.icons()[0];
    f.button.classList.add("unrelated");
    f.flush();
    assert.equal(f.icons()[0], icon);
  }
});

test("run-code watcher handles initial stop state and native content replacement", () => {
  const f = fixture();
  f.injectIcons("run");
  f.button.classList.add("stop-button");
  const context = sourceContext("../src/js/modules/utils/watch/buttons/run-code.js", f.globals);
  context.watchRunCodeBtn(
    f.button,
    () => f.node("run"),
    () => f.node("stop"),
  );
  assert.equal(f.icons()[0].kind, "stop");
  const replacementLabel = f.node("replacement-label");
  f.button.replaceChildren(replacementLabel, f.nativeIcon, f.wrapper);
  f.flush();
  assert.equal(f.icons().length, 1);
  assert.equal(f.icons()[0].kind, "stop");
  assert.ok(f.button.children.includes(replacementLabel));
  assert.ok(f.button.children.includes(f.nativeIcon));
});

test("solution toggles retain one icon pair without altering native content", () => {
  const f = fixture();
  f.injectIcons("eye-off", "eye");
  const context = sourceContext("../src/js/modules/utils/watch/buttons/solution.js", f.globals);
  const factories = [() => f.node("eye-off"), () => f.node("eye")];
  context.watchViewSolutionBtn(f.button, factories);
  context.watchViewSolutionBtn(f.button, factories);
  assert.equal(f.observers.length, 1);
  const pair = f.icons();
  assert.deepEqual(pair.map((icon) => icon.kind).sort(), ["eye", "eye-off"]);

  for (let i = 0; i < 12; i++) {
    f.collapse.classList[i % 2 === 0 ? "add" : "remove"]("open");
    f.collapse.classList.add("unrelated");
    f.flush();
    assert.deepEqual(f.icons(), pair);
    f.assertNativeContent();
  }
});

test("solution icon pair is restored after partial removal or native content replacement", () => {
  const f = fixture();
  f.injectIcons("eye-off", "eye");
  const context = sourceContext("../src/js/modules/utils/watch/buttons/solution.js", f.globals);
  context.watchViewSolutionBtn(f.button, [() => f.node("eye-off"), () => f.node("eye")]);
  f.icons()[0].remove();
  f.flush();
  assert.deepEqual(
    f
      .icons()
      .map((icon) => icon.kind)
      .sort(),
    ["eye", "eye-off"],
  );
  f.assertNativeContent();

  f.button.replaceChildren(f.label, f.nativeIcon, f.wrapper);
  f.flush();
  assert.deepEqual(
    f
      .icons()
      .map((icon) => icon.kind)
      .sort(),
    ["eye", "eye-off"],
  );
  f.assertNativeContent();
});
