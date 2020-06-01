## Amazon Redshift Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

---
<!--END STABILITY BANNER-->

### Starting a Redshift Cluster Database

To set up a Redshift cluster, define a `Cluster`. It will be launched in a VPC.
You can specify a VPC, otherwise one will be created. The nodes are always launched in private subnets and are encrypted by default.

``` typescript
import redshift = require('@aws-cdk/aws-redshift');
...
const cluster = new redshift.Cluster(this, 'Redshift', {
    masterUser: {
      masterUsername: 'admin',
    },
    vpc
  });
```
By default, the master password will be generated and stored in AWS Secrets Manager.

A default database named `default_db` will be created in the cluster. To change the name of this database set the `defaultDatabaseName` attribute in the constructor properties.

### Connecting

To control who can access the cluster, use the `.connections` attribute. Redshift Clusters have
a default port, so you don't need to specify the port:

```ts
cluster.connections.allowFromAnyIpv4('Open to the world');
```

The endpoint to access your database cluster will be available as the `.clusterEndpoint` attribute:

```ts
cluster.clusterEndpoint.socketAddress;   // "HOSTNAME:PORT"
```

### Rotating credentials

When the master password is generated and stored in AWS Secrets Manager, it can be rotated automatically:
```ts
cluster.addRotationSingleUser(); // Will rotate automatically after 30 days
```

The multi user rotation scheme is also available:
```ts
cluster.addRotationMultiUser('MyUser', {
  secret: myImportedSecret
});
```

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.
