import * as cxapi from '@aws-cdk/cx-api';
import { Lambda, StepFunctions } from 'aws-sdk';
import { tryHotswapDeployment } from '../../lib/api/hotswap-deployments';
import { testStack, TestStackArtifact } from '../util';
import { MockSdkProvider } from '../util/mock-sdk';
import { FakeCloudformationStack } from './fake-cloudformation-stack';

const STACK_NAME = 'withouterrors';
const STACK_ID = 'stackId';

let mockSdkProvider: MockSdkProvider;
let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let mockUpdateMachineCode: (params: StepFunctions.Types.UpdateStateMachineInput) => StepFunctions.Types.UpdateStateMachineOutput;
let currentCfnStack: FakeCloudformationStack;

beforeEach(() => {
  jest.resetAllMocks();
  mockSdkProvider = new MockSdkProvider({ realSdk: false });
  mockUpdateLambdaCode = jest.fn();
  mockUpdateMachineCode = jest.fn();
  mockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });
  mockSdkProvider.stubStepFunctions({
    updateStateMachine: mockUpdateMachineCode,
  });
  currentCfnStack = new FakeCloudformationStack({
    stackName: STACK_NAME,
    stackId: STACK_ID,
  });
});

test('returns a deployStackResult with noOp=true when it receives an empty set of changes', async () => {
  // WHEN
  const deployStackResult = await tryHotswapDeployment(mockSdkProvider, {}, currentCfnStack, cdkStackArtifactOf());

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(deployStackResult?.noOp).toBeTruthy();
  expect(deployStackResult?.stackArn).toEqual(STACK_ID);
});

test('Resources that are not lambdas or step functions result in a full deployment', async () => {
  // GIVEN
  currentCfnStack.setTemplate({
    Resources: {
      Machine: {
        Type: 'AWS::CloudFormation::SomethingElse',
        Properties: {
          Prop: 'old-value',
        },
      },
    },
  });
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        Machine: {
          Type: 'AWS::CloudFormation::SomethingElse',
          Properties: {
            Prop: 'new-value',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await tryHotswapDeployment(mockSdkProvider, {}, currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateMachineCode).not.toHaveBeenCalled();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
});

test('changes to CDK::Metadata result in a noOp', async () => {
  // GIVEN
  currentCfnStack.setTemplate({
    Resources: {
      MetaData: {
        Type: 'AWS::CDK::MetaData',
        Properties: {
          Prop: 'old-value',
        },
      },
    },
  });
  const cdkStackArtifact = cdkStackArtifactOf({
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
  const deployStackResult = await tryHotswapDeployment(mockSdkProvider, {}, currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(deployStackResult?.noOp).toEqual(true);
  expect(mockUpdateMachineCode).not.toHaveBeenCalled();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
});

test('resource deletions require full deployments', async () => {
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
      },
    },
  });

  // WHEN
  const deployStackResult = await tryHotswapDeployment(mockSdkProvider, {}, currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
  expect(mockUpdateMachineCode).not.toHaveBeenCalled();
});

function cdkStackArtifactOf(testStackArtifact: Partial<TestStackArtifact> = {}): cxapi.CloudFormationStackArtifact {
  return testStack({
    stackName: STACK_NAME,
    ...testStackArtifact,
  });
}
