import { deployStack } from '../../lib';
import { testStack } from '../util';
import { MockedObject, mockResolvedEnvironment, MockSdk, MockSdkProvider, SyncHandlerSubsetOf } from '../util/mock-sdk';

const FAKE_TEMPLATE = { resource: 'noerrorresource' };

const FAKE_STACK = testStack({
  stackName: 'withouterrors',
  template: FAKE_TEMPLATE,
});

let sdk: MockSdk;
let sdkProvider: MockSdkProvider;
let cfnMocks: MockedObject<SyncHandlerSubsetOf<AWS.CloudFormation>>;
beforeEach(() => {
  sdkProvider = new MockSdkProvider();
  sdk = new MockSdk();

  cfnMocks = {
    describeStacks: jest.fn()
      // First call, no stacks exist
      .mockImplementationOnce(() => ({ Stacks: [] }))
      // Second call, stack has been created
      .mockImplementationOnce(() => ({ Stacks: [
        {
          StackStatus: 'CREATE_COMPLETE',
          StackStatusReason: 'It is magic',
        }
      ] })),
    createChangeSet: jest.fn((_o) => ({})),
    describeChangeSet: jest.fn((_o) => ({
      Status: 'CREATE_COMPLETE',
      Changes: [],
    })),
    executeChangeSet: jest.fn((_o) => ({})),
    getTemplate: jest.fn((_o) => ({ TemplateBody: JSON.stringify(FAKE_TEMPLATE) })),
  };
  sdk.stubCloudFormation(cfnMocks as any);
});

test('do deploy executable change set with 0 changes', async () => {
  // WHEN
  const ret = await deployStack({
    stack: FAKE_STACK,
    resolvedEnvironment: mockResolvedEnvironment(),
    sdk,
    sdkProvider,
  });

  // THEN
  expect(ret.noOp).toBeFalsy();
  expect(cfnMocks.executeChangeSet).toHaveBeenCalled();
});

test('correctly passes CFN parameters, ignoring ones with empty values', async () => {
  // WHEN
  await deployStack({
    stack: FAKE_STACK,
    sdk,
    sdkProvider,
    resolvedEnvironment: mockResolvedEnvironment(),
    parameters: {
      A: 'A-value',
      B: undefined,
      C: '',
    },
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalledWith(expect.objectContaining({
    Parameters: [
      { ParameterKey: 'A', ParameterValue: 'A-value' },
    ]
  }));
});

test('deploy is skipped if template did not change', async () => {
  // GIVEN
  givenStackExists();

  // WHEN
  await deployStack({
    stack: FAKE_STACK,
    sdk,
    sdkProvider,
    resolvedEnvironment: mockResolvedEnvironment(),
  });

  // THEN
  expect(cfnMocks.executeChangeSet).not.toBeCalled();
});

test('deploy not skipped if template did not change and --force is applied', async () => {
  // GIVEN
  givenStackExists();

  // WHEN
  await deployStack({
    stack: FAKE_STACK,
    sdk,
    sdkProvider,
    resolvedEnvironment: mockResolvedEnvironment(),
    force: true
  });

  // THEN
  expect(cfnMocks.executeChangeSet).toHaveBeenCalled();
});

test('deploy is skipped if template and tags did not change', async () => {
  // GIVEN
  givenStackExists({
    Tags: [
      { Key: 'Key1', Value: 'Value1' },
      { Key: 'Key2', Value: 'Value2' }
    ]
  });

  // WHEN
  await deployStack({
    stack: FAKE_STACK,
    tags: [
      { Key: 'Key1', Value: 'Value1' },
      { Key: 'Key2', Value: 'Value2' }
    ],
    sdk,
    sdkProvider,
    resolvedEnvironment: mockResolvedEnvironment(),
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
    ]
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
        Value: 'NewValue'
      }
    ]
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalled();
  expect(cfnMocks.executeChangeSet).toHaveBeenCalled();
  expect(cfnMocks.describeChangeSet).toHaveBeenCalled();
  expect(cfnMocks.describeStacks).toHaveBeenCalledWith({ StackName: 'withouterrors' });
  expect(cfnMocks.getTemplate).toHaveBeenCalledWith({ StackName: 'withouterrors', TemplateStage: 'Original' });
});

test('deploy not skipped if template did not change but one tag removed', async () => {
  // GIVEN
  givenStackExists({
    Tags: [
      { Key: 'Key1', Value: 'Value1' },
      { Key: 'Key2', Value: 'Value2' },
    ]
  });

  // WHEN
  await deployStack({
    stack: FAKE_STACK,
    sdk,
    sdkProvider,
    resolvedEnvironment: mockResolvedEnvironment(),
    tags: [
      { Key: 'Key1', Value: 'Value1' }
    ]
  });

  // THEN
  expect(cfnMocks.createChangeSet).toHaveBeenCalled();
  expect(cfnMocks.executeChangeSet).toHaveBeenCalled();
  expect(cfnMocks.describeChangeSet).toHaveBeenCalled();
  expect(cfnMocks.describeStacks).toHaveBeenCalledWith({ StackName: 'withouterrors' });
  expect(cfnMocks.getTemplate).toHaveBeenCalledWith({ StackName: 'withouterrors', TemplateStage: 'Original' });
});

test('deploy not skipped if template changed', async () => {
  // GIVEN
  givenStackExists();
  cfnMocks.getTemplate!.mockReset();
  cfnMocks.getTemplate!.mockReturnValue({
    TemplateBody: JSON.stringify({ changed: 123 })
  });

  // WHEN
  await deployStack({
    stack: FAKE_STACK,
    sdk,
    sdkProvider,
    resolvedEnvironment: mockResolvedEnvironment(),
  });

  // THEN
  expect(cfnMocks.executeChangeSet).toHaveBeenCalled();
});

/**
 * Set up the mocks so that it looks like the stack exists to start with
 */
function givenStackExists(overrides: Partial<AWS.CloudFormation.Stack> = {}) {
  cfnMocks.describeStacks!.mockReset();
  cfnMocks.describeStacks!.mockImplementation(() => ({
    Stacks: [
      {
        StackName: 'mock-stack-name',
        StackId: 'mock-stack-id',
        CreationTime: new Date(),
        StackStatus: 'CREATE_COMPLETE',
        ...overrides
      }
    ]
  }));
}