import { Runtime } from '../../../aws-lambda';
import { RuntimeDeterminer } from '../../lib/helpers-internal/runtime-determiner';

describe('nodejs runtimes', () => {
  test('selects default runtime', () => {
    // GIVEN
    const runtimes = [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X, Runtime.PYTHON_3_11];

    // WHEN
    const latestRuntime = RuntimeDeterminer.latestNodeJsRuntime(runtimes);

    // THEN
    expect(latestRuntime?.runtimeEquals(RuntimeDeterminer.DEFAULT_RUNTIME)).toEqual(true);
  });

  test('selects latest nodejs runtime', () => {
    // GIVEN
    const runtimes = [Runtime.NODEJS_16_X, Runtime.NODEJS_14_X, Runtime.NODEJS_20_X, Runtime.PYTHON_3_11, Runtime.PYTHON_3_12];

    // WHEN
    const latestRuntime = RuntimeDeterminer.latestNodeJsRuntime(runtimes);

    // THEN
    expect(latestRuntime?.runtimeEquals(Runtime.NODEJS_20_X)).toEqual(true);
  });

  test('returns undefined if no runtimes are specified', () => {
    // GIVEN
    const runtimes = [];

    // WHEN
    const latestRuntime = RuntimeDeterminer.latestNodeJsRuntime(runtimes);

    // THEN
    expect(latestRuntime).toBeUndefined;
  });

  test('throws if not all runtimes are nodejs', () => {
    // GIVEN
    const runtimes = [Runtime.NODEJS_16_X, Runtime.PYTHON_3_11, Runtime.NODEJS_18_X];

    // WHEN / THEN
    expect(() => {
      RuntimeDeterminer.latestNodeJsRuntime(runtimes);
    }).toThrow('All runtime familys must be the same when determining latest runtime. Found runtime family python, expected nodejs');
  });
});

describe('python runtimes', () => {
  test('selects latest python runtime', () => {
    // GIVEN
    const runtimes = [Runtime.PYTHON_3_10, Runtime.PYTHON_3_11, Runtime.PYTHON_3_7];

    // WHEN
    const latestRuntime = RuntimeDeterminer.latestPythonRuntime(runtimes);

    // THEN
    expect(latestRuntime?.runtimeEquals(Runtime.PYTHON_3_11)).toEqual(true);
  });

  test('returns undefined if no runtimes are specified', () => {
    // GIVEN
    const runtimes = [];

    // WHEN
    const latestRuntime = RuntimeDeterminer.latestPythonRuntime(runtimes);

    // THEN
    expect(latestRuntime).toBeUndefined;
  });

  test('throws if not all runtimes are python', () => {
    // GIVEN
    const runtimes = [Runtime.PYTHON_3_11, Runtime.NODEJS_18_X, Runtime.PYTHON_3_12];

    // WHEN / THEN
    expect(() => {
      RuntimeDeterminer.latestPythonRuntime(runtimes);
    }).toThrow('All runtime familys must be the same when determining latest runtime. Found runtime family nodejs, expected python');
  });
});
