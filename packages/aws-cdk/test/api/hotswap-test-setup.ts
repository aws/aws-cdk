import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import { testStack, TestStackArtifact } from '../util';
import { MockSdkProvider } from '../util/mock-sdk';
import { FakeCloudformationStack } from './fake-cloudformation-stack';

const STACK_NAME = 'withouterrors';
const STACK_ID = 'stackId';

export let mockSdkProvider: MockSdkProvider;
export let currentCfnStack: FakeCloudformationStack;
export const currentCfnStackResources: CloudFormation.StackResourceSummary[] = [];

export function setupHotswapTests() {
  jest.resetAllMocks();
  mockSdkProvider = new MockSdkProvider({ realSdk: false });
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
}

export function cdkStackArtifactOf(testStackArtifact: Partial<TestStackArtifact> = {}): cxapi.CloudFormationStackArtifact {
  return testStack({
    stackName: STACK_NAME,
    ...testStackArtifact,
  });
}

export function stackSummaryOf(logicalId: string, resourceType: string, physicalResourceId: string): CloudFormation.StackResourceSummary {
  return {
    LogicalResourceId: logicalId,
    PhysicalResourceId: physicalResourceId,
    ResourceType: resourceType,
    ResourceStatus: 'CREATE_COMPLETE',
    LastUpdatedTimestamp: new Date(),
  };
}
