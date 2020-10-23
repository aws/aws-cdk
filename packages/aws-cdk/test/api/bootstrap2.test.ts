const mockDeployStack = jest.fn();

jest.mock('../../lib/api/deploy-stack', () => ({
  deployStack: mockDeployStack,
}));

let mockTheToolkitInfo: any;

import { Bootstrapper, DeployStackOptions, ToolkitInfo } from '../../lib/api';
import { MockSdkProvider, mockToolkitInfo } from '../util/mock-sdk';

let bootstrapper: Bootstrapper;
beforeEach(() => {
  (ToolkitInfo as any).lookup = jest.fn().mockImplementation(() => Promise.resolve(mockTheToolkitInfo));
  bootstrapper = new Bootstrapper({ source: 'default' });
});

describe('Bootstrapping v2', () => {
  const env = {
    account: '123456789012',
    region: 'us-east-1',
    name: 'mock',
  };

  let sdk: MockSdkProvider;
  beforeEach(() => {
    sdk = new MockSdkProvider({ realSdk: false });
    mockTheToolkitInfo = undefined;
  });

  afterEach(() => {
    mockDeployStack.mockClear();
  });

  test('passes the bucket name as a CFN parameter', async () => {
    await bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        bucketName: 'my-bucket-name',
        cloudFormationExecutionPolicies: ['arn:policy'],
      },
    });

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      parameters: expect.objectContaining({
        FileAssetsBucketName: 'my-bucket-name',
        PublicAccessBlockConfiguration: 'true',
      }),
    }));
  });

  test('passes the KMS key ID as a CFN parameter', async () => {
    await bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        cloudFormationExecutionPolicies: ['arn:policy'],
        kmsKeyId: 'my-kms-key-id',
      },
    });

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      parameters: expect.objectContaining({
        FileAssetsBucketKmsKeyId: 'my-kms-key-id',
        PublicAccessBlockConfiguration: 'true',
      }),
    }));
  });

  test('passes false to PublicAccessBlockConfiguration', async () => {
    await bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        cloudFormationExecutionPolicies: ['arn:policy'],
        publicAccessBlockConfiguration: false,
      },
    });

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      parameters: expect.objectContaining({
        PublicAccessBlockConfiguration: 'false',
      }),
    }));
  });

  test('passing trusted accounts without CFN managed policies results in an error', async () => {
    await expect(bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        trustedAccounts: ['123456789012'],
      },
    }))
      .rejects
      .toThrow(/--cloudformation-execution-policies/);
  });

  test('passing trusted accounts without CFN managed policies on the existing stack results in an error', async () => {
    mockTheToolkitInfo = {
      parameters: {
        CloudFormationExecutionPolicies: '',
      },
    };

    await expect(bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        trustedAccounts: ['123456789012'],
      },
    }))
      .rejects
      .toThrow(/--cloudformation-execution-policies/);
  });

  test('passing no CFN managed policies without trusted accounts is okay', async () => {
    await bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {},
    });

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      parameters: expect.objectContaining({
        CloudFormationExecutionPolicies: '',
      }),
    }));
  });

  test('allow adding trusted account if there was already a policy on the stack', async () => {
    // GIVEN
    mockTheToolkitInfo = {
      parameters: {
        CloudFormationExecutionPolicies: 'arn:aws:something',
      },
    };

    await bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        trustedAccounts: ['123456789012'],
      },
    });
    // Did not throw
  });

  test('Do not allow downgrading bootstrap stack version', async () => {
    // GIVEN
    mockTheToolkitInfo = {
      version: 999,
    };

    await expect(bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        cloudFormationExecutionPolicies: ['arn:policy'],
      },
    }))
      .rejects.toThrow('Not downgrading existing bootstrap stack');
  });

  test('bootstrap template has the right exports', async () => {
    let template: any;
    mockDeployStack.mockImplementation((args: DeployStackOptions) => {
      template = args.stack.template;
    });

    await bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        cloudFormationExecutionPolicies: ['arn:policy'],
      },
    });

    const exports = Object.values(template.Outputs ?? {})
      .filter((o: any) => o.Export !== undefined)
      .map((o: any) => o.Export.Name);

    expect(exports).toEqual([
      // This used to be used by aws-s3-assets
      { 'Fn::Sub': 'CdkBootstrap-${Qualifier}-FileAssetKeyArn' },
    ]);
  });

  describe('termination protection', () => {
    test('stack is not termination protected by default', async () => {
      await bootstrapper.bootstrapEnvironment(env, sdk, {
        parameters: {
          cloudFormationExecutionPolicies: ['arn:policy'],
        },
      });

      expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
        stack: expect.objectContaining({
          terminationProtection: false,
        }),
      }));
    });

    test('stack is termination protected when option is set', async () => {
      await bootstrapper.bootstrapEnvironment(env, sdk, {
        terminationProtection: true,
        parameters: {
          cloudFormationExecutionPolicies: ['arn:policy'],
        },
      });

      expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
        stack: expect.objectContaining({
          terminationProtection: true,
        }),
      }));
    });

    test('termination protection is left alone when option is not given', async () => {
      mockTheToolkitInfo = mockToolkitInfo({
        EnableTerminationProtection: true,
      });

      await bootstrapper.bootstrapEnvironment(env, sdk, {
        parameters: {
          cloudFormationExecutionPolicies: ['arn:policy'],
        },
      });

      expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
        stack: expect.objectContaining({
          terminationProtection: true,
        }),
      }));
    });

    test('termination protection can be switched off', async () => {
      mockTheToolkitInfo = mockToolkitInfo({
        EnableTerminationProtection: true,
      });

      await bootstrapper.bootstrapEnvironment(env, sdk, {
        terminationProtection: false,
        parameters: {
          cloudFormationExecutionPolicies: ['arn:policy'],
        },
      });

      expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
        stack: expect.objectContaining({
          terminationProtection: false,
        }),
      }));
    });
  });

  describe('KMS key', () => {
    test.each([
      // Default case
      [undefined, 'AWS_MANAGED_KEY'],
      // Create a new key
      [true, ''],
      // Don't create a new key
      [false, 'AWS_MANAGED_KEY'],
    ])('(new stack) createCustomerMasterKey=%p => parameter becomes %p ', async (createCustomerMasterKey, paramKeyId) => {
      // GIVEN: no existing stack

      // WHEN
      await bootstrapper.bootstrapEnvironment(env, sdk, {
        parameters: {
          createCustomerMasterKey,
          cloudFormationExecutionPolicies: ['arn:booh'],
        },
      });

      // THEN
      expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
        parameters: expect.objectContaining({
          FileAssetsBucketKmsKeyId: paramKeyId,
        }),
      }));
    });

    test.each([
      // Old bootstrap stack being upgraded to new one
      [undefined, undefined, 'AWS_MANAGED_KEY'],
      // There is a value, user doesn't request a change
      ['arn:aws:key', undefined, undefined],
      // Switch off existing key
      ['arn:aws:key', false, 'AWS_MANAGED_KEY'],
      // Switch on existing key
      ['AWS_MANAGED_KEY', true, ''],
    ])('(upgrading) current param %p, createCustomerMasterKey=%p => parameter becomes %p ', async (currentKeyId, createCustomerMasterKey, paramKeyId) => {
      // GIVEN
      mockTheToolkitInfo = mockToolkitInfo({
        Parameters: currentKeyId ? [{ ParameterKey: 'FileAssetsBucketKmsKeyId', ParameterValue: currentKeyId }] : undefined,
      });

      // WHEN
      await bootstrapper.bootstrapEnvironment(env, sdk, {
        parameters: {
          createCustomerMasterKey,
          cloudFormationExecutionPolicies: ['arn:booh'],
        },
      });

      // THEN
      expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
        parameters: expect.objectContaining({
          FileAssetsBucketKmsKeyId: paramKeyId,
        }),
      }));
    });
  });
});