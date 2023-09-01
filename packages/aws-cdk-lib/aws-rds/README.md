# Amazon Relational Database Service Construct Library



```ts nofixture
import * as rds from 'aws-cdk-lib/aws-rds';
```

## Starting a clustered database

To set up a clustered database (like Aurora), define a `DatabaseCluster`. You must
always launch a database in a VPC. Use the `vpcSubnets` attribute to control whether
your instances will be launched privately or publicly:

You must specify the instance to use as the writer, along with an optional list
of readers (up to 15).

```ts
declare const vpc: ec2.Vpc;
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_08_1 }),
  credentials: rds.Credentials.fromGeneratedSecret('clusteradmin'), // Optional - will default to 'admin' username and generated password
  writer: rds.ClusterInstance.provisioned('writer', {
    publiclyAccessible: false,
  }),
  readers: [
    rds.ClusterInstance.provisioned('reader1', { promotionTier: 1 }),
    rds.ClusterInstance.serverlessV2('reader2'),
  ],
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
  },
  vpc,
});
```

To adopt Aurora I/O-Optimized. Speicify `DBClusterStorageType.AURORA_IOPT1` on the `storageType` property.

```ts
declare const vpc: ec2.Vpc;
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_15_2 }),
  credentials: rds.Credentials.fromUsername('adminuser', { password: SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
  instanceProps: {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.X2G, ec2.InstanceSize.XLARGE),
    vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    vpc,
  },
  storageType: rds.DBClusterStorageType.AURORA_IOPT1,
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

To use dual-stack mode, specify `NetworkType.DUAL` on the `networkType` property:

```ts
declare const vpc: ec2.Vpc; // VPC and subnets must have IPv6 CIDR blocks
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_02_1 }),
  writer: rds.ClusterInstance.provisioned('writer', {
    publiclyAccessible: false,
  }),
  vpc,
  networkType: rds.NetworkType.DUAL,
});
```

For more information about dual-stack mode, see [Working with a DB cluster in a VPC](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html).

Use `DatabaseClusterFromSnapshot` to create a cluster from a snapshot:

```ts
declare const vpc: ec2.Vpc;
new rds.DatabaseClusterFromSnapshot(this, 'Database', {
  engine: rds.DatabaseClusterEngine.aurora({ version: rds.AuroraEngineVersion.VER_1_22_2 }),
  writer: rds.ClusterInstance.provisioned('writer'),
  vpc,
  snapshotIdentifier: 'mySnapshot',
});
```

### Updating the database instances in a cluster

Database cluster instances may be updated in bulk or on a rolling basis.

An update to all instances in a cluster may cause significant downtime. To reduce the downtime, set the
`instanceUpdateBehavior` property in `DatabaseClusterBaseProps` to `InstanceUpdateBehavior.ROLLING`.
This adds a dependency between each instance so the update is performed on only one instance at a time.

Use `InstanceUpdateBehavior.BULK` to update all instances at once.

```ts
declare const vpc: ec2.Vpc;
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_01_0 }),
  writer: rds.ClusterInstance.provisioned('Instance', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
  }),
  readers: [rds.ClusterInstance.provisioned('reader')],
  instanceUpdateBehaviour: rds.InstanceUpdateBehaviour.ROLLING, // Optional - defaults to rds.InstanceUpdateBehaviour.BULK
  vpc,
});
```

### Serverless V2 instances in a Cluster

It is possible to create an RDS cluster with _both_ serverlessV2 and provisioned
instances. For example, this will create a cluster with a provisioned writer and
a serverless v2 reader.

> *Note* Before getting starting with this type of cluster it is
> highly recommended that you read through the [Developer Guide](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.setting-capacity.html)
> which goes into much more detail on the things you need to take into
> consideration.

```ts
declare const vpc: ec2.Vpc;
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_01_0 }),
  writer: rds.ClusterInstance.provisioned('writer'),
  readers: [
    rds.ClusterInstance.serverlessV2('reader'),
  ],
  vpc,
});
```

### Monitoring

There are some CloudWatch metrics that are [important for Aurora Serverless
v2](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.setting-capacity.html#aurora-serverless-v2.viewing.monitoring).

- `ServerlessDatabaseCapacity`: An instance-level metric that can also be
  evaluated at the cluster level. At the cluster-level it represents the average
  capacity of all the instances in the cluster.
- `ACUUtilization`: Value of the `ServerlessDatabaseCapacity`/ max ACU of the
  cluster.

```ts
declare const vpc: ec2.Vpc;
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_01_0 }),
  writer: rds.ClusterInstance.provisioned('writer'),
  readers: [
    rds.ClusterInstance.serverlessV2('reader'),
  ],
  vpc,
});

cluster.metricServerlessDatabaseCapacity({
  period: Duration.minutes(10),
}).createAlarm(this, 'capacity', {
    threshold: 1.5,
    evaluationPeriods: 3,
});
cluster.metricACUUtilization({
  period: Duration.minutes(10),
}).createAlarm(this, 'alarm', {
  evaluationPeriods: 3,
  threshold: 90,
});
```

#### Capacity & Scaling

There are some things to take into consideration with Aurora Serverless v2.

To create a cluster that can support serverless v2 instances you configure a
minimum and maximum capacity range on the cluster. This is an example showing 
the default values:

```ts
declare const vpc: ec2.Vpc;
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_01_0 }),
  writer: rds.ClusterInstance.serverlessV2('writer'),
  serverlessV2MinCapacity: 0.5,
  serverlessV2MaxCapacity: 2,
  vpc,
});
```

The capacity is defined as a number of Aurora capacity units (ACUs). You can
specify in half-step increments (40, 40.5, 41, etc). Each serverless instance in
the cluster inherits the capacity that is defined on the cluster. It is not
possible to configure separate capacity at the instance level.

The maximum capacity is mainly used for budget control since it allows you to
set a cap on how high your instance can scale.

The minimum capacity is a little more involved. This controls a couple different
things.

* The scale-up rate is proportional to the current capacity (larger instances
  scale up faster)
  * Adjust the minimum capacity to obtain a suitable scaling rate
* Network throughput is proportional to capacity

> *Info* More complete details can be found [in the docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.setting-capacity.html#aurora-serverless-v2-examples-setting-capacity-range-for-cluster)

Another way that you control the capacity/scaling of your serverless v2 reader
instances is based on the [promotion tier](https://aws.amazon.com/blogs/aws/additional-failover-control-for-amazon-aurora/)
which can be between 0-15. Any serverless v2 instance in the 0-1 tiers will scale alongside the
writer even if the current read load does not require the capacity. This is
because instances in the 0-1 tier are first priority for failover and Aurora
wants to ensure that in the event of a failover the reader that gets promoted is
scaled to handle the write load.

```ts
declare const vpc: ec2.Vpc;
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_08_1 }),
  writer: rds.ClusterInstance.serverlessV2('writer'),
  readers: [
    // will be put in promotion tier 1 and will scale with the writer
    rds.ClusterInstance.serverlessV2('reader1', { scaleWithWriter: true }),
    // will be put in promotion tier 2 and will not scale with the writer
    rds.ClusterInstance.serverlessV2('reader2'),
  ],
  vpc,
});
```

* When the writer scales up, any readers in tier 0-1 will scale up to match
* Scaling for tier 2-15 is independent of what is happening on the writer
* Readers in tier 2-15 scale up based on read load against the individual reader

When configuring your cluster it is important to take this into consideration
and ensure that in the event of a failover there is an instance that is scaled
up to take over.

### Mixing Serverless v2 and Provisioned instances

You are able to create a cluster that has both provisioned and serverless
instances. [This blog post](https://aws.amazon.com/blogs/database/evaluate-amazon-aurora-serverless-v2-for-your-provisioned-aurora-clusters/)
has an excellent guide on choosing between serverless and provisioned instances
based on use case.

There are a couple of high level differences:

* Engine Version (serverless only supports MySQL 8+ & PostgreSQL 13+)
* Memory up to 256GB can be supported by serverless

#### Provisioned writer

With a provisioned writer and serverless v2 readers, some of the serverless
readers will need to be configured to scale with the writer so they can act as
failover targets. You will need to determine the correct capacity based on the
provisioned instance type and it's utilization.

As an example, if the CPU utilization for a db.r6g.4xlarge (128 GB) instance
stays at 10% most times, then the minimum ACUs may be set at 6.5 ACUs
(10% of 128 GB) and maximum may be set at 64 ACUs (64x2GB=128GB). Keep in mind
that the speed at which the serverless instance can scale up is determined by
the minimum capacity so if your cluster has spiky workloads you may need to set
a higher minimum capacity.

```ts
declare const vpc: ec2.Vpc;
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_08_1 }),
  writer: rds.ClusterInstance.provisioned('writer', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.R6G, ec2.InstanceSize.XLARGE4),
  }),
  serverlessV2MinCapacity: 6.5,
  serverlessV2MaxCapacity: 64,
  readers: [
    // will be put in promotion tier 1 and will scale with the writer
    rds.ClusterInstance.serverlessV2('reader1', { scaleWithWriter: true }),
    // will be put in promotion tier 2 and will not scale with the writer
    rds.ClusterInstance.serverlessV2('reader2'),
  ],
  vpc,
});
```

In the above example `reader1` will scale with the writer based on the writer's
utilization. So if the writer were to go to `50%` utilization then `reader1`
would scale up to use `32` ACUs. If the read load stayed consistent then
`reader2` may remain at `6.5` since it is not configured to scale with the
writer.

If one of your Aurora Serverless v2 DB instances consistently reaches the
limit of its maximum capacity, Aurora indicates this condition by setting the
DB instance to a status of `incompatible-parameters`. While the DB instance has
the incompatible-parameters status, some operations are blocked. For example,
you can't upgrade the engine version.

### Migrating from instanceProps

Creating instances in a `DatabaseCluster` using `instanceProps` & `instances` is
deprecated. To migrate to the new properties you can provide the
`isFromLegacyInstanceProps` property.

For example, in order to migrate from this deprecated config:

```ts
declare const vpc: ec2.Vpc;
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_03_0,
  }),
  instances: 2,
  instanceProps: {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
    vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    vpc,
  },
});
```

You would need to migrate to this. The old method of providing `instanceProps`
and `instances` will create the number of `instances` that you provide. The
first instance will be the writer and the rest will be the readers. It's
important that the `id` that you provide is `Instance{NUMBER}`. The writer
should always be `Instance1` and the readers will increment from there.

Make sure to run a `cdk diff` before deploying to make sure that all changes are
expected. **Always test the migration in a non-production environment first.**

```ts
const instanceProps = {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
  isFromLegacyInstanceProps: true,
};

declare const vpc: ec2.Vpc;
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_03_0,
  }),
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  vpc,
  writer: rds.ClusterInstance.provisioned('Instance1', {
    instanceType: instanceProps.instanceType,
    isFromLegacyInstanceProps: instanceProps.isFromLegacyInstanceProps,
  }),
  readers: [
    rds.ClusterInstance.provisioned('Instance2', {
      instanceType: instanceProps.instanceType,
      isFromLegacyInstanceProps: instanceProps.isFromLegacyInstanceProps,
    }),
  ],
});
```

## Starting an instance database

To set up an instance database, define a `DatabaseInstance`. You must
always launch a database in a VPC. Use the `vpcSubnets` attribute to control whether
your instances will be launched privately or publicly:

```ts
declare const vpc: ec2.Vpc;
const instance = new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.oracleSe2({ version: rds.OracleEngineVersion.VER_19_0_0_0_2020_04_R1 }),
  // optional, defaults to m5.large
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
  credentials: rds.Credentials.fromGeneratedSecret('syscdk'), // Optional - will default to 'admin' username and generated password
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
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
declare const vpc: ec2.Vpc;
const instance = new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15_2 }),
  // optional, defaults to m5.large
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.SMALL),
  vpc,
  maxAllocatedStorage: 200,
});
```

To use dual-stack mode, specify `NetworkType.DUAL` on the `networkType` property:

```ts
declare const vpc: ec2.Vpc; // VPC and subnets must have IPv6 CIDR blocks
const instance = new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15_2 }),
  vpc,
  networkType: rds.NetworkType.DUAL,
  publiclyAccessible: false,
});
```

For more information about dual-stack mode, see [Working with a DB instance in a VPC](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html).

Use `DatabaseInstanceFromSnapshot` and `DatabaseInstanceReadReplica` to create an instance from snapshot or
a source database respectively:

```ts
declare const vpc: ec2.Vpc;
new rds.DatabaseInstanceFromSnapshot(this, 'Instance', {
  snapshotIdentifier: 'my-snapshot',
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15_2 }),
  // optional, defaults to m5.large
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.LARGE),
  vpc,
});

declare const sourceInstance: rds.DatabaseInstance;
new rds.DatabaseInstanceReadReplica(this, 'ReadReplica', {
  sourceDatabaseInstance: sourceInstance,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.LARGE),
  vpc,
});
```

Automatic backups of read replica instances are only supported for MySQL and MariaDB. By default,
automatic backups are disabled for read replicas and can only be enabled (using `backupRetention`)
if also enabled on the source instance.

Creating a "production" Oracle database instance with option and parameter groups:

[example of setting up a production oracle instance](test/integ.instance.lit.ts)

Use the `storageType` property to specify the [type of storage](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html)
to use for the instance:

```ts
declare const vpc: ec2.Vpc;

const iopsInstance = new rds.DatabaseInstance(this, 'IopsInstance', {
  engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_30 }),
  vpc,
  storageType: rds.StorageType.IO1,
  iops: 5000,
});

const gp3Instance = new rds.DatabaseInstance(this, 'Gp3Instance', {
  engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_30 }),
  vpc,
  allocatedStorage: 500,
  storageType: rds.StorageType.GP3,
  storageThroughput: 500, // only applicable for GP3
});
```

Use the `caCertificate` property to specify the [CA certificates](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL-certificate-rotation.html)
to use for the instance:

```ts
declare const vpc: ec2.Vpc;

new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_30 }),
  vpc,
  caCertificate: rds.CaCertificate.RDS_CA_RDS2048_G1,
});
```

You can specify a custom CA certificate with:

```ts
declare const vpc: ec2.Vpc;

new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_30 }),
  vpc,
  caCertificate: rds.CaCertificate.of('future-rds-ca'),
});
```

## Setting Public Accessibility

You can set public accessibility for the database instance or cluster using the `publiclyAccessible` property.
If you specify `true`, it creates an instance with a publicly resolvable DNS name, which resolves to a public IP address.
If you specify `false`, it creates an internal instance with a DNS name that resolves to a private IP address.
The default value depends on `vpcSubnets`.
It will be `true` if `vpcSubnets` is `subnetType: SubnetType.PUBLIC`, `false` otherwise.

```ts
declare const vpc: ec2.Vpc;
// Setting public accessibility for DB instance
new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.mysql({
    version: rds.MysqlEngineVersion.VER_8_0_19,
  }),
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
  },
  publiclyAccessible: true,
});

// Setting public accessibility for DB cluster
new rds.DatabaseCluster(this, 'DatabaseCluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_03_0,
  }),
  instanceProps: {
    vpc,
    vpcSubnets: {
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
    publiclyAccessible: true,
  },
});
```

## Instance events

To define Amazon CloudWatch event rules for database instances, use the `onEvent`
method:

```ts
declare const instance: rds.DatabaseInstance;
declare const fn: lambda.Function;
const rule = instance.onEvent('InstanceEvent', { target: new targets.LambdaFunction(fn) });
```

## Login credentials

By default, database instances and clusters (with the exception of `DatabaseInstanceFromSnapshot` and `ServerlessClusterFromSnapshot`) will have `admin` user with an auto-generated password.
An alternative username (and password) may be specified for the admin user instead of the default.

The following examples use a `DatabaseInstance`, but the same usage is applicable to `DatabaseCluster`.

```ts
declare const vpc: ec2.Vpc;
const engine = rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15_2 });
new rds.DatabaseInstance(this, 'InstanceWithUsername', {
  engine,
  vpc,
  credentials: rds.Credentials.fromGeneratedSecret('postgres'), // Creates an admin user of postgres with a generated password
});

new rds.DatabaseInstance(this, 'InstanceWithUsernameAndPassword', {
  engine,
  vpc,
  credentials: rds.Credentials.fromPassword('postgres', SecretValue.ssmSecure('/dbPassword', '1')), // Use password from SSM
});

const mySecret = secretsmanager.Secret.fromSecretName(this, 'DBSecret', 'myDBLoginInfo');
new rds.DatabaseInstance(this, 'InstanceWithSecretLogin', {
  engine,
  vpc,
  credentials: rds.Credentials.fromSecret(mySecret), // Get both username and password from existing secret
});
```

Secrets generated by `fromGeneratedSecret()` can be customized:

```ts
declare const vpc: ec2.Vpc;
const engine = rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15_2 });
const myKey = new kms.Key(this, 'MyKey');

new rds.DatabaseInstance(this, 'InstanceWithCustomizedSecret', {
  engine,
  vpc,
  credentials: rds.Credentials.fromGeneratedSecret('postgres', {
    secretName: 'my-cool-name',
    encryptionKey: myKey,
    excludeCharacters: '!&*^#@()',
    replicaRegions: [{ region: 'eu-west-1' }, { region: 'eu-west-2' }],
  }),
});
```

### Snapshot credentials

As noted above, Databases created with `DatabaseInstanceFromSnapshot` or `ServerlessClusterFromSnapshot` will not create user and auto-generated password by default because it's not possible to change the master username for a snapshot. Instead, they will use the existing username and password from the snapshot. You can still generate a new password - to generate a secret similarly to the other constructs, pass in credentials with `fromGeneratedSecret()` or `fromGeneratedPassword()`.

```ts
declare const vpc: ec2.Vpc;
const engine = rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15_2 });
const myKey = new kms.Key(this, 'MyKey');

new rds.DatabaseInstanceFromSnapshot(this, 'InstanceFromSnapshotWithCustomizedSecret', {
  engine,
  vpc,
  snapshotIdentifier: 'mySnapshot',
  credentials: rds.SnapshotCredentials.fromGeneratedSecret('username', {
    encryptionKey: myKey,
    excludeCharacters: '!&*^#@()',
    replicaRegions: [{ region: 'eu-west-1' }, { region: 'eu-west-2' }],
  }),
});
```

## Connecting

To control who can access the cluster or instance, use the `.connections` attribute. RDS databases have
a default port, so you don't need to specify the port:

```ts
declare const cluster: rds.DatabaseCluster;
cluster.connections.allowFromAnyIpv4(ec2.Port.allTraffic(), 'Open to the world');
```

The endpoints to access your database cluster will be available as the `.clusterEndpoint` and `.readerEndpoint`
attributes:

```ts
declare const cluster: rds.DatabaseCluster;
const writeAddress = cluster.clusterEndpoint.socketAddress;   // "HOSTNAME:PORT"
```

For an instance database:

```ts
declare const instance: rds.DatabaseInstance;
const address = instance.instanceEndpoint.socketAddress;   // "HOSTNAME:PORT"
```

## Rotating credentials

When the master password is generated and stored in AWS Secrets Manager, it can be rotated automatically:

```ts
declare const instance: rds.DatabaseInstance;
declare const mySecurityGroup: ec2.SecurityGroup;

instance.addRotationSingleUser({
  automaticallyAfter: Duration.days(7), // defaults to 30 days
  excludeCharacters: '!@#$%^&*', // defaults to the set " %+~`#$&*()|[]{}:;<>?!'/@\"\\"
  securityGroup: mySecurityGroup, // defaults to an auto-created security group
});
```

[example of setting up master password rotation for a cluster](test/integ.cluster-rotation.lit.ts)

The multi user rotation scheme is also available:

```ts
declare const instance: rds.DatabaseInstance;
declare const myImportedSecret: rds.DatabaseSecret;
instance.addRotationMultiUser('MyUser', {
  secret: myImportedSecret, // This secret must have the `masterarn` key
});
```

It's also possible to create user credentials together with the instance/cluster and add rotation:

```ts
declare const instance: rds.DatabaseInstance;
const myUserSecret = new rds.DatabaseSecret(this, 'MyUserSecret', {
  username: 'myuser',
  secretName: 'my-user-secret', // optional, defaults to a CloudFormation-generated name
  dbname: 'mydb', //optional, defaults to the main database of the RDS cluster this secret gets attached to
  masterSecret: instance.secret,
  excludeCharacters: '{}[]()\'"/\\', // defaults to the set " %+~`#$&*()|[]{}:;<>?!'/@\"\\"
});
const myUserSecretAttached = myUserSecret.attach(instance); // Adds DB connections information in the secret

instance.addRotationMultiUser('MyUser', { // Add rotation using the multi user scheme
  secret: myUserSecretAttached,
});
```

**Note**: This user must be created manually in the database using the master credentials.
The rotation will start as soon as this user exists.

Access to the Secrets Manager API is required for the secret rotation. This can be achieved either with
internet connectivity (through NAT) or with a VPC interface endpoint. By default, the rotation Lambda function
is deployed in the same subnets as the instance/cluster. If access to the Secrets Manager API is not possible from
those subnets or using the default API endpoint, use the `vpcSubnets` and/or `endpoint` options:

```ts
declare const instance: rds.DatabaseInstance;
declare const myEndpoint: ec2.InterfaceVpcEndpoint;

instance.addRotationSingleUser({
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }, // Place rotation Lambda in private subnets
  endpoint: myEndpoint, // Use VPC interface endpoint
});
```

See also [aws-cdk-lib/aws-secretsmanager](https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk-lib/aws-secretsmanager/README.md) for credentials rotation of existing clusters/instances.

By default, any stack updates will cause AWS Secrets Manager to rotate a secret immediately. To prevent this behavior and wait until the next scheduled rotation window specified via the `automaticallyAfter` property, set the `rotateImmediatelyOnUpdate` property to false:

```ts
declare const instance: rds.DatabaseInstance;
declare const mySecurityGroup: ec2.SecurityGroup;

instance.addRotationSingleUser({
  automaticallyAfter: Duration.days(7), // defaults to 30 days
  excludeCharacters: '!@#$%^&*', // defaults to the set " %+~`#$&*()|[]{}:;<>?!'/@\"\\"
  securityGroup: mySecurityGroup, // defaults to an auto-created security group
  rotateImmediatelyOnUpdate: false, // defaults to true
});
```

## IAM Authentication

You can also authenticate to a database instance using AWS Identity and Access Management (IAM) database authentication;
See <https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html> for more information
and a list of supported versions and limitations.

**Note**: `grantConnect()` does not currently work - see [this GitHub issue](https://github.com/aws/aws-cdk/issues/11851).

The following example shows enabling IAM authentication for a database instance and granting connection access to an IAM role.

```ts
declare const vpc: ec2.Vpc;
const instance = new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_19 }),
  vpc,
  iamAuthentication: true, // Optional - will be automatically set if you call grantConnect().
});
const role = new iam.Role(this, 'DBRole', { assumedBy: new iam.AccountPrincipal(this.account) });
instance.grantConnect(role); // Grant the role connection access to the DB.
```

The following example shows granting connection access for RDS Proxy to an IAM role.

```ts
declare const vpc: ec2.Vpc;
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_03_0,
  }),
  writer: rds.ClusterInstance.provisioned('writer'),
  vpc,
});

const proxy = new rds.DatabaseProxy(this, 'Proxy', {
  proxyTarget: rds.ProxyTarget.fromCluster(cluster),
  secrets: [cluster.secret!],
  vpc,
});

const role = new iam.Role(this, 'DBProxyRole', { assumedBy: new iam.AccountPrincipal(this.account) });
proxy.grantConnect(role, 'admin'); // Grant the role connection access to the DB Proxy for database user 'admin'.
```

**Note**: In addition to the setup above, a database user will need to be created to support IAM auth.
See <https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.DBAccounts.html> for setup instructions.

## Kerberos Authentication

You can also authenticate using Kerberos to a database instance using AWS Managed Microsoft AD for authentication;
See <https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/kerberos-authentication.html> for more information
and a list of supported versions and limitations.

The following example shows enabling domain support for a database instance and creating an IAM role to access
Directory Services.

```ts
declare const vpc: ec2.Vpc;
const role = new iam.Role(this, 'RDSDirectoryServicesRole', {
  assumedBy: new iam.ServicePrincipal('rds.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonRDSDirectoryServiceAccess'),
  ],
});
const instance = new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_19 }),
  vpc,
  domain: 'd-????????', // The ID of the domain for the instance to join.
  domainRole: role, // Optional - will be create automatically if not provided.
});
```

**Note**: In addition to the setup above, you need to make sure that the database instance has network connectivity
to the domain controllers. This includes enabling cross-VPC traffic if in a different VPC and setting up the
appropriate security groups/network ACL to allow traffic between the database instance and domain controllers.
Once configured, see <https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/kerberos-authentication.html> for details
on configuring users for each available database engine.

## Metrics

Database instances and clusters both expose metrics (`cloudwatch.Metric`):

```ts
// The number of database connections in use (average over 5 minutes)
declare const instance: rds.DatabaseInstance;
const dbConnections = instance.metricDatabaseConnections();

// Average CPU utilization over 5 minutes
declare const cluster: rds.DatabaseCluster;
const cpuUtilization = cluster.metricCPUUtilization();

// The average amount of time taken per disk I/O operation (average over 1 minute)
const readLatency = instance.metric('ReadLatency', { statistic: 'Average', period: Duration.seconds(60) });
```

## Enabling S3 integration

Data in S3 buckets can be imported to and exported from certain database engines using SQL queries. To enable this
functionality, set the `s3ImportBuckets` and `s3ExportBuckets` properties for import and export respectively. When
configured, the CDK automatically creates and configures IAM roles as required.
Additionally, the `s3ImportRole` and `s3ExportRole` properties can be used to set this role directly.

You can read more about loading data to (or from) S3 here:

* Aurora MySQL - [import](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Integrating.LoadFromS3.html)
  and [export](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Integrating.SaveIntoS3.html).
* Aurora PostgreSQL - [import](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Migrating.html#USER_PostgreSQL.S3Import)
  and [export](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/postgresql-s3-export.html).
* Microsoft SQL Server - [import and export](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/SQLServer.Procedural.Importing.html)
* PostgreSQL - [import](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Procedural.Importing.html)
  and [export](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/postgresql-s3-export.html)
* Oracle - [import and export](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/oracle-s3-integration.html)

The following snippet sets up a database cluster with different S3 buckets where the data is imported and exported -

```ts
import * as s3 from 'aws-cdk-lib/aws-s3';

declare const vpc: ec2.Vpc;
const importBucket = new s3.Bucket(this, 'importbucket');
const exportBucket = new s3.Bucket(this, 'exportbucket');
new rds.DatabaseCluster(this, 'dbcluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_03_0,
  }),
  writer: rds.ClusterInstance.provisioned('writer'),
  vpc,
  s3ImportBuckets: [importBucket],
  s3ExportBuckets: [exportBucket],
});
```

## Creating a Database Proxy

Amazon RDS Proxy sits between your application and your relational database to efficiently manage
connections to the database and improve scalability of the application. Learn more about at [Amazon RDS Proxy](https://aws.amazon.com/rds/proxy/)

The following code configures an RDS Proxy for a `DatabaseInstance`.

```ts
declare const vpc: ec2.Vpc;
declare const securityGroup: ec2.SecurityGroup;
declare const secrets: secretsmanager.Secret[];
declare const dbInstance: rds.DatabaseInstance;

const proxy = dbInstance.addProxy('proxy', {
    borrowTimeout: Duration.seconds(30),
    maxConnectionsPercent: 50,
    secrets,
    vpc,
});
```

## Exporting Logs

You can publish database logs to Amazon CloudWatch Logs. With CloudWatch Logs, you can perform real-time analysis of the log data,
store the data in highly durable storage, and manage the data with the CloudWatch Logs Agent. This is available for both database
instances and clusters; the types of logs available depend on the database type and engine being used.

```ts
import * as logs from 'aws-cdk-lib/aws-logs';
declare const myLogsPublishingRole: iam.Role;
declare const vpc: ec2.Vpc;

// Exporting logs from a cluster
const cluster = new rds.DatabaseCluster(this, 'Database', {
  engine: rds.DatabaseClusterEngine.aurora({
    version: rds.AuroraEngineVersion.VER_1_17_9, // different version class for each engine type
  }),
  writer: rds.ClusterInstance.provisioned('writer'),
  vpc,
  cloudwatchLogsExports: ['error', 'general', 'slowquery', 'audit'], // Export all available MySQL-based logs
  cloudwatchLogsRetention: logs.RetentionDays.THREE_MONTHS, // Optional - default is to never expire logs
  cloudwatchLogsRetentionRole: myLogsPublishingRole, // Optional - a role will be created if not provided
  // ...
});

// Exporting logs from an instance
const instance = new rds.DatabaseInstance(this, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({
    version: rds.PostgresEngineVersion.VER_15_2,
  }),
  vpc,
  cloudwatchLogsExports: ['postgresql'], // Export the PostgreSQL logs
  // ...
});
```

## Option Groups

Some DB engines offer additional features that make it easier to manage data and databases, and to provide additional security for your database.
Amazon RDS uses option groups to enable and configure these features. An option group can specify features, called options,
that are available for a particular Amazon RDS DB instance.

```ts
declare const vpc: ec2.Vpc;
declare const securityGroup: ec2.SecurityGroup;

new rds.OptionGroup(this, 'Options', {
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

## Parameter Groups

Database parameters specify how the database is configured.
For example, database parameters can specify the amount of resources, such as memory, to allocate to a database.
You manage your database configuration by associating your DB instances with parameter groups.
Amazon RDS defines parameter groups with default settings.

You can create your own parameter group for your cluster or instance and associate it with your database:

```ts
declare const vpc: ec2.Vpc;

const parameterGroup = new rds.ParameterGroup(this, 'ParameterGroup', {
  engine: rds.DatabaseInstanceEngine.sqlServerEe({
    version: rds.SqlServerEngineVersion.VER_11,
  }),
  parameters: {
    locks: '100',
  },
});

new rds.DatabaseInstance(this, 'Database', {
  engine: rds.DatabaseInstanceEngine.SQL_SERVER_EE,
  vpc,
  parameterGroup,
});
```

Another way to specify parameters is to use the inline field `parameters` that creates an RDS parameter group for you.
You can use this if you do not want to reuse the parameter group instance for different instances:

```ts
declare const vpc: ec2.Vpc;

new rds.DatabaseInstance(this, 'Database', {
  engine: rds.DatabaseInstanceEngine.sqlServerEe({ version: rds.SqlServerEngineVersion.VER_11 }),
  vpc,
  parameters: {
    locks: '100',
  },
});
```

You cannot specify a parameter map and a parameter group at the same time.

## Serverless

[Amazon Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/) is an on-demand, auto-scaling configuration for Amazon
Aurora. The database will automatically start up, shut down, and scale capacity
up or down based on your application's needs. It enables you to run your database
in the cloud without managing any database instances.

The following example initializes an Aurora Serverless PostgreSql cluster.
Aurora Serverless clusters can specify scaling properties which will be used to
automatically scale the database cluster seamlessly based on the workload.

```ts
declare const vpc: ec2.Vpc;

const cluster = new rds.ServerlessCluster(this, 'AnotherCluster', {
  engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
  copyTagsToSnapshot: true, // whether to save the cluster tags when creating the snapshot. Default is 'true'
  parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-postgresql10'),
  vpc,
  scaling: {
    autoPause: Duration.minutes(10), // default is to pause after 5 minutes of idle time
    minCapacity: rds.AuroraCapacityUnit.ACU_8, // default is 2 Aurora capacity units (ACUs)
    maxCapacity: rds.AuroraCapacityUnit.ACU_32, // default is 16 Aurora capacity units (ACUs)
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
* RDS Proxy

Read more about the [limitations of Aurora Serverless](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html#aurora-serverless.limitations)

Learn more about using Amazon Aurora Serverless by reading the [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html)

Use `ServerlessClusterFromSnapshot` to create a serverless cluster from a snapshot:

```ts
declare const vpc: ec2.Vpc;
new rds.ServerlessClusterFromSnapshot(this, 'Cluster', {
  engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
  vpc,
  snapshotIdentifier: 'mySnapshot',
});
```

### Data API

You can access your Aurora Serverless DB cluster using the built-in Data API. The Data API doesn't require a persistent connection to the DB cluster. Instead, it provides a secure HTTP endpoint and integration with AWS SDKs.

The following example shows granting Data API access to a Lamba function.

```ts
declare const vpc: ec2.Vpc;

const cluster = new rds.ServerlessCluster(this, 'AnotherCluster', {
  engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
  vpc, // this parameter is optional for serverless Clusters
  enableDataApi: true, // Optional - will be automatically set if you call grantDataApiAccess()
});

declare const code: lambda.Code;
const fn = new lambda.Function(this, 'MyFunction', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code,
  environment: {
    CLUSTER_ARN: cluster.clusterArn,
    SECRET_ARN: cluster.secret!.secretArn,
  },
});
cluster.grantDataApiAccess(fn);
```

**Note**: To invoke the Data API, the resource will need to read the secret associated with the cluster.

To learn more about using the Data API, see the [documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html).

### Default VPC

The `vpc` parameter is optional.

If not provided, the cluster will be created in the default VPC of the account and region.
As this VPC is not deployed with AWS CDK, you can't configure the `vpcSubnets`, `subnetGroup` or `securityGroups` of the Aurora Serverless Cluster.
If you want to provide one of `vpcSubnets`, `subnetGroup` or `securityGroups` parameter, please provide a `vpc`.
