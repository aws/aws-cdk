import * as ecs from '@aws-cdk/aws-ecs';
import * as sns from '@aws-cdk/aws-sns';
import * as subscription from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { Service } from '../service';
import { Container } from './container';
import { ContainerMutatingHook, ServiceExtension } from './extension-interfaces';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * The settings for the subscribe extension.
 */
export interface SubscribeProps {
  /**
   * The list of topic subscriptions for this service.
   *
   * @default none
   */
  readonly topicSubscriptions?: TopicSubscriptionProps[];

  /**
   * The props for creating the default queue for this service.
   * Please provide either the `eventsQueueProps` or the `eventsQueue`, but not both.
   *
   * @default none
   */
  readonly eventsQueueProps?: sqs.QueueProps;

  /**
   * The user-provided default queue for this service.
   * Please provide either the `eventsQueueProps` or the `eventsQueue`, but not both.
   *
   * @default none
   */
  readonly eventsQueue?: sqs.IQueue;

  /**
   * The props for the default Dead Letter Queue.
   *
   * @default none
   */
  readonly eventsDeadLetterQueueProps?: DeadLetterQueueProps;
}

/**
 * The topic-specific settings for creating the subscription queues.
 */
export interface TopicSubscriptionProps {
  /**
   * The SNS Topic to subscribe to.
   */
  readonly topic: sns.ITopic;

  /**
   * The props for creating a queue that will subscribe to the given topic.
   * Please provide either the `queueProps` or the `queue`, but not both.
   *
   * @default none
   */
  readonly queueProps?: sqs.QueueProps;

  /**
   * The user-provided queue to subscribe to the given topic.
   * Please provide either the `queueProps` or the `queue`, but not both.
   *
   * @default none
   */
  readonly queue?: sqs.IQueue;

  /**
   * The props for the Dead Letter Queue for the topic-queue.
   *
   * @default none
   */
  readonly deadLetterQueueProps?: DeadLetterQueueProps;
}

/**
 * The settings for creating a Dead Letter Queue.
 */
export interface DeadLetterQueueProps {
  /**
   * The maximum number of times that a message can be received by consumers.
   * When this value is exceeded for a message the message will be automatically sent to the Dead Letter Queue.
   *
   * @default 3
   */
  readonly maxReceiveCount?: number;

  /**
   * The number of seconds that Dead Letter Queue retains a message.
   *
   * @default Duration.days(14)
   */
  readonly retentionPeriod?: cdk.Duration;

}

/**
 * A structure to record the subscriptions created by the extension.
 */
export interface Subscription {
  /**
   * The list of topics that the `subscriptionQueue` is subscribed to.
   */
  readonly topics: sns.ITopic[];

  /**
   * The subscription queue for the list of topics.
   */
  readonly subscriptionQueue: sqs.IQueue;
}

/**
 * Settings for the hook which mutates the application container
 * to add the subscription queue URLs to its environment.
 */
export interface ContainerMutatingProps {
  /**
   * The queue name and URLs to be added to the container environment.
   */
  readonly environment: { [key: string]: string };
}

/**
 * This hook modifies the application container's environment to
 * add the queue URLs for the subscription queues of the service.
 */
export class SubscribeMutatingHook extends ContainerMutatingHook {
  private environment: { [key: string]: string };

  constructor(props: ContainerMutatingProps) {
    super();
    this.environment = props.environment;
  }

  public mutateContainerDefinition(props: ecs.ContainerDefinitionOptions): ecs.ContainerDefinitionOptions {
    return {
      ...props,

      environment: { ...(props.environment || {}), ...this.environment },
    } as ecs.ContainerDefinitionOptions;
  }
}

/**
 * This extension creates a default SQS Queue, `eventsQueue`. It also supports creation of SQS Queue
 * per SNS Topic and sets up the SNS Subscriptions accordingly.
 *
 * The created subscriptions can be accessed using `subscriptions` field and the
 * default queue for this service can be accessed using the getter `<extension>.eventsQueue`.
 */
export class SubscribeExtension extends ServiceExtension {
  /** The subscriptions created by the extension.
   * @default undefined
   */
  public readonly subscriptions?: Subscription[];

  private _eventsQueue!: sqs.IQueue;

  private environment: { [key: string]: string } = {};

  private deadLetterQueues: sqs.IQueue[] = [];

  private props?: SubscribeProps;

  constructor(props?: SubscribeProps) {
    super('subscribe');

    this.props = props;
    if (props?.topicSubscriptions) {
      this.subscriptions = [];
    }

    if (props?.eventsQueue && props?.eventsQueueProps) {
      throw Error('You can only specify either a queue or queue props for creating the default events queue.');
    }
  }

  /**
   * This hook creates and sets the default queue `eventsQueue` and dead letter queue and other topic-specific
   * according to the provided settings. It creates subscriptions for the topics and also adds the queue URLs to the
   * environment.
   * @param service The parent service which this extension has been added to
   * @param scope The scope that this extension should create resources in
   */
  public prehook(service: Service, scope: Construct) {
    this.parentService = service;
    this.scope = scope;

    if (this.props?.eventsQueue) {
      this._eventsQueue = this.props.eventsQueue;
    } else {
      this._eventsQueue = this.createQueues('Events', this.props?.eventsQueueProps, this.props?.eventsDeadLetterQueueProps);
    }
    this.environment[`${this.parentService.id.toUpperCase()}_EVENTS_QUEUE_URL`] = this._eventsQueue.queueUrl;

    if (this.props?.topicSubscriptions) {
      const eventsQueueSubscriptions = [];
      for (const topicSubscription of this.props.topicSubscriptions) {
        const topic = topicSubscription.topic;
        const topicName = topic.node.id;

        if (topicSubscription.queue && topicSubscription.queueProps) {
          throw Error(`You can only specify either a queue or queue props for creating a queue for topic ${topicName}.`);
        }

        if (!topicSubscription.queue && !topicSubscription.queueProps && !topicSubscription.deadLetterQueueProps) {
          topic.addSubscription(new subscription.SqsSubscription(this._eventsQueue));
          eventsQueueSubscriptions.push(topic);
        } else {
          const topicSubscriptionQueue = topicSubscription.queue ??
            this.createQueues(topicName, topicSubscription.queueProps, topicSubscription.deadLetterQueueProps);
          this.environment[`${this.parentService.id.toUpperCase()}_${topicName.toUpperCase()}_QUEUE_URL`] = topicSubscriptionQueue.queueUrl;

          topic.addSubscription(new subscription.SqsSubscription(topicSubscriptionQueue));
          this.subscriptions?.push({
            topics: [topic],
            subscriptionQueue: topicSubscriptionQueue,
          });
        }
      }
      this.subscriptions?.push({
        topics: eventsQueueSubscriptions,
        subscriptionQueue: this._eventsQueue,
      });
    }
  }

  /**
   * Add hooks to the main application extension so that it is modified to
   * add the queue URLs to the container environment.
   */
  public addHooks() {
    const container = this.parentService.serviceDescription.get('service-container') as Container;

    if (!container) {
      throw new Error('Subscribe extension requires an application extension');
    }

    container.addContainerMutatingHook(new SubscribeMutatingHook({
      environment: this.environment,
    }));
  }

  /**
   * After the task definition has been created, this hook grants SQS permissions to the task role.
   *
   * @param taskDefinition The created task definition
   */
  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    if (this.subscriptions) {
      for (const subs of this.subscriptions) {
        subs.subscriptionQueue.grantConsumeMessages(taskDefinition.taskRole);
      }
    } else {
      this._eventsQueue.grantConsumeMessages(taskDefinition.taskRole);
    }

    for (const deadLetterQueue of this.deadLetterQueues) {
      deadLetterQueue.grantConsumeMessages(taskDefinition.taskRole);
    }
  }

  private createQueues(name: string, queueProps?: sqs.QueueProps, deadLetterQueueProps?: DeadLetterQueueProps) : sqs.IQueue {
    if (queueProps?.deadLetterQueue?.queue && deadLetterQueueProps) {
      throw Error(`You can only specify either a Dead Letter Queue or Dead Letter Queue props for creating the ${name}DeadLetterQueue.`);
    }

    const deadLetterQueue = queueProps?.deadLetterQueue ? queueProps?.deadLetterQueue.queue :
      new sqs.Queue(this.scope, `${name}DeadLetterQueue`, {
        retentionPeriod: this.props?.eventsDeadLetterQueueProps?.retentionPeriod || cdk.Duration.days(14),
      });
    this.deadLetterQueues.push(deadLetterQueue);
    const maxReceiveCount = queueProps?.deadLetterQueue?.maxReceiveCount ?? deadLetterQueueProps?.maxReceiveCount ?? 3;

    const queue = new sqs.Queue(this.scope, `${name}Queue`, {
      ...queueProps,
      deadLetterQueue: {
        queue: deadLetterQueue,
        maxReceiveCount: maxReceiveCount,
      },
    });
    return queue;
  }

  public get eventsQueue() : sqs.IQueue {
    return this._eventsQueue;
  }
}