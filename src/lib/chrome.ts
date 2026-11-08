const files = import.meta.glob('../data/chrome/*.json', { eager: true, import: 'default' });

export default Object.fromEntries(Object.entries(files).map(([path, value]) => [
  path.split('/').pop()!.replace(/\.json$/, ''), value,
]));
