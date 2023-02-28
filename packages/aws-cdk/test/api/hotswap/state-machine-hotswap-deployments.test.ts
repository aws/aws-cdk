import { StepFunctions } from 'aws-sdk';
import * as setup from './hotswap-test-setup';
import { HotswapMode } from '../../../lib/api/hotswap/common';

let mockUpdateMachineDefinition: (params: StepFunctions.Types.UpdateStateMachineInput) => StepFunctions.Types.UpdateStateMachineOutput;
let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateMachineDefinition = jest.fn();
  hotswapMockSdkProvider.setUpdateStateMachineMock(mockUpdateMachineDefinition);
});

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
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

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
    }
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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
      definition: '{ "Prop" : "new-value" }',
      stateMachineArn: 'arn:aws:states:here:123456789012:stateMachine:my-machine',
    });
  });

  test(`does not call the updateStateMachine() API when it receives a change to a property that is not the definitionString in a state machine
        alongside a hotswappable change in CLASSIC mode but does in HOTSWAP_ONLY mode`,
  async () => {
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

    setup.pushStackResourceSummaries(setup.stackSummaryOf('Machine', 'AWS::StepFunctions::StateMachine', 'arn:aws:states:here:123456789012:stateMachine:my-machine'));
    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
        definition: '{ "Prop" : "new-value" }',
        stateMachineArn: 'arn:aws:states:here:123456789012:stateMachine:my-machine',
      });
    }
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

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
    }
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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact, { AssetParam2: 'asset-param-2' });

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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
      hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact),
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
            Type: 'AWS::S3::Bucket',
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
      hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact),
    ).rejects.toThrow("We don't support the 'UnknownAttribute' attribute of the 'AWS::S3::Bucket' resource. This is a CDK limitation. Please report it at https://github.com/aws/aws-cdk/issues/new/choose");
  });

  test('knows how to handle attributes of the AWS::Events::EventBus resource', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        EventBus: {
          Type: 'AWS::Events::EventBus',
          Properties: {
            Name: 'my-event-bus',
          },
        },
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
          Properties: {
            DefinitionString: {
              'Fn::Join': ['', [
                '{"EventBus1Arn":"',
                { 'Fn::GetAtt': ['EventBus', 'Arn'] },
                '","EventBus1Name":"',
                { 'Fn::GetAtt': ['EventBus', 'Name'] },
                '","EventBus1Ref":"',
                { Ref: 'EventBus' },
                '"}',
              ]],
            },
            StateMachineName: 'my-machine',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf('EventBus', 'AWS::Events::EventBus', 'my-event-bus'),
    );
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          EventBus: {
            Type: 'AWS::Events::EventBus',
            Properties: {
              Name: 'my-event-bus',
            },
          },
          Machine: {
            Type: 'AWS::StepFunctions::StateMachine',
            Properties: {
              DefinitionString: {
                'Fn::Join': ['', [
                  '{"EventBus2Arn":"',
                  { 'Fn::GetAtt': ['EventBus', 'Arn'] },
                  '","EventBus2Name":"',
                  { 'Fn::GetAtt': ['EventBus', 'Name'] },
                  '","EventBus2Ref":"',
                  { Ref: 'EventBus' },
                  '"}',
                ]],
              },
              StateMachineName: 'my-machine',
            },
          },
        },
      },
    });

    // THEN
    const result = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    expect(result).not.toBeUndefined();
    expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
      stateMachineArn: 'arn:aws:states:here:123456789012:stateMachine:my-machine',
      definition: JSON.stringify({
        EventBus2Arn: 'arn:aws:events:here:123456789012:event-bus/my-event-bus',
        EventBus2Name: 'my-event-bus',
        EventBus2Ref: 'my-event-bus',
      }),
    });
  });

  test('knows how to handle attributes of the AWS::DynamoDB::Table resource', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Table: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
            KeySchema: [{
              AttributeName: 'name',
              KeyType: 'HASH',
            }],
            AttributeDefinitions: [{
              AttributeName: 'name',
              AttributeType: 'S',
            }],
            BillingMode: 'PAY_PER_REQUEST',
          },
        },
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
          Properties: {
            DefinitionString: '{}',
            StateMachineName: 'my-machine',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf('Table', 'AWS::DynamoDB::Table', 'my-dynamodb-table'),
    );
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          Table: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
              KeySchema: [{
                AttributeName: 'name',
                KeyType: 'HASH',
              }],
              AttributeDefinitions: [{
                AttributeName: 'name',
                AttributeType: 'S',
              }],
              BillingMode: 'PAY_PER_REQUEST',
            },
          },
          Machine: {
            Type: 'AWS::StepFunctions::StateMachine',
            Properties: {
              DefinitionString: {
                'Fn::Join': ['', [
                  '{"TableName":"',
                  { Ref: 'Table' },
                  '","TableArn":"',
                  { 'Fn::GetAtt': ['Table', 'Arn'] },
                  '"}',
                ]],
              },
              StateMachineName: 'my-machine',
            },
          },
        },
      },
    });

    // THEN
    const result = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    expect(result).not.toBeUndefined();
    expect(mockUpdateMachineDefinition).toHaveBeenCalledWith({
      stateMachineArn: 'arn:aws:states:here:123456789012:stateMachine:my-machine',
      definition: JSON.stringify({
        TableName: 'my-dynamodb-table',
        TableArn: 'arn:aws:dynamodb:here:123456789012:table/my-dynamodb-table',
      }),
    });
  });

  test('does not explode if the DependsOn changes', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
          Properties: {
            DefinitionString: '{ Prop: "old-value" }',
            StateMachineName: 'my-machine',
          },
          DependsOn: ['abc'],
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          Machine: {
            Type: 'AWS::StepFunctions::StateMachine',
            Properties: {
              DefinitionString: '{ Prop: "old-value" }',
              StateMachineName: 'my-machine',
            },
          },
          DependsOn: ['xyz'],
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(deployStackResult?.noOp).toEqual(true);
    expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
  });
});
