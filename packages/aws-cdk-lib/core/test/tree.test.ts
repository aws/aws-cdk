import { TreeInspector } from '../lib';

test('addAttribute with __proto__ does not pollute prototype', () => {
  const inspector = new TreeInspector();
  const before = Object.getOwnPropertyNames(Object.prototype).sort().join(',');
  inspector.addAttribute('__proto__', 'evil');
  const after = Object.getOwnPropertyNames(Object.prototype).sort().join(',');
  expect(after).toEqual(before);
});
