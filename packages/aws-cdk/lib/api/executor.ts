import * as cxapi from '@aws-cdk/cx-api';
import { error, print, success } from '../logging';
import { Mode, SdkProvider } from './aws-auth';
import { LazyListStackResources } from './evaluate-cloudformation-template';

export interface GetExecutorOptions {
  /**
   * Path to the resource containing the state machine to execute.
   */
  readonly constructPath: string;

  /**
   * Stack artifacts to search for the resource.
   */
  readonly stackArtifacts: cxapi.CloudFormationStackArtifact[];

  /**
   * SDK access
   */
  readonly sdkProvider: SdkProvider;
}

/**
 * Gets an executor.
 */
export async function getExecutor(options: GetExecutorOptions): Promise<StateMachineExecutor> {
  const { sdkProvider, stackArtifacts, constructPath } = options;

  for (const stackArtifact of stackArtifacts) {
    const resolvedEnv = await sdkProvider.resolveEnvironment(stackArtifact.environment);
    const sdk = (await sdkProvider.forEnvironment(resolvedEnv, Mode.ForWriting)).sdk;

    const logicalResourceId = findLogicalResourceId(stackArtifact.template, `${constructPath}/Resource`);
    if (!logicalResourceId) {
      // Not found in this stack artifact
      continue;
    }

    const listStackResources = new LazyListStackResources(sdk, stackArtifact.stackName);
    const stackResource = (await listStackResources.listStackResources())
      .find(sr => sr.LogicalResourceId === logicalResourceId);

    if (!stackResource || !stackResource.PhysicalResourceId) {
      throw new Error(`Could not find the physical resource id for ${constructPath}`);
    }

    if (stackResource.ResourceType === 'AWS::StepFunctions::StateMachine') {
      return new StateMachineExecutor({
        physicalResourceId: stackResource.PhysicalResourceId,
        stepFunctions: sdk.stepFunctions(),
      });
    }

    throw new Error(`Unsupported resource type ${stackResource.ResourceType}`);
  }

  throw new Error('Could not find a resource with the given construct path');
}

/**
 * Options for `StateMachineExecutor`
 */
export interface StateMachineExecutorOptions {
  /**
   * The State Machine's physical resource id
   */
  readonly physicalResourceId: string;

  /**
   * The Step Functions SDK
   */
  readonly stepFunctions: AWS.StepFunctions;
}

/**
 * Executes a Step Functions State Machine
 */
export class StateMachineExecutor {
  private readonly stepFunctions: AWS.StepFunctions;
  public readonly physicalResourceId: string;

  constructor(options: StateMachineExecutorOptions) {
    this.physicalResourceId = options.physicalResourceId;
    this.stepFunctions = options.stepFunctions;
  }

  async execute(input?: string): Promise<ExecuteResult> {
    if (input && !isJsonObject(input)) {
      throw new Error('The execution input should be a JSON object');
    }

    print('Executing state machine %s', this.physicalResourceId);
    const execution = await this.stepFunctions.startExecution({
      stateMachineArn: this.physicalResourceId,
      input,
    }).promise();

    while (true) {
      const description = await this.stepFunctions.describeExecution({
        executionArn: execution.executionArn,
      }).promise();

      const executionStatus = description.status;
      if (executionStatus == 'RUNNING') {
        await new Promise(res => setTimeout(res, 500));
        continue;
      }

      if (executionStatus === 'SUCCEEDED') {
        success('✅ Final execution status: %s', executionStatus);
        return { success: true };
      } else {
        error('❌ Terminal execution status: %s', executionStatus);
        return { success: false };
      }
    }
  }
}

function isJsonObject(json: string) {
  try {
    return typeof JSON.parse(json) == 'object';
  } catch (e) {
    return false;
  }
}

/**
 * The executor's result.
 */
export interface ExecuteResult {
  /**
   * Execution was successful.
   */
  readonly success: boolean;
}

function findLogicalResourceId(template: any, constructPath: string): string | undefined {
  if (typeof template.Resources !== 'object') {
    return;
  }

  for (const [logicalResourceId, resource] of Object.entries(template.Resources)) {
    if (typeof resource !== 'object' || resource === null) {
      continue;
    }

    const resourceRecord = resource as Record<string, any>;
    if (typeof resourceRecord.Metadata !== 'object') {
      continue;
    }

    if (resourceRecord.Metadata['aws:cdk:path'] === constructPath) {
      return logicalResourceId;
    }
  }

  return;
}