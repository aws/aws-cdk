import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import { StackResourceSummary } from 'aws-sdk/clients/cloudformation';
import { testStack, TestStackArtifact } from '../util';
import { MockSdkProvider } from '../util/mock-sdk';
import { FakeCloudformationStack } from './fake-cloudformation-stack';

const STACK_NAME = 'withouterrors';
const STACK_ID = 'stackId';

export let mockSdkProvider: MockSdkProvider;
let mockListStackResources: (params: CloudFormation.Types.ListStackResourcesInput) => CloudFormation.Types.ListStackResourcesOutput;
export let currentCfnStack: FakeCloudformationStack;

export function setupHotswapTests(mockStackResource: StackResourceSummary) {
  jest.resetAllMocks();
  mockSdkProvider = new MockSdkProvider({ realSdk: false });
  mockListStackResources = jest.fn(() => {
    return { StackResourceSummaries: [mockStackResource] };
  });

  mockSdkProvider.stubCloudFormation({
    listStackResources: mockListStackResources,
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
