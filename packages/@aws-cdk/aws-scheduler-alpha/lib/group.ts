import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnScheduleGroup } from 'aws-cdk-lib/aws-scheduler';
import { Arn, ArnFormat, Aws, IResource, Names, RemovalPolicy, Resource, Stack } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

export interface GroupProps {
  /**
   * The name of the schedule group.
   *
   * Up to 64 letters (uppercase and lowercase), numbers, hyphens, underscores and dots are allowed.
   *
   * @default - A unique name will be generated
   */
  readonly groupName?: string;

  /**
   * The removal policy for the group. If the group is removed also all schedules are removed.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}

export interface IGroup extends IResource {
  /**
   * The name of the schedule group
   *
   * @attribute
   */
  readonly groupName: string;

  /**
   * The arn of the schedule group
   *
   * @attribute
   */
  readonly groupArn: string;

  /**
   * Return the given named metric for this group schedules
   *
   * @default - sum over 5 minutes
   */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the number of invocations that were throttled because it exceeds your service quotas.
   *
   * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/scheduler-quotas.html
   *
   * @default - sum over 5 minutes
   */
  metricThrottled(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for all invocation attempts.
   *
   * @default - sum over 5 minutes
   */
  metricAttempts(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Emitted when the target returns an exception after EventBridge Scheduler calls the target API.
   *
   * @default - sum over 5 minutes
   */
  metricTargetErrors(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for invocation failures due to API throttling by the target.
   *
   * @default - sum over 5 minutes
   */
  metricTargetThrottled(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for dropped invocations when EventBridge Scheduler stops attempting to invoke the target after a schedule's retry policy has been exhausted.
   *
   * @default - sum over 5 minutes
   */
  metricDropped(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for invocations delivered to the DLQ
   *
   * @default - sum over 5 minutes
   */
  metricSentToDLQ(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for failed invocations that also failed to deliver to DLQ.
   *
   * @default - sum over 5 minutes
   */
  metricFailedToBeSentToDLQ(errorCode?: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for delivery of failed invocations to DLQ when the payload of the event sent to the DLQ exceeds the maximum size allowed by Amazon SQS.
   *
   * @default - sum over 5 minutes
   */
  metricSentToDLQTruncated(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Grant the indicated permissions on this group to the given principal
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
  /**
   * Grant list and get schedule permissions for schedules in this group to the given principal
   */
  grantReadSchedules(identity: iam.IGrantable): iam.Grant;
  /**
   * Grant create and update schedule permissions for schedules in this group to the given principal
   */
  grantWriteSchedules(identity: iam.IGrantable): iam.Grant;
  /**
   * Grant delete schedule permission for schedules in this group to the given principal
   */
  grantDeleteSchedules(identity: iam.IGrantable): iam.Grant;
}

abstract class GroupBase extends Resource implements IGroup {
  /**
   * The name of the schedule group
   *
   * @attribute
   */
  public abstract readonly groupName: string;

  /**
   * The arn of the schedule group
   *
   * @attribute
   */
  public abstract readonly groupArn: string;

  /**
   * Return the given named metric for this group schedules
   *
   * @default - sum over 5 minutes
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/Scheduler',
      metricName,
      dimensionsMap: { ScheduleGroup: this.groupName },
      statistic: 'sum',
      ...props,
    }).attachTo(this);
  }

  /**
   * Metric for the number of invocations that were throttled because it exceeds your service quotas.
   *
   * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/scheduler-quotas.html
   *
   * @default - sum over 5 minutes
   */
  public metricThrottled(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('InvocationThrottleCount', props);
  }

  /**
   * Metric for all invocation attempts.
   *
   * @default - sum over 5 minutes
   */
  public metricAttempts(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('InvocationAttemptCount', props);
  }

  /**
   * Emitted when the target returns an exception after EventBridge Scheduler calls the target API.
   *
   * @default - sum over 5 minutes
   */
  public metricTargetErrors(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('TargetErrorCount', props);
  }

  /**
   * Metric for invocation failures due to API throttling by the target.
   *
   * @default - sum over 5 minutes
   */
  public metricTargetThrottled(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('TargetErrorThrottledCount', props);
  }

  /**
   * Metric for dropped invocations when EventBridge Scheduler stops attempting to invoke the target after a schedule's retry policy has been exhausted.
   *
   * @default - sum over 5 minutes
   */
  public metricDropped(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('InvocationDroppedCount', props);
  }

  /**
   * Metric for invocations delivered to the DLQ
   *
   * @default - sum over 5 minutes
   */
  metricSentToDLQ(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('InvocationsSentToDeadLetterCount', props);
  }

  /**
   * Metric for failed invocations that also failed to deliver to DLQ.
   *
   * @default - sum over 5 minutes
   */
  public metricFailedToBeSentToDLQ(errorCode?: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    if (errorCode) {
      return this.metric(`InvocationsFailedToBeSentToDeadLetterCount_${errorCode}`, props);
    }

    return this.metric('InvocationsFailedToBeSentToDeadLetterCount', props);
  }

  /**
   * Metric for delivery of failed invocations to DLQ when the payload of the event sent to the DLQ exceeds the maximum size allowed by Amazon SQS.
   *
   * @default - sum over 5 minutes
   */
  public metricSentToDLQTruncated(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('InvocationsSentToDeadLetterCount_Truncated_MessageSizeExceeded', props);
  }

  /**
   * Grant the indicated permissions on this group to the given principal
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.groupArn],
      scope: this,
    });
  }

  private arnForScheduleInGroup(scheduleName: string): string {
    return Arn.format({
      region: this.env.region,
      account: this.env.account,
      partition: Aws.PARTITION,
      service: 'scheduler',
      resource: 'schedule',
      resourceName: this.groupName + '/' + scheduleName,
    });
  }

  /**
   * Grant list and get schedule permissions for schedules in this group to the given principal
   */
  public grantReadSchedules(identity: iam.IGrantable) {
    return iam.Grant.addToPrincipal({
      grantee: identity,
      actions: ['scheduler:GetSchedule', 'scheduler:ListSchedules'],
      resourceArns: [this.arnForScheduleInGroup('*')],
      scope: this,
    });
  }

  /**
   * Grant create and update schedule permissions for schedules in this group to the given principal
   */
  public grantWriteSchedules(identity: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: identity,
      actions: ['scheduler:CreateSchedule', 'scheduler:UpdateSchedule'],
      resourceArns: [this.arnForScheduleInGroup('*')],
      scope: this,
    });
  }

  /**
   * Grant delete schedule permission for schedules in this group to the given principal
   */
  public grantDeleteSchedules(identity: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: identity,
      actions: ['scheduler:DeleteSchedule'],
      resourceArns: [this.arnForScheduleInGroup('*')],
      scope: this,
    });
  }
}
/**
 * @resource AWS::Scheduler::ScheduleGroup
 */
export class Group extends GroupBase {
  /**
   * Import an external group by ARN.
   *
   * @param scope construct scope
   * @param id construct id
   * @param groupArn the ARN of the group to import (e.g. `arn:aws:scheduler:region:account-id:schedule-group/group-name`)
   */
  public static fromGroupArn(scope: Construct, id: string, groupArn: string): IGroup {
    const arnComponents = Stack.of(scope).splitArn(groupArn, ArnFormat.SLASH_RESOURCE_NAME);
    const groupName = arnComponents.resourceName!;
    class Import extends GroupBase {
      groupName = groupName;
      groupArn = groupArn;
    }
    return new Import(scope, id);
  }

  /**
   * Import a default schedule group.
   *
   * @param scope construct scope
   * @param id construct id
   */
  public static fromDefaultGroup(scope: Construct, id: string): IGroup {
    return Group.fromGroupName(scope, id, 'default');
  }

  /**
   * Import an existing group with a given name.
   *
   * @param scope construct scope
   * @param id construct id
   * @param groupName the name of the existing group to import
   */
  public static fromGroupName(scope: Construct, id: string, groupName: string): IGroup {
    const groupArn = Stack.of(scope).formatArn({
      service: 'scheduler',
      resource: 'schedule-group',
      resourceName: groupName,
    });
    return Group.fromGroupArn(scope, id, groupArn);
  }

  public readonly groupName: string;
  public readonly groupArn: string;

  public constructor(scope: Construct, id: string, props: GroupProps) {
    super(scope, id);

    this.groupName = props.groupName ?? Names.uniqueResourceName(this, {
      maxLength: 64,
      separator: '-',
    });

    const group = new CfnScheduleGroup(this, 'Resource', {
      name: this.groupName,
    });

    group.applyRemovalPolicy(props.removalPolicy);

    this.groupArn = this.getResourceArnAttribute(group.attrArn, {
      service: 'scheduler',
      resource: 'schedule-group',
      resourceName: this.groupName,
    });
  }
}
