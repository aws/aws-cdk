import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { FileSystem, IgnoreMode, SymlinkFollowMode } from '../../lib/fs';
import { contentFingerprint } from '../../lib/fs/fingerprint';

describe('fs fingerprint', () => {
  describe('files', () => {
    test('does not change with the file name', () => {
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
      const hash1 = FileSystem.fingerprint(input1);
      const hash2 = FileSystem.fingerprint(input2);
      const hash3 = FileSystem.fingerprint(input3);

      // THEN
      expect(hash1).toEqual(hash2);
      expect(hash3).not.toEqual(hash1);

    });

    test('works on empty files', () => {
      // GIVEN
      const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'hash-tests'));
      const input1 = path.join(workdir, 'empty');
      const input2 = path.join(workdir, 'empty');
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
    test('works on directories', () => {
      // GIVEN
      const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
      const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
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
      const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
      FileSystem.copyDirectory(srcdir, outdir);

      // WHEN
      const hashSrc = FileSystem.fingerprint(srcdir, { exclude: ['*.ignoreme'] });

      fs.writeFileSync(path.join(outdir, `${hashSrc}.ignoreme`), 'Ignore me!');
      const hashCopy = FileSystem.fingerprint(outdir, { exclude: ['*.ignoreme'] });

      // THEN
      expect(hashSrc).toEqual(hashCopy);

    });

    test('does not ignore requested files with negate modifier', () => {
      // GIVEN
      const srcdir = path.join(__dirname, 'fixtures', 'test1');
      const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-tests'));
      FileSystem.copyDirectory(srcdir, outdir);

      // WHEN
      const hashSrc = FileSystem.fingerprint(srcdir, { exclude: ['*', '!*/', '!*.*'], ignoreMode: IgnoreMode.GIT });
      const hashCopy = FileSystem.fingerprint(outdir, { ignoreMode: IgnoreMode.GIT });

      // THEN
      expect(hashSrc).toEqual(hashCopy);

    });

    test('changes with file names', () => {
      // GIVEN
      const srcdir = path.join(__dirname, 'fixtures', 'symlinks');
      const cpydir = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
      FileSystem.copyDirectory(srcdir, cpydir);

      // be careful not to break a symlink
      fs.renameSync(path.join(cpydir, 'normal-dir', 'file-in-subdir.txt'), path.join(cpydir, 'move-me.txt'));

      // WHEN
      const hashSrc = FileSystem.fingerprint(srcdir);
      const hashCopy = FileSystem.fingerprint(cpydir);

      // THEN
      expect(hashSrc).not.toEqual(hashCopy);

    });
  });

  describe('symlinks', () => {
    test('changes with the contents of followed symlink referent', () => {
      // GIVEN
      const dir1 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
      const dir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
      const target = path.join(dir1, 'boom.txt');
      const content = 'boom';
      fs.writeFileSync(target, content);
      fs.symlinkSync(target, path.join(dir2, 'link-to-boom.txt'));

      // now dir2 contains a symlink to a file in dir1

      // WHEN
      const original = FileSystem.fingerprint(dir2);

      // now change the contents of the target
      fs.writeFileSync(target, 'changning you!');
      const afterChange = FileSystem.fingerprint(dir2);

      // revert the content to original and expect hash to be reverted
      fs.writeFileSync(target, content);
      const afterRevert = FileSystem.fingerprint(dir2);

      // THEN
      expect(original).not.toEqual(afterChange);
      expect(afterRevert).toEqual(original);
    });

    test('does not change with the contents of un-followed symlink referent', () => {
      // GIVEN
      const dir1 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
      const dir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'fingerprint-tests'));
      const target = path.join(dir1, 'boom.txt');
      const content = 'boom';
      fs.writeFileSync(target, content);
      fs.symlinkSync(target, path.join(dir2, 'link-to-boom.txt'));

      // now dir2 contains a symlink to a file in dir1

      // WHEN
      const original = FileSystem.fingerprint(dir2, { follow: SymlinkFollowMode.NEVER });

      // now change the contents of the target
      fs.writeFileSync(target, 'changning you!');
      const afterChange = FileSystem.fingerprint(dir2, { follow: SymlinkFollowMode.NEVER });

      // revert the content to original and expect hash to be reverted
      fs.writeFileSync(target, content);
      const afterRevert = FileSystem.fingerprint(dir2, { follow: SymlinkFollowMode.NEVER });

      // THEN
      expect(original).toEqual(afterChange);
      expect(afterRevert).toEqual(original);

    });
  });

  describe('eol', () => {
    test('normalizes line endings', () => {
      // GIVEN
      const lf = path.join(__dirname, 'eol', 'lf.txt');
      const crlf = path.join(__dirname, 'eol', 'crlf.txt');
      fs.writeFileSync(crlf, fs.readFileSync(lf, 'utf8').replace(/\n/g, '\r\n'));

      const lfStat = fs.statSync(lf);
      const crlfStat = fs.statSync(crlf);

      // WHEN
      const crlfHash = contentFingerprint(crlf);
      const lfHash = contentFingerprint(lf);

      // THEN
      expect(crlfStat.size).not.toEqual(lfStat.size); // Difference in size due to different line endings
      expect(crlfHash).toEqual(lfHash); // Same hash

      fs.unlinkSync(crlf);

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
