let mockFindCloudWatchLogGroups = jest.fn();

import { RequireApproval, StackParameters } from '../../lib';
import { Toolkit } from '../../lib/toolkit';
import { builderFixture, TestIoHost } from '../_helpers';
import { MockSdk } from '../util/aws-cdk';

const sdk = new MockSdk();
const ioHost = new TestIoHost();
const toolkit = new Toolkit({ ioHost });
const rollbackSpy = jest.spyOn(toolkit as any, '_rollback').mockResolvedValue({});

let mockDeployStack = jest.fn().mockResolvedValue({
  type: 'did-deploy-stack',
  stackArn: 'arn:aws:cloudformation:region:account:stack/test-stack',
  outputs: {},
  noOp: false,
});

jest.mock('../../lib/api/aws-cdk', () => {
  return {
    ...jest.requireActual('../../lib/api/aws-cdk'),
    Deployments: jest.fn().mockImplementation(() => ({
      deployStack: mockDeployStack,
      resolveEnvironment: jest.fn().mockResolvedValue({}),
      isSingleAssetPublished: jest.fn().mockResolvedValue(true),
      readCurrentTemplate: jest.fn().mockResolvedValue({ Resources: {} }),
    })),
    findCloudWatchLogGroups: mockFindCloudWatchLogGroups,
  };
});

beforeEach(() => {
  ioHost.notifySpy.mockClear();
  ioHost.requestSpy.mockClear();
  jest.clearAllMocks();
  mockFindCloudWatchLogGroups.mockReturnValue({
    env: { name: 'Z', account: 'X', region: 'Y' },
    sdk,
    logGroupNames: ['/aws/lambda/lambda-function-name'],
  });
});

describe('deploy', () => {
  test('deploy from builder', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'two-empty-stacks');
    await toolkit.deploy(cx);

    // THEN
    successfulDeployment();
  });

  test('request response when require approval is set', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'stack-with-role');
    await toolkit.deploy(cx, {
      requireApproval: RequireApproval.ANY_CHANGE,
    });

    // THEN
    expect(ioHost.requestSpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'deploy',
      level: 'info',
      code: 'CDK_TOOLKIT_I5060',
      message: expect.stringContaining('Do you wish to deploy these changes'),
    }));
  });

  test('skips response by default', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'stack-with-role');
    await toolkit.deploy(cx, {
      requireApproval: RequireApproval.NEVER,
    });

    // THEN
    expect(ioHost.requestSpy).not.toHaveBeenCalledWith(expect.objectContaining({
      action: 'deploy',
      level: 'info',
      code: 'CDK_TOOLKIT_I5060',
      message: expect.stringContaining('Do you wish to deploy these changes'),
    }));
  });

  describe('deployment options', () => {
    test('parameters are passed in', async () => {
      // WHEN
      const cx = await builderFixture(toolkit, 'stack-with-role');
      await toolkit.deploy(cx, {
        parameters: StackParameters.exactly({
          'my-param': 'my-value',
        }),
      });

      // passed through correctly to Deployments
      expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
        parameters: { 'my-param': 'my-value' },
      }));

      successfulDeployment();
    });

    test('notification arns are passed in', async () => {
      // WHEN
      const arn = 'arn:aws:sns:us-east-1:1111111111:resource';
      const cx = await builderFixture(toolkit, 'stack-with-role');
      await toolkit.deploy(cx, {
        notificationArns: [arn],
      });

      // passed through correctly to Deployments
      expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
        notificationArns: [arn],
      }));

      successfulDeployment();
    });

    test('notification arns from stack are passed in', async () => {
      // WHEN
      const arn = 'arn:aws:sns:us-east-1:222222222222:resource';
      const cx = await builderFixture(toolkit, 'stack-with-notification-arns');
      await toolkit.deploy(cx, {
        notificationArns: [arn],
      });

      // passed through correctly to Deployments
      expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
        notificationArns: [
          arn,
          'arn:aws:sns:us-east-1:1111111111:resource',
          'arn:aws:sns:us-east-1:1111111111:other-resource',
        ],
      }));

      successfulDeployment();
    });

    test('can trace logs', async () => {
      // WHEN
      const cx = await builderFixture(toolkit, 'stack-with-role');
      await toolkit.deploy(cx, {
        traceLogs: true,
      });

      // THEN
      expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
        action: 'deploy',
        level: 'info',
        code: 'CDK_TOOLKIT_I5031',
        message: expect.stringContaining('The following log groups are added: /aws/lambda/lambda-function-name'),
      }));
    });

    test('non sns notification arn results in error', async () => {
      // WHEN
      const arn = 'arn:aws:sqs:us-east-1:1111111111:resource';
      const cx = await builderFixture(toolkit, 'stack-with-role');
      await expect(async () => toolkit.deploy(cx, {
        notificationArns: [arn],
      })).rejects.toThrow(/Notification arn arn:aws:sqs:us-east-1:1111111111:resource is not a valid arn for an SNS topic/);
    });

    test('hotswap property overrides', async () => {
      // WHEN
      const cx = await builderFixture(toolkit, 'stack-with-role');
      await toolkit.deploy(cx, {
        hotswapProperties: {
          ecs: {
            maximumHealthyPercent: 100,
            minimumHealthyPercent: 0,
          },
        },
      });

      // THEN
      // passed through correctly to Deployments
      expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
        hotswapPropertyOverrides: {
          ecsHotswapProperties: {
            maximumHealthyPercent: 100,
            minimumHealthyPercent: 0,
          },
        },
      }));

      successfulDeployment();
    });
  });

  describe('deployment results', () => {
    test('did-deploy-result', async () => {
      // WHEN
      const cx = await builderFixture(toolkit, 'stack-with-role');
      await toolkit.deploy(cx);

      // THEN
      successfulDeployment();
    });

    test('failpaused-need-rollback-first', async () => {
      // GIVEN
      mockDeployStack.mockImplementation((params) => {
        if (params.rollback === true) {
          return {
            type: 'did-deploy-stack',
            stackArn: 'arn:aws:cloudformation:region:account:stack/test-stack',
            outputs: {},
            noOp: false,
          };
        } else {
          return {
            type: 'failpaused-need-rollback-first',
            stackArn: 'arn:aws:cloudformation:region:account:stack/test-stack',
            outputs: {},
            noOp: false,
          };
        }
      });

      // WHEN
      const cx = await builderFixture(toolkit, 'stack-with-role');
      await toolkit.deploy(cx);

      // THEN
      // We called rollback
      expect(rollbackSpy).toHaveBeenCalledTimes(1);
      successfulDeployment();
    });

    test('replacement-requires-rollback', async () => {
      // GIVEN
      mockDeployStack.mockImplementation((params) => {
        if (params.rollback === true) {
          return {
            type: 'did-deploy-stack',
            stackArn: 'arn:aws:cloudformation:region:account:stack/test-stack',
            outputs: {},
            noOp: false,
          };
        } else {
          return {
            type: 'replacement-requires-rollback',
            stackArn: 'arn:aws:cloudformation:region:account:stack/test-stack',
            outputs: {},
            noOp: false,
          };
        }
      });

      // WHEN
      const cx = await builderFixture(toolkit, 'stack-with-role');
      await toolkit.deploy(cx);

      // THEN
      successfulDeployment();
    });
  });
});

function successfulDeployment() {
  expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
    action: 'deploy',
    level: 'info',
    message: expect.stringContaining('Deployment time:'),
  }));
}
