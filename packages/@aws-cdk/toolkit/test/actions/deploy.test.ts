import { RequireApproval } from '../../lib';
import { Toolkit } from '../../lib/toolkit';
import { builderFixture, TestIoHost } from '../_helpers';

const ioHost = new TestIoHost();
const toolkit = new Toolkit({ ioHost });

jest.mock('../../lib/api/aws-cdk', () => {
  return {
    ...jest.requireActual('../../lib/api/aws-cdk'),
    Deployments: jest.fn().mockImplementation(() => ({
      deployStack: jest.fn().mockResolvedValue({
        type: 'did-deploy-stack',
        stackArn: 'arn:aws:cloudformation:region:account:stack/test-stack',
        outputs: {},
        noOp: false,
      }),
      resolveEnvironment: jest.fn().mockResolvedValue({}),
      isSingleAssetPublished: jest.fn().mockResolvedValue(true),
      readCurrentTemplate: jest.fn().mockResolvedValue({ Resources: {} }),
    })),
  };
});

beforeEach(() => {
  ioHost.notifySpy.mockClear();
  ioHost.requestSpy.mockClear();
  jest.clearAllMocks();
});

describe('deploy', () => {
  test('deploy from builder', async () => {
    // WHEN
    const cx = await builderFixture(toolkit, 'two-empty-stacks');
    await toolkit.deploy(cx);

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'deploy',
      level: 'info',
      message: expect.stringContaining('Deployment time:'),
    }));
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
});
