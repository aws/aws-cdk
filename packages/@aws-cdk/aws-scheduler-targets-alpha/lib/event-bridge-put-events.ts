import { IScheduleTarget, ISchedule, ScheduleTargetInput, ScheduleTargetConfig } from '@aws-cdk/aws-scheduler-alpha';
import { Names } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import { IRole } from 'aws-cdk-lib/aws-iam';
import * as iam from 'aws-cdk-lib/aws-iam';
import { ScheduleTargetBase, ScheduleTargetBaseProps } from './target';
import { sameEnvDimension } from './util';

/**
 * An entry to be sent to EventBridge
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEventsRequestEntry.html
 */
export interface EventBridgePutEventsEntry {
  /**
   * The event body
   *
   * Can either be provided as an object or as a JSON-serialized string
   * @example
   *
   * ScheduleTargetInput.fromText('{"instance-id": "i-1234567890abcdef0", "state": "terminated"}');
   * ScheduleTargetInput.fromObject({ Message: 'Hello from a friendly event :)' });
   */
  readonly detail: ScheduleTargetInput;

  /**
   * Used along with the source field to help identify the fields and values expected in the detail field
   *
   * For example, events by CloudTrail have detail type "AWS API Call via CloudTrail"
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events.html
   */
  readonly detailType: string;

  /**
   * The event bus the entry will be sent to.
   *
   */
  readonly eventBus: events.IEventBus;

  /**
   * The service or application that caused this event to be generated
   *
   * Example value: `com.example.service`
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events.html
   */
  readonly source: string;
}

/**
 * Send an event to an AWS EventBridge by AWS EventBridge Scheduler.
 */
export class EventBridgePutEvents extends ScheduleTargetBase implements IScheduleTarget {

  constructor(
    private readonly entry: EventBridgePutEventsEntry,
    private readonly props: ScheduleTargetBaseProps,
  ) {
    super(props, entry.eventBus.eventBusArn);
    if (this.baseProps.input) {
      throw new Error('ScheduleTargetBaseProps.input is not supported for EventBridgePutEvents. Please use entry.detail instead.');
    }
  }

  protected addTargetActionToRole(schedule: ISchedule, role: IRole): void {
    const eventBus = this.entry.eventBus;
    const eventBusEnv = eventBus.env;
    if (!sameEnvDimension(eventBusEnv.region, schedule.env.region)) {
      throw new Error(`Cannot assign eventBus in region ${eventBusEnv.region} to the schedule ${Names.nodeUniqueId(schedule.node)} in region ${schedule.env.region}. Both the schedule and the eventBus must be in the same region.`);
    }

    if (!sameEnvDimension(eventBusEnv.account, schedule.env.account)) {
      throw new Error(`Cannot assign eventBus in account ${eventBusEnv.account} to the schedule ${Names.nodeUniqueId(schedule.node)} in account ${schedule.env.region}. Both the schedule and the eventBus must be in the same account.`);
    }

    if (this.props.role && !sameEnvDimension(this.props.role.env.account, eventBusEnv.account)) {
      throw new Error(`Cannot grant permission to execution role in account ${this.props.role.env.account} to invoke target ${Names.nodeUniqueId(eventBus.node)} in account ${eventBusEnv.account}. Both the target and the execution role must be in the same account.`);
    }

    eventBus.grantPutEventsTo(role);
  }

  protected bindBaseTargetConfig(_schedule: ISchedule): ScheduleTargetConfig {
    const role: iam.IRole = this.baseProps.role ?? this.singletonScheduleRole(_schedule, this.targetArn);
    this.addTargetActionToRole(_schedule, role);

    if (this.baseProps.deadLetterQueue) {
      this.addToDeadLetterQueueResourcePolicy(_schedule, this.baseProps.deadLetterQueue);
    }

    const { source, detailType, detail } = this.entry;

    return {
      arn: this.targetArn,
      role,
      deadLetterConfig: this.baseProps.deadLetterQueue ? {
        arn: this.baseProps.deadLetterQueue.queueArn,
      } : undefined,
      retryPolicy: this.renderRetryPolicy(this.baseProps.maxEventAge, this.baseProps.retryAttempts),
      input: detail,
      eventBridgeParameters: {
        detailType,
        source,
      },
    };
  }
}
