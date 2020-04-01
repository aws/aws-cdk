## Amazon Kinesis Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module.**
>
> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib))
> are auto-generated from CloudFormation. They are stable and safe to use.
>
> However, all other classes, i.e., higher level constructs, are under active development and subject to non-backward
> compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model.
> This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

[Amazon Kinesis](https://docs.aws.amazon.com/streams/latest/dev/introduction.html) provides collection and processing of large
[streams](https://aws.amazon.com/streaming-data/) of data records in real time. Kinesis data streams can be used for rapid and continuous data
intake and aggregation.

## Table Of Contents

- [Streams](#streams)
  - [Encryption](#encryption)
  - [Import](#import)

## Streams

Amazon Kinesis Data Streams ingests a large amount of data in real time, durably stores the data, and makes the data available for consumption.

Using the CDK, a new Kinesis stream can be created as part of the stack using the construct's constructor. You may specify the `streamName` to give
your own identifier to the stream. If not, CloudFormation will generate a name.

```ts
new Stream(this, "MyFirstStream", {
  streamName: "my-awesome-stream"
});
```

You can also specify properties such as `shardCount` to indicate how many shards the stream should choose and a `retentionPeriod`
to specify how many logn the data in the shards should remain accessible.
Read more at [Creating and Managing Streams](https://docs.aws.amazon.com/streams/latest/dev/working-with-streams.html)

```ts
new Stream(this, "MyFirstStream", {
  streamName: "my-awesome-stream",
  shardCount: 3,
  retentionPeriod: Duration.hours(48)
});
```

Streams are not encrypted by default.

### Encryption

[Stream encryption](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html) enables
server-side encryption using an AWS KMS key for a specified stream.

You can enable encryption on your stream with the master key owned by Kinesis Data Streams by specifying the `encryption` property.

```ts
new Stream(this, 'MyEncryptedStream', {
  encryption: StreamEncryption.MANAGED
});
```

You can enable encryption on your stream with a user-managed key by specifying the `encryption` property.
A KMS key will be created for you and associated with the stream.

```ts
new Stream(this, "MyEncryptedStream", {
  encryption: StreamEncryption.KMS
});
```

You can also supply your own external KMS key to use for stream encryption by specifying the `encryptionKey` property.

```ts
import * as kms from "@aws-cdk/aws-kms";

const key = new kms.Key(this, "MyKey");

new Stream(this, "MyEncryptedStream", {
  encryption: StreamEncryption.KMS,
  encryptionKey: key
});
```

### Import

Any Kinesis stream that has been created outside the stack can be imported into your CDK app.

Streams can be imported by their ARN via the `Stream.fromStreamArn()` API

```ts
const stack = new Stack(app, "MyStack");

const importedStream = Stream.fromStreamArn(
  stack,
  "ImportedStream",
  "arn:aws:kinesis:us-east-2:123456789012:stream/f3j09j2230j"
);
```

Encrypted Streams can also be imported by their attributes via the `Stream.fromStreamAttributes()` API

```ts
import { Key } from "@aws-cdk/aws-kms";

const stack = new Stack(app, "MyStack");

const importedStream = Stream.fromStreamAttributes(
  stack,
  "ImportedEncryptedStream",
  {
    streamArn: "arn:aws:kinesis:us-east-2:123456789012:stream/f3j09j2230j",
    encryptionKey: kms.Key.fromKeyArn(
      "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012"
    )
  }
);
```
