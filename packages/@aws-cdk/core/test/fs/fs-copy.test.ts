import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { FileSystem, SymlinkFollowMode } from '../../lib/fs';

nodeunitShim({
  'Default: copies all files and subdirectories, with default follow mode is "External"'(test: Test) {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir);

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
      '        file3.txt',
    ]);
    test.done();
  },

  'Always: follow all symlinks'(test: Test) {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
      follow: SymlinkFollowMode.ALWAYS,
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
      'normal-file.txt',
    ]);
    test.done();
  },

  'Never: do not follow all symlinks'(test: Test) {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
      follow: SymlinkFollowMode.NEVER,
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
      'normal-file.txt',
    ]);
    test.done();
  },

  'External: follow only external symlinks'(test: Test) {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
      follow: SymlinkFollowMode.EXTERNAL,
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
      'normal-file.txt',
    ]);

    test.done();
  },

  'exclude'(test: Test) {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir, {
      exclude: [
        '*',
        '!subdir2',
        '!subdir2/**/*',
        '.*',
      ],
    });

    // THEN
    test.deepEqual(tree(outdir), [
      'subdir2 (D)',
      '    empty-subdir (D)',
      '    subdir3 (D)',
      '        file3.txt',
    ]);
    test.done();
  },
});

function tree(dir: string, depth = ''): string[] {
  const lines = new Array<string>();
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
