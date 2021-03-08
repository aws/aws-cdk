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
  instanceType: neptune.InstanceType.R5_LARGE
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
const cluster = new rds.DatabaseCluster(stack, 'Cluster', {
  vpc,
  instanceType: neptune.InstanceType.R5_LARGE,
  iamAuthentication: true, // Optional - will be automatically set if you call grantConnect().
});
const role = new Role(stack, 'DBRole', { assumedBy: new AccountPrincipal(stack.account) });
instance.grantConnect(role); // Grant the role connection access to the DB.
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
    neptune_query_timeout: '120000'
  },
});

const cluster = new neptune.DatabaseCluster(this, 'Database', {
  vpc,
  instanceType: neptune.InstanceType.R5_LARGE,
  clusterParameterGroup: clusterParams,
  parameterGroup: dbParams,
});
```

## Adding replicas

`DatabaseCluster` allows launching replicas along with the writer instance. This can be specified using the `instanceCount`
attribute.

```ts
const cluster = new neptune.DatabaseCluster(this, 'Database', {
  vpc,
  instanceType: neptune.InstanceType.R5_LARGE,
  instances: 2
});
```

Additionally it is also possible to add replicas using `DatabaseInstance` for an existing cluster.

```ts fixture=with-cluster
const replica1 = new neptune.DatabaseInstance(this, 'Instance', {
  cluster,
  instanceType: neptune.InstanceType.R5_LARGE
});
```
