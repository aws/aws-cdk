# CloudFront Origins for the CDK CloudFront Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This library contains convenience methods for defining origins for a CloudFront distribution. You can use this library to create origins from
S3 buckets, Elastic Load Balancing v2 load balancers, or any other domain name.

## S3 Bucket

An S3 bucket can be added as an origin. If the bucket is configured as a website endpoint, the distribution can use S3 redirects and S3 custom error
documents.

```ts
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';

const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.S3Origin(myBucket) },
});
```

The above will treat the bucket differently based on if `IBucket.isWebsite` is set or not. If the bucket is configured as a website, the bucket is
treated as an HTTP origin, and the built-in S3 redirects and error pages can be used. Otherwise, the bucket is handled as a bucket origin and
CloudFront's redirect and error handling will be used. In the latter case, the Origin wil create an origin access identity and grant it access to the
underlying bucket. This can be used in conjunction with a bucket that is not public to require that your users access your content using CloudFront
URLs and not S3 URLs directly. Alternatively, a custom origin access identity can be passed to the S3 origin in the properties.

## ELBv2 Load Balancer

An Elastic Load Balancing (ELB) v2 load balancer may be used as an origin. In order for a load balancer to serve as an origin, it must be publicly
accessible (`internetFacing` is true). Both Application and Network load balancers are supported.

```ts
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

const vpc = new ec2.Vpc(...);
// Create an application load balancer in a VPC. 'internetFacing' must be 'true'
// for CloudFront to access the load balancer and use it as an origin.
const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
  vpc,
  internetFacing: true
});
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.LoadBalancerV2Origin(lb) },
});
```

The origin can also be customized to respond on different ports, have different connection properties, etc.

```ts
const origin = new origins.LoadBalancerV2Origin(loadBalancer, {
  connectionAttempts: 3,
  connectionTimeout: Duration.seconds(5),
  protocolPolicy: cloudfront.OriginProtocolPolicy.MATCH_VIEWER,
});
```

## From an HTTP endpoint

Origins can also be created from any other HTTP endpoint, given the domain name, and optionally, other origin properties.

```ts
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.HttpOrigin('www.example.com') },
});
```

See the documentation of `@aws-cdk/aws-cloudfront` for more information.

## Failover Origins (Origin Groups)

You can set up CloudFront with origin failover for scenarios that require high availability.
To get started, you create an origin group with two origins: a primary and a secondary.
If the primary origin is unavailable, or returns specific HTTP response status codes that indicate a failure,
CloudFront automatically switches to the secondary origin.
You achieve that behavior in the CDK using the `OriginGroup` class:

```ts
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: {
    origin: new origins.OriginGroup({
      primaryOrigin: new origins.S3Origin(myBucket),
      fallbackOrigin: new origins.HttpOrigin('www.example.com'),
      // optional, defaults to: 500, 502, 503 and 504
      fallbackStatusCodes: [404],
    }),
  },
});
```
