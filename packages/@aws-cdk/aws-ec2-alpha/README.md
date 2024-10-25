# Amazon VpcV2 Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->


## VpcV2

`VpcV2` is a re-write of the [`ec2.Vpc`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.Vpc.html) construct. This new construct enables higher level of customization
on the VPC being created. `VpcV2` implements the existing [`IVpc`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.IVpc.html), therefore,
`VpcV2` is compatible with other constructs that accepts `IVpc` (e.g. [`ApplicationLoadBalancer`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_elasticloadbalancingv2.ApplicationLoadBalancer.html#construct-props)).

To create a VPC with both IPv4 and IPv6 support:

```ts

const stack = new Stack();
new VpcV2(this, 'Vpc', {
  primaryAddressBlock: IpAddresses.ipv4('10.0.0.0/24'),
  secondaryAddressBlocks: [
    IpAddresses.amazonProvidedIpv6({cidrBlockName: 'AmazonProvidedIpv6'}),
  ],
});
```

`VpcV2` does not automatically create subnets or allocate IP addresses, which is different from the `Vpc` construct.

Importing existing VPC in an account into CDK as a `VpcV2` is not yet supported.

## SubnetV2

`SubnetV2` is a re-write of the [`ec2.Subnet`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.Subnet.html) construct.
This new construct can be used to add subnets to a `VpcV2` instance:

```ts

const stack = new Stack();
const myVpc = new VpcV2(this, 'Vpc', {
  secondaryAddressBlocks: [
    IpAddresses.amazonProvidedIpv6({ cidrBlockName: 'AmazonProvidedIp'}),
  ],
});

new SubnetV2(this, 'subnetA', {
  vpc: myVpc,
  availabilityZone: 'us-east-1a',
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  ipv6CidrBlock: new IpCidr('2a05:d02c:25:4000::/60'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
})
```

Same as `VpcV2`, importing existing subnets is not yet supported.

## IP Addresses Management

By default `VpcV2` uses `10.0.0.0/16` as the primary CIDR if none is defined. 
Additional CIDRs can be adding to the VPC via the `secondaryAddressBlocks` prop.
The following example illustrates the different options of defining the address blocks:

```ts

const stack = new Stack();
const ipam = new Ipam(this, 'Ipam', {
  operatingRegion: ['us-west-1']
});
const ipamPublicPool = ipam.publicScope.addPool('PublicPoolA', {
  addressFamily: AddressFamily.IP_V6,
  awsService: AwsServiceName.EC2,
  locale: 'us-west-1',
  publicIpSource: IpamPoolPublicIpSource.AMAZON,
});
ipamPublicPool.provisionCidr('PublicPoolACidrA', { netmaskLength: 52 } );

const ipamPrivatePool = ipam.privateScope.addPool('PrivatePoolA', {
  addressFamily: AddressFamily.IP_V4,
});
ipamPrivatePool.provisionCidr('PrivatePoolACidrA', { netmaskLength: 8 } );

new VpcV2(this, 'Vpc', {
  primaryAddressBlock: IpAddresses.ipv4('10.0.0.0/24'),
  secondaryAddressBlocks: [
    IpAddresses.amazonProvidedIpv6({ cidrBlockName: 'AmazonIpv6' }),
    IpAddresses.ipv6Ipam({
      ipamPool: ipamPublicPool,
      netmaskLength: 52,
      cidrBlockName: 'ipv6Ipam',
    }),
    IpAddresses.ipv4Ipam({
      ipamPool: ipamPrivatePool,
      netmaskLength: 8,
      cidrBlockName: 'ipv4Ipam',
    }),
  ],
});
```

Since `VpcV2` does not create subnets automatically, users have full control over IP addresses allocation across subnets.


## Routing

`RouteTable` is a new construct that allows for route tables to be customized in a variety of ways. For instance, the following example shows how a custom route table can be created and appended to a subnet:

```ts

const myVpc = new VpcV2(this, 'Vpc');
const routeTable = new RouteTable(this, 'RouteTable', {
  vpc: myVpc,
});
const subnet = new SubnetV2(this, 'Subnet', {
  vpc: myVpc,
  routeTable,
  availabilityZone: 'eu-west-2a',
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
});
```

`Routes` can be created to link subnets to various different AWS services via gateways and endpoints. Each unique route target has its own dedicated construct that can be routed to a given subnet via the `Route` construct. An example using the `InternetGateway` construct can be seen below:

```ts
const stack = new Stack();
const myVpc = new VpcV2(this, 'Vpc');
const routeTable = new RouteTable(this, 'RouteTable', {
  vpc: myVpc,
});
const subnet = new SubnetV2(this, 'Subnet', {
  vpc: myVpc,
  availabilityZone: 'eu-west-2a',
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED });

const igw = new InternetGateway(this, 'IGW', {
  vpc: myVpc,
});
new Route(this, 'IgwRoute', {
  routeTable,
  destination: '0.0.0.0/0',
  target:  { gateway: igw },
});
```

Alternatively, `Routes` can also be created via method `addRoute` in the `RouteTable` class. An example using the `EgressOnlyInternetGateway` construct can be seen below:
Note: `EgressOnlyInternetGateway` can only be used to set up outbound IPv6 routing.

```ts

const stack = new Stack();
const myVpc = new VpcV2(this, 'Vpc',{
      primaryAddressBlock: IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [IpAddresses.amazonProvidedIpv6({
      cidrBlockName: 'AmazonProvided',
    })]
    });

const eigw = new EgressOnlyInternetGateway(this, 'EIGW', {
  vpc: myVpc,
});

const routeTable = new RouteTable(this, 'RouteTable', {
  vpc: myVpc,
});

routeTable.addRoute('EIGW', '::/0', { gateway: eigw });
```

Other route targets may require a deeper set of parameters to set up properly. For instance, the example below illustrates how to set up a `NatGateway`:

```ts

const myVpc = new VpcV2(this, 'Vpc');
const routeTable = new RouteTable(this, 'RouteTable', {
  vpc: myVpc,
});
const subnet = new SubnetV2(this, 'Subnet', {
  vpc: myVpc,
  availabilityZone: 'eu-west-2a',
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED });

const natgw = new NatGateway(this, 'NatGW', {
  subnet: subnet,
  vpc: myVpc,
  connectivityType: NatConnectivityType.PRIVATE,
  privateIpAddress: '10.0.0.42',
});
new Route(this, 'NatGwRoute', {
  routeTable,
  destination: '0.0.0.0/0',
  target: { gateway: natgw },
});
```

It is also possible to set up endpoints connecting other AWS services. For instance, the example below illustrates the linking of a Dynamo DB endpoint via the existing `ec2.GatewayVpcEndpoint` construct as a route target:

```ts

const stack = new Stack();
const myVpc = new VpcV2(this, 'Vpc');
const routeTable = new RouteTable(this, 'RouteTable', {
  vpc: myVpc,
});
const subnet = new SubnetV2(this, 'Subnet', {  
  vpc: myVpc,
  availabilityZone: 'eu-west-2a',
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  subnetType: SubnetType.PRIVATE });

const dynamoEndpoint = new ec2.GatewayVpcEndpoint(this, 'DynamoEndpoint', {
  service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
  vpc: myVpc,
  subnets: [subnet],
});
new Route(this, 'DynamoDBRoute', {
  routeTable,
  destination: '0.0.0.0/0',
  target: { endpoint: dynamoEndpoint },
});
```

## Adding Egress-Only Internet Gateway to VPC

An egress-only internet gateway is a horizontally scaled, redundant, and highly available VPC component that allows outbound communication over IPv6 from instances in your VPC to the internet, and prevents the internet from initiating an IPv6 connection with your instances.

For more information see [Enable outbound IPv6 traffic using an egress-only internet gateway](https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html).

VpcV2 supports adding an egress only internet gateway to VPC using the `addEgressOnlyInternetGateway` method.

By default, this method sets up a route to all outbound IPv6 address ranges, unless a specific destination is provided by the user. It can only be configured for IPv6-enabled VPCs.
The `Subnets` parameter accepts a `SubnetFilter`, which can be based on a `SubnetType` in VpcV2. A new route will be added to the route tables of all subnets that match this filter.

```ts

const stack = new Stack();
const myVpc = new VpcV2(this, 'Vpc',{
      primaryAddressBlock: IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [IpAddresses.amazonProvidedIpv6({
      cidrBlockName: 'AmazonProvided',
    })]
    });
const routeTable = new RouteTable(this, 'RouteTable', {
  vpc: myVpc,
});
const subnet = new SubnetV2(this, 'Subnet', {  
  vpc: myVpc,
  availabilityZone: 'eu-west-2a',
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  ipv6CidrBlock: new IpCidr('2001:db8:1::/64'),
  subnetType: SubnetType.PRIVATE });

myVpc.addEgressOnlyInternetGateway({
  subnets: [{subnetType: SubnetType.PRIVATE}],
  destination: '::/60',
})
```

## Adding NATGateway to the VPC

A NAT gateway is a Network Address Translation (NAT) service.You can use a NAT gateway so that instances in a private subnet can connect to services outside your VPC but external services cannot initiate a connection with those instances.

For more information, see [NAT gateway basics](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html).

When you create a NAT gateway, you specify one of the following connectivity types:

**Public – (Default)**: Instances in private subnets can connect to the internet through a public NAT gateway, but cannot receive unsolicited inbound connections from the internet

**Private**: Instances in private subnets can connect to other VPCs or your on-premises network through a private NAT gateway. 

To define the NAT gateway connectivity type as `ConnectivityType.Public`, you need to ensure that there is an IGW(Internet Gateway) attached to the subnet's VPC.
Since a NATGW is associated with a particular subnet, providing `subnet` field in the input props is mandatory.

Additionally, you can set up a route in any route table with the target set to the NAT Gateway. The function `addNatGateway` returns a `NATGateway` object that you can reference later.

The code example below provides the definition for adding a NAT gateway to your subnet:

```ts

const stack = new Stack();
const myVpc = new VpcV2(this, 'Vpc');
const routeTable = new RouteTable(this, 'RouteTable', {
  vpc: myVpc,
});
const subnet = new SubnetV2(this, 'Subnet', {  
  vpc: myVpc,
  availabilityZone: 'eu-west-2a',
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  subnetType: SubnetType.PUBLIC });

myVpc.addInternetGateway();
myVpc.addNatGateway({
  subnet: subnet,
  connectivityType: NatConnectivityType.PUBLIC,
});
```

## Enable VPNGateway for the VPC

A virtual private gateway is the endpoint on the VPC side of your VPN connection.

For more information, see [What is AWS Site-to-Site VPN?](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html).

VPN route propagation is a feature in Amazon Web Services (AWS) that automatically updates route tables in your Virtual Private Cloud (VPC) with routes learned from a VPN connection.

To enable VPN route propogation, use the `vpnRoutePropagation` property to specify the subnets as an input to the function. VPN route propagation will then be enabled for each subnet with the corresponding route table IDs.

Additionally, you can set up a route in any route table with the target set to the VPN Gateway. The function `enableVpnGatewayV2` returns a `VPNGatewayV2` object that you can reference later.

The code example below provides the definition for setting up a VPN gateway with `vpnRoutePropogation` enabled:

```ts

const stack = new Stack();
const myVpc = new VpcV2(this, 'Vpc');
const vpnGateway = myVpc.enableVpnGatewayV2({
  vpnRoutePropagation: [{ subnetType: SubnetType.PUBLIC }],
  type: VpnConnectionType.IPSEC_1,
});

const routeTable = new RouteTable(stack, 'routeTable', { 
  vpc: myVpc 
  } );

new Route(stack, 'route', {
  destination: '172.31.0.0/24',
  target: { gateway: vpnGateway },
  routeTable: routeTable,
});
```

## Adding InternetGateway to the VPC

An internet gateway is a horizontally scaled, redundant, and highly available VPC component that allows communication between your VPC and the internet. It supports both IPv4 and IPv6 traffic.

For more information, see [Enable VPC internet access using internet gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-igw-internet-access.html).

You can add an internet gateway to a VPC using `addInternetGateway` method. By default, this method creates a route in all Public Subnets with outbound destination set to `0.0.0.0` for IPv4 and `::0` for IPv6 enabled VPC. 
Instead of using the default settings, you can configure a custom destinatation range by providing an optional input `destination` to the method.

The code example below shows how to add an internet gateway with a custom outbound destination IP range:

```ts

const stack = new Stack();
const myVpc = new VpcV2(this, 'Vpc');

const subnet = new SubnetV2(this, 'Subnet', {  
  vpc: myVpc,
  availabilityZone: 'eu-west-2a',
  ipv4CidrBlock: new IpCidr('10.0.0.0/24'),
  subnetType: SubnetType.PUBLIC });

myVpc.addInternetGateway({
  ipv4Destination: '192.168.0.0/16',
});
```
