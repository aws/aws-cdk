// eslint-disable-next-line jest/no-jest-import
import * as yargs from 'yargs';
import { fetchPreviousVersion } from '../lib/github';

async function main() {
  const args = await yargs
    .option('token', {
      descripton: 'GitHub token (default: from environment GITHUB_TOKEN)',
      alias: 't',
      type: 'string',
      requiresArg: true,
    })
    .command('last-release', 'Query the last release', cmd => cmd
      .option('prior-to', {
        description: 'Return the most recent release before the given version',
        alias: 'p',
        type: 'string',
        requiresArg: true,
      })
      .option('major', {
        description: 'Return the most recent release that matches',
        alias: 'm',
        type: 'string',
        requiresArg: true,
      }))
    .demandCommand()
    .help()
    .showHelpOnFail(false)
    .argv;

  const command = args._[0];

  const token = args.token ?? process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('Either pass --token or set GITHUB_TOKEN.');
  }

  switch (command) {
    case 'last-release':
      if (args['prior-to'] && args.major) {
        throw new Error('Cannot pass both `--prior-to and --major at the same time');
      }

      // eslint-disable-next-line no-console
      console.log(await fetchPreviousVersion(token, {
        priorTo: args['prior-to'],
        majorVersion: args.major,
      }));
      break;
  }
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
