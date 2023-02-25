# AWS S3 Deployment Construct Library


This library allows populating an S3 bucket with the contents of .zip files
from other S3 buckets or from local disk.

The following example defines a publicly accessible S3 bucket with web hosting
enabled and populates it from a local directory on disk.

```ts
const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
  websiteIndexDocument: 'index.html',
  publicReadAccess: true,
});

new s3deploy.BucketDeployment(this, 'DeployWebsite', {
  sources: [s3deploy.Source.asset('./website-dist')],
  destinationBucket: websiteBucket,
  destinationKeyPrefix: 'web/static', // optional prefix in destination bucket
});
```

This is what happens under the hood:

1. When this stack is deployed (either via `cdk deploy` or via CI/CD), the
   contents of the local `website-dist` directory will be archived and uploaded
   to an intermediary assets bucket. If there is more than one source, they will
   be individually uploaded.
2. The `BucketDeployment` construct synthesizes a custom CloudFormation resource
   of type `Custom::CDKBucketDeployment` into the template. The source bucket/key
   is set to point to the assets bucket.
3. The custom resource downloads the .zip archive, extracts it and issues `aws
   s3 sync --delete` against the destination bucket (in this case
   `websiteBucket`). If there is more than one source, the sources will be
   downloaded and merged pre-deployment at this step.

If you are referencing the filled bucket in another construct that depends on
the files already be there, be sure to use `deployment.deployedBucket`. This
will ensure the bucket deployment has finished before the resource that uses
the bucket is created:

```ts
declare const websiteBucket: s3.Bucket;

const deployment = new s3deploy.BucketDeployment(this, 'DeployWebsite', {
  sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
  destinationBucket: websiteBucket,
});

new ConstructThatReadsFromTheBucket(this, 'Consumer', {
  // Use 'deployment.deployedBucket' instead of 'websiteBucket' here
  bucket: deployment.deployedBucket,
});
```

It is also possible to add additional sources using the `addSource` method.

```ts
declare const websiteBucket: s3.IBucket;

const deployment = new s3deploy.BucketDeployment(this, 'DeployWebsite', {
  sources: [s3deploy.Source.asset('./website-dist')],
  destinationBucket: websiteBucket,
  destinationKeyPrefix: 'web/static', // optional prefix in destination bucket
});

deployment.addSource(s3deploy.Source.asset('./another-asset'));
```

## Supported sources

The following source types are supported for bucket deployments:

- Local .zip file: `s3deploy.Source.asset('/path/to/local/file.zip')`
- Local directory: `s3deploy.Source.asset('/path/to/local/directory')`
- Another bucket: `s3deploy.Source.bucket(bucket, zipObjectKey)`
- String data: `s3deploy.Source.data('object-key.txt', 'hello, world!')`
  (supports [deploy-time values](#data-with-deploy-time-values))
- JSON data: `s3deploy.Source.jsonData('object-key.json', { json: 'object' })`
  (supports [deploy-time values](#data-with-deploy-time-values))

To create a source from a single file, you can pass `AssetOptions` to exclude
all but a single file:

- Single file: `s3deploy.Source.asset('/path/to/local/directory', { exclude: ['**', '!onlyThisFile.txt'] })`

**IMPORTANT** The `aws-s3-deployment` module is only intended to be used with
zip files from trusted sources. Directories bundled by the CDK CLI (by using
`Source.asset()` on a directory) are safe. If you are using `Source.asset()` or
`Source.bucket()` to reference an existing zip file, make sure you trust the
file you are referencing. Zips from untrusted sources might be able to execute
arbitrary code in the Lambda Function used by this module, and use its permissions
to read or write unexpected files in the S3 bucket.

## Retain on Delete

By default, the contents of the destination bucket will **not** be deleted when the
`BucketDeployment` resource is removed from the stack or when the destination is
changed. You can use the option `retainOnDelete: false` to disable this behavior,
in which case the contents will be deleted.

Configuring this has a few implications you should be aware of:

- **Logical ID Changes**

  Changing the logical ID of the `BucketDeployment` construct, without changing the destination
  (for example due to refactoring, or intentional ID change) **will result in the deletion of the objects**.
  This is because CloudFormation will first create the new resource, which will have no affect,
  followed by a deletion of the old resource, which will cause a deletion of the objects,
  since the destination hasn't changed, and `retainOnDelete` is `false`.

- **Destination Changes**

  When the destination bucket or prefix is changed, all files in the previous destination will **first** be
  deleted and then uploaded to the new destination location. This could have availability implications
  on your users.

### General Recommendations

#### Shared Bucket

If the destination bucket **is not** dedicated to the specific `BucketDeployment` construct (i.e shared by other entities),
we recommend to always configure the `destinationKeyPrefix` property. This will prevent the deployment from
accidentally deleting data that wasn't uploaded by it.

#### Dedicated Bucket

If the destination bucket **is** dedicated, it might be reasonable to skip the prefix configuration,
in which case, we recommend to remove `retainOnDelete: false`, and instead, configure the
[`autoDeleteObjects`](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-s3-readme.html#bucket-deletion)
property on the destination bucket. This will avoid the logical ID problem mentioned above.

## Prune

By default, files in the destination bucket that don't exist in the source will be deleted
when the `BucketDeployment` resource is created or updated. You can use the option `prune: false` to disable
this behavior, in which case the files will not be deleted.

```ts
declare const destinationBucket: s3.Bucket;
new s3deploy.BucketDeployment(this, 'DeployMeWithoutDeletingFilesOnDestination', {
  sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
  destinationBucket,
  prune: false,
});
```

This option also enables you to 
multiple bucket deployments for the same destination bucket & prefix,
each with its own characteristics. For example, you can set different cache-control headers
based on file extensions:

```ts
declare const destinationBucket: s3.Bucket;
new s3deploy.BucketDeployment(this, 'BucketDeployment', {
  sources: [s3deploy.Source.asset('./website', { exclude: ['index.html'] })],
  destinationBucket,
  cacheControl: [s3deploy.CacheControl.fromString('max-age=31536000,public,immutable')],
  prune: false,
});

new s3deploy.BucketDeployment(this, 'HTMLBucketDeployment', {
  sources: [s3deploy.Source.asset('./website', { exclude: ['*', '!index.html'] })],
  destinationBucket,
  cacheControl: [s3deploy.CacheControl.fromString('max-age=0,no-cache,no-store,must-revalidate')],
  prune: false,
});
```

## Exclude and Include Filters

There are two points at which filters are evaluated in a deployment: asset bundling and the actual deployment. If you simply want to exclude files in the asset bundling process, you should leverage the `exclude` property of `AssetOptions` when defining your source:

```ts
declare const destinationBucket: s3.Bucket;
new s3deploy.BucketDeployment(this, 'HTMLBucketDeployment', {
  sources: [s3deploy.Source.asset('./website', { exclude: ['*', '!index.html'] })],
  destinationBucket,
});
```

If you want to specify filters to be used in the deployment process, you can use the `exclude` and `include` filters on `BucketDeployment`.  If excluded, these files will not be deployed to the destination bucket. In addition, if the file already exists in the destination bucket, it will not be deleted if you are using the `prune` option:

```ts
declare const destinationBucket: s3.Bucket;
new s3deploy.BucketDeployment(this, 'DeployButExcludeSpecificFiles', {
  sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
  destinationBucket,
  exclude: ['*.txt'],
});
```

These filters follow the same format that is used for the AWS CLI.  See the CLI documentation for information on [Using Include and Exclude Filters](https://docs.aws.amazon.com/cli/latest/reference/s3/index.html#use-of-exclude-and-include-filters).

## Objects metadata

You can specify metadata to be set on all the objects in your deployment.
There are 2 types of metadata in S3: system-defined metadata and user-defined metadata.
System-defined metadata have a special purpose, for example cache-control defines how long to keep an object cached.
User-defined metadata are not used by S3 and keys always begin with `x-amz-meta-` (this prefix is added automatically).

System defined metadata keys include the following:

- cache-control (`--cache-control` in `aws s3 sync`)
- content-disposition (`--content-disposition` in `aws s3 sync`)
- content-encoding (`--content-encoding` in `aws s3 sync`)
- content-language (`--content-language` in `aws s3 sync`)
- content-type (`--content-type` in `aws s3 sync`)
- expires (`--expires` in `aws s3 sync`)
- x-amz-storage-class (`--storage-class` in `aws s3 sync`)
- x-amz-website-redirect-location (`--website-redirect` in `aws s3 sync`)
- x-amz-server-side-encryption (`--sse` in `aws s3 sync`)
- x-amz-server-side-encryption-aws-kms-key-id (`--sse-kms-key-id` in `aws s3 sync`)
- x-amz-server-side-encryption-customer-algorithm (`--sse-c-copy-source` in `aws s3 sync`)
- x-amz-acl (`--acl` in `aws s3 sync`)

You can find more information about system defined metadata keys in
[S3 PutObject documentation](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html)
and [`aws s3 sync` documentation](https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html).

```ts
const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
  websiteIndexDocument: 'index.html',
  publicReadAccess: true,
});

new s3deploy.BucketDeployment(this, 'DeployWebsite', {
  sources: [s3deploy.Source.asset('./website-dist')],
  destinationBucket: websiteBucket,
  destinationKeyPrefix: 'web/static', // optional prefix in destination bucket
  metadata: { A: "1", b: "2" }, // user-defined metadata

  // system-defined metadata
  contentType: "text/html",
  contentLanguage: "en",
  storageClass: s3deploy.StorageClass.INTELLIGENT_TIERING,
  serverSideEncryption: s3deploy.ServerSideEncryption.AES_256,
  cacheControl: [
    s3deploy.CacheControl.setPublic(),
    s3deploy.CacheControl.maxAge(Duration.hours(1)),
  ],
  accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
});
```

## CloudFront Invalidation

You can provide a CloudFront distribution and optional paths to invalidate after the bucket deployment finishes.

```ts
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const bucket = new s3.Bucket(this, 'Destination');

// Handles buckets whether or not they are configured for website hosting.
const distribution = new cloudfront.Distribution(this, 'Distribution', {
  defaultBehavior: { origin: new origins.S3Origin(bucket) },
});

new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
  sources: [s3deploy.Source.asset('./website-dist')],
  destinationBucket: bucket,
  distribution,
  distributionPaths: ['/images/*.png'],
});
```

## Size Limits

The default memory limit for the deployment resource is 128MiB. If you need to
copy larger files, you can use the `memoryLimit` configuration to increase the
size of the AWS Lambda resource handler.

The default ephemeral storage size for the deployment resource is 512MiB. If you
need to upload larger files, you may hit this limit. You can use the 
`ephemeralStorageSize` configuration to increase the storage size of the AWS Lambda
resource handler.

> NOTE: a new AWS Lambda handler will be created in your stack for each combination
> of memory and storage size.

## EFS Support

If your workflow needs more disk space than default (512 MB) disk space, you may attach an EFS storage to underlying
lambda function. To Enable EFS support set `efs` and `vpc` props for BucketDeployment.

Check sample usage below.
Please note that creating VPC inline may cause stack deletion failures. It is shown as below for simplicity.
To avoid such condition, keep your network infra (VPC) in a separate stack and pass as props.

```ts
declare const destinationBucket: s3.Bucket;
declare const vpc: ec2.Vpc;

new s3deploy.BucketDeployment(this, 'DeployMeWithEfsStorage', {
  sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
  destinationBucket,
  destinationKeyPrefix: 'efs/',
  useEfs: true,
  vpc,
  retainOnDelete: false,
});
```

## Data with deploy-time values

The content passed to `Source.data()` or `Source.jsonData()` can include
references that will get resolved only during deployment.

For example:

```ts
import * as sns from 'aws-cdk-lib/aws-sns';

declare const destinationBucket: s3.Bucket;
declare const topic: sns.Topic;

const appConfig = {
  topic_arn: topic.topicArn,
  base_url: 'https://my-endpoint',
};

new s3deploy.BucketDeployment(this, 'BucketDeployment', {
  sources: [s3deploy.Source.jsonData('config.json', appConfig)],
  destinationBucket,
});
```

The value in `topic.topicArn` is a deploy-time value. It only gets resolved
during deployment by placing a marker in the generated source file and
substituting it when its deployed to the destination with the actual value.

## Keep Files Zipped

By default, files are zipped, then extracted into the destination bucket.

You can use the option `extract: false` to disable this behavior, in which case, files will remain in a zip file when deployed to S3. To reference the object keys, or filenames, which will be deployed to the bucket, you can use the `objectKeys` getter on the bucket deployment.

```ts
import * as cdk from 'aws-cdk-lib';

declare const destinationBucket: s3.Bucket;

const myBucketDeployment = new s3deploy.BucketDeployment(this, 'DeployMeWithoutExtractingFilesOnDestination', {
  sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
  destinationBucket,
  extract: false,
});

new cdk.CfnOutput(this, 'ObjectKey', {
  value: cdk.Fn.select(0, myBucketDeployment.objectKeys),
});
```

## Notes

- This library uses an AWS CloudFormation custom resource which is about 10MiB in
  size. The code of this resource is bundled with this library.
- AWS Lambda execution time is limited to 15min. This limits the amount of data
  which can be deployed into the bucket by this timeout.
- When the `BucketDeployment` is removed from the stack, the contents are retained
  in the destination bucket ([#952](https://github.com/aws/aws-cdk/issues/952)).
- If you are using `s3deploy.Source.bucket()` to take the file source from
  another bucket: the deployed files will only be updated if the key (file name)
  of the file in the source  bucket changes. Mutating the file in place will not
  be good enough: the custom resource will simply not run if the properties don't
  change.
  - If you use assets (`s3deploy.Source.asset()`) you don't need to worry
    about this: the asset system will make sure that if the files have changed,
    the file name is unique and the deployment will run.

## Development

The custom resource is implemented in Python 3.9 in order to be able to leverage
the AWS CLI for "aws s3 sync". The code is under [`lib/lambda`](https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk/aws-s3-deployment/lib/lambda) and
unit tests are under [`test/lambda`](https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk/aws-s3-deployment/test/lambda).

This package requires Python 3.9 during build time in order to create the custom
resource Lambda bundle and test it. It also relies on a few bash scripts, so
might be tricky to build on Windows.

## Roadmap

- [ ] Support "blue/green" deployments ([#954](https://github.com/aws/aws-cdk/issues/954))
