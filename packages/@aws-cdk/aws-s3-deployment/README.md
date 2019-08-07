## AWS S3 Deployment Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

> __Status: Experimental__

This library allows populating an S3 bucket with the contents of a .zip file
from another S3 bucket or from local disk.

The following example defines a publicly accessible S3 bucket with web hosting
enabled and populates it from a local directory on disk.

```ts
const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
  websiteIndexDocument: 'index.html',
  publicReadAccess: true
});

new s3deploy.BucketDeployment(this, 'DeployWebsite', {
  source: s3deploy.Source.asset('./website-dist'),
  destinationBucket: websiteBucket,
  destinationKeyPrefix: 'web/static' // optional prefix in destination bucket
});
```

This is what happens under the hood:

1. When this stack is deployed (either via `cdk deploy` or via CI/CD), the
   contents of the local `website-dist` directory will be archived and uploaded
   to an intermediary assets bucket.
2. The `BucketDeployment` construct synthesizes a custom CloudFormation resource
   of type `Custom::CDKBucketDeployment` into the template. The source bucket/key
   is set to point to the assets bucket.
3. The custom resource downloads the .zip archive, extracts it and issues `aws
   s3 sync --delete` against the destination bucket (in this case
   `websiteBucket`).

## Supported sources

The following source types are supported for bucket deployments:

 - Local .zip file: `s3deploy.Source.asset('/path/to/local/file.zip')`
 - Local directory: `s3deploy.Source.asset('/path/to/local/directory')`
 - Another bucket: `s3deploy.Source.bucket(bucket, zipObjectKey)`

## Retain on Delete

By default, the contents of the destination bucket will be deleted when the
`BucketDeployment` resource is removed from the stack or when the destination is
changed. You can use the option `retainOnDelete: true` to disable this behavior,
in which case the contents will be retained.

## CloudFront Invalidation

You can provide a CloudFront distribution and optional paths to invalidate after the bucket deployment finishes.

```ts
const bucket = new s3.Bucket(this, 'Destination');

const distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: bucket
      },
      behaviors : [ {isDefaultBehavior: true}]
    }
  ]
});

new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
  source: s3deploy.Source.asset('./website-dist'),
  destinationBucket: bucket,
  distribution,
  distributionPaths: ['/images/*.png'],
});
```

## Notes

 * This library uses an AWS CloudFormation custom resource which about 10MiB in
   size. The code of this resource is bundled with this library.
 * AWS Lambda execution time is limited to 15min. This limits the amount of data which can
   be deployed into the bucket by this timeout.
 * When the `BucketDeployment` is removed from the stack, the contents are retained
   in the destination bucket ([#952](https://github.com/aws/aws-cdk/issues/952)).
 * Bucket deployment _only happens_ during stack create/update. This means that
   if you wish to update the contents of the destination, you will need to
   change the source s3 key (or bucket), so that the resource will be updated.
   This is inline with best practices. If you use local disk assets, this will
   happen automatically whenever you modify the asset, since the S3 key is based
   on a hash of the asset contents.

## Development

The custom resource is implemented in Python 3.6 in order to be able to leverage
the AWS CLI for "aws sync". The code is under [`lambda/src`](./lambda/src) and
unit tests are under [`lambda/test`](./lambda/test).

This package requires Python 3.6 during build time in order to create the custom
resource Lambda bundle and test it. It also relies on a few bash scripts, so
might be tricky to build on Windows.

## Roadmap

 - [ ] Support "progressive" mode (no `--delete`) ([#953](https://github.com/aws/aws-cdk/issues/953))
 - [ ] Support "blue/green" deployments ([#954](https://github.com/aws/aws-cdk/issues/954))
