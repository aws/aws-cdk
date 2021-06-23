import * as fs from 'fs';
import * as path from 'path';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { ImportMock } from 'ts-mock-imports';
import { SymlinkFollowMode } from '../../lib/fs';
import * as util from '../../lib/fs/utils';

nodeunitShim({
  shouldFollow: {
    always: {
      'follows internal'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');

        const mockFsExists = ImportMock.mockFunction(fs, 'existsSync', true);
        try {
          test.ok(util.shouldFollow(SymlinkFollowMode.ALWAYS, sourceRoot, linkTarget));
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
          test.ok(util.shouldFollow(SymlinkFollowMode.ALWAYS, sourceRoot, linkTarget));
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
          test.ok(!util.shouldFollow(SymlinkFollowMode.ALWAYS, sourceRoot, linkTarget));
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
          test.ok(!util.shouldFollow(SymlinkFollowMode.ALWAYS, sourceRoot, linkTarget));
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
          test.ok(!util.shouldFollow(SymlinkFollowMode.EXTERNAL, sourceRoot, linkTarget));
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
          test.ok(util.shouldFollow(SymlinkFollowMode.EXTERNAL, sourceRoot, linkTarget));
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
          test.ok(!util.shouldFollow(SymlinkFollowMode.EXTERNAL, sourceRoot, linkTarget));
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
          test.ok(util.shouldFollow(SymlinkFollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget));
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
          test.ok(!util.shouldFollow(SymlinkFollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget));
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
          test.ok(!util.shouldFollow(SymlinkFollowMode.BLOCK_EXTERNAL, sourceRoot, linkTarget));
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
          test.ok(!util.shouldFollow(SymlinkFollowMode.NEVER, sourceRoot, linkTarget));
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
          test.ok(!util.shouldFollow(SymlinkFollowMode.NEVER, sourceRoot, linkTarget));
          test.ok(mockFsExists.notCalled);
          test.done();
        } finally {
          mockFsExists.restore();
        }
      },
    },
  },
});
