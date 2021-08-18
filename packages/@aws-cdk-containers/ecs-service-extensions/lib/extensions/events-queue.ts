import * as ecs from '@aws-cdk/aws-ecs';
import * as sns from '@aws-cdk/aws-sns';
import * as subscription from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { Service } from '../service';
import { Container } from './container';
import { ContainerMutatingHook, ServiceExtension } from './extension-interfaces';

// Keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * The settings for the EventsQueue extension.
 */
export interface EventsQueueProps {
  /**
   * The list of topic subscriptions for this service.
   *
   * @default none
   */
  readonly topicSubscriptions?: TopicSubscriptionProps[];

  /**
   * The user-provided default queue for this service.
   * If the `eventsQueue` is not provided, a default SQS Queue is created for the service.
   *
   * @default none
   */
  readonly eventsQueue?: sqs.IQueue;
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
   * The user-provided queue to subscribe to the given topic.
   * If the `queue` is not provided, the default `eventsQueue` will subscribe to the given topic.
   *
   * @default none
   */
  readonly queue?: sqs.IQueue;
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
 * This extension creates a default `eventsQueue` for the service (if not provided) and accepts a list of SNS Topics
 * that the `eventsQueue` subscribes to. It creates the topic subscriptions and sets up permissions
 * for the service to consume messages from the SQS Queues.
 *
 * The created subscriptions can be accessed using `subscriptions` field of the extension and the
 * default queue for this service can be accessed using the getter `<extension>.eventsQueue`.
 */
export class EventsQueue extends ServiceExtension {
  /** The subscriptions created by the extension.
   * @default undefined
   */
  public readonly subscriptions: Subscription[] = [];

  private _eventsQueue!: sqs.IQueue;

  private environment: { [key: string]: string } = {};

  private deadLetterQueues: sqs.IQueue[] = [];

  private props?: EventsQueueProps;

  constructor(props?: EventsQueueProps) {
    super('events-queue');

    this.props = props;
  }

  /**
   * This hook creates (if required) and sets the default queue `eventsQueue` and other topic-specific queues
   * according to the provided `topicSubscriptions`. It creates SNS Subscriptions for the topics and also adds the
   * queue URLs to the environment.
   * @param service The parent service which this extension has been added to
   * @param scope The scope that this extension should create resources in
   */
  public prehook(service: Service, scope: Construct) {
    this.parentService = service;
    this.scope = scope;

    if (this.props?.eventsQueue) {
      this._eventsQueue = this.props.eventsQueue;
    } else {
      const deadLetterQueue = new sqs.Queue(this.scope, 'EventsDeadLetterQueue', {
        retentionPeriod: cdk.Duration.days(14),
      });
      this.deadLetterQueues.push(deadLetterQueue);

      this._eventsQueue = new sqs.Queue(this.scope, 'EventsQueue', {
        deadLetterQueue: {
          queue: deadLetterQueue,
          maxReceiveCount: 3,
        },
      });
    }
    this.environment[`${this.parentService.id.toUpperCase()}_QUEUE_URI`] = this._eventsQueue.queueUrl;

    if (this.props?.topicSubscriptions) {
      this.addTopicSubscriptions(this.props.topicSubscriptions);
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
    if (this.props?.topicSubscriptions) {
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

  /**
   * This is a helper method that creates a SNS Subscription for a topic and the queue that subscribes to it.
   * It also adds the subscription info to the `subscriptions` of the extension class.
   * @param topicSubscriptions List of TopicSubscriptions
   */
  private addTopicSubscriptions(topicSubscriptions: TopicSubscriptionProps[]) {
    // `eventsQueueSubscriptions` collects all the SNS Topics that subscribe to the `eventsQueue`
    const eventsQueueSubscriptions = [];

    // If the `topicSubscription` contains a queue, we set up a subscription using the user-provided queue otherwise we
    // add the topic to the `eventsQueueSubscriptions`
    for (const topicSubscription of topicSubscriptions) {
      if (topicSubscription.queue) {
        const topicName = topicSubscription.topic.node.id;
        this.environment[`${this.parentService.id.toUpperCase()}_${topicName.toUpperCase()}_QUEUE_URI`] = topicSubscription.queue.queueUrl;

        topicSubscription.topic.addSubscription(new subscription.SqsSubscription(topicSubscription.queue));
        this.subscriptions?.push({
          topics: [topicSubscription.topic],
          subscriptionQueue: topicSubscription.queue,
        });
      } else {
        topicSubscription.topic.addSubscription(new subscription.SqsSubscription(this._eventsQueue));
        eventsQueueSubscriptions.push(topicSubscription.topic);
      }
    }
    // Finally adding the subscription with all eventsQueue-subscribed topics and the `eventsQueue`
    this.subscriptions?.push({
      topics: eventsQueueSubscriptions,
      subscriptionQueue: this._eventsQueue,
    });
  }

  public get eventsQueue() : sqs.IQueue {
    return this._eventsQueue;
  }
}