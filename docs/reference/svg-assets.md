# SVG assets

SVG files imported by source code live under [`src/svg`](../../src/svg). Only referenced files are included in the userscript build.

The files under [`src/svg/reference`](../../src/svg/reference) are retained icon alternatives and older assets that have no import or CSS URL reference in the current source. They are kept for reference and do not enter the build unless source code imports them. Move an asset out of this folder when adopting it.

The reference folder contains the Launch School logo asset as well as unused Lucide icons. The project does not record the exact source revision for the vendored Lucide files; see [third-party notices](../../THIRD-PARTY-NOTICES.txt) for license details.
