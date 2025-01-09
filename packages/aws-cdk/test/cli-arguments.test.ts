/* eslint-disable import/order */
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { convertConfigToCliArgs, convertYargsToCliArgs } from '../lib/convert-to-cli-args';
import { parseCommandLineArguments } from '../lib/parse-command-line-arguments';

describe('yargs', () => {
  test('yargs object can be converted to cli arguments', async () => {
    const input = await parseCommandLineArguments(['deploy', '-R', '-v', '--ci']);

    const result = convertYargsToCliArgs(input);

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

    const result = convertYargsToCliArgs(input);

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

    const result = convertYargsToCliArgs(input);

    expect(result).toEqual({
      _: 'acknowledge',
      acknowledge: expect.objectContaining({
        ID: 'id1',
      }),
      globalOptions: expect.anything(),
    });
  });
});

describe('config', () => {
  const state: {
    previousWorkingDir?: string;
    tempDir?: string;
  } = {};

  beforeEach(async () => {
    state.previousWorkingDir = process.cwd();
    state.tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aws-cdk-test'));
    // eslint-disable-next-line no-console
    console.log('Temporary working directory:', state.tempDir);
    process.chdir(state.tempDir);
  });

  afterEach(async () => {
    // eslint-disable-next-line no-console
    console.log('Switching back to', state.previousWorkingDir, 'cleaning up', state.tempDir);
    process.chdir(state.previousWorkingDir!);
    await fs.remove(state.tempDir!);
  });

  test('cdk.json arguments can be converted to cli argumets', async () => {
    const input = {
      output: 'blah.out',
      build: 'yarn build',
      list: {
        long: true,
      },
      bootstrap: {
        bootstrapBucketName: 'bucketName',
      },
    };

    const result = convertConfigToCliArgs(input);

    expect(result).toEqual({
      globalOptions: expect.objectContaining({
        output: 'blah.out',
        build: 'yarn build',
      }),
      list: expect.objectContaining({
        long: true,
      }),
      bootstrap: expect.objectContaining({
        bootstrapBucketName: 'bucketName',
      }),
      context: expect.anything(),
      acknowledge: expect.anything(),
      deploy: expect.anything(),
      destroy: expect.anything(),
      diff: expect.anything(),
      init: expect.anything(),
      metadata: expect.anything(),
      migrate: expect.anything(),
      rollback: expect.anything(),
      synthesize: expect.anything(),
      watch: expect.anything(),
      notices: expect.anything(),
      import: expect.anything(),
      gc: expect.anything(),
      doctor: expect.anything(),
      docs: expect.anything(),
    });
  });
});
