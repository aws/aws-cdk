# Amazon Neptune Construct Library
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

Amazon Neptune is a fast, reliable, fully managed graph database service that makes it easy to build and run applications that work with highly connected datasets. The core of Neptune is a purpose-built, high-performance graph database engine. This engine is optimized for storing billions of relationships and querying the graph with milliseconds latency. Neptune supports the popular graph query languages Apache TinkerPop Gremlin and W3C’s SPARQL, enabling you to build queries that efficiently navigate highly connected datasets.

The `@aws-cdk/aws-neptune` package contains primitives for setting up Neptune database clusters and instances.

```ts nofixture
import * as neptune from '@aws-cdk/aws-neptune';
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

Note: if you want to use Neptune engine `1.2.0.0` or later, you need to specify the corresponding `engineVersion` prop to `neptune.DatabaseCluster` and `family` prop of `ParameterGroupFamily.NEPTUNE_1_2` to `neptune.ClusterParameterGroup` and `neptune.ParameterGroup`.

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

Additionally it is also possible to add replicas using `DatabaseInstance` for an existing cluster.

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
  cloudwatchLogsExports: {
    logTypes: [neptune.LogType.AUDIT],
    logRetention: logs.RetentionDays.ONE_MONTH,
  },
});
```

For more information on monitoring, refer to https://docs.aws.amazon.com/neptune/latest/userguide/monitoring.html.
For more information on audit logs, refer to https://docs.aws.amazon.com/neptune/latest/userguide/auditing.html.
For more information on exporting logs to CloudWatch Logs, refer to https://docs.aws.amazon.com/neptune/latest/userguide/cloudwatch-logs.html.
