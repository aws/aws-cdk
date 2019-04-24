import { Test } from 'nodeunit';
import path = require('path');
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
        test.ok(util.shouldFollow(FollowMode.Always, sourceRoot, linkTarget));
        test.done();
      },

      'follows external'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        test.ok(util.shouldFollow(FollowMode.Always, sourceRoot, linkTarget));
        test.done();
      },
    },

    external: {
      'does not follow internal'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        test.ok(!util.shouldFollow(FollowMode.External, sourceRoot, linkTarget));
        test.done();
      },

      'follows external'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        test.ok(util.shouldFollow(FollowMode.External, sourceRoot, linkTarget));
        test.done();
      },
    },

    blockExternal: {
      'follows internal'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        test.ok(!util.shouldFollow(FollowMode.Never, sourceRoot, linkTarget));
        test.done();
      },

      'does not follow external'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        test.ok(!util.shouldFollow(FollowMode.BlockExternal, sourceRoot, linkTarget));
        test.done();
      },
    },

    never: {
      'does not follow internal'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join(sourceRoot, 'referent');
        test.ok(!util.shouldFollow(FollowMode.Never, sourceRoot, linkTarget));
        test.done();
      },

      'does not follow external'(test: Test) {
        const sourceRoot = path.join('source', 'root');
        const linkTarget = path.join('alternate', 'referent');
        test.ok(!util.shouldFollow(FollowMode.Never, sourceRoot, linkTarget));
        test.done();
      },
    }
  },
};
