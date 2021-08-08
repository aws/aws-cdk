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

## Database Resources

This module allows for the creation of non-CloudFormation database resources via [custom
resources](https://docs.aws.amazon.com/cdk/api/latest/docs/custom-resources-readme.html).
These resources include database users and database tables.

### Creating Users

Create a user within a Redshift cluster database by instantiating a `User` construct. This
will generate a username and password, store the credentials in a [Secrets Manager
`Secret`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-secretsmanager.Secret.html),
and make a query to the Redshift cluster to create a new database user with the
credentials.

```ts
new redshift.User(this, 'User', {
  cluster: cluster,
  databaseName: 'databaseName',
});
```

By default, the user credentials are encrypted with your AWS account's default Secrets
Manager encryption key. You can specify the encryption key used for this purpose by
supplying a key in the `encryptionKey` property.

```ts
import * as kms from '@aws-cdk/aws-kms';

const encryptionKey = new kms.Key(this, 'Key');
new redshift.User(stack, 'User', {
  encryptionKey: encryptionKey,
  cluster: cluster,
  databaseName: 'databaseName',
});
```

### Creating Tables

Create a table within a Redshift cluster database by instantiating a `Table`
construct. This will make a query to the Redshift cluster to create a new database table
with the supplied schema.

```ts
new redshift.Table(this, 'Table', {
  cluster: cluster,
  databaseName: 'databaseName',
  tableColumns: [{ name: 'col1', dataType: 'varchar(4)' }, { name: 'col2', dataType: 'float' }],
});
```

### Granting Privileges

You can give a user privileges to perform certain actions on a table by using the `User.addPrivilege` method.

```ts
const databaseProps = {
  cluster: cluster,
  databaseName: 'databaseName',
};
const user = new redshift.User(this, 'User', databaseProps);
const table = new redshift.Table(this, 'Table', {
  ...databaseProps,
  tableColumns: [{ name: 'col1', dataType: 'varchar(4)' }, { name: 'col2', dataType: 'float' }],
});

user.addPrivilege(table, Privilege.INSERT, Privilege.UPDATE);
```

Privileges on the table can also be given by using the `Table.grant` method.

```ts
table.grant(user, Privilege.DROP, Privilege.SELECT);
```
