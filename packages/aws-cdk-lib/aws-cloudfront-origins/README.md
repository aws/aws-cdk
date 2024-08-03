# CloudFront Origins for the CDK CloudFront Library


This library contains convenience methods for defining origins for a CloudFront distribution. You can use this library to create origins from
S3 buckets, Elastic Load Balancing v2 load balancers, or any other domain name.

## S3 Bucket

An S3 bucket can be added as an origin. If the bucket is configured as a website endpoint, the distribution can use S3 redirects and S3 custom error
documents.

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.S3Origin(myBucket) },
});
```

The above will treat the bucket differently based on if `IBucket.isWebsite` is set or not. If the bucket is configured as a website, the bucket is
treated as an HTTP origin, and the built-in S3 redirects and error pages can be used. Otherwise, the bucket is handled as a bucket origin and
CloudFront's redirect and error handling will be used.

### Restricting access to an S3 Origin

CloudFront provides two ways to send authenticated requests to an Amazon S3 origin: origin access control (OAC) and origin access identity (OAI).
OAC is the recommended method and OAI is considered legacy (see [Restricting access to an Amazon Simple Storage Service origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)).
Following AWS best practices, it is recommended you to use OAC by
default when creating new origins.

For an S3 bucket that is configured as a standard S3 bucket origin (not as a website endpoint), when the above feature flag is enabled the `S3Origin`
construct will automatically create an OAC and grant it access (read-only by default) to the underlying bucket.

> [Note](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html): When you use OAC with S3
bucket origins you must set the bucket's object ownership to Bucket owner enforced, or Bucket owner preferred (only if you require ACLs).

```ts
const myBucket = new s3.Bucket(this, 'myBucket', {
  objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
});
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { 
    origin: new origins.S3Origin(myBucket) // Automatically creates an OAC
  },
});
```

Alternatively, a custom origin access control can be passed to the S3 origin:

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
const myOAC = new cloudfront.OriginAccessControl(this, 'myOAC', {
  description: 'Origin access control for S3 origin',
  originAccessControlOriginType: cloudfront.OriginAccessControlOriginType.S3,
});
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { 
    origin: new origins.S3Origin(myBucket, {
      originAccessControl: myOAC
    }),
  },
});
```

Alternatively, an existing origin access control can be imported:

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
const importedOAC = cloudfront.OriginAccessControl.fromOriginAccessControlAttributes(this, 'myImportedOAC', {
  originAccessControlId: 'ABC123ABC123AB',
  originAccessControlOriginType: cloudfront.OriginAccessControlOriginType.S3,
});
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { 
    origin: new origins.S3Origin(myBucket, {
      originAccessControl: importedOAC
    }),
  },
});
```

If the feature flag is not enabled (i.e. `undefined` or set to `false`), an origin access identity will be created by default.

#### Using OAC for a SSE-KMS encrypted S3 origin

If the objects in the S3 bucket origin are encrypted using server-side encryption with
AWS Key Management Service (SSE-KMS), the OAC must have permission to use the AWS KMS key.

```ts
const myKmsKey = new kms.Key(this, 'myKMSKey');
const myBucket = new s3.Bucket(this, 'mySSEKMSEncryptedBucket', {
  encryption: s3.BucketEncryption.KMS,
  encryptionKey: kmsKey,
});
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { 
    origin: new origins.S3Origin(myBucket) // Automatically creates an OAC
  },
});
```
If the S3 bucket has an `encryptionKey` defined, the `S3Origin` construct
will update the KMS key policy by appending the following policy statement to allow CloudFront read-only access (unless otherwise specified in the `originAccessLevels` property):

```
{
    "Statement": {
        "Sid": "GrantOACAccessToKMS",
        "Effect": "Allow",
        "Principal": {
            "Service": "cloudfront.amazonaws.com"
        },
        "Action": "kms:Decrypt",
        "Resource": "arn:aws:kms:::key/<key ID>",
        "Condition": {
            "StringEquals": {
                "AWS:SourceArn": "arn:aws:cloudfront::111122223333:distribution/<CloudFront distribution ID>"
            }
        }
    }
}
```

### Adding Custom Headers

You can configure CloudFront to add custom headers to the requests that it sends to your origin. These custom headers enable you to send and gather information from your origin that you don’t get with typical viewer requests. These headers can even be customized for each origin. CloudFront supports custom headers for both for custom and Amazon S3 origins.

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.S3Origin(myBucket, {
    customHeaders: {
      Foo: 'bar',
    },
  })},
});
```

## ELBv2 Load Balancer

An Elastic Load Balancing (ELB) v2 load balancer may be used as an origin. In order for a load balancer to serve as an origin, it must be publicly
accessible (`internetFacing` is true). Both Application and Network load balancers are supported.

```ts
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

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
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

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

## From an HTTP endpoint

Origins can also be created from any other HTTP endpoint, given the domain name, and optionally, other origin properties.

```ts
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.HttpOrigin('www.example.com') },
});
```

See the documentation of `aws-cdk-lib/aws-cloudfront` for more information.

## Failover Origins (Origin Groups)

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
      primaryOrigin: new origins.S3Origin(myBucket),
      fallbackOrigin: new origins.HttpOrigin('www.example.com'),
      // optional, defaults to: 500, 502, 503 and 504
      fallbackStatusCodes: [404],
    }),
  },
});
```

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

## From a Lambda Function URL

Lambda Function URLs enable direct invocation of Lambda functions via HTTP(S), without intermediaries. They can be set as CloudFront origins for streamlined function execution behind a CDN, leveraging caching and custom domains.

```ts
import * as lambda from 'aws-cdk-lib/aws-lambda';

declare const fn: lambda.Function;
const fnUrl = fn.addFunctionUrl({ authType: lambda.FunctionUrlAuthType.NONE });

new cloudfront.Distribution(this, 'Distribution', {
  defaultBehavior: { origin: new origins.FunctionUrlOrigin(fnUrl) },
});
```
