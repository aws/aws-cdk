# Amazon Managed Streaming for Apache Kafka Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

[Amazon MSK](https://aws.amazon.com/msk/) is a fully managed service that makes it easy for you to build and run applications that use Apache Kafka to process streaming data.

The following example creates an MSK Cluster.

```ts
import * as msk from '@aws-cdk/aws-msk';

const cluster = new Cluster(this, 'Cluster', {
  brokerNodeGroupProps: {
    vpc,
  },
});
```

## Allowing Connections

To control who can access the Cluster, use the `.connections` attribute. ZooKeeper can be accessed on port `2181`, and the broker nodes on either port `9094` when using TLS or `9092` without TLS.

```typescript
import * as msk from "@aws-cdk/aws-msk"
import * as ec2 from "@aws-cdk/aws-ec2"

const cluster = new msk.Cluster(this, "Cluster", {...})

cluster.connections.allowFrom(
  ec2.Peer.ipv4("1.2.3.4/8"),
  ec2.Port.tcp(2181)
)
cluster.connections.allowFrom(
  ec2.Peer.ipv4("1.2.3.4/8"),
  ec2.Port.tcp(9094)
)
```

## Cluster Endpoints

To get a list of the Kafka broker or ZooKeeper endpoints you can use the attributes `.bootstrapBrokers`, `.bootstrapBrokersTls`, and `.zookeeperConnectionString`.

```typescript
const zookeeper = cluster.zookeeperConnectionString
const bootstrapBrokers = cluster.bootstrapBrokers
const bootsrapBrokersTls = cluster.bootstrapBrokersTls
```

## Importing an existing Cluster

To import an existing MSK cluster into your CDK app use the `.fromClusterArn()` method.

```typescript
const cluster = msk.Cluster.fromClusterArn(this, 'Cluster', 'rn:aws:kafka:us-west-2:1234567890:cluster/a-cluster/11111111-1111-1111-1111-111111111111-1')
```

## Client Authentication

To enable client authentication with TLS set the `certificateAuthorityArns` property to reference your ACM Private CA. [More info on Private CAs.](https://docs.aws.amazon.com/msk/latest/developerguide/msk-authentication.html)

```typescript
import * as msk from "@aws-cdk/aws-msk"

const cluster = new msk.Cluster(this, "Cluster", {
  ...
  encryptionInTransitConfig: {
    clientBroker: msk.ClientBrokerEncryption.TLS,
    certificateAuthorityArns: [
      'arn:aws:acm-pca:us-west-2:1234567890:certificate-authority/11111111-1111-1111-1111-111111111111',
    ],
  },
})
```
