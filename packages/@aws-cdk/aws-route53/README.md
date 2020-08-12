## Amazon Route53 Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

To add a public hosted zone:

```ts
import * as route53 from '@aws-cdk/aws-route53';

new route53.PublicHostedZone(this, 'HostedZone', {
  zoneName: 'fully.qualified.domain.com'
});
```

To add a private hosted zone, use `PrivateHostedZone`. Note that
`enableDnsHostnames` and `enableDnsSupport` must have been enabled for the
VPC you're configuring for private hosted zones.

```ts
import * as ec2 from '@aws-cdk/aws-ec2';
import * as route53 from '@aws-cdk/aws-route53';

const vpc = new ec2.Vpc(this, 'VPC');

const zone = new route53.PrivateHostedZone(this, 'HostedZone', {
  zoneName: 'fully.qualified.domain.com',
  vpc    // At least one VPC has to be added to a Private Hosted Zone.
});
```

Additional VPCs can be added with `zone.addVpc()`.

### Adding Records

To add a TXT record to your zone:
```ts
import * as route53 from '@aws-cdk/aws-route53';

new route53.TxtRecord(this, 'TXTRecord', {
  zone: myZone,
  recordName: '_foo',  // If the name ends with a ".", it will be used as-is;
                       // if it ends with a "." followed by the zone name, a trailing "." will be added automatically;
                       // otherwise, a ".", the zone name, and a trailing "." will be added automatically.
                       // Defaults to zone root if not specified.
  values: [            // Will be quoted for you, and " will be escaped automatically.
    'Bar!',
    'Baz?'
  ],
  ttl: Duration.minutes(90),       // Optional - default is 30 minutes
});
```

To add a A record to your zone:
```ts
import * as route53 from '@aws-cdk/aws-route53';

new route53.ARecord(this, 'ARecord', {
  zone: myZone,
  target: route53.RecordTarget.fromIpAddresses('1.2.3.4', '5.6.7.8')
});
```

To add a AAAA record pointing to a CloudFront distribution:
```ts
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';

new route53.AaaaRecord(this, 'Alias', {
  zone: myZone,
  target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
});
```

Constructs are available for A, AAAA, CAA, CNAME, MX, NS, SRV and TXT records.

Use the `CaaAmazonRecord` construct to easily restrict certificate authorities
allowed to issue certificates for a domain to Amazon only.

### Imports

If you don't know the ID of the Hosted Zone to import, you can use the 
`HostedZone.fromLookup`:

```ts
HostedZone.fromLookup(this, 'MyZone', {
  domainName: 'example.com'
});
```

`HostedZone.fromLookup` requires an environment to be configured. Check
out the [documentation](https://docs.aws.amazon.com/cdk/latest/guide/environments.html) for more documentation and examples. CDK 
automatically looks into your `~/.aws/config` file for the `[default]` profile.
If you want to specify a different account run `cdk deploy --profile [profile]`.

```ts
new MyDevStack(app, 'dev', { 
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
}});
```

If you know the ID and Name of a Hosted Zone, you can import it directly:

```ts
const zone = HostedZone.fromHostedZoneAttributes(this, 'MyZone', {
  zoneName: 'example.com',
  hostedZoneId: 'ZOJJZC49E0EPZ',
});
```

Alternatively, use the `HostedZone.fromHostedZoneId` to import hosted zones if
you know the ID and the retrieval for the `zoneName` is undesirable.

```ts
const zone = HostedZone.fromHostedZoneId(this, 'MyZone', {
  hostedZoneId: 'ZOJJZC49E0EPZ',
});
```