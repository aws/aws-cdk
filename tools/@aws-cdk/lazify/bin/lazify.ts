import * as fs from 'fs-extra';
import * as path from 'path';
import { transformFile } from '../lib';

async function main() {
  const args = process.argv.slice(2);
  const verbose = !process.env.QUIET;

  for (const arg of args) {
    await recurseJs(arg, async (f) => {
      // Only if there's an accompanying .ts file
      const tsFile = f.replace(/\.js$/, '.ts');
      if (await fs.pathExists(tsFile)) {
        await transformFile(f, verbose);
      }
    });
  }
}

async function recurseJs(root: string, block: (x: string) => Promise<void>) {
  return recurse(root);

  async function recurse(f: string) {
    const s = await fs.stat(f);
    if (s.isFile() && f.endsWith('.js')) {
      await block(f);
    }
    if (s.isDirectory() && path.basename(f) !== 'node_modules') {
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