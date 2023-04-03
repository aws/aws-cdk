import * as kms from '@aws-cdk/aws-kms';
import { Duration, RemovalPolicy } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IQueue, QueueAttributes, QueueBase } from './queue-base';
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
     * @default Duration.days(4)
     */
    readonly retentionPeriod?: Duration;
    /**
     * The time in seconds that the delivery of all messages in the queue is delayed.
     *
     * You can specify an integer value of 0 to 900 (15 minutes). The default
     * value is 0.
     *
     * @default 0
     */
    readonly deliveryDelay?: Duration;
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
    readonly receiveMessageWaitTime?: Duration;
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
     * @default Duration.seconds(30)
     */
    readonly visibilityTimeout?: Duration;
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
     * @default SQS_MANAGED (SSE-SQS) for newly created queues
     */
    readonly encryption?: QueueEncryption;
    /**
     * External KMS key to use for queue encryption.
     *
     * Individual messages will be encrypted using data keys. The data keys in
     * turn will be encrypted using this key, and reused for a maximum of
     * `dataKeyReuseSecs` seconds.
     *
     * If the 'encryptionMasterKey' property is set, 'encryption' type will be
     * implicitly set to "KMS".
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
     * @default Duration.minutes(5)
     */
    readonly dataKeyReuse?: Duration;
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
    /**
     * For high throughput for FIFO queues, specifies whether message deduplication
     * occurs at the message group or queue level.
     *
     * (Only applies to FIFO queues.)
     *
     * @default DeduplicationScope.QUEUE
     */
    readonly deduplicationScope?: DeduplicationScope;
    /**
     * For high throughput for FIFO queues, specifies whether the FIFO queue
     * throughput quota applies to the entire queue or per message group.
     *
     * (Only applies to FIFO queues.)
     *
     * @default FifoThroughputLimit.PER_QUEUE
     */
    readonly fifoThroughputLimit?: FifoThroughputLimit;
    /**
     * Policy to apply when the queue is removed from the stack
     *
     * Even though queues are technically stateful, their contents are transient and it
     * is common to add and remove Queues while rearchitecting your application. The
     * default is therefore `DESTROY`. Change it to `RETAIN` if the messages are so
     * valuable that accidentally losing them would be unacceptable.
     *
     * @default RemovalPolicy.DESTROY
     */
    readonly removalPolicy?: RemovalPolicy;
    /**
     * Enforce encryption of data in transit.
     * @see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-security-best-practices.html#enforce-encryption-data-in-transit
     *
     * @default false
     */
    readonly enforceSSL?: boolean;
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
export declare enum QueueEncryption {
    /**
     * Messages in the queue are not encrypted
     */
    UNENCRYPTED = "NONE",
    /**
     * Server-side KMS encryption with a KMS key managed by SQS.
     */
    KMS_MANAGED = "KMS_MANAGED",
    /**
     * Server-side encryption with a KMS key managed by the user.
     *
     * If `encryptionKey` is specified, this key will be used, otherwise, one will be defined.
     */
    KMS = "KMS",
    /**
     * Server-side encryption key managed by SQS (SSE-SQS).
     *
     * To learn more about SSE-SQS on Amazon SQS, please visit the
     * [Amazon SQS documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-server-side-encryption.html).
     */
    SQS_MANAGED = "SQS_MANAGED"
}
/**
 * What kind of deduplication scope to apply
 */
export declare enum DeduplicationScope {
    /**
     * Deduplication occurs at the message group level
     */
    MESSAGE_GROUP = "messageGroup",
    /**
     * Deduplication occurs at the message queue level
     */
    QUEUE = "queue"
}
/**
 * Whether the FIFO queue throughput quota applies to the entire queue or per message group
 */
export declare enum FifoThroughputLimit {
    /**
     * Throughput quota applies per queue
     */
    PER_QUEUE = "perQueue",
    /**
     * Throughput quota applies per message group id
     */
    PER_MESSAGE_GROUP_ID = "perMessageGroupId"
}
/**
 * A new Amazon SQS queue
 */
export declare class Queue extends QueueBase {
    /**
     * Import an existing SQS queue provided an ARN
     *
     * @param scope The parent creating construct
     * @param id The construct's name
     * @param queueArn queue ARN (i.e. arn:aws:sqs:us-east-2:444455556666:queue1)
     */
    static fromQueueArn(scope: Construct, id: string, queueArn: string): IQueue;
    /**
     * Import an existing queue
     */
    static fromQueueAttributes(scope: Construct, id: string, attrs: QueueAttributes): IQueue;
    /**
     * The ARN of this queue
     */
    readonly queueArn: string;
    /**
     * The name of this queue
     */
    readonly queueName: string;
    /**
     * The URL of this queue
     */
    readonly queueUrl: string;
    /**
     * If this queue is encrypted, this is the KMS key.
     */
    readonly encryptionMasterKey?: kms.IKey;
    /**
     * Whether this queue is an Amazon SQS FIFO queue. If false, this is a standard queue.
     */
    readonly fifo: boolean;
    /**
     * If this queue is configured with a dead-letter queue, this is the dead-letter queue settings.
     */
    readonly deadLetterQueue?: DeadLetterQueue;
    protected readonly autoCreatePolicy = true;
    constructor(scope: Construct, id: string, props?: QueueProps);
    /**
     * Look at the props, see if the FIFO props agree, and return the correct subset of props
     */
    private determineFifoProps;
    /**
     * Adds an iam statement to enforce encryption of data in transit.
     */
    private enforceSSLStatement;
}
