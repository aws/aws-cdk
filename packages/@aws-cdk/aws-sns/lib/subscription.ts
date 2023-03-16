import { PolicyStatement, ServicePrincipal } from '@aws-cdk/aws-iam';
import { IQueue } from '@aws-cdk/aws-sqs';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
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
  readonly filterPolicy? : { [attribute: string]: SubscriptionFilter };

  /**
   * The filter policy that is applied on the message body.
   * To apply a filter policy to the message attributes, use `filterPolicy`. A maximum of one of `filterPolicyWithMessageBody` and `filterPolicy` may be used.
   *
   * @default - all messages are delivered
   */
  readonly filterPolicyWithMessageBody?: { [attribute: string]: FilterOrPolicy };

  /**
   * The region where the topic resides, in the case of cross-region subscriptions
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-region
   * @default - the region where the CloudFormation stack is being deployed.
   */
  readonly region?: string;

  /**
   * Queue to be used as dead letter queue.
   * If not passed no dead letter queue is enabled.
   *
   * @default - No dead letter queue enabled.
   */
  readonly deadLetterQueue?: IQueue;

  /**
   * Arn of role allowing access to firehose delivery stream.
   * Required for a firehose subscription protocol.
   * @default - No subscription role is provided
   */
  readonly subscriptionRoleArn?: string;
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

  /**
   * The DLQ associated with this subscription if present.
   */
  public readonly deadLetterQueue?: IQueue;

  private readonly filterPolicy?: { [attribute: string]: any[] };

  private readonly filterPolicyWithMessageBody? : {[attribute: string]: FilterOrPolicy };

  constructor(scope: Construct, id: string, props: SubscriptionProps) {
    super(scope, id);

    if (props.rawMessageDelivery &&
      [
        SubscriptionProtocol.HTTP,
        SubscriptionProtocol.HTTPS,
        SubscriptionProtocol.SQS,
        SubscriptionProtocol.FIREHOSE,
      ]
        .indexOf(props.protocol) < 0) {
      throw new Error('Raw message delivery can only be enabled for HTTP, HTTPS, SQS, and Firehose subscriptions.');
    }

    if (props.filterPolicy) {
      if (Object.keys(props.filterPolicy).length > 5) {
        throw new Error('A filter policy can have a maximum of 5 attribute names.');
      }

      this.filterPolicy = Object.entries(props.filterPolicy)
        .reduce(
          (acc, [k, v]) => ({ ...acc, [k]: v.conditions }),
          {},
        );

      let total = 1;
      Object.values(this.filterPolicy).forEach(filter => { total *= filter.length; });
      if (total > 150) {
        throw new Error(`The total combination of values (${total}) must not exceed 150.`);
      }
    } else if (props.filterPolicyWithMessageBody) {
      if (Object.keys(props.filterPolicyWithMessageBody).length > 5) {
        throw new Error('A filter policy can have a maximum of 5 attribute names.');
      }
      this.filterPolicyWithMessageBody = props.filterPolicyWithMessageBody;
    }

    if (props.protocol === SubscriptionProtocol.FIREHOSE && !props.subscriptionRoleArn) {
      throw new Error('Subscription role arn is required field for subscriptions with a firehose protocol.');
    }

    // Format filter policy
    const filterPolicy = this.filterPolicyWithMessageBody
      ? buildFilterPolicyWithMessageBody(this.filterPolicyWithMessageBody)
      : this.filterPolicy;

    this.deadLetterQueue = this.buildDeadLetterQueue(props);
    new CfnSubscription(this, 'Resource', {
      endpoint: props.endpoint,
      protocol: props.protocol,
      topicArn: props.topic.topicArn,
      rawMessageDelivery: props.rawMessageDelivery,
      filterPolicy,
      filterPolicyScope: this.filterPolicyWithMessageBody ? 'MessageBody' : undefined,
      region: props.region,
      redrivePolicy: this.buildDeadLetterConfig(this.deadLetterQueue),
      subscriptionRoleArn: props.subscriptionRoleArn,
    });

  }

  private buildDeadLetterQueue(props: SubscriptionProps) {
    if (!props.deadLetterQueue) {
      return undefined;
    }

    const deadLetterQueue = props.deadLetterQueue;

    deadLetterQueue.addToResourcePolicy(new PolicyStatement({
      resources: [deadLetterQueue.queueArn],
      actions: ['sqs:SendMessage'],
      principals: [new ServicePrincipal('sns.amazonaws.com')],
      conditions: {
        ArnEquals: { 'aws:SourceArn': props.topic.topicArn },
      },
    }));

    return deadLetterQueue;
  }

  private buildDeadLetterConfig(deadLetterQueue?: IQueue) {
    if (deadLetterQueue) {
      return {
        deadLetterTargetArn: deadLetterQueue.queueArn,
      };
    } else {
      return undefined;
    }
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
  LAMBDA = 'lambda',

  /**
   * Notifications put records into a firehose delivery stream.
   */
  FIREHOSE = 'firehose'
}

function buildFilterPolicyWithMessageBody(
  inputObject: { [key: string]: FilterOrPolicy },
  depth = 1,
  totalCombinationValues = [1],
): { [key: string]: any } {
  const result: { [key: string]: any } = {};

  for (const [key, filterOrPolicy] of Object.entries(inputObject)) {
    if (filterOrPolicy.isPolicy()) {
      result[key] = buildFilterPolicyWithMessageBody(filterOrPolicy.policyDoc, depth + 1, totalCombinationValues);
    } else if (filterOrPolicy.isFilter()) {
      const filter = filterOrPolicy.filterDoc.conditions;
      result[key] = filter;
      totalCombinationValues[0] *= filter.length * depth;
    }
  }

  // https://docs.aws.amazon.com/sns/latest/dg/subscription-filter-policy-constraints.html
  if (totalCombinationValues[0] > 150) {
    throw new Error(`The total combination of values (${totalCombinationValues}) must not exceed 150.`);
  }

  return result;
};

/**
 * The type of the MessageBody at a given key value pair
 */
export enum FilterOrPolicyType {
  /**
   * The filter of the MessageBody
   */
  FILTER,
  /**
   * A nested key of the MessageBody
   */
  POLICY,
}

/**
 * Class for building the FilterPolicy by avoiding union types
 */
export abstract class FilterOrPolicy {
  /**
   * Filter of MessageBody
   * @param filter
   * @returns
   */
  public static filter(filter: SubscriptionFilter) {
    return new Filter(filter);
  }

  /**
   * Policy of MessageBody
   * @param policy
   * @returns
   */
  public static policy(policy: { [attribute: string]: FilterOrPolicy }) {
    return new Policy(policy);
  }

  /**
   * Type switch for disambiguating between subclasses
   */
  abstract readonly type: FilterOrPolicyType;

  /**
   * Check if instance is `Policy` type
   */
  public isPolicy(): this is Policy {
    return this.type === FilterOrPolicyType.POLICY;
  }

  /**
   * Check if instance is `Filter` type
   */
  public isFilter(): this is Filter {
    return this.type === FilterOrPolicyType.FILTER;
  }
}

/**
 * Filter implementation of FilterOrPolicy
 */
export class Filter extends FilterOrPolicy {
  /**
   * Type used in DFS buildFilterPolicyWithMessageBody to determine json value type
   */
  public readonly type = FilterOrPolicyType.FILTER;
  /**
   * Policy constructor
   * @param filterDoc filter argument to construct
   */
  public constructor(public readonly filterDoc: SubscriptionFilter) {
    super();
  }
}

/**
 * Policy Implementation of FilterOrPolicy
 */
export class Policy extends FilterOrPolicy {
  /**
   * Type used in DFS buildFilterPolicyWithMessageBody to determine json value type
   */
  public readonly type = FilterOrPolicyType.POLICY;
  /**
   * Policy constructor
   * @param policyDoc policy argument to construct
   */
  public constructor(public readonly policyDoc: { [attribute: string]: FilterOrPolicy }) {
    super();
  }
}
