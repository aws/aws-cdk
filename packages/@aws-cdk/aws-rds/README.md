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
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_08_1 }),
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

If there isn't a constant for the exact version you want to use,
all of the `Version` classes have a static `of` method that can be used to create an arbitrary version.

```ts
const customEngineVersion = rds.AuroraMysqlEngineVersion.of('5.7.mysql_aurora.2.08.1');
```

By default, the master password will be generated and stored in AWS Secrets Manager with auto-generated description.

Your cluster will be empty by default. To add a default database upon construction, specify the
`defaultDatabaseName` attribute.

Use `DatabaseClusterFromSnapshot` to create a cluster from a snapshot:

```ts
new rds.DatabaseClusterFromSnapshot(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.aurora({ version: rds.AuroraEngineVersion.VER_1_22_2 }),
  instanceProps: {
    vpc,
  },
  snapshotIdentifier: 'mySnapshot',
});
```

### Starting an instance database

To set up a instance database, define a `DatabaseInstance`. You must
always launch a database in a VPC. Use the `vpcSubnets` attribute to control whether
your instances will be launched privately or publicly:

```ts
const instance = new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 }),
  // optional, defaults to m5.large
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
  masterUsername: 'syscdk',
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE
  }
});
```

If there isn't a constant for the exact engine version you want to use,
all of the `Version` classes have a static `of` method that can be used to create an arbitrary version.

```ts
const customEngineVersion = rds.OracleEngineVersion.of('19.0.0.0.ru-2020-04.rur-2020-04.r1', '19');
```

By default, the master password will be generated and stored in AWS Secrets Manager.

To use the storage auto scaling option of RDS you can specify the maximum allocated storage.
This is the upper limit to which RDS can automatically scale the storage. More info can be found
[here](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.StorageTypes.html#USER_PIOPS.Autoscaling)
Example for max storage configuration:

```ts
const instance = new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_12_3 }),
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
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_12_3 }),
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

### IAM Authentication

You can also authenticate to a database instance using AWS Identity and Access Management (IAM) database authentication;
See https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html for more information
and a list of supported versions and limitations.

The following example shows enabling IAM authentication for a database instance and granting connection access to an IAM role.

```ts
const instance = new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_19 }),
  masterUsername: 'admin',
  vpc,
  iamAuthentication: true, // Optional - will be automatically set if you call grantConnect().
});
const role = new Role(stack, 'DBRole', { assumedBy: new AccountPrincipal(stack.account) });
instance.grantConnect(role); // Grant the role connection access to the DB.
```

**Note**: In addition to the setup above, a database user will need to be created to support IAM auth.
See https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.DBAccounts.html for setup instructions.

### Kerberos Authentication

You can also authenticate using Kerberos to a database instance using AWS Managed Microsoft AD for authentication;
See https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/kerberos-authentication.html for more information
and a list of supported versions and limitations.

The following example shows enabling domain support for a database instance and creating an IAM role to access
Directory Services.

```ts
const role = new iam.Role(stack, 'RDSDirectoryServicesRole', {
  assumedBy: new iam.ServicePrincipal('rds.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonRDSDirectoryServiceAccess'),
  ],
});
const instance = new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_19 }),
  masterUsername: 'admin',
  vpc,
  domain: 'd-????????', // The ID of the domain for the instance to join.
  domainRole: role, // Optional - will be create automatically if not provided.
});
```

**Note**: In addition to the setup above, you need to make sure that the database instance has network connectivity
to the domain controllers. This includes enabling cross-VPC traffic if in a different VPC and setting up the
appropriate security groups/network ACL to allow traffic between the database instance and domain controllers.
Once configured, see https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/kerberos-authentication.html for details
on configuring users for each available database engine.

### Metrics

Database instances and clusters both expose metrics (`cloudwatch.Metric`):

```ts
// The number of database connections in use (average over 5 minutes)
const dbConnections = instance.metricDatabaseConnections();

// Average CPU utilization over 5 minutes
const cpuUtilization = cluster.metricCPUUtilization();

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

### Exporting Logs

You can publish database logs to Amazon CloudWatch Logs. With CloudWatch Logs, you can perform real-time analysis of the log data,
store the data in highly durable storage, and manage the data with the CloudWatch Logs Agent. This is available for both database
instances and clusters; the types of logs available depend on the database type and engine being used.

```ts
// Exporting logs from a cluster
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.aurora({
    version: rds.AuroraEngineVersion.VER_1_17_9, // different version class for each engine type
  },
  // ...
  cloudwatchLogsExports: ['error', 'general', 'slowquery', 'audit'], // Export all available MySQL-based logs
  cloudwatchLogsRetention: logs.RetentionDays.THREE_MONTHS, // Optional - default is to never expire logs
  cloudwatchLogsRetentionRole: myLogsPublishingRole, // Optional - a role will be created if not provided
  // ...
});

// Exporting logs from an instance
const instance = new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({
    version: rds.PostgresEngineVersion.VER_12_3,
  }),
  // ...
  cloudwatchLogsExports: ['postgresql'], // Export the PostgreSQL logs
  // ...
});
```

### Option Groups

Some DB engines offer additional features that make it easier to manage data and databases, and to provide additional security for your database.
Amazon RDS uses option groups to enable and configure these features. An option group can specify features, called options,
that are available for a particular Amazon RDS DB instance.

```ts
const vpc: ec2.IVpc = ...;
const securityGroup: ec2.ISecurityGroup = ...;
new rds.OptionGroup(stack, 'Options', {
  engine: rds.DatabaseInstanceEngine.oracleSe2({
    version: rds.OracleEngineVersion.VER_19,
  }),
  configurations: [
    {
      name: 'OEM',
      port: 5500,
      vpc,
      securityGroups: [securityGroup], // Optional - a default group will be created if not provided.
    },
  ],
});
```

### Serverless

[Amazon Aurora Serverless]((https://aws.amazon.com/rds/aurora/serverless/)) is an on-demand, auto-scaling configuration for Amazon
Aurora. The databse will automatically start up, shut down, and scale capacity
up or down based on your application's needs. It enables you to run your database
in the cloud without managing any database instances.

The following example initializes an Aurora Serverless PostgreSql cluster.
Aurora Serverless clusters can specify scaling properties which will be used to
automatically scale the database cluster seamlessly based on the workload. 

```ts
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';

const vpc = new ec2.Vpc(this, 'myrdsvpc');

const cluster = new rds.ServerlessDatabaseCluster(this, 'AnotherCluster', {
  engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
  masterUser: { username: 'shiv'},
  parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-postgresql10'),
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE },
  scaling: {
    autoPause: true,
    minCapacity: 2,
    maxCapacity: 32,
  }
});
```
Aurora Serverless Clusters do not support the following features:
* Loading data from an Amazon S3 bucket
* Saving data to an Amazon S3 bucket
* Invoking an AWS Lambda function with an Aurora MySQL native function
* Aurora replicas
* Backtracking
* Multi-master clusters
* Database cloning
* IAM database cloning
* IAM database authentication
* Restoring a snapshot from MySQL DB instance
* Performance Insights

Read more about the [limitations of Aurora Serverless](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html#aurora-serverless.limitations)

Learn more about using Amazon Aurora Serverless by reading the [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html)