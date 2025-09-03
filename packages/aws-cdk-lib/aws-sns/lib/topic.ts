import { Construct } from 'constructs';
import { CfnTopic } from './sns.generated';
import { ITopic, TopicBase } from './topic-base';
import { IRoleRef } from '../../aws-iam';
import { IKey, Key } from '../../aws-kms';
import { ArnFormat, Lazy, Names, Stack, Token } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Properties for a new SNS topic
 */
export interface TopicProps {
  /**
   * A developer-defined string that can be used to identify this SNS topic.
   *
   * The display name must be maximum 100 characters long, including hyphens (-),
   * underscores (_), spaces, and tabs.
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
   * @see https://docs.aws.amazon.com/sns/latest/dg/sns-topic-attributes.html.
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
   * @see https://docs.aws.amazon.com/sns/latest/dg/sns-security-best-practices.html#enforce-encryption-data-in-transit.
   *
   * @default false
   */
  readonly enforceSSL?: boolean;

  /**
   * The signature version corresponds to the hashing algorithm used while creating the signature of the notifications,
   * subscription confirmations, or unsubscribe confirmation messages sent by Amazon SNS.
   *
   * @see https://docs.aws.amazon.com/sns/latest/dg/sns-verify-signature-of-message.html.
   *
   * @default 1
   */
  readonly signatureVersion?: string;

  /**
   * Tracing mode of an Amazon SNS topic.
   *
   * @see https://docs.aws.amazon.com/sns/latest/dg/sns-active-tracing.html
   *
   * @default TracingConfig.PASS_THROUGH
   */
  readonly tracingConfig?: TracingConfig;

  /**
   * Specifies the throughput quota and deduplication behavior to apply for the FIFO topic.
   *
   * You can only set this property when `fifo` is `true`.
   *
   * @default undefined - SNS default setting is FifoThroughputScope.TOPIC
   */
  readonly fifoThroughputScope?: FifoThroughputScope;
}

/**
 * The throughput quota and deduplication behavior to apply for the FIFO topic.
 */
export enum FifoThroughputScope {
  /**
   * Topic scope
   * - Throughput: 3000 messages per second and a bandwidth of 20MB per second.
   * - Deduplication: Message deduplication is verified on the entire FIFO topic.
   */
  TOPIC = 'Topic',

  /**
   * Message group scope
   * - Throughput: Maximum regional limits.
   * - Deduplication: Message deduplication is only verified within a message group.
   */
  MESSAGE_GROUP = 'MessageGroup',
}

/**
 * A logging configuration for delivery status of messages sent from SNS topic to subscribed endpoints.
 *
 * @see https://docs.aws.amazon.com/sns/latest/dg/sns-topic-attributes.html.
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
  readonly failureFeedbackRole?: IRoleRef;

  /**
   * The IAM role to be used when logging successful message deliveries in Amazon CloudWatch.
   *
   * @default None
   */
  readonly successFeedbackRole?: IRoleRef;

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
   * Amazon Data Firehose
   */
  FIREHOSE = 'firehose',

  /**
   * Platform application endpoint
   */
  APPLICATION = 'application',
}

/**
 * The tracing mode of an Amazon SNS topic
 */
export enum TracingConfig {
  /**
   * The mode that topic passes trace headers received from the Amazon SNS publisher to its subscription.
   */
  PASS_THROUGH = 'PassThrough',

  /**
   * The mode that Amazon SNS vend X-Ray segment data to topic owner account if the sampled flag in the tracing header is true.
   */
  ACTIVE = 'Active',
}

/**
 * Represents an SNS topic defined outside of this stack.
 */
export interface TopicAttributes {
  /**
   * The ARN of the SNS topic.
   */
  readonly topicArn: string;

  /**
   * KMS encryption key, if this topic is server-side encrypted by a KMS key.
   *
   * @default - None
   */
  readonly keyArn?: string;

  /**
   * Whether content-based deduplication is enabled.
   * Only applicable for FIFO topics.
   *
   * @default false
   */
  readonly contentBasedDeduplication?: boolean;
}

/**
 * A new SNS topic
 */
@propertyInjectable
export class Topic extends TopicBase {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-sns.Topic';

  /**
   * Import an existing SNS topic provided an ARN
   *
   * @param scope The parent creating construct
   * @param id The construct's name
   * @param topicArn topic ARN (i.e. arn:aws:sns:us-east-2:444455556666:MyTopic)
   */
  public static fromTopicArn(scope: Construct, id: string, topicArn: string): ITopic {
    return Topic.fromTopicAttributes(scope, id, { topicArn });
  }

  /**
   * Import an existing SNS topic provided a topic attributes
   *
   * @param scope The parent creating construct
   * @param id The construct's name
   * @param attrs the attributes of the topic to import
   */
  public static fromTopicAttributes(scope: Construct, id: string, attrs: TopicAttributes): ITopic {
    const topicName = Stack.of(scope).splitArn(attrs.topicArn, ArnFormat.NO_RESOURCE_NAME).resource;
    const fifo = topicName.endsWith('.fifo');

    if (attrs.contentBasedDeduplication && !fifo) {
      throw new ValidationError('Cannot import topic; contentBasedDeduplication is only available for FIFO SNS topics.', scope);
    }

    class Import extends TopicBase {
      public readonly topicArn = attrs.topicArn;
      public readonly topicName = topicName;
      public readonly masterKey = attrs.keyArn
        ? Key.fromKeyArn(this, 'Key', attrs.keyArn)
        : undefined;
      public readonly fifo = fifo;
      public readonly contentBasedDeduplication = attrs.contentBasedDeduplication || false;
      protected autoCreatePolicy: boolean = false;
    }

    return new Import(scope, id, {
      environmentFromArn: attrs.topicArn,
    });
  }

  public readonly topicArn: string;
  public readonly topicName: string;
  public readonly masterKey?: IKey;
  public readonly contentBasedDeduplication: boolean;
  public readonly fifo: boolean;

  protected readonly autoCreatePolicy: boolean = true;

  private readonly loggingConfigs: LoggingConfig[] = [];

  constructor(scope: Construct, id: string, props: TopicProps = {}) {
    super(scope, id, {
      physicalName: props.topicName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.enforceSSL = props.enforceSSL;

    if (props.contentBasedDeduplication && !props.fifo) {
      throw new ValidationError('Content based deduplication can only be enabled for FIFO SNS topics.', this);
    }
    if (props.messageRetentionPeriodInDays && !props.fifo) {
      throw new ValidationError('`messageRetentionPeriodInDays` is only valid for FIFO SNS topics.', this);
    }
    if (props.fifoThroughputScope && !props.fifo) {
      throw new ValidationError('`fifoThroughputScope` can only be set for FIFO SNS topics.', this);
    }
    if (
      props.messageRetentionPeriodInDays !== undefined
      && !Token.isUnresolved(props.messageRetentionPeriodInDays)
      && (!Number.isInteger(props.messageRetentionPeriodInDays) || props.messageRetentionPeriodInDays > 365 || props.messageRetentionPeriodInDays < 1)
    ) {
      throw new ValidationError('`messageRetentionPeriodInDays` must be an integer between 1 and 365', this);
    }

    if (props.loggingConfigs) {
      props.loggingConfigs.forEach(c => this.addLoggingConfig(c));
    }

    let cfnTopicName: string;
    if (props.fifo && props.topicName && !props.topicName.endsWith('.fifo')) {
      cfnTopicName = this.physicalName + '.fifo';
    } else if (props.fifo && !props.topicName) {
      // Max length allowed by CloudFormation is 256, we subtract 5 to allow for ".fifo" suffix
      const prefixName = Names.uniqueResourceName(this, {
        maxLength: 256 - 5,
        separator: '-',
      });
      cfnTopicName = `${prefixName}.fifo`;
    } else {
      cfnTopicName = this.physicalName;
    }

    if (
      props.signatureVersion &&
      !Token.isUnresolved(props.signatureVersion) &&
      props.signatureVersion !== '1' &&
      props.signatureVersion !== '2'
    ) {
      throw new ValidationError(`signatureVersion must be "1" or "2", received: "${props.signatureVersion}"`, this);
    }

    if (props.displayName && !Token.isUnresolved(props.displayName) && props.displayName.length > 100) {
      throw new ValidationError(`displayName must be less than or equal to 100 characters, got ${props.displayName.length}`, this);
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
      signatureVersion: props.signatureVersion,
      deliveryStatusLogging: Lazy.any({ produce: () => this.renderLoggingConfigs() }, { omitEmptyArray: true }),
      tracingConfig: props.tracingConfig,
      fifoThroughputScope: props.fifoThroughputScope,
    });

    this.topicArn = this.getResourceArnAttribute(resource.ref, {
      service: 'sns',
      resource: this.physicalName,
    });
    this.topicName = this.getResourceNameAttribute(resource.attrTopicName);
    this.masterKey = props.masterKey;
    this.fifo = props.fifo || false;
    this.contentBasedDeduplication = props.contentBasedDeduplication || false;

    if (this.enforceSSL) {
      this.addSSLPolicy();
    }
  }

  private renderLoggingConfigs(): CfnTopic.LoggingConfigProperty[] {
    const renderLoggingConfig = (spec: LoggingConfig): CfnTopic.LoggingConfigProperty => {
      if (spec.successFeedbackSampleRate !== undefined) {
        const rate = spec.successFeedbackSampleRate;
        if (!Number.isInteger(rate) || rate < 0 || rate > 100) {
          throw new ValidationError('Success feedback sample rate must be an integer between 0 and 100', this);
        }
      }
      return {
        protocol: spec.protocol,
        failureFeedbackRoleArn: spec.failureFeedbackRole?.roleRef.roleArn,
        successFeedbackRoleArn: spec.successFeedbackRole?.roleRef.roleArn,
        successFeedbackSampleRate: spec.successFeedbackSampleRate?.toString(),
      };
    };

    return this.loggingConfigs.map(renderLoggingConfig);
  }

  /**
   * Adds a delivery status logging configuration to the topic.
   */
  @MethodMetadata()
  public addLoggingConfig(config: LoggingConfig) {
    this.loggingConfigs.push(config);
  }
}
