import { IgnoreStrategy } from '../../lib/fs';

function strategyIgnores(strategy: IgnoreStrategy, files: string[]) {
  return files.filter(file => strategy.ignores(file));
}

function strategyPermits(strategy: IgnoreStrategy, files: string[]) {
  return files.filter(file => !strategy.ignores(file));
}

describe('GlobIgnoreStrategy', () => {
  test('excludes nothing by default', () => {
    const strategy = IgnoreStrategy.glob('/tmp', []);
    const permits = [
      '/tmp/some/file/path',
    ];

    expect(strategyPermits(strategy, permits)).toEqual(permits);
  });

  test('excludes requested files', () => {
    const strategy = IgnoreStrategy.glob('/tmp', ['*.ignored']);
    const ignores = [
      '/tmp/some/file.ignored',
    ];
    const permits = [
      '/tmp/some/important/file',
    ];

    expect(strategyIgnores(strategy, ignores)).toEqual(ignores);
    expect(strategyPermits(strategy, permits)).toEqual(permits);
  });

  test('does not exclude whitelisted files', () => {
    const strategy = IgnoreStrategy.glob('/tmp', ['*.ignored', '!important.*']);
    const permits = [
      '/tmp/some/important.ignored',
    ];

    expect(strategyPermits(strategy, permits)).toEqual(permits);
  });

  test('does not exclude .dockerignore and Dockerfile at the root', () => {
    const strategy = IgnoreStrategy.glob('/tmp', ['*.ignored', '!Dockerfile', '!.dockerignore']);
    const ignores = [
      '/tmp/foo.ignored',
      '/tmp/some/important.ignored',
    ];
    const permits = [
      '/tmp/Dockerfile',
      '/tmp/.dockerignore',
    ];

    expect(strategyIgnores(strategy, ignores)).toEqual(ignores);
    expect(strategyPermits(strategy, permits)).toEqual(permits);
  });
});

describe('GitIgnoreStrategy', () => {
  test('excludes nothing by default', () => {
    const strategy = IgnoreStrategy.git('/tmp', []);
    const permits = [
      '/tmp/some/file/path',
    ];

    expect(strategyPermits(strategy, permits)).toEqual(permits);
  });

  test('excludes requested files', () => {
    const strategy = IgnoreStrategy.git('/tmp', ['*.ignored']);
    const ignores = [
      '/tmp/some/file.ignored',
    ];
    const permits = [
      '/tmp/some/important/file',
    ];

    expect(strategyIgnores(strategy, ignores)).toEqual(ignores);
    expect(strategyPermits(strategy, permits)).toEqual(permits);
  });

  test('does not exclude whitelisted files', () => {
    const strategy = IgnoreStrategy.git('/tmp', ['*.ignored', '!important.*']);
    const permits = [
      '/tmp/some/important.ignored',
    ];

    expect(strategyPermits(strategy, permits)).toEqual(permits);
  });
});

describe('DockerIgnoreStrategy', () => {
  test('excludes nothing by default', () => {
    const strategy = IgnoreStrategy.docker('/tmp', []);
    const permits = [
      '/tmp/some/file/path',
    ];

    expect(strategyPermits(strategy, permits)).toEqual(permits);
  });

  test('excludes requested files', () => {
    // In .dockerignore, * only matches files in the current directory
    const strategy = IgnoreStrategy.docker('/tmp', ['*.ignored']);
    const ignores = [
      '/tmp/file.ignored',
    ];
    const permits = [
      '/tmp/some/file.ignored',
      '/tmp/some/important/file',
    ];

    expect(strategyIgnores(strategy, ignores)).toEqual(ignores);
    expect(strategyPermits(strategy, permits)).toEqual(permits);
  });

  test('does not exclude whitelisted files', () => {
    const strategy = IgnoreStrategy.docker('/tmp', ['*.ignored', '!important.*']);
    const permits = [
      '/tmp/some/important.ignored',
    ];

    expect(strategyPermits(strategy, permits)).toEqual(permits);
  });
});
