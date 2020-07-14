const mockDeployStack = jest.fn();

jest.mock('../../lib/api/deploy-stack', () => ({
  deployStack: mockDeployStack,
}));

let mockToolkitInfo: any;

jest.mock('../../lib/api/toolkit-info', () => ({
  // Pretend there's no toolkit deployed yet
  DEFAULT_TOOLKIT_STACK_NAME: 'CDKToolkit',
  ToolkitInfo: {
    lookup: () => mockToolkitInfo,
  },
}));

import { bootstrapEnvironment2 } from '../../lib/api/bootstrap';
import { DeployStackOptions } from '../../lib/api/deploy-stack';
import { MockSdkProvider } from '../util/mock-sdk';

describe('Bootstrapping v2', () => {
  const env = {
    account: '123456789012',
    region: 'us-east-1',
    name: 'mock',
  };

  let sdk: MockSdkProvider;
  beforeEach(() => {
    sdk = new MockSdkProvider();
    mockToolkitInfo = undefined;
  });

  test('passes the bucket name as a CFN parameter', async () => {
    await bootstrapEnvironment2(env, sdk, {
      parameters: {
        bucketName: 'my-bucket-name',
      },
    });

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      parameters: {
        FileAssetsBucketName: 'my-bucket-name',
        PublicAccessBlockConfiguration: 'true',
      },
    }));
  });

  test('passes the KMS key ID as a CFN parameter', async () => {
    await bootstrapEnvironment2(env, sdk, {
      parameters: {
        kmsKeyId: 'my-kms-key-id',
      },
    });

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      parameters: {
        FileAssetsBucketKmsKeyId: 'my-kms-key-id',
        PublicAccessBlockConfiguration: 'true',
      },
    }));
  });

  test('passes false to PublicAccessBlockConfiguration', async () => {
    await bootstrapEnvironment2(env, sdk, {
      parameters: {
        publicAccessBlockConfiguration: false,
      },
    });

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      parameters: {
        PublicAccessBlockConfiguration: 'false',
      },
    }));
  });

  test('passing trusted accounts without CFN managed policies results in an error', async () => {
    await expect(bootstrapEnvironment2(env, sdk, {
      parameters: {
        trustedAccounts: ['123456789012'],
      },
    }))
      .rejects
      .toThrow('--cloudformation-execution-policies are required if --trust has been passed!');
  });

  test('Do not allow downgrading bootstrap stack version', async () => {
    // GIVEN
    mockToolkitInfo = {
      version: 999,
    };

    await expect(bootstrapEnvironment2(env, sdk, {}))
      .rejects.toThrow('Not downgrading existing bootstrap stack');
  });

  test('bootstrap template has the right exports', async () => {
    let template: any;
    mockDeployStack.mockImplementation((args: DeployStackOptions) => {
      template = args.stack.template;
    });

    await bootstrapEnvironment2(env, sdk, {});

    const exports = Object.values(template.Outputs ?? {})
      .filter((o: any) => o.Export !== undefined)
      .map((o: any) => o.Export.Name);

    expect(exports).toEqual([
      // This is used by aws-s3-assets
      { 'Fn::Sub': 'CdkBootstrap-${Qualifier}-FileAssetKeyArn' },
      // This is used by the CLI to verify the bootstrap stack version,
      // and could also be used by templates which are deployed through pipelines.
      { 'Fn::Sub': 'CdkBootstrap-${Qualifier}-Version' },
    ]);
  });

  test('stack is not termination protected by default', async () => {
    await bootstrapEnvironment2(env, sdk);

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      stack: expect.objectContaining({
        terminationProtection: false,
      }),
    }));
  });

  test('stack is termination protected when option is set', async () => {
    await bootstrapEnvironment2(env, sdk, {
      parameters: {
        terminationProtection: true,
      },
    });

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      stack: expect.objectContaining({
        terminationProtection: true,
      }),
    }));
  });

  afterEach(() => {
    mockDeployStack.mockClear();
  });
});