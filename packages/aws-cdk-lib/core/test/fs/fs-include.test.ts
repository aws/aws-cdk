import { matchIncludePatterns } from '../../lib/fs/include';

function include(patterns: string[], absoluteRootPath: string, files: string[]) {
  return files.filter(file => matchIncludePatterns(patterns, absoluteRootPath, file));
}

function notInclude(patterns: string[], absoluteRootPath: string, files: string[]) {
  return files.filter(file => !matchIncludePatterns(patterns, absoluteRootPath, file));
}

describe('Match include patterns', () => {
  test('includes nothing', () => {
    const rootPath = '/tmp';
    const patterns :string[] = [];
    const ignores = [
      '/tmp/some/file/path',
    ];

    expect(notInclude(patterns, rootPath, ignores)).toEqual(ignores);
  });

  test('includes requested files', () => {
    const rootPath = '/tmp';
    const patterns :string[] = ['*.txt'];
    const ignores = [
      '/tmp/some/file.ignored',
    ];
    const permits = [
      '/tmp/some/important/file.txt',
    ];

    expect(notInclude(patterns, rootPath, ignores)).toEqual(ignores);
    expect(include(patterns, rootPath, permits)).toEqual(permits);
  });

  test('includes requested files with directory path', () => {
    const rootPath = '/tmp';
    const patterns :string[] = ['some/**/*.txt'];
    const ignores = [
      '/tmp/other/file.txt',
    ];
    const permits = [
      '/tmp/some/important/file.txt',
    ];

    expect(notInclude(patterns, rootPath, ignores)).toEqual(ignores);
    expect(include(patterns, rootPath, permits)).toEqual(permits);
  });

  test('includes all requested files with directory path', () => {
    const rootPath = '/tmp';
    const patterns :string[] = ['some/**/*'];
    const ignores = [
      '/tmp/other/file.txt',
    ];
    const permits = [
      '/tmp/some/important/file.log',
      '/tmp/some/important/file.txt',
    ];

    expect(notInclude(patterns, rootPath, ignores)).toEqual(ignores);
    expect(include(patterns, rootPath, permits)).toEqual(permits);
  });

  test('includes all requested files', () => {
    const rootPath = '/tmp';
    const patterns :string[] = ['**/*'];

    const permits = [
      '/tmp/other/file.txt',
      '/tmp/some/important/file.txt',
    ];

    expect(include(patterns, rootPath, permits)).toEqual(permits);
  });
});
