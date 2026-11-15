import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { en } from '../../src/strings/en';

const ROOT = resolve(__dirname, '../..');

const SCREEN_ROUTES = Object.keys(en.screens);

const LAYOUT_FILES = ['app/_layout.tsx', 'app/inspect/_layout.tsx'] as const;

const EMPTY_FOLDERS = [
  'src/domain/scoring',
  'src/domain/pricing',
  'src/domain/inspection',
  'src/domain/deals',
  'src/domain/slip',
  'src/data/db',
  'src/data/rules',
  'src/data/pdf',
  'src/ui/theme',
  'src/ui/components',
  'src/state',
  'src/types',
  'scripts',
] as const;

function readOrEmpty(relativePath: string): string {
  const path = join(ROOT, relativePath);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

describe('routes', () => {
  test.each(SCREEN_ROUTES)('app/%s.tsx exists', (route) => {
    expect(existsSync(join(ROOT, 'app', `${route}.tsx`))).toBe(true);
  });

  test.each(SCREEN_ROUTES)('app/%s.tsx shows its name from en.screens', (route) => {
    expect(readOrEmpty(`app/${route}.tsx`)).toContain(`en.screens['${route}']`);
  });

  test.each(LAYOUT_FILES)('%s exists', (file) => {
    expect(existsSync(join(ROOT, file))).toBe(true);
  });
});

describe('folders', () => {
  test.each(EMPTY_FOLDERS)('%s has a one-line README', (folder) => {
    const lines = readOrEmpty(`${folder}/README.md`).trim().split('\n');
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/\S/);
  });
});
