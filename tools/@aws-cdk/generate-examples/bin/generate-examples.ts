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
    .option('append-to', {
      alias: 'a',
      type: 'string',
      describe: 'Append translations to the given tablet file',
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
    .option('strict', {
      alias: 's',
      type: 'boolean',
      describe: 'Whether to exit with an error if there are diagnostics',
      default: false,
    })
    .help()
    .strict()
    .showHelpOnFail(false)
    .argv;

  const assemblyDirs = args._.map(x => `${x}`);

  await generateMissingExamples(assemblyDirs.length > 0 ? assemblyDirs : ['.'], {
    cacheFromTablet: args['cache-from'],
    appendToTablet: args['append-to'],
    directory: args.directory,
    strict: args.strict,
  });
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});