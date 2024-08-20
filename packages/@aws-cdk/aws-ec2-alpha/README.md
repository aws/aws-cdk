# Amazon VpcV2 Construct Library

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

## VpcV2

`VpcV2` is a re-write of the [`ec2.Vpc`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.Vpc.html) construct. This new construct enables higher level of customization
on the VPC being created. `VpcV2` implements the existing [`IVpc`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.IVpc.html), therefore,
`VpcV2` is compatible with other constructs that accepts `IVpc` (e.g. [`ApplicationLoadBalancer`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_elasticloadbalancingv2.ApplicationLoadBalancer.html#construct-props)).

To create a VPC with both IPv4 and IPv6 support:

```ts
import * as vpc_v2 from '@aws-cdk/aws-ec2-alpha';

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2');
new vpc_v2.VpcV2(stack, 'Vpc', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/24'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.amazonProvidedIpv6({cidrBlockName: 'AmazonProvidedIpv6'}),
  ],
});
```

`VpcV2` does not automatically create subnets or allocate IP addresses, which is different from the `Vpc` construct.

Importing existing VPC in an account into CDK as a `VpcV2` is not yet supported.

## SubnetV2

`SubnetV2` is a re-write of the [`ec2.Subnet`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.Subnet.html) construct.
This new construct can be used to add subnets to a `VpcV2` instance:

```ts
import * as vpc_v2 from '@aws-cdk/aws-ec2-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2');
const vpc = new vpc_v2.VpcV2(stack, 'Vpc', {
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.amazonProvidedIpv6({ cidrBlockName: 'AmazonProvidedIp'}),
  ],
});
const vpcFirstIpV6Cidr = Fn.select(0, vpc.ipv6CidrBlocks);
const subCidrs = Fn.cidr(vpcFirstIpV6Cidr, 3, 32);
new vpc_v2.SubnetV2(stack, 'subnetA', {
  vpc,
  availabilityZone: 'us-east-1a',
  cidrBlock: new vpc_v2.IpCidr('10.0.0.0/24'),
  ipv6CidrBlock: new vpc_v2.IpCidr(Fn.select(0, subCidrs)),
  subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
})
```

Same as `VpcV2`, importing existing subnets is not yet supported.

## IP Addresses Management

By default `VpcV2` uses `10.0.0.0/16` as the primary CIDR if none is defined. 
Additional CIDRs can be adding to the VPC via the `secondaryAddressBlocks` prop.
The following example illustrates the different options of defining the address blocks:

```ts
import * as vpc_v2 from '@aws-cdk/aws-ec2-alpha';

const stack = new cdk.Stack(app, 'aws-cdk-vpcv2');
const ipam = new Ipam(stack, 'Ipam', {
  operatingRegion: ['us-west-1']
});
const ipamPublicPool = ipam.publicScope.addPool('PublicPoolA', {
  addressFamily: vpc_v2.AddressFamily.IP_V6,
  awsService: 'ec2',
  locale: 'us-west-1',
  publicIpSource: vpc_v2.IpamPoolPublicIpSource.AMAZON,
});
ipamPublicPool.provisionCidr('PublicPoolACidrA', { netmaskLength: 52 } );

const ipamPrivatePool = ipam.privateScope.addPool('PrivatePoolA', {
  addressFamily: vpc_v2.AddressFamily.IP_V4,
});
ipamPrivatePool.provisionCidr('PrivatePoolACidrA', { netmaskLength: 8 } );

new vpc_v2.VpcV2(stack, 'Vpc', {
  primaryAddressBlock: vpc_v2.IpAddresses.ipv4('10.0.0.0/24'),
  secondaryAddressBlocks: [
    vpc_v2.IpAddresses.amazonProvidedIpv6({ cidrBlockName: 'AmazonIpv6' }),
    vpc_v2.IpAddresses.ipv6Ipam({
      ipv6IpamPool: ipamPublicPool,
      ipv6NetmaskLength: 52,
      cidrBlockName: 'ipv6Ipam',
    }),
    vpc_v2.IpAddresses.ipv4Ipam({
      ipv6IpamPool: ipamPrivatePool,
      ipv6NetmaskLength: 8,
      cidrBlockName: 'ipv4Ipam',
    }),
  ],
});
```

Since `VpcV2` does not create subnets automatically, users have full control over IP addresses allocation across subnets.


## Routing

`RouteTable` is a new construct that allows for route tables to be customized in a variety of ways. For instance, the following example shows how a custom route table can be created and appended to a subnet:

```ts
import * as vpc_v2 from '@aws-cdk/aws-ec2-alpha';

const myVpc = new vpc_v2.VpcV2(stack, 'Vpc', {...});
const routeTable = new vpc_v2.RouteTable(stack, 'RouteTable', {
  vpc: myVpc,
});
const subnet = new vpc_v2.SubnetV2(stack, 'Subnet', {
  vpc,
  routeTable,
  ...,
});
```

`Route`s can be created to link subnets to various different AWS services via gateways and endpoints. Each unique route target has its own dedicated construct that can be routed to a given subnet via the `Route` construct. An example using the `InternetGateway` construct can be seen below:

```ts
import * as vpc_v2 from '@aws-cdk/aws-ec2-alpha';

const myVpc = new vpc_v2.VpcV2(stack, 'Vpc', {...});
const routeTable = new vpc_v2.RouteTable(stack, 'RouteTable', {
  vpc: vpc.myVpc,
});
const subnet = new vpc_v2.SubnetV2(stack, 'Subnet', {...});

const igw = new vpc_v2.InternetGateway(stack, 'IGW', {
  vpcId: vpc.myVpc,
});
new vpc_v2.Route(stack, 'IgwRoute', {
  routeTable,
  destination: vpc_v2.IpAddresses.ipv4('0.0.0.0/0'),
  target: igw,
});
```

Other route targets may require a deeper set of parameters to set up properly. For instance, the example below illustrates how to set up a `NatGateway`:

```ts
import * as vpc_v2 from '@aws-cdk/aws-ec2-alpha';

const myVpc = new vpc_v2.VpcV2(stack, 'Vpc', {...});
const routeTable = new vpc_v2.RouteTable(stack, 'RouteTable', {
  vpcId: vpc.myVpc,
});
const subnet = new vpc_v2.SubnetV2(stack, 'Subnet', {...});

const natgw = new vpc_v2.NatGateway(stack, 'NatGW', {
  subnet: subnet,
  vpcId: vpc.myVpc,
  connectivityType: 'private',
  privateIpAddress: '10.0.0.42',
});
new vpc_v2.Route(stack, 'NatGwRoute', {
  routeTable,
  destination: vpc_v2.IpAddresses.ipv4('0.0.0.0/0'),
  target: natgw,
});
```

It is also possible to set up endpoints connecting other AWS services. For instance, the example below illustrates the linking of a Dynamo DB endpoint via the existing `ec2.GatewayVpcEndpoint` construct as a route target:

```ts
import * as vpc_v2 from '@aws-cdk/aws-ec2-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const myVpc = new vpc_v2.VpcV2(stack, 'Vpc', {...});
const routeTable = new vpc_v2.RouteTable(stack, 'RouteTable', {
  vpcId: vpc.myVpc,
});
const subnet = new vpc_v2.SubnetV2(stack, 'Subnet', {...});

const dynamoEndpoint = new GatewayVpcEndpoint(stack, 'DynamoEndpoint', {
  service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
  vpc: vpc,
  subnets: [subnet],
});
new vpc_v2.Route(stack, 'DynamoDBRoute', {
  routeTable,
  destination: vpc_v2.IpAddresses.ipv4('0.0.0.0/0'),
  target: dynamoEndpoint,
});
```
