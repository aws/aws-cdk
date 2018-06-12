## AWS Route53 Constuct Library

To add a public hosted zone:

```ts
import { PublicHostedZone } from '@aws-cdk/route53';

new PublicHostedZone(this, 'HostedZone', {
    zoneName: 'fully.qualified.domain.com'
});
```

To add a private hosted zone, use `PrivateHostedZone`. Note that
`enableDnsHostnames` and `enableDnsSupport` must have been enabled for the
VPC you're configuring for private hosted zones.

```ts
import { PrivateHostedZone } from '@aws-cdk/route53';

const vpc = new VpcNetwork(this, 'VPC');

const zone = new PrivateHostedZone(this, 'HostedZone', {
    zoneName: 'fully.qualified.domain.com',
    vpc    // At least one VPC has to be added to a Private Hosted Zone.
});
```

Additional VPCs can be added with `zone.addVPC()`.

### Adding Records

To add a TXT record to your zone:
```ts
import { TXTRecord } from '@aws-cdk/route53';

new TXTRecord(zone, 'TXTRecord', {
    recordName: '_foo',  // If the name ends with a ".", it will be used as-is;
                         // if it ends with a "." followed by the zone name, a trailing "." will be added automatically;
                         // otherwise, a ".", the zone name, and a trailing "." will be added automatically.
    recordValue: 'Bar!', // Will be quoted for you, and " will be escaped automatically.
    ttl: 90,             // Optional - default is 1800
});
```
