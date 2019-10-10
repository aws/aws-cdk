import { Construct, Resource } from '@aws-cdk/core';
import { CfnSubscription } from './sns.generated';
import { SubscriptionFilter } from './subscription-filter';
import { ITopic } from './topic-base';

/**
 * Options for creating a new subscription
 */
export interface SubscriptionOptions {
  /**
   * What type of subscription to add.
   */
  readonly protocol: SubscriptionProtocol;

  /**
   * The subscription endpoint.
   *
   * The meaning of this value depends on the value for 'protocol'.
   */
  readonly endpoint: string;

  /**
   * true if raw message delivery is enabled for the subscription. Raw messages are free of JSON formatting and can be
   * sent to HTTP/S and Amazon SQS endpoints. For more information, see GetSubscriptionAttributes in the Amazon Simple
   * Notification Service API Reference.
   *
   * @default false
   */
  readonly rawMessageDelivery?: boolean;

  /**
   * The filter policy.
   *
   * @default - all messages are delivered
   */
  readonly filterPolicy?: { [attribute: string]: SubscriptionFilter };
}
/**
 * Properties for creating a new subscription
 */
export interface SubscriptionProps extends SubscriptionOptions {
  /**
   * The topic to subscribe to.
   */
  readonly topic: ITopic;
}

/**
 * A new subscription.
 *
 * Prefer to use the `ITopic.addSubscription()` methods to create instances of
 * this class.
 */
export class Subscription extends Resource {
  private readonly filterPolicy?: { [attribute: string]: any[] };

  constructor(scope: Construct, id: string, props: SubscriptionProps) {
    super(scope, id);

    if (props.rawMessageDelivery && ['http', 'https', 'sqs'].indexOf(props.protocol) < 0) {
      throw new Error('Raw message delivery can only be enabled for HTTP/S and SQS subscriptions.');
    }

    if (props.filterPolicy) {
      if (Object.keys(props.filterPolicy).length > 5) {
        throw new Error('A filter policy can have a maximum of 5 attribute names.');
      }

      this.filterPolicy = Object.entries(props.filterPolicy)
        .reduce(
          (acc, [k, v]) => ({ ...acc, [k]: v.conditions }),
          {}
        );

      let total = 1;
      Object.values(this.filterPolicy).forEach(filter => { total *= filter.length; });
      if (total > 100) {
        throw new Error(`The total combination of values (${total}) must not exceed 100.`);
      }
    }

    new CfnSubscription(this, 'Resource', {
      endpoint: props.endpoint,
      protocol: props.protocol,
      topicArn: props.topic.topicArn,
      rawMessageDelivery: props.rawMessageDelivery,
      filterPolicy: this.filterPolicy,
    });

  }
}

/**
 * The type of subscription, controlling the type of the endpoint parameter.
 */
export enum SubscriptionProtocol {
  /**
   * JSON-encoded message is POSTED to an HTTP url.
   */
  HTTP = 'http',

  /**
   * JSON-encoded message is POSTed to an HTTPS url.
   */
  HTTPS = 'https',

  /**
   * Notifications are sent via email.
   */
  EMAIL = 'email',

  /**
   * Notifications are JSON-encoded and sent via mail.
   */
  EMAIL_JSON = 'email-json',

  /**
   * Notification is delivered by SMS
   */
  SMS = 'sms',

  /**
   * Notifications are enqueued into an SQS queue.
   */
  SQS = 'sqs',

  /**
   * JSON-encoded notifications are sent to a mobile app endpoint.
   */
  APPLICATION = 'application',

  /**
   * Notifications trigger a Lambda function.
   */
  LAMBDA = 'lambda'
}
