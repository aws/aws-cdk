import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';
import { integrationResourceArn } from '../private/task-utils';

export enum ActionAfterCompletion {
  NONE = 'NONE',
  DELETE = 'DELETE',
}

/**
 * Properties for creating an AWS EventBridge Scheduler schedule
 */
export interface CreateScheduleProps extends sfn.TaskStateBaseProps {
  /**
   * Schedule name
   */
  readonly scheduleName: string;

  /**
   * Specifies the action that EventBridge Scheduler applies to the schedule after the schedule completes invoking the target.
   *
   * @default ActionAfterCompletion.NONE
   */
  readonly actionAfterCompletion?: ActionAfterCompletion;

  /**
   * Schedule group name
   *
   * @default 'Default'
   */
  readonly scheduleGroupName?: string;
}

/**
 * Create a new AWS EventBridge Scheduler schedule
 *
 * @see https://docs.aws.amazon.com/scheduler/latest/APIReference/API_CreateSchedule.html
 */
export class CreateSchedule extends sfn.TaskStateBase {

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: CreateScheduleProps) {
    super(scope, id, props);

    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;
    this.taskPolicies = [new iam.PolicyStatement({
      resources: [
        Stack.of(this).formatArn({
          service: 'scheduler',
          resource: 'schedule',
          resourceName: `${this.props.scheduleGroupName ?? 'default'}/${this.props.scheduleName}`,
        }),
      ],
      actions: [
        'scheduler:CreateSchedule',
      ],
    })];
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('aws-sdk:scheduler', 'createSchedule', this.integrationPattern),
      Parameters: {
        ActionAfterCompletion: 'NONE',
        Name: this.props.scheduleName,
        GroupName: this.props.scheduleGroupName,
      },
    };
  }
}