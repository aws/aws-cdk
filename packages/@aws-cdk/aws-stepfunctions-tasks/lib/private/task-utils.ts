import {
  FieldUtils,
  IntegrationPattern,
  renderJsonPath,
  TaskStateBaseProps,
} from '@aws-cdk/aws-stepfunctions';
import { Aws } from '@aws-cdk/core';

/**
 * Represents a service integration call to Step Functions
 */
export interface TaskStateConfig extends TaskStateBaseProps {
  /**
   * The ARN of resource that represents the work to be executed
   */
  readonly resourceArn: string;

  /**
   * Parameters pass a collection of key-value pairs, either static values or
   * JSON path expressions that select from the input.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-parameters
   *
   * @default - No parameters
   */
  readonly parameters?: { [name: string]: any };
}

/**
 * Generates the State JSON to define a task state
 */
export function taskStateJson(config: TaskStateConfig): any {
  return {
    Type: 'Task',
    Comment: config.comment,
    Resource: config.resourceArn,
    Parameters: config.parameters && FieldUtils.renderObject(config.parameters),
    TimeoutSeconds: config.timeout?.toSeconds(),
    HeartbeatSeconds: config.heartbeat?.toSeconds(),
    InputPath: renderJsonPath(config.inputPath),
    OutputPath: renderJsonPath(config.outputPath),
    ResultPath: renderJsonPath(config.resultPath),
  };
}

/**
 * Verifies that a validation pattern is supported for a service integration
 *
 */
export function validatePatternSupported(integrationPattern: IntegrationPattern, supportedPatterns: IntegrationPattern[]) {
  if (!supportedPatterns.includes(integrationPattern)) {
    throw new Error(`Invalid Service Integration Pattern: ${integrationPattern} is not supported`);
  }
}

/**
 * Suffixes corresponding to different service integration patterns
 *
 * Key is the service integration pattern, value is the resource ARN suffix.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html
 */
const resourceArnSuffix = new Map<IntegrationPattern, string>();
resourceArnSuffix.set(IntegrationPattern.REQUEST_RESPONSE, '');
resourceArnSuffix.set(IntegrationPattern.RUN_JOB, '.sync');
resourceArnSuffix.set(IntegrationPattern.WAIT_FOR_TASK_TOKEN, '.waitForTaskToken');

export function getResourceArn(service: string, api: string, integrationPattern: IntegrationPattern): string {
  if (!service || !api) {
    throw new Error("Both 'service' and 'api' must be provided to build the resource ARN.");
  }
  return `arn:${Aws.PARTITION}:states:::${service}:${api}` +
        (integrationPattern ? resourceArnSuffix.get(integrationPattern) : '');
}
