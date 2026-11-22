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
      `The default local bundling platform tags only support x86_64 and arm64 Lambda architectures; got dockerPlatform '${architecture.dockerPlatform}'. Use Docker bundling or provide 'platformTags' to bypass the default tag mapping.`,
    );
  }
}

export function validatePlatformTags(runtime: Runtime, architecture: Architecture, platformTags: string[]): void {
  if (platformTags.length === 0) {
    throw new UnscopedValidationError(
      lit`PythonLocalBundlingEmptyPlatformTags`,
      'Local bundling requires at least one Linux platform tag. Omit platformTags to use the runtime defaults.',
    );
  }

  const expected = ARCH_SLUG[architecture.dockerPlatform];
  const pythonMinor = parsePythonMinor(runtime);
  const glibcMinor = pythonMinor >= AL2023_MIN_MINOR ? 34 : pythonMinor >= 8 ? 26 : 17;

  for (const tag of platformTags) {
    if (!/^(manylinux(?:_\d+_\d+|1|2010|2014)|musllinux_\d+_\d+|linux)_.+$/.test(tag)) {
      throw new UnscopedValidationError(
        lit`PythonLocalBundlingPlatformTagNotLinux`,
        `Platform tag '${tag}' does not target Linux. Lambda functions run on Amazon Linux.`,
      );
    }
    const suffix = /_(x86_64|aarch64)$/.exec(tag)?.[1];
    if (expected && suffix && suffix !== expected) {
      throw new UnscopedValidationError(
        lit`PythonLocalBundlingPlatformTagArchitectureMismatch`,
        `Platform tag '${tag}' does not match Lambda architecture '${architecture.name}' (expected '_${expected}').`,
      );
    }
    const glibc = /^manylinux_(\d+)_(\d+)_/.exec(tag);
    if (glibc && (Number(glibc[1]) > 2 || (Number(glibc[1]) === 2 && Number(glibc[2]) > glibcMinor))) {
      throw new UnscopedValidationError(
        lit`PythonLocalBundlingPlatformTagGlibcMismatch`,
        `Platform tag '${tag}' requires a newer glibc than Lambda runtime '${runtime.name}' (glibc 2.${glibcMinor}).`,
      );
    }
  }
}

export function defaultPlatformTags(runtime: Runtime, architecture: Architecture): string[] {
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
