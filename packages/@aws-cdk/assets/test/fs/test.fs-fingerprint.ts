import * as fs from 'fs';
import { Test } from 'nodeunit';
import * as os from 'os';
import * as path from 'path';
import * as libfs from '../../lib/fs';

export = {
  files: {
    'does not change with the file name'(test: Test) {
      // GIVEN
      const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'hash-tests'));
      const content = 'Hello, world!';
      const input1 = path.join(workdir, 'input1.txt');
      const input2 = path.join(workdir, 'input2.txt');
      const input3 = path.join(workdir, 'input3.txt');
      fs.writeFileSync(input1, content);
      fs.writeFileSync(input2, content);
      fs.writeFileSync(input3, content + '.'); // add one character, hash should be different

      // WHEN
      const hash1 = libfs.fingerprint(input1);
      const hash2 = libfs.fingerprint(input2);
      const hash3 = libfs.fingerprint(input3);

      // THEN
      test.deepEqual(hash1, hash2);
      test.notDeepEqual(hash3, hash1);
      test.done();
    },

    'works on empty files'(test: Test) {
      // GIVEN
      const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'hash-tests'));
      const input1 = path.join(workdir, 'empty');
      const input2 = path.join(workdir, 'empty');
      fs.writeFileSync(input1, '');
      fs.writeFileSync(input2, '');

      // WHEN
      const hash1 = libfs.fingerprint(input1);
      const hash2 = libfs.fingerprint(input2);

      // THEN
      test.deepEqual(hash1, hash2);
      test.done();
    },
  },

  directories: {
    'works on directories'(test: Test) {
      // GIVEN
      const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
      const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
      libfs.copyDirectory(srcdir, outdir);

      // WHEN
      const hashSrc = libfs.fingerprint(srcdir);
      const hashCopy = libfs.fingerprint(outdir);

      // THEN
      test.deepEqual(hashSrc, hashCopy);
      test.done();
    },

    'ignores requested files'(test: Test) {
      // GIVEN
      const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
      const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
      libfs.copyDirectory(srcdir, outdir);

      // WHEN
      const hashSrc = libfs.fingerprint(srcdir);

      fs.writeFileSync(path.join(outdir, `${hashSrc}.ignoreme`), 'Ignore me!');
      const hashCopy = libfs.fingerprint(outdir, { exclude: ['*.ignoreme'] });

      // THEN
      test.deepEqual(hashSrc, hashCopy);
      test.done();
    },

    'changes with file names'(test: Test) {
      // GIVEN
      const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
      const cpydir = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
      libfs.copyDirectory(srcdir, cpydir);

      // be careful not to break a symlink
      fs.renameSync(path.join(cpydir, 'normal-dir', 'file-in-subdir.txt'), path.join(cpydir, 'move-me.txt'));

      // WHEN
      const hashSrc = libfs.fingerprint(srcdir);
      const hashCopy = libfs.fingerprint(cpydir);

      // THEN
      test.notDeepEqual(hashSrc, hashCopy);
      test.done();
    },
  },

  symlinks: {
    'changes with the contents of followed symlink referent'(test: Test) {
      // GIVEN
      const dir1 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
      const dir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
      const target = path.join(dir1, 'boom.txt');
      const content = 'boom';
      fs.writeFileSync(target, content);
      fs.symlinkSync(target, path.join(dir2, 'link-to-boom.txt'));

      // now dir2 contains a symlink to a file in dir1

      // WHEN
      const original = libfs.fingerprint(dir2);

      // now change the contents of the target
      fs.writeFileSync(target, 'changning you!');
      const afterChange = libfs.fingerprint(dir2);

      // revert the content to original and expect hash to be reverted
      fs.writeFileSync(target, content);
      const afterRevert = libfs.fingerprint(dir2);

      // THEN
      test.notDeepEqual(original, afterChange);
      test.deepEqual(afterRevert, original);
      test.done();
    },

    'does not change with the contents of un-followed symlink referent'(test: Test) {
      // GIVEN
      const dir1 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
      const dir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
      const target = path.join(dir1, 'boom.txt');
      const content = 'boom';
      fs.writeFileSync(target, content);
      fs.symlinkSync(target, path.join(dir2, 'link-to-boom.txt'));

      // now dir2 contains a symlink to a file in dir1

      // WHEN
      const original = libfs.fingerprint(dir2, { follow: libfs.FollowMode.NEVER });

      // now change the contents of the target
      fs.writeFileSync(target, 'changning you!');
      const afterChange = libfs.fingerprint(dir2, { follow: libfs.FollowMode.NEVER });

      // revert the content to original and expect hash to be reverted
      fs.writeFileSync(target, content);
      const afterRevert = libfs.fingerprint(dir2, { follow: libfs.FollowMode.NEVER });

      // THEN
      test.deepEqual(original, afterChange);
      test.deepEqual(afterRevert, original);
      test.done();
    }
  }
};
