# CloudFront Origins for the CDK CloudFront Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This library contains convenience methods for defining origins for a CloudFront distribution. You can use this library to create origins from
S3 buckets, Elastic Load Balancing v2 load balancers, or any other domain name.


## From any generic HTTP endpoint

Any public HTTP or HTTPS endpoint can be used as an origin, as long as it has a static domain name.

```ts
// Creates a distribution from an HTTP endpoint
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.HttpOrigin('www-origin.example.com') },
});
```

## From an S3 Bucket with IAM access controls

Any S3 bucket can be used as an origin. If the bucket is not configured for public website hosting, the distribution
will access bucket contents through the standard S3 `GetObject` API.

CloudFront supports two methods of authenticating with S3: origin access control (OAC) and origin access identity (OAI). OAI
is a legacy authentication method which will not be supported in new regions. It is strongly recommended to use OAC for all
new deployments.

You can enable OAC by setting the `originAccessControl` property to `true`, or by explicitly supplying an `OriginAccessControl`
resource. If you do not specify anything, the legacy OAI method will be used by default for backwards-compatibility reasons.

```ts
// Creates a distribution from a private S3 bucket using Origin Access Control
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.S3Origin(myBucket, { originAccessControl: true }) },
});
```

The `S3Origin` construct will automatically adjust the bucket resource policy to grant necessary `s3:GetObject` permissions.
When using OAC, any failure when adjusting permissions will result in an error message. If you cannot resolve the error, you
can set `autoResourcePolicy: false` to allow deployment and then manually adjust resource policies after deployment.

When using OAI, some types of failures when adjusting permissions will be silently ignored. You should verify that your
distribution is properly serving origin content after deployment, and then adjust resource policies if necessary.

See [Restricting access to an Amazon S3 origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) for more details about OAC, OAI, and resource policies.

## From a website-enabled S3 Bucket with public read access

A website-enabled S3 bucket can also be used as an origin. The distribution will access the bucket through
the public website endpoint and honor any existing S3 configuration for index documents, error documents,
and redirections.

```ts
// Creates a distribution from a public website-enabled S3 bucket
const publicWebBucket = new s3.Bucket(this, 'myWebsiteBucket', {
  publicReadAccess: true,
  websiteIndexDocument: 'index.html',
});
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.S3Origin(publicWebBucket) },
});
```

## From an ELBv2 Load Balancer

An Elastic Load Balancing (ELB) v2 load balancer may be used as an origin. In order for a load balancer to serve as an origin, it must be publicly
accessible (`internetFacing` is true). Both Application and Network load balancers are supported.

```ts
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

declare const vpc: ec2.Vpc;
// Create an application load balancer in a VPC. 'internetFacing' must be 'true'
// for CloudFront to access the load balancer and use it as an origin.
const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
  vpc,
  internetFacing: true,
});
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.LoadBalancerV2Origin(lb) },
});
```

The origin can also be customized to respond on different ports, have different connection properties, etc.

```ts
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

declare const loadBalancer: elbv2.ApplicationLoadBalancer;
const origin = new origins.LoadBalancerV2Origin(loadBalancer, {
  connectionAttempts: 3,
  connectionTimeout: Duration.seconds(5),
  readTimeout: Duration.seconds(45),
  keepaliveTimeout: Duration.seconds(45),
  protocolPolicy: cloudfront.OriginProtocolPolicy.MATCH_VIEWER,
});
```

Note that the `readTimeout` and `keepaliveTimeout` properties can extend their values over 60 seconds only if a limit increase request for CloudFront origin response timeout
quota has been approved in the target account; otherwise, values over 60 seconds will produce an error at deploy time. Consider that this value is
still limited to a maximum value of 180 seconds, which is a hard limit for that quota.

## From an API Gateway REST API

Origins can be created from an API Gateway REST API. It is recommended to use a
[regional API](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html) in this case. The origin path will automatically be set as the stage name.

```ts
declare const api: apigateway.RestApi;
new cloudfront.Distribution(this, 'Distribution', {
  defaultBehavior: { origin: new origins.RestApiOrigin(api) },
});
```

If you want to use a different origin path, you can specify it in the `originPath` property.

```ts
declare const api: apigateway.RestApi;
new cloudfront.Distribution(this, 'Distribution', {
  defaultBehavior: { origin: new origins.RestApiOrigin(api, { originPath: '/custom-origin-path' }) },
});
```

## From a failover configuration with multiple origins (Origin Groups)

You can set up CloudFront with origin failover for scenarios that require high availability.
To get started, you create an origin group with two origins: a primary and a secondary.
If the primary origin is unavailable, or returns specific HTTP response status codes that indicate a failure,
CloudFront automatically switches to the secondary origin.
You achieve that behavior in the CDK using the `OriginGroup` class:

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: {
    origin: new origins.OriginGroup({
      primaryOrigin: new origins.S3Origin(myBucket, { originAccessControl: true }),
      fallbackOrigin: new origins.HttpOrigin('www.example.com'),
      // optional, defaults to: 500, 502, 503 and 504
      fallbackStatusCodes: [404],
    }),
  },
});
```

## Adding Custom Headers

You can configure CloudFront to add custom headers to the requests that it sends to your origin. These custom headers enable you to send and gather information from your origin that you don’t get with typical viewer requests. These headers can even be customized for each origin. CloudFront supports custom headers for both for custom and Amazon S3 origins.

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.S3Origin(myBucket, {
    orginAccessControl: true,
    customHeaders: {
      Foo: 'bar',
    },
  })},
});
```
