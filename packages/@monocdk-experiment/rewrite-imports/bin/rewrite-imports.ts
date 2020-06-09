// tslint:disable: no-console
import * as fs from 'fs';
import * as _glob from 'glob';

import { promisify } from 'util';
import { rewriteImports } from '../lib/rewrite';

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

  const files = await glob(process.argv[2], { ignore, matchBase: true });
  for (const file of files) {
    const input = await fs.promises.readFile(file, { encoding: 'utf8' });
    const output = rewriteImports(input, file);
    if (output.trim() !== input.trim()) {
      await fs.promises.writeFile(file, output);
    }
  }
}

main().catch(e => {
  console.error(e.stack);
  process.exit(1);
});
