import * as cxapi from '@aws-cdk/cx-api';
import { Lambda } from 'aws-sdk';
import { tryHotswapDeployment } from '../../lib/api/hotswap-deployments';
import { testStack, TestStackArtifact } from '../util';
import { MockSdkProvider } from '../util/mock-sdk';
import { FakeCloudformationStack } from './fake-cloudformation-stack';

const STACK_NAME = 'withouterrors';
const STACK_ID = 'stackId';

let mockSdkProvider: MockSdkProvider;
let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let currentCfnStack: FakeCloudformationStack;

beforeEach(() => {
  jest.resetAllMocks();
  mockSdkProvider = new MockSdkProvider({ realSdk: false });
  mockUpdateLambdaCode = jest.fn();
  mockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
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

test('returns undefined when it a new Lambda function is added to the Stack', async () => {
  // GIVEN
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await tryHotswapDeployment(mockSdkProvider, {}, currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
});

test('calls the updateLambdaCode() API when it receives only a code difference in a Lambda function', async () => {
  // GIVEN
  currentCfnStack.setTemplate({
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
  });
  const cdkStackArtifact = cdkStackArtifactOf({
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

  // WHEN
  const deployStackResult = await tryHotswapDeployment(mockSdkProvider, {}, currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
});

function cdkStackArtifactOf(testStackArtifact: Partial<TestStackArtifact> = {}): cxapi.CloudFormationStackArtifact {
  return testStack({
    stackName: STACK_NAME,
    ...testStackArtifact,
  });
}
