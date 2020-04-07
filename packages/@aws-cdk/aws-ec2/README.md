## Amazon EC2 Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

The `@aws-cdk/aws-ec2` package contains primitives for setting up networking and
instances.

```ts nofixture
import ec2 = require('@aws-cdk/aws-ec2');
```

## VPC

Most projects need a Virtual Private Cloud to provide security by means of
network partitioning. This is achieved by creating an instance of
`Vpc`:

```ts
const vpc = new ec2.Vpc(this, 'VPC');
```

All default constructs require EC2 instances to be launched inside a VPC, so
you should generally start by defining a VPC whenever you need to launch
instances for your project.

### Subnet Types

A VPC consists of one or more subnets that instances can be placed into. CDK
distinguishes three different subnet types:

* **Public** - public subnets connect directly to the Internet using an
  Internet Gateway. If you want your instances to have a public IP address
  and be directly reachable from the Internet, you must place them in a
  public subnet.
* **Private** - instances in private subnets are not directly routable from the
  Internet, and connect out to the Internet via a NAT gateway. By default, a
  NAT gateway is created in every public subnet for maximum availability. Be
  aware that you will be charged for NAT gateways.
* **Isolated** - isolated subnets do not route from or to the Internet, and
  as such do not require NAT gateways. They can only connect to or be
  connected to from other instances in the same VPC. A default VPC configuration
  will not include isolated subnets,

A default VPC configuration will create public and private subnets, but not
isolated subnets. See *Advanced Subnet Configuration* below for information
on how to change the default subnet configuration.

Constructs using the VPC will "launch instances" (or more accurately, create
Elastic Network Interfaces) into one or more of the subnets. They all accept
a property called `subnetSelection` (sometimes called `vpcSubnets`) to allow
you to select in what subnet to place the ENIs, usually defaulting to
*private* subnets if the property is omitted.

If you would like to save on the cost of NAT gateways, you can use
*isolated* subnets instead of *private* subnets (as described in Advanced
*Subnet Configuration*). If you need private instances to have
internet connectivity, another option is to reduce the number of NAT gateways
created by setting the `natGateways` property to a lower value (the default
is one NAT gateway per availability zone). Be aware that this may have
availability implications for your application.


[Read more about
subnets](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Subnets.html).

### Control over availability zones

By default, a VPC will spread over at most 3 Availability Zones available to
it. To change the number of Availability Zones that the VPC will spread over,
specify the `maxAzs` property when defining it.

The number of Availability Zones that are available depends on the *region*
and *account* of the Stack containing the VPC. If the [region and account are
specified](https://docs.aws.amazon.com/cdk/latest/guide/environments.html) on
the Stack, the CLI will [look up the existing Availability
Zones](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#using-regions-availability-zones-describe)
and get an accurate count. If region and account are not specified, the stack
could be deployed anywhere and it will have to make a safe choice, limiting
itself to 2 Availability Zones.

Therefore, to get the VPC to spread over 3 or more availability zones, you
must specify the environment where the stack will be deployed.

### Using NAT instances

By default, the `Vpc` construct will create NAT *gateways* for you, which
are managed by AWS. If you would prefer to use your own managed NAT
*instances* instead, specify a different value for the `natGatewayProvider`
property, as follows:

[using NAT instances](test/integ.nat-instances.lit.ts)

The construct will automatically search for the most recent NAT gateway AMI.
If you prefer to use a custom AMI, use `machineImage:
MachineImage.genericLinux({ ... })` and configure the right AMI ID for the
regions you want to deploy to.

### Advanced Subnet Configuration

If the default VPC configuration (public and private subnets spanning the
size of the VPC) don't suffice for you, you can configure what subnets to
create by specifying the `subnetConfiguration` property. It allows you
to configure the number and size of all subnets. Specifying an advanced
subnet configuration could look like this:

```ts
const vpc = new ec2.Vpc(this, 'TheVPC', {
  // 'cidr' configures the IP range and size of the entire VPC.
  // The IP space will be divided over the configured subnets.
  cidr: '10.0.0.0/21',

  // 'maxAzs' configures the maximum number of availability zones to use
  maxAzs: 3,

  // 'subnetConfiguration' specifies the "subnet groups" to create.
  // Every subnet group will have a subnet for each AZ, so this
  // configuration will create `3 groups × 3 AZs = 9` subnets.
  subnetConfiguration: [
    {
      // 'subnetType' controls Internet access, as described above.
      subnetType: ec2.SubnetType.PUBLIC,

      // 'name' is used to name this particular subnet group. You will have to
      // use the name for subnet selection if you have more than one subnet
      // group of the same type.
      name: 'Ingress',

      // 'cidrMask' specifies the IP addresses in the range of of individual
      // subnets in the group. Each of the subnets in this group will contain
      // `2^(32 address bits - 24 subnet bits) - 2 reserved addresses = 254`
      // usable IP addresses.
      //
      // If 'cidrMask' is left out the available address space is evenly
      // divided across the remaining subnet groups.
      cidrMask: 24,
    },
    {
      cidrMask: 24,
      name: 'Application',
      subnetType: ec2.SubnetType.PRIVATE,
    },
    {
      cidrMask: 28,
      name: 'Database',
      subnetType: ec2.SubnetType.ISOLATED,

      // 'reserved' can be used to reserve IP address space. No resources will
      // be created for this subnet, but the IP range will be kept available for
      // future creation of this subnet, or even for future subdivision.
      reserved: true
    }
  ],
});
```

The example above is one possible configuration, but the user can use the
constructs above to implement many other network configurations.

The `Vpc` from the above configuration in a Region with three
availability zones will be the following:

Subnet Name       |Type      |IP Block      |AZ|Features
------------------|----------|--------------|--|--------
IngressSubnet1    |`PUBLIC`  |`10.0.0.0/24` |#1|NAT Gateway
IngressSubnet2    |`PUBLIC`  |`10.0.1.0/24` |#2|NAT Gateway
IngressSubnet3    |`PUBLIC`  |`10.0.2.0/24` |#3|NAT Gateway
ApplicationSubnet1|`PRIVATE` |`10.0.3.0/24` |#1|Route to NAT in IngressSubnet1
ApplicationSubnet2|`PRIVATE` |`10.0.4.0/24` |#2|Route to NAT in IngressSubnet2
ApplicationSubnet3|`PRIVATE` |`10.0.5.0/24` |#3|Route to NAT in IngressSubnet3
DatabaseSubnet1   |`ISOLATED`|`10.0.6.0/28` |#1|Only routes within the VPC
DatabaseSubnet2   |`ISOLATED`|`10.0.6.16/28`|#2|Only routes within the VPC
DatabaseSubnet3   |`ISOLATED`|`10.0.6.32/28`|#3|Only routes within the VPC

### Reserving subnet IP space

There are situations where the IP space for a subnet or number of subnets
will need to be reserved. This is useful in situations where subnets would
need to be added after the vpc is originally deployed, without causing IP
renumbering for existing subnets. The IP space for a subnet may be reserved
by setting the `reserved` subnetConfiguration property to true, as shown
below:

```ts
const vpc = new ec2.Vpc(this, 'TheVPC', {
  natGateways: 1,
  subnetConfiguration: [
    {
      cidrMask: 26,
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      cidrMask: 26,
      name: 'Application1',
      subnetType: ec2.SubnetType.PRIVATE,
    },
    {
      cidrMask: 26,
      name: 'Application2',
      subnetType: ec2.SubnetType.PRIVATE,
      reserved: true,   // <---- This subnet group is reserved
    },
    {
      cidrMask: 27,
      name: 'Database',
      subnetType: ec2.SubnetType.ISOLATED,
    }
  ],
});
```

In the example above, the subnet for Application2 is not actually provisioned
but its IP space is still reserved. If in the future this subnet needs to be
provisioned, then the `reserved: true` property should be removed. Reserving
parts of the IP space prevents the other subnets from getting renumbered.

### Sharing VPCs between stacks

If you are creating multiple `Stack`s inside the same CDK application, you
can reuse a VPC defined in one Stack in another by simply passing the VPC
instance around:

[sharing VPCs between stacks](test/integ.share-vpcs.lit.ts)

### Importing an existing VPC

If your VPC is created outside your CDK app, you can use `Vpc.fromLookup()`.
The CDK CLI will search for the specified VPC in the the stack's region and
account, and import the subnet configuration. Looking up can be done by VPC
ID, but more flexibly by searching for a specific tag on the VPC.

Subnet types will be determined from the `aws-cdk:subnet-type` tag on the
subnet if it exists, or the presence of a route to an Internet Gateway
otherwise. Subnet names will be determined from the `aws-cdk:subnet-name` tag
on the subnet if it exists, or will mirror the subnet type otherwise (i.e.
a public subnet will have the name `"Public"`).

Here's how `Vpc.fromLookup()` can be used:

[importing existing VPCs](test/integ.import-default-vpc.lit.ts)

## Allowing Connections

In AWS, all network traffic in and out of **Elastic Network Interfaces** (ENIs)
is controlled by **Security Groups**. You can think of Security Groups as a
firewall with a set of rules. By default, Security Groups allow no incoming
(ingress) traffic and all outgoing (egress) traffic. You can add ingress rules
to them to allow incoming traffic streams. To exert fine-grained control over
egress traffic, set `allowAllOutbound: false` on the `SecurityGroup`, after
which you can add egress traffic rules.

You can manipulate Security Groups directly:

```ts fixture=with-vpc
const mySecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
  vpc,
  description: 'Allow ssh access to ec2 instances',
  allowAllOutbound: true   // Can be set to false
});
mySecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from the world');
```

All constructs that create ENIs on your behalf (typically constructs that create
EC2 instances or other VPC-connected resources) will all have security groups
automatically assigned. Those constructs have an attribute called
**connections**, which is an object that makes it convenient to update the
security groups. If you want to allow connections between two constructs that
have security groups, you have to add an **Egress** rule to one Security Group,
and an **Ingress** rule to the other. The connections object will automatically
take care of this for you:

```ts fixture=conns
// Allow connections from anywhere
loadBalancer.connections.allowFromAnyIpv4(ec2.Port.tcp(443), 'Allow inbound HTTPS');

// The same, but an explicit IP address
loadBalancer.connections.allowFrom(ec2.Peer.ipv4('1.2.3.4/32'), ec2.Port.tcp(443), 'Allow inbound HTTPS');

// Allow connection between AutoScalingGroups
appFleet.connections.allowTo(dbFleet, ec2.Port.tcp(443), 'App can call database');
```

### Connection Peers

There are various classes that implement the connection peer part:

```ts fixture=conns
// Simple connection peers
let peer = ec2.Peer.ipv4("10.0.0.0/16");
peer = ec2.Peer.anyIpv4();
peer = ec2.Peer.ipv6("::0/0");
peer = ec2.Peer.anyIpv6();
peer = ec2.Peer.prefixList("pl-12345");
appFleet.connections.allowTo(peer, ec2.Port.tcp(443), 'Allow outbound HTTPS');
```

Any object that has a security group can itself be used as a connection peer:

```ts fixture=conns
// These automatically create appropriate ingress and egress rules in both security groups
fleet1.connections.allowTo(fleet2, ec2.Port.tcp(80), 'Allow between fleets');

appFleet.connections.allowFromAnyIpv4(ec2.Port.tcp(80), 'Allow from load balancer');
```

### Port Ranges

The connections that are allowed are specified by port ranges. A number of classes provide
the connection specifier:

```ts
ec2.Port.tcp(80)
ec2.Port.tcpRange(60000, 65535)
ec2.Port.allTcp()
ec2.Port.allTraffic()
```

> NOTE: This set is not complete yet; for example, there is no library support for ICMP at the moment.
> However, you can write your own classes to implement those.

### Default Ports

Some Constructs have default ports associated with them. For example, the
listener of a load balancer does (it's the public port), or instances of an
RDS database (it's the port the database is accepting connections on).

If the object you're calling the peering method on has a default port associated with it, you can call
`allowDefaultPortFrom()` and omit the port specifier. If the argument has an associated default port, call
`allowDefaultPortTo()`.

For example:

```ts fixture=conns
// Port implicit in listener
listener.connections.allowDefaultPortFromAnyIpv4('Allow public');

// Port implicit in peer
appFleet.connections.allowDefaultPortTo(rdsDatabase, 'Fleet can access database');
```

## Machine Images (AMIs)

AMIs control the OS that gets launched when you start your EC2 instance. The EC2
library contains constructs to select the AMI you want to use.

Depending on the type of AMI, you select it a different way. Here are some
examples of things you might want to use:

[example of creating images](test/example.images.lit.ts)

> NOTE: The AMIs selected by `MachineImage.lookup()` will be cached in
> `cdk.context.json`, so that your AutoScalingGroup instances aren't replaced while
> you are making unrelated changes to your CDK app.
>
> To query for the latest AMI again, remove the relevant cache entry from
> `cdk.context.json`, or use the `cdk context` command. For more information, see
> [Runtime Context](https://docs.aws.amazon.com/cdk/latest/guide/context.html) in the CDK
> developer guide.

## VPN connections to a VPC

Create your VPC with VPN connections by specifying the `vpnConnections` props (keys are construct `id`s):

```ts
const vpc = new ec2.Vpc(this, 'MyVpc', {
  vpnConnections: {
    dynamic: { // Dynamic routing (BGP)
      ip: '1.2.3.4'
    },
    static: { // Static routing
      ip: '4.5.6.7',
      staticRoutes: [
        '192.168.10.0/24',
        '192.168.20.0/24'
      ]
    }
  }
});
```

To create a VPC that can accept VPN connections, set `vpnGateway` to `true`:

```ts
const vpc = new ec2.Vpc(this, 'MyVpc', {
  vpnGateway: true
});
```

VPN connections can then be added:
```ts fixture=with-vpc
vpc.addVpnConnection('Dynamic', {
  ip: '1.2.3.4'
});
```

By default, routes will be propagated on the route tables associated with the private subnets. If no
private subnets exists, isolated subnets are used. If no isolated subnets exists, public subnets are
used. Use the `Vpc` property `vpnRoutePropagation` to customize this behavior.

VPN connections expose [metrics (cloudwatch.Metric)](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-cloudwatch/README.md) across all tunnels in the account/region and per connection:

```ts fixture=with-vpc
// Across all tunnels in the account/region
const allDataOut = ec2.VpnConnection.metricAllTunnelDataOut();

// For a specific vpn connection
const vpnConnection = vpc.addVpnConnection('Dynamic', {
  ip: '1.2.3.4'
});
const state = vpnConnection.metricTunnelState();
```

## VPC endpoints
A VPC endpoint enables you to privately connect your VPC to supported AWS services and VPC endpoint services powered by PrivateLink without requiring an internet gateway, NAT device, VPN connection, or AWS Direct Connect connection. Instances in your VPC do not require public IP addresses to communicate with resources in the service. Traffic between your VPC and the other service does not leave the Amazon network.

Endpoints are virtual devices. They are horizontally scaled, redundant, and highly available VPC components that allow communication between instances in your VPC and services without imposing availability risks or bandwidth constraints on your network traffic.

[example of setting up VPC endpoints](test/integ.vpc-endpoint.lit.ts)

### Security groups for interface VPC endpoints
By default, interface VPC endpoints create a new security group and traffic is **not**
automatically allowed from the VPC CIDR.

Use the `connections` object to allow traffic to flow to the endpoint:

```ts fixture=conns
myEndpoint.connections.allowDefaultPortFromAnyIpv4();
```

Alternatively, existing security groups can be used by specifying the `securityGroups` prop.

## VPC endpoint services
A VPC endpoint service enables you to expose a Network Load Balancer(s) as a provider service to consumers, who connect to your service over a VPC endpoint. You can restrict access to your service via whitelisted principals (anything that extends ArnPrincipal), and require that new connections be manually accepted.

```ts
new VpcEndpointService(this, "EndpointService", {
  vpcEndpointServiceLoadBalancers: [networkLoadBalancer1, networkLoadBalancer2],
  acceptanceRequired: true,
  whitelistedPrincipals: [new ArnPrincipal("arn:aws:iam::123456789012:root")]
});
```

## Bastion Hosts
A bastion host functions as an instance used to access servers and resources in a VPC without open up the complete VPC on a network level.
You can use bastion hosts using a standard SSH connection targetting port 22 on the host. As an alternative, you can connect the SSH connection
feature of AWS Systems Manager Session Manager, which does not need an opened security group. (https://aws.amazon.com/about-aws/whats-new/2019/07/session-manager-launches-tunneling-support-for-ssh-and-scp/)

A default bastion host for use via SSM can be configured like:
```ts fixture=with-vpc
const host = new ec2.BastionHostLinux(this, 'BastionHost', { vpc });
```

If you want to connect from the internet using SSH, you need to place the host into a public subnet. You can then configure allowed source hosts.
```ts fixture=with-vpc
const host = new ec2.BastionHostLinux(this, 'BastionHost', {
  vpc,
  subnetSelection: { subnetType: ec2.SubnetType.PUBLIC },
});
host.allowSshAccessFrom(ec2.Peer.ipv4('1.2.3.4/32'));
```

As there are no SSH public keys deployed on this machine, you need to use [EC2 Instance Connect](https://aws.amazon.com/de/blogs/compute/new-using-amazon-ec2-instance-connect-for-ssh-access-to-your-ec2-instances/)
with the command `aws ec2-instance-connect send-ssh-public-key` to provide your SSH public key.


## Block Devices

To add EBS block device mappings, specify the `blockDeviceMappings` property. The follow example sets the EBS-backed
root device (`/dev/sda1`) size to 50 GiB, and adds another EBS-backed device mapped to `/dev/sdm` that is 100 GiB in
size:

```ts
new ec2.Instance(this, 'Instance', {
  // ...
  blockDeviceMappings: [
    {
      deviceName: '/dev/sda1',
      volume: ec2.BlockDeviceVolume.ebs(50),
    },
    {
      deviceName: '/dev/sdm',
      volume: ec2.BlockDeviceVolume.ebs(100),
    },
  ],
});

```

## VPC Flow Logs
VPC Flow Logs is a feature that enables you to capture information about the IP traffic going to and from network interfaces in your VPC. Flow log data can be published to Amazon CloudWatch Logs and Amazon S3. After you've created a flow log, you can retrieve and view its data in the chosen destination. (https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html).

By default a flow log will be created with CloudWatch Logs as the destination.

You can create a flow log like this:

```ts
new ec2.FlowLog(this, 'FlowLog', {
  resourceType: ec2.FlowLogResourceType.fromVpc(vpc)
})
```
Or you can add a Flow Log to a VPC by using the addFlowLog method like this:

```ts
const vpc = new ec2.Vpc(this, 'Vpc');

vpc.addFlowLog('FlowLog');
```

You can also add multiple flow logs with different destinations.

```ts
const vpc = new ec2.Vpc(this, 'Vpc');

vpc.addFlowLog('FlowLogS3', {
  destination: ec2.FlowLogDestination.toS3()
});

vpc.addFlowLog('FlowLogCloudWatch', {
  trafficType: ec2.FlowLogTrafficType.REJECT
});
```

By default the CDK will create the necessary resources for the destination. For the CloudWatch Logs destination
it will create a CloudWatch Logs Log Group as well as the IAM role with the necessary permissions to publish to
the log group. In the case of an S3 destination, it will create the S3 bucket.

If you want to customize any of the destination resources you can provide your own as part of the `destination`.

*CloudWatch Logs*
```ts
const logGroup = new logs.LogGroup(this, 'MyCustomLogGroup');

const role = new iam.Role(this, 'MyCustomRole', {
  assumedBy: new iam.ServicePrincipal('vpc-flow-logs.amazonaws.com')
});

new ec2.FlowLog(this, 'FlowLog', {
  resourceType: ec2.FlowLogResourceType.fromVpc(vpc),
  destination: ec2.FlowLogDestination.toCloudWatchLogs(logGroup, role)
});
```

*S3*
```ts

const bucket = new s3.Bucket(this, 'MyCustomBucket');

new ec2.FlowLog(this, 'FlowLog', {
  resourceType: ec2.FlowLogResourceType.fromVpc(vpc),
  destination: ec2.FlowLogDestination.toS3(bucket)
});
```

## User Data
User data enables you to run a script when your instances start up.  In order to configure these scripts you can add commands directly to the script
 or you can use the UserData's convenience functions to aid in the creation of your script.

A user data could be configured to run a script found in an asset through the following:
```ts
const asset = new Asset(this, 'Asset', {path: path.join(__dirname, 'configure.sh')});
const instance = new ec2.Instance(this, 'Instance', {
  // ...
  });
const localPath = instance.userData.addS3DownloadCommand({
  bucket:asset.bucket,
  bucketKey:asset.s3ObjectKey,
});
instance.userData.addExecuteFileCommand({
  filePath:localPath,
  arguments: '--verbose -y'
});
asset.grantRead( instance.role );
```

## Importing existing subnet

To import an existing Subnet, call `Subnet.fromSubnetAttributes()` or
`Subnet.fromSubnetId()`. Only if you supply the subnet's Availability Zone
and Route Table Ids when calling `Subnet.fromSubnetAttributes()` will you be
able to use the CDK features that use these values (such as selecting one
subnet per AZ).

Importing an existing subnet looks like this:

```ts
// Supply all properties
const subnet = Subnet.fromSubnetAttributes(this, 'SubnetFromAttributes', {
  subnetId: 's-1234',
  availabilityZone: 'pub-az-4465',
  routeTableId: 'rt-145'
});

// Supply only subnet id
const subnet = Subnet.fromSubnetId(this, 'SubnetFromId', 's-1234');
```