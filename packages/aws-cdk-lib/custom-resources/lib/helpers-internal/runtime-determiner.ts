import { Runtime, RuntimeFamily } from '../../../aws-lambda';

/**
 * A utility class used to determine the latest runtime for a specific runtime family
 */
export class RuntimeDeterminer {
  public static readonly DEFAULT_RUNTIME = Runtime.NODEJS_LATEST;

  /**
   * Determines the latest nodejs runtime from a list of runtimes
   *
   * @param runtimes the list of runtimes to search in
   * @returns the latest nodejs runtime or undefined if no nodejs runtimes are provided
   */
  public static determineLatestNodeJsRuntime(runtimes: Runtime[]) {
    const nodeJsRuntimes = runtimes.filter(runtime => runtime.family === RuntimeFamily.NODEJS);
    if (nodeJsRuntimes.length === 0) {
      return undefined;
    }

    if (nodeJsRuntimes.some(runtime => runtime.runtimeEquals(RuntimeDeterminer.DEFAULT_RUNTIME))) {
      return RuntimeDeterminer.DEFAULT_RUNTIME;
    }

    let latestRuntime = nodeJsRuntimes[0];
    for (let idx = 1; idx < nodeJsRuntimes.length; idx++) {
      latestRuntime = RuntimeDeterminer.compareNodeJsRuntimes(latestRuntime, nodeJsRuntimes[idx]);
    }

    return latestRuntime;
  }

  /**
   * Determines the latest python runtime from a list of runtimes
   *
   * @param runtimes the list of runtimes to search in
   * @returns the latest python runtime or undefined if no python runtimes are provided
   */
  public static determineLatestPythonRuntime(runtimes: Runtime[]) {
    const pythonRuntimes = runtimes.filter(runtime => runtime.family === RuntimeFamily.PYTHON);
    if (pythonRuntimes.length === 0) {
      return undefined;
    }

    let latestRuntime = pythonRuntimes[0];
    for (let idx = 1; idx < pythonRuntimes.length; idx++) {
      latestRuntime = RuntimeDeterminer.comparePythonRuntimes(latestRuntime, pythonRuntimes[idx]);
    }

    return latestRuntime;
  }

  private static compareNodeJsRuntimes(runtime1: Runtime, runtime2: Runtime) {
    return RuntimeDeterminer.compareRuntimes(runtime1, runtime2, RuntimeFamily.NODEJS);
  }

  private static comparePythonRuntimes(runtime1: Runtime, runtime2: Runtime) {
    return RuntimeDeterminer.compareRuntimes(runtime1, runtime2, RuntimeFamily.PYTHON);
  }

  private static compareRuntimes(runtime1: Runtime, runtime2: Runtime, family: RuntimeFamily) {
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

  private constructor() {}
}