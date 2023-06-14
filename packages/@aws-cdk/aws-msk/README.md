# Amazon Managed Streaming for Apache Kafka Construct Library
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

[Amazon MSK](https://aws.amazon.com/msk/) is a fully managed service that makes it easy for you to build and run applications that use Apache Kafka to process streaming data.

The following example creates an MSK Cluster.

```ts
declare const vpc: ec2.Vpc;
const cluster = new msk.Cluster(this, 'Cluster', {
  clusterName: 'myCluster',
  kafkaVersion: msk.KafkaVersion.V2_8_1,
  vpc,
});
```

## Allowing Connections

To control who can access the Cluster, use the `.connections` attribute. For a list of ports used by MSK, refer to the [MSK documentation](https://docs.aws.amazon.com/msk/latest/developerguide/client-access.html#port-info).

```ts
declare const vpc: ec2.Vpc;
const cluster = new msk.Cluster(this, 'Cluster', {
  clusterName: 'myCluster',
  kafkaVersion: msk.KafkaVersion.V2_8_1,
  vpc,
});

cluster.connections.allowFrom(
  ec2.Peer.ipv4('1.2.3.4/8'),
  ec2.Port.tcp(2181),
);
cluster.connections.allowFrom(
  ec2.Peer.ipv4('1.2.3.4/8'),
  ec2.Port.tcp(9094),
);
```

## Cluster Endpoints

You can use the following attributes to get a list of the Kafka broker or ZooKeeper node endpoints

```ts
declare const cluster: msk.Cluster;
new CfnOutput(this, 'BootstrapBrokers', { value: cluster.bootstrapBrokers });
new CfnOutput(this, 'BootstrapBrokersTls', { value: cluster.bootstrapBrokersTls });
new CfnOutput(this, 'BootstrapBrokersSaslScram', { value: cluster.bootstrapBrokersSaslScram });
new CfnOutput(this, 'ZookeeperConnection', { value: cluster.zookeeperConnectionString });
new CfnOutput(this, 'ZookeeperConnectionTls', { value: cluster.zookeeperConnectionStringTls });
```

## Importing an existing Cluster

To import an existing MSK cluster into your CDK app use the `.fromClusterArn()` method.

```ts
const cluster = msk.Cluster.fromClusterArn(this, 'Cluster', 
  'arn:aws:kafka:us-west-2:1234567890:cluster/a-cluster/11111111-1111-1111-1111-111111111111-1',
);
```

## Client Authentication

[MSK supports](https://docs.aws.amazon.com/msk/latest/developerguide/kafka_apis_iam.html) the following authentication mechanisms.

> Only one authentication method can be enabled.

### TLS

To enable client authentication with TLS set the `certificateAuthorityArns` property to reference your ACM Private CA. [More info on Private CAs.](https://docs.aws.amazon.com/msk/latest/developerguide/msk-authentication.html)

```ts
import * as acmpca from '@aws-cdk/aws-acmpca';

declare const vpc: ec2.Vpc;
const cluster = new msk.Cluster(this, 'Cluster', {
  clusterName: 'myCluster',
  kafkaVersion: msk.KafkaVersion.V2_8_1,
  vpc,
  encryptionInTransit: {
    clientBroker: msk.ClientBrokerEncryption.TLS,
  },
  clientAuthentication: msk.ClientAuthentication.tls({
    certificateAuthorities: [
      acmpca.CertificateAuthority.fromCertificateAuthorityArn(
        this,
        'CertificateAuthority',
        'arn:aws:acm-pca:us-west-2:1234567890:certificate-authority/11111111-1111-1111-1111-111111111111',
      ),
    ],
  }),
});
```

### SASL/SCRAM

Enable client authentication with [SASL/SCRAM](https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html):

```ts
declare const vpc: ec2.Vpc;
const cluster = new msk.Cluster(this, 'cluster', {
  clusterName: 'myCluster',
  kafkaVersion: msk.KafkaVersion.V2_8_1,
  vpc,
  encryptionInTransit: {
    clientBroker: msk.ClientBrokerEncryption.TLS,
  },
  clientAuthentication: msk.ClientAuthentication.sasl({
    scram: true,
  }),
});
```

### SASL/IAM

Enable client authentication with [IAM](https://docs.aws.amazon.com/msk/latest/developerguide/iam-access-control.html):

```ts
declare const vpc: ec2.Vpc;
const cluster = new msk.Cluster(this, 'cluster', {
  clusterName: 'myCluster',
  kafkaVersion: msk.KafkaVersion.V2_8_1,
  vpc,
  encryptionInTransit: {
    clientBroker: msk.ClientBrokerEncryption.TLS,
  },
  clientAuthentication: msk.ClientAuthentication.sasl({
    iam: true,
  }),
});
```
