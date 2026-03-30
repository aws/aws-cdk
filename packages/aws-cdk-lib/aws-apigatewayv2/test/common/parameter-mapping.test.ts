import { ParameterMapping } from '../../lib';

test('custom() with __proto__ key does not pollute prototype', () => {
  const mapping = new ParameterMapping();
  const before = Object.getOwnPropertyNames(Object.prototype).sort().join(',');
  mapping.custom('__proto__', 'evil');
  const after = Object.getOwnPropertyNames(Object.prototype).sort().join(',');
  expect(after).toEqual(before);
});
