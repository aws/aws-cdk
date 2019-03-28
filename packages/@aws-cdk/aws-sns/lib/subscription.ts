import { Construct } from '@aws-cdk/cdk';
import { CfnSubscription } from './sns.generated';
import { ITopic } from './topic-base';

/**
 * Properties for creating a new subscription
 */
export interface SubscriptionProps {
  /**
   * What type of subscription to add.
   */
  readonly protocol: SubscriptionProtocol;

  /**
   * The subscription endpoint.
   *
   * The meaning of this value depends on the value for 'protocol'.
   */
  readonly endpoint: any;

  /**
   * The topic to subscribe to.
   */
  readonly topic: ITopic;

  /**
   * true if raw message delivery is enabled for the subscription. Raw messages are free of JSON formatting and can be
   * sent to HTTP/S and Amazon SQS endpoints. For more information, see GetSubscriptionAttributes in the Amazon Simple
   * Notification Service API Reference.
   *
   * @default false
   */
  readonly rawMessageDelivery?: boolean;
}

/**
 * A new subscription.
 *
 * Prefer to use the `ITopic.subscribeXxx()` methods to creating instances of
 * this class.
 */
export class Subscription extends Construct {
  constructor(scope: Construct, id: string, props: SubscriptionProps) {
    super(scope, id);

    if (props.rawMessageDelivery && ['http', 'https', 'sqs'].indexOf(props.protocol) < 0) {
      throw new Error('Raw message delivery can only be enabled for HTTP/S and SQS subscriptions.');
    }

    new CfnSubscription(this, 'Resource', {
      endpoint: props.endpoint,
      protocol: props.protocol,
      topicArn: props.topic.topicArn,
      rawMessageDelivery: props.rawMessageDelivery,
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
  Http = 'http',

  /**
   * JSON-encoded message is POSTed to an HTTPS url.
   */
  Https = 'https',

  /**
   * Notifications are sent via email.
   */
  Email = 'email',

  /**
   * Notifications are JSON-encoded and sent via mail.
   */
  EmailJson = 'email-json',

  /**
   * Notification is delivered by SMS
   */
  Sms = 'sms',

  /**
   * Notifications are enqueued into an SQS queue.
   */
  Sqs = 'sqs',

  /**
   * JSON-encoded notifications are sent to a mobile app endpoint.
   */
  Application = 'application',

  /**
   * Notifications trigger a Lambda function.
   */
  Lambda = 'lambda'
}
