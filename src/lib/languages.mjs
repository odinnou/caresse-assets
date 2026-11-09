import languages from '../data/languages.json' with { type: 'json' };

// Keep historical labels/active states; offer new translations only when they exist.
export function languageLinks(links, alternates, localeOf = (link) => link.attrs?.hreflang) {
  const existing = new Set(links.map(localeOf));
  return [...links, ...Object.entries(languages)
    .filter(([locale]) => alternates[locale] && !existing.has(locale))
    .map(([locale, name]) => ({
      tag: 'a', language: locale,
      attrs: { class: 'lang-btn', hreflang: locale, 'aria-label': name },
      html: locale.toUpperCase(),
    }))];
}
