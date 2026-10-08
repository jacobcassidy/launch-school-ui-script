import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const variables = readFileSync(new URL("../src/css/base/variables.css", import.meta.url), "utf8");
const sidebar = readFileSync(new URL("../src/css/parts/sidebar.css", import.meta.url), "utf8");
const settings = readFileSync(new URL("../src/css/components/settings.css", import.meta.url), "utf8");
const header = readFileSync(new URL("../src/css/parts/header.css", import.meta.url), "utf8");

function luminance(token) {
  const match = variables.match(new RegExp(`${token}: oklch\\(([\\d.]+) 0 0\\)`));
  assert.ok(match, `Expected neutral OKLCH token ${token}`);
  return Number(match[1]) ** 3;
}

function contrast(foreground, background) {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

test("small functional labels meet the 4.5:1 contrast target", () => {
  assert.match(sidebar, /\.sidebar-list-toggle-btn\s*\{[^}]*color: var\(--color--grayscale-600\)/s);
  assert.match(settings, /\.settings-section__header\s*\{[^}]*color: var\(--color--grayscale-600\)/s);
  assert.match(header, /\.gretel-breadcrumbs,\s*\.title-text\s*\{[^}]*color: var\(--color--grayscale-600\)/s);

  assert.ok(contrast("--color--grayscale-600", "--background-color--300") >= 4.5);
  assert.ok(contrast("--color--grayscale-600", "--background-color--400") >= 4.5);
});
