import { ScalingInterval } from '@aws-cdk/aws-applicationautoscaling';
import { IVpc } from '@aws-cdk/aws-ec2';
import { AwsLogDriver, BaseService, Cluster, ContainerImage, DeploymentController, ICluster, LogDriver, PropagatedTagSource, Secret } from '@aws-cdk/aws-ecs';
import { IQueue, Queue } from '@aws-cdk/aws-sqs';
import { CfnOutput, Duration, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * The properties for the base QueueProcessingEc2Service or QueueProcessingFargateService service.
 */
export interface QueueProcessingServiceBaseProps {
  /**
   * The name of the service.
   *
   * @default - CloudFormation-generated name.
   */
  readonly serviceName?: string;

  /**
   * The name of the cluster that hosts the service.
   *
   * If a cluster is specified, the vpc construct should be omitted. Alternatively, you can omit both cluster and vpc.
   * @default - create a new cluster; if both cluster and vpc are omitted, a new VPC will be created for you.
   */
  readonly cluster?: ICluster;

  /**
   * The VPC where the container instances will be launched or the elastic network interfaces (ENIs) will be deployed.
   *
   * If a vpc is specified, the cluster construct should be omitted. Alternatively, you can omit both vpc and cluster.
   * @default - uses the VPC defined in the cluster or creates a new VPC.
   */
  readonly vpc?: IVpc;

  /**
   * The image used to start a container.
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
   * Flag to indicate whether to enable logging.
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
   * The secret to expose to the container as an environment variable.
   *
   * @default - No secret environment variables.
   */
  readonly secrets?: { [key: string]: Secret };

  /**
   * A queue for which to process items from.
   *
   * If specified and this is a FIFO queue, the queue name must end in the string '.fifo'. See
   * [CreateQueue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_CreateQueue.html)
   *
   * @default 'SQSQueue with CloudFormation-generated name'
   */
  readonly queue?: IQueue;

  /**
   * The maximum number of times that a message can be received by consumers.
   * When this value is exceeded for a message the message will be automatically sent to the Dead Letter Queue.
   *
   * @default 3
   */
  readonly maxReceiveCount?: number;

  /**
   * The number of seconds that Dead Letter Queue retains a message.
   *
   * @default Duration.days(14)
   */
  readonly retentionPeriod?: Duration;

  /**
   * Maximum capacity to scale to.
   *
   * @default (desiredTaskCount * 2)
   */
  readonly maxScalingCapacity?: number

  /**
   * The intervals for scaling based on the SQS queue's ApproximateNumberOfMessagesVisible metric.
   *
   * Maps a range of metric values to a particular scaling behavior. See
   * [Simple and Step Scaling Policies for Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html)
   *
   * @default [{ upper: 0, change: -1 },{ lower: 100, change: +1 },{ lower: 500, change: +5 }]
   */
  readonly scalingSteps?: ScalingInterval[];

  /**
   * The log driver to use.
   *
   * @default - AwsLogDriver if enableLogging is true
   */
  readonly logDriver?: LogDriver;

  /**
   * Specifies whether to propagate the tags from the task definition or the service to the tasks in the service.
   * Tags can only be propagated to the tasks within the service during service creation.
   *
   * @default - none
   */
  readonly propagateTags?: PropagatedTagSource;

  /**
   * Specifies whether to enable Amazon ECS managed tags for the tasks within the service. For more information, see
   * [Tagging Your Amazon ECS Resources](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html)
   *
   * @default false
   */
  readonly enableECSManagedTags?: boolean;

  /**
   * The name of a family that the task definition is registered to. A family groups multiple versions of a task definition.
   *
   * @default - Automatically generated name.
   */
  readonly family?: string;

  /**
   * The maximum number of tasks, specified as a percentage of the Amazon ECS
   * service's DesiredCount value, that can run in a service during a
   * deployment.
   *
   * @default - default from underlying service.
   */
  readonly maxHealthyPercent?: number;

  /**
   * The minimum number of tasks, specified as a percentage of
   * the Amazon ECS service's DesiredCount value, that must
   * continue to run and remain healthy during a deployment.
   *
   * @default - default from underlying service.
   */
  readonly minHealthyPercent?: number;

  /**
   * Specifies which deployment controller to use for the service. For more information, see
   * [Amazon ECS Deployment Types](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-types.html)
   *
   * @default - Rolling update (ECS)
   */
  readonly deploymentController?: DeploymentController;
}

/**
 * The base class for QueueProcessingEc2Service and QueueProcessingFargateService services.
 */
export abstract class QueueProcessingServiceBase extends CoreConstruct {
  /**
   * The SQS queue that the service will process from
   */
  public readonly sqsQueue: IQueue;

  /**
   * The dead letter queue for the primary SQS queue
   */
  public readonly deadLetterQueue?: IQueue;

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
   * The secret environment variables.
   */
  public readonly secrets?: { [key: string]: Secret };

  /**
   * The minimum number of tasks to run.
   */
  public readonly desiredCount: number;

  /**
   * The maximum number of instances for autoscaling to scale up to.
   */
  public readonly maxCapacity: number;

  /**
   * The scaling interval for autoscaling based off an SQS Queue size.
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
      throw new Error('You can only specify either vpc or cluster. Alternatively, you can leave both blank');
    }
    this.cluster = props.cluster || this.getDefaultCluster(this, props.vpc);

    // Create the SQS queue and it's corresponding DLQ if one is not provided
    if (props.queue) {
      this.sqsQueue = props.queue;
    } else {
      this.deadLetterQueue = new Queue(this, 'EcsProcessingDeadLetterQueue', {
        retentionPeriod: props.retentionPeriod || Duration.days(14),
      });
      this.sqsQueue = new Queue(this, 'EcsProcessingQueue', {
        deadLetterQueue: {
          queue: this.deadLetterQueue,
          maxReceiveCount: props.maxReceiveCount || 3,
        },
      });

      new CfnOutput(this, 'SQSDeadLetterQueue', { value: this.deadLetterQueue.queueName });
      new CfnOutput(this, 'SQSDeadLetterQueueArn', { value: this.deadLetterQueue.queueArn });
    }

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
    this.desiredCount = props.desiredTaskCount !== undefined ? props.desiredTaskCount : 1;
    this.maxCapacity = props.maxScalingCapacity || (2 * this.desiredCount);

    if (!this.desiredCount && !this.maxCapacity) {
      throw new Error('maxScalingCapacity must be set and greater than 0 if desiredCount is 0');
    }

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
      scalingSteps: this.scalingSteps,
    });
  }

  /**
   * Grant SQS permissions to an ECS service.
   * @param service the ECS/Fargate service to which to grant SQS permissions
   */
  protected grantPermissionsToService(service: BaseService) {
    this.sqsQueue.grantConsumeMessages(service.taskDefinition.taskRole);
  }

  /**
   * Returns the default cluster.
   */
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
