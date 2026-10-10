import assert from "node:assert/strict";
import test from "node:test";
import { Window } from "happy-dom";
import { sourceContext } from "./source-context.js";

function fixture() {
  const window = new Window();
  const { document } = window;
  document.body.innerHTML = `
    <header><div class="container-1"></div><div class="container-2"></div><div class="container-3"></div></header>
  `;
  const header = document.querySelector("header");
  const left = header.querySelector(".container-1");
  const right = header.querySelector(".container-3");
  const sizes = { header: 640, left: 28, right: 96, gap: 24 };
  Object.defineProperty(header, "clientWidth", { get: () => sizes.header });
  left.getBoundingClientRect = () => ({ width: sizes.left });
  right.getBoundingClientRect = () => ({ width: sizes.right });
  const observers = [];
  const api = sourceContext("../src/js/modules/components/header-layout.js", {
    getComputedStyle: () => ({ paddingInlineStart: "12px", paddingInlineEnd: "12px", columnGap: `${sizes.gap}px` }),
    ResizeObserver: class {
      constructor(callback) {
        this.callback = callback;
        this.elements = [];
        this.disconnected = false;
        observers.push(this);
      }
      observe(element) {
        this.elements.push(element);
      }
      disconnect() {
        this.disconnected = true;
      }
    },
  });
  api.watchHeaderLayout(header);
  return { header, left, right, sizes, observers, api };
}

test("header reserves the wider side and updates when controls or responsive spacing change", () => {
  const f = fixture();
  assert.equal(f.header.style.getPropertyValue("--header-side-width"), "96px");
  assert.deepEqual(f.observers[0].elements, [f.header, f.left, f.right]);
  assert.equal(f.header.classList.contains("is-crowded"), false);

  f.sizes.left = 180.25;
  f.observers[0].callback();
  assert.equal(f.header.style.getPropertyValue("--header-side-width"), "181px");

  f.sizes.header = 440;
  f.sizes.gap = 32;
  f.observers[0].callback();
  assert.equal(f.header.classList.contains("is-crowded"), true);

  f.sizes.left = 28;
  f.sizes.right = 28;
  f.api.watchHeaderLayout(f.header);
  assert.equal(f.header.style.getPropertyValue("--header-side-width"), "28px");
  assert.equal(f.header.classList.contains("is-crowded"), false);
  assert.equal(f.observers.length, 1);
});

test("header hides the center exactly when its reserved gaps exhaust the space, and restores it on resize", () => {
  const f = fixture();
  f.sizes.header = 264; // 24px padding + 2 × 96px controls + 2 × 24px gaps.
  f.observers[0].callback();
  assert.equal(f.header.classList.contains("is-crowded"), true);
  f.sizes.header++;
  f.observers[0].callback();
  assert.equal(f.header.classList.contains("is-crowded"), false);
});

test("header observers disconnect for cached or removed headers and can bind a restored header", () => {
  const f = fixture();
  f.api.disconnectHeaderLayout(f.header);
  assert.equal(f.observers[0].disconnected, true);
  f.api.watchHeaderLayout(f.header);
  assert.equal(f.observers.length, 2);
  f.header.remove();
  f.observers[1].callback();
  assert.equal(f.observers[1].disconnected, true);
});
