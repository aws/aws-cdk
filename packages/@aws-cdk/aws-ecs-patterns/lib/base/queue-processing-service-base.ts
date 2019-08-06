import { ScalingInterval } from '@aws-cdk/aws-applicationautoscaling';
import { IVpc } from '@aws-cdk/aws-ec2';
import { AwsLogDriver, BaseService, Cluster, ContainerImage, ICluster, LogDriver, Secret } from '@aws-cdk/aws-ecs';
import { IQueue, Queue } from '@aws-cdk/aws-sqs';
import { CfnOutput, Construct, Stack } from '@aws-cdk/core';

/**
 * The properties for the base QueueProcessingEc2Service or QueueProcessingFargateService service.
 */
export interface QueueProcessingServiceBaseProps {
  /**
   * The cluster where your service will be deployed
   * You can only specify either vpc or cluster. Alternatively, you can leave both blank
   *
   * @default - create a new cluster; if you do not specify a cluster nor a vpc, a new VPC will be created for you as well
   */
  readonly cluster?: ICluster;

  /**
   * VPC that the cluster instances or tasks are running in
   * You can only specify either vpc or cluster. Alternatively, you can leave both blank
   *
   * @default - use vpc of cluster or create a new one
   */
  readonly vpc?: IVpc;

  /**
   * The image used to start a container.
   *
   * This string is passed directly to the Docker daemon.
   * Images in the Docker Hub registry are available by default.
   * Other repositories are specified with either repository-url/image:tag or repository-url/image@digest.
   */
  readonly image: ContainerImage;

  /**
   * The command that is passed to the container.
   *
   * If you provide a shell command as a single string, you have to quote command-line arguments.
   *
   * @default - CMD value built into container image.
   */
  readonly command?: string[];

  /**
   * The desired number of instantiations of the task definition to keep running on the service.
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
   * The variable `QUEUE_NAME` with value `queue.queueName` will
   * always be passed.
   *
   * @default 'QUEUE_NAME: queue.queueName'
   */
  readonly environment?: { [key: string]: string };

  /**
   * Secret environment variables to pass to the container
   *
   * @default - No secret environment variables.
   */
  readonly secrets?: { [key: string]: Secret };

  /**
   * A queue for which to process items from.
   *
   * If specified and this is a FIFO queue, the queue name must end in the string '.fifo'.
   * @see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_CreateQueue.html
   *
   * @default 'SQSQueue with CloudFormation-generated name'
   */
  readonly queue?: IQueue;

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
  readonly scalingSteps?: ScalingInterval[];

  /**
   * The LogDriver to use for logging.
   *
   * @default AwsLogDriver if enableLogging is true
   */
  readonly logDriver?: LogDriver;
}

/**
 * The base class for QueueProcessingEc2Service and QueueProcessingFargateService services.
 */
export abstract class QueueProcessingServiceBase extends Construct {
  /**
   * The SQS queue that the service will process from
   */
  public readonly sqsQueue: IQueue;

  /**
   * The cluster where your service will be deployed
   */
  public readonly cluster: ICluster;

  // Properties that have defaults defined. The Queue Processing Service will handle assigning undefined properties with default
  // values so that derived classes do not need to maintain the same logic.

  /**
   * Environment variables that will include the queue name
   */
  public readonly environment: { [key: string]: string };

  /**
   * Secret environment variables
   */
  public readonly secrets?: { [key: string]: Secret };

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
  public readonly scalingSteps: ScalingInterval[];
  /**
   * The AwsLogDriver to use for logging if logging is enabled.
   */
  public readonly logDriver?: LogDriver;

  /**
   * Constructs a new instance of the QueueProcessingServiceBase class.
   */
  constructor(scope: Construct, id: string, props: QueueProcessingServiceBaseProps) {
    super(scope, id);

    if (props.cluster && props.vpc) {
      throw new Error(`You can only specify either vpc or cluster. Alternatively, you can leave both blank`);
    }
    this.cluster = props.cluster || this.getDefaultCluster(this, props.vpc);

    // Create the SQS queue if one is not provided
    this.sqsQueue = props.queue !== undefined ? props.queue : new Queue(this, 'EcsProcessingQueue', {});

    // Setup autoscaling scaling intervals
    const defaultScalingSteps = [{ upper: 0, change: -1 }, { lower: 100, change: +1 }, { lower: 500, change: +5 }];
    this.scalingSteps = props.scalingSteps !== undefined ? props.scalingSteps : defaultScalingSteps;

    // Create log driver if logging is enabled
    const enableLogging = props.enableLogging !== undefined ? props.enableLogging : true;
    this.logDriver = props.logDriver !== undefined
                        ? props.logDriver
                        : enableLogging
                            ? this.createAWSLogDriver(this.node.id)
                            : undefined;

    // Add the queue name to environment variables
    this.environment = { ...(props.environment || {}), QUEUE_NAME: this.sqsQueue.queueName };
    this.secrets = props.secrets;

    // Determine the desired task count (minimum) and maximum scaling capacity
    this.desiredCount = props.desiredTaskCount || 1;
    this.maxCapacity = props.maxScalingCapacity || (2 * this.desiredCount);

    new CfnOutput(this, 'SQSQueue', { value: this.sqsQueue.queueName });
    new CfnOutput(this, 'SQSQueueArn', { value: this.sqsQueue.queueArn });
  }

  /**
   * Configure autoscaling based off of CPU utilization as well as the number of messages visible in the SQS queue
   *
   * @param service the ECS/Fargate service for which to apply the autoscaling rules to
   */
  protected configureAutoscalingForService(service: BaseService) {
    const scalingTarget = service.autoScaleTaskCount({ maxCapacity: this.maxCapacity, minCapacity: this.desiredCount });
    scalingTarget.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
    });
    scalingTarget.scaleOnMetric('QueueMessagesVisibleScaling', {
      metric: this.sqsQueue.metricApproximateNumberOfMessagesVisible(),
      scalingSteps: this.scalingSteps
    });
  }

  protected getDefaultCluster(scope: Construct, vpc?: IVpc): Cluster {
    // magic string to avoid collision with user-defined constructs
    const DEFAULT_CLUSTER_ID = `EcsDefaultClusterMnL3mNNYN${vpc ? vpc.node.id : ''}`;
    const stack = Stack.of(scope);
    return stack.node.tryFindChild(DEFAULT_CLUSTER_ID) as Cluster || new Cluster(stack, DEFAULT_CLUSTER_ID, { vpc });
  }

  /**
   * Create an AWS Log Driver with the provided streamPrefix
   *
   * @param prefix the Cloudwatch logging prefix
   */
  private createAWSLogDriver(prefix: string): AwsLogDriver {
    return new AwsLogDriver({ streamPrefix: prefix });
  }
}
