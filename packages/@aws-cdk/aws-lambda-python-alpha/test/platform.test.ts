import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  defaultManyLinuxTags,
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

describe('defaultManyLinuxTags', () => {
  describe('AL2-base runtimes (python3.7 .. python3.11) use single manylinux2014 tag', () => {
    test.each([
      [Runtime.PYTHON_3_7, Architecture.X86_64, ['manylinux2014_x86_64']],
      [Runtime.PYTHON_3_9, Architecture.ARM_64, ['manylinux2014_aarch64']],
      [Runtime.PYTHON_3_11, Architecture.X86_64, ['manylinux2014_x86_64']],
      [Runtime.PYTHON_3_11, Architecture.ARM_64, ['manylinux2014_aarch64']],
    ])('%s + %s', (runtime, arch, expected) => {
      expect(defaultManyLinuxTags(runtime, arch)).toEqual(expected);
    });
  });

  describe('AL2023-base runtimes (python3.12+) use manylinux_2_28 then manylinux2014', () => {
    test.each([
      [Runtime.PYTHON_3_12, Architecture.X86_64, ['manylinux_2_28_x86_64', 'manylinux2014_x86_64']],
      [Runtime.PYTHON_3_12, Architecture.ARM_64, ['manylinux_2_28_aarch64', 'manylinux2014_aarch64']],
      [Runtime.PYTHON_3_13, Architecture.X86_64, ['manylinux_2_28_x86_64', 'manylinux2014_x86_64']],
      [Runtime.PYTHON_3_14, Architecture.ARM_64, ['manylinux_2_28_aarch64', 'manylinux2014_aarch64']],
    ])('%s + %s', (runtime, arch, expected) => {
      expect(defaultManyLinuxTags(runtime, arch)).toEqual(expected);
    });
  });

  test('boundary: python3.11 is AL2 rule, python3.12 is AL2023 rule', () => {
    expect(defaultManyLinuxTags(Runtime.PYTHON_3_11, Architecture.X86_64)).toEqual(['manylinux2014_x86_64']);
    expect(defaultManyLinuxTags(Runtime.PYTHON_3_12, Architecture.X86_64)).toEqual([
      'manylinux_2_28_x86_64',
      'manylinux2014_x86_64',
    ]);
  });

  test('legacy python3.6 falls back to manylinux2014 single tag', () => {
    expect(defaultManyLinuxTags(Runtime.PYTHON_3_6, Architecture.X86_64)).toEqual(['manylinux2014_x86_64']);
  });

  test('throws for unsupported architecture', () => {
    const weird = Architecture.custom('weird', 'linux/mips64');
    expect(() => defaultManyLinuxTags(Runtime.PYTHON_3_11, weird)).toThrow(/linux\/mips64/);
  });

  test('throws for non-Python runtime', () => {
    expect(() => defaultManyLinuxTags(Runtime.NODEJS_20_X, Architecture.X86_64)).toThrow(/only Python runtimes/i);
  });
});
