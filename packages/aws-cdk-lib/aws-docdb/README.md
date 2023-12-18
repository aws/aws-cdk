# Amazon DocumentDB Construct Library


## Starting a Clustered Database

To set up a clustered DocumentDB database, define a `DatabaseCluster`. You must
always launch a database in a VPC. Use the `vpcSubnets` attribute to control whether
your instances will be launched privately or publicly:

```ts
declare const vpc: ec2.Vpc;
const cluster = new docdb.DatabaseCluster(this, 'Database', {
  masterUser: {
    username: 'myuser', // NOTE: 'admin' is reserved by DocumentDB
    excludeCharacters: '\"@/:', // optional, defaults to the set "\"@/" and is also used for eventually created rotations
    secretName: '/myapp/mydocdb/masteruser', // optional, if you prefer to specify the secret name
  },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.MEMORY5, ec2.InstanceSize.LARGE),
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
  vpc,
});
```

By default, the master password will be generated and stored in AWS Secrets Manager with auto-generated description.

Your cluster will be empty by default.

## Connecting

To control who can access the cluster, use the `.connections` attribute. DocumentDB databases have a default port, so
you don't need to specify the port:

```ts
declare const cluster: docdb.DatabaseCluster;
cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');
```

The endpoints to access your database cluster will be available as the `.clusterEndpoint` and `.clusterReadEndpoint`
attributes:

```ts
declare const cluster: docdb.DatabaseCluster;
const writeAddress = cluster.clusterEndpoint.socketAddress;   // "HOSTNAME:PORT"
```

If you have existing security groups you would like to add to the cluster, use the `addSecurityGroups` method. Security
groups added in this way will not be managed by the `Connections` object of the cluster.

```ts
declare const vpc: ec2.Vpc;
declare const cluster: docdb.DatabaseCluster;

const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
  vpc,
});
cluster.addSecurityGroups(securityGroup);
```

## Deletion protection

Deletion protection can be enabled on an Amazon DocumentDB cluster to prevent accidental deletion of the cluster:

```ts
declare const vpc: ec2.Vpc;
const cluster = new docdb.DatabaseCluster(this, 'Database', {
  masterUser: {
    username: 'myuser',
  },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.MEMORY5, ec2.InstanceSize.LARGE),
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
  vpc,
  deletionProtection: true, // Enable deletion protection.
});
```

## Rotating credentials

When the master password is generated and stored in AWS Secrets Manager, it can be rotated automatically:

```ts
declare const cluster: docdb.DatabaseCluster;
cluster.addRotationSingleUser(); // Will rotate automatically after 30 days
```

[example of setting up master password rotation for a cluster](test/integ.cluster-rotation.lit.ts)

The multi user rotation scheme is also available:

```ts
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

declare const myImportedSecret: secretsmanager.Secret;
declare const cluster: docdb.DatabaseCluster;

cluster.addRotationMultiUser('MyUser', {
  secret: myImportedSecret, // This secret must have the `masterarn` key
});
```

It's also possible to create user credentials together with the cluster and add rotation:

```ts
declare const cluster: docdb.DatabaseCluster;
const myUserSecret = new docdb.DatabaseSecret(this, 'MyUserSecret', {
  username: 'myuser',
  masterSecret: cluster.secret,
});
const myUserSecretAttached = myUserSecret.attach(cluster); // Adds DB connections information in the secret

cluster.addRotationMultiUser('MyUser', { // Add rotation using the multi user scheme
  secret: myUserSecretAttached, // This secret must have the `masterarn` key
});
```

**Note**: This user must be created manually in the database using the master credentials.
The rotation will start as soon as this user exists.

See also [aws-cdk-lib/aws-secretsmanager](https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-secretsmanager/README.md) for credentials rotation of existing clusters.

## Audit and profiler Logs

Sending audit or profiler needs to be configured in two places:

1. Check / create the needed options in your ParameterGroup for [audit](https://docs.aws.amazon.com/documentdb/latest/developerguide/event-auditing.html#event-auditing-enabling-auditing) and
[profiler](https://docs.aws.amazon.com/documentdb/latest/developerguide/profiling.html#profiling.enable-profiling) logs.
2. Enable the corresponding option(s) when creating the `DatabaseCluster`:

```ts
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from'aws-cdk-lib/aws-logs';

declare const myLogsPublishingRole: iam.Role;
declare const vpc: ec2.Vpc;

const cluster = new docdb.DatabaseCluster(this, 'Database', {
  masterUser: {
    username: 'myuser',
  },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.MEMORY5, ec2.InstanceSize.LARGE),
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
  vpc,
  exportProfilerLogsToCloudWatch: true, // Enable sending profiler logs
  exportAuditLogsToCloudWatch: true, // Enable sending audit logs
  cloudWatchLogsRetention: logs.RetentionDays.THREE_MONTHS, // Optional - default is to never expire logs
  cloudWatchLogsRetentionRole: myLogsPublishingRole, // Optional - a role will be created if not provided
});
```

## Enable Performance Insights

By enabling this feature it will be cascaded and enabled in all instances inside the cluster:

```ts
declare const vpc: ec2.Vpc;

const cluster = new docdb.DatabaseCluster(this, 'Database', {
  masterUser: {
    username: 'myuser',
  },
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.MEMORY5, ec2.InstanceSize.LARGE),
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
  vpc,
  enablePerformanceInsights: true, // Enable Performance Insights in all instances under this cluster
});
```
