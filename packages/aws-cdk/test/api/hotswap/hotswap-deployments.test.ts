import { Lambda, StepFunctions } from 'aws-sdk';
import * as setup from './hotswap-test-setup';
import { CfnEvaluationException } from '../../../lib/api/evaluate-cloudformation-template';
import { HotswapMode } from '../../../lib/api/hotswap/common';

let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;
let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let mockUpdateMachineDefinition: (params: StepFunctions.Types.UpdateStateMachineInput) => StepFunctions.Types.UpdateStateMachineOutput;
let mockGetEndpointSuffix: () => string;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  mockUpdateMachineDefinition = jest.fn();
  mockGetEndpointSuffix = jest.fn(() => 'amazonaws.com');
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });
  hotswapMockSdkProvider.setUpdateStateMachineMock(mockUpdateMachineDefinition);
  hotswapMockSdkProvider.stubGetEndpointSuffix(mockGetEndpointSuffix);
});

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
  test('returns a deployStackResult with noOp=true when it receives an empty set of changes', async () => {
    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, setup.cdkStackArtifactOf());

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(deployStackResult?.noOp).toBeTruthy();
    expect(deployStackResult?.stackArn).toEqual(setup.STACK_ID);
  });

  test('A change to only a non-hotswappable resource results in a full deployment for HOTSWAP and a noOp for HOTSWAP_ONLY', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        SomethingElse: {
          Type: 'AWS::CloudFormation::SomethingElse',
          Properties: {
            Prop: 'old-value',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          SomethingElse: {
            Type: 'AWS::CloudFormation::SomethingElse',
            Properties: {
              Prop: 'new-value',
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
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    }
  });

  test('A change to both a hotswappable resource and a non-hotswappable resource results in a full deployment for HOTSWAP and a noOp for HOTSWAP_ONLY', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            FunctionName: 'my-function',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
        SomethingElse: {
          Type: 'AWS::CloudFormation::SomethingElse',
          Properties: {
            Prop: 'old-value',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          Func: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                S3Bucket: 'current-bucket',
                S3Key: 'new-key',
              },
              FunctionName: 'my-function',
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
          SomethingElse: {
            Type: 'AWS::CloudFormation::SomethingElse',
            Properties: {
              Prop: 'new-value',
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
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
        FunctionName: 'my-function',
        S3Bucket: 'current-bucket',
        S3Key: 'new-key',
      });
      expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
    }
  });

  test('changes only to CDK::Metadata result in a noOp', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        MetaData: {
          Type: 'AWS::CDK::Metadata',
          Properties: {
            Prop: 'old-value',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          MetaData: {
            Type: 'AWS::CDK::Metadata',
            Properties: {
              Prop: 'new-value',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(deployStackResult?.noOp).toEqual(true);
    expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
    expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
  });

  test('resource deletions require full deployments for HOTSWAP and a noOp for HOTSWAP_ONLY', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf();

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    }
  });

  test('can correctly reference AWS::Partition in hotswappable changes', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            FunctionName: {
              'Fn::Join': [
                '',
                [
                  { Ref: 'AWS::Partition' },
                  '-',
                  'my-function',
                ],
              ],
            },
          },
          Metadata: {
            'aws:asset:path': 'new-path',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          Func: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                S3Bucket: 'current-bucket',
                S3Key: 'new-key',
              },
              FunctionName: {
                'Fn::Join': [
                  '',
                  [
                    { Ref: 'AWS::Partition' },
                    '-',
                    'my-function',
                  ],
                ],
              },
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
      FunctionName: 'aws-my-function',
      S3Bucket: 'current-bucket',
      S3Key: 'new-key',
    });
  });

  test('can correctly reference AWS::URLSuffix in hotswappable changes', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            FunctionName: {
              'Fn::Join': ['', [
                'my-function-',
                { Ref: 'AWS::URLSuffix' },
                '-',
                { Ref: 'AWS::URLSuffix' },
              ]],
            },
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          Func: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                S3Bucket: 'current-bucket',
                S3Key: 'new-key',
              },
              FunctionName: {
                'Fn::Join': ['', [
                  'my-function-',
                  { Ref: 'AWS::URLSuffix' },
                  '-',
                  { Ref: 'AWS::URLSuffix' },
                ]],
              },
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
      FunctionName: 'my-function-amazonaws.com-amazonaws.com',
      S3Bucket: 'current-bucket',
      S3Key: 'new-key',
    });
    expect(mockGetEndpointSuffix).toHaveBeenCalledTimes(1);

    // the User-Agent is set correctly
    expect(hotswapMockSdkProvider.mockSdkProvider.sdk.appendCustomUserAgent)
      .toHaveBeenCalledWith('cdk-hotswap/success-lambda');
    expect(hotswapMockSdkProvider.mockSdkProvider.sdk.removeCustomUserAgent)
      .toHaveBeenCalledWith('cdk-hotswap/success-lambda');
  });

  test('changing the type of a deployed resource always results in a full deployment for HOTSWAP and a noOp for HOTSWAP_ONLY', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        SharedLogicalId: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'new-key',
            },
            FunctionName: 'my-function',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          SharedLogicalId: {
            Type: 'AWS::StepFunctions::StateMachine',
            Properties: {
              DefinitionString: '{ Prop: "new-value" }',
              StateMachineName: 'my-machine',
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
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    }
  });

  test('A change to both a hotswappable resource and a stack output results in a full deployment for HOTSWAP and a hotswap deployment for HOTSWAP_ONLY', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            FunctionName: 'my-function',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
      Outputs: {
        SomeOutput: {
          Value: 'old-value',
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          Func: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                S3Bucket: 'current-bucket',
                S3Key: 'new-key',
              },
              FunctionName: 'my-function',
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
        Outputs: {
          SomeOutput: {
            Value: 'new-value',
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
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
        FunctionName: 'my-function',
        S3Bucket: 'current-bucket',
        S3Key: 'new-key',
      });
      expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
    }
  });

  test('Multiple CfnEvaluationException will not cause unhandled rejections', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Func1: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            Environment: {
              key: 'old',
            },
            FunctionName: 'my-function',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
        Func2: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            Environment: {
              key: 'old',
            },
            FunctionName: 'my-function',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          Func1: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                S3Bucket: 'current-bucket',
                S3Key: 'current-key',
              },
              Environment: {
                key: { Ref: 'ErrorResource' },
              },
              FunctionName: 'my-function',
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
          Func2: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                S3Bucket: 'current-bucket',
                S3Key: 'current-key',
              },
              Environment: {
                key: { Ref: 'ErrorResource' },
              },
              FunctionName: 'my-function',
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    await expect(deployStackResult).rejects.toThrowError(CfnEvaluationException);
    expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
    expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
  });

  test('deleting a resource and making a hotswappable change results in full deployments for HOTSWAP and a hotswap deployment for HOTSWAP_ONLY', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Machine: {
          Type: 'AWS::StepFunctions::StateMachine',
        },
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            FunctionName: 'my-function',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          Func: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                S3Bucket: 'current-bucket',
                S3Key: 'new-key',
              },
              FunctionName: 'my-function',
            },
            Metadata: {
              'aws:asset:path': 'new-path',
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
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
      expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
        FunctionName: 'my-function',
        S3Bucket: 'current-bucket',
        S3Key: 'new-key',
      });
    }
  });
});
