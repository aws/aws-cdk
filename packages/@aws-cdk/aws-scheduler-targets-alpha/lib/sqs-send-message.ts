import { ISchedule, IScheduleTarget } from '@aws-cdk/aws-scheduler-alpha';
import { Names } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { sameEnvDimension } from './util';

/**
 * Use an Amazon SQS Queue as a target for AWS EventBridge Scheduler.
 */
export class SqsSendMessage extends ScheduleTargetBase implements IScheduleTarget {
  constructor(
    private readonly queue: sqs.IQueue,
    private readonly props: ScheduleTargetBaseProps,
  ) {
    super(props, queue.queueArn);
  }

  protected addTargetActionToRole(schedule: ISchedule, role: IRole): void {
    if (!sameEnvDimension(this.queue.env.region, schedule.env.region)) {
      throw new Error(`Cannot assign queue in region ${this.queue.env.region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the schedule and the queue must be in the same region.`);
    }

    if (!sameEnvDimension(this.queue.env.account, schedule.env.account)) {
      throw new Error(`Cannot assign queue in account ${this.queue.env.account} to the schedule ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.region}. Both the schedule and the queue must be in the same account.`);
    }

    if (this.props.role && !sameEnvDimension(this.props.role.env.account, this.queue.env.account)) {
      throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to invoke target ${Names.nodeUniqueId(this.queue.node)} in account ${this.queue.env.account}. Both the target and the execution role must be in the same account.`);
    }

    this.queue.grantSendMessages(role);
  }

  // protected bindBaseTargetConfig(_schedule: ISchedule): ScheduleTargetConfig {
  //   const role: iam.IRole = this.baseProps.role ?? this.singletonScheduleRole(_schedule, this.targetArn);
  //   this.addTargetActionToRole(_schedule, role);

  //   if (this.baseProps.deadLetterQueue) {
  //     this.addToDeadLetterQueueResourcePolicy(_schedule, this.baseProps.deadLetterQueue);
  //   }

  //   return {
  //     arn: this.targetArn,
  //     role: role,
  //     deadLetterConfig: this.baseProps.deadLetterQueue ? {
  //       arn: this.baseProps.deadLetterQueue.queueArn,
  //     } : undefined,
  //     retryPolicy: this.renderRetryPolicy(this.baseProps.maxEventAge, this.baseProps.retryAttempts),
  //     input: this.baseProps.input,
  //   };
  // }
}