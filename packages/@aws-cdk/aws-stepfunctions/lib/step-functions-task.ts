import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import iam = require('@aws-cdk/aws-iam');
import { Duration } from '@aws-cdk/cdk';
import { Task } from './states/task';

/**
 * Interface for resources that can be used as tasks
 */
export interface IStepFunctionsTask {
  /**
   * Called when the task object is used in a workflow
   */
  bind(task: Task): StepFunctionsTaskConfig;
}

/**
 * Properties that define what kind of task should be created
 */
export interface StepFunctionsTaskConfig {
  /**
   * The resource that represents the work to be executed
   *
   * Either the ARN of a Lambda Function or Activity, or a special
   * ARN.
   */
  readonly resourceArn: string;

  /**
   * Parameters pass a collection of key-value pairs, either static values or JSONPath expressions that select from the input.
   *
   * What is passed here will be merged with any default parameters
   * configured by the `resource`. For example, a DynamoDB table target
   * will
   *
   * @see
   * https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-parameters
   *
   * @default No parameters
   */
  readonly parameters?: { [name: string]: any };

  /**
   * Maximum time between heart beats
   *
   * If the time between heart beats takes longer than this, a 'Timeout' error is raised.
   *
   * This is only relevant when using an Activity type as resource.
   *
   * @default No heart beat timeout
   */
  readonly heartbeat?: Duration;

  /**
   * Additional policy statements to add to the execution role
   *
   * @default No policy roles
   */
  readonly policyStatements?: iam.PolicyStatement[];

  /**
   * Prefix for singular metric names of activity actions
   *
   * @default No such metrics
   */
  readonly metricPrefixSingular?: string;

  /**
   * Prefix for plural metric names of activity actions
   *
   * @default No such metrics
   */
  readonly metricPrefixPlural?: string;

  /**
   * The dimensions to attach to metrics
   *
   * @default No metrics
   */
  readonly metricDimensions?: cloudwatch.DimensionHash;
}
