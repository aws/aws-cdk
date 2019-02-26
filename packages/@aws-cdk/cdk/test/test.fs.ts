import fs = require('fs');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');
import { copyDirectory, fingerprint, FollowMode } from '../lib/util/fs';

export = {
  'copy -- Default: copies all files and subdirectories, with default follow mode is "External"'(test: Test) {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    copyDirectory(path.join(__dirname, 'test.fs.fixtures', 'test1'), outdir);

    // THEN
    test.deepEqual(tree(outdir), [
      'external-link.txt',
      'file1.txt',
      'local-link.txt => file1.txt',
      'subdir (D)',
      '    file2.txt',
      'subdir2 (D)',
      '    empty-subdir (D)',
      '        .hidden',
      '    subdir3 (D)',
      '        file3.txt'
    ]);
    test.done();
  },

  'copy -- Always: follow all symlinks'(test: Test) {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    copyDirectory(path.join(__dirname, 'test.fs.fixtures', 'symlinks'), outdir, {
      follow: FollowMode.Always
    });

    // THEN
    test.deepEqual(tree(outdir), [
      'external-dir-link (D)',
      '    file2.txt',
      'external-link.txt',
      'indirect-external-link.txt',
      'local-dir-link (D)',
      '    file-in-subdir.txt',
      'local-link.txt',
      'normal-dir (D)',
      '    file-in-subdir.txt',
      'normal-file.txt'
    ]);
    test.done();
  },

  'copy -- Never: do not follow all symlinks'(test: Test) {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    copyDirectory(path.join(__dirname, 'test.fs.fixtures', 'symlinks'), outdir, {
      follow: FollowMode.Never
    });

    // THEN
    test.deepEqual(tree(outdir), [
      'external-dir-link => ../test1/subdir',
      'external-link.txt => ../test1/subdir2/subdir3/file3.txt',
      'indirect-external-link.txt => external-link.txt',
      'local-dir-link => normal-dir',
      'local-link.txt => normal-file.txt',
      'normal-dir (D)',
      '    file-in-subdir.txt',
      'normal-file.txt'
    ]);
    test.done();
  },

  'copy -- External: follow only external symlinks'(test: Test) {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    copyDirectory(path.join(__dirname, 'test.fs.fixtures', 'symlinks'), outdir, {
      follow: FollowMode.External
    });

    // THEN
    test.deepEqual(tree(outdir), [
      'external-dir-link (D)',
      '    file2.txt',
      'external-link.txt',
      'indirect-external-link.txt => external-link.txt',
      'local-dir-link => normal-dir',
      'local-link.txt => normal-file.txt',
      'normal-dir (D)',
      '    file-in-subdir.txt',
      'normal-file.txt'
    ]);

    test.done();
  },

  'copy -- exclude'(test: Test) {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    copyDirectory(path.join(__dirname, 'test.fs.fixtures', 'test1'), outdir, {
      exclude: [
        '*',
        '!subdir2',
        '!subdir2/**/*',
        '.*'
      ]
    });

    // THEN
    test.deepEqual(tree(outdir), [
      'subdir2 (D)',
      '    empty-subdir (D)',
      '    subdir3 (D)',
      '        file3.txt'
    ]);
    test.done();
  },

  'fingerprint -- single file'(test: Test) {
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

  'fingerprint -- empty file'(test: Test) {
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

  'fingerprint -- directory'(test: Test) {
    // GIVEN
    const srcdir = path.join(__dirname, 'test.fs.fixtures', 'symlinks');
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
    copyDirectory(srcdir, outdir);

    // WHEN
    const hashSrc = fingerprint(srcdir);
    const hashCopy = fingerprint(outdir);

    // THEN
    test.deepEqual(hashSrc, hashCopy);
    test.done();
  },

  'fingerprint -- directory, rename files (fingerprint should change)'(test: Test) {
    // GIVEN
    const srcdir = path.join(__dirname, 'test.fs.fixtures', 'symlinks');
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

  'fingerprint - external symlink content changes (fingerprint should change)'(test: Test) {
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

function tree(dir: string, depth = ''): string[] {
  const lines = [];
  for (const file of fs.readdirSync(dir).sort()) {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);
    if (stat.isSymbolicLink()) {
      const linkDest = fs.readlinkSync(filePath);
      lines.push(depth + file + ' => ' + linkDest);
    } else if (stat.isDirectory()) {
      lines.push(depth + file + ' (D)');
      lines.push(...tree(filePath, depth + '    '));
    } else {
      lines.push(depth + file);
    }
  }
  return lines;
}