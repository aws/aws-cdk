import { StepFunctions } from 'aws-sdk';
import * as setup from './hotswap-test-setup';

let mockUpdateMachineDefinition: (params: StepFunctions.Types.UpdateStateMachineInput) => StepFunctions.Types.UpdateStateMachineOutput;

beforeEach(() => {
  setup.setupHotswapTests();
  mockUpdateMachineDefinition = jest.fn();
  setup.setUpdateStateMachineMock(mockUpdateMachineDefinition);
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
  const deployStackResult = await setup.tryHotswapDeployment({}, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
});

test('calls the updateStateMachine() API when it receives only a definitionString change without Fn::Join in a state machine', async () => {
  // GIVEN
  setup.setTemplate({
    Resources: {
      Machine: {
        Type: 'AWS::StepFunctions::StateMachine',
        Properties: {
          DefinitionString: '{ Prop: "old-value" }',
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
            DefinitionString: '{ Prop: "new-value" }',
            StateMachineName: 'my-machine',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await setup.tryHotswapDeployment({}, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
    definition: '{ Prop: "new-value" }',
    stateMachineArn: 'my-machine',
  });
});

test('calls the updateStateMachine() API when it receives only a definitionString change with Fn::Join in a state machine', async () => {
  // GIVEN
  setup.setTemplate({
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
  const deployStackResult = await setup.tryHotswapDeployment({}, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
    definition: '{ "Prop" : "new-value", "AnotherProp" : "another-new-value" }',
    stateMachineArn: 'my-machine',
  });
});

test('calls the updateStateMachine() API when it receives a change to the definitionString in a state machine that has no name', async () => {
  // GIVEN
  setup.setTemplate({
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
  setup.pushStackResources(setup.stackSummaryOf('Machine', 'AWS::StepFunctions::StateMachine', 'mock-machine-resource-id'));
  const deployStackResult = await setup.tryHotswapDeployment({}, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
    definition: '{ "Prop" : "new-value" }',
    stateMachineArn: 'mock-machine-resource-id', // the sdk will convert the ID to the arn in a production environment
  });
});

test('does not call the updateStateMachine() API when it receives a change to a parameter that is not the definitionString in a state machine', async () => {
  // GIVEN
  setup.setTemplate({
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
                  '{ "Prop" : "new-value" }',
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
  const deployStackResult = await setup.tryHotswapDeployment({}, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
});

test('does not call the updateStateMachine() API when a resource with type that is not AWS::StepFunctions::StateMachine but has the same properties is changed', async () => {
  // GIVEN
  setup.setTemplate({
    Resources: {
      Machine: {
        Type: 'AWS::NotStepFunctions::NotStateMachine',
        Properties: {
          DefinitionString: '{ Prop: "old-value" }',
        },
      },
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Machine: {
          Type: 'AWS::NotStepFunctions::NotStateMachine',
          Properties: {
            DefinitionString: '{ Prop: "new-value" }',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await setup.tryHotswapDeployment({}, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
});

test('can correctly hotswap old style synth changes', async () => {
  // GIVEN
  setup.setTemplate({
    Parameters: { AssetParam1: { Type: 'String' } },
    Resources: {
      SM: {
        Type: 'AWS::StepFunctions::StateMachine',
        Properties: {
          DefinitionString: { Ref: 'AssetParam1' },
          StateMachineName: 'machine-name',
        },
      },
    }
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Parameters: { AssetParam2: { Type: String } },
      Resources: {
        SM: {
          Type: 'AWS::StepFunctions::StateMachine',
          Properties: {
            DefinitionString: { Ref: 'AssetParam2' },
            StateMachineName: 'machine-name',
          },
        },
      }
    }
  });

  // WHEN
  const deployStackResult = await setup.tryHotswapDeployment({ AssetParam2: 'asset-param-2' }, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
    definition: 'asset-param-2',
    stateMachineArn: 'machine-name',
  });
});
