# Amazon Route53 Construct Library


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
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

declare const myZone: route53.HostedZone;
declare const distribution: cloudfront.CloudFrontWebDistribution;
new route53.AaaaRecord(this, 'Alias', {
  zone: myZone,
  target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
});
```

[Geolocation routing](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-geo.html) can be enabled for continent, country or subdivision:

```ts
declare const myZone: route53.HostedZone;

// continent
new route53.ARecord(this, 'ARecordGeoLocationContinent', {
  zone: myZone,
  target: route53.RecordTarget.fromIpAddresses('1.2.3.0', '5.6.7.0'),
  geoLocation: route53.GeoLocation.continent(route53.Continent.EUROPE),
});

// country
new route53.ARecord(this, 'ARecordGeoLocationCountry', {
  zone: myZone,
  target: route53.RecordTarget.fromIpAddresses('1.2.3.1', '5.6.7.1'),
  geoLocation: route53.GeoLocation.country('DE'), // Germany
});

// subdivision
new route53.ARecord(this, 'ARecordGeoLocationSubDividion', {
  zone: myZone,
  target: route53.RecordTarget.fromIpAddresses('1.2.3.2', '5.6.7.2'),
  geoLocation: route53.GeoLocation.subdivision('WA'), // Washington
});

// default (wildcard record if no specific record is found)
new route53.ARecord(this, 'ARecordGeoLocationDefault', {
  zone: myZone,
  target: route53.RecordTarget.fromIpAddresses('1.2.3.3', '5.6.7.3'),
  geoLocation: route53.GeoLocation.default(),
});
```

To enable [weighted routing](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-weighted.html), use the `weight` parameter:

```ts
declare const myZone: route53.HostedZone;

new route53.ARecord(this, 'ARecordWeighted1', {
  zone: myZone,
  target: route53.RecordTarget.fromIpAddresses('1.2.3.4'),
  weight: 10,
});
```

To enable [latency based routing](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-latency.html), use the `region` parameter:

```ts
declare const myZone: route53.HostedZone;

new route53.ARecord(this, 'ARecordLatency1', {
  zone: myZone,
  target: route53.RecordTarget.fromIpAddresses('1.2.3.4'),
  region: 'us-east-1',
});
```

To specify a unique identifier to differentiate among multiple resource record sets that have the same combination of name and type, use the `setIdentifier` parameter:

```ts
declare const myZone: route53.HostedZone;

new route53.ARecord(this, 'ARecordWeighted1', {
  zone: myZone,
  target: route53.RecordTarget.fromIpAddresses('1.2.3.4'),
  weight: 10,
  setIdentifier: 'weighted-record-id',
});
```
**Warning** It is not possible to specify `setIdentifier` for a simple routing policy.

Constructs are available for A, AAAA, CAA, CNAME, MX, NS, SRV and TXT records.

Use the `CaaAmazonRecord` construct to easily restrict certificate authorities
allowed to issue certificates for a domain to Amazon only.

### Replacing existing record sets (dangerous!)

Use the `deleteExisting` prop to delete an existing record set before deploying the new one.
This is useful if you want to minimize downtime and avoid "manual" actions while deploying a
stack with a record set that already exists. This is typically the case for record sets that
are not already "owned" by CloudFormation or "owned" by another stack or construct that is
going to be deleted (migration).

> **N.B.:** this feature is dangerous, use with caution! It can only be used safely when
> `deleteExisting` is set to `true` as soon as the resource is added to the stack. Changing
> an existing Record Set's `deleteExisting` property from `false -> true` after deployment
> will delete the record!

```ts
declare const myZone: route53.HostedZone;

new route53.ARecord(this, 'ARecord', {
  zone: myZone,
  target: route53.RecordTarget.fromIpAddresses('1.2.3.4', '5.6.7.8'),
  deleteExisting: true,
});
```

### Cross Account Zone Delegation

If you want to have your root domain hosted zone in one account and your subdomain hosted
zone in a different one, you can use `CrossAccountZoneDelegationRecord` to set up delegation
between them.

In the account containing the parent hosted zone:

```ts
const parentZone = new route53.PublicHostedZone(this, 'HostedZone', {
  zoneName: 'someexample.com',
});
const crossAccountRole = new iam.Role(this, 'CrossAccountRole', {
  // The role name must be predictable
  roleName: 'MyDelegationRole',
  // The other account
  assumedBy: new iam.AccountPrincipal('12345678901'),
  // You can scope down this role policy to be least privileged.
  // If you want the other account to be able to manage specific records,
  // you can scope down by resource and/or normalized record names
  inlinePolicies: {
    crossAccountPolicy: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          sid: 'ListHostedZonesByName',
          effect: iam.Effect.ALLOW,
          actions: ['route53:ListHostedZonesByName'],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          sid: 'GetHostedZoneAndChangeResourceRecordSet',
          effect: iam.Effect.ALLOW,
          actions: ['route53:GetHostedZone', 'route53:ChangeResourceRecordSet'],
          // This example assumes the RecordSet subdomain.somexample.com
          // is contained in the HostedZone
          resources: ['arn:aws:route53:::hostedzone/HZID00000000000000000'],
          conditions: {
            'ForAllValues:StringLike': {
              'route53:ChangeResourceRecordSetsNormalizedRecordNames': [
                'subdomain.someexample.com',
              ],
            },
          },
        }),
      ],
    }),
  },
});
parentZone.grantDelegation(crossAccountRole);
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

### Add Trailing Dot to Domain Names

In order to continue managing existing domain names with trailing dots using CDK, you can set `addTrailingDot: false` to prevent the Construct from adding a dot at the end of the domain name.

```ts
new route53.PublicHostedZone(this, 'HostedZone', {
  zoneName: 'fully.qualified.domain.com.',
  addTrailingDot: false,
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

You can import a Public Hosted Zone as well with the similar `PublicHostedZone.fromPublicHostedZoneId` and `PublicHostedZone.fromPublicHostedZoneAttributes` methods:

```ts
const zoneFromAttributes = route53.PublicHostedZone.fromPublicHostedZoneAttributes(this, 'MyZone', {
  zoneName: 'example.com',
  hostedZoneId: 'ZOJJZC49E0EPZ',
});

// Does not know zoneName
const zoneFromId = route53.PublicHostedZone.fromPublicHostedZoneId(this, 'MyZone', 'ZOJJZC49E0EPZ');
```

You can use `CrossAccountZoneDelegationRecord` on imported Hosted Zones with the `grantDelegation` method:

```ts
const crossAccountRole = new iam.Role(this, 'CrossAccountRole', {
  // The role name must be predictable
  roleName: 'MyDelegationRole',
  // The other account
  assumedBy: new iam.AccountPrincipal('12345678901'),
});

const zoneFromId = route53.HostedZone.fromHostedZoneId(this, 'MyZone', 'zone-id');
zoneFromId.grantDelegation(crossAccountRole);

const publicZoneFromId = route53.PublicHostedZone.fromPublicHostedZoneId(this, 'MyPublicZone', 'public-zone-id');
publicZoneFromId.grantDelegation(crossAccountRole);

const privateZoneFromId = route53.PrivateHostedZone.fromPrivateHostedZoneId(this, 'MyPrivateZone', 'private-zone-id');
privateZoneFromId.grantDelegation(crossAccountRole);
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

```ts
import { NetworkLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const vpc = new ec2.Vpc(this, 'VPC');
const nlb = new NetworkLoadBalancer(this, 'NLB', {
  vpc,
});
const vpces = new ec2.VpcEndpointService(this, 'VPCES', {
  vpcEndpointServiceLoadBalancers: [nlb],
});
// You must use a public hosted zone so domain ownership can be verified
const zone = new route53.PublicHostedZone(this, 'PHZ', {
  zoneName: 'aws-cdk.dev',
});
new route53.VpcEndpointServiceDomainName(this, 'EndpointDomain', {
  endpointService: vpces,
  domainName: 'my-stuff.aws-cdk.dev',
  publicHostedZone: zone,
});
```
