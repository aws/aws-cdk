import { parseCommandLineArguments } from '../lib/parse-command-line-arguments';
test('cdk deploy -R sets rollback to false', async () => {
  const argv = await parseCommandLineArguments(['deploy', '-R']);

  expect(argv.rollback).toBe(false);
});
