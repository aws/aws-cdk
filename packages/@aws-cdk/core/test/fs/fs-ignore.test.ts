import * as path from 'path';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { IgnoreStrategy } from '../../lib/fs';

nodeunitShim({
  globIgnorePattern: {
    'excludes nothing by default'(test: Test) {
      const ignore = IgnoreStrategy.glob('/tmp', []);
      test.ok(!ignore.ignores(path.join('/tmp', 'some', 'file', 'path')));
      test.done();
    },

    'excludes requested files'(test: Test) {
      const ignore = IgnoreStrategy.glob('/tmp', ['*.ignored']);
      test.ok(ignore.ignores(path.join('/tmp', 'some', 'file.ignored')));
      test.ok(!ignore.ignores(path.join('/tmp', 'some', 'important', 'file')));
      test.done();
    },

    'does not exclude whitelisted files'(test: Test) {
      const ignore = IgnoreStrategy.glob('/tmp', ['*.ignored', '!important.*']);
      test.ok(!ignore.ignores(path.join('/tmp', 'some', 'important.ignored')));
      test.done();
    },
  },
  gitIgnorePattern: {
    'excludes nothing by default'(test: Test) {
      const ignore = IgnoreStrategy.git('/tmp', []);
      test.ok(!ignore.ignores(path.join('/tmp', 'some', 'file', 'path')));
      test.done();
    },

    'excludes requested files'(test: Test) {
      const ignore = IgnoreStrategy.git('/tmp', ['*.ignored']);
      test.ok(ignore.ignores(path.join('/tmp', 'some', 'file.ignored')));
      test.ok(!ignore.ignores(path.join('/tmp', 'some', 'important', 'file')));
      test.done();
    },

    'does not exclude whitelisted files'(test: Test) {
      const ignore = IgnoreStrategy.git('/tmp', ['*.ignored', '!important.*']);
      test.ok(!ignore.ignores(path.join('/tmp', 'some', 'important.ignored')));
      test.done();
    },
  },
  dockerIgnorePattern: {
    'excludes nothing by default'(test: Test) {
      const ignore = IgnoreStrategy.docker('/tmp', []);
      test.ok(!ignore.ignores(path.join('/tmp', 'some', 'file', 'path')));
      test.done();
    },

    'excludes requested files'(test: Test) {
      // In .dockerignore, * only matches files in the current directory
      const ignore = IgnoreStrategy.docker('/tmp', ['*.ignored']);
      test.ok(!ignore.ignores(path.join('/tmp', 'some', 'file.ignored')));
      test.ok(!ignore.ignores(path.join('/tmp', 'some', 'important', 'file')));
      test.done();
    },

    'does not exclude whitelisted files'(test: Test) {
      const ignore = IgnoreStrategy.docker('/tmp', ['*.ignored', '!important.*']);
      test.ok(!ignore.ignores(path.join('/tmp', 'some', 'important.ignored')));
      test.done();
    },
  },
});
