import fs = require('fs');
import { Test } from 'nodeunit';
import path = require('path');
import { FsUtils } from '../lib';

export = {
  fromTree: {
    'basic usage'(test: Test) {
      // GIVEN
      const tree = `
      ├── foo
      └── dir
        └── subdir
          └── bar.txt`;

      // THEN
      const {directory, cleanup} = FsUtils.fromTree('basic-usage', tree);

      test.ok(fs.existsSync(path.join(directory, 'foo')));
      test.ok(fs.existsSync(path.join(directory, 'dir', 'subdir', 'bar.txt')));

      cleanup();

      test.ok(!fs.existsSync(path.join(directory, 'foo')));
      test.ok(!fs.existsSync(path.join(directory, 'dir', 'subdir', 'bar.txt')));
      test.ok(!fs.existsSync(directory));

      test.done();
    },
    'works with any indent'(test: Test) {
      // GIVEN
      const tree = `
      ├── foo
      └── dir
       └── subdir
                                        └── bar.txt`;

      // THEN
      const {directory, cleanup} = FsUtils.fromTree('basic-usage', tree);

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