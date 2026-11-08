import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function readInventory(root = process.cwd()) {
  const directory = join(root, 'src/data/sitemap');
  return readdirSync(directory).filter((file) => file.endsWith('.json')).sort()
    .flatMap((file) => JSON.parse(readFileSync(join(directory, file), 'utf8')));
}

export function writeInventory(root, entries) {
  const directory = join(root, 'src/data/sitemap');
  mkdirSync(directory, { recursive: true });
  for (const file of readdirSync(directory).filter((file) => file.endsWith('.json'))) rmSync(join(directory, file));
  for (let start = 0; start < entries.length; start += 20) {
    writeFileSync(join(directory, String(start / 20).padStart(2, '0') + '.json'), JSON.stringify(entries.slice(start, start + 20), null, 2) + '\n');
  }
}
