# Styles

CSS custom properties are defined in [`src/css/base/variables.css`](../../src/css/base/variables.css). Use those definitions as the source of truth for exact values.

## Color properties

| Group      | Custom properties                                                                    | Notes                                                            |
| ---------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Background | `--background-color--100` through `--background-color--900`                          | Nine neutral background levels.                                  |
| Border     | `--border-color--100` through `--border-color--900`                                  | Nine neutral border levels.                                      |
| Blue       | `--color--blue-100` through `--color--blue-900`, `--color--blue-alpha`               | Blue accent scale.                                               |
| Brand      | `--color--brand-100` through `--color--brand-900`, `--color--brand-alpha`            | Brand accent scale; `400` is the default and `500` is dark.      |
| Grayscale  | `--color--grayscale-100`, `150`, and `200` through `900`; `--color--grayscale-alpha` | Neutral text and surface scale, including the extra `150` level. |
| Green      | `--color--green-100` through `--color--green-900`, `--color--green-alpha`            | Green status scale.                                              |
| Flash      | `--flash--background-color`                                                          | Highlight background used by the flash effect.                   |

## Other properties

| Group         | Custom properties                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Border radius | `--border-radius--default`                                                                                                                       |
| Box shadows   | `--box-shadow--input`, `--box-shadow--modal`                                                                                                     |
| Font families | `--font-family--primary`, `--font-family--secondary`, `--font-family--mono`                                                                      |
| Sizing        | `--size--header--height`, `--size--mw900--padding-inline`, `--size--sidebar--padding-inline`, `--size--sidebar--width`, `--size--spacing-inline` |
| Timing        | `--timing--long`, `--timing--short`                                                                                                              |
| Transitions   | `--transition--long`, `--transition--short`                                                                                                      |

Some sizing values change with the viewport or sidebar state; those overrides are also defined in `variables.css`.
