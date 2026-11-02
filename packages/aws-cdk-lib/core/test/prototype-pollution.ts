export function assertNoPrototypePollution(block: () => void) {
  const before = Object.getOwnPropertyNames(Object.prototype).sort().join(',');

  block();

  // THEN
  const after = Object.getOwnPropertyNames(Object.prototype).sort().join(',');
  expect(after).toEqual(before);
}
