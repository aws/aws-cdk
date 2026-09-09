import fs from 'fs';
import * as os from 'os';
import path from 'path';
import { FileSystem, IgnoreMode, SymlinkFollowMode } from '../../lib/fs';
import { contentFingerprint } from '../../lib/fs/fingerprint';
import '../../lib/private/dispose-polyfill';

describe('fs fingerprint', () => {
  describe('files', () => {
    test('does not change with the file name', () => {
      // GIVEN
      using workdir = tempdir('hash-tests');
      const content = 'Hello, world!';
      const input1 = path.join(workdir.dir, 'input1.txt');
      const input2 = path.join(workdir.dir, 'input2.txt');
      const input3 = path.join(workdir.dir, 'input3.txt');
      fs.writeFileSync(input1, content);
      fs.writeFileSync(input2, content);
      fs.writeFileSync(input3, content + '.'); // add one character, hash should be different

      // WHEN
      const hash1 = FileSystem.fingerprint(input1);
      const hash2 = FileSystem.fingerprint(input2);
      const hash3 = FileSystem.fingerprint(input3);

      // THEN
      expect(hash1).toEqual(hash2);
      expect(hash3).not.toEqual(hash1);
    });

    test('works on empty files', () => {
      // GIVEN
      using workdir = tempdir('hash-tests');
      const input1 = path.join(workdir.dir, 'empty');
      const input2 = path.join(workdir.dir, 'empty');
      fs.writeFileSync(input1, '');
      fs.writeFileSync(input2, '');

      // WHEN
      const hash1 = FileSystem.fingerprint(input1);
      const hash2 = FileSystem.fingerprint(input2);

      // THEN
      expect(hash1).toEqual(hash2);
    });
  });

  describe('directories', () => {
    let outdir: string;
    beforeEach(() => {
      outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
    });

    afterEach(() => {
      fs.rmSync(outdir, { force: true, recursive: true });
    });

    test('works on directories', () => {
      // GIVEN
      const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
      FileSystem.copyDirectory(srcdir, outdir);

      // WHEN
      const hashSrc = FileSystem.fingerprint(srcdir);
      const hashCopy = FileSystem.fingerprint(outdir);

      // THEN
      expect(hashSrc).toEqual(hashCopy);
    });

    test('ignores requested files', () => {
      // GIVEN
      const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
      FileSystem.copyDirectory(srcdir, outdir);

      // WHEN
      const hashSrc = FileSystem.fingerprint(srcdir, { exclude: ['*.ignoreme'] });

      fs.writeFileSync(path.join(outdir, `${hashSrc}.ignoreme`), 'Ignore me!');
      const hashCopy = FileSystem.fingerprint(outdir, { exclude: ['*.ignoreme'] });

      // THEN
      expect(hashSrc).toEqual(hashCopy);
    });

    test('changes with file names', () => {
      // GIVEN
      const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
      using cpydir = tempdir('fingerprint-tests');
      FileSystem.copyDirectory(srcdir, cpydir.dir);

      // be careful not to break a symlink
      fs.renameSync(path.join(cpydir.dir, 'normal-dir', 'file-in-subdir.txt'), path.join(cpydir.dir, 'move-me.txt'));

      // WHEN
      const hashSrc = FileSystem.fingerprint(srcdir);
      const hashCopy = FileSystem.fingerprint(cpydir.dir);

      // THEN
      expect(hashSrc).not.toEqual(hashCopy);
    });

    test('changes with negated gitignore patterns inside ignored directories', () => {
      // GIVEN
      const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
      using cpydir = tempdir('fingerprint-tests');
      FileSystem.copyDirectory(srcdir, cpydir.dir);

      // Add a new file that is inside an ignored directory, but has a negated pattern that includes it.
      const newFile = path.join(cpydir.dir, 'ignored-dir', 'not-ignored-anymore.html');
      fs.mkdirSync(path.dirname(newFile), { recursive: true });
      fs.writeFileSync(newFile, '<h1>Do not ignore me!</h1>');

      // WHEN
      const hashSrc = FileSystem.fingerprint(srcdir, { exclude: ['*', '!*.html', '!*/'], ignoreMode: IgnoreMode.GIT });
      const hashCopy = FileSystem.fingerprint(cpydir.dir, { exclude: ['*', '!*.html', '!*/'], ignoreMode: IgnoreMode.GIT });

      // THEN
      expect(hashSrc).not.toEqual(hashCopy);
    });
  });

  describe('symlinks', () => {
    test('changes with the contents of followed symlink referent', () => {
      // GIVEN
      using dir1 = tempdir('fingerprint-tests');
      using dir2 = tempdir('fingerprint-tests');
      const target = path.join(dir1.dir, 'boom.txt');
      const content = 'boom';
      fs.writeFileSync(target, content);
      fs.symlinkSync(target, path.join(dir2.dir, 'link-to-boom.txt'));

      // now dir2 contains a symlink to a file in dir1

      // WHEN
      const original = FileSystem.fingerprint(dir2.dir);

      // now change the contents of the target
      fs.writeFileSync(target, 'changning you!');
      const afterChange = FileSystem.fingerprint(dir2.dir);

      // revert the content to original and expect hash to be reverted
      fs.writeFileSync(target, content);
      const afterRevert = FileSystem.fingerprint(dir2.dir);

      // THEN
      expect(original).not.toEqual(afterChange);
      expect(afterRevert).toEqual(original);
    });

    test('does not change with the contents of un-followed symlink referent', () => {
      // GIVEN
      using dir1 = tempdir('fingerprint-tests');
      using dir2 = tempdir('fingerprint-tests');
      const target = path.join(dir1.dir, 'boom.txt');
      const content = 'boom';
      fs.writeFileSync(target, content);
      fs.symlinkSync(target, path.join(dir2.dir, 'link-to-boom.txt'));

      // now dir2 contains a symlink to a file in dir1

      // WHEN
      const original = FileSystem.fingerprint(dir2.dir, { follow: SymlinkFollowMode.NEVER });

      // now change the contents of the target
      fs.writeFileSync(target, 'changning you!');
      const afterChange = FileSystem.fingerprint(dir2.dir, { follow: SymlinkFollowMode.NEVER });

      // revert the content to original and expect hash to be reverted
      fs.writeFileSync(target, content);
      const afterRevert = FileSystem.fingerprint(dir2.dir, { follow: SymlinkFollowMode.NEVER });

      // THEN
      expect(original).toEqual(afterChange);
      expect(afterRevert).toEqual(original);
    });

    test('changes when following directory symlinks with negated gitignore patterns', () => {
      // GIVEN
      using srcdir = tempdir('fingerprint-tests');
      fs.mkdirSync(path.join(srcdir.dir, 'subdir'), { recursive: true });
      fs.writeFileSync(path.join(srcdir.dir, 'subdir', 'page.html'), '<h1>Hello, world!</h1>');

      using cpydir = tempdir('fingerprint-tests');
      FileSystem.copyDirectory(srcdir.dir, cpydir.dir);
      fs.symlinkSync(path.join(cpydir.dir, 'subdir'), path.join(cpydir.dir, 'link-to-dir'));

      // WHEN
      const options = { exclude: ['*', '!*.html', '!*/'], ignoreMode: IgnoreMode.GIT, follow: SymlinkFollowMode.ALWAYS };
      const hashSrc = FileSystem.fingerprint(srcdir.dir, options);
      const hashCpy = FileSystem.fingerprint(cpydir.dir, options);

      // THEN
      expect(hashSrc).not.toEqual(hashCpy);
    });

    test('does not change when not following directory symlinks with negated gitignore patterns', () => {
      // GIVEN
      using srcdir = tempdir('fingerprint-tests');
      fs.mkdirSync(path.join(srcdir.dir, 'subdir'), { recursive: true });
      fs.writeFileSync(path.join(srcdir.dir, 'subdir', 'page.html'), '<h1>Hello, world!</h1>');

      using cpydir = tempdir('fingerprint-tests');
      FileSystem.copyDirectory(srcdir.dir, cpydir.dir);
      fs.symlinkSync(path.join(cpydir.dir, 'subdir'), path.join(cpydir.dir, 'link-to-dir'));

      // WHEN
      const options = { exclude: ['*', '!*.html', '!*/'], ignoreMode: IgnoreMode.GIT, follow: SymlinkFollowMode.NEVER };
      const hashSrc = FileSystem.fingerprint(srcdir.dir, options);
      const hashCpy = FileSystem.fingerprint(cpydir.dir, options);

      // THEN
      expect(hashSrc).toEqual(hashCpy);
    });

    test('dangling symlink is hashed as a link (not followed)', () => {
      // GIVEN
      using dir = tempdir('fingerprint-tests');
      fs.symlinkSync('/nonexistent/path/to/nowhere', path.join(dir.dir, 'dangling'));

      // WHEN/THEN — should not throw, should produce a stable hash
      const hash1 = FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.ALWAYS });
      const hash2 = FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.ALWAYS });
      expect(hash1).toEqual(hash2);
    });

    test('symlink to external directory is followed in EXTERNAL mode', () => {
      // GIVEN
      using externalDir = tempdir('fingerprint-external');
      fs.writeFileSync(path.join(externalDir.dir, 'file.txt'), 'external content');

      using dir = tempdir('fingerprint-tests');
      fs.symlinkSync(externalDir.dir, path.join(dir.dir, 'ext-link'));

      // WHEN
      const hash1 = FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.EXTERNAL });

      // Change the external file — hash should change since we follow
      fs.writeFileSync(path.join(externalDir.dir, 'file.txt'), 'modified');
      const hash2 = FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.EXTERNAL });

      // THEN
      expect(hash1).not.toEqual(hash2);
    });

    test('symlink to internal directory is NOT followed in EXTERNAL mode', () => {
      // GIVEN
      using dir = tempdir('fingerprint-tests');
      fs.mkdirSync(path.join(dir.dir, 'subdir'));
      fs.writeFileSync(path.join(dir.dir, 'subdir', 'file.txt'), 'content');
      fs.symlinkSync(path.join(dir.dir, 'subdir'), path.join(dir.dir, 'internal-link'));

      // WHEN
      const hash1 = FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.EXTERNAL });

      // Change the file — hash should still change because we traverse subdir directly
      // But the internal-link should be hashed as a link, not followed
      fs.writeFileSync(path.join(dir.dir, 'subdir', 'file.txt'), 'modified');
      const hash2 = FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.EXTERNAL });

      // THEN — hash changes because subdir/file.txt is traversed directly
      expect(hash1).not.toEqual(hash2);
    });

    test('absolute symlink targets are resolved correctly', () => {
      // GIVEN
      using externalDir = tempdir('fingerprint-external');
      fs.writeFileSync(path.join(externalDir.dir, 'target.txt'), 'hello');

      using dir = tempdir('fingerprint-tests');
      // Create an absolute symlink to a file
      fs.symlinkSync(path.join(externalDir.dir, 'target.txt'), path.join(dir.dir, 'abs-link.txt'));

      // WHEN
      const hash = FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.EXTERNAL });

      // THEN — should not throw and produce a deterministic hash
      expect(hash).toEqual(FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.EXTERNAL }));
    });

    test('relative symlink targets are resolved correctly', () => {
      // GIVEN
      using dir = tempdir('fingerprint-tests');
      fs.mkdirSync(path.join(dir.dir, 'subdir'));
      fs.writeFileSync(path.join(dir.dir, 'target.txt'), 'hello');
      // Create a relative symlink: subdir/link -> ../target.txt
      fs.symlinkSync('../target.txt', path.join(dir.dir, 'subdir', 'rel-link.txt'));

      // WHEN — internal relative symlink, EXTERNAL mode should NOT follow
      const hash = FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.EXTERNAL });

      // Change target — hash should NOT change since internal link is not followed
      const hashBefore = hash;
      fs.writeFileSync(path.join(dir.dir, 'target.txt'), 'changed');
      // But the direct file IS traversed, so hash changes from that
      const hashAfter = FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.EXTERNAL });
      expect(hashBefore).not.toEqual(hashAfter);
    });

    test('non-normalized absolute symlink target that escapes the root is followed in EXTERNAL mode', () => {
      // GIVEN
      using externalDir = tempdir('fingerprint-external');
      fs.writeFileSync(path.join(externalDir.dir, 'file.txt'), 'external content');

      using dir = tempdir('fingerprint-tests');
      // Absolute target containing a '..' segment. Before normalization the raw
      // string would not be recognised as escaping `dir`, so it must be resolved
      // (path.resolve) before classifying it as internal/external.
      const nonNormalized = path.join(dir.dir, '..', path.basename(externalDir.dir), 'file.txt');
      fs.symlinkSync(nonNormalized, path.join(dir.dir, 'ext-link.txt'));

      // WHEN — the target resolves outside `dir`, so EXTERNAL mode follows it
      const hash1 = FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.EXTERNAL });

      // Change the external file — hash should change since we follow the link
      fs.writeFileSync(path.join(externalDir.dir, 'file.txt'), 'modified content of a different length');
      const hash2 = FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.EXTERNAL });

      // THEN
      expect(hash1).not.toEqual(hash2);
    });

    test('symlink to a sibling directory sharing the root name prefix is followed in EXTERNAL mode', () => {
      // GIVEN — two sibling dirs where one name is a string prefix of the other.
      using parent = tempdir('fingerprint-parent');
      const rootDir = path.join(parent.dir, 'app');
      const siblingDir = path.join(parent.dir, 'app-sibling');
      fs.mkdirSync(rootDir);
      fs.mkdirSync(siblingDir);
      fs.writeFileSync(path.join(siblingDir, 'file.txt'), 'sibling content');
      // Link inside `app` pointing at the sibling `app-sibling` (NOT inside app).
      fs.symlinkSync(siblingDir, path.join(rootDir, 'sibling-link'));

      // WHEN
      const hash1 = FileSystem.fingerprint(rootDir, { follow: SymlinkFollowMode.EXTERNAL });

      // Change the sibling's file — hash must change because the sibling is
      // external to `app` and therefore followed in EXTERNAL mode.
      fs.writeFileSync(path.join(siblingDir, 'file.txt'), 'modified content of a different length');
      const hash2 = FileSystem.fingerprint(rootDir, { follow: SymlinkFollowMode.EXTERNAL });

      // THEN
      expect(hash1).not.toEqual(hash2);
    });

    test('symlink pointing to another symlink is resolved transitively', () => {
      // GIVEN
      using externalDir = tempdir('fingerprint-external');
      fs.writeFileSync(path.join(externalDir.dir, 'real-file.txt'), 'the real content');
      // First symlink: external dir has a symlink to the real file
      fs.symlinkSync(path.join(externalDir.dir, 'real-file.txt'), path.join(externalDir.dir, 'link1.txt'));

      using dir = tempdir('fingerprint-tests');
      // Second symlink: our dir has a symlink to the first symlink
      fs.symlinkSync(path.join(externalDir.dir, 'link1.txt'), path.join(dir.dir, 'link2.txt'));

      // WHEN — statSync follows the full chain, so content of real-file.txt is hashed
      const hash1 = FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.EXTERNAL });

      fs.writeFileSync(path.join(externalDir.dir, 'real-file.txt'), 'modified content of definitely different length');
      const hash2 = FileSystem.fingerprint(dir.dir, { follow: SymlinkFollowMode.EXTERNAL });

      // THEN — hash changes because we follow through to the real file
      expect(hash1).not.toEqual(hash2);
    });
  });

  describe('eol', () => {
    test('normalizes line endings', () => {
      // GIVEN
      using tmpDir = tempdir('eol');
      const message = 'hello word\nthis a new line!\n';

      const lf = path.join(tmpDir.dir, 'lf.txt');
      const crlf = path.join(tmpDir.dir, 'crlf.txt');

      fs.writeFileSync(lf, message, 'utf-8');
      fs.writeFileSync(crlf, message.replace(/\n/g, '\r\n'), 'utf-8');

      const lfStat = fs.statSync(lf);
      const crlfStat = fs.statSync(crlf);

      // WHEN
      const crlfHash = contentFingerprint(crlf);
      const lfHash = contentFingerprint(lf);

      // THEN
      expect(crlfStat.size).not.toEqual(lfStat.size); // Difference in size due to different line endings
      expect(crlfHash).toEqual(lfHash); // Same hash
    });
  });

  // The fingerprint cache is only enabled for node v12 and higher as older
  // versions can have false positive inode comparisons due to floating point
  // rounding error.
  const describe_nodev12 = Number(process.versions.node.split('.')[0]) < 12 ? describe.skip : describe;
  describe_nodev12('fingerprint cache', () => {
    const testString = 'hello world';
    const testFile = path.join(__dirname, 'inode-fp.1');
    // This always-false ternary is just to help typescript infer the type properly
    let openSyncSpy = false ? jest.spyOn(fs, 'openSync') : undefined;

    // Create a very large test file
    beforeAll(() => {
      const file = fs.openSync(testFile, 'w');
      fs.writeSync(file, testString);
      fs.closeSync(file);
      openSyncSpy = jest.spyOn(fs, 'openSync');
    });

    afterAll(() => {
      fs.unlinkSync(testFile);
      openSyncSpy?.mockRestore();
    });

    test('caches fingerprint results', () => {
      const hash1 = FileSystem.fingerprint(testFile, {});
      const hash2 = FileSystem.fingerprint(testFile, {});

      expect(hash1).toEqual(hash2);
      expect(openSyncSpy).toHaveBeenCalledTimes(1);
    });

    test('considers mtime', () => {
      const hash1 = FileSystem.fingerprint(testFile, {});

      const file = fs.openSync(testFile, 'r+');
      fs.writeSync(file, 'foobar');
      fs.closeSync(file);

      // Update mtime to a value that is guaranteed to be different even if the tests run... fast!
      const fileStat = fs.statSync(testFile, { bigint: true });
      fs.utimesSync(testFile, fileStat.atime, new Date(1337));

      const hash2 = FileSystem.fingerprint(testFile, {});

      expect(hash1).not.toEqual(hash2);
      expect(openSyncSpy).toHaveBeenCalledTimes(3);
    });
  });

  test('normalizes relative path', () => {
    // Simulate a Windows path.relative()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalPathRelative = path.relative;
    const pathRelativeSpy = jest.spyOn(path, 'relative').mockImplementation((from: string, to: string): string => {
      return originalPathRelative(from, to).replace(/\//g, '\\');
    });

    const hash1 = FileSystem.fingerprint(path.join(__dirname, 'fixtures', 'test1'));

    // Restore Linux behavior
    pathRelativeSpy.mockRestore();

    const hash2 = FileSystem.fingerprint(path.join(__dirname, 'fixtures', 'test1'));

    // Relative paths are normalized
    expect(hash1).toEqual(hash2);
  });
});

function tempdir(prefix: string) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));

  return {
    dir,
    [Symbol.dispose]() {
      fs.rmSync(dir, { force: true, recursive: true });
    },
  };
}
