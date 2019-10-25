import fs = require('fs');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');
import { FsUtils } from '../lib';

export = {
  fromTree: {
    'basic usage'(test: Test) {
      // GIVEN
      const tree = `
      ├── foo
      └── dir
        └── subdir/
          └── bar.txt`;

      // THEN
      const { directory, cleanup } = FsUtils.fromTree('basic-usage', tree);

      test.ok(fs.existsSync(path.join(directory, 'foo')));
      test.ok(fs.existsSync(path.join(directory, 'dir', 'subdir', 'bar.txt')));

      cleanup();

      test.ok(!fs.existsSync(path.join(directory, 'foo')));
      test.ok(!fs.existsSync(path.join(directory, 'dir', 'subdir', 'bar.txt')));
      test.ok(!fs.existsSync(directory));

      test.done();
    },
    'symlinks'(test: Test) {
      // GIVEN
      const tree = `
      ├── link -> target
      ├── target
          └── foo.txt`;

      // THEN
      const { directory, cleanup } = FsUtils.fromTree('symlink', tree);

      test.ok(fs.existsSync(path.join(directory, 'target', 'foo.txt')));
      test.ok(fs.existsSync(path.join(directory, 'link', 'foo.txt')));
      test.equal(fs.readlinkSync(path.join(directory, 'link')), 'target');

      cleanup();

      test.ok(!fs.existsSync(path.join(directory, 'target')));
      test.ok(!fs.existsSync(path.join(directory, 'link')));
      test.ok(!fs.existsSync(directory));

      test.done();
    },
    'external smylinks'(test: Test) {
      // GIVEN
      const externalTree = FsUtils.fromTree('external', `
        ├── external_dir
        │   ├── foobar.txt`);

      // THEN

      const externalRelativeDirectory = path.relative(os.tmpdir(), externalTree.directory);
      const externalLink = `../${externalRelativeDirectory}/external_dir`;

      const internalTree = FsUtils.fromTree('internal', `
        ├── external_link -> ${externalLink}`);

      test.ok(fs.existsSync(path.join(externalTree.directory, 'external_dir', 'foobar.txt')));
      test.ok(fs.existsSync(path.join(internalTree.directory, 'external_link', 'foobar.txt')));
      test.equal(fs.readlinkSync(path.join(internalTree.directory, 'external_link')), externalLink);

      externalTree.cleanup();
      internalTree.cleanup();

      test.ok(!fs.existsSync(path.join(externalTree.directory, 'external_dir')));
      test.ok(!fs.existsSync(path.join(internalTree.directory, 'external_link')));
      test.ok(!fs.existsSync(internalTree.directory));
      test.ok(!fs.existsSync(externalTree.directory));

      test.done();
    },
    'empty directory'(test: Test) {
      // GIVEN
      const tree = `
      ├── dir (D)`;

      // THEN
      const { directory, cleanup } = FsUtils.fromTree('empty-directory', tree);

      test.ok(fs.existsSync(path.join(directory, 'dir')));

      cleanup();

      test.ok(!fs.existsSync(path.join(directory, 'dir')));
      test.ok(!fs.existsSync(directory));

      test.done();
    },
    'works with any indent'(test: Test) {
      // GIVEN
      const tree = `



      ├── foo
      └── dir
       └── subdir
                                        └── bar.txt


                                        `;

      // THEN
      const { directory, cleanup } = FsUtils.fromTree('any-indent', tree);

      test.ok(fs.existsSync(path.join(directory, 'foo')));
      test.ok(fs.existsSync(path.join(directory, 'dir', 'subdir', 'bar.txt')));

      cleanup();

      test.ok(!fs.existsSync(path.join(directory, 'foo')));
      test.ok(!fs.existsSync(path.join(directory, 'dir', 'subdir', 'bar.txt')));
      test.ok(!fs.existsSync(directory));

      test.done();
    },
  },
};