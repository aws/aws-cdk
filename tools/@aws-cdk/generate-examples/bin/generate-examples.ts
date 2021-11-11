import * as yargs from 'yargs';

import { generateMissingExamples } from '../lib/generate-missing-examples';

async function main() {
  const args = yargs
    .usage('$0 [ASSEMBLY..]')
    .option('cache-from', {
      alias: 'C',
      type: 'string',
      describe: 'Reuse translations from the given tablet file',
      requiresArg: true,
      default: undefined,
    })
    .option('cache-to', {
      alias: 'c',
      type: 'string',
      describe: 'Write fresh translations to the given tablet file',
      requiresArg: true,
      default: undefined,
    })
    .option('directory', {
      alias: 'd',
      type: 'string',
      describe: 'Directory to run the compilation in (with dependencies set up)',
      requiresArg: true,
      default: undefined,
    })
    .option('bail', {
      alias: 'b',
      type: 'boolean',
      describe: 'Whether to bail on the first error',
      default: false,
    })
    .help()
    .strict()
    .showHelpOnFail(false)
    .argv;

  const assemblyDirs = args._.map(x => `${x}`);

  await generateMissingExamples(assemblyDirs.length > 0 ? assemblyDirs : ['.'], {
    cacheFromTablet: args['cache-from'],
    cacheToTablet: args['cache-to'],
    directory: args.directory,
    bail: args.bail,
  });
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});