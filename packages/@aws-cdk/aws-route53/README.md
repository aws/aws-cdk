# Amazon Route53 Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

To add a public hosted zone:

```ts
new route53.PublicHostedZone(this, 'HostedZone', {
  zoneName: 'fully.qualified.domain.com',
});
```

To add a private hosted zone, use `PrivateHostedZone`. Note that
`enableDnsHostnames` and `enableDnsSupport` must have been enabled for the
VPC you're configuring for private hosted zones.

```ts
declare const vpc: ec2.Vpc;

const zone = new route53.PrivateHostedZone(this, 'HostedZone', {
  zoneName: 'fully.qualified.domain.com',
  vpc,    // At least one VPC has to be added to a Private Hosted Zone.
});
```

Additional VPCs can be added with `zone.addVpc()`.

## Adding Records

To add a TXT record to your zone:

```ts
declare const myZone: route53.HostedZone;

new route53.TxtRecord(this, 'TXTRecord', {
  zone: myZone,
  recordName: '_foo',  // If the name ends with a ".", it will be used as-is;
                       // if it ends with a "." followed by the zone name, a trailing "." will be added automatically;
                       // otherwise, a ".", the zone name, and a trailing "." will be added automatically.
                       // Defaults to zone root if not specified.
  values: [            // Will be quoted for you, and " will be escaped automatically.
    'Bar!',
    'Baz?',
  ],
  ttl: Duration.minutes(90),       // Optional - default is 30 minutes
});
```

To add a NS record to your zone:

```ts
declare const myZone: route53.HostedZone;

new route53.NsRecord(this, 'NSRecord', {
  zone: myZone,
  recordName: 'foo',  
  values: [            
    'ns-1.awsdns.co.uk.',
    'ns-2.awsdns.com.',
  ],
  ttl: Duration.minutes(90),       // Optional - default is 30 minutes
});
```

To add a DS record to your zone:

```ts
declare const myZone: route53.HostedZone;

new route53.DsRecord(this, 'DSRecord', {
  zone: myZone,
  recordName: 'foo',
  values: [
    '12345 3 1 123456789abcdef67890123456789abcdef67890',
  ],
  ttl: Duration.minutes(90),       // Optional - default is 30 minutes
});
```

To add an A record to your zone:

```ts
declare const myZone: route53.HostedZone;

new route53.ARecord(this, 'ARecord', {
  zone: myZone,
  target: route53.RecordTarget.fromIpAddresses('1.2.3.4', '5.6.7.8'),
});
```

To add an A record for an EC2 instance with an Elastic IP (EIP) to your zone:

```ts
declare const instance: ec2.Instance;

const elasticIp = new ec2.CfnEIP(this, 'EIP', {
  domain: 'vpc',
  instanceId: instance.instanceId,
});

declare const myZone: route53.HostedZone;
new route53.ARecord(this, 'ARecord', {
  zone: myZone,
  target: route53.RecordTarget.fromIpAddresses(elasticIp.ref),
});
```

To add an AAAA record pointing to a CloudFront distribution:

```ts
import * as cloudfront from '@aws-cdk/aws-cloudfront';

declare const myZone: route53.HostedZone;
declare const distribution: cloudfront.CloudFrontWebDistribution;
new route53.AaaaRecord(this, 'Alias', {
  zone: myZone,
  target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
});
```

Constructs are available for A, AAAA, CAA, CNAME, MX, NS, SRV and TXT records.

Use the `CaaAmazonRecord` construct to easily restrict certificate authorities
allowed to issue certificates for a domain to Amazon only.

To add a NS record to a HostedZone in different account you can do the following:

In the account containing the parent hosted zone:

```ts
const parentZone = new route53.PublicHostedZone(this, 'HostedZone', {
  zoneName: 'someexample.com',
  crossAccountZoneDelegationPrincipal: new iam.AccountPrincipal('12345678901'),
  crossAccountZoneDelegationRoleName: 'MyDelegationRole',
});
```

In the account containing the child zone to be delegated:

```ts
const subZone = new route53.PublicHostedZone(this, 'SubZone', {
  zoneName: 'sub.someexample.com',
});

// import the delegation role by constructing the roleArn
const delegationRoleArn = Stack.of(this).formatArn({
  region: '', // IAM is global in each partition
  service: 'iam',
  account: 'parent-account-id',
  resource: 'role',
  resourceName: 'MyDelegationRole',
});
const delegationRole = iam.Role.fromRoleArn(this, 'DelegationRole', delegationRoleArn);

// create the record
new route53.CrossAccountZoneDelegationRecord(this, 'delegate', {
  delegatedZone: subZone,
  parentHostedZoneName: 'someexample.com', // or you can use parentHostedZoneId
  delegationRole,
});
```

## Imports

If you don't know the ID of the Hosted Zone to import, you can use the 
`HostedZone.fromLookup`:

```ts
route53.HostedZone.fromLookup(this, 'MyZone', {
  domainName: 'example.com',
});
```

`HostedZone.fromLookup` requires an environment to be configured. Check
out the [documentation](https://docs.aws.amazon.com/cdk/latest/guide/environments.html) for more documentation and examples. CDK 
automatically looks into your `~/.aws/config` file for the `[default]` profile.
If you want to specify a different account run `cdk deploy --profile [profile]`.

```text
new MyDevStack(app, 'dev', { 
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION,
  },
});
```

If you know the ID and Name of a Hosted Zone, you can import it directly:

```ts
const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'MyZone', {
  zoneName: 'example.com',
  hostedZoneId: 'ZOJJZC49E0EPZ',
});
```

Alternatively, use the `HostedZone.fromHostedZoneId` to import hosted zones if
you know the ID and the retrieval for the `zoneName` is undesirable.

```ts
const zone = route53.HostedZone.fromHostedZoneId(this, 'MyZone', 'ZOJJZC49E0EPZ');
```

You can import a Public Hosted Zone as well with the similar `PubicHostedZone.fromPublicHostedZoneId` and `PubicHostedZone.fromPublicHostedZoneAttributes` methods:

```ts
const zoneFromAttributes = route53.PublicHostedZone.fromPublicHostedZoneAttributes(this, 'MyZone', {
  zoneName: 'example.com',
  hostedZoneId: 'ZOJJZC49E0EPZ',
});

// Does not know zoneName
const zoneFromId = route53.PublicHostedZone.fromPublicHostedZoneId(this, 'MyZone', 'ZOJJZC49E0EPZ');
```

## VPC Endpoint Service Private DNS

When you create a VPC endpoint service, AWS generates endpoint-specific DNS hostnames that consumers use to communicate with the service.
For example, vpce-1234-abcdev-us-east-1.vpce-svc-123345.us-east-1.vpce.amazonaws.com.
By default, your consumers access the service with that DNS name.
This can cause problems with HTTPS traffic because the DNS will not match the backend certificate:

```console
curl: (60) SSL: no alternative certificate subject name matches target host name 'vpce-abcdefghijklmnopq-rstuvwx.vpce-svc-abcdefghijklmnopq.us-east-1.vpce.amazonaws.com'
```

Effectively, the endpoint appears untrustworthy. To mitigate this, clients have to create an alias for this DNS name in Route53.

Private DNS for an endpoint service lets you configure a private DNS name so consumers can
access the service using an existing DNS name without creating this Route53 DNS alias
This DNS name can also be guaranteed to match up with the backend certificate.

Before consumers can use the private DNS name, you must verify that you have control of the domain/subdomain.

Assuming your account has ownership of the particular domain/subdomain,
this construct sets up the private DNS configuration on the endpoint service,
creates all the necessary Route53 entries, and verifies domain ownership.

```ts nofixture
import { Stack } from '@aws-cdk/core';
import { Vpc, VpcEndpointService } from '@aws-cdk/aws-ec2';
import { NetworkLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';
import { PublicHostedZone, VpcEndpointServiceDomainName } from '@aws-cdk/aws-route53';

const stack = new Stack();
const vpc = new Vpc(stack, 'VPC');
const nlb = new NetworkLoadBalancer(stack, 'NLB', {
  vpc,
});
const vpces = new VpcEndpointService(stack, 'VPCES', {
  vpcEndpointServiceLoadBalancers: [nlb],
});
// You must use a public hosted zone so domain ownership can be verified
const zone = new PublicHostedZone(stack, 'PHZ', {
  zoneName: 'aws-cdk.dev',
});
new VpcEndpointServiceDomainName(stack, 'EndpointDomain', {
  endpointService: vpces,
  domainName: 'my-stuff.aws-cdk.dev',
  publicHostedZone: zone,
});
```
