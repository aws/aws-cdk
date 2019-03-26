## AWS RDS Construct Library

The `aws-cdk-rds` package contains Constructs for setting up RDS instances.

> Note: the functionality this package is currently limited, as the CDK team is
> focusing on other use cases first. If your use case is not listed below, you
> will have to use achieve it using CloudFormation resources.
>
> If you would like to help improve the state of this library, Pull Requests are
> welcome.

Supported:

* Clustered databases

Not supported:

* Instance databases
* Setting up from a snapshot


### Starting a Clustered Database

To set up a clustered database (like Aurora), create an instance of `DatabaseCluster`. You must
always launch a database in a VPC. Use the `vpcSubnets` attribute to control whether
your instances will be launched privately or publicly:

```ts
const cluster = new DatabaseCluster(this, 'Database', {
    engine: DatabaseClusterEngine.Aurora,
    masterUser: {
        username: 'admin'
    },
    instanceProps: {
        instanceType: new InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Small),
        vpcSubnets: {
            subnetType: ec2.SubnetType.Public,
        },
        vpc
    }
});
```
By default, the master password will be generated and stored in AWS Secrets Manager.

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

### Rotating master password
When the master password is generated and stored in AWS Secrets Manager, it can be rotated automatically:

[example of setting up master password rotation](test/integ.cluster-rotation.lit.ts)

Rotation of the master password is also supported for an existing cluster:
```ts
new RotationSingleUser(stack, 'Rotation', {
    secret: importedSecret,
    engine: DatabaseEngine.Oracle,
    target: importedCluster,
    vpc: importedVpc,
})
```

The `importedSecret` must be a JSON string with the following format:
```json
{
  "engine": "<required: database engine>",
  "host": "<required: instance host name>",
  "username": "<required: username>",
  "password": "<required: password>",
  "dbname": "<optional: database name>",
  "port": "<optional: if not specified, default port will be used>"
}
```
