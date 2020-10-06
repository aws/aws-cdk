/* eslint-disable no-console */
import * as fs from 'fs';
import { promisify } from 'util';
import * as _glob from 'glob';
import * as yargs from 'yargs';

import { DEFAULT_ASSERT_NAME, DEFAULT_NAME, rewriteImports } from '../lib/rewrite';

const glob = promisify(_glob);


async function main() {

  const args = yargs
    .usage('Usage: cdk rewrite-imports \'**/*.ts\'')
    .demandCommand(1)
    .option('name', { type: 'string', alias: 'n', desc: 'Optional: The name of the monolithic package', default: DEFAULT_NAME })
    .option('assert-name', { type: 'string', alias: 'a', desc: 'Optional: The name of the assert library corresponding to the monolithic package used', default: DEFAULT_ASSERT_NAME })
    .argv;

  const ignore = [
    '**/*.d.ts',
    'node_modules/**',
  ];

  const paths = args._;
  for (const path of paths) {
    const files = await glob(path, { ignore, matchBase: true });
    for (const file of files) {
      const input = await fs.promises.readFile(file, { encoding: 'utf8' });
      const output = rewriteImports(input, { fileName: file, monoPackageName: args.name, monoAssertPackageName: args['assert-name'] });
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
