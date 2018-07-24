## AWS Route53 Constuct Library

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

new route53.TXTRecord(zone, 'TXTRecord', {
    recordName: '_foo',  // If the name ends with a ".", it will be used as-is;
                         // if it ends with a "." followed by the zone name, a trailing "." will be added automatically;
                         // otherwise, a ".", the zone name, and a trailing "." will be added automatically.
    recordValue: 'Bar!', // Will be quoted for you, and " will be escaped automatically.
    ttl: 90,             // Optional - default is 1800
});
```
