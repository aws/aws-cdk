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

## Starting a Neptune Database

To set up a Neptune database, define a `DatabaseCluster`. You must always launch a database in a VPC. 

```ts
const cluster = new DatabaseCluster(this, 'Database', {
  vpc,
  instanceType: InstanceType.R5_LARGE
});
```

By default only writer instance is provisioned with this construct.

## Connecting

To control who can access the cluster, use the `.connections` attribute. Neptune databases have a default port, so
you don't need to specify the port:

```ts
cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');
```

The endpoints to access your database cluster will be available as the `.clusterEndpoint` and `.clusterReadEndpoint`
attributes:

```ts
const writeAddress = cluster.clusterEndpoint.socketAddress;   // "HOSTNAME:PORT"
```

## Customizing parameters

Neptune allows configuring database behavior by supplying custom parameter groups.  For more details, refer to the
following link: <https://docs.aws.amazon.com/neptune/latest/userguide/parameters.html>

```ts
const clusterParams = new ClusterParameterGroup(this, 'ClusterParams', {
  description: 'Cluster parameter group',
  parameters: {
    neptune_enable_audit_log: '1'
  },
});

const dbParams = new ParameterGroup(this, 'DbParams', {
  description: 'Db parameter group',
  parameters: {
    neptune_query_timeout: '120000'
  },
});

const cluster = new DatabaseCluster(this, 'Database', {
  vpc,
  instanceType: InstanceType.R5_LARGE,
  clusterParameterGroup: clusterParams,
  parameterGroup: dbParams,
});
```

## Adding replicas

`DatabaseCluster` allows launching replicas along with the writer instance. This can be specified using the `instanceCount`
attribute.

```ts
const cluster = new DatabaseCluster(this, 'Database', {
  vpc,
  instanceType: InstanceType.R5_LARGE,
  instances: 2
});
```

Additionally it is also possible to add replicas using `DatabaseInstance` for an existing cluster.

```ts
const replica1 = new DatabaseInstance(this, 'Instance', {
  cluster,
  instanceType: InstanceType.R5_LARGE
});
```
