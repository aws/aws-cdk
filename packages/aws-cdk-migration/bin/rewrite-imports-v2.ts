/* eslint-disable no-console */
import * as fs from 'fs';
import { promisify } from 'util';
import * as _glob from 'glob';

import { rewriteMonoPackageImports } from '../lib/rewrite';

const glob = promisify(_glob);

async function main() {
  if (!process.argv[2]) {
    console.error('usage: rewrite-imports **/*.ts');
    return;
  }

  const ignore = [
    '**/*.d.ts',
    'node_modules/**',
  ];

  const args = process.argv.slice(2);
  for (const arg of args) {
    const files = await glob(arg, { ignore, matchBase: true });
    for (const file of files) {
      const input = await fs.promises.readFile(file, { encoding: 'utf8' });
      const output = rewriteMonoPackageImports(input, 'aws-cdk-lib', file, {
        rewriteConstructsImports: true,
      });
      if (output.trim() !== input.trim()) {
        await fs.promises.writeFile(file, output);
      }
    }
  }
}

main().catch(e => {
  console.error(e.stack);
  process.exit(1);
});
