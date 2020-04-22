# Route53 Alias Record Targets for the CDK Route53 Library
<!--BEGIN STABILITY BANNER-->
---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

This library contains Route53 Alias Record targets for:
* API Gateway custom domains
  ```ts
  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new alias.ApiGateway(restApi)),
    // or - route53.RecordTarget.fromAlias(new alias.ApiGatewayDomainName(domainName)),
  });
  ```
* CloudFront distributions
  ```ts
  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new alias.CloudFrontTarget(distribution)),
  });
  ```
* ELBv2 load balancers
  ```ts
  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new alias.LoadBalancerTarget(elbv2)),
    // or - route53.RecordTarget.fromAlias(new alias.ApiGatewayDomainName(domainName)),
  });
  ```
* Classic load balancers
  ```ts
  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new alias.ClassicLoadBalancerTarget(elb)),
    // or - route53.RecordTarget.fromAlias(new alias.ApiGatewayDomainName(domainName)),
  });
  ```
* InterfaceVpcEndpoints

**Important:** Based on the CFN docs for VPCEndpoints - [see here](attrDnsEntries) - the attributes returned for DnsEntries in CloudFormation is a combination of the hosted zone ID and the DNS name. The entries are ordered as follows: regional public DNS, zonal public DNS, private DNS, and wildcard DNS. This order is not enforced for AWS Marketplace services, and therefore this CDK construct is ONLY guaranteed to work with non-marketplace services.
  ```ts
  new route53.ARecord(stack, "AliasRecord", {
    zone,
    target: route53.RecordTarget.fromAlias(new alias.InterfaceVpcEndpointTarget(interfaceVpcEndpoint))
  });
  ```
* S3 Bucket Website:

**Important:** The Bucket name must strictly match the full DNS name. 
See [the Developer Guide](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/getting-started.html) for more info. 
  ```ts
  const [recordName, domainName] = ['www', 'example.com'];
  
  const bucketWebsite = new Bucket(this, 'BucketWebsite', {
    bucketName: [recordName, domainName].join('.'), // www.example.com
    publicReadAccess: true,
    websiteIndexDocument: 'index.html',
  });
  
  const zone = HostedZone.fromLookup(this, 'Zone', {domainName}); // example.com

  new route53.ARecord(this, 'AliasRecord', {
    zone,
    recordName, // www
    target: route53.RecordTarget.fromAlias(new alias.BucketWebsiteTarget(bucket)),
  });
  ```
* User pool domain
  ```ts
  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new alias.UserPoolDomainTarget(domain)),
  });
  ```

See the documentation of `@aws-cdk/aws-route53` for more information.
