import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import * as codebuild from 'aws-sdk/clients/codebuild';
import * as lambda from 'aws-sdk/clients/lambda';
import * as stepfunctions from 'aws-sdk/clients/stepfunctions';
import { DeployStackResult } from '../../../lib/api';
import { HotswapMode } from '../../../lib/api/hotswap/common';
import * as deployments from '../../../lib/api/hotswap-deployments';
import { CloudFormationStack, Template } from '../../../lib/api/util/cloudformation';
import { testStack, TestStackArtifact } from '../../util';
import { MockSdkProvider, SyncHandlerSubsetOf } from '../../util/mock-sdk';
import { FakeCloudformationStack } from '../fake-cloudformation-stack';

const STACK_NAME = 'withouterrors';
export const STACK_ID = 'stackId';

let hotswapMockSdkProvider: HotswapMockSdkProvider;
let currentCfnStack: FakeCloudformationStack;
const currentCfnStackResources: AWS.CloudFormation.StackResourceSummary[] = [];
let stackTemplates: { [stackName: string]: any };
let currentNestedCfnStackResources: { [stackName: string]: AWS.CloudFormation.StackResourceSummary[] };

export function setupHotswapTests(): HotswapMockSdkProvider {
  jest.resetAllMocks();
  // clear the array
  currentCfnStackResources.splice(0);
  hotswapMockSdkProvider = new HotswapMockSdkProvider();
  currentCfnStack = new FakeCloudformationStack({
    stackName: STACK_NAME,
    stackId: STACK_ID,
  });
  CloudFormationStack.lookup = async (_: AWS.CloudFormation, _stackName: string) => {
    return currentCfnStack;
  };

  return hotswapMockSdkProvider;
}

export function setupHotswapNestedStackTests(rootStackName: string) {
  jest.resetAllMocks();
  currentNestedCfnStackResources = {};
  hotswapMockSdkProvider = new HotswapMockSdkProvider(rootStackName);
  currentCfnStack = new FakeCloudformationStack({
    stackName: rootStackName,
    stackId: STACK_ID,
  });
  stackTemplates = {};
  CloudFormationStack.lookup = async (_: AWS.CloudFormation, stackName: string) => {
    currentCfnStack.template = async () => stackTemplates[stackName];
    return currentCfnStack;
  };

  return hotswapMockSdkProvider;
}

export function cdkStackArtifactOf(testStackArtifact: Partial<TestStackArtifact> = {}): cxapi.CloudFormationStackArtifact {
  return testStack({
    stackName: STACK_NAME,
    ...testStackArtifact,
  });
}

export function pushStackResourceSummaries(...items: AWS.CloudFormation.StackResourceSummary[]) {
  currentCfnStackResources.push(...items);
}

export function pushNestedStackResourceSummaries(stackName: string, ...items: AWS.CloudFormation.StackResourceSummary[]) {
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

export function stackSummaryOf(logicalId: string, resourceType: string, physicalResourceId: string): AWS.CloudFormation.StackResourceSummary {
  return {
    LogicalResourceId: logicalId,
    PhysicalResourceId: physicalResourceId,
    ResourceType: resourceType,
    ResourceStatus: 'CREATE_COMPLETE',
    LastUpdatedTimestamp: new Date(),
  };
}

export class HotswapMockSdkProvider {
  public readonly mockSdkProvider: MockSdkProvider;

  constructor(rootStackName?: string) {
    this.mockSdkProvider = new MockSdkProvider({ realSdk: false });

    this.mockSdkProvider.stubCloudFormation({
      listStackResources: ({ StackName: stackName }) => {
        if (rootStackName) {
          const knownStackNames = Object.keys(currentNestedCfnStackResources);
          if (stackName !== rootStackName && !knownStackNames.includes(stackName)) {
            throw new Error(`Expected Stack name in listStackResources() call to be a member of ['${rootStackName}, ${knownStackNames}'], but received: '${stackName}'`);
          }
        } else if (stackName !== STACK_NAME) {
          throw new Error(`Expected Stack name in listStackResources() call to be: '${STACK_NAME}', but received: '${stackName}'`);
        }
        return {
          StackResourceSummaries: rootStackName ? currentNestedCfnStackResources[stackName] : currentCfnStackResources,
        };
      },
    });
  }

  public setUpdateStateMachineMock(
    mockUpdateMachineDefinition: (input: stepfunctions.UpdateStateMachineInput) => stepfunctions.UpdateStateMachineOutput,
  ) {
    this.mockSdkProvider.stubStepFunctions({
      updateStateMachine: mockUpdateMachineDefinition,
    });
  }

  public stubLambda(
    stubs: SyncHandlerSubsetOf<AWS.Lambda>,
    serviceStubs?: SyncHandlerSubsetOf<AWS.Service>,
    additionalProperties: { [key: string]: any } = {},
  ): void {
    this.mockSdkProvider.stubLambda(stubs, {
      api: {
        waiters: {},
      },
      makeRequest() {
        return {
          promise: () => Promise.resolve({}),
          response: {},
          addListeners: () => {},
        };
      },
      ...serviceStubs,
      ...additionalProperties,
    });
  }

  public getLambdaApiWaiters(): { [key: string]: any } {
    return (this.mockSdkProvider.sdk.lambda() as any).api.waiters;
  }

  public setUpdateProjectMock(mockUpdateProject: (input: codebuild.UpdateProjectInput) => codebuild.UpdateProjectOutput) {
    this.mockSdkProvider.stubCodeBuild({
      updateProject: mockUpdateProject,
    });
  }

  public stubAppSync(stubs: SyncHandlerSubsetOf<AWS.AppSync>) {
    this.mockSdkProvider.stubAppSync(stubs);
  }

  public setInvokeLambdaMock(mockInvokeLambda: (input: lambda.InvocationRequest) => lambda.InvocationResponse) {
    this.mockSdkProvider.stubLambda({
      invoke: mockInvokeLambda,
    });
  }

  public stubEcs(stubs: SyncHandlerSubsetOf<AWS.ECS>, additionalProperties: { [key: string]: any } = {}): void {
    this.mockSdkProvider.stubEcs(stubs, additionalProperties);
  }

  public stubGetEndpointSuffix(stub: () => string) {
    this.mockSdkProvider.stubGetEndpointSuffix(stub);
  }

  public tryHotswapDeployment(
    hotswapMode: HotswapMode,
    stackArtifact: cxapi.CloudFormationStackArtifact,
    assetParams: { [key: string]: string } = {},
  ): Promise<DeployStackResult | undefined> {
    return deployments.tryHotswapDeployment(this.mockSdkProvider, assetParams, currentCfnStack, stackArtifact, hotswapMode);
  }
}
