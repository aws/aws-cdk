import * as iam from 'aws-cdk-lib/aws-iam';
import * as core from 'aws-cdk-lib/core';
import { RequireApproval } from '../../lib';
import { Toolkit } from '../../lib/toolkit';
import { TestIoHost } from '../_helpers';

const ioHost = new TestIoHost();
const cdk = new Toolkit({ ioHost });

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
  ioHost.notifySpy.mockClear();
  jest.clearAllMocks();
});

describe('deploy', () => {
  test('deploy from builder', async () => {
    // WHEN
    const cx = await cxFromBuilder();
    await cdk.deploy(cx);

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
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
    expect(ioHost.requestSpy).toHaveBeenCalledWith(expect.objectContaining({
      action: 'deploy',
      level: 'info',
      code: 'CDK_TOOLKIT_I5060',
      message: expect.stringContaining('Do you wish to deploy these changes'),
    }));
  });

  test('skips response by default', async () => {
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
