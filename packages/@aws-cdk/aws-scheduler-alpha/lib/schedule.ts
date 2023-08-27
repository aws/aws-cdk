import { IResource, Resource } from 'aws-cdk-lib';
import { CfnSchedule } from 'aws-cdk-lib/aws-scheduler';
import { Construct } from 'constructs';
import { IGroup } from './group';
import { ScheduleExpression } from './schedule-expression';
import { IScheduleTarget } from './target';

/**
 * Interface representing a created or an imported `Schedule`.
 */
export interface ISchedule extends IResource {
  /**
   * The name of the schedule.
   */
  readonly scheduleName: string;
  /**
   * The schedule group associated with this schedule.
   */
  readonly group?: IGroup;
  /**
   * The arn of the schedule.
   */
  readonly scheduleArn: string;
}

/**
 * Construction properties for `Schedule`.
 */
export interface ScheduleProps {
  /**
   * The expression that defines when the schedule runs. Can be either a `at`, `rate`
   * or `cron` expression.
   */
  readonly schedule: ScheduleExpression;

  /**
   * The schedule's target details.
   */
  readonly target: IScheduleTarget;

  /**
   * The name of the schedule.
   *
   * Up to 64 letters (uppercase and lowercase), numbers, hyphens, underscores and dots are allowed.
   *
   * @default - A unique name will be generated
   */
  readonly scheduleName?: string;

  /**
   * The description you specify for the schedule.
   *
   * @default - no value
   */
  readonly description?: string;

  /**
   * The schedule's group.
   *
   * @deafult - By default a schedule will be associated with the `default` group.
   */
  readonly group?: IGroup;
}

/**
 * An EventBridge Schedule
 */
export class Schedule extends Resource implements ISchedule {
  /**
   * The schedule group associated with this schedule.
   */
  public readonly group?: IGroup;
  /**
   * The arn of the schedule.
   */
  public readonly scheduleArn: string;
  /**
   * The name of the schedule.
   */
  public readonly scheduleName: string;

  constructor(scope: Construct, id: string, props: ScheduleProps) {
    super(scope, id, {
      physicalName: props.scheduleName,
    });

    this.group = props.group;

    const targetConfig = props.target.bind(this);

    const resource = new CfnSchedule(this, 'Resource', {
      name: this.physicalName,
      flexibleTimeWindow: { mode: 'OFF' },
      scheduleExpression: props.schedule.expressionString,
      scheduleExpressionTimezone: props.schedule.timeZone?.timezoneName,
      groupName: this.group?.groupName,
      target: {
        arn: targetConfig.arn,
        roleArn: targetConfig.role.roleArn,
        input: targetConfig.input?.bind(this),
        deadLetterConfig: targetConfig.deadLetterConfig,
        retryPolicy: targetConfig.retryPolicy,
        ecsParameters: targetConfig.ecsParameters,
        kinesisParameters: targetConfig.kinesisParameters,
        eventBridgeParameters: targetConfig.eventBridgeParameters,
        sageMakerPipelineParameters: targetConfig.sageMakerPipelineParameters,
        sqsParameters: targetConfig.sqsParameters,
      },
    });

    this.scheduleName = this.getResourceNameAttribute(resource.ref);
    this.scheduleArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'scheduler',
      resource: 'schedule',
      resourceName: `${this.group?.groupName ?? 'default'}/${this.physicalName}`,
    });
  }
}