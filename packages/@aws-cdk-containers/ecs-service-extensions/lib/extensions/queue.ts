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
 * An interface that will be implemented by all the resources that can be subscribed to.
 */
export interface ISubscribable {
  /**
   * All classes implementing this interface must also implement the `subscribe()` method
   */
  subscribe(extension: QueueExtension): sqs.IQueue;
}

/**
 * The settings for the Queue extension.
 */
export interface QueueExtensionProps {
  /**
   * The list of subscriptions for this service.
   *
   * @default none
   */
  readonly subscriptions?: ISubscribable[];

  /**
   * The user-provided default queue for this service.
   *
   * @default If the `eventsQueue` is not provided, a default SQS Queue is created for the service.
   */
  readonly eventsQueue?: sqs.IQueue;
}

/**
 * The topic-specific settings for creating the queue subscriptions.
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
 * The `TopicSubscription` class represents an SNS Topic resource that can be subscribed to by the service queues.
 */
export class TopicSubscription implements ISubscribable {
  public readonly topic: sns.ITopic;

  public readonly queue?: sqs.IQueue;

  constructor(props: TopicSubscriptionProps) {
    this.topic = props.topic;
    this.queue = props.queue;
  }

  /**
   * This method sets up SNS Topic subscriptions for the SQS queue provided by the user. If a `queue` is not provided,
   * the default `eventsQueue` subscribes to the given topic.
   *
   * @param extension `QueueExtension` added to the service
   * @returns the queue subscribed to the given topic
   */
  public subscribe(extension: QueueExtension) : sqs.IQueue {
    let queue = extension.eventsQueue;
    if (this.queue) {
      queue = this.queue;
    }
    this.topic.addSubscription(new subscription.SqsSubscription(queue));
    return queue;
  }
}

/**
 * Settings for the hook which mutates the application container
 * to add the events queue URI to its environment.
 */
interface ContainerMutatingProps {
  /**
   * The events queue name and URI to be added to the container environment.
   */
  readonly environment: { [key: string]: string };
}

/**
 * This hook modifies the application container's environment to
 * add the queue URL for the events queue of the service.
 */
class QueueExtensionMutatingHook extends ContainerMutatingHook {
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
 * This extension creates a default `eventsQueue` for the service (if not provided) and accepts a list of objects of
 * type `ISubscribable` that the `eventsQueue` subscribes to. It creates the subscriptions and sets up permissions
 * for the service to consume messages from the SQS Queues.
 *
 * The default queue for this service can be accessed using the getter `<extension>.eventsQueue`.
 */
export class QueueExtension extends ServiceExtension {
  private _eventsQueue!: sqs.IQueue;

  private subscriptionQueues = new Set<sqs.IQueue>();

  private environment: { [key: string]: string } = {};

  private props?: QueueExtensionProps;

  constructor(props?: QueueExtensionProps) {
    super('queue');

    this.props = props;
  }

  /**
   * This hook creates (if required) and sets the default queue `eventsQueue`. It also sets up the subscriptions for
   * the provided `ISubscribable` objects.
   *
   * @param service The parent service which this extension has been added to
   * @param scope The scope that this extension should create resources in
   */
  public prehook(service: Service, scope: Construct) {
    this.parentService = service;
    this.scope = scope;

    let eventsQueue = this.props?.eventsQueue;
    if (!eventsQueue) {
      const deadLetterQueue = new sqs.Queue(this.scope, 'EventsDeadLetterQueue', {
        retentionPeriod: cdk.Duration.days(14),
      });

      eventsQueue = new sqs.Queue(this.scope, 'EventsQueue', {
        deadLetterQueue: {
          queue: deadLetterQueue,
          maxReceiveCount: 3,
        },
      });
    }
    this._eventsQueue = eventsQueue;

    this.environment[`${this.parentService.id.toUpperCase()}_QUEUE_URI`] = this._eventsQueue.queueUrl;

    if (this.props?.subscriptions) {
      for (const subs of this.props.subscriptions) {
        const subsQueue = subs.subscribe(this);
        this.subscriptionQueues.add(subsQueue);
      }
    }
  }

  /**
   * Add hooks to the main application extension so that it is modified to
   * add the events queue URL to the container environment.
   */
  public addHooks() {
    const container = this.parentService.serviceDescription.get('service-container') as Container;

    if (!container) {
      throw new Error('Queue Extension requires an application extension');
    }

    container.addContainerMutatingHook(new QueueExtensionMutatingHook({
      environment: this.environment,
    }));
  }

  /**
   * After the task definition has been created, this hook grants SQS permissions to the task role.
   *
   * @param taskDefinition The created task definition
   */
  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    this._eventsQueue.grantConsumeMessages(taskDefinition.taskRole);
    for (const queue of this.subscriptionQueues) {
      queue.grantConsumeMessages(taskDefinition.taskRole);
    }
  }

  public get eventsQueue() : sqs.IQueue {
    return this._eventsQueue;
  }
}