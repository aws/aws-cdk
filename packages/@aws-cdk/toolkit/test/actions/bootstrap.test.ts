// Mock the Bootstrapper before imports
jest.mock('../../../../aws-cdk/lib/api', () => ({
  ...jest.requireActual('../../../../aws-cdk/lib/api'),
  Bootstrapper: jest.fn().mockImplementation(() => ({
    bootstrapEnvironment: jest.fn().mockResolvedValue({
      noOp: false,
      outputs: {},
      stackArn: 'arn:aws:cloudformation:us-east-1:123456789012:stack/CDKToolkit/abcd1234',
    }),
  })),
}));

import * as os from 'node:os';
import * as path from 'node:path';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import { StringWithoutPlaceholders } from '../../../../aws-cdk/lib/api/util/placeholders';
import { BootstrapEnvironmentOptions, SdkProvider, Bootstrapper } from '../../lib/api/aws-cdk';
import { Toolkit } from '../../lib/toolkit';
import { TestIoHost } from '../_helpers';
import { TestCloudAssemblySource } from '../_helpers/test-cloud-assembly-source';

const ioHost = new TestIoHost();

// Create a mock SDK provider
const mockSdkProvider = {
  withAwsCliCompatibleDefaults: jest.fn().mockResolvedValue({
    sdk: {},
    defaultAccount: jest.fn(),
    defaultRegion: jest.fn(),
    resolveEnvironment: jest.fn(env => ({
      ...env,
      account: env.account || '123456789012',
      region: env.region || 'us-east-1',
      name: `aws://${env.account || '123456789012'}/${env.region || 'us-east-1'}`,
    })),
    forEnvironment: jest.fn().mockResolvedValue({
      sdk: {
        cloudFormation: () => ({
          describeStacks: () => ({ promise: () => Promise.resolve({ Stacks: [] }) }),
        }),
      },
      resolvedEnvironment: {
        account: '123456789012',
        region: 'us-east-1',
        name: 'aws://123456789012/us-east-1',
      },
    }),
  }),
};

// Mock the SdkProvider before creating the toolkit instance
jest.spyOn(SdkProvider, 'withAwsCliCompatibleDefaults').mockImplementation(mockSdkProvider.withAwsCliCompatibleDefaults);

const toolkit = new Toolkit({ ioHost });

describe('bootstrap', () => {
  let tempOutDir: string;

  beforeEach(() => {
    ioHost.notifySpy.mockClear();
    ioHost.requestSpy.mockClear();
    mockSdkProvider.withAwsCliCompatibleDefaults.mockClear();
    (Bootstrapper as jest.Mock).mockClear();

    // Create a temporary directory for cloud assembly output
    tempOutDir = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'cdk.out'));
  });

  afterEach(() => {
    // Clean up temporary directory
    fs.removeSync(tempOutDir);
  });

  test('bootstraps single environment', async () => {
    // GIVEN
    const mockEnvironment: cxapi.Environment = {
      account: '123456789012',
      region: 'us-east-1',
      name: 'aws://123456789012/us-east-1',
    };

    const cx = new TestCloudAssemblySource({
      stacks: [{
        stackName: 'mock-stack',
        env: `aws://${mockEnvironment.account}/${mockEnvironment.region}`,
        template: { Resources: {} },
      }],
      schemaVersion: '30.0.0',
    });

    // WHEN
    await toolkit.bootstrap(cx);

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledTimes(3);

    // First message is the bootstrapping notification
    expect(ioHost.notifySpy).toHaveBeenNthCalledWith(1, expect.objectContaining({
      action: 'bootstrap',
      code: 'CDK_TOOLKIT_I0000',
      level: 'info',
      message: expect.stringContaining('bootstrapping...'),
      time: expect.any(Date),
    }));

    // Second message is the success notification
    expect(ioHost.notifySpy).toHaveBeenNthCalledWith(2, expect.objectContaining({
      action: 'bootstrap',
      code: 'CDK_TOOLKIT_I0000',
      level: 'info',
      message: expect.stringMatching(/✅\s+aws:\/\/123456789012\/us-east-1/),
      time: expect.any(Date),
    }));

    // Third message is the bootstrap time notification
    expect(ioHost.notifySpy).toHaveBeenNthCalledWith(3, expect.objectContaining({
      action: 'bootstrap',
      code: 'CDK_TOOLKIT_I9000',
      level: 'info',
      message: expect.stringMatching(/✨\s+Bootstrap time:/),
      time: expect.any(Date),
      data: expect.objectContaining({
        duration: expect.any(Number),
      }),
    }));
    expect(Bootstrapper).toHaveBeenCalled();
  });

  test('handles bootstrap options', async () => {
    // GIVEN
    const mockEnvironment: cxapi.Environment = {
      account: '123456789012',
      region: 'us-east-1',
      name: 'aws://123456789012/us-east-1',
    };

    const cx = new TestCloudAssemblySource({
      stacks: [{
        stackName: 'mock-stack',
        env: `aws://${mockEnvironment.account}/${mockEnvironment.region}`,
        template: { Resources: {} },
      }],
      schemaVersion: '30.0.0',
    });

    const options: BootstrapEnvironmentOptions = {
      roleArn: 'arn:aws:iam::123456789012:role/AdminRole' as StringWithoutPlaceholders,
      terminationProtection: true,
      parameters: {
        bucketName: 'my-bucket',
        kmsKeyId: 'my-key',
      },
    };

    // WHEN
    await toolkit.bootstrap(cx, options);

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      level: 'info',
      message: expect.stringContaining('bootstrapping...'),
    }));
    expect(Bootstrapper).toHaveBeenCalled();
    const bootstrapper = ((Bootstrapper as jest.Mock).mock.results[0]?.value) as { bootstrapEnvironment: jest.Mock };
    expect(bootstrapper.bootstrapEnvironment).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining(options),
    );
  });

  test('handles bootstrap failure', async () => {
    // GIVEN
    const mockEnvironment: cxapi.Environment = {
      account: '123456789012',
      region: 'us-east-1',
      name: 'aws://123456789012/us-east-1',
    };

    const cx = new TestCloudAssemblySource({
      stacks: [{
        stackName: 'mock-stack',
        env: `aws://${mockEnvironment.account}/${mockEnvironment.region}`,
        template: { Resources: {} },
      }],
      schemaVersion: '30.0.0',
    });

    // Mock a failure in the bootstrapper
    (Bootstrapper as jest.Mock).mockImplementationOnce(() => ({
      bootstrapEnvironment: jest.fn().mockRejectedValue(new Error('Bootstrap failed')),
    }));

    // WHEN
    await expect(toolkit.bootstrap(cx)).rejects.toThrow('Bootstrap failed');

    // THEN
    expect(ioHost.notifySpy).toHaveBeenCalledWith(expect.objectContaining({
      level: 'error',
      code: 'CDK_TOOLKIT_E9900',
      message: expect.stringContaining('failed: Bootstrap failed'),
    }));
    expect(Bootstrapper).toHaveBeenCalled();
  });
});
