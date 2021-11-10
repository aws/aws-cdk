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
    .help()
    .strict()
    .showHelpOnFail(false)
    .argv;

  const tabletFile = args._[0] as string;
  const assemblyDirs = args._.slice(1) as string[];

  if (tabletFile === undefined) {
    throw new Error('TABLET argument required');
  }

  await generateMissingExamples(assemblyDirs.length > 0 ? assemblyDirs : ['.'], {
    cacheFromTablet: args['cache-from'],
    cacheToTablet: args['cache-to'],
  });
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});