import * as s3 from 'aws-cdk-lib/aws-s3';
import * as core from 'aws-cdk-lib/core';
import { Toolkit } from '../../lib/toolkit';
import { fixture, TestIoHost } from '../_helpers';
import { CloudFormationClient, DescribeChangeSetCommand, DescribeStacksCommand, StackStatus } from '@aws-sdk/client-cloudformation';
import { mockClient } from 'aws-sdk-client-mock';
import { StackSelectionStrategy } from '../../lib';

const ioHost = new TestIoHost();
const notifySpy = jest.spyOn(ioHost, 'notify');
const requestResponseSpy = jest.spyOn(ioHost, 'requestResponse');
const cdk = new Toolkit({ ioHost });
const mockCloudFormationClient = mockClient(CloudFormationClient);

const cxFromBuilder = async () => {
  return cdk.fromAssemblyBuilder(async () => {
    const app = new core.App();
    new core.Stack(app, 'Stack1');
    new core.Stack(app, 'Stack2');

    // @todo fix api
    return app.synth() as any;
  });
};

const cxFromApp = async (name: string) => {
  return cdk.fromCdkApp(`node ${fixture(name)}`);
};

beforeEach(() => {
  requestResponseSpy.mockClear();
  notifySpy.mockClear();
  mockCloudFormationClient.reset();
  mockCloudFormationClient.onAnyCommand().resolves({});
  mockCloudFormationClient.on(DescribeChangeSetCommand).resolves({
    Status: StackStatus.CREATE_COMPLETE,
    Changes: [],
  });
  mockCloudFormationClient
    .on(DescribeStacksCommand)
    // First call, no stacks exis
    .resolvesOnce({
      Stacks: [],
    })
    // Second call, stack has been created
    .resolves({
      Stacks: [
        {
          StackStatus: StackStatus.CREATE_COMPLETE,
          StackStatusReason: 'It is magic',
          EnableTerminationProtection: false,
          StackName: 'MagicalStack',
          CreationTime: new Date(),
        },
      ],
    });
});

describe('deploy', () => {
  test('deploy from builder', async () => {
    // WHEN
    const cx = await cxFromBuilder();
    await cdk.deploy(cx);

    // THEN
    expect(notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'deploy',
      level: 'info',
      message: expect.stringContaining('Deployment time:'),
    }));
  });

  test('deploy from app', async () => {
    // WHEN
    await cdk.deploy(await cxFromApp('two-empty-stacks'));

    // THEN
    expect(notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'deploy',
      level: 'info',
      message: expect.stringContaining('Deployment time:'),
    }));
  });

  test('deploy no resources results in warning', async () => {
    // WHEN
    const cx = await cxFromBuilder();
    await cdk.deploy(cx, {
      stacks: {
        strategy: StackSelectionStrategy.PATTERN_MUST_MATCH_SINGLE,
        patterns: ['Stack1'],
      },
    });

    // THEN
    expect(notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'deploy',
      level: 'info',
      message: expect.stringContaining('Stack ARN:'),
      data: expect.objectContaining({
        stack: expect.objectContaining({
          hierarchicalId: 'Stack1',
          stackName: 'Stack1',
          stringifiedJson: expect.not.stringContaining('CheckBootstrapVersion'),
        }),
      }),
    }));

    expect(notifySpy).not.toHaveBeenCalledWith(expect.objectContaining({
      action: 'deploy',
      level: 'info',
      message: expect.stringContaining('Stack ARN:'),
      data: expect.objectContaining({
        stack: expect.objectContaining({
          hierarchicalId: 'Stack2',
          stackName: 'Stack2',
          stringifiedJson: expect.not.stringContaining('CheckBootstrapVersion'),
        }),
      }),
    }));
  });
});
