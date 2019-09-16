import { Schedule } from "@aws-cdk/aws-applicationautoscaling";
import { IVpc } from '@aws-cdk/aws-ec2';
import { AwsLogDriver, Cluster, ContainerImage, ICluster, LogDriver, Secret, TaskDefinition } from "@aws-cdk/aws-ecs";
import { Rule } from "@aws-cdk/aws-events";
import { EcsTask } from "@aws-cdk/aws-events-targets";
import { Construct, Stack } from "@aws-cdk/core";

/**
 * The properties for the base ScheduledEc2Task or ScheduledFargateTask task.
 */
export interface ScheduledTaskBaseProps {
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
   * The schedule or rate (frequency) that determines when CloudWatch Events
   * runs the rule. For more information, see Schedule Expression Syntax for
   * Rules in the Amazon CloudWatch User Guide.
   *
   * @see http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
   */
  readonly schedule: Schedule;

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
   * The environment variables to pass to the container.
   *
   * @default none
   */
  readonly environment?: { [key: string]: string };

  /**
   * The secret to expose to the container as an environment variable.
   *
   * @default - No secret environment variables.
   */
  readonly secrets?: { [key: string]: Secret };

  /**
   * The log driver to use.
   *
   * @default - AwsLogDriver if enableLogging is true
   */
  readonly logDriver?: LogDriver;
}

/**
 * The base class for ScheduledEc2Task and ScheduledFargateTask tasks.
 */
export abstract class ScheduledTaskBase extends Construct {
  /**
   * The name of the cluster that hosts the service.
   */
  public readonly cluster: ICluster;
  /**
   * The desired number of instantiations of the task definition to keep running on the service.
   */
  public readonly desiredTaskCount: number;
  public readonly eventRule: Rule;
  /**
   * The AwsLogDriver to use for logging if logging is enabled.
   */
  public readonly logDriver?: LogDriver;

  /**
   * Constructs a new instance of the ScheduledTaskBase class.
   */
  constructor(scope: Construct, id: string, props: ScheduledTaskBaseProps) {
    super(scope, id);

    this.cluster = props.cluster || this.getDefaultCluster(this, props.vpc);
    this.desiredTaskCount = props.desiredTaskCount || 1;

    // An EventRule that describes the event trigger (in this case a scheduled run)
    this.eventRule = new Rule(this, 'ScheduledEventRule', {
      schedule: props.schedule,
    });

    this.logDriver = props.logDriver !== undefined
                        ? props.logDriver
                        : this.createAWSLogDriver(this.node.id);
  }

  /**
   * Create an ECS task using the task definition provided and add it to the scheduled event rule.
   *
   * @param taskDefinition the TaskDefinition to add to the event rule
   */
  protected addTaskDefinitionToEventTarget(taskDefinition: TaskDefinition): EcsTask {
    // Use the EcsTask as the target of the EventRule
    const eventRuleTarget = new EcsTask( {
      cluster: this.cluster,
      taskDefinition,
      taskCount: this.desiredTaskCount
    });

    this.eventRule.addTarget(eventRuleTarget);

    return eventRuleTarget;
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
  protected createAWSLogDriver(prefix: string): AwsLogDriver {
    return new AwsLogDriver({ streamPrefix: prefix });
  }
}
