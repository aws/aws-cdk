/**
 * Check that the imports from 'aws-cdk-lib' we expect to work, work, and those we have shielded off don't work.
 */
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';

async function main() {
  // First make a tempdir and symlink `aws-cdk-lib` into it so we can refer to it
  // as if it was an installed module.
  await withTemporaryDirectory(async (tmpDir) => {
    await fs.mkdirp(path.join(tmpDir, 'node_modules'));
    await fs.symlink(path.resolve(__dirname, '..'), path.join(tmpDir, 'node_modules', 'aws-cdk-lib'));

    assertImportSucceeds('aws-cdk-lib');
    assertImportFails('aws-cdk-lib/LICENSE', 'ERR_PACKAGE_PATH_NOT_EXPORTED');
    assertImportFails('aws-cdk-lib/aws-s3/lib/bucket', 'ERR_PACKAGE_PATH_NOT_EXPORTED');
    assertImportSucceeds('aws-cdk-lib/aws-s3');

    function assertImportSucceeds(name: string) {
      require.resolve(name, { paths: [tmpDir] });
    }

    function assertImportFails(name: string, code: string) {
      try {
        require.resolve(name, { paths: [tmpDir] });

        // eslint-disable-next-line no-console
        console.error(`Import of '${name}' should have produced an error, but didn't.`);
        process.exitCode = 1;
      } catch (e: any) {
        if (e.code !== code) {
          // eslint-disable-next-line no-console
          console.error(`Import of '${name}' should have produced error ${code}, but got ${(e as any).code}.`);
          process.exitCode = 1;
        }
      }
    }
  });
}


export async function withTemporaryDirectory<T>(callback: (dir: string) => Promise<T>): Promise<T> {
  const tmpdir = await fs.mkdtemp(path.join(os.tmpdir(), path.basename(__filename)));
  try {
    return await callback(tmpdir);
  } finally {
    await fs.remove(tmpdir);
  }
}


main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
