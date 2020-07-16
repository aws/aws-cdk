## Amazon CloudFront Construct Library

<!--BEGIN STABILITY BANNER-->
---

| Features | Stability |
| --- | --- |
| CFN Resources | ![Stable](https://img.shields.io/badge/stable-success.svg?style=for-the-badge) |
| Higher level constructs for Distribution | ![Experimental](https://img.shields.io/badge/experimental-important.svg?style=for-the-badge) |
| Higher level constructs for CloudFrontWebDistribution | ![Stable](https://img.shields.io/badge/stable-success.svg?style=for-the-badge) |

> **CFN Resources:** All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

> **Experimental:** Higher level constructs in this module that are marked as experimental are under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

> **Stable:** Higher level constructs in this module that are marked stable will not undergo any breaking changes. They will strictly follow the [Semantic Versioning](https://semver.org/) model.

---
<!--END STABILITY BANNER-->

Amazon CloudFront is a web service that speeds up distribution of your static and dynamic web content, such as .html, .css, .js, and image files, to
your users. CloudFront delivers your content through a worldwide network of data centers called edge locations. When a user requests content that
you're serving with CloudFront, the user is routed to the edge location that provides the lowest latency, so that content is delivered with the best
possible performance.

## Distribution API - Experimental

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

The `Distribution` API is currently being built to replace the existing `CloudFrontWebDistribution` API. The `Distribution` API is optimized for the
most common use cases of CloudFront distributions (e.g., single origin and behavior, few customizations) while still providing the ability for more
advanced use cases. The API focuses on simplicity for the common use cases, and convenience methods for creating the behaviors and origins necessary
for more complex use cases.

### Creating a distribution

CloudFront distributions deliver your content from one or more origins; an origin is the location where you store the original version of your
content. Origins can be created from S3 buckets or a custom origin (HTTP server). Each distribution has a default behavior which applies to all
requests to that distribution, and routes requests to a primary origin.

#### From an S3 Bucket

An S3 bucket can be added as an origin. If the bucket is configured as a website endpoint, the distribution can use S3 redirects and S3 custom error
documents.

```ts
import * as cloudfront from '@aws-cdk/aws-cloudfront';

// Creates a distribution for a S3 bucket.
const myBucket = new s3.Bucket(this, 'myBucket');
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: cloudfront.Origin.fromBucket(myBucket) },
});
```

The above will treat the bucket differently based on if `IBucket.isWebsite` is set or not. If the bucket is configured as a website, the bucket is
treated as an HTTP origin, and the built-in S3 redirects and error pages can be used. Otherwise, the bucket is handled as a bucket origin and
CloudFront's redirect and error handling will be used. In the latter case, the Origin wil create an origin access identity and grant it access to the
underlying bucket. This can be used in conjunction with a bucket that is not public to require that your users access your content using CloudFront
URLs and not S3 URLs directly.

### Domain Names and Certificates

When you create a distribution, CloudFront assigns a domain name for the distribution, for example: `d111111abcdef8.cloudfront.net`; this value can
be retrieved from `distribution.distributionDomainName`. CloudFront distributions use a default certificate (`*.cloudfront.net`) to support HTTPS by
default. If you want to use your own domain name, such as `www.example.com`, you must associate a certificate with your distribution that contains
your domain name. The certificate must be present in the AWS Certificate Manager (ACM) service in the US East (N. Virginia) region; the certificate
may either be created by ACM, or created elsewhere and imported into ACM.

```ts
const myCertificate = new acm.DnsValidatedCertificate(this, 'mySiteCert', {
  domainName: 'www.example.com',
  hostedZone,
});
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: { origin: cloudfront.Origin.fromBucket(myBucket) },
  certificate: myCertificate,
});
```

### Multiple Behaviors & Origins

Each distribution has a default behavior which applies to all requests to that distribution; additional behaviors may be specified for a
given URL path pattern. Behaviors allow routing with multiple origins, controlling which HTTP methods to support, whether to require users to
use HTTPS, and what query strings or cookies to forward to your origin, among others.

The properties of the default behavior can be adjusted as part of the distribution creation. The following example shows configuring the HTTP
methods and viewer protocol policy of the cache.

```ts
const myWebDistribution = new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: {
    origin: cloudfront.Origin.fromBucket(myBucket),
    allowedMethods: AllowedMethods.ALLOW_ALL,
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  }
});
```

Additional behaviors can be specified at creation, or added after the initial creation. Each additional behavior is associated with an origin,
and enable customization for a specific set of resources based on a URL path pattern. For example, we can add a behavior to `myWebDistribution` to
override the default time-to-live (TTL) for all of the images.

```ts
myWebDistribution.addBehavior('/images/*.jpg', cloudfront.Origin.fromBucket(myOtherBucket), {
  viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  defaultTtl: cdk.Duration.days(7),
});
```

These behaviors can also be specified at distribution creation time.

```ts
const bucketOrigin = cloudfront.Origin.fromBucket(myBucket);
new cloudfront.Distribution(this, 'myDist', {
  defaultBehavior: {
    origin: bucketOrigin,
    allowedMethods: AllowedMethods.ALLOW_ALL,
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  },
  additionalBehaviors: {
    '/images/*.jpg': {
      origin: bucketOrigin,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      defaultTtl: cdk.Duration.days(7),
    },
  },
});
```

## CloudFrontWebDistribution API - Stable

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

A CloudFront construct - for setting up the AWS CDN with ease!

Example usage:

```ts
const sourceBucket = new Bucket(this, 'Bucket');

const distribution = new CloudFrontWebDistribution(this, 'MyDistribution', {
    originConfigs: [
        {
            s3OriginSource: {
                s3BucketSource: sourceBucket
            },
            behaviors : [ {isDefaultBehavior: true}]
        }
    ]
 });
```

### Viewer certificate

By default, CloudFront Web Distributions will answer HTTPS requests with CloudFront's default certificate, only containing the distribution `domainName` (e.g. d111111abcdef8.cloudfront.net).
You can customize the viewer certificate property to provide a custom certificate and/or list of domain name aliases to fit your needs.

See [Using Alternate Domain Names and HTTPS](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-alternate-domain-names.html) in the CloudFront User Guide.

#### Default certificate

You can customize the default certificate aliases. This is intended to be used in combination with CNAME records in your DNS zone.

Example:

[create a distrubution with an default certificiate example](test/example.default-cert-alias.lit.ts)

#### ACM certificate

You can change the default certificate by one stored AWS Certificate Manager, or ACM.
Those certificate can either be generated by AWS, or purchased by another CA imported into ACM.

For more information, see [the aws-certificatemanager module documentation](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-certificatemanager-readme.html) or [Importing Certificates into AWS Certificate Manager](https://docs.aws.amazon.com/acm/latest/userguide/import-certificate.html) in the AWS Certificate Manager User Guide.

Example:

[create a distrubution with an acm certificate example](test/example.acm-cert-alias.lit.ts)

#### IAM certificate

You can also import a certificate into the IAM certificate store.

See [Importing an SSL/TLS Certificate](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-procedures.html#cnames-and-https-uploading-certificates) in the CloudFront User Guide.

Example:

[create a distrubution with an iam certificate example](test/example.iam-cert-alias.lit.ts)

#### Restrictions

CloudFront supports adding restrictions to your distribution.

See [Restricting the Geographic Distribution of Your Content](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/georestrictions.html) in the CloudFront User Guide.

Example:

```ts
new cloudfront.CloudFrontWebDistribution(stack, 'MyDistribution', {
   //...
    geoRestriction: GeoRestriction.whitelist('US', 'UK')
});
```

### Connection behaviors between CloudFront and your origin

CloudFront provides you even more control over the connection behaviors between CloudFront and your origin. You can now configure the number of connection attempts CloudFront will make to your origin and the origin connection timeout for each attempt.

See [Origin Connection Attempts](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#origin-connection-attempts)

See [Origin Connection Timeout](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#origin-connection-timeout)

Example usage:

```ts
const distribution = new CloudFrontWebDistribution(this, 'MyDistribution', {
    originConfigs: [
        {
            ...,
            connectionAttempts: 3,
            connectionTimeout: cdk.Duration.seconds(10),
        }
    ]
});
```
