import { deployStack } from '../../lib';
import { testStack } from '../util';
import { mockResolvedEnvironment, MockSdk, MockSdkProvider } from '../util/mock-sdk';

const FAKE_TEMPLATE = { resource: 'noerrorresource' };

const FAKE_STACK = testStack({
  stackName: 'withouterrors',
  template: FAKE_TEMPLATE,
});

let sdk: MockSdk;
let sdkProvider: MockSdkProvider;
beforeEach(() => {
  sdkProvider = new MockSdkProvider();
  sdk = new MockSdk();
});

test('do deploy executable change set with 0 changes', async () => {
  // GIVEN

  let executed = false;

  sdk.stubCloudFormation({
    describeStacks() {
      return {
        Stacks: []
      };
    },

    createChangeSet() {
      return {};
    },

    describeChangeSet() {
      return {
        Status: 'CREATE_COMPLETE',
        Changes: [],
      };
    },

    executeChangeSet() {
      executed = true;
      return {};
    }
  });

  // WHEN
  const ret = await deployStack({
    stack: FAKE_STACK,
    resolvedEnvironment: mockResolvedEnvironment(),
    sdk,
    sdkProvider,
  });

  // THEN
  expect(ret.noOp).toBeFalsy();
  expect(executed).toBeTruthy();
});

test('correctly passes CFN parameters, ignoring ones with empty values', async () => {
  // GIVEN
  let parameters: any[] | undefined;

  sdk.stubCloudFormation({
    describeStacks() {
      return {
        Stacks: []
      };
    },

    createChangeSet(options) {
      parameters = options.Parameters;
      return {};
    },

    describeChangeSet() {
      return {
        Status: 'CREATE_COMPLETE',
        Changes: [],
      };
    },

    executeChangeSet() {
      return {};
    }
  });

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
  expect(parameters).toStrictEqual([
    { ParameterKey: 'A', ParameterValue: 'A-value' },
  ]);
});

test('deploy is skipped if template did not change', async () => {
  let describeStacksInput: AWS.CloudFormation.DescribeStacksInput;
  let getTemplateInput: AWS.CloudFormation.GetTemplateInput;
  let createChangeSetCalled = false;
  let executeChangeSetCalled = false;

  sdk.stubCloudFormation({
    getTemplate(input) {
      getTemplateInput = input;
      return {
        TemplateBody: JSON.stringify(FAKE_TEMPLATE)
      };
    },
    describeStacks(input) {
      describeStacksInput = input;
      return {
        Stacks: [
          {
            StackName: 'mock-stack-name',
            StackId: 'mock-stack-id',
            CreationTime: new Date(),
            StackStatus: 'CREATE_COMPLETE'
          }
        ]
      };
    },
    createChangeSet() {
      createChangeSetCalled = true;
      return { };
    },
    executeChangeSet() {
      executeChangeSetCalled = true;
      return { };
    }
  });

  await deployStack({
    stack: FAKE_STACK,
    sdk,
    sdkProvider,
    resolvedEnvironment: mockResolvedEnvironment(),
  });

  expect(createChangeSetCalled).toBeFalsy();
  expect(executeChangeSetCalled).toBeFalsy();
  expect(describeStacksInput!).toStrictEqual({ StackName: 'withouterrors' });
  expect(getTemplateInput!).toStrictEqual({ StackName: 'withouterrors', TemplateStage: 'Original' });
});

test('deploy is skipped if template and tags did not change', async () => {
  let describeStacksInput: AWS.CloudFormation.DescribeStacksInput;
  let getTemplateInput: AWS.CloudFormation.GetTemplateInput;
  let createChangeSetCalled = false;
  let executeChangeSetCalled = false;

  sdk.stubCloudFormation({
    getTemplate(input) {
      getTemplateInput = input;
      return {
        TemplateBody: JSON.stringify(FAKE_TEMPLATE)
      };
    },
    describeStacks(input) {
      describeStacksInput = input;
      return {
        Stacks: [
          {
            StackName: 'mock-stack-name',
            StackId: 'mock-stack-id',
            CreationTime: new Date(),
            StackStatus: 'CREATE_COMPLETE',
            Tags: [
              {
                Key: 'Key1',
                Value: 'Value1'
              },
              {
                Key: 'Key2',
                Value: 'Value2'
              }
            ]
          }
        ]
      };
    },
    createChangeSet() {
      createChangeSetCalled = true;
      return { };
    },
    executeChangeSet() {
      executeChangeSetCalled = true;
      return { };
    }
  });

  await deployStack({
    stack: FAKE_STACK,
    tags: [
      {
        Key: 'Key1',
        Value: 'Value1'
      },
      {
        Key: 'Key2',
        Value: 'Value2'
      }
    ],
    sdk,
    sdkProvider,
    resolvedEnvironment: mockResolvedEnvironment(),
  });

  expect(createChangeSetCalled).toBeFalsy();
  expect(executeChangeSetCalled).toBeFalsy();
  expect(describeStacksInput!).toStrictEqual({ StackName: 'withouterrors' });
  expect(getTemplateInput!).toStrictEqual({ StackName: 'withouterrors', TemplateStage: 'Original' });
});

test('deploy not skipped if template did not change but tags changed', async () => {
  let describeStacksInput: AWS.CloudFormation.DescribeStacksInput;
  let getTemplateInput: AWS.CloudFormation.GetTemplateInput;
  let createChangeSetCalled = false;
  let executeChangeSetCalled = false;
  let describeChangeSetCalled = false;

  sdk.stubCloudFormation({
    getTemplate(input) {
      getTemplateInput = input;
      return {
        TemplateBody: JSON.stringify(FAKE_TEMPLATE)
      };
    },
    describeStacks(input) {
      describeStacksInput = input;
      return {
        Stacks: [
          {
            StackName: 'mock-stack-name',
            StackId: 'mock-stack-id',
            CreationTime: new Date(),
            StackStatus: 'CREATE_COMPLETE',
            Tags: [
              {
                Key: 'Key',
                Value: 'Value'
              },
            ]
          }
        ]
      };
    },
    createChangeSet() {
      createChangeSetCalled = true;
      return { };
    },
    executeChangeSet() {
      executeChangeSetCalled = true;
      return { };
    },
    describeChangeSet() {
      describeChangeSetCalled = true;
      return {
        Status: 'CREATE_COMPLETE',
        Changes: [],
      };
    }
  });

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

  expect(createChangeSetCalled).toBeTruthy();
  expect(executeChangeSetCalled).toBeTruthy();
  expect(describeChangeSetCalled).toBeTruthy();
  expect(describeStacksInput!).toStrictEqual({ StackName: "withouterrors" });
  expect(getTemplateInput!).toStrictEqual({ StackName: 'withouterrors', TemplateStage: 'Original' });
});

test('deploy not skipped if template did not change but one tag removed', async () => {
  let describeStacksInput: AWS.CloudFormation.DescribeStacksInput;
  let getTemplateInput: AWS.CloudFormation.GetTemplateInput;
  let createChangeSetCalled = false;
  let executeChangeSetCalled = false;
  let describeChangeSetCalled = false;

  sdk.stubCloudFormation({
    getTemplate(input) {
      getTemplateInput = input;
      return {
        TemplateBody: JSON.stringify(FAKE_TEMPLATE)
      };
    },
    describeStacks(input) {
      describeStacksInput = input;
      return {
        Stacks: [
          {
            StackName: 'mock-stack-name',
            StackId: 'mock-stack-id',
            CreationTime: new Date(),
            StackStatus: 'CREATE_COMPLETE',
            Tags: [
              {
                Key: 'Key1',
                Value: 'Value1'
              },
              {
                Key: 'Key2',
                Value: 'Value2'
              },
            ]
          }
        ]
      };
    },
    createChangeSet() {
      createChangeSetCalled = true;
      return { };
    },
    executeChangeSet() {
      executeChangeSetCalled = true;
      return { };
    },
    describeChangeSet() {
      describeChangeSetCalled = true;
      return {
        Status: 'CREATE_COMPLETE',
        Changes: [],
      };
    }
  });

  await deployStack({
    stack: FAKE_STACK,
    sdk,
    sdkProvider,
    resolvedEnvironment: mockResolvedEnvironment(),
    tags: [
      {
        Key: 'Key1',
        Value: 'Value1'
      }
    ]
  });

  expect(createChangeSetCalled).toBeTruthy();
  expect(executeChangeSetCalled).toBeTruthy();
  expect(describeChangeSetCalled).toBeTruthy();
  expect(describeStacksInput!).toStrictEqual({ StackName: "withouterrors" });
  expect(getTemplateInput!).toStrictEqual({ StackName: 'withouterrors', TemplateStage: 'Original' });
});

test('deploy not skipped if template did not change and --force is applied', async () => {
  let describeStacksInput: AWS.CloudFormation.DescribeStacksInput;
  let getTemplateInput: AWS.CloudFormation.GetTemplateInput;
  let createChangeSetCalled = false;
  let executeChangeSetCalled = false;
  let describeChangeSetCalled = false;

  sdk.stubCloudFormation({
    getTemplate(input) {
      getTemplateInput = input;
      return {
        TemplateBody: JSON.stringify(FAKE_TEMPLATE)
      };
    },
    describeStacks(input) {
      describeStacksInput = input;
      return {
        Stacks: [
          {
            StackName: 'mock-stack-name',
            StackId: 'mock-stack-id',
            CreationTime: new Date(),
            StackStatus: 'CREATE_COMPLETE'
          }
        ]
      };
    },
    createChangeSet() {
      createChangeSetCalled = true;
      return { };
    },
    executeChangeSet() {
      executeChangeSetCalled = true;
      return { };
    },
    describeChangeSet() {
      describeChangeSetCalled = true;
      return {
        Status: 'CREATE_COMPLETE',
        Changes: [],
      };
    }
  });

  await deployStack({
    stack: FAKE_STACK,
    sdk,
    sdkProvider,
    resolvedEnvironment: mockResolvedEnvironment(),
    force: true
  });

  expect(createChangeSetCalled).toBeTruthy();
  expect(executeChangeSetCalled).toBeTruthy();
  expect(describeChangeSetCalled).toBeTruthy();
  expect(getTemplateInput!).toBeUndefined();
  expect(describeStacksInput!).toStrictEqual({ StackName: "withouterrors" });
});

test('deploy not skipped if template changed', async () => {
  let describeStacksInput: AWS.CloudFormation.DescribeStacksInput;
  let getTemplateInput: AWS.CloudFormation.GetTemplateInput;
  let createChangeSetCalled = false;
  let executeChangeSetCalled = false;
  let describeChangeSetCalled = false;

  sdk.stubCloudFormation({
    getTemplate(input) {
      getTemplateInput = input;
      return {
        TemplateBody: JSON.stringify({ changed: 123 })
      };
    },
    describeStacks(input) {
      describeStacksInput = input;
      return {
        Stacks: [
          {
            StackName: 'mock-stack-name',
            StackId: 'mock-stack-id',
            CreationTime: new Date(),
            StackStatus: 'CREATE_COMPLETE'
          }
        ]
      };
    },
    createChangeSet() {
      createChangeSetCalled = true;
      return { };
    },
    executeChangeSet() {
      executeChangeSetCalled = true;
      return { };
    },
    describeChangeSet() {
      describeChangeSetCalled = true;
      return {
        Status: 'CREATE_COMPLETE',
        Changes: [],
      };
    }
  });

  await deployStack({
    stack: FAKE_STACK,
    sdk,
    sdkProvider,
    resolvedEnvironment: mockResolvedEnvironment(),
  });

  expect(createChangeSetCalled).toBeTruthy();
  expect(executeChangeSetCalled).toBeTruthy();
  expect(describeChangeSetCalled).toBeTruthy();
  expect(describeStacksInput!).toStrictEqual({ StackName: "withouterrors" });
  expect(getTemplateInput!).toStrictEqual({ StackName: 'withouterrors', TemplateStage: 'Original' });
});
