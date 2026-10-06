import assert from "node:assert/strict";
import test from "node:test";
import { headerFixture } from "./header-fixture.js";

function fixture(options) {
  const f = headerFixture(options);
  return { header: f.header, nav: f.native.nav };
}

test("logged-out catalog pages retain navigation without requiring an active tab", () => {
  const { header, nav } = fixture();
  assert.equal(header.className, "site-header");
  assert.equal(nav.parentElement, header.children[0]);
  assert.equal(header.children[1].children.length, 0);
});

test("logged-out public pages do not get a duplicate title", () => {
  const { header } = fixture({ pathname: "/public-page" });
  assert.equal(header.children[1].children.length, 0);
});

test("catalog pages without a title do not abort header creation", () => {
  const { header } = fixture({ loggedOut: false });
  assert.equal(header.className, "site-header");
});

test("logged-in catalog pages retain their active course title", () => {
  const { header } = fixture({ loggedOut: false, title: "Course" });
  assert.equal(header.children[1].children[0].textContent, "Course");
});
