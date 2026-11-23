import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  defaultPlatformTags,
  runtimeToAbiTag,
  runtimeToPythonVersion,
  validateArchitecture,
} from '../lib/platform';

describe('runtimeToPythonVersion', () => {
  test.each([
    [Runtime.PYTHON_3_6, '3.6'],
    [Runtime.PYTHON_3_7, '3.7'],
    [Runtime.PYTHON_3_8, '3.8'],
    [Runtime.PYTHON_3_9, '3.9'],
    [Runtime.PYTHON_3_10, '3.10'],
    [Runtime.PYTHON_3_11, '3.11'],
    [Runtime.PYTHON_3_12, '3.12'],
    [Runtime.PYTHON_3_13, '3.13'],
    [Runtime.PYTHON_3_14, '3.14'],
  ])('%s -> %s', (runtime, expected) => {
    expect(runtimeToPythonVersion(runtime)).toBe(expected);
  });

  test('throws for non-Python runtime', () => {
    expect(() => runtimeToPythonVersion(Runtime.NODEJS_20_X)).toThrow(/only Python runtimes/i);
  });
});

describe('runtimeToAbiTag', () => {
  test.each([
    [Runtime.PYTHON_3_9, 'cp39'],
    [Runtime.PYTHON_3_11, 'cp311'],
    [Runtime.PYTHON_3_12, 'cp312'],
    [Runtime.PYTHON_3_13, 'cp313'],
    [Runtime.PYTHON_3_14, 'cp314'],
  ])('%s -> %s', (runtime, expected) => {
    expect(runtimeToAbiTag(runtime)).toBe(expected);
  });

  test('throws for non-Python runtime', () => {
    expect(() => runtimeToAbiTag(Runtime.NODEJS_20_X)).toThrow(/only Python runtimes/i);
  });
});

describe('validateArchitecture', () => {
  test('accepts X86_64', () => {
    expect(() => validateArchitecture(Architecture.X86_64)).not.toThrow();
  });

  test('accepts ARM_64', () => {
    expect(() => validateArchitecture(Architecture.ARM_64)).not.toThrow();
  });

  test('throws for custom architecture with unsupported dockerPlatform', () => {
    const weird = Architecture.custom('weird', 'linux/mips64');
    expect(() => validateArchitecture(weird)).toThrow(/linux\/mips64/);
  });
});

describe('defaultPlatformTags', () => {
  test.each([
    [Runtime.PYTHON_3_6, Architecture.X86_64, 'x86_64', [17]],
    [Runtime.PYTHON_3_7, Architecture.X86_64, 'x86_64', [17]],
    [Runtime.PYTHON_3_8, Architecture.ARM_64, 'aarch64', [26, 25, 24, 23, 22, 21, 20, 19, 18, 17]],
    [Runtime.PYTHON_3_11, Architecture.X86_64, 'x86_64', [26, 25, 24, 23, 22, 21, 20, 19, 18, 17]],
    [Runtime.PYTHON_3_12, Architecture.X86_64, 'x86_64', [34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17]],
    [Runtime.PYTHON_3_14, Architecture.ARM_64, 'aarch64', [34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17]],
  ])('%s + %s uses the compatible glibc range then the legacy alias', (runtime, arch, suffix, minors) => {
    expect(defaultPlatformTags(runtime, arch)).toEqual([
      ...minors.map(minor => `manylinux_2_${minor}_${suffix}`),
      `manylinux2014_${suffix}`,
    ]);
  });

  test('throws for unsupported architecture', () => {
    const weird = Architecture.custom('weird', 'linux/mips64');
    expect(() => defaultPlatformTags(Runtime.PYTHON_3_11, weird)).toThrow(/linux\/mips64/);
  });

  test('throws for non-Python runtime', () => {
    expect(() => defaultPlatformTags(Runtime.NODEJS_20_X, Architecture.X86_64)).toThrow(/only Python runtimes/i);
  });
});
