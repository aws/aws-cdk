import { Runtime } from '../../../aws-lambda';
import { RuntimeDeterminer } from '../../lib/utils/runtime-determiner';

const DEFAULT_RUNTIME = Runtime.NODEJS_LATEST;

describe('latest runtime', () => {
  test('selects default runtime', () => {
    // GIVEN
    const runtimes = [Runtime.NODEJS_16_X, Runtime.PYTHON_3_12, Runtime.NODEJS_18_X];

    // WHEN
    const latestRuntime = RuntimeDeterminer.determineLatestRuntime(DEFAULT_RUNTIME, runtimes);

    // THEN
    expect(latestRuntime?.runtimeEquals(DEFAULT_RUNTIME)).toEqual(true);
  });

  test('selects latest nodejs runtime', () => {
    // GIVEN
    const runtimes = [Runtime.NODEJS_16_X, Runtime.PYTHON_3_12, Runtime.NODEJS_14_X, Runtime.PYTHON_3_11, Runtime.NODEJS_20_X];

    // WHEN
    const latestRuntime = RuntimeDeterminer.determineLatestRuntime(DEFAULT_RUNTIME, runtimes);

    // THEN
    expect(latestRuntime?.runtimeEquals(Runtime.NODEJS_20_X)).toEqual(true);
  });

  test('selects latest python runtime', () => {
    // GIVEN
    const runtimes = [Runtime.PYTHON_3_10, Runtime.PYTHON_3_11, Runtime.PYTHON_3_7];

    // WHEN
    const latestRuntime = RuntimeDeterminer.determineLatestRuntime(DEFAULT_RUNTIME, runtimes);

    // THEN
    expect(latestRuntime?.runtimeEquals(Runtime.PYTHON_3_11)).toEqual(true);
  });

  test('throws if no runtimes are specified', () => {
    // GIVEN
    const runtimes = [];

    // WHEN / THEN
    expect(() => {
      RuntimeDeterminer.determineLatestRuntime(DEFAULT_RUNTIME, runtimes);
    }).toThrow('You must specify at least one compatible runtime');
  });

  test('throws if latest nodejs runtime is deprecated', () => {
    // GIVEN
    const runtimes = [Runtime.NODEJS_12_X, Runtime.NODEJS_14_X];

    // WHEN / THEN
    expect(() => {
      RuntimeDeterminer.determineLatestRuntime(DEFAULT_RUNTIME, runtimes);
    }).toThrow(`Latest nodejs runtime ${Runtime.NODEJS_14_X} is deprecated. You must upgrade to the latest code compatible nodejs runtime`);
  });

  test('throws if latest python runtime is deprecated', () => {
    // GIVEN
    const runtimes = [Runtime.PYTHON_2_7, Runtime.PYTHON_3_6];

    // WHEN / THEN
    expect(() => {
      RuntimeDeterminer.determineLatestRuntime(DEFAULT_RUNTIME, runtimes);
    }).toThrow(`Latest python runtime ${Runtime.PYTHON_3_6} is deprecated. You must upgrade to the latest code compatible python runtime`);
  });

  test('throws if runtimes are neither nodejs nor python', () => {
    // GIVEN
    const runtimes = [Runtime.JAVA_17, Runtime.RUBY_3_2];

    // WHEN / THEN
    expect(() => {
      RuntimeDeterminer.determineLatestRuntime(DEFAULT_RUNTIME, runtimes);
    }).toThrow('Compatible runtimes must contain only nodejs or python runtimes');
  });
});
