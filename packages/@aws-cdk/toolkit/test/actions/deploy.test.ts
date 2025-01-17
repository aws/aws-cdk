import { CloudFormationClient, DescribeChangeSetCommand, DescribeStacksCommand, StackStatus } from '@aws-sdk/client-cloudformation';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import { mockClient } from 'aws-sdk-client-mock';
import { RequireApproval, StackSelectionStrategy } from '../../lib';
import { Toolkit } from '../../lib/toolkit';
import { TestIoHost } from '../_helpers';

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

  test('request response when require approval is set', async () => {
    // WHEN
    const cx = await cdk.fromAssemblyBuilder(async () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'Stack1');
      new iam.Role(stack, 'Role', {
        assumedBy: new iam.ArnPrincipal('arn'),
      });
      return app.synth() as any;
    });

    await cdk.deploy(cx, {
      requireApproval: RequireApproval.ANY_CHANGE,
    });

    // THEN
    expect(requestResponseSpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'deploy',
      level: 'info',
      code: 'CDK_TOOLKIT_I5060',
      message: expect.stringContaining('Do you wish to deploy these changes'),
    }));
  });

  test('stack information is returned when successfully deployed', async () => {
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
