import ecs = require('@aws-cdk/aws-ecs');
import { ICluster } from '@aws-cdk/aws-ecs';
import events = require('@aws-cdk/aws-events');
import eventsTargets = require('@aws-cdk/aws-events-targets');
import cdk = require('@aws-cdk/core');

export interface ScheduledTaskBaseProps {
  /**
   * The cluster where your service will be deployed.
   */
  readonly cluster: ecs.ICluster;

  /**
   * The image to start.
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
   * The CMD value to pass to the container. A string with commands delimited by commas.
   *
   * @default none
   */
  readonly command?: string[];

  /**
   * Number of desired copies of running tasks.
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
}

/**
 * A scheduled task base that will be initiated off of cloudwatch events.
 */
export abstract class ScheduledTaskBase extends cdk.Construct {
  public readonly cluster: ICluster;
  public readonly desiredTaskCount: number;
  public readonly eventRule: events.Rule;

  constructor(scope: cdk.Construct, id: string, props: ScheduledTaskBaseProps) {
    super(scope, id);

    this.cluster = props.cluster;
    this.desiredTaskCount = props.desiredTaskCount || 1;

    // An EventRule that describes the event trigger (in this case a scheduled run)
    this.eventRule = new events.Rule(this, 'ScheduledEventRule', {
      schedule: props.schedule,
    });
  }

  /**
   * Create an ecs task using the task definition provided and add it to the scheduled event rule
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
