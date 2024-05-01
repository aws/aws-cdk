# Amazon Simple Queue Service Construct Library


Amazon Simple Queue Service (SQS) is a fully managed message queuing service that 
enables you to decouple and scale microservices, distributed systems, and serverless 
applications. SQS eliminates the complexity and overhead associated with managing and 
operating message oriented middleware, and empowers developers to focus on differentiating work. 
Using SQS, you can send, store, and receive messages between software components at any volume, 
without losing messages or requiring other services to be available. 

## Installation

Import to your project:

```ts nofixture
import * as sqs from 'aws-cdk-lib/aws-sqs';
```

## Basic usage


Here's how to add a basic queue to your application:

```ts
new sqs.Queue(this, 'Queue');
```

## Encryption

By default queues are encrypted using SSE-SQS. If you want to change the encryption mode, set the `encryption` property.
The following encryption modes are supported:

* KMS key that SQS manages for you
* KMS key that you can managed yourself
* Server-side encryption managed by SQS (SSE-SQS)
* Unencrypted

To learn more about SSE-SQS on Amazon SQS, please visit the
[Amazon SQS documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-server-side-encryption.html).

```ts
// Use managed key
new sqs.Queue(this, 'Queue', {
  encryption: sqs.QueueEncryption.KMS_MANAGED,
});

// Use custom key
const myKey = new kms.Key(this, 'Key');

new sqs.Queue(this, 'Queue', {
  encryption: sqs.QueueEncryption.KMS,
  encryptionMasterKey: myKey,
});

// Use SQS managed server side encryption (SSE-SQS)
new sqs.Queue(this, 'Queue', {
  encryption: sqs.QueueEncryption.SQS_MANAGED,
});

// Unencrypted queue
new sqs.Queue(this, 'Queue', {
  encryption: sqs.QueueEncryption.UNENCRYPTED,
});
```

## Encryption in transit

If you want to enforce encryption of data in transit, set the `enforceSSL` property to `true`.
A resource policy statement that allows only encrypted connections over HTTPS (TLS)
will be added to the queue.

```ts
new sqs.Queue(this, 'Queue', {
  enforceSSL: true,
});
```

## First-In-First-Out (FIFO) queues

FIFO queues give guarantees on the order in which messages are dequeued, and have additional
features in order to help guarantee exactly-once processing. For more information, see
the SQS manual. Note that FIFO queues are not available in all AWS regions.

A queue can be made a FIFO queue by either setting `fifo: true`, giving it a name which ends
in `".fifo"`, or by enabling a FIFO specific feature such as: content-based deduplication, 
deduplication scope or fifo throughput limit.

## Dead letter source queues permission

You can configure the permission settings for queues that can designate the created queue as their dead-letter queue using the `redriveAllowPolicy` attribute.

By default, all queues within the same account and region are permitted as source queues.

```ts
declare const sourceQueue: sqs.IQueue;

// Only the sourceQueue can specify this queue as the dead-letter queue.
const queue1 = new sqs.Queue(this, 'Queue2', {
  redriveAllowPolicy: {
    sourceQueues: [sourceQueue],
  }
});

// No source queues can specify this queue as the dead-letter queue.
const queue2 = new sqs.Queue(this, 'Queue', {
  redriveAllowPolicy: {
    redrivePermission: sqs.RedrivePermission.DENY_ALL,
  }
});
```
