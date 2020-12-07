# Amazon Redshift Construct Library
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

## Starting a Redshift Cluster Database

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

By default, the cluster will not be publicly accessible.
Depending on your use case, you can make the cluster publicly accessible with the `publiclyAccessible` property.

## Connecting

To control who can access the cluster, use the `.connections` attribute. Redshift Clusters have
a default port, so you don't need to specify the port:

```ts
cluster.connections.allowFromAnyIpv4('Open to the world');
```

The endpoint to access your database cluster will be available as the `.clusterEndpoint` attribute:

```ts
cluster.clusterEndpoint.socketAddress;   // "HOSTNAME:PORT"
```

## Rotating credentials

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
