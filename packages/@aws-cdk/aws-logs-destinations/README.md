# CDK Construct Libray for AWS XXX
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

## Kinesis destination

You can pass an existing IAM ``roleArn`` to be assumed for writing logs in a Kinesis destination. If not, a new one will be created.

```ts
const id = 'CloudWatchLogsCanPutRecords';
const destinationRole = new iam.Role(this, id, {
    assumedBy: new iam.ServicePrincipal('logs.amazonaws.com'),
});

const kinesisDestination = new LogsDestinations.KinesisDestination(kinesisStream, { role: destinationRole } );
```