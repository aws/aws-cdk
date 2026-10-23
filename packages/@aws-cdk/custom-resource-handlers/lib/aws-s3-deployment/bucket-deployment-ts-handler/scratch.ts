/**
 * Scratch space for archives that are too big to hold in memory.
 */
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

/**
 * Run `body` with a scratch directory, removing it afterwards.
 *
 * The directory lives under the OS temporary directory — in Lambda, the function's
 * ephemeral storage — unless `MOUNT_PATH` is set, which is how the `BucketDeployment`
 * construct points staging at an EFS mount when the payload is larger than `/tmp`.
 * Honouring it is what keeps `useEfs` working.
 */
export async function withScratchDirectory<A>(body: (directory: string) => Promise<A>): Promise<A> {
  const root = process.env.MOUNT_PATH ?? os.tmpdir();
  const directory = await fs.mkdtemp(path.join(root, 'bucket-deployment-'));

  try {
    return await body(directory);
  } finally {
    // Best-effort: a sandbox that is about to be discarded does not need a clean /tmp, and
    // failing the deployment over a leftover file would be worse than leaking it.
    await fs.rm(directory, { recursive: true, force: true }).catch(() => {});
  }
}
