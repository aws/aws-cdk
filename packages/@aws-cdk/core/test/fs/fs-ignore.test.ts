import * as path from 'path';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { IgnorePattern } from '../../lib/fs';

nodeunitShim({
  globIgnorePattern: {
    'excludes nothing by default'(test: Test) {
      const ignore = IgnorePattern.glob([]);
      test.ok(!ignore.ignores(path.join('some', 'file', 'path')));
      test.done();
    },

    'excludes requested files'(test: Test) {
      const ignore = IgnorePattern.glob(['*.ignored']);
      test.ok(ignore.ignores(path.join('some', 'file.ignored')));
      test.ok(!ignore.ignores(path.join('some', 'important', 'file')));
      test.done();
    },

    'does not exclude whitelisted files'(test: Test) {
      const ignore = IgnorePattern.glob(['*.ignored', '!important.*']);
      test.ok(!ignore.ignores(path.join('some', 'important.ignored')));
      test.done();
    },
  },
  gitIgnorePattern: {
    'excludes nothing by default'(test: Test) {
      const ignore = IgnorePattern.git([]);
      test.ok(!ignore.ignores(path.join('some', 'file', 'path')));
      test.done();
    },

    'excludes requested files'(test: Test) {
      const ignore = IgnorePattern.git(['*.ignored']);
      test.ok(ignore.ignores(path.join('some', 'file.ignored')));
      test.ok(!ignore.ignores(path.join('some', 'important', 'file')));
      test.done();
    },

    'does not exclude whitelisted files'(test: Test) {
      const ignore = IgnorePattern.git(['*.ignored', '!important.*']);
      test.ok(!ignore.ignores(path.join('some', 'important.ignored')));
      test.done();
    },
  },
  dockerIgnorePattern: {
    'excludes nothing by default'(test: Test) {
      const ignore = IgnorePattern.docker([]);
      test.ok(!ignore.ignores(path.join('some', 'file', 'path')));
      test.done();
    },

    'excludes requested files'(test: Test) {
      // In .dockerignore, * only matches files in the current directory
      const ignore = IgnorePattern.docker(['*.ignored']);
      test.ok(!ignore.ignores(path.join('some', 'file.ignored')));
      test.ok(!ignore.ignores(path.join('some', 'important', 'file')));
      test.done();
    },

    'does not exclude whitelisted files'(test: Test) {
      const ignore = IgnorePattern.docker(['*.ignored', '!important.*']);
      test.ok(!ignore.ignores(path.join('some', 'important.ignored')));
      test.done();
    },
  },
});
