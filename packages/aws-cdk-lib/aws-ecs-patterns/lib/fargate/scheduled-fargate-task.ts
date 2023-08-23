import { Construct } from 'constructs';
import { FargateTaskDefinition } from '../../../aws-ecs';
import { EcsTask } from '../../../aws-events-targets';
import { Annotations } from '../../../core';
import { FargateServiceBaseProps } from '../base/fargate-service-base';
import { ScheduledTaskBase, ScheduledTaskBaseProps, ScheduledTaskImageProps } from '../base/scheduled-task-base';

/**
 * The properties for the ScheduledFargateTask task.
 */
export interface ScheduledFargateTaskProps extends ScheduledTaskBaseProps, FargateServiceBaseProps {
  /**
   * The properties to define if using an existing TaskDefinition in this construct.
   * ScheduledFargateTaskDefinitionOptions or ScheduledFargateTaskImageOptions must be defined, but not both.
   *
   * @default none
   */
  readonly scheduledFargateTaskDefinitionOptions?: ScheduledFargateTaskDefinitionOptions;

  /**
   * The properties to define if the construct is to create a TaskDefinition.
   * ScheduledFargateTaskDefinitionOptions or ScheduledFargateTaskImageOptions must be defined, but not both.
   *
   * @default none
   */
  readonly scheduledFargateTaskImageOptions?: ScheduledFargateTaskImageOptions;
}

/**
 * The properties for the ScheduledFargateTask using an image.
 */
export interface ScheduledFargateTaskImageOptions extends ScheduledTaskImageProps, FargateServiceBaseProps {

}

/**
 * The properties for the ScheduledFargateTask using a task definition.
 */
export interface ScheduledFargateTaskDefinitionOptions {
  /**
   * The task definition to use for tasks in the service. Image or taskDefinition must be specified, but not both.
   *
   * [disable-awslint:ref-via-interface]
   *
   * @default - none
   */
  readonly taskDefinition: FargateTaskDefinition;
}

/**
 * A scheduled Fargate task that will be initiated off of CloudWatch Events.
 */
export class ScheduledFargateTask extends ScheduledTaskBase {
  /**
   * The Fargate task definition in this construct.
   */
  public readonly taskDefinition: FargateTaskDefinition;

  /**
   * The ECS task in this construct.
   */
  public readonly task: EcsTask;

  /**
   * Constructs a new instance of the ScheduledFargateTask class.
   */
  constructor(scope: Construct, id: string, props: ScheduledFargateTaskProps) {
    super(scope, id, props);

    if (props.scheduledFargateTaskDefinitionOptions && props.scheduledFargateTaskImageOptions) {
      throw new Error('You must specify either a scheduledFargateTaskDefinitionOptions or scheduledFargateTaskOptions, not both.');
    } else if (props.scheduledFargateTaskDefinitionOptions) {
      this.taskDefinition = props.scheduledFargateTaskDefinitionOptions.taskDefinition;
    } else if (props.scheduledFargateTaskImageOptions) {
      const taskImageOptions = props.scheduledFargateTaskImageOptions;
      this.taskDefinition = new FargateTaskDefinition(this, 'ScheduledTaskDef', {
        memoryLimitMiB: taskImageOptions.memoryLimitMiB || 512,
        cpu: taskImageOptions.cpu || 256,
      });
      this.taskDefinition.addContainer('ScheduledContainer', {
        image: taskImageOptions.image,
        command: taskImageOptions.command,
        environment: taskImageOptions.environment,
        secrets: taskImageOptions.secrets,
        logging: taskImageOptions.logDriver ?? this.createAWSLogDriver(this.node.id),
      });
    } else {
      throw new Error('You must specify one of: taskDefinition or image');
    }

    if (props.taskDefinition) {
      Annotations.of(this).addWarningV2('@aws-cdk/aws-ecs-patterns:propertyIgnored', 'Property \'taskDefinition\' is ignored, use \'scheduledFargateTaskDefinitionOptions\' or \'scheduledFargateTaskImageOptions\' instead.');
    }
    if (props.cpu) {
      Annotations.of(this).addWarningV2('@aws-cdk/aws-ecs-patterns:propertyIgnored', 'Property \'cpu\' is ignored, use \'scheduledFargateTaskImageOptions.cpu\' instead.');
    }
    if (props.memoryLimitMiB) {
      Annotations.of(this).addWarningV2('@aws-cdk/aws-ecs-patterns:propertyIgnored', 'Property \'memoryLimitMiB\' is ignored, use \'scheduledFargateTaskImageOptions.memoryLimitMiB\' instead.');
    }
    if (props.runtimePlatform) {
      Annotations.of(this).addWarningV2('@aws-cdk/aws-ecs-patterns:propertyIgnored', 'Property \'runtimePlatform\' is ignored.');
    }

    // Use the EcsTask as the target of the EventRule
    this.task = new EcsTask( {
      cluster: this.cluster,
      taskDefinition: this.taskDefinition,
      taskCount: this.desiredTaskCount,
      subnetSelection: this.subnetSelection,
      platformVersion: props.platformVersion,
      securityGroups: props.securityGroups,
      propagateTags: props.propagateTags,
      tags: props.tags,
    });

    this.addTaskAsTarget(this.task);
  }
}
