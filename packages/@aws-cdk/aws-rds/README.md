## Amazon Relational Database Service Construct Library
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

### Starting a Clustered Database

To set up a clustered database (like Aurora), define a `DatabaseCluster`. You must
always launch a database in a VPC. Use the `vpcSubnets` attribute to control whether
your instances will be launched privately or publicly:

```ts
const cluster = new DatabaseCluster(this, 'Database', {
    engine: DatabaseClusterEngine.AURORA,
    masterUser: {
        username: 'admin'
    },
    instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
        vpcSubnets: {
            subnetType: ec2.SubnetType.PUBLIC,
        },
        vpc
    }
});
```
By default, the master password will be generated and stored in AWS Secrets Manager with auto-generated description.

Your cluster will be empty by default. To add a default database upon construction, specify the
`defaultDatabaseName` attribute.

### Starting an Instance Database
To set up a instance database, define a `DatabaseInstance`. You must
always launch a database in a VPC. Use the `vpcSubnets` attribute to control whether
your instances will be launched privately or publicly:

```ts
const instance = new DatabaseInstance(stack, 'Instance', {
    engine: rds.DatabaseInstanceEngine.ORACLE_SE1,
    instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
    masterUsername: 'syscdk',
    vpc
});
```
By default, the master password will be generated and stored in AWS Secrets Manager.

Use `DatabaseInstanceFromSnapshot` and `DatabaseInstanceReadReplica` to create an instance from snapshot or
a source database respectively:

```ts
new DatabaseInstanceFromSnapshot(stack, 'Instance', {
    snapshotIdentifier: 'my-snapshot',
    engine: rds.DatabaseInstanceEngine.POSTGRES,
    instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.LARGE),
    vpc
});

new DatabaseInstanceReadReplica(stack, 'ReadReplica', {
    sourceDatabaseInstance: sourceInstance,
    engine: rds.DatabaseInstanceEngine.POSTGRES,
    instanceClass: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.LARGE),
    vpc
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
  secret: myImportedSecret // This secret must have the `masterarn` key
});
```

It's also possible to create user credentials together with the instance/cluster and add rotation:
```ts
const myUserSecret = new rds.DatabaseSecret(this, 'MyUserSecret', {
  username: 'myuser'
  masterSecret: instance.secret
});
const myUserSecretAttached = myUserSecret.attach(instance); // Adds DB connections information in the secret

instance.addRotationMultiUser('MyUser', { // Add rotation using the multi user scheme
  secret: myUserSecretAttached
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
functionality, set the s3ImportBuckets and s3ExportBuckets properties for import and export respectively. When
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
const importBucket = new s3.Bucket(this, 'importbucket');
const exportBucket = new s3.Bucket(this, 'exportbucket');
new DatabaseCluster(this, 'dbcluster', {
    // ...
    s3ImportBuckets: [ importBucket ],
    s3ExportBuckets: [ exportBucket ]
});
```
