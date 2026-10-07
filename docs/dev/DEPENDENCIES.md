# Development dependency advisories

Reviewed on 2026-10-08. These dependencies belong to the development tooling and are not included in the distributed userscript.

## Resolved

- `source-map-js` is locked to 1.2.2, which fixes [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). This version is within the ranges required by PostCSS and CSS Tree.
- `smol-toml` is overridden to 1.9.0 specifically under `markdownlint-cli2`, fixing [GHSA-r4xh-jqrq-34v2](https://github.com/advisories/GHSA-r4xh-jqrq-34v2). Markdownlint CLI2 0.23.3 pins 1.8.0 exactly, so updating the lockfile alone would not resolve the advisory. The patched version was verified through the CLI's TOML configuration loading. Remove the override when Markdownlint CLI2 accepts a patched version itself.

## Pending upstream updates

- `braces` 3.0.3, used through Micromatch, is affected by [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). The advisory currently lists no patched release. Deeply nested brace patterns can exhaust the stack. Revisit this entry when a patched release or a compatible upstream replacement becomes available.
- `katex` 0.16.47, used through Markdownlint's math parser, is affected by [GHSA-238p-pmpm-9mq7](https://github.com/advisories/GHSA-238p-pmpm-9mq7). The fix is in 0.18.2, outside the math parser's current `^0.16.0` range. The advisory requires existing prototype pollution and rendering affected output into a web page without separate sanitization; that exploit path has not been demonstrated in this project's linting workflow. Revisit when the upstream parser accepts the patched release, or evaluate a separate override with compatibility checks.

## Checking status

Run `npm audit` to check the complete tooling dependency tree and `npm audit --omit=dev` to check production dependencies. Audit totals include dependent packages affected by the same underlying advisory and do not represent distinct vulnerabilities.

After this update, the audit reports 20 affected development dependency entries (17 high and 3 low), originating from the two pending advisories above. The production-only audit reports zero. These counts are a dated snapshot; rerun the audit after future dependency updates. Avoid automatic forced fixes that downgrade or change the linting stack without compatibility checks.
