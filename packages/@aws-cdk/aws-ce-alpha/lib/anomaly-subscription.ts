import { ArnFormat, IResource, Lazy, Names, Resource, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnAnomalySubscription } from 'aws-cdk-lib/aws-ce';
import { IAnomalyMonitor } from './anomaly-monitor';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';

/**
 * An anomaly subscription
 */
export interface IAnomalySubscription extends IResource {
  /**
   * The ARN of the anomaly subscription
   *
   * @attribute
   */
  readonly anomalySubscriptionArn: string;
}

/**
 * Properties for an anomaly subscription
 */
export interface AnomalySubscriptionProps {
  /**
   * A name for the anomaly subscription
   *
   * @default - A name is automatically generated
   */
  readonly anomalySubscriptionName?: string;

  /**
   * A list of anomaly monitors
   */
  readonly anomalyMonitors: IAnomalyMonitor[];

  /**
   * The subscriber
   */
  readonly subscriber: AnomalySubscriber;

  /**
   * An expression used to specify the anomalies that you
   * want to generate alerts for.
   */
  readonly thresholdExpression: ThresholdExpression;
}

/**
 * Configuration for a subscriber
 */
export interface SubscriberConfig {
  /**
   * The frequency
   */
  readonly frequency: string;

  /**
   * The type of subscriber
   */
  readonly type: string;

  /**
   * The addresses
   */
  readonly addresses: string[];
}

/**
 * A subscriber for an anomaly subscription
 */
export abstract class AnomalySubscriber {
  /**
   * Use a SNS topic as subscriber
   */
  public static sns(topic: ITopic): AnomalySubscriber {
    return new SnsSubscriber(topic);
  }

  /**
   * Use email addresses as subscribers
   */
  public static emails(frequency: EmailFrequency, emails: string[]): AnomalySubscriber {
    return new EmailsSubscriber(frequency, emails);
  }

  /**
   * Binds the subscriber to the subscription
   */
  public abstract bind(anomalySubscription: AnomalySubscription): SubscriberConfig;
}

class SnsSubscriber extends AnomalySubscriber {
  constructor(private readonly topic: ITopic) {
    super();
  }

  public bind(anomalySubscription: AnomalySubscription): SubscriberConfig {
    this.topic.grantPublish(new ServicePrincipal('costalerts.amazonaws.com').withConditions({
      StringEquals: {
        'aws:SourceAccount': [Stack.of(anomalySubscription).account],
      },
    }));

    return {
      type: 'SNS',
      frequency: 'IMMEDIATE',
      addresses: [this.topic.topicArn],
    };
  }
}

class EmailsSubscriber extends AnomalySubscriber {
  constructor(private readonly frequency: EmailFrequency, private readonly emails: string[]) {
    super();
  }

  public bind(_: AnomalySubscription): SubscriberConfig {
    return {
      type: 'EMAIL',
      frequency: this.frequency,
      addresses: this.emails,
    };
  }
}

/**
 * Email frequency
 */
export enum EmailFrequency {
  /**
   * Daily
   */
  DAILY = 'DAILY',

  /**
   * Weekly
   */
  WEEKLY = 'WEEKLY'
}

/**
 * A threshold expression
 */
export abstract class ThresholdExpression {
  /**
   * Generate alerts when the spend is above an amount in USD
   */
  public static aboveUsdAmount(amount: number): ThresholdExpression {
    return {
      expression: {
        Dimensions: {
          Key: 'ANOMALY_TOTAL_IMPACT_ABSOLUTE',
          MatchOptions: ['GREATER_THAN_OR_EQUAL'],
          Values: [amount.toString()],
        },
      },
    };
  }

  /**
   * Generate alerts when the spend is above a percentage
   */
  public static abovePercentage(percentage: number): ThresholdExpression {
    return {
      expression: {
        Dimensions: {
          Key: 'ANOMALY_TOTAL_IMPACT_PERCENTAGE',
          MatchOptions: ['GREATER_THAN_OR_EQUAL'],
          Values: [percentage.toString()],
        },
      },
    };
  }

  /**
   * Generate alerts when the spend is above an amount in USD **and** above a percentage
   */
  public static aboveUsdAmountAndPercentage(amount: number, percentage: number): ThresholdExpression {
    const aboveUsdAMount = this.aboveUsdAmount(amount);
    const abovePercentage = this.abovePercentage(percentage);
    return {
      expression: {
        And: [aboveUsdAMount.expression, abovePercentage.expression],
      },
    };
  }

  /**
   * Generate alerts when the spend is above an amount in USD **or** above a percentage
   */
  public static aboveUsdAmountOrPercentage(amount: number, percentage: number): ThresholdExpression {
    const aboveUsdAMount = this.aboveUsdAmount(amount);
    const abovePercentage = this.abovePercentage(percentage);
    return {
      expression: {
        Or: [aboveUsdAMount.expression, abovePercentage.expression],
      },
    };
  }

  /**
   * The expression of the threshold
   */
  public abstract readonly expression: Record<string, any>;
}

/**
 * An anomaly subscription
 */
export class AnomalySubscription extends Resource implements IAnomalySubscription {
  /**
   * Use an existing anomaly subscription
   */
  public static fromAnomalySubscriptionArn(scope: Construct, id: string, anomalySubscriptionArn: string): IAnomalySubscription {
    const parsedArn = Stack.of(scope).splitArn(anomalySubscriptionArn, ArnFormat.SLASH_RESOURCE_NAME);

    class Import extends Resource implements IAnomalySubscription {
      public readonly anomalySubscriptionArn = anomalySubscriptionArn;
    }

    return new Import(scope, id, {
      account: parsedArn.account,
      region: parsedArn.region,
    });
  }
  public readonly anomalySubscriptionArn: string;

  /**
   * Your unique account identifier.
   *
   * @attribute
   */
  public readonly anomalySubscriptionAccountId: string;

  constructor(scope: Construct, id: string, props: AnomalySubscriptionProps) {
    super(scope, id, {
      physicalName: props.anomalySubscriptionName ?? Lazy.string({ produce: () => this.generateUniqueId() }),
    });

    const subscriberConfig = props.subscriber.bind(this);

    const subscription = new CfnAnomalySubscription(this, 'Resource', {
      monitorArnList: props.anomalyMonitors.map((monitor) => monitor.anomalyMonitorArn),
      frequency: subscriberConfig.frequency,
      subscriptionName: this.physicalName,
      subscribers: subscriberConfig.addresses.map((address) => ({
        type: subscriberConfig.type,
        address,
      })),
      thresholdExpression: JSON.stringify(props.thresholdExpression.expression),
    });

    this.anomalySubscriptionArn = subscription.ref;
    this.anomalySubscriptionAccountId = subscription.attrAccountId;
  }

  private generateUniqueId(): string {
    const name = Names.uniqueId(this);
    if (name.length > 50) {
      return name.substring(0, 25) + name.substring(name.length - 25);
    }
    return name;
  }
}