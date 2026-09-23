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
