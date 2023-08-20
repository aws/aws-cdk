import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnSchedule } from 'aws-cdk-lib/aws-scheduler';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { ScheduleTargetInput } from './input';
import { ISchedule } from './schedule';

export interface IScheduleTarget {
  bind(_schedule: ISchedule): ScheduleTargetConfig;
}

/**
 * Base properties for a Schedule Target
 */
export interface ScheduleTargetBaseProps {
  /**
   * An execution role is an IAM role that EventBridge Scheduler assumes in order to interact with other AWS services on your behalf.
   *
   * If none provided templates target will automatically create an IAM role with all the minimum necessary
   * permissions to interact with the templated target. If you wish you may specify your own IAM role, then the templated targets
   * will grant minimal required permissions.
   *
   * Universal target automatically create an IAM role if you do not specify your own IAM role.
   * However, in comparison with templated targets, for universal targets you must grant the required
   * IAM permissions yourself.
   *
   * @default - created by target
   */
  readonly role?: iam.IRole;
  /**
   * The SQS queue to be used as deadLetterQueue.
   *
   * The events not successfully delivered are automatically retried for a specified period of time,
   * depending on the retry policy of the target.
   * If an event is not delivered before all retry attempts are exhausted, it will be sent to the dead letter queue.
   *
   * @default - no dead-letter queue
   */
  readonly deadLetterQueue?: sqs.IQueue;

  /**
   * Input passed to the target.
   *
   * @default - no input.
   */
  readonly input?: ScheduleTargetInput;

  /**
   * The maximum age of a request that Scheduler sends to a target for processing.
   *
   * Minimum value of 60.
   * Maximum value of 86400.
   *
   * @default Duration.hours(24)
   */
  readonly maxEventAge?: Duration;
  /**
   * The maximum number of times to retry when the target returns an error.
   *
   * Minimum value of 0.
   * Maximum value of 185.
   *
   * @default 185
   */
  readonly retryAttempts?: number;
}

/**
 * Config of a Schedule Target used during initalization of Schedule
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
   *  What input to pass to the tatget
   */
  readonly input?: ScheduleTargetInput;

  /**
   * A `RetryPolicy` object that includes information about the retry policy settings, including the maximum age of an event, and the maximum number of times EventBridge Scheduler will try to deliver the event to a target.
   */
  readonly retryPolicy?: CfnSchedule.RetryPolicyProperty;

  /**
   * An object that contains information about an Amazon SQS queue that EventBridge Scheduler uses as a dead-letter queue for your schedule. If specified, EventBridge Scheduler delivers failed events that could not be successfully delivered to a target to the queue.\
   */
  readonly deadLetterConfig?: CfnSchedule.DeadLetterConfigProperty

  /**
   *  The templated target type for the Amazon ECS RunTask API Operation.
   */
  readonly ecsParameters?: CfnSchedule.EcsParametersProperty;
  /**
   * The templated target type for the EventBridge PutEvents API operation.
   */
  readonly eventBridgeParameters?: CfnSchedule.EventBridgeParametersProperty;

  /**
   * The templated target type for the Amazon Kinesis PutRecord API operation.
   */
  readonly kinesisParameters?: CfnSchedule.KinesisParametersProperty;

  /**
   * The templated target type for the Amazon SageMaker StartPipelineExecution API operation.
   */
  readonly sageMakerPipelineParameters?: CfnSchedule.SageMakerPipelineParametersProperty;
  /**
   * The templated target type for the Amazon SQS SendMessage API Operation
   */
  readonly sqsParameters?: CfnSchedule.SqsParametersProperty;
}