import { namespaces } from '../lib/index';

test('namespaces() includes some namespaces', () => {
  expect(namespaces().length).toBeGreaterThan(10);
});
