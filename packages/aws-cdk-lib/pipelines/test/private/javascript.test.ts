import { mapValues } from '../../lib/private/javascript';

test('mapValues with __proto__ key does not pollute prototype', () => {
  const input = Object.create(null);
  input['__proto__'] = 'evil';
  input.normal = 'ok';
  const before = Object.getOwnPropertyNames(Object.prototype).sort().join(',');
  const result = mapValues(input, (x: string) => x);
  const after = Object.getOwnPropertyNames(Object.prototype).sort().join(',');
  expect(after).toEqual(before);
  expect(result['__proto__']).toBe('evil');
  expect(result.normal).toBe('ok');
});
