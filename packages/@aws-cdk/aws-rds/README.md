## Amazon Relational Database Service Construct Library

<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Developer Preview](https://img.shields.io/badge/cdk--constructs-developer--preview-informational.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are in **developer preview** before they become stable. We will only make breaking changes to address unforeseen API issues. Therefore, these APIs are not subject to [Semantic Versioning](https://semver.org/), and breaking changes will be announced in release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

```typescript
import * as rds from '@aws-cdk/aws-rds';
```

### Starting a clustered database

To set up a clustered database (like Aurora), define a `DatabaseCluster`. You must
always launch a database in a VPC. Use the `vpcSubnets` attribute to control whether
your instances will be launched privately or publicly:

```ts
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.AURORA,
  masterUser: {
    username: 'clusteradmin'
  },
  instanceProps: {
    // optional, defaults to t3.medium
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
    vpcSubnets: {
      subnetType: ec2.SubnetType.PRIVATE,
    },
    vpc,
  },
});
```

To use a specific version of the engine
(which is recommended, in order to avoid surprise updates when RDS add support for a newer version of the engine),
use the static factory methods on `DatabaseClusterEngine`:

```typescript
new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.aurora({
    version: rds.AuroraEngineVersion.VER_1_17_9, // different version class for each engine type
  },
  ...
})
```

If there isn't a constant for the exact version you want to use,
all of the `Version` classes have a static `of` method that can be used to create an arbitrary version.

By default, the master password will be generated and stored in AWS Secrets Manager with auto-generated description.

Your cluster will be empty by default. To add a default database upon construction, specify the
`defaultDatabaseName` attribute.

### Starting an instance database

To set up a instance database, define a `DatabaseInstance`. You must
always launch a database in a VPC. Use the `vpcSubnets` attribute to control whether
your instances will be launched privately or publicly:

```ts
const instance = new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.ORACLE_SE1,
  // optional, defaults to m5.large
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
  masterUsername: 'syscdk',
  vpc,
});
```

By default, the master password will be generated and stored in AWS Secrets Manager.

To use a specific version of the engine
(which is recommended, in order to avoid surprise updates when RDS add support for a newer version of the engine),
use the static factory methods on `DatabaseInstanceEngine`:

```typescript
const instance = new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.oracleSe2({
    version: rds.OracleEngineVersion.VER_19, // different version class for each engine type
  }),
  ...
});
```

If there isn't a constant for the exact version you want to use,
all of the `Version` classes have a static `of` method that can be used to create an arbitrary version.

To use the storage auto scaling option of RDS you can specify the maximum allocated storage.
This is the upper limit to which RDS can automatically scale the storage. More info can be found
[here](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.StorageTypes.html#USER_PIOPS.Autoscaling)
Example for max storage configuration:

```ts
const instance = new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.ORACLE_SE1,       
  // optional, defaults to m5.large
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
  masterUsername: 'syscdk',
  vpc,
  maxAllocatedStorage: 200,
});
```

Use `DatabaseInstanceFromSnapshot` and `DatabaseInstanceReadReplica` to create an instance from snapshot or
a source database respectively:

```ts
new rds.DatabaseInstanceFromSnapshot(stack, 'Instance', {
  snapshotIdentifier: 'my-snapshot',
  engine: rds.DatabaseInstanceEngine.POSTGRES,     
  // optional, defaults to m5.large
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.LARGE),
  vpc,
});

new rds.DatabaseInstanceReadReplica(stack, 'ReadReplica', {
  sourceDatabaseInstance: sourceInstance,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.LARGE),
  vpc,
});
```

Creating a "production" Oracle database instance with option and parameter groups:

[example of setting up a production oracle instance](test/integ.instance.lit.ts)

### Instance events

To define Amazon CloudWatch event rules for database instances, use the `onEvent`
method:

```ts
const rule = instance.onEvent('InstanceEvent', { target: new targets.LambdaFunction(fn) });
```

### Connecting

To control who can access the cluster or instance, use the `.connections` attribute. RDS databases have
a default port, so you don't need to specify the port:

```ts
cluster.connections.allowFromAnyIpv4('Open to the world');
```

The endpoints to access your database cluster will be available as the `.clusterEndpoint` and `.readerEndpoint`
attributes:

```ts
const writeAddress = cluster.clusterEndpoint.socketAddress;   // "HOSTNAME:PORT"
```

For an instance database:
```ts
const address = instance.instanceEndpoint.socketAddress;   // "HOSTNAME:PORT"
```

### Rotating credentials

When the master password is generated and stored in AWS Secrets Manager, it can be rotated automatically:

```ts
instance.addRotationSingleUser(); // Will rotate automatically after 30 days
```

[example of setting up master password rotation for a cluster](test/integ.cluster-rotation.lit.ts)

The multi user rotation scheme is also available:

```ts
instance.addRotationMultiUser('MyUser', {
  secret: myImportedSecret, // This secret must have the `masterarn` key
});
```

It's also possible to create user credentials together with the instance/cluster and add rotation:

```ts
const myUserSecret = new rds.DatabaseSecret(this, 'MyUserSecret', {
  username: 'myuser',
  masterSecret: instance.secret,
});
const myUserSecretAttached = myUserSecret.attach(instance); // Adds DB connections information in the secret

instance.addRotationMultiUser('MyUser', { // Add rotation using the multi user scheme
  secret: myUserSecretAttached,
});
```

**Note**: This user must be created manually in the database using the master credentials.
The rotation will start as soon as this user exists.

See also [@aws-cdk/aws-secretsmanager](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-secretsmanager/README.md) for credentials rotation of existing clusters/instances.

### Metrics

Database instances expose metrics (`cloudwatch.Metric`):

```ts
// The number of database connections in use (average over 5 minutes)
const dbConnections = instance.metricDatabaseConnections();

// The average amount of time taken per disk I/O operation (average over 1 minute)
const readLatency = instance.metric('ReadLatency', { statistic: 'Average', periodSec: 60 });
```

### Enabling S3 integration to a cluster (non-serverless Aurora only)

Data in S3 buckets can be imported to and exported from Aurora databases using SQL queries. To enable this
functionality, set the `s3ImportBuckets` and `s3ExportBuckets` properties for import and export respectively. When
configured, the CDK automatically creates and configures IAM roles as required.
Additionally, the `s3ImportRole` and `s3ExportRole` properties can be used to set this role directly.

For Aurora MySQL, read more about [loading data from
S3](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Integrating.LoadFromS3.html) and [saving
data into S3](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Integrating.SaveIntoS3.html).

For Aurora PostgreSQL, read more about [loading data from
S3](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Migrating.html) and [saving 
data into S3](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/postgresql-s3-export.html).

The following snippet sets up a database cluster with different S3 buckets where the data is imported and exported - 

```ts
import * as s3 from '@aws-cdk/aws-s3';

const importBucket = new s3.Bucket(this, 'importbucket');
const exportBucket = new s3.Bucket(this, 'exportbucket');
new rds.DatabaseCluster(this, 'dbcluster', {
  // ...
  s3ImportBuckets: [importBucket],
  s3ExportBuckets: [exportBucket],
});
```

### Creating a Database Proxy

Amazon RDS Proxy sits between your application and your relational database to efficiently manage
connections to the database and improve scalability of the application. Learn more about at [Amazon RDS Proxy](https://aws.amazon.com/rds/proxy/)

The following code configures an RDS Proxy for a `DatabaseInstance`.

```ts
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as secrets from '@aws-cdk/aws-secretsmanager';

const vpc: ec2.IVpc = ...;
const securityGroup: ec2.ISecurityGroup = ...;
const secrets: secrets.ISecret[] = [...];
const dbInstance: rds.IDatabaseInstance = ...;

const proxy = dbInstance.addProxy('proxy', {
    connectionBorrowTimeout: cdk.Duration.seconds(30),
    maxConnectionsPercent: 50,
    secrets,
    vpc,
});
```
