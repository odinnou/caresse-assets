// HTML parsers represent present boolean attributes as ""; Astro needs true.
const booleanAttributes = new Set([
  'allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'controls',
  'default', 'defer', 'disabled', 'formnovalidate', 'hidden', 'inert', 'ismap',
  'itemscope', 'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open',
  'playsinline', 'readonly', 'required', 'reversed', 'selected',
]);

export const htmlAttributes = (attrs = {}) => Object.fromEntries(
  Object.entries(attrs).map(([key, value]) => [key,
    value === '' && booleanAttributes.has(key) ? true : value,
  ]),
);
