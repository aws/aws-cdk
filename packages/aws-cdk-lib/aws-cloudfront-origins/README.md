# CloudFront Origins for the CDK CloudFront Library

This library contains convenience methods for defining origins for a CloudFront distribution. You can use this library to create origins from
S3 buckets, Elastic Load Balancing v2 load balancers, or any other domain name.

## S3 Bucket

An S3 bucket can be used as an origin. An S3 bucket origin can either be configured as a standard bucket or as a website endpoint (see [Use an S3 Bucket](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html#using-s3-as-origin)).

### Standard S3 Bucket

To set up an origin using a standard S3 bucket, use the `S3BucketOrigin` class. The bucket
is handled as a bucket origin and
CloudFront's redirect and error handling will be used. It is recommended to use `S3BucketOrigin.withOriginAccessControl()` to configure OAC for your origin.

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: origins.S3BucketOrigin.withOriginAccessControl(myBucket) },
});
```

### S3 Bucket Configured as a Website Endpoint

To set up an origin using a S3 bucket configured as a website endpoint, use the `S3StaticWebsiteOrigin` class. When the bucket is configured as a
website endpoint, the bucket is treated as an HTTP origin,
and the distribution can use built-in S3 redirects and S3 custom error pages.

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.S3StaticWebsiteOrigin(myBucket) },
});
```

> Note: `S3Origin` has been deprecated. Use `S3BucketOrigin` for standard S3 origins and `S3StaticWebsiteOrigin` for static website S3 origins.

## Migrating from OAI to OAC

If you are currently using OAI for your S3 origin and wish to migrate to OAC,
replace the `S3Origin` construct (now deprecated) with `S3BucketOrigin.withOriginAccessControl()` which automatically
creates and sets up a OAC for you.
The OAI will be deleted as part of the
stack update. The logical IDs of the resources managed by
the stack (i.e. distribution, bucket) will be unchanged. Run `cdk diff` before deploying to verify the
changes to your stack.

Existing setup using OAI and `S3Origin`:

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: new origins.S3Origin(myBucket) },
});
```

Updated setup using `S3BucketOrigin.withOriginAccessControl()`:

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: origins.S3BucketOrigin.withOriginAccessControl(myBucket) },
});
```

For more information, see [Migrating from origin access identity (OAI) to origin access control (OAC)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html#migrate-from-oai-to-oac).

### Using pre-existing S3 buckets

If you are using an imported bucket for your S3 Origin and want to use OAC,
you will need to update
the S3 bucket policy manually. CDK apps cannot modify the configuration of imported constructs. After deploying the distribution, add the following
policy statement to your
S3 bucket to allow CloudFront read-only access
(or additional permissions as required):

```json
{
    "Version": "2012-10-17",
    "Statement": {
        "Sid": "GrantOACAccessToS3",
        "Effect": "Allow",
        "Principal": {
            "Service": "cloudfront.amazonaws.com"
        },
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::<S3 bucket name>/*",
        "Condition": {
            "StringEquals": {
                "AWS:SourceArn": "arn:aws:cloudfront::111122223333:distribution/<CloudFront distribution ID>"
            }
        }
    }
}
```

> Note: If your bucket previously used OAI, you will need to manually remove the policy statement
that gives the OAI access to your bucket from your bucket policy.


CloudFront provides two ways to send authenticated requests to an Amazon S3 origin:
origin access control (OAC) and origin access identity (OAI).
OAI is considered legacy due to limited functionality and regional
limitations, whereas OAC is recommended because it supports All Amazon S3
buckets in all AWS Regions, Amazon S3 server-side encryption with AWS KMS (SSE-KMS), and dynamic requests (PUT and DELETE) to Amazon S3. Additionally,
OAC provides stronger security posture with short term credentials,
and more frequent credential rotations as compared to OAI.
(see [Restricting access to an Amazon S3 Origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)).
OAI and OAC can be used in conjunction with a bucket that is not public to
require that your users access your content using CloudFront URLs and not S3 URLs directly.

> Note: OAC and OAI can only be used with an regular S3 bucket origin (not a bucket configured as a website endpoint).

The `S3BucketOrigin` class supports creating a S3 origin with OAC, OAI, and no access control (using your bucket access settings) via
the `withOriginAccessControl()`, `withOriginAccessIdentity()`, and `withBucketDefaults()` methods respectively.

Setup an S3 origin with origin access control as follows:

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessControl(myBucket) // Automatically creates an OAC
  },
});
```

You can also pass in a custom S3 origin access control:

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
const oac = new cloudfront.S3OriginAccessControl(this, 'MyOAC', { signing: cloudfront.Signing.SIGV4_NO_OVERRIDE });
const s3Origin = origins.S3BucketOrigin.withOriginAccessControl(
  bucket, { originAccessControl: oac }
)
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: {
    origin: s3Origin
  },
});
```

An existing S3 origin access control can be imported using the `fromOriginAccessControlId` method:

```ts
const importedOAC = cloudfront.S3OriginAccessControl.fromOriginAccessControlId(this, 'myImportedOAC', {
  originAccessControlId: 'ABC123ABC123AB',
});
```

Setup an S3 origin with origin access identity (legacy) as follows:

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessIdentity(myBucket) // Automatically creates an OAI
  },
});
```

You can also pass in a custom S3 origin access identity:

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
const myOai = new cloudfront.OriginAccessIdentity(this, 'myOAI', {
  comment: 'My custom OAI'
});
const s3Origin = origins.S3BucketOrigin.withOriginAccessIdentity(bucket, {
  originAccessIdentity: myOai
});
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: {
    origin: s3Origin
  },
});
```

To setup an S3 origin with no access control:

```ts
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withBucketDefaults(myBucket)
  },
});
```

> [Note](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html): When you use OAC with S3
bucket origins you must set the bucket's object ownership to Bucket owner enforced, or Bucket owner preferred (only if you require ACLs).

#### Using OAC for a SSE-KMS encrypted S3 origin

If the objects in the S3 bucket origin are encrypted using server-side encryption with
AWS Key Management Service (SSE-KMS), the OAC must have permission to use the AWS KMS key.
Setting up an S3 origin using `S3BucketOrigin.withOriginAccessControl()` will automatically add the statement to the KMS key policy
to give the OAC permission to use the KMS key.
For imported keys, you will need to manually update the
key policy yourself as CDK apps cannot modify the configuration of imported resources.

```ts
const myKmsKey = new kms.Key(this, 'myKMSKey');
const myBucket = new s3.Bucket(this, 'mySSEKMSEncryptedBucket', {
  encryption: s3.BucketEncryption.KMS,
  encryptionKey: kmsKey,
  objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
});
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { 
    origin: origins.S3BucketOrigin.withOriginAccessControl(myBucket) // Automatically grants Distribution access to `myKmsKey`
  },
});
```

If the S3 bucket has an `encryptionKey` defined, `S3BucketOrigin.withOriginAccessControl()`
will update the KMS key policy by appending the following policy statement to allow CloudFront read-only access (unless otherwise specified in the `originAccessLevels` property):

```json
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
                "AWS:SourceArn": "arn:aws:cloudfront::<account ID>:distribution/<CloudFront distribution ID>"
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
  defaultBehavior: { origin: origins.S3BucketOrigin.withOriginAccessControl(myBucket, {
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
      primaryOrigin: origins.S3BucketOrigin.withOriginAccessControl(myBucket),
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
