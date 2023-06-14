# Route53 Alias Record Targets for the CDK Route53 Library
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

---

<!--END STABILITY BANNER-->

This library contains Route53 Alias Record targets for:

* API Gateway custom domains

  ```ts
  import * as apigw from '@aws-cdk/aws-apigateway';

  declare const zone: route53.HostedZone;
  declare const restApi: apigw.LambdaRestApi;

  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new targets.ApiGateway(restApi)),
    // or - route53.RecordTarget.fromAlias(new alias.ApiGatewayDomain(domainName)),
  });
  ```

* API Gateway V2 custom domains

  ```ts
  import * as apigwv2 from '@aws-cdk/aws-apigatewayv2';

  declare const zone: route53.HostedZone;
  declare const domainName: apigwv2.DomainName;

  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new targets.ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId)),
  });
  ```

* CloudFront distributions

  ```ts
  import * as cloudfront from '@aws-cdk/aws-cloudfront';

  declare const zone: route53.HostedZone;
  declare const distribution: cloudfront.CloudFrontWebDistribution;

  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
  });
  ```

* ELBv2 load balancers

  ```ts
  import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

  declare const zone: route53.HostedZone;
  declare const lb: elbv2.ApplicationLoadBalancer;

  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(lb)),
    // or - route53.RecordTarget.fromAlias(new targets.ApiGatewayDomain(domainName)),
  });
  ```

* Classic load balancers

  ```ts
  import * as elb from '@aws-cdk/aws-elasticloadbalancing';

  declare const zone: route53.HostedZone;
  declare const lb: elb.LoadBalancer;

  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new targets.ClassicLoadBalancerTarget(lb)),
    // or - route53.RecordTarget.fromAlias(new alias.ApiGatewayDomain(domainName)),
  });
  ```

**Important:** Based on [AWS documentation](https://aws.amazon.com/de/premiumsupport/knowledge-center/alias-resource-record-set-route53-cli/), all alias record in Route 53 that points to a Elastic Load Balancer will always include *dualstack* for the DNSName to resolve IPv4/IPv6 addresses (without *dualstack* IPv6 will not resolve).

For example, if the Amazon-provided DNS for the load balancer is `ALB-xxxxxxx.us-west-2.elb.amazonaws.com`, CDK will create alias target in Route 53 will be `dualstack.ALB-xxxxxxx.us-west-2.elb.amazonaws.com`.

* GlobalAccelerator

  ```ts
  import * as globalaccelerator from '@aws-cdk/aws-globalaccelerator';

  declare const zone: route53.HostedZone;
  declare const accelerator: globalaccelerator.Accelerator;

  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new targets.GlobalAcceleratorTarget(accelerator)),
    // or - route53.RecordTarget.fromAlias(new targets.GlobalAcceleratorDomainTarget('xyz.awsglobalaccelerator.com')),
  });
  ```

**Important:** If you use GlobalAcceleratorDomainTarget, passing a string rather than an instance of IAccelerator, ensure that the string is a valid domain name of an existing Global Accelerator instance.
See [the documentation on DNS addressing](https://docs.aws.amazon.com/global-accelerator/latest/dg/dns-addressing-custom-domains.dns-addressing.html) with Global Accelerator for more info.

* InterfaceVpcEndpoints

**Important:** Based on the CFN docs for VPCEndpoints - [see here](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpcendpoint.html#aws-resource-ec2-vpcendpoint-return-values) - the attributes returned for DnsEntries in CloudFormation is a combination of the hosted zone ID and the DNS name. The entries are ordered as follows: regional public DNS, zonal public DNS, private DNS, and wildcard DNS. This order is not enforced for AWS Marketplace services, and therefore this CDK construct is ONLY guaranteed to work with non-marketplace services.

  ```ts
  import * as ec2 from '@aws-cdk/aws-ec2';

  declare const zone: route53.HostedZone;
  declare const interfaceVpcEndpoint: ec2.InterfaceVpcEndpoint;

  new route53.ARecord(this, "AliasRecord", {
    zone,
    target: route53.RecordTarget.fromAlias(new targets.InterfaceVpcEndpointTarget(interfaceVpcEndpoint)),
  });
  ```

* S3 Bucket Website:

**Important:** The Bucket name must strictly match the full DNS name.
See [the Developer Guide](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/getting-started.html) for more info.

  ```ts
  import * as s3 from '@aws-cdk/aws-s3';

  const recordName = 'www';
  const domainName = 'example.com';

  const bucketWebsite = new s3.Bucket(this, 'BucketWebsite', {
    bucketName: [recordName, domainName].join('.'), // www.example.com
    publicReadAccess: true,
    websiteIndexDocument: 'index.html',
  });

  const zone = route53.HostedZone.fromLookup(this, 'Zone', {domainName}); // example.com

  new route53.ARecord(this, 'AliasRecord', {
    zone,
    recordName, // www
    target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(bucketWebsite)),
  });
  ```

* User pool domain

  ```ts
  import * as cognito from '@aws-cdk/aws-cognito';

  declare const zone: route53.HostedZone;
  declare const domain: cognito.UserPoolDomain;
  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new targets.UserPoolDomainTarget(domain)),
  });
  ```

* Route 53 record

  ```ts
  declare const zone: route53.HostedZone;
  declare const record: route53.ARecord;
  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new targets.Route53RecordTarget(record)),
  });
  ```

* Elastic Beanstalk environment:

**Important:** Only supports Elastic Beanstalk environments created after 2016 that have a regional endpoint.

```ts
declare const zone: route53.HostedZone;
declare const ebsEnvironmentUrl: string;

new route53.ARecord(this, 'AliasRecord', {
  zone,
  target: route53.RecordTarget.fromAlias(new targets.ElasticBeanstalkEnvironmentEndpointTarget(ebsEnvironmentUrl)),
});
```

See the documentation of `@aws-cdk/aws-route53` for more information.
