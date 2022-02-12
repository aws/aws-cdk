import * as cxapi from '@aws-cdk/cx-api';
import { Lambda } from 'aws-sdk';
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
export async function getExecutor(options: GetExecutorOptions): Promise<Executor> {
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
    if (stackResource.ResourceType === 'AWS::Lambda::Function') {
      return new LambdaFunctionExecutor({
        physicalResourceId: stackResource.PhysicalResourceId,
        lambda: sdk.lambda(),
      });
    }

    throw new Error(`Unsupported resource type ${stackResource.ResourceType}`);
  }

  throw new Error('Could not find a resource with the given construct path');
}

/**
 * Options for `StateMachineExecutor`
 */
export interface ExecutorOptions {
  /**
   * The physical resource of the resource to execute.
   */
  readonly physicalResourceId: string;
}

/**
 * ABC for executors.
 */
export abstract class Executor {
  readonly physicalResourceId: string;

  constructor(options: ExecutorOptions) {
    this.physicalResourceId = options.physicalResourceId;
  }

  abstract execute(input?: string): Promise<ExecuteResult>;

  protected validateJsonObjectInput(input: string | undefined) {
    if (input && !isJsonObject(input)) {
      throw new Error('The provided input should be a JSON object');
    }
  }
}

/**
 * The executor's result.
 */
export interface ExecuteResult {
  /**
   * The execution's output.
   */
  readonly output?: any;

  /**
   * Error message
   */
  readonly error?: string;
}

/**
 * Options for `StateMachineExecutor`
 */
export interface StateMachineExecutorOptions extends ExecutorOptions {
  /**
   * The Step Functions SDK
   */
  readonly stepFunctions: AWS.StepFunctions;
}

/**
 * Executes a Step Functions State Machine
 */
export class StateMachineExecutor extends Executor {
  private readonly stepFunctions: AWS.StepFunctions;

  constructor(options: StateMachineExecutorOptions) {
    super(options);
    this.stepFunctions = options.stepFunctions;
  }

  async execute(input?: string): Promise<ExecuteResult> {
    this.validateJsonObjectInput(input);

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
        const output = description.output
          ? JSON.parse(description.output)
          : undefined;

        return {
          output,
        };
      }

      return {
        error: `State machine execution's final status is ${executionStatus}`,
      };
    }
  }
}

export interface LambdaFunctionExecutorOptions extends ExecutorOptions {
  /**
   * The Lambda SDK
   */
  readonly lambda: AWS.Lambda;
}

/**
 * Executes a lambda function
 */
export class LambdaFunctionExecutor extends Executor {
  private readonly lambda: Lambda;

  constructor(options: LambdaFunctionExecutorOptions) {
    super(options);
    this.lambda = options.lambda;
  }

  async execute(input?: string): Promise<ExecuteResult> {
    this.validateJsonObjectInput(input);

    const response = await this.lambda.invoke({
      FunctionName: this.physicalResourceId,
      Payload: input,
    }).promise();

    const payload = response.Payload?.toString();
    if (!payload) {
      throw new Error('Lambda invocation did not return a payload');
    }

    const output = JSON.parse(payload);
    const errorMessage = getLambdaErrorMessage(output);
    if (errorMessage) {
      return {
        error: `Lambda returned an error message: ${errorMessage}`,
        output,
      };
    }

    return {
      output,
    };
  }
}

function getLambdaErrorMessage(output: any) {
  if (typeof output !== 'object' || output === null) {
    return;
  }

  if (output.errorMessage) {
    return output.errorMessage;
  }

  return;
}

function isJsonObject(json: string) {
  try {
    return typeof JSON.parse(json) == 'object';
  } catch (e) {
    return false;
  }
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