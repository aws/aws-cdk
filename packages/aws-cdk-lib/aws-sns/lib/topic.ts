import { Construct } from 'constructs';
import { CfnTopic } from './sns.generated';
import { ITopic, TopicBase } from './topic-base';
import { IRole } from '../../aws-iam';
import { IKey } from '../../aws-kms';
import { ArnFormat, Lazy, Names, Stack, Token } from '../../core';

/**
 * Properties for a new SNS topic
 */
export interface TopicProps {
  /**
   * A developer-defined string that can be used to identify this SNS topic.
   *
   * @default None
   */
  readonly displayName?: string;

  /**
   * A name for the topic.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique
   * physical ID and uses that ID for the topic name. For more information,
   * see Name Type.
   *
   * @default Generated name
   */
  readonly topicName?: string;

  /**
   * A KMS Key, either managed by this CDK app, or imported.
   *
   * @default None
   */
  readonly masterKey?: IKey;

  /**
   * Enables content-based deduplication for FIFO topics.
   *
   * @default None
   */
  readonly contentBasedDeduplication?: boolean;

  /**
   * Set to true to create a FIFO topic.
   *
   * @default None
   */
  readonly fifo?: boolean;

  /**
   * The list of delivery status logging configurations for the topic.
   *
   * For more information, see https://docs.aws.amazon.com/sns/latest/dg/sns-topic-attributes.html.
   *
   * @default None
   */
  readonly loggingConfigs?: LoggingConfig[];

  /**
   * The number of days Amazon SNS retains messages.
   *
   * It can only be set for FIFO topics.
   *
   * @see https://docs.aws.amazon.com/sns/latest/dg/fifo-message-archiving-replay.html
   *
   * @default - do not archive messages
   */
  readonly messageRetentionPeriodInDays?: number;

  /**
   * Adds a statement to enforce encryption of data in transit when publishing to the topic.
   *
   * For more information, see https://docs.aws.amazon.com/sns/latest/dg/sns-security-best-practices.html#enforce-encryption-data-in-transit.
   *
   * @default false
   */
  readonly enforceSSL?: boolean;
}

/**
 * A logging configuration for delivery status of messages sent from SNS topic to subscribed endpoints.
 *
 * For more information, see https://docs.aws.amazon.com/sns/latest/dg/sns-topic-attributes.html.
 */
export interface LoggingConfig {
  /**
   * Indicates one of the supported protocols for the SNS topic.
   */
  readonly protocol: LoggingProtocol;

  /**
   * The IAM role to be used when logging failed message deliveries in Amazon CloudWatch.
   *
   * @default None
   */
  readonly failureFeedbackRole?: IRole;

  /**
   * The IAM role to be used when logging successful message deliveries in Amazon CloudWatch.
   *
   * @default None
   */
  readonly successFeedbackRole?: IRole;

  /**
   * The percentage of successful message deliveries to be logged in Amazon CloudWatch.
   *
   * Valid values are integer between 0-100
   *
   * @default None
   */
  readonly successFeedbackSampleRate?: number;
}

/**
 * The type of supported protocol for delivery status logging.
 */
export enum LoggingProtocol {
  /**
   * HTTP
   */
  HTTP = 'http/s',

  /**
   * Amazon Simple Queue Service
   */
  SQS = 'sqs',

  /**
   * AWS Lambda
   */
  LAMBDA = 'lambda',

  /**
   * Amazon Kinesis Data Firehose
   */
  FIREHOSE = 'firehose',

  /**
   * Platform application endpoint
   */
  APPLICATION = 'application',
}

/**
 * A new SNS topic
 */
export class Topic extends TopicBase {

  /**
   * Import an existing SNS topic provided an ARN
   *
   * @param scope The parent creating construct
   * @param id The construct's name
   * @param topicArn topic ARN (i.e. arn:aws:sns:us-east-2:444455556666:MyTopic)
   */
  public static fromTopicArn(scope: Construct, id: string, topicArn: string): ITopic {
    class Import extends TopicBase {
      public readonly topicArn = topicArn;
      public readonly topicName = Stack.of(scope).splitArn(topicArn, ArnFormat.NO_RESOURCE_NAME).resource;
      public readonly fifo = this.topicName.endsWith('.fifo');
      public readonly contentBasedDeduplication = false;
      protected autoCreatePolicy: boolean = false;
    }

    return new Import(scope, id, {
      environmentFromArn: topicArn,
    });
  }

  public readonly topicArn: string;
  public readonly topicName: string;
  public readonly contentBasedDeduplication: boolean;
  public readonly fifo: boolean;

  protected readonly autoCreatePolicy: boolean = true;

  private readonly loggingConfigs: LoggingConfig[] = [];

  constructor(scope: Construct, id: string, props: TopicProps = {}) {
    super(scope, id, {
      physicalName: props.topicName,
    });

    this.enforceSSL = props.enforceSSL;

    if (props.contentBasedDeduplication && !props.fifo) {
      throw new Error('Content based deduplication can only be enabled for FIFO SNS topics.');
    }
    if (props.messageRetentionPeriodInDays && !props.fifo) {
      throw new Error('`messageRetentionPeriodInDays` is only valid for FIFO SNS topics.');
    }
    if (
      props.messageRetentionPeriodInDays !== undefined
      && !Token.isUnresolved(props.messageRetentionPeriodInDays)
      && (!Number.isInteger(props.messageRetentionPeriodInDays) || props.messageRetentionPeriodInDays > 365 || props.messageRetentionPeriodInDays < 1)
    ) {
      throw new Error('`messageRetentionPeriodInDays` must be an integer between 1 and 365');
    }

    if (props.loggingConfigs) {
      props.loggingConfigs.forEach(c => this.addLoggingConfig(c));
    }

    let cfnTopicName: string;
    if (props.fifo && props.topicName && !props.topicName.endsWith('.fifo')) {
      cfnTopicName = this.physicalName + '.fifo';
    } else if (props.fifo && !props.topicName) {
      // Max lenght allowed by CloudFormation is 256, we subtract 5 to allow for ".fifo" suffix
      const prefixName = Names.uniqueResourceName(this, {
        maxLength: 256 - 5,
        separator: '-',
      });
      cfnTopicName = `${prefixName}.fifo`;
    } else {
      cfnTopicName = this.physicalName;
    }

    const resource = new CfnTopic(this, 'Resource', {
      archivePolicy: props.messageRetentionPeriodInDays ? {
        MessageRetentionPeriod: props.messageRetentionPeriodInDays,
      } : undefined,
      displayName: props.displayName,
      topicName: cfnTopicName,
      kmsMasterKeyId: props.masterKey && props.masterKey.keyArn,
      contentBasedDeduplication: props.contentBasedDeduplication,
      fifoTopic: props.fifo,
      deliveryStatusLogging: Lazy.any({ produce: () => this.renderLoggingConfigs() }, { omitEmptyArray: true }),
    });

    this.topicArn = this.getResourceArnAttribute(resource.ref, {
      service: 'sns',
      resource: this.physicalName,
    });
    this.topicName = this.getResourceNameAttribute(resource.attrTopicName);
    this.fifo = props.fifo || false;
    this.contentBasedDeduplication = props.contentBasedDeduplication || false;
  }

  private renderLoggingConfigs(): CfnTopic.LoggingConfigProperty[] {
    return this.loggingConfigs.map(renderLoggingConfig);

    function renderLoggingConfig(spec: LoggingConfig): CfnTopic.LoggingConfigProperty {
      if (spec.successFeedbackSampleRate !== undefined) {
        const rate = spec.successFeedbackSampleRate;
        if (!Number.isInteger(rate) || rate < 0 || rate > 100) {
          throw new Error('Success feedback sample rate must be an integer between 0 and 100');
        }
      }
      return {
        protocol: spec.protocol,
        failureFeedbackRoleArn: spec.failureFeedbackRole?.roleArn,
        successFeedbackRoleArn: spec.successFeedbackRole?.roleArn,
        successFeedbackSampleRate: spec.successFeedbackSampleRate?.toString(),
      };
    }
  }

  /**
   * Adds a delivery status logging configuration to the topic.
   */
  public addLoggingConfig(config: LoggingConfig) {
    this.loggingConfigs.push(config);
  }
}
