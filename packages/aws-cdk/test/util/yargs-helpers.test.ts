import { isCI } from '../../lib/util/yargs-helpers';

test.each([
  ['true', true],
  ['1', true],
  ['false', false],
  ['0', false],
  // The following ones are unexpected but this is the legacy behavior we're preserving.
  ['banana', true],
  ['', true],
])('test parsing of falsey CI values: %p parses as %p', (envvar, ci) => {
  process.env.CI = envvar;
  expect(isCI()).toEqual(ci);
});
