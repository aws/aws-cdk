import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { App, CfnResource, Stack } from '../../lib';

/**
 * Regression test for https://github.com/aws/aws-cdk/issues/38295
 *
 * Since aws-cdk-lib v2.258.0, `cdk synth` crashed with
 *   EISDIR: illegal operation on a directory, read
 * whenever a policy validation plugin was registered AND the cloud assembly
 * contained a symlink-to-directory (e.g. produced by asset staging with
 * SymlinkFollowMode.NEVER, or Docker bundling output).
 *
 * Root cause was in core/lib/private/synthesis-validation.ts:
 *  - collectFilePaths() treated the dir-symlink as a plain file (isDirectory()
 *    is false for a symlink), then
 *  - hashFile() called fs.readFileSync() on it -> EISDIR.
 *
 * This is the core-only variant: it seeds a symlink-to-directory directly into
 * the cloud assembly outdir before synth, which is exactly what
 * snapshotFileHashes() walks at the start of doInvokeValidationPlugins(). It
 * avoids a cross-module dependency on aws-s3-assets from core/test.
 */
describe('policy validation plugins tolerate symlinks in the cloud assembly (#38295)', () => {
  let outdir: string;

  beforeEach(() => {
    outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-symlink-asm-'));
  });

  afterEach(() => {
    fs.rmSync(outdir, { recursive: true, force: true });
  });

  test('synth succeeds with a symlink-to-directory in the assembly', () => {
    const app = new App({
      outdir,
      policyValidationBeta1: [
        { name: 'noop', validate: () => ({ success: true, violations: [] }) },
      ],
    });
    const stack = new Stack(app, 'Stack');
    new CfnResource(stack, 'Res', {
      type: 'Test::Resource::Fake',
      properties: { result: 'success' },
    });

    // Seed the offending artifact into the assembly dir BEFORE synth, so the
    // pre-plugin snapshot in snapshotFileHashes() walks it.
    fs.mkdirSync(path.join(outdir, 'seed-target'));
    fs.writeFileSync(path.join(outdir, 'seed-target', 'f.txt'), 'x');
    const seedLink = path.join(outdir, 'seed-link');
    fs.symlinkSync('seed-target', seedLink, 'dir');

    // Before the fix this threw "EISDIR: illegal operation on a directory, read".
    expect(() => app.synth()).not.toThrow();

    // Guard against a vacuous pass: the symlink-to-directory must still be
    // present in the assembly, otherwise we would not be exercising the bug.
    expect(fs.lstatSync(seedLink).isSymbolicLink()).toBe(true);
  });
});

/**
 * Regression test for https://github.com/aws/aws-cdk/issues/38653
 *
 * On Windows, `cdk.out` can contain **directory reparse points** whose tag libuv
 * cannot `readlink()` — Cloud Files placeholders (OneDrive/Dropbox,
 * IO_REPARSE_TAG_CLOUD_*), ProjFS, dedup, WCI, volume-GUID junctions, etc. For
 * these, libuv's `fs__scandir` classifies the entry as a symlink in
 * `readdirSync({ withFileTypes: true })` (because it checks
 * FILE_ATTRIBUTE_REPARSE_POINT before FILE_ATTRIBUTE_DIRECTORY), but
 * `fs__readlink_handle` refuses the tag and `fs__stat_impl` retries with
 * do_lstat = 0, so `lstatSync()` reports it as an ordinary directory.
 *
 * `hashFile()` in `synthesis-validation.ts` then calls `readFileSync()` on what
 * is really a directory and throws `EISDIR`, crashing `cdk synth`. The prior
 * fix in #38299 only covers real symlinks-to-directory on POSIX; it does not
 * cover this case because it structurally relies on `lstat` reporting the path
 * as a symlink, which it never does for these tags.
 *
 * We can't easily manufacture a real reparse point on POSIX CI (would need
 * `mountvol` on Windows, or a cloud sync engine). So we capture the invariant
 * with a mock: force `readdirSync({ withFileTypes: true })` to report a real
 * directory as a symbolic-link entry, leave `lstatSync` honest, and assert
 * `app.synth()` no longer crashes.
 */
describe('policy validation plugins tolerate readdir/lstat disagreement (#38653)', () => {
  let outdir: string;
  let originalReaddirSync: typeof fs.readdirSync | undefined;

  beforeEach(() => {
    outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-reparse-asm-'));
  });

  afterEach(() => {
    if (originalReaddirSync) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('fs').readdirSync = originalReaddirSync;
      originalReaddirSync = undefined;
    }
    fs.rmSync(outdir, { recursive: true, force: true });
  });

  test('synth succeeds when readdir classifies a directory as a symlink (Windows reparse-point behavior)', () => {
    const app = new App({
      outdir,
      policyValidationBeta1: [
        { name: 'noop', validate: () => ({ success: true, violations: [] }) },
      ],
    });
    const stack = new Stack(app, 'Stack');
    new CfnResource(stack, 'Res', {
      type: 'Test::Resource::Fake',
      properties: { result: 'success' },
    });

    // Seed a real directory that the pre-plugin snapshot in snapshotFileHashes()
    // will walk. We give it a child so its Dirent survives readdir.
    const reparseLookalike = path.join(outdir, 'reparse-lookalike');
    fs.mkdirSync(reparseLookalike);
    fs.writeFileSync(path.join(reparseLookalike, 'child.txt'), 'inside');

    // Force libuv-on-Windows behavior for this one entry: readdir says "symlink",
    // lstat (untouched) says "directory". Any other readdir call — different
    // path, no withFileTypes option — passes through unchanged. jest.spyOn on
    // the fs module doesn't work in Node 20 (readdirSync is exposed via a
    // non-configurable getter on the ES-module namespace), so we mutate the
    // underlying CommonJS module.exports directly and restore in afterEach.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fsMutable: any = require('fs');
    originalReaddirSync = fsMutable.readdirSync;
    const passthrough = originalReaddirSync;
    fsMutable.readdirSync = ((...args: any[]) => {
      const [dirPath, options] = args;
      const entries = (passthrough as any).apply(fsMutable, args);
      const wantsFileTypes = options && typeof options === 'object' && options.withFileTypes;
      if (!wantsFileTypes || typeof dirPath !== 'string' || path.resolve(dirPath) !== path.resolve(outdir)) {
        return entries;
      }
      return (entries as fs.Dirent[]).map((entry) => {
        if (entry.name !== 'reparse-lookalike') return entry;
        // Match what libuv reports for a directory reparse point whose tag
        // it cannot readlink(): isSymbolicLink() === true, isDirectory() === false.
        const proxy = Object.create(entry);
        proxy.isSymbolicLink = () => true;
        proxy.isDirectory = () => false;
        proxy.isFile = () => false;
        return proxy;
      });
    }) as typeof fs.readdirSync;

    // Before the fix this threw "EISDIR: illegal operation on a directory, read"
    // because hashFile() reached readFileSync() on the seeded directory.
    expect(() => app.synth()).not.toThrow();

    // Guard against a vacuous pass: the invariant that triggers the bug must
    // still hold — readdir reports "symlink", lstat reports "directory".
    const spoofedEntry = (fs.readdirSync(outdir, { withFileTypes: true }) as fs.Dirent[])
      .find((e) => e.name === 'reparse-lookalike');
    expect(spoofedEntry?.isSymbolicLink()).toBe(true);
    expect(fs.lstatSync(reparseLookalike).isDirectory()).toBe(true);
    expect(fs.lstatSync(reparseLookalike).isSymbolicLink()).toBe(false);
  });
});
