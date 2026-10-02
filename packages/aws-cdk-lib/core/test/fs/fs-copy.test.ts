import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { FileSystem, IgnoreMode, SymlinkFollowMode } from '../../lib/fs';

describe('fs copy', () => {
  let outdir: string;
  beforeEach(() => {
    outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
  });

  afterEach(() => {
    fs.rmSync(outdir, { force: true, recursive: true });
  });

  test('Default: copies all files and subdirectories, with default follow mode is "External"', () => {
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
      'subdir4 (D)',
      '    file4.txt',
      '    local-link4.txt => file4.txt',
    ]);
  });

  test('Always: follow all symlinks', () => {
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

  test('BlockExternal: fails on a symlink pointing outside the tree', () => {
    // THEN
    expect(() => FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'symlinks'), outdir, {
      follow: SymlinkFollowMode.BLOCK_EXTERNAL,
    })).toThrow(/is an external symbolic link which is forbidden/);
  });

  test('BlockExternal: follow only internal symlinks', () => {
    // WHEN — 'subdir4' holds 'local-link4.txt', pointing at its sibling 'file4.txt'
    FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1', 'subdir4'), outdir, {
      follow: SymlinkFollowMode.BLOCK_EXTERNAL,
    });

    // THEN — the internal link is followed, so it arrives as a regular file rather than a link
    expect(tree(outdir)).toEqual([
      'file4.txt',
      'local-link4.txt',
    ]);
    expect(fs.readFileSync(path.join(outdir, 'local-link4.txt'), 'utf8'))
      .toEqual(fs.readFileSync(path.join(__dirname, 'fixtures', 'test1', 'subdir4', 'file4.txt'), 'utf8'));
  });

  // Built here rather than checked in as a fixture: the link target has to be an absolute path,
  // which differs per machine, and `fixtures/` is re-extracted from a tarball on every build.
  test('a link into the tree is copied as a link into the copy, so the copy stands on its own', () => {
    // GIVEN — 'absolute-link' is written as an absolute path that only reaches back inside the
    // tree through 'alias', a symlink living outside it. Copied verbatim it would point at the
    // original tree rather than at the copy.
    const base = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'copy-src')));
    const srcDir = path.join(base, 'root');
    fs.mkdirSync(path.join(srcDir, 'nested'), { recursive: true });
    fs.writeFileSync(path.join(srcDir, 'nested', 'file.txt'), 'content');
    fs.symlinkSync(srcDir, path.join(base, 'alias'));
    fs.symlinkSync(path.join(base, 'alias', 'nested', 'file.txt'), path.join(srcDir, 'absolute-link'));

    // WHEN — the default follow mode keeps links that point inside the tree as links
    FileSystem.copyDirectory(srcDir, outdir);

    // THEN
    expect(tree(outdir)).toEqual([
      'absolute-link => nested/file.txt',
      'nested (D)',
      '    file.txt',
    ]);

    // The copy still works once the tree it was made from is gone
    fs.rmSync(base, { force: true, recursive: true });
    expect(fs.readFileSync(path.join(outdir, 'absolute-link'), 'utf8')).toEqual('content');
  });

  test('exclude', () => {
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

  test('nested exclude with docker ignore mode', () => {
    // WHEN
    FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir, {
      exclude: [
        '**',
        '!subdir2/subdir3/*.txt',
        '!subdir/file2.txt',
        'subdir',
        '!local-link.txt',
      ],
      ignoreMode: IgnoreMode.DOCKER,
    });

    // THEN
    expect(tree(outdir)).toEqual([
      'local-link.txt => file1.txt',
      'subdir2 (D)',
      '    subdir3 (D)',
      '        file3.txt',
    ]);
  });

  test('negated pattern inside subdirectory with git ignore mode', () => {
    // WHEN
    FileSystem.copyDirectory(path.join(__dirname, 'fixtures', 'test1'), outdir, {
      exclude: [
        '*',
        '!.hidden',
        '!*/',
      ],
      ignoreMode: IgnoreMode.GIT,
    });

    // THEN
    expect(tree(outdir)).toEqual([
      'subdir2 (D)',
      '    empty-subdir (D)',
      '        .hidden',
    ]);
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
