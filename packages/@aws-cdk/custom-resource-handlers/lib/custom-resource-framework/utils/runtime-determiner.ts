/* eslint-disable import/no-extraneous-dependencies */
import { Runtime, RuntimeFamily } from '../runtime';

/**
 * A utility class used to determine the latest runtime for a specific runtime family
 */
export class RuntimeDeterminer {
  /**
   * Determines the latest runtime from a list of runtimes.
   *
   * Note: runtimes must only be nodejs or python. Nodejs runtimes will be given preference over
   * python runtimes.
   *
   * @param runtimes the list of runtimes to search in
   * @returns the latest nodejs or python runtime found, otherwise undefined if no nodejs or python
   * runtimes are specified
   */
  public static determineLatestRuntime(runtimes: Runtime[], defaultRuntime: Runtime) {
    if (runtimes.length === 0) {
      throw new Error('You must specify at least one compatible runtime');
    }

    const nodeJsRuntimes = runtimes.filter(runtime => runtime.family === RuntimeFamily.NODEJS);
    const latestNodeJsRuntime = RuntimeDeterminer.latestNodeJsRuntime(nodeJsRuntimes, defaultRuntime);
    if (latestNodeJsRuntime !== undefined) {
      if (latestNodeJsRuntime.isDeprecated) {
        throw new Error(`Latest nodejs runtime ${latestNodeJsRuntime} is deprecated. You must upgrade to the latest code compatible nodejs runtime`);
      }
      return latestNodeJsRuntime;
    }

    const pythonRuntimes = runtimes.filter(runtime => runtime.family === RuntimeFamily.PYTHON);
    const latestPythonRuntime = RuntimeDeterminer.latestPythonRuntime(pythonRuntimes);
    if (latestPythonRuntime !== undefined) {
      if (latestPythonRuntime.isDeprecated) {
        throw new Error(`Latest python runtime ${latestPythonRuntime} is deprecated. You must upgrade to the latest code compatible python runtime`);
      }
      return latestPythonRuntime;
    }

    throw new Error('Compatible runtimes must contain only nodejs or python runtimes');
  }

  private static latestNodeJsRuntime(nodeJsRuntimes: Runtime[], defaultRuntime: Runtime) {
    if (nodeJsRuntimes.length === 0) {
      return undefined;
    }

    if (nodeJsRuntimes.some(runtime => runtime.runtimeEquals(defaultRuntime))) {
      return defaultRuntime;
    }

    let latestRuntime = nodeJsRuntimes[0];
    for (let idx = 1; idx < nodeJsRuntimes.length; idx++) {
      latestRuntime = RuntimeDeterminer.latestRuntime(latestRuntime, nodeJsRuntimes[idx], RuntimeFamily.NODEJS);
    }

    return latestRuntime;
  }

  private static latestPythonRuntime(pythonRuntimes: Runtime[]) {
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

  private constructor() {}
}
