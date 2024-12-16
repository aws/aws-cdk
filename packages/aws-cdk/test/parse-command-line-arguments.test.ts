import { parseCommandLineArguments } from '../lib/parse-command-line-arguments';
import { yargsNegativeAlias } from '../lib/util/yargs-helpers';

test('cdk deploy -R sets rollback to false', async () => {
  const argv = await parseCommandLineArguments(['deploy', '-R'], 'open', ['typescript'], ['typescript'], 'test', yargsNegativeAlias);

  expect(argv.rollback).toBe(false);
});
