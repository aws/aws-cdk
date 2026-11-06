import { lit } from '../../lib/helpers-internal';

test('literal string with more than one compontent throws', () => {
  const v = 'v';

  // These lines below don't compile, but even with typecasting away they throw
  expect(() => (lit as any)`some${v}`).toThrow(/String literal may not contain any variables/);
  expect(() => (lit as any)`${v}`).toThrow(/String literal may not contain any variables/);
});
