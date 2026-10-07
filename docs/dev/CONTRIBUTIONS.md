# Contributing

Use Node.js 24 or later and npm. The supported Node version is declared in `package.json`, and `.nvmrc` selects the current major version.

The npm package metadata identifies the local build tooling. Its version is independent of the userscript release documented in `CHANGELOG.md`; the userscript install version is declared in `src/userscript/header.txt`.

## Set up the project

```sh
npm ci
npx lefthook install
```

Lefthook installs the repository's pre-commit checks. It runs ESLint, Stylelint, Markdownlint, and Prettier on staged files.

## Validate and build

```sh
npm test
npm run check
npm run lint:scripts
npm run lint:styles
npm run lint:docs
npm run build
```

`npm test` builds the userscript and runs the test suite. `npm run build` writes the installable bundle to `dist/js/index.min.js` after a successful build. Use `npm run watch` during development; it writes an unminified bundle to `.dev-dist/js/index.js` and leaves the installable bundle untouched.

## Contribute changes

Fork the repository, create a branch from `dev`, and open a pull request targeting `dev`.
