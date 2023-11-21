import { Runtime, RuntimeFamily } from '../../../aws-lambda';

/**
 * A utility class used to determine the latest runtime for a specific runtime family
 */
export class RuntimeDeterminer {
  public static readonly DEFAULT_RUNTIME = Runtime.NODEJS_LATEST;

  /**
   * Determines the latest nodejs runtime from a list of nodejs runtimes
   *
   * @param nodeJsRuntimes the list of nodejs runtimes to search in
   * @returns the latest nodejs runtime or undefined if no nodejs runtimes are provided
   */
  public static latestNodeJsRuntime(nodeJsRuntimes: Runtime[]) {
    RuntimeDeterminer.validateRuntimes(nodeJsRuntimes, RuntimeFamily.NODEJS);

    if (nodeJsRuntimes.length === 0) {
      return undefined;
    }

    if (nodeJsRuntimes.some(runtime => runtime.runtimeEquals(RuntimeDeterminer.DEFAULT_RUNTIME))) {
      return RuntimeDeterminer.DEFAULT_RUNTIME;
    }

    let latestRuntime = nodeJsRuntimes[0];
    for (let idx = 1; idx < nodeJsRuntimes.length; idx++) {
      latestRuntime = RuntimeDeterminer.latestRuntime(latestRuntime, nodeJsRuntimes[idx], RuntimeFamily.NODEJS);
    }

    return latestRuntime;
  }

  /**
   * Determines the latest python runtime from a list of python runtimes
   *
   * @param pythonRuntimes the list of python runtimes to search in
   * @returns the latest python runtime or undefined if no python runtimes are provided
   */
  public static latestPythonRuntime(pythonRuntimes: Runtime[]) {
    RuntimeDeterminer.validateRuntimes(pythonRuntimes, RuntimeFamily.PYTHON);

    if (pythonRuntimes.length === 0) {
      return undefined;
    }

    let latestRuntime = pythonRuntimes[0];
    for (let idx = 1; idx < pythonRuntimes.length; idx++) {
      latestRuntime = RuntimeDeterminer.latestRuntime(latestRuntime, pythonRuntimes[idx], RuntimeFamily.PYTHON);
    }

    return latestRuntime;
  }

  private static latestRuntime(runtime1: Runtime, runtime2: Runtime, family: RuntimeFamily) {
    let sliceStart: number;
    switch (family) {
      case RuntimeFamily.NODEJS: {
        sliceStart = 'nodejs'.length;
        break;
      }
      case RuntimeFamily.PYTHON: {
        sliceStart = 'python'.length;
        break;
      }
      default: {
        sliceStart = 0;
        break;
      }
    }

    const version1 = runtime1.name.slice(sliceStart).split('.');
    const version2 = runtime2.name.slice(sliceStart).split('.');

    const versionLength = Math.min(version1.length, version2.length);
    for (let idx = 0; idx < versionLength; idx++) {
      if (parseInt(version1[idx]) > parseInt(version2[idx])) {
        return runtime1;
      }

      if (parseInt(version1[idx]) < parseInt(version2[idx])) {
        return runtime2;
      }
    }

    return runtime1;
  }

  private static validateRuntimes(runtimes: Runtime[], family: RuntimeFamily) {
    for (let runtime of runtimes) {
      if (runtime.family !== family) {
        throw new Error(`All runtime familys must be the same when determining latest runtime. Found runtime family ${runtime.family}, expected ${family}`);
      }
    }
  }

  private constructor() {}
}