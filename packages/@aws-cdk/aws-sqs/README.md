## AWS SQS Construct Library

Here's how to add a basic queue to your application:

```ts
new Queue(this, 'Queue');
```

### Encryption

If you want to encrypt the queue contents, set the `encryption` property. You can have
the messages encrypted with a key that SQS manages for you, or a key that you
can manage yourself.

```ts
// Use managed key
new Queue(this, 'Queue', {
    encryption: QueueEncryption.Managed,
});

// Use custom key
const myKey = new EncryptionKey(this, 'Key');

new Queue(this, 'Queue', {
    encryption: QueueEncryption.Kms,
    encryptionMasterKey: myKey
});
```

### First-In-First-Out (FIFO) queues

FIFO queues give guarantees on the order in which messages are dequeued, and have additional
features in order to help guarantee exactly-once processing. For more information, see
the SQS manual. Note that FIFO queues are not available in all AWS regions.

A queue can be made a FIFO queue by either setting `fifo: true`, giving it a name which ends
in `".fifo"`, or enabling content-based deduplication (which requires FIFO queues).
