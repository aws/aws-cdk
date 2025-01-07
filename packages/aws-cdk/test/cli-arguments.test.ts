import { convertToCliArgs } from '../lib/convert-to-cli-args';
import { parseCommandLineArguments } from '../lib/parse-command-line-arguments';

test('yargs object can be converted to cli arguments', async () => {
  const input = await parseCommandLineArguments(['deploy', '-R', '-v', '--ci']);

  const result = convertToCliArgs(input);

  expect(result).toEqual({
    _: 'deploy',
    globalOptions: {
      app: undefined,
      assetMetadata: undefined,
      build: undefined,
      caBundlePath: undefined,
      context: [],
      ignoreErrors: false,
      noColor: false,
      pathMetadata: undefined,
      plugin: [],
      profile: undefined,
      proxy: undefined,
      roleArn: undefined,
      staging: true,
      strict: undefined,
      verbose: 1,
      versionReporting: undefined,
      ci: true,
      debug: false,
      ec2creds: undefined,
      json: false,
      lookups: true,
      trace: undefined,
      unstable: [],
      notices: undefined,
      output: undefined,
    },
    deploy: {
      STACKS: undefined,
      all: false,
      assetParallelism: undefined,
      assetPrebuild: true,
      buildExclude: [],
      changeSetName: undefined,
      concurrency: 1,
      execute: undefined,
      exclusively: undefined,
      force: false,
      hotswap: undefined,
      hotswapFallback: undefined,
      ignoreNoStacks: false,
      importExistingResources: false,
      logs: true,
      method: undefined,
      notificationArns: undefined,
      outputsFile: undefined,
      parameters: [{}],
      previousParameters: true,
      progress: undefined,
      requireApproval: undefined,
      rollback: false,
      tags: [],
      toolkitStackName: undefined,
      watch: undefined,
    },
  });
});

test('positional argument is correctly passed through -- variadic', async () => {
  const input = await parseCommandLineArguments(['deploy', 'stack1', 'stack2', '-R', '-v', '--ci']);

  const result = convertToCliArgs(input);

  expect(result).toEqual({
    _: 'deploy',
    deploy: expect.objectContaining({
      STACKS: ['stack1', 'stack2'],
    }),
    globalOptions: expect.anything(),
  });
});

test('positional argument is correctly passed through -- single', async () => {
  const input = await parseCommandLineArguments(['acknowledge', 'id1', '-v', '--ci']);

  const result = convertToCliArgs(input);

  expect(result).toEqual({
    _: 'acknowledge',
    acknowledge: expect.objectContaining({
      ID: 'id1',
    }),
    globalOptions: expect.anything(),
  });
});
