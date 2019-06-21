import autoscaling = require('@aws-cdk/aws-applicationautoscaling');
import ecs = require('@aws-cdk/aws-ecs');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');

/**
 * Properties to define a queue processing service
 */
export interface QueueProcessingServiceBaseProps {
  /**
   * Cluster where service will be deployed
   */
  readonly cluster: ecs.ICluster;

  /**
   * The image to start.
   */
  readonly image: ecs.ContainerImage;

  /**
   * The CMD value to pass to the container. A string with commands delimited by commas.
   *
   * @default none
   */
  readonly command?: string[];

  /**
   * Number of desired copies of running tasks
   *
   * @default 1
   */
  readonly desiredTaskCount?: number;

  /**
   * Flag to indicate whether to enable logging
   *
   * @default true
   */
  readonly enableLogging?: boolean;

  /**
   * The environment variables to pass to the container.
   *
   * @default 'QUEUE_NAME: queue.queueName'
   */
  readonly environment?: { [key: string]: string };

  /**
   * A queue for which to process items from.
   *
   * If specified and this is a FIFO queue, the queue name must end in the string '.fifo'.
   * @see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_CreateQueue.html
   *
   * @default 'SQSQueue with CloudFormation-generated name'
   */
  readonly queue?: sqs.IQueue;

  /**
   * Maximum capacity to scale to.
   *
   * @default (desiredTaskCount * 2)
   */
  readonly maxScalingCapacity?: number

  /**
   * The intervals for scaling based on the SQS queue's ApproximateNumberOfMessagesVisible metric.
   *
   * Maps a range of metric values to a particular scaling behavior.
   * https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html
   *
   * @default [{ upper: 0, change: -1 },{ lower: 100, change: +1 },{ lower: 500, change: +5 }]
   */
  readonly scalingSteps?: autoscaling.ScalingInterval[];
}

/**
 * Base class for a Fargate and ECS queue processing service
 */
export abstract class QueueProcessingServiceBase extends cdk.Construct {
  /**
   * The SQS queue that the service will process from
   */
  public readonly sqsQueue: sqs.IQueue;

  // Properties that have defaults defined. The Queue Processing Service will handle assigning undefined properties with default
  // values so that derived classes do not need to maintain the same logic.

  /**
   * Environment variables that will include the queue name
   */
  public readonly environment: { [key: string]: string };
  /**
   * The minimum number of tasks to run
   */
  public readonly desiredCount: number;
  /**
   * The maximum number of instances for autoscaling to scale up to
   */
  public readonly maxCapacity: number;
  /**
   * The scaling interval for autoscaling based off an SQS Queue size
   */
  public readonly scalingSteps: autoscaling.ScalingInterval[];
  /**
   * The AwsLogDriver to use for logging if logging is enabled.
   */
  public readonly logDriver?: ecs.LogDriver;

  constructor(scope: cdk.Construct, id: string, props: QueueProcessingServiceBaseProps) {
    super(scope, id);

    // Create the SQS queue if one is not provided
    this.sqsQueue = props.queue !== undefined ? props.queue : new sqs.Queue(this, 'EcsProcessingQueue', {});

    // Setup autoscaling scaling intervals
    const defaultScalingSteps = [{ upper: 0, change: -1 }, { lower: 100, change: +1 }, { lower: 500, change: +5 }];
    this.scalingSteps = props.scalingSteps !== undefined ? props.scalingSteps : defaultScalingSteps;

    // Create log driver if logging is enabled
    const enableLogging = props.enableLogging !== undefined ? props.enableLogging : true;
    this.logDriver = enableLogging ? this.createAWSLogDriver(this.node.id) : undefined;

    // Add the queue name to environment variables
    this.environment = { ...(props.environment || {}), QUEUE_NAME: this.sqsQueue.queueName };

    // Determine the desired task count (minimum) and maximum scaling capacity
    this.desiredCount = props.desiredTaskCount || 1;
    this.maxCapacity = props.maxScalingCapacity || (2 * this.desiredCount);

    new cdk.CfnOutput(this, 'SQSQueue', { value: this.sqsQueue.queueName });
    new cdk.CfnOutput(this, 'SQSQueueArn', { value: this.sqsQueue.queueArn });
  }

  /**
   * Configure autoscaling based off of CPU utilization as well as the number of messages visible in the SQS queue
   *
   * @param service the ECS/Fargate service for which to apply the autoscaling rules to
   */
  protected configureAutoscalingForService(service: ecs.BaseService) {
    const scalingTarget = service.autoScaleTaskCount({ maxCapacity: this.maxCapacity, minCapacity: this.desiredCount });
    scalingTarget.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
    });
    scalingTarget.scaleOnMetric('QueueMessagesVisibleScaling', {
      metric: this.sqsQueue.metricApproximateNumberOfMessagesVisible(),
      scalingSteps: this.scalingSteps
    });
  }

  /**
   * Create an AWS Log Driver with the provided streamPrefix
   *
   * @param prefix the Cloudwatch logging prefix
   */
  private createAWSLogDriver(prefix: string): ecs.AwsLogDriver {
    return new ecs.AwsLogDriver({ streamPrefix: prefix });
  }
}
