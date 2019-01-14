## AWS Route53 Construct Library

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

### Adding Alias

To add an alias to your zone:
```ts
import route53 = require('@aws-cdk/aws-route53');

// For the example, using existing hosted zone
const _baz = route53.HostedZone.import(this, 'baz', {
    zoneName: 'example.com',
    hosstedZoneId: 'baz',
});

new route53.Alias(this, 'Alias', {
    recordName: 'foo.example.com', 
    target: 'bar.example.com', 
    zone: _baz,
    type: 'AAAA' // Optional - the record time defaults to 'A'
});
```
### Adding Records

To add a TXT record to your zone:
```ts
import route53 = require('@aws-cdk/aws-route53');

new route53.TxtRecord(zone, 'TXTRecord', {
    recordName: '_foo',  // If the name ends with a ".", it will be used as-is;
                         // if it ends with a "." followed by the zone name, a trailing "." will be added automatically;
                         // otherwise, a ".", the zone name, and a trailing "." will be added automatically.
    recordValue: 'Bar!', // Will be quoted for you, and " will be escaped automatically.
    ttl: 90,             // Optional - default is 1800
});
```


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
