import { en } from './en';

// Object.keys widens to string[]; the keys come from en.screens itself.
const SCREEN_ROUTES = Object.keys(en.screens) as (keyof typeof en.screens)[];

test('every screen name is non-empty', () => {
  for (const route of SCREEN_ROUTES) {
    expect(en.screens[route]).toMatch(/\S/);
  }
});
