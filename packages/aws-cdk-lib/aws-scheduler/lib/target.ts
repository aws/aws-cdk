import { ScheduleTargetInput } from './input';
import { ISchedule } from './schedule';
import { CfnSchedule } from './scheduler.generated';
import * as iam from '../../aws-iam';

/**
 * Interface representing a Event Bridge Schedule Target.
 */
export interface IScheduleTarget {
  /**
   * Returns the schedule target specification.
   *
   * @param _schedule a schedule the target should be added to.
   */
  bind(_schedule: ISchedule): ScheduleTargetConfig;
}

/**
 * Config of a Schedule Target used during initialization of Schedule
 */
export interface ScheduleTargetConfig {
  /**
   * The Amazon Resource Name (ARN) of the target.
   */
  readonly arn: string;

  /**
   * Role to use to invoke this event target
   */
  readonly role: iam.IRole;

  /**
   *  What input to pass to the target
   * @default - No input
   */
  readonly input?: ScheduleTargetInput;

  /**
   * A `RetryPolicy` object that includes information about the retry policy settings, including the maximum age of an event, and the maximum number of times EventBridge Scheduler will try to deliver the event to a target.
   * @default - Maximum retry attempts of 185 and maximum age of 86400 seconds (1 day)
   */
  readonly retryPolicy?: CfnSchedule.RetryPolicyProperty;

  /**
   * An object that contains information about an Amazon SQS queue that EventBridge Scheduler uses as a dead-letter queue for your schedule.
   * If specified, EventBridge Scheduler delivers failed events that could not be successfully delivered to a target to the queue.
   * @default - No dead-letter queue
   */
  readonly deadLetterConfig?: CfnSchedule.DeadLetterConfigProperty;

  /**
   *  The templated target type for the Amazon ECS RunTask API Operation.
   * @default - No parameters
   */
  readonly ecsParameters?: CfnSchedule.EcsParametersProperty;

  /**
   * The templated target type for the EventBridge PutEvents API operation.
   * @default - No parameters
   */
  readonly eventBridgeParameters?: CfnSchedule.EventBridgeParametersProperty;

  /**
   * The templated target type for the Amazon Kinesis PutRecord API operation.
   * @default - No parameters
   */
  readonly kinesisParameters?: CfnSchedule.KinesisParametersProperty;

  /**
   * The templated target type for the Amazon SageMaker StartPipelineExecution API operation.
   * @default - No parameters
   */
  readonly sageMakerPipelineParameters?: CfnSchedule.SageMakerPipelineParametersProperty;

  /**
   * The templated target type for the Amazon SQS SendMessage API Operation
   * @default - No parameters
   */
  readonly sqsParameters?: CfnSchedule.SqsParametersProperty;
}
