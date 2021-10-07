import { Lambda, StepFunctions } from 'aws-sdk';
import * as setup from './hotswap-test-setup';

let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let mockUpdateMachineDefinition: (params: StepFunctions.Types.UpdateStateMachineInput) => StepFunctions.Types.UpdateStateMachineOutput;

beforeEach(() => {
  setup.setupHotswapTests();
  mockUpdateLambdaCode = jest.fn();
  mockUpdateMachineDefinition = jest.fn();
  setup.setUpdateFunctionCodeMock(mockUpdateLambdaCode);
  setup.setUpdateStateMachineMock(mockUpdateMachineDefinition);
});

test('returns a deployStackResult with noOp=true when it receives an empty set of changes', async () => {
  // WHEN
  const deployStackResult = await setup.tryHotswapDeployment(setup.cdkStackArtifactOf());

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(deployStackResult?.noOp).toBeTruthy();
  expect(deployStackResult?.stackArn).toEqual(setup.STACK_ID);
});

test('A change to only a non-hotswappable resource results in a full deployment', async () => {
  // GIVEN
  setup.setTemplate({
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

  // WHEN
  const deployStackResult = await setup.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
});

test('A change to both a hotswappable resource and a non-hotswappable resource results in a full deployment', async () => {
  // GIVEN
  setup.setTemplate({
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

  // WHEN
  const deployStackResult = await setup.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
});

test('changes only to CDK::Metadata result in a noOp', async () => {
  // GIVEN
  setup.setTemplate({
    Resources: {
      MetaData: {
        Type: 'AWS::CDK::MetaData',
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
  const deployStackResult = await setup.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(deployStackResult?.noOp).toEqual(true);
  expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
});

test('resource deletions require full deployments', async () => {
  // GIVEN
  setup.setTemplate({
    Resources: {
      Machine: {
        Type: 'AWS::StepFunctions::StateMachine',
      },
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf();

  // WHEN
  const deployStackResult = await setup.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
  expect(mockUpdateMachineDefinition).not.toHaveBeenCalled();
});

test('can correctly reference AWS::Partition in hotswappable changes', async () => {
  // GIVEN
  setup.setTemplate({
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
  const deployStackResult = await setup.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'aws-my-function',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
});
