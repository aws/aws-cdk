import { Runtime, RuntimeFamily } from '../../../aws-lambda';

export class RuntimeDeterminer {
  public static determineRuntime(compatibleRuntimes: Runtime[]) {
    if (compatibleRuntimes.length === 0) {
      throw new Error('`code` must specify at least one compatible runtime');
    }

    //check for default runtime
    if (compatibleRuntimes.some(runtime => runtime.runtimeEquals(RuntimeDeterminer.DEFAULT_RUNTIME))) {
      return RuntimeDeterminer.DEFAULT_RUNTIME;
    }

    // first try for latest nodejs runtime
    const nodejsRuntimes = compatibleRuntimes.filter(runtime => runtime.family === RuntimeFamily.NODEJS);
    if (nodejsRuntimes !== undefined && nodejsRuntimes.length > 0) {
      let latestRuntime = nodejsRuntimes[0];
      for (let idx = 1; idx < nodejsRuntimes.length; idx++) {
        latestRuntime = RuntimeDeterminer.compareNodeJsRuntimes(latestRuntime, nodejsRuntimes[idx]);
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
        latestRuntime = RuntimeDeterminer.comparePythonRuntimes(latestRuntime, pythonRuntimes[idx]);
      }
      if (latestRuntime.isDeprecated) {
        throw new Error(`Latest compatible Python runtime found ${latestRuntime} is deprecated`);
      }
      return latestRuntime;
    }

    // throw if nodejs or python runtimes aren't specified
    throw new Error('Compatible runtimes can only be Python or Nodejs');
  }

  private static readonly DEFAULT_RUNTIME = Runtime.NODEJS_LATEST;

  private static compareNodeJsRuntimes(runtime1: Runtime, runtime2: Runtime) {
    if (runtime1.family !== RuntimeFamily.NODEJS) {}

    if (runtime2.family !== RuntimeFamily.NODEJS) {}

    return RuntimeDeterminer.compareRuntimes(runtime1, runtime2, RuntimeFamily.NODEJS);
  }

  private static comparePythonRuntimes(runtime1: Runtime, runtime2: Runtime) {
    if (runtime1.family !== RuntimeFamily.PYTHON) {}

    if (runtime2.family !== RuntimeFamily.PYTHON) {}

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