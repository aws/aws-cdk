import { Runtime } from '../../../aws-lambda';
import { RuntimeDeterminer } from '../../lib/helpers-internal/runtime-determiner';

describe('nodejs runtimes', () => {
  test('selects default runtime', () => {
    // GIVEN
    const runtimes = [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X, Runtime.PYTHON_3_11];

    // WHEN
    const latestRuntime = RuntimeDeterminer.determineLatestNodeJsRuntime(runtimes);

    // THEN
    expect(latestRuntime?.runtimeEquals(RuntimeDeterminer.DEFAULT_RUNTIME)).toEqual(true);
  });

  test('selects latest nodejs runtime', () => {
    // GIVEN
    const runtimes = [Runtime.NODEJS_16_X, Runtime.NODEJS_14_X, Runtime.NODEJS_20_X, Runtime.PYTHON_3_11, Runtime.PYTHON_3_12];

    // WHEN
    const latestRuntime = RuntimeDeterminer.determineLatestNodeJsRuntime(runtimes);

    // THEN
    expect(latestRuntime?.runtimeEquals(Runtime.NODEJS_20_X)).toEqual(true);
  });

  test('returns undefined if no nodejs runtimes specified', () => {
    // GIVEN
    const runtimes = [Runtime.PYTHON_3_10, Runtime.PYTHON_3_11, Runtime.PYTHON_3_12];

    // WHEN
    const latestRuntime = RuntimeDeterminer.determineLatestNodeJsRuntime(runtimes);

    // THEN
    expect(latestRuntime).toBeUndefined;
  });

  test('returns undefined if no runtimes are specified', () => {
    // GIVEN
    const runtimes = [];

    // WHEN
    const latestRuntime = RuntimeDeterminer.determineLatestNodeJsRuntime(runtimes);

    // THEN
    expect(latestRuntime).toBeUndefined;
  });
});

describe('python runtimes', () => {
  test('selects latest python runtime', () => {
    // GIVEN
    const runtimes = [Runtime.PYTHON_3_10, Runtime.PYTHON_3_11, Runtime.PYTHON_3_7];

    // WHEN
    const latestRuntime = RuntimeDeterminer.determineLatestPythonRuntime(runtimes);

    // THEN
    expect(latestRuntime?.runtimeEquals(Runtime.PYTHON_3_11)).toEqual(true);
  });

  test('returns undefined if no python runtimes specified', () => {
    // GIVEN
    const runtimes = [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X, Runtime.NODEJS_20_X];

    // WHEN
    const latestRuntime = RuntimeDeterminer.determineLatestPythonRuntime(runtimes);

    // THEN
    expect(latestRuntime).toBeUndefined;
  });

  test('returns undefined if no runtimes are specified', () => {
    // GIVEN
    const runtimes = [];

    // WHEN
    const latestRuntime = RuntimeDeterminer.determineLatestPythonRuntime(runtimes);

    // THEN
    expect(latestRuntime).toBeUndefined;
  });
});
