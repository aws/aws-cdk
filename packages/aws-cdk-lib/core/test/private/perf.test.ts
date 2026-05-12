import * as fs from 'fs';
import { performance } from 'perf_hooks';
import { profileClass, profileFn, profileObj, readPerfCounters } from '../../lib/private/perf';

beforeEach(() => {
  performance.clearMeasures();
});

test('functions can be instrumented', () => {
  // GIVEN
  const fn = profileFn('fn')(() => {});

  // WHEN
  fn();

  // THEN
  expect(readPerfCounters()).toMatchObject({
    fn: {
      count: 1,
      total: expect.anything(),
    },
  });
});

test('only top-level profiled function calls are recorded', () => {
  // GIVEN
  const inner = profileFn('inner')(() => {});
  const outer = profileFn('outer')(() => {
    inner();
  });

  // WHEN
  outer();

  // THEN
  const ctrs = readPerfCounters();
  expect(ctrs).toMatchObject({ outer: expect.anything() });
  expect(ctrs).not.toMatchObject({ inner: expect.anything() });
});

test('fs can be monkey-patched', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  profileObj('fs')(require('fs'));

  // GIVEN
  console.log(fs.readFileSync);
  fs.readFileSync(__filename, 'utf-8');

  // THEN
  const ctrs = readPerfCounters();
  expect(ctrs).toMatchObject({ 'fs.readFileSync': expect.anything() });
});

test('classes can be instrumented', () => {
  const SomeClass = profileClass(class SomeClass {
    public method() {
    }
  });

  new SomeClass().method();

  // THEN
  const ctrs = readPerfCounters();
  expect(ctrs).toMatchObject({ 'SomeClass.method': expect.anything() });
});

test('readPerfCounters can select only telemetry profilings', () => {
  // GIVEN
  const yes = profileFn('yes', { telemetry: true })(() => {});
  const no = profileFn('no')(() => {});

  // WHEN
  yes();
  no();

  // THEN
  const ctrs = readPerfCounters({ telemetry: true });
  expect(ctrs).toMatchObject({ yes: expect.anything() });
  expect(ctrs).not.toMatchObject({ no: expect.anything() });
});

test('readPerfCounters can select all profilings', () => {
  // GIVEN
  const yes = profileFn('yes', { telemetry: true })(() => {});
  const no = profileFn('no')(() => {});

  // WHEN
  yes();
  no();

  // THEN
  const ctrs = readPerfCounters();
  expect(ctrs).toMatchObject({
    yes: expect.anything(),
    no: expect.anything(),
  });
});
