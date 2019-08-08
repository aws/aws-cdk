# AWS ECS - Support for AWS Cloud Map (Service Discovery) Integration

To address issue [#1554](https://github.com/aws/aws-cdk/issues/1554), the
ECS construct library should provide a way to set
[`serviceRegistries`](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_CreateService.html#ECS-CreateService-request-serviceRegistries)
on their ECS service at the L1 level.


## General approach
Rather than having the customer instantiate Cloud Map constructs directly and
thus be forced to learn the API of a separate construct library, we should
allow the customer to pass in the domain name and other configuration minimally
needed to instantiate a Cloud Map namespace within an ECS cluster and create a
Cloud Map service for each ECS service.

The current proposal is to add a method on the ECS Cluster construct,
`addNamespace` that would take a set of properties that include the namespace
type (Public DNS, Private DNS or Http) and namespace name (domain name).

While it is possible to use more than one namespace for services in an ECS
cluster, realistically, we would expect ECS customers to only have one
namespace per given cluster. A Cloud Map service within that namespace would
then be created for each ECS service using service discovery in the cluster,
and would be discoverable by service name within that namespace, e.g.
frontend.mydomain.com, backend.mydomain.com, etc.

ECS will automatically register service discovery instances that are accessible
by IP address (IPv4 only) on the createService API call.

// FIXME public namespace needs to be imported?

## Code changes

The following are the new methods/interfaces that would be required for the proposed approach:

#### Cluster#addNamespace(options: NamespaceOptions)

This will allow adding a Cloud Map namespace, which will be accessible as a
member on the cluster. In the case of a Private DNS Namespace, a Route53 hosted
zone will be created for the customer.

```ts
export interface NamespaceOptions {
  /**
   * The domain name for the namespace, such as foo.com
   */
  name: string;

  /**
   * The type of CloudMap Namespace to create in your cluster
   *
   * @default PrivateDns
   */
  type?: cloudmap.NamespaceType;

  /**
   * The Amazon VPC that you want to associate the namespace with. Required for Private DNS namespaces
   *
   * @default VPC of the cluster for Private DNS Namespace, otherwise none
   */
  vpc?: ec2.IVpc;
}
```

#### service#enableServiceDiscovery(options: ServiceDiscoveryOptions)

This method would create a Cloud Map service, whose arn would then be passed as the serviceRegistry when the ECS service is created.

Other fields in the service registry are optionally needed depending on the
network mode of the task definition used by the ECS service.

- If the task definition uses the bridge or host network mode, a containerName
  and containerPort combination are needed. These will be taken from the
defaultContainer on the task definition.

- If the task definition uses the awsvpc network mode and a type SRV DNS record
  is used, you must specify either a containerName and containerPort
combination. These will be taken from the defaultContainer on the task definition.
NOTE: In this case, the API also allows you to simply pass in "port" at the
mutual exclusion of the `containerName` and `containerPort` combination, but
for simplicity we are only including `containerName` and `containerPort` and
not `port`.

NOTE: warn about creating service with public namespace?

If the customer wishes to have maximum configurability for their service, we will also add

```ts
export interface ServiceDiscoveryOptions {
  /**
   * Name of the cloudmap service to attach to the ECS Service
   *
   * @default CloudFormation-generated name
   */
  name?: string,

  /**
   * The DNS type of the record that you want AWS Cloud Map to create. Supported record types
   * include A or SRV.

   * @default: A
   */
  dnsRecordType?: cloudmap.DnsRecordType.A | cloudmap.DnsRecordType.SRV,

  /**
   * The amount of time, in seconds, that you want DNS resolvers to cache the settings for this
   * record.
   *
   * @default 60
   */
  dnsTtlSec?: number;

  /**
   * The number of 30-second intervals that you want Cloud Map to wait after receiving an
   * UpdateInstanceCustomHealthStatus request before it changes the health status of a service instance.
   * NOTE: This is used for a Custom HealthCheckCustomConfig
   */
  failureThreshold?: number,
}
```

A full example would look like the following:

```
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

// Cloud Map Namespace
const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
  name: 'mydomain.com',
  vpc,
});

// Cloud Map Service

const cloudMapService = namespace.createService('MyCloudMapService', {
  dnsRecordType: servicediscovery.DnsRecordType.A,
  dnsTtlSec: 300,
  customHealthCheck: {
    failureThreshold = 1
  }
});

// ECS Cluster
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro')
});

cluster.addNamespace({ name: "foo.com" })

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

const container = taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 256,
});

container.addPortMappings({
  containerPort: 80,
  hostPort: 8080,
  protocol: ecs.Protocol.Tcp
});

const ecsService = new ecs.Ec2Service(stack, "MyECSService", {
  cluster,
  taskDefinition,
});

ecsService.enableServiceDiscovery(
  dnsRecordType: servicediscovery.DnsRecordType.A,
  dnsTtlSec: 300,
  customHealthCheck: {
    failureThreshold = 1
  }
)

```
#### Service Discovery Considerations
##### See: (https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-discovery.html)

The following should be considered when using service discovery:

Service discovery is supported for tasks using the Fargate launch type if they are using platform version v1.1.0 or later. For more information, see AWS Fargate Platform Versions.

The Create Service workflow in the Amazon ECS console only supports registering services into private DNS namespaces. When a AWS Cloud Map private DNS namespace is created, a Route 53 private hosted zone will be created automatically.

Amazon ECS does not support registering services into public DNS namespaces.

The DNS records created for a service discovery service always register with the private IP address for the task, rather than the public IP address, even when public namespaces are used.

Service discovery requires that tasks specify either the awsvpc, bridge, or host network mode (none is not supported).

If the task definition your service task specifies uses the awsvpc network mode, you can create any combination of A or SRV records for each service task. If you use SRV records, a port is required.

If the task definition that your service task specifies uses the bridge or host network mode, an SRV record is the only supported DNS record type. Create an SRV record for each service task. The SRV record must specify a container name and container port combination from the task definition.

DNS records for a service discovery service can be queried within your VPC. They use the following format: <service discovery service name>.<service discovery namespace>. For more information, see Step 3: Verify Service Discovery.

When doing a DNS query on the service name, A records return a set of IP addresses that correspond to your tasks. SRV records return a set of IP addresses and ports per task.

You can configure service discovery for an ECS service that is behind a load balancer, but service discovery traffic is always routed to the task and not the load balancer.

Service discovery does not support the use of Classic Load Balancers.

It is recommended to use container-level health checks managed by Amazon ECS for your service discovery service.

HealthCheckCustomConfig—Amazon ECS manages health checks on your behalf. Amazon ECS uses information from container and health checks, as well as your task state, to update the health with AWS Cloud Map. This is specified using the --health-check-custom-config parameter when creating your service discovery service. For more information, see HealthCheckCustomConfig in the AWS Cloud Map API Reference.

If you are using the Amazon ECS console, the workflow creates one service discovery service per ECS service. It maps all of the task IP addresses as A records, or task IP addresses and port as SRV records.

Service discovery can only be configured when first creating a service. Updating existing services to configure service discovery for the first time or change the current configuration is not supported.

The AWS Cloud Map resources created when service discovery is used must be cleaned up manually. For more information, see Step 4: Clean Up in the Tutorial: Creating a Service Using Service Discovery topic.


