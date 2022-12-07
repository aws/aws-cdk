import { isVersionBetween } from '../lib/platform-warnings';


test.each([
  ['2.1', false],
  ['2.2', true],
  ['2', false],
  ['3', true],
  ['4', false],
  ['4.3', true],
  ['4.3', true],
  ['4.2.294-220.533.amzn2.x86_64', true],
])('%p is in range: %p', (version, expected) => {
  expect(isVersionBetween(version, '2.1.0.6', '4.9.2')).toEqual(expected);
});