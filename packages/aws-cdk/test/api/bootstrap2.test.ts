const mockDeployStack = jest.fn();

jest.mock('../../lib/api/deploy-stack', () => ({
  deployStack: mockDeployStack,
}));

jest.mock('../../lib/api/toolkit-info', () => ({
  // Pretend there's no toolkit deployed yet
  DEFAULT_TOOLKIT_STACK_NAME: 'CDKToolkit',
  ToolkitInfo: {
    lookup: () => undefined,
  }
}));

import { bootstrapEnvironment2 } from '../../lib/api/bootstrap';
import { MockSdkProvider } from '../util/mock-sdk';

describe('Bootstrapping v2', () => {
  const env = {
    account: '123456789012',
    region: 'us-east-1',
    name: 'mock',
  };
  const sdk = new MockSdkProvider();

  test('passes the bucket name as a CFN parameter', async () => {
    await bootstrapEnvironment2(env, sdk, {
      parameters: {
        bucketName: 'my-bucket-name',
      }
    });

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      parameters: {
        FileAssetsBucketName: 'my-bucket-name',
      },
    }));
  });

  test('passes the KMS key ID as a CFN parameter', async () => {
    await bootstrapEnvironment2(env, sdk, {
      parameters: {
        kmsKeyId: 'my-kms-key-id',
      }
    });

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      parameters: {
        FileAssetsBucketKmsKeyId: 'my-kms-key-id',
      },
    }));
  });

  test('passing trusted accounts without CFN managed policies results in an error', async () => {
    await expect(bootstrapEnvironment2(env, sdk, {
      parameters: {
        trustedAccounts: ['123456789012'],
      }
    }))
      .rejects
      .toThrow('--cloudformation-execution-policies are required if --trust has been passed!');
  });

  afterEach(() => {
    mockDeployStack.mockClear();
  });
});