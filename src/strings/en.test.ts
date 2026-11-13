import { en } from './en';

const SCREEN_ROUTES = [
  'index',
  'settings',
  'inspect/rc',
  'inspect/use',
  'inspect/photos',
  'inspect/engine',
  'inspect/drive',
  'inspect/control',
  'result',
  'slip',
  'purchase',
  'settle/[id]',
] as const;

test('every route has a screen name', () => {
  for (const route of SCREEN_ROUTES) {
    expect(en.screens[route]).toMatch(/\S/);
  }
});
