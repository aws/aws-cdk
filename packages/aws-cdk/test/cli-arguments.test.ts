import { CliArguments } from '../lib/cli-arguments';
import { Command } from '../lib/settings';

// CliArguments is not being used right now, so the testing suite is rather redundant.
// This file is meant to be populated when CliArguments is used.
test('cli arguments can be used as a type', async () => {
  const argv: CliArguments = {
    _: [Command.DEPLOY],
    globalOptions: {
      lookups: true,
      ignoreErrors: false,
      json: false,
      verbose: false,
    },
  };

  expect(argv._[0]).toBe('deploy');
  expect(argv.globalOptions?.lookups).toBeTruthy();
});
