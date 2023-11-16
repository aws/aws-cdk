import { Runtime, RuntimeFamily } from '../../../aws-lambda';

export function latestNodejsRuntime(runtime1: Runtime, runtime2: Runtime) {
  return latestRuntime(runtime1, runtime2, RuntimeFamily.NODEJS);
}

export function latestPythonRuntime(runtime1: Runtime, runtime2: Runtime) {
  return latestRuntime(runtime1, runtime2, RuntimeFamily.PYTHON);
}

function latestRuntime(runtime1: Runtime, runtime2: Runtime, family: RuntimeFamily) {
  if (runtime1.family !== family) {}

  if (runtime2.family !== family) {}

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
