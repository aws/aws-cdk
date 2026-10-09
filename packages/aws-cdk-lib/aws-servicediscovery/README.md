# Amazon ECS Service Discovery Construct Library


This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

This package contains constructs for working with **AWS Cloud Map**

AWS Cloud Map is a fully managed service that you can use to create and
maintain a map of the backend services and resources that your applications
depend on.

For further information on AWS Cloud Map,
see the [AWS Cloud Map documentation](https://docs.aws.amazon.com/cloud-map)

## DNS Record Types

For DNS namespaces, `dnsRecordType` controls which DNS records AWS Cloud Map creates for a
service. Besides the single record types `A`, `AAAA`, `SRV` and `CNAME`, a service can
create several records at once through the combination types `A_AAAA`, `A_SRV`,
`AAAA_SRV` and `A_AAAA_SRV`. Each constituent type becomes its own DNS record:

```ts nofixture
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as servicediscovery from 'aws-cdk-lib/aws-servicediscovery';
import { Duration, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

class MyStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });

    const namespace = new servicediscovery.PrivateDnsNamespace(this, 'Namespace', {
      name: 'example.com',
      vpc,
    });

    // Creates one A record and one SRV record, both with a TTL of 30 seconds
    const service = namespace.createService('Service', {
      dnsRecordType: servicediscovery.DnsRecordType.A_SRV,
      dnsTtl: Duration.seconds(30),
    });

    // A record type that includes SRV needs a port
    service.registerIpInstance('IpInstance', {
      ipv4: '10.0.0.10',
      port: 443,
    });
  }
}
```

A record type that includes `SRV` requires a `port` when registering an IP instance, and a
record type that includes `A` or `AAAA` requires the matching `ipv4` or `ipv6` address.
Record types that include `SRV` cannot be used with `loadBalancer: true`, because alias
records are only created for `A` and `AAAA` records.

## HTTP Namespace Example

The following example creates an AWS Cloud Map namespace that
supports API calls, creates a service in that namespace, and
registers an instance to it:

[Creating a Cloud Map service within an HTTP namespace](test/integ.service-with-http-namespace.lit.ts)

## Private DNS Namespace Example

The following example creates an AWS Cloud Map namespace that
supports both API calls and DNS queries within a vpc, creates a
service in that namespace, and registers a loadbalancer as an
instance.

A secondary service is also configured which only supports API based discovery, a
non ip based resource is registered to this service:

[Creating a Cloud Map service within a Private DNS namespace](test/integ.service-with-private-dns-namespace.lit.ts)

## Public DNS Namespace Example

The following example creates an AWS Cloud Map namespace that
supports both API calls and public DNS queries, creates a service in
that namespace, and registers an IP instance:

[Creating a Cloud Map service within a Public namespace](test/integ.service-with-public-dns-namespace.lit.ts)

For DNS namespaces, you can also register instances to services with CNAME records:

[Creating a Cloud Map service within a Public namespace](test/integ.service-with-cname-record.lit.ts)
