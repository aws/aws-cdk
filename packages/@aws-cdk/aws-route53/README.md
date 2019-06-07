## Amazon Route53 Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

To add a public hosted zone:

```ts
import route53 = require('@aws-cdk/aws-route53');

new route53.PublicHostedZone(this, 'HostedZone', {
  zoneName: 'fully.qualified.domain.com'
});
```

To add a private hosted zone, use `PrivateHostedZone`. Note that
`enableDnsHostnames` and `enableDnsSupport` must have been enabled for the
VPC you're configuring for private hosted zones.

```ts
import ec2 = require('@aws-cdk/aws-ec2');
import route53 = require('@aws-cdk/aws-route53');

const vpc = new ec2.VpcNetwork(this, 'VPC');

const zone = new route53.PrivateHostedZone(this, 'HostedZone', {
  zoneName: 'fully.qualified.domain.com',
  vpc    // At least one VPC has to be added to a Private Hosted Zone.
});
```

Additional VPCs can be added with `zone.addVPC()`.

### Adding Records

To add a TXT record to your zone:
```ts
import route53 = require('@aws-cdk/aws-route53');

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
  ttl: 90,             // Optional - default is 1800
});
```

To add a A record to your zone:
```ts
import route53 = require('@aws-cdk/aws-route53');

new route53.ARecord(this, 'ARecord', {
  zone: myZone,
  target: route53.AddressRecordTarget.fromIpAddresses('1.2.3.4', '5.6.7.8')
})
```

To add a AAAA record pointing to a CloudFront distribution:
```ts
import route53 = require('@aws-cdk/aws-route53');
import targets = require('@aws-cdk/aws-route53-targets');

new route53.AaaaRecord(this, 'Alias', {
  zone: myZone,
  target: route53.AddressRecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
})
```

Constructs are available for A, AAAA, CAA, CNAME, MX, NS, SRV and TXT records.

Use the `CaaAmazonRecord` construct to easily restrict certificate authorities
allowed to issue certificates for a domain to Amazon only.

### Adding records to existing hosted zones

If you know the ID and Name of a Hosted Zone, you can import it directly:

```ts
const zone = HostedZone.import(this, 'MyZone', {
  zoneName: 'example.com',
  hostedZoneId: 'ZOJJZC49E0EPZ',
});
```

If you don't know the ID of a Hosted Zone, you can use the `HostedZoneProvider`
to discover and import it:

```ts
const zone = new HostedZoneProvider(this, {
  domainName: 'example.com'
}).findAndImport(this, 'MyZone');
```
