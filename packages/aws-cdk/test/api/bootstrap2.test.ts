
const mockDeployStack = jest.fn();

jest.mock('../../lib/api/deploy-stack', () => ({
  deployStack: mockDeployStack,
}));

import { IAM } from 'aws-sdk';
import { Bootstrapper, DeployStackOptions, ToolkitInfo } from '../../lib/api';
import { mockBootstrapStack, MockSdk, MockSdkProvider } from '../util/mock-sdk';

let bootstrapper: Bootstrapper;
let mockGetPolicyIamCode: (params: IAM.Types.GetPolicyRequest) => IAM.Types.GetPolicyResponse;
let mockCreatePolicyIamCode: (params: IAM.Types.CreatePolicyRequest) => IAM.Types.CreatePolicyResponse;
let stderrMock: jest.SpyInstance;

beforeEach(() => {
  bootstrapper = new Bootstrapper({ source: 'default' });
  stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });
});

afterEach(() => {
  stderrMock.mockRestore();
});

function mockTheToolkitInfo(stackProps: Partial<AWS.CloudFormation.Stack>) {
  const sdk = new MockSdk();
  (ToolkitInfo as any).lookup = jest.fn().mockResolvedValue(ToolkitInfo.fromStack(mockBootstrapStack(sdk, stackProps), sdk));
}

describe('Bootstrapping v2', () => {
  const env = {
    account: '123456789012',
    region: 'us-east-1',
    name: 'mock',
  };

  let sdk: MockSdkProvider;
  beforeEach(() => {
    sdk = new MockSdkProvider({ realSdk: false });
    // By default, we'll return a non-found toolkit info
    (ToolkitInfo as any).lookup = jest.fn().mockResolvedValue(ToolkitInfo.bootstraplessDeploymentsOnly(sdk.sdk));
    const value = {
      Policy: {
        PolicyName: 'my-policy',
        Arn: 'arn:aws:iam::0123456789012:policy/my-policy',
      },
    };
    mockGetPolicyIamCode = jest.fn().mockReturnValue(value);
    mockCreatePolicyIamCode = jest.fn().mockReturnValue(value);
    sdk.stubIam({
      createPolicy: mockCreatePolicyIamCode,
      getPolicy: mockGetPolicyIamCode,
    });
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

  test('passes true to PermissionsBoundary', async () => {
    await bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        examplePermissionsBoundary: true,
      },
    });

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      parameters: expect.objectContaining({
        InputPermissionsBoundary: 'cdk-hnb659fds-permissions-boundary',
      }),
    }));
  });

  test('passes value to PermissionsBoundary', async () => {
    mockTheToolkitInfo({
      Parameters: [
        {
          ParameterKey: 'InputPermissionsBoundary',
          ParameterValue: 'existing-pb',
        },
      ],
    });
    await bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        customPermissionsBoundary: 'permissions-boundary-name',
      },
    });

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      parameters: expect.objectContaining({
        InputPermissionsBoundary: 'permissions-boundary-name',
      }),
    }));
    expect(stderrMock.mock.calls).toEqual(expect.arrayContaining([
      expect.arrayContaining([
        expect.stringMatching(/Changing permissions boundary from existing-pb to permissions-boundary-name/),
      ]),
    ]));
  });

  test('permission boundary switch message does not appear', async () => {
    mockTheToolkitInfo({
      Parameters: [
        {
          ParameterKey: 'InputPermissionsBoundary',
          ParameterValue: '',
        },
      ],
    });
    await bootstrapper.bootstrapEnvironment(env, sdk);

    expect(stderrMock.mock.calls).toEqual(expect.arrayContaining([
      expect.not.arrayContaining([
        expect.stringMatching(/Changing permissions boundary/),
      ]),
    ]));
  });

  test('adding new permissions boundary', async () => {
    mockTheToolkitInfo({
      Parameters: [
        {
          ParameterKey: 'InputPermissionsBoundary',
          ParameterValue: '',
        },
      ],
    });
    await bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        customPermissionsBoundary: 'permissions-boundary-name',
      },
    });

    expect(stderrMock.mock.calls).toEqual(expect.arrayContaining([
      expect.arrayContaining([
        expect.stringMatching(/Adding new permissions boundary permissions-boundary-name/),
      ]),
    ]));
  });

  test('removing existing permissions boundary', async () => {
    mockTheToolkitInfo({
      Parameters: [
        {
          ParameterKey: 'InputPermissionsBoundary',
          ParameterValue: 'permissions-boundary-name',
        },
      ],
    });
    await bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {},
    });

    expect(stderrMock.mock.calls).toEqual(expect.arrayContaining([
      expect.arrayContaining([
        expect.stringMatching(/Removing existing permissions boundary permissions-boundary-name/),
      ]),
    ]));
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
    mockTheToolkitInfo({
      Parameters: [
        {
          ParameterKey: 'CloudFormationExecutionPolicies',
          ParameterValue: '',
        },
      ],
    });

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

  test('passing trusted accounts for lookup generates the correct stack parameter', async () => {
    await bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        trustedAccountsForLookup: ['123456789012'],
        cloudFormationExecutionPolicies: ['aws://foo'],
      },
    });

    expect(mockDeployStack).toHaveBeenCalledWith(expect.objectContaining({
      parameters: expect.objectContaining({
        TrustedAccountsForLookup: '123456789012',
      }),
    }));
  });

  test('allow adding trusted account if there was already a policy on the stack', async () => {
    // GIVEN
    mockTheToolkitInfo({
      Parameters: [
        {
          ParameterKey: 'CloudFormationExecutionPolicies',
          ParameterValue: 'arn:aws:something',
        },
      ],
    });

    await bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        trustedAccounts: ['123456789012'],
      },
    });
    // Did not throw
  });

  test('Do not allow downgrading bootstrap stack version', async () => {
    // GIVEN
    mockTheToolkitInfo({
      Outputs: [
        {
          OutputKey: 'BootstrapVersion',
          OutputValue: '999',
        },
      ],
    });

    await expect(bootstrapper.bootstrapEnvironment(env, sdk, {
      parameters: {
        cloudFormationExecutionPolicies: ['arn:policy'],
      },
    })).resolves.toEqual(expect.objectContaining({ noOp: true }));
  });

  test('Do not allow overwriting bootstrap stack from a different vendor', async () => {
    // GIVEN
    mockTheToolkitInfo({
      Parameters: [
        {
          ParameterKey: 'BootstrapVariant',
          ParameterValue: 'JoeSchmoe',
        },
      ],
    });

    await expect(bootstrapper.bootstrapEnvironment(env, sdk, {
    })).resolves.toEqual(expect.objectContaining({ noOp: true }));
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
      mockTheToolkitInfo({
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
      mockTheToolkitInfo({
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
      mockTheToolkitInfo({
        Parameters: currentKeyId ? [
          {
            ParameterKey: 'FileAssetsBucketKmsKeyId',
            ParameterValue: currentKeyId,
          },
        ] : undefined,
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
