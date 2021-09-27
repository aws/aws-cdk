import { StepFunctions } from 'aws-sdk';
import { StackResourceSummary } from 'aws-sdk/clients/cloudformation';
import { tryHotswapDeployment } from '../../lib/api/hotswap-deployments';
import * as setup from './hotswap-test-setup';

let mockUpdateMachineDefinition: (params: StepFunctions.Types.UpdateStateMachineInput) => StepFunctions.Types.UpdateStateMachineOutput;
let mockStackResource: StackResourceSummary = {
  LogicalResourceId: 'Machine',
  ResourceType: 'AWS::StepFunctions::StateMachine',
  ResourceStatus: 'CREATE_COMPLETE',
  LastUpdatedTimestamp: new Date(),
};

beforeEach(() => {
  setup.setupHotswapTests(mockStackResource);
  mockUpdateMachineDefinition = jest.fn();
  setup.mockSdkProvider.stubStepFunctions({
    updateStateMachine: mockUpdateMachineDefinition,
  });
});

test('returns undefined when a new StateMachine is added to the Stack', async () => {
  // GIVEN
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await tryHotswapDeployment(setup.mockSdkProvider, {}, setup.currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
});

test('calls the updateStateMachine() API when it receives only a definitionString change in a state machine', async () => {
  // GIVEN
  setup.currentCfnStack.setTemplate({
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
  const cdkStackArtifact = setup.cdkStackArtifactOf({
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
  const deployStackResult = await tryHotswapDeployment(setup.mockSdkProvider, {}, setup.currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
    definition: '{ "Prop" : "new-value", "AnotherProp" : "another-new-value" }',
    stateMachineArn: 'my-machine',
  });
});

test('calls the updateStateMachine() API when it receives a change to the definitionString in a state machine that has no name', async () => {
  // GIVEN
  setup.currentCfnStack.setTemplate({
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
  const cdkStackArtifact = setup.cdkStackArtifactOf({
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
  mockStackResource.PhysicalResourceId = 'mock-machine-resource-id';
  const deployStackResult = await tryHotswapDeployment(setup.mockSdkProvider, {}, setup.currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
    definition: '{ "Prop" : "new-value" }',
    stateMachineArn: 'mock-machine-resource-id', // the sdk will convert the ID to the arn in a production environment
  });
});

test('does not call the updateStateMachine() API when it receives a change to a parameter that is not the definitionString in a state machine', async () => {
  // GIVEN
  setup.currentCfnStack.setTemplate({
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
  const cdkStackArtifact = setup.cdkStackArtifactOf({
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
  const deployStackResult = await tryHotswapDeployment(setup.mockSdkProvider, {}, setup.currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
});
