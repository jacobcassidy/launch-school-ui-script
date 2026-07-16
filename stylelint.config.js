/**
 * Stylelint configuration.
 *
 * @author Jacob Cassidy <jacob@jacobcassidy.com>
 * @see https://stylelint.io/user-guide/configure/
 * @type {import('stylelint').Config}
 * @version 1.0.0
 */

export default {
  extends: [
    "@cassidydc/stylelint-config-w3c-order",
    "@stylistic/stylelint-config",
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-plugin-logical-css/configs/recommended",
  ],
  plugins: [
    "stylelint-declaration-block-no-ignored-properties",
    "stylelint-plugin-logical-css",
  ],
  ignoreFiles: ["**/*.min.css", "**/build/**", "**/vendor/**"],
  rules: {
    "@stylistic/at-rule-name-space-after": "always",
    "@stylistic/block-closing-brace-newline-before": "always",
    "@stylistic/block-opening-brace-newline-after": "always",
    "@stylistic/block-opening-brace-space-before": "always",
    "@stylistic/declaration-block-semicolon-newline-after": "always",
    "alpha-value-notation": "number",
    "color-named": "never",
    "custom-property-pattern": [
      "^([a-z][a-z0-9]*)(--?[a-z0-9]+)*$",
      {
        message: "Expected custom property name to be kebab-case (double dashes are allowed)",
      },
    ],
    "declaration-empty-line-before": ["never", { except: ["after-block"] }],
    "declaration-property-value-keyword-no-deprecated": true,
    "font-family-no-missing-generic-family-keyword": [
      true,
      {
        ignoreFontFamilies: [
          "dashicons",
          "FontAwesome",
        ],
      },
    ],
    "font-weight-notation": "numeric",
    "function-linear-gradient-no-nonstandard-direction": true,
    "number-max-precision": 5,
    "plugin/declaration-block-no-ignored-properties": true,
    "rule-empty-line-before": ["always", { ignore: ["first-nested"], except: ["after-single-line-comment"] }],
    "scss/selector-no-redundant-nesting-selector": true,

    // TURN OFF RULES
    "@stylistic/declaration-colon-newline-after": null,
    "@stylistic/max-line-length": null,
    "comment-empty-line-before": null,
    "no-descending-specificity": null,
    "selector-class-pattern": null,
  },
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
};
