import * as fs from 'fs-extra';
import * as path from 'path';
import { transformFile } from '../lib';

async function main() {
  const args = process.argv.slice(2);
  const verbose = !process.env.QUIET;

  for (const arg of args) {
    await recurseJs(
      arg,
      async (f) => {
        // Only if there's an accompanying .ts file
        const tsFile = f.replace(/\.js$/, '.ts');
        if (await fs.pathExists(tsFile)) {
          await transformFile(f, verbose);
        }
      },
      // Skip directories marked as 'custom resource's, so we don't affect asset hashes
      async (d) => path.basename(d) !== 'node_modules' && ! await fs.pathExists(path.join(d, '.is_custom_resource')));
  }
}

async function recurseJs(root: string, fileBlock: (x: string) => Promise<void>, dirBlock: (x: string) => Promise<boolean>) {
  return recurse(root);

  async function recurse(f: string) {
    const s = await fs.stat(f);
    if (s.isFile() && f.endsWith('.js')) {
      await fileBlock(f);
    }
    if (s.isDirectory() && await dirBlock(f)) {
      for (const child of await fs.readdir(f)) {
        await recurse(path.join(f, child));
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});