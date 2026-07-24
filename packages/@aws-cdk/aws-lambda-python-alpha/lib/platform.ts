import { UnscopedValidationError } from 'aws-cdk-lib';
import type { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Architecture, RuntimeFamily } from 'aws-cdk-lib/aws-lambda';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';

/**
 * Minor Python version at and above which the Lambda runtime base image is
 * Amazon Linux 2023 (glibc 2.34) instead of Amazon Linux 2 (glibc 2.26).
 */
const AL2023_MIN_MINOR = 12;

const ARCH_SLUG: Record<string, string> = {
  [Architecture.X86_64.dockerPlatform]: 'x86_64',
  [Architecture.ARM_64.dockerPlatform]: 'aarch64',
};

export function runtimeToPythonVersion(runtime: Runtime): string {
  assertPythonRuntime(runtime);
  return runtime.name.replace(/^python/, '');
}

export function runtimeToAbiTag(runtime: Runtime): string {
  return `cp${runtimeToPythonVersion(runtime).replace('.', '')}`;
}

export function validateArchitecture(architecture: Architecture): void {
  if (ARCH_SLUG[architecture.dockerPlatform] === undefined) {
    throw new UnscopedValidationError(
      lit`PythonLocalBundlingUnsupportedArchitecture`,
      `Local bundling supports only x86_64 and arm64 Lambda architectures; got dockerPlatform '${architecture.dockerPlatform}'. Use Docker bundling or provide 'manyLinuxTags' to bypass the default tag mapping.`,
    );
  }
}

export function defaultManyLinuxTags(runtime: Runtime, architecture: Architecture): string[] {
  validateArchitecture(architecture);
  const archSlug = ARCH_SLUG[architecture.dockerPlatform];
  const minor = parsePythonMinor(runtime);

  if (minor >= AL2023_MIN_MINOR) {
    return [`manylinux_2_28_${archSlug}`, `manylinux2014_${archSlug}`];
  }
  return [`manylinux2014_${archSlug}`];
}

function assertPythonRuntime(runtime: Runtime): void {
  if (runtime.family !== RuntimeFamily.PYTHON) {
    throw new UnscopedValidationError(
      lit`PythonLocalBundlingUnsupportedRuntime`,
      `Local bundling supports only Python runtimes; got '${runtime.name}'.`,
    );
  }
}

function parsePythonMinor(runtime: Runtime): number {
  const [, minorStr] = runtimeToPythonVersion(runtime).split('.');
  const minor = Number(minorStr);
  if (!Number.isInteger(minor)) {
    throw new UnscopedValidationError(
      lit`PythonLocalBundlingUnparseableRuntime`,
      `Cannot parse Python minor version from runtime name '${runtime.name}'.`,
    );
  }
  return minor;
}
