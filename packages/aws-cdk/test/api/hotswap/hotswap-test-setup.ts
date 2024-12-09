import * as cxapi from '@aws-cdk/cx-api';
import { ListStackResourcesCommand, StackResourceSummary, StackStatus } from '@aws-sdk/client-cloudformation';
import { GetFunctionCommand } from '@aws-sdk/client-lambda';
import { ICloudFormationClient, SuccessfulDeployStackResult } from '../../../lib/api';
import { HotswapMode, HotswapPropertyOverrides } from '../../../lib/api/hotswap/common';
import * as deployments from '../../../lib/api/hotswap-deployments';
import { CloudFormationStack, Template } from '../../../lib/api/util/cloudformation';
import { testStack, TestStackArtifact } from '../../util';
import {
  mockCloudFormationClient,
  mockLambdaClient,
  MockSdkProvider,
  restoreSdkMocksToDefault,
  setDefaultSTSMocks,
} from '../../util/mock-sdk';
import { FakeCloudformationStack } from '../fake-cloudformation-stack';

const STACK_NAME = 'withouterrors';
export const STACK_ID = 'stackId';

let hotswapMockSdkProvider: HotswapMockSdkProvider;
let currentCfnStack: FakeCloudformationStack;
const currentCfnStackResources: StackResourceSummary[] = [];
let stackTemplates: { [stackName: string]: any };
let currentNestedCfnStackResources: { [stackName: string]: StackResourceSummary[] };

export function setupHotswapTests(): HotswapMockSdkProvider {
  restoreSdkMocksToDefault();
  setDefaultSTSMocks();
  jest.resetAllMocks();
  // clear the array
  currentCfnStackResources.splice(0);
  hotswapMockSdkProvider = new HotswapMockSdkProvider();
  currentCfnStack = new FakeCloudformationStack({
    stackName: STACK_NAME,
    stackId: STACK_ID,
  });
  CloudFormationStack.lookup = async (_: ICloudFormationClient, _stackName: string) => {
    return currentCfnStack;
  };

  return hotswapMockSdkProvider;
}

export function setupHotswapNestedStackTests(rootStackName: string) {
  restoreSdkMocksToDefault();
  setDefaultSTSMocks();
  jest.resetAllMocks();
  currentNestedCfnStackResources = {};
  hotswapMockSdkProvider = new HotswapMockSdkProvider(rootStackName);
  currentCfnStack = new FakeCloudformationStack({
    stackName: rootStackName,
    stackId: STACK_ID,
  });
  stackTemplates = {};
  CloudFormationStack.lookup = async (_: ICloudFormationClient, stackName: string) => {
    currentCfnStack.template = async () => stackTemplates[stackName];
    return currentCfnStack;
  };

  return hotswapMockSdkProvider;
}

export function cdkStackArtifactOf(
  testStackArtifact: Partial<TestStackArtifact> = {},
): cxapi.CloudFormationStackArtifact {
  return testStack({
    stackName: STACK_NAME,
    ...testStackArtifact,
  });
}

export function pushStackResourceSummaries(...items: StackResourceSummary[]) {
  currentCfnStackResources.push(...items);
}

export function pushNestedStackResourceSummaries(stackName: string, ...items: StackResourceSummary[]) {
  if (!currentNestedCfnStackResources[stackName]) {
    currentNestedCfnStackResources[stackName] = [];
  }
  currentNestedCfnStackResources[stackName].push(...items);
}

export function setCurrentCfnStackTemplate(template: Template) {
  const templateDeepCopy = JSON.parse(JSON.stringify(template)); // deep copy the template, so our tests can mutate one template instead of creating two
  currentCfnStack.setTemplate(templateDeepCopy);
}

export function addTemplateToCloudFormationLookupMock(stackArtifact: cxapi.CloudFormationStackArtifact) {
  const templateDeepCopy = JSON.parse(JSON.stringify(stackArtifact.template)); // deep copy the template, so our tests can mutate one template instead of creating two
  stackTemplates[stackArtifact.stackName] = templateDeepCopy;
}

export function stackSummaryOf(
  logicalId: string,
  resourceType: string,
  physicalResourceId: string,
): StackResourceSummary {
  return {
    LogicalResourceId: logicalId,
    PhysicalResourceId: physicalResourceId,
    ResourceType: resourceType,
    ResourceStatus: StackStatus.CREATE_COMPLETE,
    LastUpdatedTimestamp: new Date(),
  };
}

export class HotswapMockSdkProvider extends MockSdkProvider {
  constructor(rootStackName?: string) {
    super();

    mockLambdaClient.on(GetFunctionCommand).resolves({
      Configuration: {
        LastUpdateStatus: 'Successful',
      },
    });

    mockCloudFormationClient.on(ListStackResourcesCommand).callsFake((input) => {
      if (rootStackName) {
        const knownStackNames = Object.keys(currentNestedCfnStackResources);
        if (input.StackName !== rootStackName && !knownStackNames.includes(input.StackName)) {
          throw new Error(
            `Expected Stack name in listStackResources() call to be a member of ['${rootStackName}, ${knownStackNames}'], but received: '${input.StackName}'`,
          );
        }
      } else if (input.StackName !== STACK_NAME) {
        throw new Error(
          `Expected Stack name in listStackResources() call to be: '${STACK_NAME}', but received: '${input.StackName}'`,
        );
      }
      return {
        StackResourceSummaries: rootStackName
          ? currentNestedCfnStackResources[input.StackName]
          : currentCfnStackResources,
      };
    });
  }

  public tryHotswapDeployment(
    hotswapMode: HotswapMode,
    stackArtifact: cxapi.CloudFormationStackArtifact,
    assetParams: { [key: string]: string } = {},
    hotswapPropertyOverrides?: HotswapPropertyOverrides,
  ): Promise<SuccessfulDeployStackResult | undefined> {
    let hotswapProps = hotswapPropertyOverrides || new HotswapPropertyOverrides();
    return deployments.tryHotswapDeployment(this, assetParams, currentCfnStack, stackArtifact, hotswapMode, hotswapProps);
  }
}
