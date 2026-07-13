/**
 * Prettier configuration.
 *
 * @author Jacob Cassidy <contact@jacobcassidy.com>
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 * @version 1.0.0
 */

const config = {
  printWidth: 120,
  plugins: ["prettier-plugin-multiline-arrays"], // Keeps arrays formatted as is by default
  overrides: [
    {
      files: "*.{css,less,sass,scss}",
      options: {
        printWidth: 600, // To not break long selector combinations
      },
    },
    {
      files: "*.{json,jsonc,json5}",
      options: {
        // Always put object properties and array items on a newline
        printWidth: 1,
        bracketSpacing: false,
        trailingComma: "none",
      },
    },
  ],
};

export default config;
