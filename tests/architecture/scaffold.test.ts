import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, resolve, sep } from 'path';
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

function screenRouteFilesIn(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return screenRouteFilesIn(path);
    if (!name.endsWith('.tsx') || name === '_layout.tsx') return [];
    return [relative(join(ROOT, 'app'), path).slice(0, -'.tsx'.length).split(sep).join('/')];
  });
}

describe('routes', () => {
  test('the route files in app/ and the keys in en.screens are the same set', () => {
    expect(screenRouteFilesIn(join(ROOT, 'app')).sort()).toEqual([...SCREEN_ROUTES].sort());
  });

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
