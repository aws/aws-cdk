## AWS Compute and Networking Construct Library

The `@aws-cdk/aws-ec2` package contains primitives for setting up networking,
instances, and load balancers.

### VPC

Most projects need a Virtual Private Cloud to provide security by means of
network partitioning. This is easily achieved by creating an instance of
`VpcNetwork`:

```ts
import ec2 = require('@aws-cdk/aws-ec2');

const vpc = new ec2.VpcNetwork(this, 'VPC');
```

All default Constructs requires EC2 instances to be launched inside a VPC, so
you should generally start by defining a VPC whenever you need to launch
instances for your project.

Our default `VpcNetwork` class creates a private and public subnet for every
availability zone. Classes that use the VPC will generally launch instances
into all private subnets, and provide a parameter called `vpcPlacement` to
allow you to override the placement. [Read more about
subnets](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Subnets.html).

### Auto Scaling Group

An `AutoScalingGroup` represents a number of instances on which you run your code. You
pick the size of the fleet, the instance type and the OS image:

```ts
import ec2 = require('@aws-cdk/aws-ec2');

new ec2.AutoScalingGroup(stack, 'ASG', {
    vpc,
    instanceType: new ec2.InstanceTypePair(InstanceClass.Burstable2, InstanceSize.Micro),
    machineImage: new ec2.LinuxImage({
        'us-east-1': 'ami-97785bed'
    })
});
```

> NOTE: AutoScalingGroup has an property called `allowAllOutbound` (allowing the instances to contact the
> internet) which is set to `true` by default. Be sure to set this to `false`  if you don't want
> your instances to be able to start arbitrary connections.

### AMIs

AMIs control the OS that gets launched when you start your instance.

Depending on the type of AMI, you select it a different way.

The latest version of Windows images are regionally published under labels,
so you can select Windows images like this:

    new ec2.WindowsImage(WindowsVersion.WindowsServer2016EnglishNanoBase)

You can select the latest Amazon Linux image like this:

    new ec2.AmazonLinuxImage()

Other Linux images are unfortunately not currently published this way, so you have
to supply a region-to-AMI map when creating a Linux image:

    machineImage: new ec2.GenericLinuxImage({
        'us-east-1': 'ami-97785bed',
        'eu-west-1': 'ami-12345678',
        // ...
    })

> NOTE: Selecting Linux images will change when the information is published in an automatically
> consumable way.

### Load Balancer

Load balancers send traffic to one or more fleets. Create a load balancer,
set up listeners and a health check, and supply the fleet(s) you want to load
balance to in the `targets` property.

The load balancer allows all connections by default. If you want to change that,
pass the `allowConnectionsFrom` property while setting up the listener.

```ts
new ec2.ClassicLoadBalancer(stack, 'LB', {
    vpc,
    internetFacing: true,
    listeners: [{
        externalPort: 80,
    }],
    healthCheck: {
        port: 80
    },
    targets: [fleet]
});
```

### Allowing Connections

In AWS, all connections to and from EC2 instances are governed by *Security
Groups*. You can think of these as a firewall with rules. All Constructs that
create instances on your behalf implicitly have such a security group.
Unless otherwise indicated using properites, the security groups start out
empty; that is, no connections are allowed by default.

In general, whenever you link two Constructs together (such as the load balancer and the
fleet in the previous example), the security groups will be automatically updated to allow
network connections between the indicated instances. In other cases, you will need to
configure these allows connections yourself, for example if the connections you want to
allow do not originate from instances in a CDK construct, or if you want to allow
connections among instances inside a single security group.

All Constructs with security groups have a member called `connections`, which
can be used to configure permissible connections. In the most general case, a
call to allow connections needs both a connection peer and the type of
connection to allow:

```ts
lb.connections.allowFrom(new ec2.AnyIPv4(), new ec2.TcpPort(443), 'Allow inbound');

// Or using a convenience function
lb.connections.allowFromAnyIpv4(new ec2.TcpPort(443), 'Allow inbound');
```

### Connection Peers

There are various classes that implement the connection peer part:

```ts
// Simple connection peers
let peer = new ec2.CidrIp("10.0.0.0/16");
let peer = new ec2.AnyIPv4();
let peer = new ec2.CidrIpv6("::0/0");
let peer = new ec2.AnyIPv6();
let peer = new ec2.PrefixList("pl-12345");
fleet.connections.allowTo(peer, new ec2.TcpPort(443), 'Allow outbound HTTPS');
```

Any object that has a security group can itself be used as a connection peer:

```ts
// These automatically create appropriate ingress and egress rules in both security groups
fleet1.connections.allowTo(fleet2, new ec2.TcpPort(80), 'Allow between fleets');

fleet.connections.allowTcpPort(80), 'Allow from load balancer');
```

### Port Ranges

The connections that are allowed are specified by port ranges. A number of classes provide
the connection specifier:

```ts
new ec2.TcpPort(80);
new ec2.TcpPortRange(60000, 65535);
new ec2.TcpAllPorts();
new ec2.AllConnections();
```

> NOTE: This set is not complete yet; for example, there is no library support for ICMP at the moment.
> However, you can write your own classes to implement those.

### Default Ports

Some Constructs have default ports associated with them. For example, the
listener of a load balancer does (it's the public port), or instances of an
RDS database (it's the port the database is accepting connections on).

If the object you're calling the peering method on has a default port associated with it, you can call
`allowDefaultPortFrom()` and omit the port specifier. If the argument has an associated default port, call
`allowToDefaultPort()`.

For example:

```ts
// Port implicit in listener
listener.connections.allowDefaultPortFromAnyIpv4('Allow public');

// Port implicit in peer
fleet.connections.allowToDefaultPort(rdsDatabase, 'Fleet can access database');
```
