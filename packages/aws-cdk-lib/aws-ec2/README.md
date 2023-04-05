# Amazon EC2 Construct Library



The `@aws-cdk/aws-ec2` package contains primitives for setting up networking and
instances.

```ts nofixture
import * as ec2 from 'aws-cdk-lib/aws-ec2';
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

* **Public (`SubnetType.PUBLIC`)** - public subnets connect directly to the Internet using an
  Internet Gateway. If you want your instances to have a public IP address
  and be directly reachable from the Internet, you must place them in a
  public subnet.
* **Private with Internet Access (`SubnetType.PRIVATE_WITH_EGRESS`)** - instances in private subnets are not directly routable from the
  Internet, and you must provide a way to connect out to the Internet.
  By default, a NAT gateway is created in every public subnet for maximum availability. Be
  aware that you will be charged for NAT gateways.
  Alternatively you can set `natGateways:0` and provide your own egress configuration (i.e through Transit Gateway)
* **Isolated (`SubnetType.PRIVATE_ISOLATED`)** - isolated subnets do not route from or to the Internet, and
  as such do not require NAT gateways. They can only connect to or be
  connected to from other instances in the same VPC. A default VPC configuration
  will not include isolated subnets,

A default VPC configuration will create public and **private** subnets. However, if
`natGateways:0` **and** `subnetConfiguration` is undefined, default VPC configuration
will create public and **isolated** subnets. See [*Advanced Subnet Configuration*](#advanced-subnet-configuration)
below for information on how to change the default subnet configuration.

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

You can gain full control over the availability zones selection strategy by overriding the Stack's [`get availabilityZones()`](https://github.com/aws/aws-cdk/blob/main/packages/@aws-cdk/core/lib/stack.ts) method:

```text
// This example is only available in TypeScript

class MyStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ...
  }

  get availabilityZones(): string[] {
    return ['us-west-2a', 'us-west-2b'];
  }

}
```

Note that overriding the `get availabilityZones()` method will override the default behavior for all constructs defined within the Stack.

### Choosing subnets for resources

When creating resources that create Elastic Network Interfaces (such as
databases or instances), there is an option to choose which subnets to place
them in. For example, a VPC endpoint by default is placed into a subnet in
every availability zone, but you can override which subnets to use. The property
is typically called one of `subnets`, `vpcSubnets` or `subnetSelection`.

The example below will place the endpoint into two AZs (`us-east-1a` and `us-east-1c`),
in Isolated subnets:

```ts
declare const vpc: ec2.Vpc;

new ec2.InterfaceVpcEndpoint(this, 'VPC Endpoint', {
  vpc,
  service: new ec2.InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
  subnets: {
    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    availabilityZones: ['us-east-1a', 'us-east-1c']
  }
});
```

You can also specify specific subnet objects for granular control:

```ts
declare const vpc: ec2.Vpc;
declare const subnet1: ec2.Subnet;
declare const subnet2: ec2.Subnet;

new ec2.InterfaceVpcEndpoint(this, 'VPC Endpoint', {
  vpc,
  service: new ec2.InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
  subnets: {
    subnets: [subnet1, subnet2]
  }
});
```

Which subnets are selected is evaluated as follows:

* `subnets`: if specific subnet objects are supplied, these are selected, and no other
  logic is used.
* `subnetType`/`subnetGroupName`: otherwise, a set of subnets is selected by
  supplying either type or name:
  * `subnetType` will select all subnets of the given type.
  * `subnetGroupName` should be used to distinguish between multiple groups of subnets of
    the same type (for example, you may want to separate your application instances and your
    RDS instances into two distinct groups of Isolated subnets).
  * If neither are given, the first available subnet group of a given type that
    exists in the VPC will be used, in this order: Private, then Isolated, then Public.
    In short: by default ENIs will preferentially be placed in subnets not connected to
    the Internet.
* `availabilityZones`/`onePerAz`: finally, some availability-zone based filtering may be done.
  This filtering by availability zones will only be possible if the VPC has been created or
  looked up in a non-environment agnostic stack (so account and region have been set and
  availability zones have been looked up).
  * `availabilityZones`: only the specific subnets from the selected subnet groups that are
    in the given availability zones will be returned.
  * `onePerAz`: per availability zone, a maximum of one subnet will be returned (Useful for resource
    types that do not allow creating two ENIs in the same availability zone).
* `subnetFilters`: additional filtering on subnets using any number of user-provided filters which
  extend `SubnetFilter`.  The following methods on the `SubnetFilter` class can be used to create
  a filter:
  * `byIds`: chooses subnets from a list of ids
  * `availabilityZones`: chooses subnets in the provided list of availability zones
  * `onePerAz`: chooses at most one subnet per availability zone
  * `containsIpAddresses`: chooses a subnet which contains *any* of the listed ip addresses
  * `byCidrMask`: chooses subnets that have the provided CIDR netmask

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

By default, the NAT instances will route all traffic. To control what traffic
gets routed, pass a custom value for `defaultAllowedTraffic` and access the
`NatInstanceProvider.connections` member after having passed the NAT provider to
the VPC:

```ts
declare const instanceType: ec2.InstanceType;

const provider = ec2.NatProvider.instance({
  instanceType,
  defaultAllowedTraffic: ec2.NatTrafficDirection.OUTBOUND_ONLY,
});
new ec2.Vpc(this, 'TheVPC', {
  natGatewayProvider: provider,
});
provider.connections.allowFrom(ec2.Peer.ipv4('1.2.3.4/8'), ec2.Port.tcp(80));
```

### Ip Address Management

The VPC spans a supernet IP range, which contains the non-overlapping IPs of its contained subnets. Possible sources for this IP range are:

* You specify an IP range directly by specifying a CIDR
* You allocate an IP range of a given size automatically from AWS IPAM

By default the Vpc will allocate the `10.0.0.0/16` address range which will be exhaustively spread across all subnets in the subnet configuration. This behavior can be changed by passing an object that implements `IIpAddresses` to the `ipAddress` property of a Vpc. See the subsequent sections for the options.

Be aware that if you don't explicitly reserve subnet groups in `subnetConfiguration`, the address space will be fully allocated! If you predict you may need to add more subnet groups later, add them early on and set `reserved: true` (see the "Advanced Subnet Configuration" section for more information).

#### Specifying a CIDR directly

Use `IpAddresses.cidr` to define a Cidr range for your Vpc directly in code:

```ts
import { IpAddresses } from 'aws-cdk-lib/aws-ec2';

new ec2.Vpc(stack, 'TheVPC', {
  ipAddresses: ec2.IpAddresses.cidr('10.0.1.0/20')
});
```

Space will be allocated to subnets in the following order:

* First, spaces is allocated for all subnets groups that explicitly have a `cidrMask` set as part of their configuration (including reserved subnets).
* Afterwards, any remaining space is divided evenly between the rest of the subnets (if any).

The argument to `IpAddresses.cidr` may not be a token, and concrete Cidr values are generated in the synthesized CloudFormation template.

#### Allocating an IP range from AWS IPAM

Amazon VPC IP Address Manager (IPAM) manages a large IP space, from which chunks can be allocated for use in the Vpc. For information on Amazon VPC IP Address Manager please see the [official documentation](https://docs.aws.amazon.com/vpc/latest/ipam/what-it-is-ipam.html). An example of allocating from AWS IPAM looks like this:

```ts
import { IpAddresses } from 'aws-cdk-lib/aws-ec2';

declare const pool: ec2.CfnIPAMPool;

new ec2.Vpc(stack, 'TheVPC', {
  ipAddresses: ec2.IpAddresses.awsIpamAllocation({
    ipv4IpamPoolId: pool.ref,
    ipv4NetmaskLength: 18,
    defaultSubnetIpv4NetmaskLength: 24
  })
});
```

`IpAddresses.awsIpamAllocation` requires the following:

* `ipv4IpamPoolId`, the id of an IPAM Pool from which the VPC range should be allocated.
* `ipv4NetmaskLength`, the size of the IP range that will be requested from the Pool at deploy time.
* `defaultSubnetIpv4NetmaskLength`, the size of subnets in groups that don't have `cidrMask` set.

With this method of IP address management, no attempt is made to guess at subnet group sizes or to exhaustively allocate the IP range. All subnet groups must have an explicit `cidrMask` set as part of their subnet configuration, or `defaultSubnetIpv4NetmaskLength` must be set for a default size. If not, synthesis will fail and you must provide one or the other.

### Reserving availability zones

There are situations where the IP space for availability zones will
need to be reserved. This is useful in situations where availability
zones would need to be added after the vpc is originally deployed,
without causing IP renumbering for availability zones subnets. The IP
space for reserving `n` availability zones can be done by setting the
`reservedAzs` to `n` in vpc props, as shown below:

```ts
const vpc = new ec2.Vpc(this, 'TheVPC', {
  cidr: '10.0.0.0/21',
  maxAzs: 3,
  reservedAzs: 1,
});
```

In the example above, the subnets for reserved availability zones is not
actually provisioned but its IP space is still reserved. If, in the future,
new availability zones needs to be provisioned, then we would decrement
the value of `reservedAzs` and increment the `maxAzs` or `availabilityZones`
accordingly. This action would not cause the IP address of subnets to get
renumbered, but rather the IP space that was previously reserved will be
used for the new availability zones subnets.

### Advanced Subnet Configuration

If the default VPC configuration (public and private subnets spanning the
size of the VPC) don't suffice for you, you can configure what subnets to
create by specifying the `subnetConfiguration` property. It allows you
to configure the number and size of all subnets. Specifying an advanced
subnet configuration could look like this:

```ts
const vpc = new ec2.Vpc(this, 'TheVPC', {
  // 'IpAddresses' configures the IP range and size of the entire VPC.
  // The IP space will be divided based on configuration for the subnets.
  ipAddresses: IpAddresses.cidr('10.0.0.0/21'),

  // 'maxAzs' configures the maximum number of availability zones to use.
  // If you want to specify the exact availability zones you want the VPC
  // to use, use `availabilityZones` instead.
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
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
    {
      cidrMask: 28,
      name: 'Database',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,

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

### Accessing the Internet Gateway

If you need access to the internet gateway, you can get its ID like so:

```ts
declare const vpc: ec2.Vpc;

const igwId = vpc.internetGatewayId;
```

For a VPC with only `ISOLATED` subnets, this value will be undefined.

This is only supported for VPCs created in the stack - currently you're
unable to get the ID for imported VPCs. To do that you'd have to specifically
look up the Internet Gateway by name, which would require knowing the name
beforehand.

This can be useful for configuring routing using a combination of gateways:
for more information see [Routing](#routing) below.

#### Routing

It's possible to add routes to any subnets using the `addRoute()` method. If for
example you want an isolated subnet to have a static route via the default
Internet Gateway created for the public subnet - perhaps for routing a VPN
connection - you can do so like this:

```ts
const vpc = new ec2.Vpc(this, "VPC", {
  subnetConfiguration: [{
      subnetType: ec2.SubnetType.PUBLIC,
      name: 'Public',
    },{
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      name: 'Isolated',
    }]
});

(vpc.isolatedSubnets[0] as ec2.Subnet).addRoute("StaticRoute", {
    routerId: vpc.internetGatewayId!,
    routerType: ec2.RouterType.GATEWAY,
    destinationCidrBlock: "8.8.8.8/32",
})
```

*Note that we cast to `Subnet` here because the list of subnets only returns an
`ISubnet`.*

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
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
    {
      cidrMask: 26,
      name: 'Application2',
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      reserved: true,   // <---- This subnet group is reserved
    },
    {
      cidrMask: 27,
      name: 'Database',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
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

The result of the `Vpc.fromLookup()` operation will be written to a file
called `cdk.context.json`. You must commit this file to source control so
that the lookup values are available in non-privileged environments such
as CI build steps, and to ensure your template builds are repeatable.

Here's how `Vpc.fromLookup()` can be used:

[importing existing VPCs](test/integ.import-default-vpc.lit.ts)

`Vpc.fromLookup` is the recommended way to import VPCs. If for whatever
reason you do not want to use the context mechanism to look up a VPC at
synthesis time, you can also use `Vpc.fromVpcAttributes`. This has the
following limitations:

* Every subnet group in the VPC must have a subnet in each availability zone
  (for example, each AZ must have both a public and private subnet). Asymmetric
  VPCs are not supported.
* All VpcId, SubnetId, RouteTableId, ... parameters must either be known at
  synthesis time, or they must come from deploy-time list parameters whose
  deploy-time lengths are known at synthesis time.

Using `Vpc.fromVpcAttributes()` looks like this:

```ts
const vpc = ec2.Vpc.fromVpcAttributes(this, 'VPC', {
  vpcId: 'vpc-1234',
  availabilityZones: ['us-east-1a', 'us-east-1b'],

  // Either pass literals for all IDs
  publicSubnetIds: ['s-12345', 's-67890'],

  // OR: import a list of known length
  privateSubnetIds: Fn.importListValue('PrivateSubnetIds', 2),

  // OR: split an imported string to a list of known length
  isolatedSubnetIds: Fn.split(',', ssm.StringParameter.valueForStringParameter(this, `MyParameter`), 2),
});
```

For each subnet group the import function accepts optional parameters for subnet
names, route table ids and IPv4 CIDR blocks. When supplied, the length of these
lists are required to match the length of the list of subnet ids, allowing the
lists to be zipped together to form `ISubnet` instances.

Public subnet group example (for private or isolated subnet groups, use the properties with the respective prefix):

```ts
const vpc = ec2.Vpc.fromVpcAttributes(this, 'VPC', {
  vpcId: 'vpc-1234',
  availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
  publicSubnetIds: ['s-12345', 's-34567', 's-56789'],
  publicSubnetNames: ['Subnet A', 'Subnet B', 'Subnet C'],
  publicSubnetRouteTableIds: ['rt-12345', 'rt-34567', 'rt-56789'],
  publicSubnetIpv4CidrBlocks: ['10.0.0.0/24', '10.0.1.0/24', '10.0.2.0/24'],
});
```

The above example will create an `IVpc` instance with three public subnets:

| Subnet id | Availability zone | Subnet name | Route table id | IPv4 CIDR   |
| --------- | ----------------- | ----------- | -------------- | ----------- |
| s-12345   | us-east-1a        | Subnet A    | rt-12345       | 10.0.0.0/24 |
| s-34567   | us-east-1b        | Subnet B    | rt-34567       | 10.0.1.0/24 |
| s-56789   | us-east-1c        | Subnet B    | rt-56789       | 10.0.2.0/24 |

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

```ts
declare const loadBalancer: elbv2.ApplicationLoadBalancer;
declare const appFleet: autoscaling.AutoScalingGroup;
declare const dbFleet: autoscaling.AutoScalingGroup;

// Allow connections from anywhere
loadBalancer.connections.allowFromAnyIpv4(ec2.Port.tcp(443), 'Allow inbound HTTPS');

// The same, but an explicit IP address
loadBalancer.connections.allowFrom(ec2.Peer.ipv4('1.2.3.4/32'), ec2.Port.tcp(443), 'Allow inbound HTTPS');

// Allow connection between AutoScalingGroups
appFleet.connections.allowTo(dbFleet, ec2.Port.tcp(443), 'App can call database');
```

### Connection Peers

There are various classes that implement the connection peer part:

```ts
declare const appFleet: autoscaling.AutoScalingGroup;
declare const dbFleet: autoscaling.AutoScalingGroup;

// Simple connection peers
let peer = ec2.Peer.ipv4('10.0.0.0/16');
peer = ec2.Peer.anyIpv4();
peer = ec2.Peer.ipv6('::0/0');
peer = ec2.Peer.anyIpv6();
peer = ec2.Peer.prefixList('pl-12345');
appFleet.connections.allowTo(peer, ec2.Port.tcp(443), 'Allow outbound HTTPS');
```

Any object that has a security group can itself be used as a connection peer:

```ts
declare const fleet1: autoscaling.AutoScalingGroup;
declare const fleet2: autoscaling.AutoScalingGroup;
declare const appFleet: autoscaling.AutoScalingGroup;

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
ec2.Port.allIcmp()
ec2.Port.allIcmpV6()
ec2.Port.allTraffic()
```

> NOTE: Not all protocols have corresponding helper methods. In the absence of a helper method,
> you can instantiate `Port` yourself with your own settings. You are also welcome to contribute
> new helper methods.

### Default Ports

Some Constructs have default ports associated with them. For example, the
listener of a load balancer does (it's the public port), or instances of an
RDS database (it's the port the database is accepting connections on).

If the object you're calling the peering method on has a default port associated with it, you can call
`allowDefaultPortFrom()` and omit the port specifier. If the argument has an associated default port, call
`allowDefaultPortTo()`.

For example:

```ts
declare const listener: elbv2.ApplicationListener;
declare const appFleet: autoscaling.AutoScalingGroup;
declare const rdsDatabase: rds.DatabaseCluster;

// Port implicit in listener
listener.connections.allowDefaultPortFromAnyIpv4('Allow public');

// Port implicit in peer
appFleet.connections.allowDefaultPortTo(rdsDatabase, 'Fleet can access database');
```

### Security group rules

By default, security group wills be added inline to the security group in the output cloud formation
template, if applicable.  This includes any static rules by ip address and port range.  This
optimization helps to minimize the size of the template.

In some environments this is not desirable, for example if your security group access is controlled
via tags. You can disable inline rules per security group or globally via the context key
`@aws-cdk/aws-ec2.securityGroupDisableInlineRules`.

```ts fixture=with-vpc
const mySecurityGroupWithoutInlineRules = new ec2.SecurityGroup(this, 'SecurityGroup', {
  vpc,
  description: 'Allow ssh access to ec2 instances',
  allowAllOutbound: true,
  disableInlineRules: true
});
//This will add the rule as an external cloud formation construct
mySecurityGroupWithoutInlineRules.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from the world');
```

### Importing an existing security group

If you know the ID and the configuration of the security group to import, you can use `SecurityGroup.fromSecurityGroupId`:

```ts
const sg = ec2.SecurityGroup.fromSecurityGroupId(this, 'SecurityGroupImport', 'sg-1234', {
  allowAllOutbound: true,
});
```

Alternatively, use lookup methods to import security groups if you do not know the ID or the configuration details. Method `SecurityGroup.fromLookupByName` looks up a security group if the security group ID is unknown.

```ts fixture=with-vpc
const sg = ec2.SecurityGroup.fromLookupByName(this, 'SecurityGroupLookup', 'security-group-name', vpc);
```

If the security group ID is known and configuration details are unknown, use method `SecurityGroup.fromLookupById` instead. This method will lookup property `allowAllOutbound` from the current configuration of the security group.

```ts
const sg = ec2.SecurityGroup.fromLookupById(this, 'SecurityGroupLookup', 'sg-1234');
```

The result of `SecurityGroup.fromLookupByName` and `SecurityGroup.fromLookupById` operations will be written to a file called `cdk.context.json`. You must commit this file to source control so that the lookup values are available in non-privileged environments such as CI build steps, and to ensure your template builds are repeatable.

### Cross Stack Connections

If you are attempting to add a connection from a peer in one stack to a peer in a different stack, sometimes it is necessary to ensure that you are making the connection in
a specific stack in order to avoid a cyclic reference. If there are no other dependencies between stacks then it will not matter in which stack you make
the connection, but if there are existing dependencies (i.e. stack1 already depends on stack2), then it is important to make the connection in the dependent stack (i.e. stack1).

Whenever you make a `connections` function call, the ingress and egress security group rules will be added to the stack that the calling object exists in.
So if you are doing something like `peer1.connections.allowFrom(peer2)`, then the security group rules (both ingress and egress) will be created in `peer1`'s Stack.

As an example, if we wanted to allow a connection from a security group in one stack (egress) to a security group in a different stack (ingress),
we would make the connection like:

**If Stack1 depends on Stack2**

```ts fixture=with-vpc
// Stack 1
declare const stack1: Stack;
declare const stack2: Stack;

const sg1 = new ec2.SecurityGroup(stack1, 'SG1', {
  allowAllOutbound: false, // if this is `true` then no egress rule will be created
  vpc,
});

// Stack 2
const sg2 = new ec2.SecurityGroup(stack2, 'SG2', {
  allowAllOutbound: false, // if this is `true` then no egress rule will be created
  vpc,
});


// `connections.allowTo` on `sg1` since we want the
// rules to be created in Stack1
sg1.connections.allowTo(sg2, ec2.Port.tcp(3333));
```

In this case both the Ingress Rule for `sg2` and the Egress Rule for `sg1` will both be created
in `Stack 1` which avoids the cyclic reference.


**If Stack2 depends on Stack1**

```ts fixture=with-vpc
// Stack 1
declare const stack1: Stack;
declare const stack2: Stack;

const sg1 = new ec2.SecurityGroup(stack1, 'SG1', {
  allowAllOutbound: false, // if this is `true` then no egress rule will be created
  vpc,
});

// Stack 2
const sg2 = new ec2.SecurityGroup(stack2, 'SG2', {
  allowAllOutbound: false, // if this is `true` then no egress rule will be created
  vpc,
});


// `connections.allowFrom` on `sg2` since we want the
// rules to be created in Stack2
sg2.connections.allowFrom(sg1, ec2.Port.tcp(3333));
```

In this case both the Ingress Rule for `sg2` and the Egress Rule for `sg1` will both be created
in `Stack 2` which avoids the cyclic reference.

## Machine Images (AMIs)

AMIs control the OS that gets launched when you start your EC2 instance. The EC2
library contains constructs to select the AMI you want to use.

Depending on the type of AMI, you select it a different way. Here are some
examples of images you might want to use:

[example of creating images](test/example.images.lit.ts)

> NOTE: The AMIs selected by `MachineImage.lookup()` will be cached in
> `cdk.context.json`, so that your AutoScalingGroup instances aren't replaced while
> you are making unrelated changes to your CDK app.
>
> To query for the latest AMI again, remove the relevant cache entry from
> `cdk.context.json`, or use the `cdk context` command. For more information, see
> [Runtime Context](https://docs.aws.amazon.com/cdk/latest/guide/context.html) in the CDK
> developer guide.
>
> `MachineImage.genericLinux()`, `MachineImage.genericWindows()` will use `CfnMapping` in
> an agnostic stack.

## Special VPC configurations

### VPN connections to a VPC

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
private subnets exist, isolated subnets are used. If no isolated subnets exist, public subnets are
used. Use the `Vpc` property `vpnRoutePropagation` to customize this behavior.

VPN connections expose [metrics (cloudwatch.Metric)](https://github.com/aws/aws-cdk/blob/main/packages/%40aws-cdk/aws-cloudwatch/README.md) across all tunnels in the account/region and per connection:

```ts fixture=with-vpc
// Across all tunnels in the account/region
const allDataOut = ec2.VpnConnection.metricAllTunnelDataOut();

// For a specific vpn connection
const vpnConnection = vpc.addVpnConnection('Dynamic', {
  ip: '1.2.3.4'
});
const state = vpnConnection.metricTunnelState();
```

### VPC endpoints

A VPC endpoint enables you to privately connect your VPC to supported AWS services and VPC endpoint services powered by PrivateLink without requiring an internet gateway, NAT device, VPN connection, or AWS Direct Connect connection. Instances in your VPC do not require public IP addresses to communicate with resources in the service. Traffic between your VPC and the other service does not leave the Amazon network.

Endpoints are virtual devices. They are horizontally scaled, redundant, and highly available VPC components that allow communication between instances in your VPC and services without imposing availability risks or bandwidth constraints on your network traffic.

[example of setting up VPC endpoints](test/integ.vpc-endpoint.lit.ts)

By default, CDK will place a VPC endpoint in one subnet per AZ. If you wish to override the AZs CDK places the VPC endpoint in,
use the `subnets` parameter as follows:

```ts
declare const vpc: ec2.Vpc;

new ec2.InterfaceVpcEndpoint(this, 'VPC Endpoint', {
  vpc,
  service: new ec2.InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
  // Choose which availability zones to place the VPC endpoint in, based on
  // available AZs
  subnets: {
    availabilityZones: ['us-east-1a', 'us-east-1c']
  }
});
```

Per the [AWS documentation](https://aws.amazon.com/premiumsupport/knowledge-center/interface-endpoint-availability-zone/), not all
VPC endpoint services are available in all AZs. If you specify the parameter `lookupSupportedAzs`, CDK attempts to discover which
AZs an endpoint service is available in, and will ensure the VPC endpoint is not placed in a subnet that doesn't match those AZs.
These AZs will be stored in cdk.context.json.

```ts
declare const vpc: ec2.Vpc;

new ec2.InterfaceVpcEndpoint(this, 'VPC Endpoint', {
  vpc,
  service: new ec2.InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
  // Choose which availability zones to place the VPC endpoint in, based on
  // available AZs
  lookupSupportedAzs: true
});
```

Pre-defined AWS services are defined in the [InterfaceVpcEndpointAwsService](lib/vpc-endpoint.ts) class, and can be used to
create VPC endpoints without having to configure name, ports, etc. For example, a Keyspaces endpoint can be created for
use in your VPC:

``` ts
declare const vpc: ec2.Vpc;

new ec2.InterfaceVpcEndpoint(this, 'VPC Endpoint', {
  vpc,
  service: ec2.InterfaceVpcEndpointAwsService.KEYSPACES,
});
```

#### Security groups for interface VPC endpoints

By default, interface VPC endpoints create a new security group and traffic is **not**
automatically allowed from the VPC CIDR.

Use the `connections` object to allow traffic to flow to the endpoint:

```ts
declare const myEndpoint: ec2.InterfaceVpcEndpoint;

myEndpoint.connections.allowDefaultPortFromAnyIpv4();
```

Alternatively, existing security groups can be used by specifying the `securityGroups` prop.

### VPC endpoint services

A VPC endpoint service enables you to expose a Network Load Balancer(s) as a provider service to consumers, who connect to your service over a VPC endpoint. You can restrict access to your service via allowed principals (anything that extends ArnPrincipal), and require that new connections be manually accepted.

```ts
declare const networkLoadBalancer1: elbv2.NetworkLoadBalancer;
declare const networkLoadBalancer2: elbv2.NetworkLoadBalancer;

new ec2.VpcEndpointService(this, 'EndpointService', {
  vpcEndpointServiceLoadBalancers: [networkLoadBalancer1, networkLoadBalancer2],
  acceptanceRequired: true,
  allowedPrincipals: [new iam.ArnPrincipal('arn:aws:iam::123456789012:root')]
});
```

Endpoint services support private DNS, which makes it easier for clients to connect to your service by automatically setting up DNS in their VPC.
You can enable private DNS on an endpoint service like so:

```ts
import { HostedZone, VpcEndpointServiceDomainName } from 'aws-cdk-lib/aws-route53';
declare const zone: HostedZone;
declare const vpces: ec2.VpcEndpointService;

new VpcEndpointServiceDomainName(this, 'EndpointDomain', {
  endpointService: vpces,
  domainName: 'my-stuff.aws-cdk.dev',
  publicHostedZone: zone,
});
```

Note: The domain name must be owned (registered through Route53) by the account the endpoint service is in, or delegated to the account.
The VpcEndpointServiceDomainName will handle the AWS side of domain verification, the process for which can be found
[here](https://docs.aws.amazon.com/vpc/latest/userguide/endpoint-services-dns-validation.html)

### Client VPN endpoint

AWS Client VPN is a managed client-based VPN service that enables you to securely access your AWS
resources and resources in your on-premises network. With Client VPN, you can access your resources
from any location using an OpenVPN-based VPN client.

Use the `addClientVpnEndpoint()` method to add a client VPN endpoint to a VPC:

```ts fixture=client-vpn
vpc.addClientVpnEndpoint('Endpoint', {
  cidr: '10.100.0.0/16',
  serverCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/server-certificate-id',
  // Mutual authentication
  clientCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/client-certificate-id',
  // User-based authentication
  userBasedAuthentication: ec2.ClientVpnUserBasedAuthentication.federated(samlProvider),
});
```

The endpoint must use at least one [authentication method](https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/client-authentication.html):

* Mutual authentication with a client certificate
* User-based authentication (directory or federated)

If user-based authentication is used, the [self-service portal URL](https://docs.aws.amazon.com/vpn/latest/clientvpn-user/self-service-portal.html)
is made available via a CloudFormation output.

By default, a new security group is created, and logging is enabled. Moreover, a rule to
authorize all users to the VPC CIDR is created.

To customize authorization rules, set the `authorizeAllUsersToVpcCidr` prop to `false`
and use `addAuthorizationRule()`:

```ts fixture=client-vpn
const endpoint = vpc.addClientVpnEndpoint('Endpoint', {
  cidr: '10.100.0.0/16',
  serverCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/server-certificate-id',
  userBasedAuthentication: ec2.ClientVpnUserBasedAuthentication.federated(samlProvider),
  authorizeAllUsersToVpcCidr: false,
});

endpoint.addAuthorizationRule('Rule', {
  cidr: '10.0.10.0/32',
  groupId: 'group-id',
});
```

Use `addRoute()` to configure network routes:

```ts fixture=client-vpn
const endpoint = vpc.addClientVpnEndpoint('Endpoint', {
  cidr: '10.100.0.0/16',
  serverCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/server-certificate-id',
  userBasedAuthentication: ec2.ClientVpnUserBasedAuthentication.federated(samlProvider),
});

// Client-to-client access
endpoint.addRoute('Route', {
  cidr: '10.100.0.0/16',
  target: ec2.ClientVpnRouteTarget.local(),
});
```

Use the `connections` object of the endpoint to allow traffic to other security groups.

## Instances

You can use the `Instance` class to start up a single EC2 instance. For production setups, we recommend
you use an `AutoScalingGroup` from the `aws-autoscaling` module instead, as AutoScalingGroups will take
care of restarting your instance if it ever fails.

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;

// Amazon Linux 1
new ec2.Instance(this, 'Instance1', {
  vpc,
  instanceType,
  machineImage: ec2.MachineImage.latestAmazonLinux(),
});

// Amazon Linux 2
new ec2.Instance(this, 'Instance2', {
  vpc,
  instanceType,
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),
});

// Amazon Linux 2 with kernel 5.x
new ec2.Instance(this, 'Instance3', {
  vpc,
  instanceType,
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    kernel: ec2.AmazonLinuxKernel.KERNEL5_X,
  }),
});

// AWS Linux 2022
new ec2.Instance(this, 'Instance4', {
  vpc,
  instanceType,
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2022,
  }),
});

// Graviton 3 Processor
new ec2.Instance(this, 'Instance5', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.C7G, ec2.InstanceSize.LARGE),
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    cpuType: ec2.AmazonLinuxCpuType.ARM_64,
  }),
});
```

### Configuring Instances using CloudFormation Init (cfn-init)

CloudFormation Init allows you to configure your instances by writing files to them, installing software
packages, starting services and running arbitrary commands. By default, if any of the instance setup
commands throw an error; the deployment will fail and roll back to the previously known good state.
The following documentation also applies to `AutoScalingGroup`s.

For the full set of capabilities of this system, see the documentation for
[`AWS::CloudFormation::Init`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-init.html).
Here is an example of applying some configuration to an instance:

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;
declare const machineImage: ec2.IMachineImage;

new ec2.Instance(this, 'Instance', {
  vpc,
  instanceType,
  machineImage,

  // Showing the most complex setup, if you have simpler requirements
  // you can use `CloudFormationInit.fromElements()`.
  init: ec2.CloudFormationInit.fromConfigSets({
    configSets: {
      // Applies the configs below in this order
      default: ['yumPreinstall', 'config'],
    },
    configs: {
      yumPreinstall: new ec2.InitConfig([
        // Install an Amazon Linux package using yum
        ec2.InitPackage.yum('git'),
      ]),
      config: new ec2.InitConfig([
        // Create a JSON file from tokens (can also create other files)
        ec2.InitFile.fromObject('/etc/stack.json', {
          stackId: Stack.of(this).stackId,
          stackName: Stack.of(this).stackName,
          region: Stack.of(this).region,
        }),

        // Create a group and user
        ec2.InitGroup.fromName('my-group'),
        ec2.InitUser.fromName('my-user'),

        // Install an RPM from the internet
        ec2.InitPackage.rpm('http://mirrors.ukfast.co.uk/sites/dl.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/r/rubygem-git-1.5.0-2.el8.noarch.rpm'),
      ]),
    },
  }),
  initOptions: {
    // Optional, which configsets to activate (['default'] by default)
    configSets: ['default'],

    // Optional, how long the installation is expected to take (5 minutes by default)
    timeout: Duration.minutes(30),

    // Optional, whether to include the --url argument when running cfn-init and cfn-signal commands (false by default)
    includeUrl: true,

    // Optional, whether to include the --role argument when running cfn-init and cfn-signal commands (false by default)
    includeRole: true,
  },
});
```

`InitCommand` can not be used to start long-running processes. At deploy time,
`cfn-init` will always wait for the process to exit before continuing, causing
the CloudFormation deployment to fail because the signal hasn't been received
within the expected timeout.

Instead, you should install a service configuration file onto your machine `InitFile`,
and then use `InitService` to start it.

If your Linux OS is using SystemD (like Amazon Linux 2 or higher), the CDK has
helpers to create a long-running service using CFN Init. You can create a
SystemD-compatible config file using `InitService.systemdConfigFile()`, and
start it immediately. The following examples shows how to start a trivial Python
3 web server:

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;

new ec2.Instance(this, 'Instance', {
  vpc,
  instanceType,
  machineImage: ec2.MachineImage.latestAmazonLinux({
    // Amazon Linux 2 uses SystemD
    generation: ec2.AmazonLinuxGeneration: AMAZON_LINUX_2,
  }),

  init: ec2.CloudFormationInit.fromElements([
    // Create a simple config file that runs a Python web server
    ec2.InitService.systemdConfigFile('simpleserver', {
      command: '/usr/bin/python3 -m http.server 8080',
      cwd: '/var/www/html',
    }),
    // Start the server using SystemD
    ec2.InitService.enable('simpleserver', {
      serviceManager: ec2.ServiceManager.SYSTEMD,
    }),
    // Drop an example file to show the web server working
    ec2.InitFile.fromString('/var/www/html/index.html', 'Hello! It\'s working!'),
  ]),
});
```

You can have services restarted after the init process has made changes to the system.
To do that, instantiate an `InitServiceRestartHandle` and pass it to the config elements
that need to trigger the restart and the service itself. For example, the following
config writes a config file for nginx, extracts an archive to the root directory, and then
restarts nginx so that it picks up the new config and files:

```ts
declare const myBucket: s3.Bucket;

const handle = new ec2.InitServiceRestartHandle();

ec2.CloudFormationInit.fromElements(
  ec2.InitFile.fromString('/etc/nginx/nginx.conf', '...', { serviceRestartHandles: [handle] }),
  ec2.InitSource.fromS3Object('/var/www/html', myBucket, 'html.zip', { serviceRestartHandles: [handle] }),
  ec2.InitService.enable('nginx', {
    serviceRestartHandle: handle,
  })
);
```

### Bastion Hosts

A bastion host functions as an instance used to access servers and resources in a VPC without open up the complete VPC on a network level.
You can use bastion hosts using a standard SSH connection targeting port 22 on the host. As an alternative, you can connect the SSH connection
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

EBS volume for the bastion host can be encrypted like:

```ts fixture=with-vpc
const host = new ec2.BastionHostLinux(this, 'BastionHost', {
  vpc,
  blockDevices: [{
    deviceName: 'EBSBastionHost',
    volume: ec2.BlockDeviceVolume.ebs(10, {
      encrypted: true,
    }),
  }],
});
```

### Block Devices

To add EBS block device mappings, specify the `blockDevices` property. The following example sets the EBS-backed
root device (`/dev/sda1`) size to 50 GiB, and adds another EBS-backed device mapped to `/dev/sdm` that is 100 GiB in
size:

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;
declare const machineImage: ec2.IMachineImage;

new ec2.Instance(this, 'Instance', {
  vpc,
  instanceType,
  machineImage,

  // ...

  blockDevices: [
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

It is also possible to encrypt the block devices. In this example we will create an customer managed key encrypted EBS-backed root device:

```ts
import { Key } from 'aws-cdk-lib/aws-kms';

declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;
declare const machineImage: ec2.IMachineImage;

const kmsKey = new Key(this, 'KmsKey')

new ec2.Instance(this, 'Instance', {
  vpc,
  instanceType,
  machineImage,

  // ...

  blockDevices: [
    {
      deviceName: '/dev/sda1',
      volume: ec2.BlockDeviceVolume.ebs(50, {
        encrypted: true,
        kmsKey: kmsKey,
      }),
    },
  ],
});

```

### Volumes

Whereas a `BlockDeviceVolume` is an EBS volume that is created and destroyed as part of the creation and destruction of a specific instance. A `Volume` is for when you want an EBS volume separate from any particular instance. A `Volume` is an EBS block device that can be attached to, or detached from, any instance at any time. Some types of `Volume`s can also be attached to multiple instances at the same time to allow you to have shared storage between those instances.

A notable restriction is that a Volume can only be attached to instances in the same availability zone as the Volume itself.

The following demonstrates how to create a 500 GiB encrypted Volume in the `us-west-2a` availability zone, and give a role the ability to attach that Volume to a specific instance:

```ts
declare const instance: ec2.Instance;
declare const role: iam.Role;

const volume = new ec2.Volume(this, 'Volume', {
  availabilityZone: 'us-west-2a',
  size: Size.gibibytes(500),
  encrypted: true,
});

volume.grantAttachVolume(role, [instance]);
```

#### Instances Attaching Volumes to Themselves

If you need to grant an instance the ability to attach/detach an EBS volume to/from itself, then using `grantAttachVolume` and `grantDetachVolume` as outlined above
will lead to an unresolvable circular reference between the instance role and the instance. In this case, use `grantAttachVolumeByResourceTag` and `grantDetachVolumeByResourceTag` as follows:

```ts
declare const instance: ec2.Instance;
declare const volume: ec2.Volume;

const attachGrant = volume.grantAttachVolumeByResourceTag(instance.grantPrincipal, [instance]);
const detachGrant = volume.grantDetachVolumeByResourceTag(instance.grantPrincipal, [instance]);
```

#### Attaching Volumes

The Amazon EC2 documentation for
[Linux Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html) and
[Windows Instances](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/ebs-volumes.html) contains information on how
to attach and detach your Volumes to/from instances, and how to format them for use.

The following is a sample skeleton of EC2 UserData that can be used to attach a Volume to the Linux instance that it is running on:

```ts
declare const instance: ec2.Instance;
declare const volume: ec2.Volume;

volume.grantAttachVolumeByResourceTag(instance.grantPrincipal, [instance]);
const targetDevice = '/dev/xvdz';
instance.userData.addCommands(
  // Retrieve token for accessing EC2 instance metadata (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html)
  `TOKEN=$(curl -SsfX PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")`,
  // Retrieve the instance Id of the current EC2 instance
  `INSTANCE_ID=$(curl -SsfH "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id)`,
  // Attach the volume to /dev/xvdz
  `aws --region ${Stack.of(this).region} ec2 attach-volume --volume-id ${volume.volumeId} --instance-id $INSTANCE_ID --device ${targetDevice}`,
  // Wait until the volume has attached
  `while ! test -e ${targetDevice}; do sleep 1; done`
  // The volume will now be mounted. You may have to add additional code to format the volume if it has not been prepared.
);
```

#### Tagging Volumes

You can configure [tag propagation on volume creation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-propagatetagstovolumeoncreation).

```ts
  declare const vpc: ec2.Vpc;
  declare const instanceType: ec2.InstanceType;
  declare const machineImage: ec2.IMachineImage;

  new ec2.Instance(this, 'Instance', {
    vpc,
    machineImage,
    instanceType,
    propagateTagsToVolumeOnCreation: true,
  });
```

#### Throughput on GP3 Volumes

You can specify the `throughput` of a GP3 volume from 125 (default) to 1000.

```ts
new ec2.Volume(this, 'Volume', {
  availabilityZone: 'us-east-1a',
  size: cdk.Size.gibibytes(125),
  volumeType: EbsDeviceVolumeType.GP3,
  throughput: 125,
});
```

### Configuring Instance Metadata Service (IMDS)

#### Toggling IMDSv1

You can configure [EC2 Instance Metadata Service](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html) options to either
allow both IMDSv1 and IMDSv2 or enforce IMDSv2 when interacting with the IMDS.

To do this for a single `Instance`, you can use the `requireImdsv2` property.
The example below demonstrates IMDSv2 being required on a single `Instance`:

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;
declare const machineImage: ec2.IMachineImage;

new ec2.Instance(this, 'Instance', {
  vpc,
  instanceType,
  machineImage,

  // ...

  requireImdsv2: true,
});
```

You can also use the either the `InstanceRequireImdsv2Aspect` for EC2 instances or the `LaunchTemplateRequireImdsv2Aspect` for EC2 launch templates
to apply the operation to multiple instances or launch templates, respectively.

The following example demonstrates how to use the `InstanceRequireImdsv2Aspect` to require IMDSv2 for all EC2 instances in a stack:

```ts
const aspect = new ec2.InstanceRequireImdsv2Aspect();
Aspects.of(this).add(aspect);
```

## VPC Flow Logs

VPC Flow Logs is a feature that enables you to capture information about the IP traffic going to and from network interfaces in your VPC. Flow log data can be published to Amazon CloudWatch Logs and Amazon S3. After you've created a flow log, you can retrieve and view its data in the chosen destination. (<https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html>).

By default, a flow log will be created with CloudWatch Logs as the destination.

You can create a flow log like this:

```ts
declare const vpc: ec2.Vpc;

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

// Only reject traffic and interval every minute.
vpc.addFlowLog('FlowLogCloudWatch', {
  trafficType: ec2.FlowLogTrafficType.REJECT,
  maxAggregationInterval: FlowLogMaxAggregationInterval.ONE_MINUTE,
});
```

### Custom Formatting

You can also custom format flow logs.

```ts
const vpc = new ec2.Vpc(this, 'Vpc');

vpc.addFlowLog('FlowLog', {
  logFormat: [
    ec2.LogFormat.DST_PORT,
    ec2.LogFormat.SRC_PORT,
  ],
});

// If you just want to add a field to the default field
vpc.addFlowLog('FlowLog', {
  logFormat: [
    ec2.LogFormat.VERSION,
    ec2.LogFormat.ALL_DEFAULT_FIELDS,
  ],
});

// If AWS CDK does not support the new fields
vpc.addFlowLog('FlowLog', {
  logFormat: [
    ec2.LogFormat.SRC_PORT,
    ec2.LogFormat.custom('${new-field}'),
  ],
});
```


By default, the CDK will create the necessary resources for the destination. For the CloudWatch Logs destination
it will create a CloudWatch Logs Log Group as well as the IAM role with the necessary permissions to publish to
the log group. In the case of an S3 destination, it will create the S3 bucket.

If you want to customize any of the destination resources you can provide your own as part of the `destination`.

*CloudWatch Logs*

```ts
declare const vpc: ec2.Vpc;

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
declare const vpc: ec2.Vpc;

const bucket = new s3.Bucket(this, 'MyCustomBucket');

new ec2.FlowLog(this, 'FlowLog', {
  resourceType: ec2.FlowLogResourceType.fromVpc(vpc),
  destination: ec2.FlowLogDestination.toS3(bucket)
});

new ec2.FlowLog(this, 'FlowLogWithKeyPrefix', {
  resourceType: ec2.FlowLogResourceType.fromVpc(vpc),
  destination: ec2.FlowLogDestination.toS3(bucket, 'prefix/')
});
```

When the S3 destination is configured, AWS will automatically create an S3 bucket policy
that allows the service to write logs to the bucket. This makes it impossible to later update
that bucket policy. To have CDK create the bucket policy so that future updates can be made,
the `@aws-cdk/aws-s3:createDefaultLoggingPolicy` [feature flag](https://docs.aws.amazon.com/cdk/v2/guide/featureflags.html) can be used. This can be set
in the `cdk.json` file.

```json
{
  "context": {
    "@aws-cdk/aws-s3:createDefaultLoggingPolicy": true
  }
}
```

## User Data

User data enables you to run a script when your instances start up.  In order to configure these scripts you can add commands directly to the script
 or you can use the UserData's convenience functions to aid in the creation of your script.

A user data could be configured to run a script found in an asset through the following:

```ts
import { Asset } from 'aws-cdk-lib/aws-s3-assets';

declare const instance: ec2.Instance;

const asset = new Asset(this, 'Asset', {
  path: './configure.sh'
});

const localPath = instance.userData.addS3DownloadCommand({
  bucket:asset.bucket,
  bucketKey:asset.s3ObjectKey,
  region: 'us-east-1', // Optional
});
instance.userData.addExecuteFileCommand({
  filePath:localPath,
  arguments: '--verbose -y'
});
asset.grantRead(instance.role);
```

### Persisting user data

By default, EC2 UserData is run once on only the first time that an instance is started. It is possible to make the
user data script run on every start of the instance.

When creating a Windows UserData you can use the `persist` option to set whether or not to add
`<persist>true</persist>` [to the user data script](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/ec2-windows-user-data.html#user-data-scripts). it can be used as follows:

```ts
const windowsUserData = UserData.forWindows({ persist: true });
```

For a Linux instance, this can be accomplished by using a Multipart user data to configure cloud-config as detailed
in: https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/

### Multipart user data

In addition, to above the `MultipartUserData` can be used to change instance startup behavior. Multipart user data are composed
from separate parts forming archive. The most common parts are scripts executed during instance set-up. However, there are other
kinds, too.

The advantage of multipart archive is in flexibility when it's needed to add additional parts or to use specialized parts to
fine tune instance startup. Some services (like AWS Batch) support only `MultipartUserData`.

The parts can be executed at different moment of instance start-up and can serve a different purpose. This is controlled by `contentType` property.
For common scripts, `text/x-shellscript; charset="utf-8"` can be used as content type.

In order to create archive the `MultipartUserData` has to be instantiated. Than, user can add parts to multipart archive using `addPart`. The `MultipartBody` contains methods supporting creation of body parts.

If the very custom part is required, it can be created using `MultipartUserData.fromRawBody`, in this case full control over content type,
transfer encoding, and body properties is given to the user.

Below is an example for creating multipart user data with single body part responsible for installing `awscli` and configuring maximum size
of storage used by Docker containers:

```ts
const bootHookConf = ec2.UserData.forLinux();
bootHookConf.addCommands('cloud-init-per once docker_options echo \'OPTIONS="${OPTIONS} --storage-opt dm.basesize=40G"\' >> /etc/sysconfig/docker');

const setupCommands = ec2.UserData.forLinux();
setupCommands.addCommands('sudo yum install awscli && echo Packages installed らと > /var/tmp/setup');

const multipartUserData = new ec2.MultipartUserData();
// The docker has to be configured at early stage, so content type is overridden to boothook
multipartUserData.addPart(ec2.MultipartBody.fromUserData(bootHookConf, 'text/cloud-boothook; charset="us-ascii"'));
// Execute the rest of setup
multipartUserData.addPart(ec2.MultipartBody.fromUserData(setupCommands));

new ec2.LaunchTemplate(this, '', {
  userData: multipartUserData,
  blockDevices: [
    // Block device configuration rest
  ]
});
```

For more information see
[Specifying Multiple User Data Blocks Using a MIME Multi Part Archive](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/bootstrap_container_instance.html#multi-part_user_data)

#### Using add*Command on MultipartUserData

To use the `add*Command` methods, that are inherited from the `UserData` interface, on `MultipartUserData` you must add a part
to the `MultipartUserData` and designate it as the receiver for these methods. This is accomplished by using the `addUserDataPart()`
method on `MultipartUserData` with the `makeDefault` argument set to `true`:

```ts
const multipartUserData = new ec2.MultipartUserData();
const commandsUserData = ec2.UserData.forLinux();
multipartUserData.addUserDataPart(commandsUserData, ec2.MultipartBody.SHELL_SCRIPT, true);

// Adding commands to the multipartUserData adds them to commandsUserData, and vice-versa.
multipartUserData.addCommands('touch /root/multi.txt');
commandsUserData.addCommands('touch /root/userdata.txt');
```

When used on an EC2 instance, the above `multipartUserData` will create both `multi.txt` and `userdata.txt` in `/root`.

## Importing existing subnet

To import an existing Subnet, call `Subnet.fromSubnetAttributes()` or
`Subnet.fromSubnetId()`. Only if you supply the subnet's Availability Zone
and Route Table Ids when calling `Subnet.fromSubnetAttributes()` will you be
able to use the CDK features that use these values (such as selecting one
subnet per AZ).

Importing an existing subnet looks like this:

```ts
// Supply all properties
const subnet1 = ec2.Subnet.fromSubnetAttributes(this, 'SubnetFromAttributes', {
  subnetId: 's-1234',
  availabilityZone: 'pub-az-4465',
  routeTableId: 'rt-145'
});

// Supply only subnet id
const subnet2 = ec2.Subnet.fromSubnetId(this, 'SubnetFromId', 's-1234');
```

## Launch Templates

A Launch Template is a standardized template that contains the configuration information to launch an instance.
They can be used when launching instances on their own, through Amazon EC2 Auto Scaling, EC2 Fleet, and Spot Fleet.
Launch templates enable you to store launch parameters so that you do not have to specify them every time you launch
an instance. For information on Launch Templates please see the
[official documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html).

The following demonstrates how to create a launch template with an Amazon Machine Image, and security group.

```ts
declare const vpc: ec2.Vpc;

const template = new ec2.LaunchTemplate(this, 'LaunchTemplate', {
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),
  securityGroup: new ec2.SecurityGroup(this, 'LaunchTemplateSG', {
    vpc: vpc,
  }),
});
```

And the following demonstrates how to enable metadata options support.

```ts
new ec2.LaunchTemplate(this, 'LaunchTemplate', {
  httpEndpoint: true,
  httpProtocolIpv6: true,
  httpPutResponseHopLimit: 1,
  httpTokens: ec2.LaunchTemplateHttpTokens.REQUIRED,
  instanceMetadataTags: true,
});
```

## Detailed Monitoring

The following demonstrates how to enable [Detailed Monitoring](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html) for an EC2 instance. Keep in mind that Detailed Monitoring results in [additional charges](http://aws.amazon.com/cloudwatch/pricing/).

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;

new ec2.Instance(this, 'Instance1', {
  vpc,
  instanceType,
  machineImage: ec2.MachineImage.latestAmazonLinux(),
  detailedMonitoring: true,
});
```

## Connecting to your instances using SSM Session Manager

SSM Session Manager makes it possible to connect to your instances from the
AWS Console, without preparing SSH keys.

To do so, you need to:

* Use an image with [SSM agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html) installed
  and configured. [Many images come with SSM Agent
  preinstalled](https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html), otherwise you
  may need to manually put instructions to [install SSM
  Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-manual-agent-install.html) into your
  instance's UserData or use EC2 Init).
* Create the instance with `ssmSessionPermissions: true`.

If these conditions are met, you can connect to the instance from the EC2 Console. Example:

```ts
declare const vpc: ec2.Vpc;
declare const instanceType: ec2.InstanceType;

new ec2.Instance(this, 'Instance1', {
  vpc,
  instanceType,

  // Amazon Linux 2 comes with SSM Agent by default
  machineImage: ec2.MachineImage.latestAmazonLinux({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),

  // Turn on SSM
  ssmSessionPermissions: true,
});
```
