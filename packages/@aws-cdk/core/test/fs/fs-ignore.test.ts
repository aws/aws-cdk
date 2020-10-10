import * as path from 'path';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { IgnoreStrategy } from '../../lib/fs';

nodeunitShim({
  globIgnorePattern: {
    'excludes nothing by default'(test: Test) {
      const ignore = IgnoreStrategy.glob([]);
      test.ok(!ignore.ignores(path.join('some', 'file', 'path')));
      test.done();
    },

    'excludes requested files'(test: Test) {
      const ignore = IgnoreStrategy.glob(['*.ignored']);
      test.ok(ignore.ignores(path.join('some', 'file.ignored')));
      test.ok(!ignore.ignores(path.join('some', 'important', 'file')));
      test.done();
    },

    'does not exclude whitelisted files'(test: Test) {
      const ignore = IgnoreStrategy.glob(['*.ignored', '!important.*']);
      test.ok(!ignore.ignores(path.join('some', 'important.ignored')));
      test.done();
    },
  },
  gitIgnorePattern: {
    'excludes nothing by default'(test: Test) {
      const ignore = IgnoreStrategy.git([]);
      test.ok(!ignore.ignores(path.join('some', 'file', 'path')));
      test.done();
    },

    'excludes requested files'(test: Test) {
      const ignore = IgnoreStrategy.git(['*.ignored']);
      test.ok(ignore.ignores(path.join('some', 'file.ignored')));
      test.ok(!ignore.ignores(path.join('some', 'important', 'file')));
      test.done();
    },

    'does not exclude whitelisted files'(test: Test) {
      const ignore = IgnoreStrategy.git(['*.ignored', '!important.*']);
      test.ok(!ignore.ignores(path.join('some', 'important.ignored')));
      test.done();
    },
  },
  dockerIgnorePattern: {
    'excludes nothing by default'(test: Test) {
      const ignore = IgnoreStrategy.docker([]);
      test.ok(!ignore.ignores(path.join('some', 'file', 'path')));
      test.done();
    },

    'excludes requested files'(test: Test) {
      // In .dockerignore, * only matches files in the current directory
      const ignore = IgnoreStrategy.docker(['*.ignored']);
      test.ok(!ignore.ignores(path.join('some', 'file.ignored')));
      test.ok(!ignore.ignores(path.join('some', 'important', 'file')));
      test.done();
    },

    'does not exclude whitelisted files'(test: Test) {
      const ignore = IgnoreStrategy.docker(['*.ignored', '!important.*']);
      test.ok(!ignore.ignores(path.join('some', 'important.ignored')));
      test.done();
    },
  },
});
