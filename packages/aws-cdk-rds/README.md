## AWS RDS Construct Library

The `aws-cdk-rds` package contains Constructs for setting up RDS instances.

Supported:

* Clustered databases

Not supported:

* Instance databases
* Setting up from a snapshot


### Starting a Clustered Database

To set up a clustered database (like Aurora), create an instance of `DatabaseCluster`. You must
always launch a database in a VPC. Use the `vpcPlacement` attribute to control whether
your instances will be launched privately or publicly:

```ts
const cluster = new DatabaseCluster(stack, 'Database', {
    engine: DatabaseClusterEngine.Aurora,
    masterUser: {
        username: 'admin',
        password: '7959866cacc02c2d243ecfe177464fe6',
    },
    instanceProps: {
        instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Small),
        vpcPlacement: {
            usePublicSubnets: true
        },
        vpc
    }
});
```

Your cluster will be empty by default. To add a default database upon construction, specify the
`defaultDatabaseName` attribute.

### Connecting

To control who can access the cluster, use the `.connections` attribute. RDS database have
a default port, so you don't need to specify the port:

```ts
cluster.connections.allowFromAnyIpv4('Open to the world');
```

The endpoints to access your database will be available as the `.clusterEndpoint` and `.readerEndpoint`
attributes:

```ts
const writeAddress = cluster.clusterEndpoint.socketAddress;   // "HOSTNAME:PORT"
```
