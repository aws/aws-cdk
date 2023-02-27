import { deployStack, DeployStackOptions, ToolkitInfo } from '../../lib/api';
import { HotswapMode } from '../../lib/api/hotswap/common';
import { tryHotswapDeployment } from '../../lib/api/hotswap-deployments';
import { setCI } from '../../lib/logging';
import { DEFAULT_FAKE_TEMPLATE, testStack } from '../util';
import { MockedObject, mockResolvedEnvironment, MockSdk, MockSdkProvider, SyncHandlerSubsetOf } from '../util/mock-sdk';

jest.mock('../../lib/api/hotswap-deployments');

const FAKE_STACK = testStack({
  stackName: 'withouterrors',
});

const FAKE_STACK_WITH_PARAMETERS = testStack({
  stackName: 'withparameters',
  template: {
    Parameters: {
      HasValue: { Type: 'String' },
      HasDefault: { Type: 'String', Default: 'TheDefault' },
      OtherParameter: { Type: 'String' },
    },
  },
});

const FAKE_STACK_TERMINATION_PROTECTION = testStack({
  stackName: 'termination-protection',
  template: DEFAULT_FAKE_TEMPLATE,
  terminationProtection: true,
});

let sdk: MockSdk;
let sdkProvider: MockSdkProvider;
let cfnMocks: MockedObject<SyncHandlerSubsetOf<AWS.CloudFormation>>;
let stderrMock: jest.SpyInstance;
let stdoutMock: jest.SpyInstance;

beforeEach(() => {
  jest.resetAllMocks();
  stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });
  stdoutMock = jest.spyOn(process.stdout, 'write').mockImplementation(() => { return true; });

  sdkProvider = new MockSdkProvider();
  sdk = new MockSdk();

  cfnMocks = {
    describeStackEvents: jest.fn().mockReturnValue({}),
    describeStacks: jest.fn()
      // First call, no stacks exist
      .mockImplementationOnce(() => ({ Stacks: [] }))
      // Second call, stack has been created
      .mockImplementationOnce(() => ({
        Stacks: [
          {
            StackStatus: 'CREATE_COMPLETE',
            StackStatusReason: 'It is magic',
            EnableTerminationProtection: false,
          },
        ],
      })),
    createChangeSet: jest.fn((_o) => ({})),
    deleteChangeSet: jest.fn((_o) => ({})),
    updateStack: jest.fn((_o) => ({})),
    createStack: jest.fn((_o) => ({})),
    describeChangeSet: jest.fn((_o) => ({
      Status: 'CREATE_COMPLETE',
      Changes: [],
    })),
    executeChangeSet: jest.fn((_o) => ({})),
    deleteStack: jest.fn((_o) => ({})),
    getTemplate: jest.fn((_o) => ({ TemplateBody: JSON.stringify(DEFAULT_FAKE_TEMPLATE) })),
    updateTerminationProtection: jest.fn((_o) => ({ StackId: 'stack-id' })),
  };
  sdk.stubCloudFormation(cfnMocks as any);
  sdk.stubGetEndpointSuffix(() => 'amazonaws.com');
});

function standardDeployStackArguments(): DeployStackOptions {
  return {
    stack: FAKE_STACK,
    sdk,
    sdkProvider,
    resolvedEnvironment: mockResolvedEnvironment(),
    toolkitInfo: ToolkitInfo.bootstraplessDeploymentsOnly(sdk),
  };
}

test("calls tryHotswapDeployment() if 'hotswap' is `HotswapMode.CLASSIC`", async () => {
  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    hotswap: HotswapMode.FALL_BACK,
    extraUserAgent: 'extra-user-agent',
  });

  // THEN
  expect(tryHotswapDeployment).toHaveBeenCalled();
  // check that the extra User-Agent is honored
  expect(sdk.appendCustomUserAgent).toHaveBeenCalledWith('extra-user-agent');
  // check that the fallback has been called if hotswapping failed
  expect(sdk.appendCustomUserAgent).toHaveBeenCalledWith('cdk-hotswap/fallback');
});

test("calls tryHotswapDeployment() if 'hotswap' is `HotswapMode.HOTSWAP_ONLY`", async () => {
  cfnMocks.describeStacks = jest.fn()
    // we need the first call to return something in the Stacks prop,
    // otherwise the access to `stackId` will fail
    .mockImplementation(() => ({
      Stacks: [
        {
          StackStatus: 'CREATE_COMPLETE',
          StackStatusReason: 'It is magic',
          EnableTerminationProtection: false,
        },
      ],
    }));
  sdk.stubCloudFormation(cfnMocks as any);
  // WHEN
  const deployStackResult = await deployStack({
    ...standardDeployStackArguments(),
    hotswap: HotswapMode.HOTSWAP_ONLY,
    extraUserAgent: 'extra-user-agent',
    force: true, // otherwise, deployment would be skipped
  });

  // THEN
  expect(deployStackResult.noOp).toEqual(true);
  expect(tryHotswapDeployment).toHaveBeenCalled();
  // check that the extra User-Agent is honored
  expect(sdk.appendCustomUserAgent).toHaveBeenCalledWith('extra-user-agent');
  // check that the fallback has not been called if hotswapping failed
  expect(sdk.appendCustomUserAgent).not.toHaveBeenCalledWith('cdk-hotswap/fallback');
});

test('correctly passes CFN parameters when hotswapping', async () => {
  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    hotswap: HotswapMode.FALL_BACK,
    parameters: {
      A: 'A-value',
      B: 'B=value',
      C: undefined,
      D: '',
    },
  });

  // THEN
  expect(tryHotswapDeployment).toHaveBeenCalledWith(expect.anything(), { A: 'A-value', B: 'B=value' }, expect.anything(), expect.anything(), HotswapMode.FALL_BACK);
});

test('call CreateStack when method=direct and the stack doesnt exist yet', async () => {
  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    deploymentMethod: { method: 'direct' },
  });

  // THEN
  expect(cfnMocks.createStack).toHaveBeenCalled();
});

test('call UpdateStack when method=direct and the stack exists already', async () => {
  // WHEN
  givenStackExists();

  await deployStack({
    ...standardDeployStackArguments(),
    deploymentMethod: { method: 'direct' },
    force: true,
  });

  // THEN
  expect(cfnMocks.updateStack).toHaveBeenCalled();
});

test("does not call tryHotswapDeployment() if 'hotswap' is false", async () => {
  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    hotswap: undefined,
  });

  // THEN
  expect(tryHotswapDeployment).not.toHaveBeenCalled();
});

test("rollback still defaults to enabled even if 'hotswap' is enabled", async () => {
  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    hotswap: HotswapMode.FALL_BACK,
    rollback: undefined,
  });

  // THEN
  expect(cfnMocks.executeChangeSet).not.toHaveBeenCalledWith(expect.objectContaining({
    DisableRollback: true,
  }));
});

test("rollback defaults to enabled if 'hotswap' is undefined", async () => {
  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    hotswap: undefined,
    rollback: undefined,
  });

  // THEN
  expect(cfnMocks.executeChangeSet).toHaveBeenCalledTimes(1);
  expect(cfnMocks.executeChangeSet).not.toHaveBeenCalledWith(expect.objectContaining({
    DisableRollback: expect.anything(),
  }));
});

test('do deploy executable change set with 0 changes', async () => {
  // WHEN
  const ret = await deployStack({
    ...standardDeployStackArguments(),
  });

  // THEN
  expect(ret.noOp).toBeFalsy();
  expect(cfnMocks.executeChangeSet).toHaveBeenCalled();
});

test('correctly passes CFN parameters, ignoring ones with empty values', async () => {
  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    parameters: {
      A: 'A-value',
      B: 'B=value',
      C: undefined,
      D: '',
    },
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalledWith(expect.objectContaining({
    Parameters: [
      { ParameterKey: 'A', ParameterValue: 'A-value' },
      { ParameterKey: 'B', ParameterValue: 'B=value' },
    ],
  }));
});

test('reuse previous parameters if requested', async () => {
  // GIVEN
  givenStackExists({
    Parameters: [
      { ParameterKey: 'HasValue', ParameterValue: 'TheValue' },
      { ParameterKey: 'HasDefault', ParameterValue: 'TheOldValue' },
    ],
  });

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    stack: FAKE_STACK_WITH_PARAMETERS,
    parameters: {
      OtherParameter: 'SomeValue',
    },
    usePreviousParameters: true,
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalledWith(expect.objectContaining({
    Parameters: [
      { ParameterKey: 'HasValue', UsePreviousValue: true },
      { ParameterKey: 'HasDefault', UsePreviousValue: true },
      { ParameterKey: 'OtherParameter', ParameterValue: 'SomeValue' },
    ],
  }));
});

describe('ci=true', () => {
  beforeEach(() => {
    setCI(true);
  });
  afterEach(() => {
    setCI(false);
  });
  test('output written to stdout', async () => {
    // GIVEN

    await deployStack({
      ...standardDeployStackArguments(),
    });

    // THEN
    expect(stderrMock.mock.calls).toEqual([]);
    expect(stdoutMock.mock.calls).not.toEqual([]);
  });
});

test('do not reuse previous parameters if not requested', async () => {
  // GIVEN
  givenStackExists({
    Parameters: [
      { ParameterKey: 'HasValue', ParameterValue: 'TheValue' },
      { ParameterKey: 'HasDefault', ParameterValue: 'TheOldValue' },
    ],
  });

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    stack: FAKE_STACK_WITH_PARAMETERS,
    parameters: {
      HasValue: 'SomeValue',
      OtherParameter: 'SomeValue',
    },
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalledWith(expect.objectContaining({
    Parameters: [
      { ParameterKey: 'HasValue', ParameterValue: 'SomeValue' },
      { ParameterKey: 'OtherParameter', ParameterValue: 'SomeValue' },
    ],
  }));
});

test('throw exception if not enough parameters supplied', async () => {
  // GIVEN
  givenStackExists({
    Parameters: [
      { ParameterKey: 'HasValue', ParameterValue: 'TheValue' },
      { ParameterKey: 'HasDefault', ParameterValue: 'TheOldValue' },
    ],
  });

  // WHEN
  await expect(deployStack({
    ...standardDeployStackArguments(),
    stack: FAKE_STACK_WITH_PARAMETERS,
    parameters: {
      OtherParameter: 'SomeValue',
    },
  })).rejects.toThrow(/CloudFormation Parameters are missing a value/);
});

test('deploy is skipped if template did not change', async () => {
  // GIVEN
  givenStackExists();

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
  });

  // THEN
  expect(cfnMocks.executeChangeSet).not.toBeCalled();
});

test('deploy is skipped if parameters are the same', async () => {
  // GIVEN
  givenTemplateIs(FAKE_STACK_WITH_PARAMETERS.template);
  givenStackExists({
    Parameters: [
      { ParameterKey: 'HasValue', ParameterValue: 'HasValue' },
      { ParameterKey: 'HasDefault', ParameterValue: 'HasDefault' },
      { ParameterKey: 'OtherParameter', ParameterValue: 'OtherParameter' },
    ],
  });

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    stack: FAKE_STACK_WITH_PARAMETERS,
    parameters: {},
    usePreviousParameters: true,
  });

  // THEN
  expect(cfnMocks.createChangeSet).not.toHaveBeenCalled();
});

test('deploy is not skipped if parameters are different', async () => {
  // GIVEN
  givenTemplateIs(FAKE_STACK_WITH_PARAMETERS.template);
  givenStackExists({
    Parameters: [
      { ParameterKey: 'HasValue', ParameterValue: 'HasValue' },
      { ParameterKey: 'HasDefault', ParameterValue: 'HasDefault' },
      { ParameterKey: 'OtherParameter', ParameterValue: 'OtherParameter' },
    ],
  });

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    stack: FAKE_STACK_WITH_PARAMETERS,
    parameters: {
      HasValue: 'NewValue',
    },
    usePreviousParameters: true,
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalledWith(expect.objectContaining({
    Parameters: [
      { ParameterKey: 'HasValue', ParameterValue: 'NewValue' },
      { ParameterKey: 'HasDefault', UsePreviousValue: true },
      { ParameterKey: 'OtherParameter', UsePreviousValue: true },
    ],
  }));
});

test('if existing stack failed to create, it is deleted and recreated', async () => {
  // GIVEN
  givenStackExists(
    { StackStatus: 'ROLLBACK_COMPLETE' }, // This is for the initial check
    { StackStatus: 'DELETE_COMPLETE' }, // Poll the successful deletion
    { StackStatus: 'CREATE_COMPLETE' }, // Poll the recreation
  );
  givenTemplateIs({
    DifferentThan: 'TheDefault',
  });

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
  });

  // THEN
  expect(cfnMocks.deleteStack).toHaveBeenCalled();
  expect(cfnMocks.createChangeSet).toHaveBeenCalledWith(expect.objectContaining({
    ChangeSetType: 'CREATE',
  }));
});

test('if existing stack failed to create, it is deleted and recreated even if the template did not change', async () => {
  // GIVEN
  givenStackExists(
    { StackStatus: 'ROLLBACK_COMPLETE' }, // This is for the initial check
    { StackStatus: 'DELETE_COMPLETE' }, // Poll the successful deletion
    { StackStatus: 'CREATE_COMPLETE' }, // Poll the recreation
  );

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
  });

  // THEN
  expect(cfnMocks.deleteStack).toHaveBeenCalled();
  expect(cfnMocks.createChangeSet).toHaveBeenCalledWith(expect.objectContaining({
    ChangeSetType: 'CREATE',
  }));
});

test('deploy not skipped if template did not change and --force is applied', async () => {
  // GIVEN
  givenStackExists();

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    force: true,
  });

  // THEN
  expect(cfnMocks.executeChangeSet).toHaveBeenCalled();
});

test('deploy is skipped if template and tags did not change', async () => {
  // GIVEN
  givenStackExists({
    Tags: [
      { Key: 'Key1', Value: 'Value1' },
      { Key: 'Key2', Value: 'Value2' },
    ],
  });

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    tags: [
      { Key: 'Key1', Value: 'Value1' },
      { Key: 'Key2', Value: 'Value2' },
    ],
  });

  // THEN
  expect(cfnMocks.createChangeSet).not.toBeCalled();
  expect(cfnMocks.executeChangeSet).not.toBeCalled();
  expect(cfnMocks.describeStacks).toHaveBeenCalledWith({ StackName: 'withouterrors' });
  expect(cfnMocks.getTemplate).toHaveBeenCalledWith({ StackName: 'withouterrors', TemplateStage: 'Original' });
});

test('deploy not skipped if template did not change but tags changed', async () => {
  // GIVEN
  givenStackExists({
    Tags: [
      { Key: 'Key', Value: 'Value' },
    ],
  });

  // WHEN
  await deployStack({
    stack: FAKE_STACK,
    sdk,
    sdkProvider,
    resolvedEnvironment: mockResolvedEnvironment(),
    tags: [
      {
        Key: 'Key',
        Value: 'NewValue',
      },
    ],
    toolkitInfo: ToolkitInfo.bootstraplessDeploymentsOnly(sdk),
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalled();
  expect(cfnMocks.executeChangeSet).toHaveBeenCalled();
  expect(cfnMocks.describeChangeSet).toHaveBeenCalled();
  expect(cfnMocks.describeStacks).toHaveBeenCalledWith({ StackName: 'withouterrors' });
  expect(cfnMocks.getTemplate).toHaveBeenCalledWith({ StackName: 'withouterrors', TemplateStage: 'Original' });
});

test('deployStack reports no change if describeChangeSet returns specific error', async () => {
  cfnMocks.describeChangeSet?.mockImplementation(() => ({
    Status: 'FAILED',
    StatusReason: 'No updates are to be performed.',
  }));

  // WHEN
  const deployResult = await deployStack({
    ...standardDeployStackArguments(),
  });

  // THEN
  expect(deployResult.noOp).toEqual(true);
});

test('deploy not skipped if template did not change but one tag removed', async () => {
  // GIVEN
  givenStackExists({
    Tags: [
      { Key: 'Key1', Value: 'Value1' },
      { Key: 'Key2', Value: 'Value2' },
    ],
  });

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    tags: [
      { Key: 'Key1', Value: 'Value1' },
    ],
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalled();
  expect(cfnMocks.executeChangeSet).toHaveBeenCalled();
  expect(cfnMocks.describeChangeSet).toHaveBeenCalled();
  expect(cfnMocks.describeStacks).toHaveBeenCalledWith({ StackName: 'withouterrors' });
  expect(cfnMocks.getTemplate).toHaveBeenCalledWith({ StackName: 'withouterrors', TemplateStage: 'Original' });
});

test('deploy is not skipped if stack is in a _FAILED state', async () => {
  // GIVEN
  givenStackExists({
    StackStatus: 'DELETE_FAILED',
  });

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    usePreviousParameters: true,
  }).catch(() => {});

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalled();
});

test('existing stack in UPDATE_ROLLBACK_COMPLETE state can be updated', async () => {
  // GIVEN
  givenStackExists(
    { StackStatus: 'UPDATE_ROLLBACK_COMPLETE' }, // This is for the initial check
    { StackStatus: 'UPDATE_COMPLETE' }, // Poll the update
  );
  givenTemplateIs({ changed: 123 });

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
  });

  // THEN
  expect(cfnMocks.deleteStack).not.toHaveBeenCalled();
  expect(cfnMocks.createChangeSet).toHaveBeenCalledWith(expect.objectContaining({
    ChangeSetType: 'UPDATE',
  }));
});

test('deploy not skipped if template changed', async () => {
  // GIVEN
  givenStackExists();
  givenTemplateIs({ changed: 123 });

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
  });

  // THEN
  expect(cfnMocks.executeChangeSet).toHaveBeenCalled();
});

test('not executed and no error if --no-execute is given', async () => {
  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    deploymentMethod: { method: 'change-set', execute: false },
  });

  // THEN
  expect(cfnMocks.executeChangeSet).not.toHaveBeenCalled();
});

test('empty change set is deleted if --execute is given', async () => {
  cfnMocks.describeChangeSet?.mockImplementation(() => ({
    Status: 'FAILED',
    StatusReason: 'No updates are to be performed.',
  }));

  // GIVEN
  givenStackExists();

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    deploymentMethod: { method: 'change-set', execute: true },
    force: true, // Necessary to bypass "skip deploy"
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalled();
  expect(cfnMocks.executeChangeSet).not.toHaveBeenCalled();

  //the first deletion is for any existing cdk change sets, the second is for the deleting the new empty change set
  expect(cfnMocks.deleteChangeSet).toHaveBeenCalledTimes(2);
});

test('empty change set is not deleted if --no-execute is given', async () => {
  cfnMocks.describeChangeSet?.mockImplementation(() => ({
    Status: 'FAILED',
    StatusReason: 'No updates are to be performed.',
  }));

  // GIVEN
  givenStackExists();

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    deploymentMethod: { method: 'change-set', execute: false },
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalled();
  expect(cfnMocks.executeChangeSet).not.toHaveBeenCalled();

  //the first deletion is for any existing cdk change sets
  expect(cfnMocks.deleteChangeSet).toHaveBeenCalledTimes(1);
});

test('use S3 url for stack deployment if present in Stack Artifact', async () => {
  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    stack: testStack({
      stackName: 'withouterrors',
      properties: {
        stackTemplateAssetObjectUrl: 'https://use-me-use-me/',
      },
    }),
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalledWith(expect.objectContaining({
    TemplateURL: 'https://use-me-use-me/',
  }));
  expect(cfnMocks.executeChangeSet).toHaveBeenCalled();
});

test('use REST API S3 url with substituted placeholders if manifest url starts with s3://', async () => {
  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    stack: testStack({
      stackName: 'withouterrors',
      properties: {
        stackTemplateAssetObjectUrl: 's3://use-me-use-me-${AWS::AccountId}/object',
      },
    }),
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalledWith(expect.objectContaining({
    TemplateURL: 'https://s3.bermuda-triangle-1337.amazonaws.com/use-me-use-me-123456789/object',
  }));
  expect(cfnMocks.executeChangeSet).toHaveBeenCalled();
});

test('changeset is created when stack exists in REVIEW_IN_PROGRESS status', async () => {
  // GIVEN
  givenStackExists({
    StackStatus: 'REVIEW_IN_PROGRESS',
    Tags: [
      { Key: 'Key1', Value: 'Value1' },
      { Key: 'Key2', Value: 'Value2' },
    ],
  });

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    deploymentMethod: { method: 'change-set', execute: false },
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalledWith(
    expect.objectContaining({
      ChangeSetType: 'CREATE',
      StackName: 'withouterrors',
    }),
  );
  expect(cfnMocks.executeChangeSet).not.toHaveBeenCalled();
});

test('changeset is updated when stack exists in CREATE_COMPLETE status', async () => {
  // GIVEN
  givenStackExists({
    Tags: [
      { Key: 'Key1', Value: 'Value1' },
      { Key: 'Key2', Value: 'Value2' },
    ],
  });

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    deploymentMethod: { method: 'change-set', execute: false },
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalledWith(
    expect.objectContaining({
      ChangeSetType: 'UPDATE',
      StackName: 'withouterrors',
    }),
  );
  expect(cfnMocks.executeChangeSet).not.toHaveBeenCalled();
});

test('deploy with termination protection enabled', async () => {
  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
    stack: FAKE_STACK_TERMINATION_PROTECTION,
  });

  // THEN
  expect(cfnMocks.updateTerminationProtection).toHaveBeenCalledWith(expect.objectContaining({
    EnableTerminationProtection: true,
  }));
});

test('updateTerminationProtection not called when termination protection is undefined', async () => {
  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
  });

  // THEN
  expect(cfnMocks.updateTerminationProtection).not.toHaveBeenCalled();
});

test('updateTerminationProtection called when termination protection is undefined and stack has termination protection', async () => {
  // GIVEN
  givenStackExists({
    EnableTerminationProtection: true,
  });

  // WHEN
  await deployStack({
    ...standardDeployStackArguments(),
  });

  // THEN
  expect(cfnMocks.updateTerminationProtection).toHaveBeenCalledWith(expect.objectContaining({
    EnableTerminationProtection: false,
  }));
});

describe('disable rollback', () => {
  test('by default, we do not disable rollback (and also do not pass the flag)', async () => {
    // WHEN
    await deployStack({
      ...standardDeployStackArguments(),
    });

    // THEN
    expect(cfnMocks.executeChangeSet).toHaveBeenCalledTimes(1);
    expect(cfnMocks.executeChangeSet).not.toHaveBeenCalledWith(expect.objectContaining({
      DisableRollback: expect.anything(),
    }));
  });

  test('rollback can be disabled by setting rollback: false', async () => {
    // WHEN
    await deployStack({
      ...standardDeployStackArguments(),
      rollback: false,
    });

    // THEN
    expect(cfnMocks.executeChangeSet).toHaveBeenCalledWith(expect.objectContaining({
      DisableRollback: true,
    }));
  });

});

/**
 * Set up the mocks so that it looks like the stack exists to start with
 *
 * The last element of this array will be continuously repeated.
 */
function givenStackExists(...overrides: Array<Partial<AWS.CloudFormation.Stack>>) {
  cfnMocks.describeStacks!.mockReset();

  if (overrides.length === 0) {
    overrides = [{}];
  }

  const baseResponse = {
    StackName: 'mock-stack-name',
    StackId: 'mock-stack-id',
    CreationTime: new Date(),
    StackStatus: 'CREATE_COMPLETE',
    EnableTerminationProtection: false,
  };

  for (const override of overrides.slice(0, overrides.length - 1)) {
    cfnMocks.describeStacks!.mockImplementationOnce(() => ({
      Stacks: [{ ...baseResponse, ...override }],
    }));
  }
  cfnMocks.describeStacks!.mockImplementation(() => ({
    Stacks: [{ ...baseResponse, ...overrides[overrides.length - 1] }],
  }));
}

function givenTemplateIs(template: any) {
  cfnMocks.getTemplate!.mockReset();
  cfnMocks.getTemplate!.mockReturnValue({
    TemplateBody: JSON.stringify(template),
  });
}
