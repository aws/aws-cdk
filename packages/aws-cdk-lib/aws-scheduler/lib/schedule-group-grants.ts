/* eslint-disable eol-last */
import type * as scheduler from './scheduler.generated';
import * as iam from '../../aws-iam';
import { Arn, Aws } from '../../core';

/**
 * Properties for ScheduleGroupGrants
 */
interface ScheduleGroupGrantsProps {
  /**
   * The resource on which actions will be allowed
   */
  readonly resource: scheduler.IScheduleGroupRef;
}

/**
 * Collection of grant methods for a IScheduleGroupRef
 */
export class ScheduleGroupGrants {
  /**
   * Creates grants for ScheduleGroupGrants
   */
  public static fromScheduleGroup(resource: scheduler.IScheduleGroupRef): ScheduleGroupGrants {
    return new ScheduleGroupGrants({
      resource: resource,
    });
  }

  protected readonly resource: scheduler.IScheduleGroupRef;

  private constructor(props: ScheduleGroupGrantsProps) {
    this.resource = props.resource;
  }

  /**
   * Grant list and get schedule permissions for schedules in this group to the given principal
   */
  public readSchedules(grantee: iam.IGrantable): iam.Grant {
    // `scheduler:GetSchedule` supports resource-level permissions, so scope it to the
    // schedules in this group.
    const grant = iam.Grant.addToPrincipal({
      actions: ['scheduler:GetSchedule'],
      grantee: grantee,
      resourceArns: [this.arnForScheduleInGroup('*')],
    });

    // `scheduler:ListSchedules` does not support resource-level permissions; EventBridge
    // Scheduler authorizes it against `schedule/*/*`, so a group-scoped ARN never matches
    // and the call is denied. It must be granted on `*` to be usable.
    // See https://github.com/aws/aws-cdk/issues/38201
    grant.combine(iam.Grant.addToPrincipal({
      actions: ['scheduler:ListSchedules'],
      grantee: grantee,
      resourceArns: ['*'],
    }));

    return grant;
  }

  /**
   * Grant create and update schedule permissions for schedules in this group to the given principal
   */
  public writeSchedules(grantee: iam.IGrantable): iam.Grant {
    const actions = ['scheduler:CreateSchedule', 'scheduler:UpdateSchedule'];
    return iam.Grant.addToPrincipal({
      actions: actions,
      grantee: grantee,
      resourceArns: [this.arnForScheduleInGroup('*')],
    });
  }

  /**
   * Grant delete schedule permission for schedules in this group to the given principal
   */
  public deleteSchedules(grantee: iam.IGrantable): iam.Grant {
    const actions = ['scheduler:DeleteSchedule'];
    return iam.Grant.addToPrincipal({
      actions: actions,
      grantee: grantee,
      resourceArns: [this.arnForScheduleInGroup('*')],
    });
  }

  private arnForScheduleInGroup(scheduleName: string): string {
    return Arn.format({
      region: this.resource.env.region,
      account: this.resource.env.account,
      partition: Aws.PARTITION,
      service: 'scheduler',
      resource: 'schedule',
      resourceName: this.resource.scheduleGroupRef.scheduleGroupName + '/' + scheduleName,
    });
  }
}