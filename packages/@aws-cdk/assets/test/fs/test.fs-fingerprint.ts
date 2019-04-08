import fs = require('fs');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');
import { copyDirectory } from '../../lib/fs/copy';
import { fingerprint } from '../../lib/fs/fingerprint';

export = {
  'single file'(test: Test) {
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
    const hash1 = fingerprint(input1);
    const hash2 = fingerprint(input2);
    const hash3 = fingerprint(input3);

    // THEN
    test.deepEqual(hash1, hash2);
    test.notDeepEqual(hash3, hash1);
    test.done();
  },

  'empty file'(test: Test) {
    // GIVEN
    const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'hash-tests'));
    const input1 = path.join(workdir, 'empty');
    const input2 = path.join(workdir, 'empty');
    fs.writeFileSync(input1, '');
    fs.writeFileSync(input2, '');

    // WHEN
    const hash1 = fingerprint(input1);
    const hash2 = fingerprint(input2);

    // THEN
    test.deepEqual(hash1, hash2);
    test.done();
  },

  'directory'(test: Test) {
    // GIVEN
    const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
    copyDirectory(srcdir, outdir);

    // WHEN
    const hashSrc = fingerprint(srcdir);
    const hashCopy = fingerprint(outdir);

    // THEN
    test.deepEqual(hashSrc, hashCopy);
    test.done();
  },

  'directory, rename files (fingerprint should change)'(test: Test) {
    // GIVEN
    const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
    const cpydir = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
    copyDirectory(srcdir, cpydir);

    // be careful not to break a symlink
    fs.renameSync(path.join(cpydir, 'normal-dir', 'file-in-subdir.txt'), path.join(cpydir, 'move-me.txt'));

    // WHEN
    const hashSrc = fingerprint(srcdir);
    const hashCopy = fingerprint(cpydir);

    // THEN
    test.notDeepEqual(hashSrc, hashCopy);
    test.done();
  },

  'external symlink content changes (fingerprint should change)'(test: Test) {
    // GIVEN
    const dir1 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
    const dir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
    const target = path.join(dir1, 'boom.txt');
    const content = 'boom';
    fs.writeFileSync(target, content);
    fs.symlinkSync(target, path.join(dir2, 'link-to-boom.txt'));

    // now dir2 contains a symlink to a file in dir1

    // WHEN
    const original = fingerprint(dir2);

    // now change the contents of the target
    fs.writeFileSync(target, 'changning you!');
    const afterChange = fingerprint(dir2);

    // revert the content to original and expect hash to be reverted
    fs.writeFileSync(target, content);
    const afterRevert = fingerprint(dir2);

    // THEN
    test.notDeepEqual(original, afterChange);
    test.deepEqual(afterRevert, original);
    test.done();
  }
};
