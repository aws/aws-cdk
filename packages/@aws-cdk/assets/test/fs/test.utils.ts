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
};

const testShouldExcludeDeep = (test: Test, pattern: string[], expectExclude: string[], expectInclude: string[]) => {
  for (const include of expectExclude) {
    test.ok(util.shouldExcludeDeep(pattern, include), `${include} should have been included, but wasn't`);
  }
  for (const exclude of expectInclude) {
    test.ok(!util.shouldExcludeDeep(pattern, exclude), `${exclude} should have been excluded, but wasn't`);
  }
};
