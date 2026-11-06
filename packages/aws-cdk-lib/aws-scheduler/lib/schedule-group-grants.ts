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
    const actions = ['scheduler:GetSchedule', 'scheduler:ListSchedules'];
    return iam.Grant.addToPrincipal({
      actions: actions,
      grantee: grantee,
      resourceArns: [this.arnForScheduleInGroup('*')],
    });
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