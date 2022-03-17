import * as path from 'path';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as events_targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as sns from '@aws-cdk/aws-sns';
import * as subscription from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Service } from '../../service';
import { Container } from '../container';
import { ContainerMutatingHook, ServiceExtension } from '../extension-interfaces';

/**
 * An interface that will be implemented by all the resources that can be subscribed to.
 */
export interface ISubscribable {
  /**
   * The `SubscriptionQueue` object for the `ISubscribable` object.
   *
   * @default none
   */
  readonly subscriptionQueue?: SubscriptionQueue;

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
   * If the `eventsQueue` is not provided, a default SQS Queue is created for the service.
   *
   * @default none
   */
  readonly eventsQueue?: sqs.IQueue;

  /**
   * The user-provided queue delay fields to configure auto scaling for the default queue.
   *
   * @default none
   */
  readonly scaleOnLatency?: QueueAutoScalingOptions;
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
   *
   * @default none
   * @deprecated use `topicSubscriptionQueue`
   */
  readonly queue?: sqs.IQueue;

  /**
   * The object representing topic-specific queue and corresponding queue delay fields to configure auto scaling.
   * If not provided, the default `eventsQueue` will subscribe to the given topic.
   *
   * @default none
   */
  readonly topicSubscriptionQueue?: SubscriptionQueue;
}

/**
 * `SubscriptionQueue` represents the subscription queue object which includes the topic-specific queue and its
 * corresponding auto scaling fields.
 */
interface SubscriptionQueue {
  /**
   * The user-provided queue to subscribe to the given topic.
   */
  readonly queue: sqs.IQueue;

  /**
   * The user-provided queue delay fields to configure auto scaling for the topic-specific queue.
   *
   * @default none
   */
  readonly scaleOnLatency?: QueueAutoScalingOptions;
}

/**
 * Options for configuring SQS Queue auto scaling.
 */
interface QueueAutoScalingOptions {
  /**
   * Average amount of time for processing a single message in the queue.
   */
  readonly messageProcessingTime: cdk.Duration;

  /**
   * Acceptable amount of time a message can sit in the queue (including the time required to process it).
   */
  readonly acceptableLatency: cdk.Duration;
}

/**
 * The `TopicSubscription` class represents an SNS Topic resource that can be subscribed to by the service queues.
 */
export class TopicSubscription implements ISubscribable {
  public readonly topic: sns.ITopic;

  /**
   * The queue that subscribes to the given topic.
   *
   * @default none
   * @deprecated use `subscriptionQueue`
   */
  public readonly queue?: sqs.IQueue;

  /**
   * The subscription queue object for this subscription.
   *
   * @default none
   */
  public readonly subscriptionQueue?: SubscriptionQueue;

  constructor(props: TopicSubscriptionProps) {
    this.topic = props.topic;

    if (props.topicSubscriptionQueue && props.queue) {
      throw Error('Either provide the `subscriptionQueue` or the `queue` (deprecated) for the topic subscription, but not both.');
    }
    this.subscriptionQueue = props.topicSubscriptionQueue;
    this.queue = props.queue ?? props.topicSubscriptionQueue?.queue;
  }

  /**
   * This method sets up SNS Topic subscriptions for the SQS queue provided by the user. If a `queue` is not provided,
   * the default `eventsQueue` subscribes to the given topic.
   *
   * @param extension `QueueExtension` added to the service
   * @returns the queue subscribed to the given topic
   */
  public subscribe(extension: QueueExtension) : sqs.IQueue {
    const queue = this.subscriptionQueue?.queue ?? this.queue ?? extension.eventsQueue;
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
 * It also configures a target tracking scaling policy for the service to maintain an acceptable queue latency by tracking
 * the backlog per task. For more information, please refer: https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html .
 *
 * The default queue for this service can be accessed using the getter `<extension>.eventsQueue`.
 */
export class QueueExtension extends ServiceExtension {
  private _eventsQueue!: sqs.IQueue;

  private _autoscalingOptions?: QueueAutoScalingOptions;

  private subscriptionQueues = new Set<SubscriptionQueue>();

  private environment: { [key: string]: string } = {};

  private props?: QueueExtensionProps;

  /**
   * The log group created by the extension where the AWS Lambda function logs are stored.
   */
  public logGroup?: logs.ILogGroup;

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
    this._autoscalingOptions = this.props?.scaleOnLatency;

    this.environment[`${this.parentService.id.toUpperCase()}_QUEUE_URI`] = this._eventsQueue.queueUrl;

    if (this.props?.subscriptions) {
      for (const subs of this.props.subscriptions) {
        const subsQueue = subs.subscribe(this);
        if (subsQueue !== this._eventsQueue) {
          if (subs.subscriptionQueue?.scaleOnLatency && !this._autoscalingOptions) {
            throw Error(`Autoscaling for a topic-specific queue cannot be configured as autoscaling based on SQS Queues hasn’t been set up for the service '${this.parentService.id}'. If you want to enable autoscaling for this service, please also specify 'scaleOnLatency' in the 'QueueExtension'.`);
          }
          const subscriptionQueue = subs.subscriptionQueue ?? {
            queue: subsQueue,
          } as SubscriptionQueue;
          this.subscriptionQueues.add(subscriptionQueue);
        }
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
    for (const subsQueue of this.subscriptionQueues) {
      subsQueue.queue.grantConsumeMessages(taskDefinition.taskRole);
    }
  }

  /**
   * When this hook is implemented by extension, it allows the extension
   * to use the service which has been created. It is used to add target tracking
   * scaling policies for the SQS Queues of the service. It also creates an AWS Lambda
   * Function for calculating the backlog per task metric.
   *
   * @param service - The generated service.
   */
  public useService(service: ecs.Ec2Service | ecs.FargateService) {
    if (!this._autoscalingOptions) {
      return;
    }
    if (!this.parentService.scalableTaskCount) {
      throw Error(`Auto scaling target for the service '${this.parentService.id}' hasn't been configured. Please use Service construct to configure 'minTaskCount' and 'maxTaskCount'.`);
    }

    this.addQueueScalingPolicy(this._eventsQueue, this._autoscalingOptions);
    for (const subsQueue of this.subscriptionQueues) {
      const autoscalingOpts = subsQueue.scaleOnLatency ?? this._autoscalingOptions;
      this.addQueueScalingPolicy(subsQueue.queue, autoscalingOpts!);
    }
    this.parentService.enableAutoScalingPolicy();

    this.createLambdaFunction(service);
  }

  /**
   * This method adds a target tracking policy based on the backlog per task custom metric
   * to the auto scaling target configured for this service.
   *
   * @param queue The queue for which backlog per task metric is being configured
   * @param queueDelay The auto scaling options for the queue
   */
  private addQueueScalingPolicy(queue: sqs.IQueue, queueDelay: QueueAutoScalingOptions) {
    const messageProcessingTime = queueDelay.messageProcessingTime.toSeconds();
    const acceptableLatency = queueDelay.acceptableLatency.toSeconds();
    if (messageProcessingTime > acceptableLatency) {
      throw Error(`Message processing time (${messageProcessingTime}s) for the queue cannot be greater acceptable queue latency (${acceptableLatency}s).`);
    }
    const acceptableBacklog = acceptableLatency/messageProcessingTime;

    this.parentService.scalableTaskCount?.scaleToTrackCustomMetric(`${queue.node.id}-autoscaling-policy`, {
      metric: new cloudwatch.Metric({
        namespace: `${this.parentService.environment.id}-${this.parentService.id}`,
        metricName: 'BacklogPerTask',
        dimensionsMap: { QueueName: queue.queueName },
        unit: cloudwatch.Unit.COUNT,
      }),
      targetValue: acceptableBacklog,
    });
  }

  /**
   * This method is used to create the AWS Lambda Function for calculating backlog
   * per task metric and a Cloudwatch event trigger for this function.
   *
   * @param service - The generated service.
   */
  private createLambdaFunction(service: ecs.Ec2Service | ecs.FargateService) {
    const queueNames = [this._eventsQueue.queueName];
    this.subscriptionQueues.forEach(subs => queueNames.push(subs.queue.queueName));

    const backLogPerTaskCalculator = new lambda.Function(this.scope, 'BackLogPerTaskCalculatorFunction', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      handler: 'index.queue_handler',
      environment: {
        CLUSTER_NAME: this.parentService.cluster.clusterName,
        SERVICE_NAME: service.serviceName,
        NAMESPACE: `${this.parentService.environment.id}-${this.parentService.id}`,
        QUEUE_NAMES: queueNames.join(','),
      },
      initialPolicy: [new iam.PolicyStatement({
        actions: ['ecs:DescribeServices'],
        resources: [`${service.serviceArn}`],
        conditions: {
          ArnEquals: {
            'ecs:cluster': this.parentService.cluster.clusterArn,
          },
        },
      })],
    });

    const queueArns = [this._eventsQueue.queueArn];
    this.subscriptionQueues.forEach(subs => queueArns.push(subs.queue.queueArn));
    backLogPerTaskCalculator.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        'sqs:GetQueueAttributes',
        'sqs:GetQueueUrl',
      ],
      resources: queueArns,
    }));

    new events.Rule(this.scope, 'BacklogPerTaskScheduledRule', {
      schedule: events.Schedule.rate(cdk.Duration.seconds(60)),
      targets: [new events_targets.LambdaFunction(backLogPerTaskCalculator)],
    });

    this.logGroup = new logs.LogGroup(this.scope, `${this.parentService.id}-BackLogPerTaskCalculatorLogs`, {
      logGroupName: `/aws/lambda/${backLogPerTaskCalculator.functionName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.THREE_DAYS,
    });
  }

  public get eventsQueue() : sqs.IQueue {
    return this._eventsQueue;
  }

  public get autoscalingOptions() : QueueAutoScalingOptions | undefined {
    return this._autoscalingOptions;
  }
}
