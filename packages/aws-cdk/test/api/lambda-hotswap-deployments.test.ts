import * as cxapi from '@aws-cdk/cx-api';
import { Lambda, CloudFormation } from 'aws-sdk';
import { StackResourceSummary } from 'aws-sdk/clients/cloudformation';
import { tryHotswapDeployment } from '../../lib/api/hotswap-deployments';
import { testStack, TestStackArtifact } from '../util';
import { MockSdkProvider } from '../util/mock-sdk';
import { FakeCloudformationStack } from './fake-cloudformation-stack';

const STACK_NAME = 'withouterrors';
const STACK_ID = 'stackId';

let mockSdkProvider: MockSdkProvider;
let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let mockListStackResources: (params: CloudFormation.Types.ListStackResourcesInput) => CloudFormation.Types.ListStackResourcesOutput;
let mockStackResource: StackResourceSummary = {
  LogicalResourceId: 'Func',
  ResourceType: 'AWS::Lambda::Function',
  ResourceStatus: 'CREATE_COMPLETE',
  LastUpdatedTimestamp: new Date(),
};
let currentCfnStack: FakeCloudformationStack;

beforeEach(() => {
  jest.resetAllMocks();
  mockSdkProvider = new MockSdkProvider({ realSdk: false });
  mockListStackResources = jest.fn(() => {
    return { StackResourceSummaries: [mockStackResource] };
  });
  mockUpdateLambdaCode = jest.fn();
  mockSdkProvider.stubCloudFormation({
    listStackResources: mockListStackResources,
  });
  mockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });
  currentCfnStack = new FakeCloudformationStack({
    stackName: STACK_NAME,
    stackId: STACK_ID,
  });
});

test('returns undefined when a new Lambda function is added to the Stack', async () => {
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

test('calls the updateLambdaCode() API when it receives a code difference in a Lambda function with no name', async () => {
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
          },
          Metadata: {
            'aws:asset:path': 'new-path',
          },
        },
      },
    },
  });

  // WHEN
  mockStackResource.PhysicalResourceId = 'mock-function-resource-id';
  const deployStackResult = await tryHotswapDeployment(mockSdkProvider, {}, currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'mock-function-resource-id',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
});

test('does not call the updateLambdaCode() API when it receives a change that is not a code difference in a Lambda function', async () => {
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
          PackageType: 'Zip',
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
              S3Key: 'current-key',
            },
            PackageType: 'Image',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await tryHotswapDeployment(mockSdkProvider, {}, currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
});

function cdkStackArtifactOf(testStackArtifact: Partial<TestStackArtifact> = {}): cxapi.CloudFormationStackArtifact {
  return testStack({
    stackName: STACK_NAME,
    ...testStackArtifact,
  });
}
