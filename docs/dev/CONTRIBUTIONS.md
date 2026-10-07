# Contributing

Use Node.js 24 or later and npm. The supported Node version is declared in `package.json`, and `.nvmrc` selects the current major version.

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

`npm test` builds the userscript and runs the test suite. `npm run build` writes the installable bundle to `dist/js/index.min.js`. Use `npm run watch` during development to rebuild as source files change.

## Contribute changes

Fork the repository, create a branch from `dev`, and open a pull request targeting `dev`.
