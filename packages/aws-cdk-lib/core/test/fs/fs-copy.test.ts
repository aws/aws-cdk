import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { FileSystem, SymlinkFollowMode } from '../../lib/fs';

describe('fs copy', () => {
  test('Default: copies all files and subdirectories, with default follow mode is "External"', () => {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir);

    // THEN
    expect(tree(outdir)).toEqual([
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
  });

  test('Always: follow all symlinks', () => {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
      follow: SymlinkFollowMode.ALWAYS,
    });

    // THEN
    expect(tree(outdir)).toEqual([
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
  });

  test('Never: do not follow all symlinks', () => {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
      follow: SymlinkFollowMode.NEVER,
    });

    // THEN
    expect(tree(outdir)).toEqual([
      'external-dir-link => ../test1/subdir',
      'external-link.txt => ../test1/subdir2/subdir3/file3.txt',
      'indirect-external-link.txt => external-link.txt',
      'local-dir-link => normal-dir',
      'local-link.txt => normal-file.txt',
      'normal-dir (D)',
      '    file-in-subdir.txt',
      'normal-file.txt',
    ]);
  });

  test('External: follow only external symlinks', () => {
    // GIVEN
    const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

    // WHEN
    FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
      follow: SymlinkFollowMode.EXTERNAL,
    });

    // THEN
    expect(tree(outdir)).toEqual([
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
  });

  describe('exclude and include', () => {
    test('exclude', () => {
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
      expect(tree(outdir)).toEqual([
        'subdir2 (D)',
        '    empty-subdir (D)',
        '    subdir3 (D)',
        '        file3.txt',
      ]);
    });

    test('include a file in a directory', () => {
      // GIVEN
      const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

      // WHEN
      FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir, {
        include: [
          'file3.txt',
        ],
      });

      // THEN
      expect(tree(outdir)).toEqual([
        'subdir2 (D)',
        '    subdir3 (D)',
        '        file3.txt',
      ]);
    });

    test('include a file with relative path in a directory', () => {
      // GIVEN
      const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

      // WHEN
      FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir, {
        include: [
          'subdir2/subdir3/file3.txt',
        ],
      });

      // THEN
      expect(tree(outdir)).toEqual([
        'subdir2 (D)',
        '    subdir3 (D)',
        '        file3.txt',
      ]);
    });

    test('include a root file', () => {
      // GIVEN
      const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

      // WHEN
      FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir, {
        include: [
          'file1.txt',
        ],
      });

      // THEN
      expect(tree(outdir)).toEqual([
        'file1.txt',
      ]);
    });

    test('include some files in a directory', () => {
      // GIVEN
      const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

      // WHEN
      FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir, {
        include: [
          'file1.txt',
          'file2.txt',
          'file3.txt',
        ],
      });

      // THEN
      expect(tree(outdir)).toEqual([
        'file1.txt',
        'subdir (D)',
        '    file2.txt',
        'subdir2 (D)',
        '    subdir3 (D)',
        '        file3.txt',
      ]);
    });

    test('include all files in sub directories', () => {
      // GIVEN
      const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

      // WHEN
      FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir, {
        include: [
          'subdir2/**/*',
        ],
      });

      // THEN
      expect(tree(outdir)).toEqual([
        'subdir2 (D)',
        '    empty-subdir (D)',
        '    subdir3 (D)',
        '        file3.txt',
      ]);
    });

    test('exclude takes priority if both include and exclude are specified for the same file', () => {
      // GIVEN
      const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

      // WHEN
      FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir, {
        exclude: [
          'file2.txt',
        ],
        include: [
          'file1.txt',
          'file2.txt',
          'file3.txt',
        ],
      });

      // THEN
      expect(tree(outdir)).toEqual([
        'file1.txt',
        'subdir2 (D)',
        '    subdir3 (D)',
        '        file3.txt',
      ]);
    });

    test('copy all matched contents except subdirectory listed in exclude when its parent directory is included with wildcard pattern', () => {
      // GIVEN
      const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

      // WHEN
      FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir, {
        exclude: [
          'subdir2/subdir3',
        ],
        include: [
          'file1.txt',
          'subdir2/**/*',
        ],
      });

      // THEN
      expect(tree(outdir)).toEqual([
        'file1.txt',
        'subdir2 (D)',
        '    empty-subdir (D)',
      ]);
    });

    describe('exclude with symlinks', () => {
      test('exclude a symlink as a symlink path if SymlinkFollowMode NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.NEVER,
          exclude: [
            'external-link.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([
          'external-dir-link => ../test1/subdir',
          'indirect-external-link.txt => external-link.txt',
          'local-dir-link => normal-dir',
          'local-link.txt => normal-file.txt',
          'normal-dir (D)',
          '    file-in-subdir.txt',
          'normal-file.txt',
        ]);
      });

      test('do not exclude a symlink that does not match but whose target file path matches if SymlinkFollowMode NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.NEVER,
          exclude: [
            'file3.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([
          'external-dir-link => ../test1/subdir',
          'external-link.txt => ../test1/subdir2/subdir3/file3.txt',
          'indirect-external-link.txt => external-link.txt',
          'local-dir-link => normal-dir',
          'local-link.txt => normal-file.txt',
          'normal-dir (D)',
          '    file-in-subdir.txt',
          'normal-file.txt',
        ]);
      });

      test('exclude a symlink that matches but whose target file path does not match if SymlinkFollowMode other than NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.ALWAYS,
          exclude: [
            'external-link.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([
          'external-dir-link (D)',
          '    file2.txt',
          'indirect-external-link.txt',
          'local-dir-link (D)',
          '    file-in-subdir.txt',
          'local-link.txt',
          'normal-dir (D)',
          '    file-in-subdir.txt',
          'normal-file.txt',
        ]);
      });

      test('do not exclude a symlink that does not match but whose target file path matches if SymlinkFollowMode other than NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.ALWAYS,
          exclude: [
            'file3.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([
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
      });
    });

    describe('negate include with symlinks', () => {
      test('exclude a symlink as a symlink path with negate include pattern if SymlinkFollowMode NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.NEVER,
          include: [
            '*',
            '!external-link.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([
          'external-dir-link => ../test1/subdir',
          'indirect-external-link.txt => external-link.txt',
          'local-dir-link => normal-dir',
          'local-link.txt => normal-file.txt',
          'normal-dir (D)',
          '    file-in-subdir.txt',
          'normal-file.txt',
        ]);
      });

      test('do not exclude a symlink that does not match but whose target file path matches with negate include pattern if SymlinkFollowMode NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.NEVER,
          include: [
            '*',
            '!file3.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([
          'external-dir-link => ../test1/subdir',
          'external-link.txt => ../test1/subdir2/subdir3/file3.txt',
          'indirect-external-link.txt => external-link.txt',
          'local-dir-link => normal-dir',
          'local-link.txt => normal-file.txt',
          'normal-dir (D)',
          '    file-in-subdir.txt',
          'normal-file.txt',
        ]);
      });

      test('exclude a symlink that matches but whose target file path does not match with negate include pattern if SymlinkFollowMode other than NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.ALWAYS,
          include: [
            '*',
            '!external-link.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([
          'external-dir-link (D)',
          '    file2.txt',
          'indirect-external-link.txt',
          'local-dir-link (D)',
          '    file-in-subdir.txt',
          'local-link.txt',
          'normal-dir (D)',
          '    file-in-subdir.txt',
          'normal-file.txt',
        ]);
      });

      test('do not exclude a symlink that does not match but whose target file path matches with negate include pattern if SymlinkFollowMode other than NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.ALWAYS,
          include: [
            '*',
            '!file3.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([
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
      });
    });

    describe('include with symlinks', () => {
      test('include a symlink as a symlink path if SymlinkFollowMode NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.NEVER,
          include: [
            'external-link.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([
          'external-link.txt => ../test1/subdir2/subdir3/file3.txt',
        ]);
      });

      test('do not include a symlink that does not match but whose target file path matches if SymlinkFollowMode NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.NEVER,
          include: [
            'file3.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([]);
      });

      test('include a symlink that matches but whose target file path does not match if SymlinkFollowMode other than NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.ALWAYS,
          include: [
            'external-link.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([
          'external-link.txt',
        ]);
      });

      test('do not include a symlink that does not match but whose target file path matches if SymlinkFollowMode other than NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.ALWAYS,
          include: [
            'file3.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([]);
      });
    });

    describe('negate exclude with symlinks', () => {
      test('include a symlink as a symlink path with negate exclude pattern if SymlinkFollowMode NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.NEVER,
          exclude: [
            '*',
            '!external-link.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([
          'external-link.txt => ../test1/subdir2/subdir3/file3.txt',
        ]);
      });

      test('do not include a symlink that does not match but whose target file path matches with negate exclude pattern if SymlinkFollowMode NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.NEVER,
          exclude: [
            '*',
            '!file3.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([]);
      });

      test('include a symlink that matches but whose target file path does not match with negate exclude pattern if SymlinkFollowMode other than NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.ALWAYS,
          exclude: [
            '*',
            '!external-link.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([
          'external-link.txt',
        ]);
      });

      test('do not include a symlink that does not match but whose target file path matches with negate exclude pattern if SymlinkFollowMode other than NEVER', () => {
        // GIVEN
        const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));

        // WHEN
        FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
          follow: SymlinkFollowMode.ALWAYS,
          exclude: [
            '*',
            '!file3.txt', // external-link.txt => ../test1/subdir2/subdir3/file3.txt
          ],
        });

        // THEN
        expect(tree(outdir)).toEqual([]);
      });
    });
  });
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
