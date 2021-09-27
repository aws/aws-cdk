import * as cxapi from '@aws-cdk/cx-api';
import { StepFunctions, CloudFormation } from 'aws-sdk';
import { StackResourceSummaries } from 'aws-sdk/clients/cloudformation';
import { tryHotswapDeployment } from '../../lib/api/hotswap-deployments';
import { testStack, TestStackArtifact } from '../util';
import { MockSdkProvider } from '../util/mock-sdk';
import { FakeCloudformationStack } from './fake-cloudformation-stack';

const STACK_NAME = 'withouterrors';
const STACK_ID = 'stackId';

let mockSdkProvider: MockSdkProvider;
let mockUpdateMachineDefinition: (params: StepFunctions.Types.UpdateStateMachineInput) => StepFunctions.Types.UpdateStateMachineOutput;
let mockListStackResources: (params: CloudFormation.Types.ListStackResourcesInput) => CloudFormation.Types.ListStackResourcesOutput;
let currentCfnStack: FakeCloudformationStack;

beforeEach(() => {
  jest.resetAllMocks();
  mockSdkProvider = new MockSdkProvider({ realSdk: false });
  mockListStackResources = jest.fn(() => {
    let summaries: StackResourceSummaries = [];

    // Mock state machine stack resource
    summaries[0] = {
      LogicalResourceId: 'Machine',
      ResourceType: 'AWS::StepFunctions::StateMachine',
      ResourceStatus: 'CREATE_COMPLETE',
      LastUpdatedTimestamp: new Date(),
      PhysicalResourceId: 'mock-machine-resource-id',
    };

    return { StackResourceSummaries: summaries };
  });
  mockUpdateMachineDefinition = jest.fn();
  mockSdkProvider.stubCloudFormation({
    listStackResources: mockListStackResources,
  });
  mockSdkProvider.stubStepFunctions({
    updateStateMachine: mockUpdateMachineDefinition,
  });
  currentCfnStack = new FakeCloudformationStack({
    stackName: STACK_NAME,
    stackId: STACK_ID,
  });
});

test('returns undefined when a new StateMachine is added to the Stack', async () => {
  // GIVEN
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await tryHotswapDeployment(mockSdkProvider, {}, currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
});

test('calls the updateStateMachine() API when it receives only a definitionString change in a state machine', async () => {
  // GIVEN
  currentCfnStack.setTemplate({
    Resources: {
      Machine: {
        Type: 'AWS::StepFunctions::StateMachine',
        Properties: {
          DefinitionString: {
            'Fn::Join': [
              '',
              [
                '{ "Prop" : "old-value", "AnotherProp" : "another-old-value" }',
              ],
            ],
          },
          StateMachineName: 'my-machine',
        },
      },
    },
  });
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
          Properties: {
            DefinitionString: {
              'Fn::Join': [
                '',
                [
                  '{ "Prop" : "new-value", "AnotherProp" : "another-new-value" }',
                ],
              ],
            },
            StateMachineName: 'my-machine',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await tryHotswapDeployment(mockSdkProvider, {}, currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
    definition: '{"Prop":"new-value","AnotherProp":"another-new-value"}',
    stateMachineArn: 'my-machine',
  });
});

test('calls the updateStateMachine() API when it receives a change to the definitionString in a state machine that has no name', async () => {
  // GIVEN
  currentCfnStack.setTemplate({
    Resources: {
      Machine: {
        Type: 'AWS::StepFunctions::StateMachine',
        Properties: {
          DefinitionString: {
            'Fn::Join': [
              '',
              [
                '{ "Prop" : "old-value" }',
              ],
            ],
          },
        },
      },
    },
  });
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
          Properties: {
            DefinitionString: {
              'Fn::Join': [
                '',
                [
                  '{ "Prop" : "new-value" }',
                ],
              ],
            },
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await tryHotswapDeployment(mockSdkProvider, {}, currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
    definition: '{"Prop":"new-value"}',
    stateMachineArn: 'mock-machine-resource-id', // the sdk will convert the ID to the arn in a production environment
  });
});

test('does not call the updateStateMachine() API when it receives a change to a parameter that is not the definitionString in a state machine', async () => {
  // GIVEN
  currentCfnStack.setTemplate({
    Resources: {
      Machine: {
        Type: 'AWS::StepFunctions::StateMachine',
        Properties: {
          DefinitionString: {
            'Fn::Join': [
              '',
              [
                '{ "Prop" : "old-value" }',
              ],
            ],
          },
          LoggingConfiguration: { // non-definitionString property
            IncludeExecutionData: true,
          },
        },
      },
    },
  });
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
          Properties: {
            DefinitionString: {
              'Fn::Join': [
                '',
                [
                  '{ "Prop" : "old-value" }',
                ],
              ],
            },
            LoggingConfiguration: {
              IncludeExecutionData: false,
            },
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await tryHotswapDeployment(mockSdkProvider, {}, currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
});

function cdkStackArtifactOf(testStackArtifact: Partial<TestStackArtifact> = {}): cxapi.CloudFormationStackArtifact {
  return testStack({
    stackName: STACK_NAME,
    ...testStackArtifact,
  });
}
