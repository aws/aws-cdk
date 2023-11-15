import * as semver from 'semver';
import { Runtime, RuntimeFamily } from '../../../aws-lambda';

export abstract class LatestRuntime {
  public static fromNodejsRuntimes(runtimes: Runtime[]) {
    return LatestRuntime.fromRuntimes(runtimes, RuntimeFamily.NODEJS);
  }

  public static fromPythonRuntimes(runtimes: Runtime[]) {
    return LatestRuntime.fromRuntimes(runtimes, RuntimeFamily.PYTHON);
  }

  public static fromRuntimes(runtimes: Runtime[], family?: RuntimeFamily) {
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

    for (let runtime of runtimes) {
      if (family && runtime.family !== family) {
        throw new Error();
      }
    }

    let latestRuntime = runtimes[0];
    for (let idx = 1; idx < runtimes.length; idx++) {
      const runtime = runtimes[idx];
      if (semver.gte(runtime.name.slice(sliceStart), latestRuntime.name.slice(sliceStart))) {
        latestRuntime = runtime;
      }
    }

    return latestRuntime;
  }
}