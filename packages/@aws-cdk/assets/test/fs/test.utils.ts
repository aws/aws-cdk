import { FsUtils } from '@aws-cdk/assert';
import fs = require('fs');
import { Test } from 'nodeunit';
import path = require('path');
import { ImportMock } from 'ts-mock-imports';
import { FollowMode } from '../../lib/fs';
import util = require('../../lib/fs/utils');

export = {
  shouldExclude: {
    'excludes nothing by default'(test: Test) {
      test.ok(!util.shouldExclude([], path.join('some', 'file', 'path')));
      test.done();
    },

    'excludes requested files'(test: Test) {
      const exclusions = ['*.ignored'];
      test.ok(util.shouldExclude(exclusions, path.join('some', 'file.ignored')));
      test.ok(!util.shouldExclude(exclusions, path.join('some', 'important', 'file')));
      test.done();
    },

    'does not exclude whitelisted files'(test: Test) {
      const exclusions = ['*.ignored', '!important.*'];
      test.ok(!util.shouldExclude(exclusions, path.join('some', 'important.ignored')));
      test.done();
    },
  },

  shouldFollow: {
    always: {
      'follows internal'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');

        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
        try {
          test.ok(util.shouldFollow(FollowMode.ALWAYS, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'follows external'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
        try {
          test.ok(util.shouldFollow(FollowMode.ALWAYS, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'does not follow internal when the referent does not exist'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
        try {
          test.ok(!util.shouldFollow(FollowMode.ALWAYS, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'does not follow external when the referent does not exist'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
        try {
          test.ok(!util.shouldFollow(FollowMode.ALWAYS, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },
    },

    external: {
      'does not follow internal'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
        try {
          test.ok(!util.shouldFollow(FollowMode.EXTERNAL, sourceRoot, linkTarget));
          test.ok(mockFsExists.notCalled);
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'follows external'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
        try {
          test.ok(util.shouldFollow(FollowMode.EXTERNAL, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'does not follow external when referent does not exist'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
        try {
          test.ok(!util.shouldFollow(FollowMode.EXTERNAL, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },
    },

    blockExternal: {
      'follows internal'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
        try {
          test.ok(util.shouldFollow(FollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'does not follow internal when referent does not exist'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', false);
        try {
          test.ok(!util.shouldFollow(FollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget));
          test.ok(mockFsExists.calledOnceWith(linkTarget));
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'does not follow external'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
        try {
          test.ok(!util.shouldFollow(FollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget));
          test.ok(mockFsExists.notCalled);
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },
    },

    never: {
      'does not follow internal'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
        try {
          test.ok(!util.shouldFollow(FollowMode.NEVER, sourceRoot, linkTarget));
          test.ok(mockFsExists.notCalled);
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },

      'does not follow external'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync');
        try {
          test.ok(!util.shouldFollow(FollowMode.NEVER, sourceRoot, linkTarget));
          test.ok(mockFsExists.notCalled);
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },
    }
  },

  shouldExcludeDeep: {
    'without pattern'(test: Test) {
      testShouldExcludeDeep(test, [], [], ['foo.txt']);
      testShouldExcludeDeep(test, [''], [], ['foo.txt']);
      testShouldExcludeDeep(test, ['# comment'], [], ['foo.txt']);

      test.done();
    },
    'basic usage'(test: Test) {
      testShouldExcludeDeep(test, ['foo.txt'], [
        'foo.txt',
        'foo.txt/file',
        'dir/foo.txt',
      ], [
        'bar.txt',
        'foo',
        'foo.txt.old',
      ]);

      test.done();
    },
    'contridactory'(test: Test) {
      testShouldExcludeDeep(test, ['foo.txt', '!foo.txt'], [], ['foo.txt']);

      test.done();
    },
    'dir single wildcard'(test: Test) {
      testShouldExcludeDeep(test, ['d?r'], [
        'dir',
        'dir/exclude',
        'dir/exclude/file',
      ], [
        'door',
        'door/file',
      ]);

      test.done();
    },
    'dir wildcard'(test: Test) {
      testShouldExcludeDeep(test, ['d*r'], [
        'dir',
        'dir/file',
        'door',
        'door/file',
      ], [
        'dog',
        'dog/file',
      ]);

      test.done();
    },
    'dir deep wildcard'(test: Test) {
      testShouldExcludeDeep(test, ['dir/**/*', '!dir/include/**/*'], [
        'dir/deep',
        'dir/deep/file',
        'dir/deep/deeper/file',
        'dir/include',
      ], [
        'dir',
        'dir/include/deep',
        'dir/include/deep/deeper',
      ]);

      test.done();
    },
    'deep structure'(test: Test) {
      testShouldExcludeDeep(test, ['deep/exclude'], [
        'deep/exclude',
        'deep/exclude/file',
      ], [
        'deep',
        'deep/include',
        'deep/include/file',
      ]);

      test.done();
    },
    'inverted pattern'(test: Test) {
      testShouldExcludeDeep(test, ['*', '!foo.txt', '!d?r', 'dir/exclude'], [
        'bar.txt',
        'dir/exclude',
        'dir/exclude/file',
      ], [
        '.hidden-file',
        'foo.txt',
        'dir',
        'dir/include',
        'dir/include/subdir',
        'exclude/foo.txt',
      ]);

      test.done();
    },
  },

  shouldExcludeDirectory: {
    'without pattern'(test: Test) {
      testShouldExcludeDirectory(test, [], [], ['dir']);
      testShouldExcludeDirectory(test, [''], [], ['dir']);
      testShouldExcludeDirectory(test, ['# comment'], [], ['dir']);

      test.done();
    },
    'basic usage'(test: Test) {
      const pattern = ['dir', '!dir/*', 'other_dir'];

      testShouldExcludeDeep(test, pattern, ['dir', 'other_dir'], ['dir/file']);
      testShouldExcludeDirectory(test, pattern, ['dir/deep', 'other_dir'], ['dir']);

      test.done();
    },
    'deep structure'(test: Test) {
      const pattern = ['dir', '!dir/subdir/?', 'other_dir', 'really/deep/structure/of/files/and/dirs'];

      testShouldExcludeDeep(test, pattern,
        ['dir', 'dir/subdir', 'other_dir'],
        ['dir/subdir/a']
      );
      testShouldExcludeDirectory(test, pattern,
        ['other_dir', 'dir/subdir/d'],
        ['dir', 'dir/subdir']
      );

      test.done();
    },
    'wildcard pattern'(test: Test) {
      const pattern = ['dir', '!dir/*/*', 'other_dir'];

      testShouldExcludeDeep(test, pattern,
        ['dir', 'other_dir', 'dir/file'],
        ['dir/file/deep']
      );
      testShouldExcludeDirectory(test, pattern,
        ['other_dir', 'dir/deep/struct'],
        ['dir', 'dir/deep', 'dir/deep']
      );

      test.done();
    },
    'deep wildcard'(test: Test) {
      const pattern = ['dir', '!dir/**/*', 'other_dir'];

      testShouldExcludeDeep(test, pattern,
        ['dir', 'other_dir'],
        ['dir/file', 'dir/file/deep']
      );
      testShouldExcludeDirectory(test, pattern,
        ['other_dir'],
        ['dir', 'dir/deep', 'dir/deep/struct', 'dir/really/really/really/really/deep']
      );

      test.done();
    },
  },

  listFilesRecursively: {
    'basic usage'(test: Test) {
      const exclude = [''];
      const follow = FollowMode.ALWAYS;
      const tree = `
      ├── directory
      │   ├── foo.txt
      │   └── bar.txt
      ├── deep
      │   ├── dir
      │   │   └── struct
      │   │       └── qux.txt
      ├── foobar.txt`;

      const { directory, cleanup } = FsUtils.fromTree('basic', tree);
      const paths = util.listFilesRecursively(directory, { exclude, follow }).map(({ relativePath }) => relativePath);

      test.deepEqual(paths, [
        'deep/dir/struct/qux.txt',
        'directory/bar.txt',
        'directory/foo.txt',
        'foobar.txt',
      ]);

      cleanup();
      test.done();
    },
    'exclude'(test: Test) {
      const exclude = ['foobar.txt', 'deep', '!deep/foo.txt'];
      const follow = FollowMode.ALWAYS;
      const tree = `
      ├── directory
      │   ├── foo.txt
      │   └── bar.txt
      ├── deep
      │   ├── dir
      │   │   └── struct
      │   │       └── qux.txt
      │   ├── foo.txt
      │   └── bar.txt
      ├── foobar.txt`;

      const { directory, cleanup } = FsUtils.fromTree('exclude', tree);
      const paths = util.listFilesRecursively(directory, { exclude, follow }).map(({ relativePath }) => relativePath);

      test.deepEqual(paths, [
        'deep/foo.txt',
        'directory/bar.txt',
        'directory/foo.txt',
      ]);

      cleanup();
      test.done();
    },
  },
};

const testShouldExclude = (
  test: Test,
  pattern: string[],
  expectExclude: string[],
  expectInclude: string[],
  shouldExcludeMethod: (pattern: string[], path: string) => boolean) => {
  for (const exclude of expectExclude) {
    test.ok(shouldExcludeMethod(pattern, exclude), `${exclude} should have been excluded, but wasn't`);
  }
  for (const include of expectInclude) {
    test.ok(!shouldExcludeMethod(pattern, include), `${include} should have been included, but wasn't`);
  }
};

const testShouldExcludeDeep = (test: Test, pattern: string[], expectExclude: string[], expectInclude: string[]) =>
  testShouldExclude(test, pattern, expectExclude, expectInclude, util.shouldExcludeDeep);

const testShouldExcludeDirectory = (test: Test, pattern: string[], expectExclude: string[], expectInclude: string[]) =>
  testShouldExclude(test, pattern, expectExclude, expectInclude, util.shouldExcludeDirectory);