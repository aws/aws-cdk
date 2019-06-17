import kms = require('@aws-cdk/aws-kms');
import { Construct, Stack } from '@aws-cdk/cdk';
import { IQueue, QueueAttributes, QueueBase } from './queue-base';
import { CfnQueue } from './sqs.generated';
import { validateProps } from './validate-props';

/**
 * Properties for creating a new Queue
 */
export interface QueueProps {
  /**
   * A name for the queue.
   *
   * If specified and this is a FIFO queue, must end in the string '.fifo'.
   *
   * @default CloudFormation-generated name
   */
  readonly queueName?: string;

  /**
   * The number of seconds that Amazon SQS retains a message.
   *
   * You can specify an integer value from 60 seconds (1 minute) to 1209600
   * seconds (14 days). The default value is 345600 seconds (4 days).
   *
   * @default 345600 seconds (4 days)
   */
  readonly retentionPeriodSec?: number;

  /**
   * The time in seconds that the delivery of all messages in the queue is delayed.
   *
   * You can specify an integer value of 0 to 900 (15 minutes). The default
   * value is 0.
   *
   * @default 0
   */
  readonly deliveryDelaySec?: number;

  /**
   * The limit of how many bytes that a message can contain before Amazon SQS rejects it.
   *
   * You can specify an integer value from 1024 bytes (1 KiB) to 262144 bytes
   * (256 KiB). The default value is 262144 (256 KiB).
   *
   * @default 256KiB
   */
  readonly maxMessageSizeBytes?: number;

  /**
   * Default wait time for ReceiveMessage calls.
   *
   * Does not wait if set to 0, otherwise waits this amount of seconds
   * by default for messages to arrive.
   *
   * For more information, see Amazon SQS Long Poll.
   *
   *  @default 0
   */
  readonly receiveMessageWaitTimeSec?: number;

  /**
   * Timeout of processing a single message.
   *
   * After dequeuing, the processor has this much time to handle the message
   * and delete it from the queue before it becomes visible again for dequeueing
   * by another processor.
   *
   * Values must be from 0 to 43200 seconds (12 hours). If you don't specify
   * a value, AWS CloudFormation uses the default value of 30 seconds.
   *
   * @default 30
   */
  readonly visibilityTimeoutSec?: number;

  /**
   * Send messages to this queue if they were unsuccessfully dequeued a number of times.
   *
   * @default no dead-letter queue
   */
  readonly deadLetterQueue?: DeadLetterQueue;

  /**
   * Whether the contents of the queue are encrypted, and by what type of key.
   *
   * Be aware that encryption is not available in all regions, please see the docs
   * for current availability details.
   *
   * @default Unencrypted
   */
  readonly encryption?: QueueEncryption;

  /**
   * External KMS master key to use for queue encryption.
   *
   * Individual messages will be encrypted using data keys. The data keys in
   * turn will be encrypted using this key, and reused for a maximum of
   * `dataKeyReuseSecs` seconds.
   *
   * The 'encryption' property must be either not specified or set to "Kms".
   * An error will be emitted if encryption is set to "Unencrypted" or
   * "KmsManaged".
   *
   * @default If encryption is set to KMS and not specified, a key will be created.
   */
  readonly encryptionMasterKey?: kms.IKey;

  /**
   * The length of time that Amazon SQS reuses a data key before calling KMS again.
   *
   * The value must be an integer between 60 (1 minute) and 86,400 (24
   * hours). The default is 300 (5 minutes).
   *
   * @default 300 (5 minutes)
   */
  readonly dataKeyReuseSec?: number;

  /**
   * Whether this a first-in-first-out (FIFO) queue.
   *
   * @default false, unless queueName ends in '.fifo' or 'contentBasedDeduplication' is true.
   */
  readonly fifo?: boolean;

  /**
   * Specifies whether to enable content-based deduplication.
   *
   * During the deduplication interval (5 minutes), Amazon SQS treats
   * messages that are sent with identical content (excluding attributes) as
   * duplicates and delivers only one copy of the message.
   *
   * If you don't enable content-based deduplication and you want to deduplicate
   * messages, provide an explicit deduplication ID in your SendMessage() call.
   *
   * (Only applies to FIFO queues.)
   *
   * @default false
   */
  readonly contentBasedDeduplication?: boolean;
}

/**
 * Dead letter queue settings
 */
export interface DeadLetterQueue {
  /**
   * The dead-letter queue to which Amazon SQS moves messages after the value of maxReceiveCount is exceeded.
   */
  readonly queue: IQueue;

  /**
   * The number of times a message can be unsuccesfully dequeued before being moved to the dead-letter queue.
   */
  readonly maxReceiveCount: number;
}

/**
 * What kind of encryption to apply to this queue
 */
export enum QueueEncryption {
  /**
   * Messages in the queue are not encrypted
   */
  Unencrypted = 'NONE',

  /**
   * Server-side KMS encryption with a master key managed by SQS.
   */
  KmsManaged = 'MANAGED',

  /**
   * Server-side encryption with a KMS key managed by the user.
   *
   * If `encryptionKey` is specified, this key will be used, otherwise, one will be defined.
   */
  Kms = 'KMS',
}

/**
 * A new Amazon SQS queue
 */
export class Queue extends QueueBase {

  public static fromQueueArn(scope: Construct, id: string, queueArn: string): IQueue {
    return Queue.fromQueueAttributes(scope, id, { queueArn });
  }

  /**
   * Import an existing queue
   */
  public static fromQueueAttributes(scope: Construct, id: string, attrs: QueueAttributes): IQueue {
    const stack = Stack.of(scope);
    const queueName = attrs.queueName || stack.parseArn(attrs.queueArn).resource;
    const queueUrl = attrs.queueUrl || `https://sqs.${stack.region}.${stack.urlSuffix}/${stack.account}/${queueName}`;

    class Import extends QueueBase {
      public readonly queueArn = attrs.queueArn; // arn:aws:sqs:us-east-1:123456789012:queue1
      public readonly queueUrl = queueUrl;
      public readonly queueName = queueName;
      public readonly encryptionMasterKey = attrs.keyArn
        ? kms.Key.fromKeyArn(this, 'Key', attrs.keyArn)
        : undefined;

      protected readonly autoCreatePolicy = false;
    }

    return new Import(scope, id);
  }

  /**
   * The ARN of this queue
   */
  public readonly queueArn: string;

  /**
   * The name of this queue
   */
  public readonly queueName: string;

  /**
   * The URL of this queue
   */
  public readonly queueUrl: string;

  /**
   * If this queue is encrypted, this is the KMS key.
   */
  public readonly encryptionMasterKey?: kms.IKey;

  protected readonly autoCreatePolicy = true;

  constructor(scope: Construct, id: string, props: QueueProps = {}) {
    super(scope, id);

    validateProps(props);

    const redrivePolicy = props.deadLetterQueue
              ? {
                deadLetterTargetArn: props.deadLetterQueue.queue.queueArn,
                maxReceiveCount: props.deadLetterQueue.maxReceiveCount
                }
              : undefined;

    const { encryptionMasterKey, encryptionProps } = _determineEncryptionProps.call(this);

    const queue = new CfnQueue(this, 'Resource', {
      queueName: props.queueName,
      ...this.determineFifoProps(props),
      ...encryptionProps,
      redrivePolicy,
      delaySeconds: props.deliveryDelaySec,
      maximumMessageSize: props.maxMessageSizeBytes,
      messageRetentionPeriod: props.retentionPeriodSec,
      receiveMessageWaitTimeSeconds: props.receiveMessageWaitTimeSec,
      visibilityTimeout: props.visibilityTimeoutSec,
    });
    this.encryptionMasterKey = encryptionMasterKey;
    this.queueArn = queue.queueArn;
    this.queueName = queue.queueName;
    this.queueUrl = queue.refAsString;

    function _determineEncryptionProps(this: Queue): { encryptionProps: EncryptionProps, encryptionMasterKey?: kms.IKey } {
      let encryption = props.encryption || QueueEncryption.Unencrypted;

      if (encryption !== QueueEncryption.Kms && props.encryptionMasterKey) {
        encryption = QueueEncryption.Kms; // KMS is implied by specifying an encryption key
      }

      if (encryption === QueueEncryption.Unencrypted) {
        return { encryptionProps: {} };
      }

      if (encryption === QueueEncryption.KmsManaged) {
        const masterKey = kms.Key.fromKeyArn(this, 'Key', 'alias/aws/sqs');

        return {
          encryptionMasterKey: masterKey,
          encryptionProps: {
            kmsMasterKeyId: 'alias/aws/sqs',
            kmsDataKeyReusePeriodSeconds: props.dataKeyReuseSec
          }
        };
      }

      if (encryption === QueueEncryption.Kms) {
        const masterKey = props.encryptionMasterKey || new kms.Key(this, 'Key', {
          description: `Created by ${this.node.path}`
        });

        return {
          encryptionMasterKey: masterKey,
          encryptionProps: {
            kmsMasterKeyId: masterKey.keyArn,
            kmsDataKeyReusePeriodSeconds: props.dataKeyReuseSec
          }
        };
      }

      throw new Error(`Unexpected 'encryptionType': ${encryption}`);
    }
  }

  /**
   * Look at the props, see if the FIFO props agree, and return the correct subset of props
   */
  private determineFifoProps(props: QueueProps): FifoProps {
    // Check if any of the signals that we have say that this is a FIFO queue.
    let fifoQueue = props.fifo;
    if (typeof fifoQueue === 'undefined' && typeof props.queueName === 'string' && props.queueName.endsWith('.fifo')) { fifoQueue = true; }
    if (typeof fifoQueue === 'undefined' && props.contentBasedDeduplication) { fifoQueue = true; }

    // If we have a name, see that it agrees with the FIFO setting
    if (typeof props.queueName === 'string') {
      if (fifoQueue && !props.queueName.endsWith('.fifo')) {
        throw new Error("FIFO queue names must end in '.fifo'");
      }
      if (!fifoQueue && props.queueName.endsWith('.fifo')) {
        throw new Error("Non-FIFO queue name may not end in '.fifo'");
      }
    }

    if (props.contentBasedDeduplication && !fifoQueue) {
      throw new Error('Content-based deduplication can only be defined for FIFO queues');
    }

    return {
      contentBasedDeduplication: props.contentBasedDeduplication,
      fifoQueue,
    };
  }
}

interface FifoProps {
  readonly fifoQueue?: boolean;
  readonly contentBasedDeduplication?: boolean;
}

interface EncryptionProps {
  readonly kmsMasterKeyId?: string;
  readonly kmsDataKeyReusePeriodSeconds?: number;
}
