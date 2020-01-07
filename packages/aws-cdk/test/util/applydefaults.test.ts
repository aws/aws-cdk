import { applyDefaults } from '../../lib/util';

test('applyDefaults() works', () => {
  const given = { a: 1 };
  const defaults = { a: 2, b: 2 };

  const output = applyDefaults(given, defaults);

  expect(output).toEqual({ a: 1, b: 2 });
});
