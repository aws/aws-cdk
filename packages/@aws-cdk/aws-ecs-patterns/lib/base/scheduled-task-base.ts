import ecs = require('@aws-cdk/aws-ecs');
import events = require('@aws-cdk/aws-events');
import eventsTargets = require('@aws-cdk/aws-events-targets');
import cdk = require('@aws-cdk/core');

/**
 * The properties for the base ScheduledEc2Task or ScheduledFargateTask task.
 */
export interface ScheduledTaskBaseProps {
  /**
   * The name of the cluster that hosts the service.
   */
  readonly cluster: ecs.ICluster;

  /**
   * The image used to start a container.
   *
   * This string is passed directly to the Docker daemon.
   * Images in the Docker Hub registry are available by default.
   * Other repositories are specified with either repository-url/image:tag or repository-url/image@digest.
   */
  readonly image: ecs.ContainerImage;

  /**
   * The schedule or rate (frequency) that determines when CloudWatch Events
   * runs the rule. For more information, see Schedule Expression Syntax for
   * Rules in the Amazon CloudWatch User Guide.
   *
   * @see http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
   */
  readonly schedule: events.Schedule;

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
   * Secret environment variables to pass to the container
   *
   * @default - No secret environment variables.
   */
  readonly secrets?: { [key: string]: ecs.Secret };
}

/**
 * The base class for ScheduledEc2Task and ScheduledFargateTask tasks.
 */
export abstract class ScheduledTaskBase extends cdk.Construct {
  /**
   * The name of the cluster that hosts the service.
   */
  public readonly cluster: ecs.ICluster;
  /**
   * The desired number of instantiations of the task definition to keep running on the service.
   */
  public readonly desiredTaskCount: number;
  public readonly eventRule: events.Rule;

  /**
   * Constructs a new instance of the ScheduledTaskBase class.
   */
  constructor(scope: cdk.Construct, id: string, props: ScheduledTaskBaseProps) {
    super(scope, id);

    this.cluster = props.cluster;
    // Determine the desired number of tasks to run
    this.desiredTaskCount = props.desiredTaskCount || 1;

    // An EventRule that describes the event trigger (in this case a scheduled run)
    this.eventRule = new events.Rule(this, 'ScheduledEventRule', {
      schedule: props.schedule,
    });
  }

  /**
   * Create an ecs task using the task definition provided and add it to the scheduled event rule.
   *
   * @param taskDefinition the TaskDefinition to add to the event rule
   */
  protected addTaskDefinitionToEventTarget(taskDefinition: ecs.TaskDefinition): eventsTargets.EcsTask {
    // Use the EcsTask as the target of the EventRule
    const eventRuleTarget = new eventsTargets.EcsTask( {
      cluster: this.cluster,
      taskDefinition,
      taskCount: this.desiredTaskCount
    });

    this.eventRule.addTarget(eventRuleTarget);

    return eventRuleTarget;
  }

  /**
   * Create an AWS Log Driver with the provided streamPrefix
   *
   * @param prefix the Cloudwatch logging prefix
   */
  protected createAWSLogDriver(prefix: string): ecs.AwsLogDriver {
    return new ecs.AwsLogDriver({ streamPrefix: prefix });
  }
}
