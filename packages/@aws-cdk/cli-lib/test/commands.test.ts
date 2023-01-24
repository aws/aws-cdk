import * as core from '@aws-cdk/core';
import * as cli from 'aws-cdk/lib';
import { AwsCdkCli } from '../lib';
import { RequireApproval, StackActivityProgress } from '../lib/commands';

jest.mock('aws-cdk/lib');
jest.mocked(cli.exec).mockResolvedValue(0);

afterEach(() => {
  jest.mocked(cli.exec).mockClear();
});

const cdk = AwsCdkCli.fromCloudAssemblyDirectoryProducer({
  produce: async () => {
    const app = new core.App();
    new core.Stack(app, 'Stack1');
    new core.Stack(app, 'Stack2');

    return app.synth().directory;
  },
});

describe('deploy', () => {
  test('default deploy', async () => {
    // WHEN
    await await cdk.deploy();

    // THEN
    expect(jest.mocked(cli.exec)).toHaveBeenCalledWith(
      ['deploy', '--progress', 'events', '--all'],
      expect.anything(),
    );
  });


  test('deploy with all arguments', async () => {
    // WHEN
    await await cdk.deploy({
      stacks: ['Stack1'],
      ci: false,
      json: true,
      color: false,
      debug: false,
      force: true,
      proxy: 'https://proxy',
      trace: false,
      strict: false,
      execute: true,
      lookups: false,
      notices: true,
      profile: 'my-profile',
      roleArn: 'arn:aws:iam::1111111111:role/my-role',
      staging: false,
      verbose: true,
      ec2Creds: true,
      rollback: false,
      exclusively: true,
      outputsFile: 'outputs.json',
      reuseAssets: [
        'asset1234',
        'asset5678',
      ],
      caBundlePath: '/some/path',
      ignoreErrors: false,
      pathMetadata: false,
      assetMetadata: true,
      changeSetName: 'my-change-set',
      requireApproval: RequireApproval.NEVER,
      toolkitStackName: 'Toolkit',
      versionReporting: true,
      usePreviousParameters: true,
      progress: StackActivityProgress.BAR,
    });

    // THEN
    expect(jest.mocked(cli.exec)).toHaveBeenCalledWith(
      expect.arrayContaining([
        'deploy',
        '--no-ci',
        '--execute',
        '--exclusively',
        '--force',
        '--previous-parameters',
        '--no-rollback',
        '--no-staging',
        '--reuse-assets', 'asset1234',
        '--reuse-assets', 'asset5678',
        '--outputs-file', 'outputs.json',
        '--require-approval', 'never',
        '--change-set-name', 'my-change-set',
        '--toolkit-stack-name', 'Toolkit',
        '--progress', 'bar',
        '--no-strict',
        '--no-trace',
        '--no-lookups',
        '--no-ignore-errors',
        '--json',
        '--verbose',
        '--no-debug',
        '--ec2creds',
        '--version-reporting',
        '--no-path-metadata',
        '--asset-metadata',
        '--notices',
        '--no-color',
        '--profile', 'my-profile',
        '--proxy', 'https://proxy',
        '--ca-bundle-path', '/some/path',
        '--role-arn', 'arn:aws:iam::1111111111:role/my-role',
        'Stack1',
      ]),
      expect.anything(),
    );
  });


  test('can parse boolean arguments', async () => {
    // WHEN
    await await cdk.deploy({
      stacks: ['Stack1'],
      json: true,
      color: false,
    });

    // THEN
    expect(jest.mocked(cli.exec)).toHaveBeenCalledWith(
      [
        'deploy',
        '--progress', 'events',
        '--json',
        '--no-color',
        'Stack1',
      ],
      expect.anything(),
    );
  });

  test('can parse parameters', async() => {
    // WHEN
    await await cdk.deploy({
      stacks: ['Stack1'],
      parameters: {
        'myparam': 'test',
        'Stack1:myotherparam': 'test',
      },
    });

    // THEN
    expect(jest.mocked(cli.exec)).toHaveBeenCalledWith(
      [
        'deploy',
        '--parameters', 'myparam=test',
        '--parameters', 'Stack1:myotherparam=test',
        '--progress', 'events',
        'Stack1',
      ],
      expect.anything(),
    );
  });


  test('can parse context', async () => {
    // WHEN
    await cdk.deploy({
      stacks: ['Stack1'],
      context: {
        'myContext': 'value',
        'Stack1:OtherContext': 'otherValue',
      },
    });

    // THEN
    expect(jest.mocked(cli.exec)).toHaveBeenCalledWith(
      [
        'deploy',
        '--progress', 'events',
        '--context', 'myContext=value',
        '--context', 'Stack1:OtherContext=otherValue',
        'Stack1',
      ],
      expect.anything(),
    );
  });

  test('can parse array arguments', async () => {
    // WHEN
    await cdk.deploy({
      stacks: ['Stack1'],
      notificationArns: [
        'arn:aws:us-east-1:1111111111:some:resource',
        'arn:aws:us-east-1:1111111111:some:other-resource',
      ],
    });

    // THEN
    expect(jest.mocked(cli.exec)).toHaveBeenCalledWith(
      [
        'deploy',
        '--notification-arns', 'arn:aws:us-east-1:1111111111:some:resource',
        '--notification-arns', 'arn:aws:us-east-1:1111111111:some:other-resource',
        '--progress', 'events',
        'Stack1',
      ],
      expect.anything(),
    );
  });
});

describe('synth', () => {
  test('default synth', async () => {
    // WHEN
    await cdk.synth();

    // THEN
    expect(jest.mocked(cli.exec)).toHaveBeenCalledWith(
      ['synth', '--all'],
      expect.anything(),
    );
  });

  test('synth arguments', async () => {
    // WHEN
    await cdk.synth({
      stacks: ['Stack1'],
    });

    // THEN
    expect(jest.mocked(cli.exec)).toHaveBeenCalledWith(
      ['synth', 'Stack1'],
      expect.anything(),
    );
  });
});

describe('destroy', () => {
  test('default destroy', async () => {
    // WHEN
    await cdk.destroy();

    // THEN
    expect(jest.mocked(cli.exec)).toHaveBeenCalledWith(
      ['destroy', '--force', '--all'],
      expect.anything(),
    );
  });

  test('destroy arguments', async () => {
    // WHEN
    await cdk.destroy({
      stacks: ['Stack1'],
      requireApproval: true,
      exclusively: false,
    });

    // THEN
    expect(jest.mocked(cli.exec)).toHaveBeenCalledWith(
      ['destroy', '--no-exclusively', 'Stack1'],
      expect.anything(),
    );
  });
});


describe('list', () => {
  test('default list', async () => {
    // WHEN
    await cdk.list();

    // THEN
    expect(jest.mocked(cli.exec)).toHaveBeenCalledWith(
      ['ls', '--all'],
      expect.anything(),
    );
  });

  test('list arguments', async () => {
    // WHEN
    await cdk.list({
      stacks: ['*'],
      long: true,
    });

    // THEN
    expect(jest.mocked(cli.exec)).toHaveBeenCalledWith(
      ['ls', '--long', '*'],
      expect.anything(),
    );
  });

  test('list without options', async () => {
    // WHEN
    await cdk.list();

    // THEN
    expect(jest.mocked(cli.exec)).toHaveBeenCalledWith(
      ['ls', '--all'],
      expect.anything(),
    );
  });
});
