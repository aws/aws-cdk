# Amazon Simple Queue Service Construct Library
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

---

<!--END STABILITY BANNER-->

Amazon Simple Queue Service (SQS) is a fully managed message queuing service that 
enables you to decouple and scale microservices, distributed systems, and serverless 
applications. SQS eliminates the complexity and overhead associated with managing and 
operating message oriented middleware, and empowers developers to focus on differentiating work. 
Using SQS, you can send, store, and receive messages between software components at any volume, 
without losing messages or requiring other services to be available. 

## Installation

Import to your project:

```ts nofixture
import * as sqs from '@aws-cdk/aws-sqs';
```

## Basic usage


Here's how to add a basic queue to your application:

```ts
new sqs.Queue(this, 'Queue');
```

## Encryption

If you want to encrypt the queue contents, set the `encryption` property. You can have
the messages encrypted with a key that SQS manages for you, or a key that you
can manage yourself.

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
```

## First-In-First-Out (FIFO) queues

FIFO queues give guarantees on the order in which messages are dequeued, and have additional
features in order to help guarantee exactly-once processing. For more information, see
the SQS manual. Note that FIFO queues are not available in all AWS regions.

A queue can be made a FIFO queue by either setting `fifo: true`, giving it a name which ends
in `".fifo"`, or by enabling a FIFO specific feature such as: content-based deduplication, 
deduplication scope or fifo throughput limit.
