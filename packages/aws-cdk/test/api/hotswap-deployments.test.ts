import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormation, Lambda } from 'aws-sdk';
import { tryHotswapDeployment } from '../../lib/api/hotswap-deployments';
import { testStack, TestStackArtifact } from '../util';
import { MockSdkProvider } from '../util/mock-sdk';
import { FakeCloudformationStack } from './fake-cloudformation-stack';

const STACK_NAME = 'withouterrors';
const STACK_ID = 'stackId';

let mockSdkProvider: MockSdkProvider;
let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let currentCfnStack: FakeCloudformationStack;
const currentCfnStackResources: CloudFormation.StackResourceSummary[] = [];

beforeEach(() => {
  jest.resetAllMocks();
  mockSdkProvider = new MockSdkProvider({ realSdk: false });
  mockUpdateLambdaCode = jest.fn();
  mockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });
  // clear the array
  currentCfnStackResources.splice(0);
  mockSdkProvider.stubCloudFormation({
    listStackResources: ({ StackName: stackName }) => {
      if (stackName !== STACK_NAME) {
        throw new Error(`Expected Stack name in listStackResources() call to be: '${STACK_NAME}', but received: ${stackName}'`);
      }
      return {
        StackResourceSummaries: currentCfnStackResources,
      };
    },
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

test("correctly evaluates the function's name when it references a different resource from the template", async () => {
  // GIVEN
  currentCfnStack.setTemplate({
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
      },
      Func: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Code: {
            S3Bucket: 'current-bucket',
            S3Key: 'current-key',
          },
          FunctionName: {
            'Fn::Join': ['-', [
              'lambda',
              { Ref: 'Bucket' },
              'function',
            ]],
          },
        },
        Metadata: {
          'aws:asset:path': 'old-path',
        },
      },
    },
  });
  currentCfnStackResources.push(stackSummaryOf('Bucket', 'AWS::S3::Bucket', 'mybucket'));
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
        },
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'new-key',
            },
            FunctionName: {
              'Fn::Join': ['-', [
                'lambda',
                { Ref: 'Bucket' },
                'function',
              ]],
            },
          },
          Metadata: {
            'aws:asset:path': 'old-path',
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
    FunctionName: 'lambda-mybucket-function',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
});

test("correctly falls back to taking the function's name from the current stack if it can't evaluate it in the template", async () => {
  // GIVEN
  currentCfnStack.setTemplate({
    Parameters: {
      Param1: { Type: 'String' },
      AssetBucketParam: { Type: 'String' },
    },
    Resources: {
      Func: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Code: {
            S3Bucket: { Ref: 'AssetBucketParam' },
            S3Key: 'current-key',
          },
          FunctionName: { Ref: 'Param1' },
        },
        Metadata: {
          'aws:asset:path': 'old-path',
        },
      },
    },
  });
  currentCfnStackResources.push(stackSummaryOf('Func', 'AWS::Lambda::Function', 'my-function'));
  const cdkStackArtifact = cdkStackArtifactOf({
    template: {
      Parameters: {
        Param1: { Type: 'String' },
        AssetBucketParam: { Type: 'String' },
      },
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: { Ref: 'AssetBucketParam' },
              S3Key: 'new-key',
            },
            FunctionName: { Ref: 'Param1' },
          },
          Metadata: {
            'aws:asset:path': 'new-path',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await tryHotswapDeployment(mockSdkProvider, {
    AssetBucketParam: 'asset-bucket',
  }, currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    S3Bucket: 'asset-bucket',
    S3Key: 'new-key',
  });
});

function cdkStackArtifactOf(testStackArtifact: Partial<TestStackArtifact> = {}): cxapi.CloudFormationStackArtifact {
  return testStack({
    stackName: STACK_NAME,
    ...testStackArtifact,
  });
}

function stackSummaryOf(logicalId: string, resourceType: string, physicalResourceId: string): CloudFormation.StackResourceSummary {
  return {
    LogicalResourceId: logicalId,
    PhysicalResourceId: physicalResourceId,
    ResourceType: resourceType,
    ResourceStatus: 'CREATE_COMPLETE',
    LastUpdatedTimestamp: new Date(),
  };
}
