import ecs = require('@aws-cdk/aws-ecs');
import events = require('@aws-cdk/aws-events');
import eventsTargets = require('@aws-cdk/aws-events-targets');
import cdk = require('@aws-cdk/core');

export interface ScheduledEc2TaskProps {
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
   * The minimum number of CPU units to reserve for the container.
   *
   * @default none
   */
  readonly cpu?: number;

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

  /**
   * The hard limit (in MiB) of memory to present to the container.
   *
   * If your container attempts to exceed the allocated memory, the container
   * is terminated.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required for non-Fargate services.
   *
   * @default - No memory limit.
   */
  readonly memoryLimitMiB?: number;

  /**
   * The soft limit (in MiB) of memory to reserve for the container.
   *
   * When system memory is under contention, Docker attempts to keep the
   * container memory within the limit. If the container requires more memory,
   * it can consume up to the value specified by the Memory property or all of
   * the available memory on the container instance—whichever comes first.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required for non-Fargate services.
   *
   * @default - No memory reserved.
   */
  readonly memoryReservationMiB?: number;
}

/**
 * A scheduled Ec2 task that will be initiated off of cloudwatch events.
 */
export class ScheduledEc2Task extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: ScheduledEc2TaskProps) {
    super(scope, id);

    // Create a Task Definition for the container to start, also creates a log driver
    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'ScheduledTaskDef');
    taskDefinition.addContainer('ScheduledContainer', {
      image: props.image,
      memoryLimitMiB: props.memoryLimitMiB,
      memoryReservationMiB: props.memoryReservationMiB,
      cpu: props.cpu,
      command: props.command,
      environment: props.environment,
      logging: new ecs.AwsLogDriver({ streamPrefix: this.node.id })
    });

    // Use Ec2TaskEventRuleTarget as the target of the EventRule
    const eventRuleTarget = new eventsTargets.EcsTask( {
      cluster: props.cluster,
      taskDefinition,
      taskCount: props.desiredTaskCount
    });

    // An EventRule that describes the event trigger (in this case a scheduled run)
    const eventRule = new events.Rule(this, 'ScheduledEventRule', {
      schedule: props.schedule,
    });
    eventRule.addTarget(eventRuleTarget);
  }
}
