import { Runtime, RuntimeFamily } from '../../../aws-lambda';
import { latestNodejsRuntime, latestPythonRuntime } from '../helpers-internal';

export abstract class CdkFunctionBase {
  private static readonly DEFAULT_RUNTIME = Runtime.NODEJS_LATEST;

  public determineRuntime(compatibleRuntimes: Runtime[]) {
    if (compatibleRuntimes.length === 0) {
      throw new Error('`code` must specify at least one compatible runtime');
    }

    // check for default runtime
    if (compatibleRuntimes.some(runtime => runtime.runtimeEquals(CdkFunctionBase.DEFAULT_RUNTIME))) {
      return CdkFunctionBase.DEFAULT_RUNTIME;
    }

    // first try for latest nodejs runtime
    const nodejsRuntimes = compatibleRuntimes.filter(runtime => runtime.family === RuntimeFamily.NODEJS);
    if (nodejsRuntimes !== undefined && nodejsRuntimes.length > 0) {
      let latestRuntime = nodejsRuntimes[0];
      for (let idx = 1; idx < nodejsRuntimes.length; idx++) {
        latestRuntime = latestNodejsRuntime(latestRuntime, nodejsRuntimes[idx]);
      }
      if (latestRuntime.isDeprecated) {
        throw new Error(`Latest compatible Nodejs runtime found ${latestRuntime} is deprecated`);
      }
      return latestRuntime;
    }

    // next try for latest python runtime
    const pythonRuntimes = compatibleRuntimes.filter(runtime => runtime.family === RuntimeFamily.PYTHON);
    if (pythonRuntimes !== undefined && pythonRuntimes.length > 0) {
      let latestRuntime = pythonRuntimes[0];
      for (let idx = 1; idx < pythonRuntimes.length; idx++) {
        latestRuntime = latestPythonRuntime(latestRuntime, pythonRuntimes[idx]);
      }
      if (latestRuntime.isDeprecated) {
        throw new Error(`Latest compatible Python runtime found ${latestRuntime} is deprecated`);
      }
      return latestRuntime;
    }

    // throw if nodejs or python runtimes aren't specified
    throw new Error('Compatible runtimes can only be Python or Nodejs');
  }
}
