# Amazon Neptune Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

Amazon Neptune is a fast, reliable, fully managed graph database service that makes it easy to build and run applications that work with highly connected datasets. The core of Neptune is a purpose-built, high-performance graph database engine. This engine is optimized for storing billions of relationships and querying the graph with milliseconds latency. Neptune supports the popular graph query languages Apache TinkerPop Gremlin and W3C’s SPARQL, enabling you to build queries that efficiently navigate highly connected datasets.

The `@aws-cdk/aws-neptune-alpha` package contains primitives for setting up Neptune database clusters and instances.

```ts nofixture
import * as neptune from '@aws-cdk/aws-neptune-alpha';
```

## Starting a Neptune Database

To set up a Neptune database, define a `DatabaseCluster`. You must always launch a database in a VPC.

```ts
const cluster = new neptune.DatabaseCluster(this, 'Database', {
  vpc,
  instanceType: neptune.InstanceType.R5_LARGE,
});
```

By default only writer instance is provisioned with this construct.

## Connecting

To control who can access the cluster, use the `.connections` attribute. Neptune databases have a default port, so
you don't need to specify the port:

```ts fixture=with-cluster
cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');
```

The endpoints to access your database cluster will be available as the `.clusterEndpoint` and `.clusterReadEndpoint`
attributes:

```ts fixture=with-cluster
const writeAddress = cluster.clusterEndpoint.socketAddress;   // "HOSTNAME:PORT"
```

## IAM Authentication

You can also authenticate to a database cluster using AWS Identity and Access Management (IAM) database authentication;
See <https://docs.aws.amazon.com/neptune/latest/userguide/iam-auth.html> for more information and a list of supported
versions and limitations.

The following example shows enabling IAM authentication for a database cluster and granting connection access to an IAM role.

```ts
const cluster = new neptune.DatabaseCluster(this, 'Cluster', {
  vpc,
  instanceType: neptune.InstanceType.R5_LARGE,
  iamAuthentication: true, // Optional - will be automatically set if you call grantConnect() or grant().
});
const role = new iam.Role(this, 'DBRole', { assumedBy: new iam.AccountPrincipal(this.account) });
// Use one of the following statements to grant the role the necessary permissions
cluster.grantConnect(role); // Grant the role neptune-db:* access to the DB
cluster.grant(role, 'neptune-db:ReadDataViaQuery', 'neptune-db:WriteDataViaQuery'); // Grant the role the specified actions to the DB
```

## Customizing parameters

Neptune allows configuring database behavior by supplying custom parameter groups.  For more details, refer to the
following link: <https://docs.aws.amazon.com/neptune/latest/userguide/parameters.html>

```ts
const clusterParams = new neptune.ClusterParameterGroup(this, 'ClusterParams', {
  description: 'Cluster parameter group',
  parameters: {
    neptune_enable_audit_log: '1'
  },
});

const dbParams = new neptune.ParameterGroup(this, 'DbParams', {
  description: 'Db parameter group',
  parameters: {
    neptune_query_timeout: '120000',
  },
});

const cluster = new neptune.DatabaseCluster(this, 'Database', {
  vpc,
  instanceType: neptune.InstanceType.R5_LARGE,
  clusterParameterGroup: clusterParams,
  parameterGroup: dbParams,
});
```

Note: To use the Neptune engine versions `1.2.0.0` or later, including the newly added `1.4` series, it's necessary to specify the appropriate `engineVersion` prop in `neptune.DatabaseCluster`. Additionally, for both 1.2,  1.3 and 1.4 series, the corresponding `family` prop must be set to `ParameterGroupFamily.NEPTUNE_1_2`, `ParameterGroupFamily.NEPTUNE_1_3` or `ParameterGroupFamily.NEPTUNE_1_4` respectively in `neptune.ClusterParameterGroup` and `neptune.ParameterGroup`.

## Adding replicas

`DatabaseCluster` allows launching replicas along with the writer instance. This can be specified using the `instanceCount`
attribute.

```ts
const cluster = new neptune.DatabaseCluster(this, 'Database', {
  vpc,
  instanceType: neptune.InstanceType.R5_LARGE,
  instances: 2,
});
```

Additionally, it is also possible to add replicas using `DatabaseInstance` for an existing cluster.

```ts fixture=with-cluster
const replica1 = new neptune.DatabaseInstance(this, 'Instance', {
  cluster,
  instanceType: neptune.InstanceType.R5_LARGE,
});
```

## Automatic minor version upgrades

By setting `autoMinorVersionUpgrade` to true, Neptune will automatically update
the engine of the entire cluster to the latest minor version after a stabilization
window of 2 to 3 weeks.

```ts
new neptune.DatabaseCluster(this, 'Cluster', {
  vpc,
  instanceType: neptune.InstanceType.R5_LARGE,
  autoMinorVersionUpgrade: true,
});
```

You can also specify `autoMinorVersionUpgrade` to a database instance.
Even within the same cluster, you can modify the `autoMinorVersionUpgrade` setting on a per-instance basis.

```ts fixture=with-cluster
new neptune.DatabaseInstance(this, 'Instance', {
  cluster,
  instanceType: neptune.InstanceType.R5_LARGE,
  autoMinorVersionUpgrade: true,
});
```

## Port

By default, Neptune uses port `8182`. You can override the default port by specifying the `port` property:

```ts
const cluster = new neptune.DatabaseCluster(this, 'Database', {
  vpc,
  instanceType: neptune.InstanceType.R5_LARGE,
  port: 12345,
});
```

## Logging

Neptune supports various methods for monitoring performance and usage. One of those methods is logging

1. Neptune provides logs e.g. audit logs which can be viewed or downloaded via the AWS Console. Audit logs can be enabled using the `neptune_enable_audit_log` parameter in `ClusterParameterGroup` or `ParameterGroup`
2. Neptune provides the ability to export those logs to CloudWatch Logs

```ts
// Cluster parameter group with the neptune_enable_audit_log param set to 1
const clusterParameterGroup = new neptune.ClusterParameterGroup(this, 'ClusterParams', {
  description: 'Cluster parameter group',
  parameters: {
    neptune_enable_audit_log: '1'
  },
});

const cluster = new neptune.DatabaseCluster(this, 'Database', {
  vpc,
  instanceType: neptune.InstanceType.R5_LARGE,
  // Audit logs are enabled via the clusterParameterGroup
  clusterParameterGroup,
  // Optionally configuring audit logs to be exported to CloudWatch Logs
  cloudwatchLogsExports: [neptune.LogType.AUDIT],
  // Optionally set a retention period on exported CloudWatch Logs
  cloudwatchLogsRetention: logs.RetentionDays.ONE_MONTH,
});
```

For more information on monitoring, refer to https://docs.aws.amazon.com/neptune/latest/userguide/monitoring.html.
For more information on audit logs, refer to https://docs.aws.amazon.com/neptune/latest/userguide/auditing.html.
For more information on exporting logs to CloudWatch Logs, refer to https://docs.aws.amazon.com/neptune/latest/userguide/cloudwatch-logs.html.

## Metrics

Both `DatabaseCluster` and `DatabaseInstance` provide a `metric()` method to help with cluster-level and instance-level monitoring.

```ts
declare const cluster: neptune.DatabaseCluster;
declare const instance: neptune.DatabaseInstance;

cluster.metric('SparqlRequestsPerSec'); // cluster-level SparqlErrors metric
instance.metric('SparqlRequestsPerSec') // instance-level SparqlErrors metric
```

For more details on the available metrics, refer to https://docs.aws.amazon.com/neptune/latest/userguide/cw-metrics.html

## Copy tags to snapshot

By setting `copyTagsToSnapshot` to true, all tags of the cluster are copied to the snapshots when they are created.

```ts
const cluster = new neptune.DatabaseCluster(this, 'Database', {
  vpc,
  instanceType: neptune.InstanceType.R5_LARGE,
  copyTagsToSnapshot: true  // whether to save the cluster tags when creating the snapshot.
});
```

## Neptune Serverless

You can configure a Neptune Serverless cluster using the dedicated instance type along with the
`serverlessScalingConfiguration` property.

> Visit [Using Amazon Neptune Serverless](https://docs.aws.amazon.com/neptune/latest/userguide/neptune-serverless-using.html) for more details.

```ts
const cluster = new neptune.DatabaseCluster(this, 'ServerlessDatabase', {
  vpc,
  instanceType: neptune.InstanceType.SERVERLESS,
  serverlessScalingConfiguration: {
    minCapacity: 1,
    maxCapacity: 5,
  },
});
```
