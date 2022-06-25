import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import { singletonEventRole, addToDeadLetterQueueResourcePolicy } from './util';

/**
 * Configuration properties of an Event Bus event
 *
 * Cannot extend TargetBaseProps. Retry policy is not supported for Event bus targets.
 */
export interface EventBusProps {
  /**
   * Role to be used to publish the event
   *
   * @default a new role is created.
   */
  readonly role?: iam.IRole;

  /**
   * The SQS queue to be used as deadLetterQueue.
   * Check out the [considerations for using a dead-letter queue](https://docs.aws.amazon.com/eventbridge/latest/userguide/rule-dlq.html#dlq-considerations).
   *
   * The events not successfully delivered are automatically retried for a specified period of time,
   * depending on the retry policy of the target.
   * If an event is not delivered before all retry attempts are exhausted, it will be sent to the dead letter queue.
   *
   * @default - no dead-letter queue
   */
  readonly deadLetterQueue?: sqs.IQueue;
}

/**
 * Notify an existing Event Bus of an event
 */
export class EventBus implements events.IRuleTarget {
  constructor(private readonly eventBus: events.IEventBus, private readonly props: EventBusProps = {}) { }

  bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    const role = this.props.role ?? singletonEventRole(rule);
    role.addToPrincipalPolicy(this.putEventStatement());

    if (this.props.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
    }

    return {
      arn: this.eventBus.eventBusArn,
      deadLetterConfig: this.props.deadLetterQueue ? { arn: this.props.deadLetterQueue?.queueArn } : undefined,
      role,
    };
  }

  private putEventStatement() {
    return new iam.PolicyStatement({
      actions: ['events:PutEvents'],
      resources: [this.eventBus.eventBusArn],
    });
  }
}
