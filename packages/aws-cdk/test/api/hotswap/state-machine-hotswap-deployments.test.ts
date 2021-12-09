import { StepFunctions } from 'aws-sdk';
import * as setup from './hotswap-test-setup';

let mockUpdateMachineDefinition: (params: StepFunctions.Types.UpdateStateMachineInput) => StepFunctions.Types.UpdateStateMachineOutput;
let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateMachineDefinition = jest.fn();
  hotswapMockSdkProvider.setUpdateStateMachineMock(mockUpdateMachineDefinition);
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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
});

test('calls the updateStateMachine() API when it receives only a definitionString change without Fn::Join in a state machine', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
    definition: '{ Prop: "new-value" }',
    stateMachineArn: 'arn:aws:states:here:123456789012:stateMachine:my-machine',
  });
});

test('calls the updateStateMachine() API when it receives only a definitionString change with Fn::Join in a state machine', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Machine: {
        Type: 'AWS::StepFunctions::StateMachine',
        Properties: {
          DefinitionString: {
            'Fn::Join': [
              '\n',
              [
                '{',
                '  "StartAt" : "SuccessState"',
                '  "States" : {',
                '    "SuccessState": {',
                '      "Type": "Pass"',
                '      "Result": "Success"',
                '      "End": true',
                '    }',
                '  }',
                '}',
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
                '\n',
                [
                  '{',
                  '  "StartAt": "SuccessState",',
                  '  "States": {',
                  '    "SuccessState": {',
                  '      "Type": "Succeed"',
                  '    }',
                  '  }',
                  '}',
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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
    definition: JSON.stringify({
      StartAt: 'SuccessState',
      States: {
        SuccessState: {
          Type: 'Succeed',
        },
      },
    }, null, 2),
    stateMachineArn: 'arn:aws:states:here:123456789012:stateMachine:my-machine',
  });
});

test('calls the updateStateMachine() API when it receives a change to the definitionString in a state machine that has no name', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Machine: {
        Type: 'AWS::StepFunctions::StateMachine',
        Properties: {
          DefinitionString: '{ "Prop" : "old-value" }',
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
            DefinitionString: '{ "Prop" : "new-value" }',
          },
        },
      },
    },
  });

  // WHEN
  setup.pushStackResourceSummaries(setup.stackSummaryOf('Machine', 'AWS::StepFunctions::StateMachine', 'arn:aws:states:here:123456789012:stateMachine:my-machine'));
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
    definition: '{ "Prop" : "new-value" }',
    stateMachineArn: 'arn:aws:states:here:123456789012:stateMachine:my-machine',
  });
});

test('does not call the updateStateMachine() API when it receives a change to a property that is not the definitionString in a state machine', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Machine: {
        Type: 'AWS::StepFunctions::StateMachine',
        Properties: {
          DefinitionString: '{ "Prop" : "old-value" }',
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
            DefinitionString: '{ "Prop" : "new-value" }',
            LoggingConfiguration: {
              IncludeExecutionData: false,
            },
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
});

test('does not call the updateStateMachine() API when a resource has a DefinitionString property but is not an AWS::StepFunctions::StateMachine is changed', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
});

test('can correctly hotswap old style synth changes', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Parameters: { AssetParam1: { Type: 'String' } },
    Resources: {
      Machine: {
        Type: 'AWS::StepFunctions::StateMachine',
        Properties: {
          DefinitionString: { Ref: 'AssetParam1' },
          StateMachineName: 'machine-name',
        },
      },
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Parameters: { AssetParam2: { Type: String } },
      Resources: {
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
          Properties: {
            DefinitionString: { Ref: 'AssetParam2' },
            StateMachineName: 'machine-name',
          },
        },
      },
    },
  });

  // WHEN
  setup.pushStackResourceSummaries(setup.stackSummaryOf('Machine', 'AWS::StepFunctions::StateMachine', 'arn:aws:states:here:123456789012:stateMachine:my-machine'));
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact, { AssetParam2: 'asset-param-2' });

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
    definition: 'asset-param-2',
    stateMachineArn: 'arn:aws:states:here:123456789012:stateMachine:machine-name',
  });
});

test('calls the updateStateMachine() API when it receives a change to the definitionString that uses Attributes in a state machine', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Func: {
        Type: 'AWS::Lambda::Function',
      },
      Machine: {
        Type: 'AWS::StepFunctions::StateMachine',
        Properties: {
          DefinitionString: {
            'Fn::Join': [
              '\n',
              [
                '{',
                '  "StartAt" : "SuccessState"',
                '  "States" : {',
                '    "SuccessState": {',
                '      "Type": "Succeed"',
                '    }',
                '  }',
                '}',
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
        Func: {
          Type: 'AWS::Lambda::Function',
        },
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
          Properties: {
            DefinitionString: {
              'Fn::Join': [
                '',
                [
                  '"Resource": ',
                  { 'Fn::GetAtt': ['Func', 'Arn'] },
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
  setup.pushStackResourceSummaries(
    setup.stackSummaryOf('Machine', 'AWS::StepFunctions::StateMachine', 'arn:aws:states:here:123456789012:stateMachine:my-machine'),
    setup.stackSummaryOf('Func', 'AWS::Lambda::Function', 'my-func'),
  );
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
    definition: '"Resource": arn:aws:lambda:here:123456789012:function:my-func',
    stateMachineArn: 'arn:aws:states:here:123456789012:stateMachine:my-machine',
  });
});

test("will not perform a hotswap deployment if it cannot find a Ref target (outside the state machine's name)", async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Parameters: {
      Param1: { Type: 'String' },
    },
    Resources: {
      Machine: {
        Type: 'AWS::StepFunctions::StateMachine',
        Properties: {
          DefinitionString: {
            'Fn::Join': [
              '',
              [
                '{ Prop: "old-value" }, ',
                '{ "Param" : ',
                { 'Fn::Sub': '${Param1}' },
                ' }',
              ],
            ],
          },
        },
      },
    },
  });
  setup.pushStackResourceSummaries(setup.stackSummaryOf('Machine', 'AWS::StepFunctions::StateMachine', 'my-machine'));
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Parameters: {
        Param1: { Type: 'String' },
      },
      Resources: {
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
          Properties: {
            DefinitionString: {
              'Fn::Join': [
                '',
                [
                  '{ Prop: "new-value" }, ',
                  '{ "Param" : ',
                  { 'Fn::Sub': '${Param1}' },
                  ' }',
                ],
              ],
            },
          },
        },
      },
    },
  });

  // THEN
  await expect(() =>
    hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact),
  ).rejects.toThrow(/Parameter or resource 'Param1' could not be found for evaluation/);
});

test("will not perform a hotswap deployment if it doesn't know how to handle a specific attribute (outside the state machines's name)", async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
      },
      Machine: {
        Type: 'AWS::StepFunctions::StateMachine',
        Properties: {
          DefinitionString: {
            'Fn::Join': [
              '',
              [
                '{ Prop: "old-value" }, ',
                '{ "S3Bucket" : ',
                { 'Fn::GetAtt': ['Bucket', 'UnknownAttribute'] },
                ' }',
              ],
            ],
          },
          StateMachineName: 'my-machine',
        },
      },
    },
  });
  setup.pushStackResourceSummaries(
    setup.stackSummaryOf('Machine', 'AWS::StepFunctions::StateMachine', 'arn:aws:states:here:123456789012:stateMachine:my-machine'),
    setup.stackSummaryOf('Bucket', 'AWS::S3::Bucket', 'my-bucket'),
  );
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Bucket: {
          Type: 'AWS::Lambda::Function',
        },
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
          Properties: {
            DefinitionString: {
              'Fn::Join': [
                '',
                [
                  '{ Prop: "new-value" }, ',
                  '{ "S3Bucket" : ',
                  { 'Fn::GetAtt': ['Bucket', 'UnknownAttribute'] },
                  ' }',
                ],
              ],
            },
            StateMachineName: 'my-machine',
          },
        },
      },
    },
  });

  // THEN
  await expect(() =>
    hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact),
  ).rejects.toThrow("We don't support the 'UnknownAttribute' attribute of the 'AWS::S3::Bucket' resource. This is a CDK limitation. Please report it at https://github.com/aws/aws-cdk/issues/new/choose");
});
