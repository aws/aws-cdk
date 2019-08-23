## Amazon EC2 Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

The `@aws-cdk/aws-ec2` package contains primitives for setting up networking and
instances.

### VPC

Most projects need a Virtual Private Cloud to provide security by means of
network partitioning. This is easily achieved by creating an instance of
`Vpc`:

```ts
import ec2 = require('@aws-cdk/aws-ec2');

const vpc = new ec2.Vpc(this, 'VPC');
```

All default Constructs requires EC2 instances to be launched inside a VPC, so
you should generally start by defining a VPC whenever you need to launch
instances for your project.

Our default `Vpc` class creates a private and public subnet for every
availability zone. Classes that use the VPC will generally launch instances
into all private subnets, and provide a parameter called `vpcSubnets` to
allow you to override the placement. [Read more about
subnets](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Subnets.html).


#### Advanced Subnet Configuration
If you require the ability to configure subnets the `Vpc` can be
customized with `SubnetConfiguration` array. This is best explained by an
example:

```ts
import ec2 = require('@aws-cdk/aws-ec2');

const vpc = new ec2.Vpc(this, 'TheVPC', {
  cidr: '10.0.0.0/21',
  subnetConfiguration: [
    {
      cidrMask: 24,
      name: 'Ingress',
      subnetType: ec2.SubnetType.PUBLIC,
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

Each `Public` Subnet will have a NAT Gateway. Each `Private` Subnet will have a
route to the NAT Gateway in the same availability zone. `Isolated` subnets
will not have a route to the internet, but are routeable within the VPC. The
numbers [1-3] will consistently map to availability zones (e.g. *IngressSubnet1*
and *ApplicationSubnet1* will be in the same avialbility zone).

`Isolated` Subnets provide simplified secure networking principles, but come at
an operational complexity. The lack of an internet route means that if you deploy
instances in this subnet you will not be able to patch from the internet, this is
commonly reffered to as
[fully baked images](https://aws.amazon.com/answers/configuration-management/aws-ami-design/).
Features such as
[cfn-signal](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-signal.html)
are also unavailable. Using these subnets for managed services (RDS,
Elasticache, Redshift) is a very practical use because the managed services do
not incur additional operational overhead.

Many times when you plan to build an application you don't know how many
instances of the application you will need and therefore you don't know how much
IP space to allocate. For example, you know the application will only have
Elastic Loadbalancers in the public subnets and you know you will have 1-3 RDS
databases for your data tier, and the rest of the IP space should just be evenly
distributed for the application.

```ts
import ec2 = require('@aws-cdk/aws-ec2');

const vpc = new ec2.Vpc(this, 'TheVPC', {
  cidr: '10.0.0.0/16',
  subnetConfiguration: [
    {
      cidrMask: 26,
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      name: 'Application',
      subnetType: ec2.SubnetType.PRIVATE,
    },
    {
      cidrMask: 27,
      name: 'Database',
      subnetType: ec2.SubnetType.ISOLATED,
    }
  ],
});
```

The `Vpc` from the above configuration in a Region with three
availability zones will be the following:

Subnet Name       |Type      | IP Block
------------------|----------|----------------
PublicSubnet1     |`PUBLIC`  |`10.0.0.0/26`
PublicSubnet2     |`PUBLIC`  |`10.0.0.64/26`
PublicSubnet3     |`PUBLIC`  |`10.0.2.128/26`
DatabaseSubnet1   |`PRIVATE` |`10.0.0.192/27`
DatabaseSubnet2   |`PRIVATE` |`10.0.0.224/27`
DatabaseSubnet3   |`PRIVATE` |`10.0.1.0/27`
ApplicationSubnet1|`ISOLATED`|`10.0.64.0/18`
ApplicationSubnet2|`ISOLATED`|`10.0.128.0/18`
ApplicationSubnet3|`ISOLATED`|`10.0.192.0/18`

Any subnet configuration without a `cidrMask` will be counted up and allocated
evenly across the remaining IP space.

Teams may also become cost conscious and be willing to trade availability for
cost. For example, in your test environments perhaps you would like the same VPC
as production, but instead of 3 NAT Gateways you would like only 1. This will
save on the cost, but trade the 3 availability zone to a 1 for all egress
traffic. This can be accomplished with a single parameter configuration:

```ts
import ec2 = require('@aws-cdk/aws-ec2');

const vpc = new ec2.Vpc(this, 'TheVPC', {
  cidr: '10.0.0.0/16',
  natGateways: 1,
  natGatewayPlacement: {subnetName: 'Public'},
  subnetConfiguration: [
    {
      cidrMask: 26,
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
      natGateway: true,
    },
    {
      name: 'Application',
      subnetType: ec2.SubnetType.PRIVATE,
    },
    {
      cidrMask: 27,
      name: 'Database',
      subnetType: ec2.SubnetType.ISOLATED,
    }
  ],
});
```

The `Vpc` above will have the exact same subnet definitions as listed
above. However, this time the VPC will have only 1 NAT Gateway and all
Application subnets will route to the NAT Gateway.

#### Reserving subnet IP space
There are situations where the IP space for a subnet or number of subnets
will need to be reserved. This is useful in situations where subnets
would need to be added after the vpc is originally deployed, without causing
IP renumbering for existing subnets. The IP space for a subnet may be reserved
by setting the `reserved` subnetConfiguration property to true, as shown below:

```ts
import ec2 = require('@aws-cdk/aws-ec2');
const vpc = new ec2.Vpc(this, 'TheVPC', {
  cidr: '10.0.0.0/16',
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
      reserved: true,
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
provisioned, then the `reserved: true` property should be removed. Most
importantly, this action would not cause the Database subnet to get renumbered,
but rather the IP space that was previously reserved will be used for the
subnet provisioned for Application2. The `reserved` property also takes into
consideration the number of availability zones when reserving IP space.

#### Sharing VPCs between stacks

If you are creating multiple `Stack`s inside the same CDK application, you
can reuse a VPC defined in one Stack in another by simply passing the VPC
instance around:

[sharing VPCs between stacks](test/integ.share-vpcs.lit.ts)

#### Importing an existing VPC

If your VPC is created outside your CDK app, you can use `Vpc.fromLookup()`:

[importing existing VPCs](test/integ.import-default-vpc.lit.ts)

### Allowing Connections

In AWS, all network traffic in and out of **Elastic Network Interfaces** (ENIs)
is controlled by **Security Groups**. You can think of Security Groups as a
firewall with a set of rules. By default, Security Groups allow no incoming
(ingress) traffic and all outgoing (egress) traffic. You can add ingress rules
to them to allow incoming traffic streams. To exert fine-grained control over
egress traffic, set `allowAllOutbound: false` on the `SecurityGroup`, after
which you can add egress traffic rules.

You can manipulate Security Groups directly:

```ts
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
// Simple connection peers
let peer = ec2.Peer.ipv4("10.0.0.0/16");
let peer = ec2.Peer.anyIpv4();
let peer = ec2.ipv6("::0/0");
let peer = ec2.anyIpv6();
let peer = ec2.prefixList("pl-12345");
fleet.connections.allowTo(peer, ec2.Port.tcp(443), 'Allow outbound HTTPS');
```

Any object that has a security group can itself be used as a connection peer:

```ts
// These automatically create appropriate ingress and egress rules in both security groups
fleet1.connections.allowTo(fleet2, ec2.Port.tcp(80), 'Allow between fleets');

fleet.connections.allowFromAnyIpv4(ec2.Port.tcp(80), 'Allow from load balancer');
```

### Port Ranges

The connections that are allowed are specified by port ranges. A number of classes provide
the connection specifier:

```ts
ec2.Port.tcp(80)
ec2.tcpRange(60000, 65535)
ec2.allTcp()
ec2.allTraffic()
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

```ts
// Port implicit in listener
listener.connections.allowDefaultPortFromAnyIpv4('Allow public');

// Port implicit in peer
fleet.connections.allowDefaultPortTo(rdsDatabase, 'Fleet can access database');
```

### Machine Images (AMIs)

AMIs control the OS that gets launched when you start your EC2 instance. The EC2
library contains constructs to select the AMI you want to use.

Depending on the type of AMI, you select it a different way.

The latest version of Amazon Linux and Microsoft Windows images are
selectable by instantiating one of these classes:

[example of creating images](test/example.images.lit.ts)

> NOTE: The Amazon Linux images selected will be cached in your `cdk.json`, so that your
> AutoScalingGroups don't automatically change out from under you when you're making unrelated
> changes. To update to the latest version of Amazon Linux, remove the cache entry from the `context`
> section of your `cdk.json`.
>
> We will add command-line options to make this step easier in the future.

### VPN connections to a VPC

Create your VPC with VPN connections by specifying the `vpnConnections` props (keys are construct `id`s):

```ts
const vpc = new ec2.Vpc(stack, 'MyVpc', {
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
const vpc = new ec2.Vpc(stack, 'MyVpc', {
  vpnGateway: true
});
```

VPN connections can then be added:
```ts
vpc.addVpnConnection('Dynamic', {
  ip: '1.2.3.4'
});
```

Routes will be propagated on the route tables associated with the private subnets.

VPN connections expose [metrics (cloudwatch.Metric)](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-cloudwatch/README.md) across all tunnels in the account/region and per connection:
```ts
// Across all tunnels in the account/region
const allDataOut = VpnConnection.metricAllTunnelDataOut();

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

### Bastion Hosts
A bastion host functions as an instance used to access servers and resources in a VPC without open up the complete VPC on a network level.
You can use bastion hosts using a standard SSH connection targetting port 22 on the host. As an alternative, you can connect the SSH connection
feature of AWS Systems Manager Session Manager, which does not need an opened security group. (https://aws.amazon.com/about-aws/whats-new/2019/07/session-manager-launches-tunneling-support-for-ssh-and-scp/)

A default bastion host for use via SSM can be configured like:
```ts
const host = new ec2.BastionHostLinux(this, 'BastionHost', { vpc });
```

If you want to connect from the internet using SSH, you need to place the host into a public subnet. You can then configure allowed source hosts.
```ts
const host = new ec2.BastionHostLinux(this, 'BastionHost', { 
  vpc,
  subnetSelection: { subnetType: SubnetType.PUBLIC },
});
host.allowSshAccessFrom(Peer.ipv4('1.2.3.4/32'));
```

As there are no SSH public keys deployed on this machine, you need to use [EC2 Instance Connect](https://aws.amazon.com/de/blogs/compute/new-using-amazon-ec2-instance-connect-for-ssh-access-to-your-ec2-instances/)
with the command `aws ec2-instance-connect send-ssh-public-key` to provide your SSH public key.
