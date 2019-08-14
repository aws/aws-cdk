# Route53 Alias Record Targets for the CDK Route53 Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


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
* S3 Bucket WebSite
  ```ts
  new route53.ARecord(this, 'AliasRecord', {
    zone,
    target: route53.RecordTarget.fromAlias(new alias.BucketWebsiteTarget(bucket)),
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

See the documentation of `@aws-cdk/aws-route53` for more information.
