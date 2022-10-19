# Amazon S3 Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

Define an unencrypted S3 bucket.

```ts
const bucket = new s3.Bucket(this, 'MyFirstBucket');
```

`Bucket` constructs expose the following deploy-time attributes:

 * `bucketArn` - the ARN of the bucket (i.e. `arn:aws:s3:::bucket_name`)
 * `bucketName` - the name of the bucket (i.e. `bucket_name`)
 * `bucketWebsiteUrl` - the Website URL of the bucket (i.e.
   `http://bucket_name.s3-website-us-west-1.amazonaws.com`)
 * `bucketDomainName` - the URL of the bucket (i.e. `bucket_name.s3.amazonaws.com`)
 * `bucketDualStackDomainName` - the dual-stack URL of the bucket (i.e.
   `bucket_name.s3.dualstack.eu-west-1.amazonaws.com`)
 * `bucketRegionalDomainName` - the regional URL of the bucket (i.e.
   `bucket_name.s3.eu-west-1.amazonaws.com`)
 * `arnForObjects(pattern)` - the ARN of an object or objects within the bucket (i.e.
   `arn:aws:s3:::bucket_name/exampleobject.png` or
   `arn:aws:s3:::bucket_name/Development/*`)
 * `urlForObject(key)` - the HTTP URL of an object within the bucket (i.e.
   `https://s3.cn-north-1.amazonaws.com.cn/china-bucket/mykey`)
 * `virtualHostedUrlForObject(key)` - the virtual-hosted style HTTP URL of an object
   within the bucket (i.e. `https://china-bucket-s3.cn-north-1.amazonaws.com.cn/mykey`)
 * `s3UrlForObject(key)` - the S3 URL of an object within the bucket (i.e.
   `s3://bucket/mykey`)

## Encryption

Define a KMS-encrypted bucket:

```ts
const bucket = new s3.Bucket(this, 'MyEncryptedBucket', {
  encryption: s3.BucketEncryption.KMS,
});

// you can access the encryption key:
assert(bucket.encryptionKey instanceof kms.Key);
```

You can also supply your own key:

```ts
const myKmsKey = new kms.Key(this, 'MyKey');

const bucket = new s3.Bucket(this, 'MyEncryptedBucket', {
  encryption: s3.BucketEncryption.KMS,
  encryptionKey: myKmsKey,
});

assert(bucket.encryptionKey === myKmsKey);
```

Enable KMS-SSE encryption via [S3 Bucket Keys](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-key.html):

```ts
const bucket = new s3.Bucket(this, 'MyEncryptedBucket', {
  encryption: s3.BucketEncryption.KMS,
  bucketKeyEnabled: true,
});
```

Use `BucketEncryption.ManagedKms` to use the S3 master KMS key:

```ts
const bucket = new s3.Bucket(this, 'Buck', {
  encryption: s3.BucketEncryption.KMS_MANAGED,
});

assert(bucket.encryptionKey == null);
```

## Permissions

A bucket policy will be automatically created for the bucket upon the first call to
`addToResourcePolicy(statement)`:

```ts
const bucket = new s3.Bucket(this, 'MyBucket');
const result = bucket.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['s3:GetObject'],
  resources: [bucket.arnForObjects('file.txt')],
  principals: [new iam.AccountRootPrincipal()],
}));
```

If you try to add a policy statement to an existing bucket, this method will
not do anything:

```ts
const bucket = s3.Bucket.fromBucketName(this, 'existingBucket', 'bucket-name');

// No policy statement will be added to the resource
const result = bucket.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['s3:GetObject'],
  resources: [bucket.arnForObjects('file.txt')],
  principals: [new iam.AccountRootPrincipal()],
}));
```

That's because it's not possible to tell whether the bucket
already has a policy attached, let alone to re-use that policy to add more
statements to it. We recommend that you always check the result of the call:

```ts
const bucket = new s3.Bucket(this, 'MyBucket');
const result = bucket.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['s3:GetObject'],
  resources: [bucket.arnForObjects('file.txt')],
  principals: [new iam.AccountRootPrincipal()],
}));

if (!result.statementAdded) {
  // Uh-oh! Someone probably made a mistake here.
}
```

The bucket policy can be directly accessed after creation to add statements or
adjust the removal policy.

```ts
const bucket = new s3.Bucket(this, 'MyBucket');
bucket.policy?.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
```

Most of the time, you won't have to manipulate the bucket policy directly.
Instead, buckets have "grant" methods called to give prepackaged sets of permissions
to other resources. For example:

```ts
declare const myLambda: lambda.Function;

const bucket = new s3.Bucket(this, 'MyBucket');
bucket.grantReadWrite(myLambda);
```

Will give the Lambda's execution role permissions to read and write
from the bucket.

## AWS Foundational Security Best Practices

### Enforcing SSL

To require all requests use Secure Socket Layer (SSL):

```ts
const bucket = new s3.Bucket(this, 'Bucket', {
  enforceSSL: true,
});
```

## Sharing buckets between stacks

To use a bucket in a different stack in the same CDK application, pass the object to the other stack:

[sharing bucket between stacks](test/integ.bucket-sharing.lit.ts)

## Importing existing buckets

To import an existing bucket into your CDK application, use the `Bucket.fromBucketAttributes`
factory method. This method accepts `BucketAttributes` which describes the properties of an already
existing bucket:

```ts
declare const myLambda: lambda.Function;
const bucket = s3.Bucket.fromBucketAttributes(this, 'ImportedBucket', {
  bucketArn: 'arn:aws:s3:::my-bucket',
});

// now you can just call methods on the bucket
bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(myLambda), {prefix: 'home/myusername/*'});
```

Alternatively, short-hand factories are available as `Bucket.fromBucketName` and
`Bucket.fromBucketArn`, which will derive all bucket attributes from the bucket
name or ARN respectively:

```ts
const byName = s3.Bucket.fromBucketName(this, 'BucketByName', 'my-bucket');
const byArn  = s3.Bucket.fromBucketArn(this, 'BucketByArn', 'arn:aws:s3:::my-bucket');
```

The bucket's region defaults to the current stack's region, but can also be explicitly set in cases where one of the bucket's
regional properties needs to contain the correct values.

```ts
const myCrossRegionBucket = s3.Bucket.fromBucketAttributes(this, 'CrossRegionImport', {
  bucketArn: 'arn:aws:s3:::my-bucket',
  region: 'us-east-1',
});
// myCrossRegionBucket.bucketRegionalDomainName === 'my-bucket.s3.us-east-1.amazonaws.com'
```

## Bucket Notifications

The Amazon S3 notification feature enables you to receive notifications when
certain events happen in your bucket as described under [S3 Bucket
Notifications] of the S3 Developer Guide.

To subscribe for bucket notifications, use the `bucket.addEventNotification` method. The
`bucket.addObjectCreatedNotification` and `bucket.addObjectRemovedNotification` can also be used for
these common use cases.

The following example will subscribe an SNS topic to be notified of all `s3:ObjectCreated:*` events:

```ts
const bucket = new s3.Bucket(this, 'MyBucket');
const topic = new sns.Topic(this, 'MyTopic');
bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.SnsDestination(topic));
```

This call will also ensure that the topic policy can accept notifications for
this specific bucket.

Supported S3 notification targets are exposed by the `@aws-cdk/aws-s3-notifications` package.

It is also possible to specify S3 object key filters when subscribing. The
following example will notify `myQueue` when objects prefixed with `foo/` and
have the `.jpg` suffix are removed from the bucket.

```ts
declare const myQueue: sqs.Queue;
const bucket = new s3.Bucket(this, 'MyBucket');
bucket.addEventNotification(s3.EventType.OBJECT_REMOVED,
  new s3n.SqsDestination(myQueue),
  { prefix: 'foo/', suffix: '.jpg' });
```

Adding notifications on existing buckets:

```ts
declare const topic: sns.Topic;
const bucket = s3.Bucket.fromBucketAttributes(this, 'ImportedBucket', {
  bucketArn: 'arn:aws:s3:::my-bucket',
});
bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.SnsDestination(topic));
```

When you add an event notification to a bucket, a custom resource is created to 
manage the notifications. By default, a new role is created for the Lambda
function that implements this feature. If you want to use your own role instead,
you should provide it in the `Bucket` constructor:

```ts
declare const myRole: iam.IRole;
const bucket = new s3.Bucket(this, 'MyBucket', {
  notificationsHandlerRole: myRole,
});
```

Whatever role you provide, the CDK will try to modify it by adding the 
permissions from `AWSLambdaBasicExecutionRole` (an AWS managed policy) as well 
as the permissions `s3:PutBucketNotification` and `s3:GetBucketNotification`. 
If you’re passing an imported role, and you don’t want this to happen, configure 
it to be immutable:

```ts
const importedRole = iam.Role.fromRoleArn(this, 'role', 'arn:aws:iam::123456789012:role/RoleName', {
  mutable: false,
});
```

> If you provide an imported immutable role, make sure that it has at least all 
> the permissions mentioned above. Otherwise, the deployment will fail!

[S3 Bucket Notifications]: https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html


### EventBridge notifications

Amazon S3 can send events to Amazon EventBridge whenever certain events happen in your bucket.
Unlike other destinations, you don't need to select which event types you want to deliver.

The following example will enable EventBridge notifications:

```ts
const bucket = new s3.Bucket(this, 'MyEventBridgeBucket', {
  eventBridgeEnabled: true,
});
```

[S3 EventBridge notifications]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventBridge.html

## Block Public Access

Use `blockPublicAccess` to specify [block public access settings] on the bucket.

Enable all block public access settings:

```ts
const bucket = new s3.Bucket(this, 'MyBlockedBucket', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});
```

Block and ignore public ACLs:

```ts
const bucket = new s3.Bucket(this, 'MyBlockedBucket', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
});
```

Alternatively, specify the settings manually:

```ts
const bucket = new s3.Bucket(this, 'MyBlockedBucket', {
  blockPublicAccess: new s3.BlockPublicAccess({ blockPublicPolicy: true }),
});
```

When `blockPublicPolicy` is set to `true`, `grantPublicRead()` throws an error.

[block public access settings]: https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html

## Logging configuration

Use `serverAccessLogsBucket` to describe where server access logs are to be stored.

```ts
const accessLogsBucket = new s3.Bucket(this, 'AccessLogsBucket');

const bucket = new s3.Bucket(this, 'MyBucket', {
  serverAccessLogsBucket: accessLogsBucket,
});
```

It's also possible to specify a prefix for Amazon S3 to assign to all log object keys.

```ts
const accessLogsBucket = new s3.Bucket(this, 'AccessLogsBucket');

const bucket = new s3.Bucket(this, 'MyBucket', {
  serverAccessLogsBucket: accessLogsBucket,
  serverAccessLogsPrefix: 'logs',
});
```

[S3 Server access logging]: https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerLogs.html

## S3 Inventory

An [inventory](https://docs.aws.amazon.com/AmazonS3/latest/dev/storage-inventory.html) contains a list of the objects in the source bucket and metadata for each object. The inventory lists are stored in the destination bucket as a CSV file compressed with GZIP, as an Apache optimized row columnar (ORC) file compressed with ZLIB, or as an Apache Parquet (Parquet) file compressed with Snappy.

You can configure multiple inventory lists for a bucket. You can configure what object metadata to include in the inventory, whether to list all object versions or only current versions, where to store the inventory list file output, and whether to generate the inventory on a daily or weekly basis.

```ts
const inventoryBucket = new s3.Bucket(this, 'InventoryBucket');

const dataBucket = new s3.Bucket(this, 'DataBucket', {
  inventories: [
    {
      frequency: s3.InventoryFrequency.DAILY,
      includeObjectVersions: s3.InventoryObjectVersion.CURRENT,
      destination: {
        bucket: inventoryBucket,
      },
    },
    {
      frequency: s3.InventoryFrequency.WEEKLY,
      includeObjectVersions: s3.InventoryObjectVersion.ALL,
      destination: {
        bucket: inventoryBucket,
        prefix: 'with-all-versions',
      },
    },
  ],
});
```

If the destination bucket is created as part of the same CDK application, the necessary permissions will be automatically added to the bucket policy.
However, if you use an imported bucket (i.e `Bucket.fromXXX()`), you'll have to make sure it contains the following policy document:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "InventoryAndAnalyticsExamplePolicy",
      "Effect": "Allow",
      "Principal": { "Service": "s3.amazonaws.com" },
      "Action": "s3:PutObject",
      "Resource": ["arn:aws:s3:::destinationBucket/*"]
    }
  ]
}
```

## Website redirection

You can use the two following properties to specify the bucket [redirection policy]. Please note that these methods cannot both be applied to the same bucket.

[redirection policy]: https://docs.aws.amazon.com/AmazonS3/latest/dev/how-to-page-redirect.html#advanced-conditional-redirects

### Static redirection

You can statically redirect a to a given Bucket URL or any other host name with `websiteRedirect`:

```ts
const bucket = new s3.Bucket(this, 'MyRedirectedBucket', {
  websiteRedirect: { hostName: 'www.example.com' },
});
```

### Routing rules

Alternatively, you can also define multiple `websiteRoutingRules`, to define complex, conditional redirections:

```ts
const bucket = new s3.Bucket(this, 'MyRedirectedBucket', {
  websiteRoutingRules: [{
    hostName: 'www.example.com',
    httpRedirectCode: '302',
    protocol: s3.RedirectProtocol.HTTPS,
    replaceKey: s3.ReplaceKey.prefixWith('test/'),
    condition: {
      httpErrorCodeReturnedEquals: '200',
      keyPrefixEquals: 'prefix',
    },
  }],
});
```

## Filling the bucket as part of deployment

To put files into a bucket as part of a deployment (for example, to host a
website), see the `@aws-cdk/aws-s3-deployment` package, which provides a
resource that can do just that.

## The URL for objects

S3 provides two types of URLs for accessing objects via HTTP(S). Path-Style and
[Virtual Hosted-Style](https://docs.aws.amazon.com/AmazonS3/latest/dev/VirtualHosting.html)
URL. Path-Style is a classic way and will be
[deprecated](https://aws.amazon.com/jp/blogs/aws/amazon-s3-path-deprecation-plan-the-rest-of-the-story).
We recommend to use Virtual Hosted-Style URL for newly made bucket.

You can generate both of them.

```ts
const bucket = new s3.Bucket(this, 'MyBucket');
bucket.urlForObject('objectname'); // Path-Style URL
bucket.virtualHostedUrlForObject('objectname'); // Virtual Hosted-Style URL
bucket.virtualHostedUrlForObject('objectname', { regional: false }); // Virtual Hosted-Style URL but non-regional
```

## Object Ownership

You can use one of following properties to specify the bucket [object Ownership].

[object Ownership]: https://docs.aws.amazon.com/AmazonS3/latest/dev/about-object-ownership.html

### Object writer

The Uploading account will own the object.

```ts
new s3.Bucket(this, 'MyBucket', {
  objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
});
```

### Bucket owner preferred

The bucket owner will own the object if the object is uploaded with the bucket-owner-full-control canned ACL. Without this setting and canned ACL, the object is uploaded and remains owned by the uploading account.

```ts
new s3.Bucket(this, 'MyBucket', {
  objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
});
```

### Bucket owner enforced (recommended)

ACLs are disabled, and the bucket owner automatically owns and has full control over every object in the bucket. ACLs no longer affect permissions to data in the S3 bucket. The bucket uses policies to define access control.

```ts
new s3.Bucket(this, 'MyBucket', {
  objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
});
```

## Bucket deletion

When a bucket is removed from a stack (or the stack is deleted), the S3
bucket will be removed according to its removal policy (which by default will
simply orphan the bucket and leave it in your AWS account). If the removal
policy is set to `RemovalPolicy.DESTROY`, the bucket will be deleted as long
as it does not contain any objects.

To override this and force all objects to get deleted during bucket deletion,
enable the`autoDeleteObjects` option.

```ts
const bucket = new s3.Bucket(this, 'MyTempFileBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
```

**Warning** if you have deployed a bucket with `autoDeleteObjects: true`,
switching this to `false` in a CDK version *before* `1.126.0` will lead to
all objects in the bucket being deleted. Be sure to update your bucket resources
by deploying with CDK version `1.126.0` or later **before** switching this value to `false`.

## Transfer Acceleration

[Transfer Acceleration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html) can be configured to enable fast, easy, and secure transfers of files over long distances:

```ts
const bucket = new s3.Bucket(this, 'MyBucket', {
  transferAcceleration: true,
});
```

To access the bucket that is enabled for Transfer Acceleration, you must use a special endpoint. The URL can be generated using method `transferAccelerationUrlForObject`:

```ts
const bucket = new s3.Bucket(this, 'MyBucket', {
  transferAcceleration: true,
});
bucket.transferAccelerationUrlForObject('objectname');
```

## Intelligent Tiering

[Intelligent Tiering](https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering.html) can be configured to automatically move files to glacier:

```ts
new s3.Bucket(this, 'MyBucket', {
  intelligentTieringConfigurations: [{
    name: 'foo',
    prefix: 'folder/name',
    archiveAccessTierTime: cdk.Duration.days(90),
    deepArchiveAccessTierTime: cdk.Duration.days(180),
    tags: [{key: 'tagname', value: 'tagvalue'}]
  }],
});

```

## Lifecycle Rule

[Managing lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) can be configured transition or expiration actions.

```ts
const bucket = new s3.Bucket(this, 'MyBucket', {
  lifecycleRules: [{
    abortIncompleteMultipartUploadAfter: cdk.Duration.minutes(30),
    enabled: false,
    expiration: cdk.Duration.days(30),
    expirationDate: new Date(),
    expiredObjectDeleteMarker: false,
    id: 'id',
    noncurrentVersionExpiration: cdk.Duration.days(30),

    // the properties below are optional
    noncurrentVersionsToRetain: 123,
    noncurrentVersionTransitions: [{
      storageClass: s3.StorageClass.GLACIER,
      transitionAfter: cdk.Duration.days(30),

      // the properties below are optional
      noncurrentVersionsToRetain: 123,
    }],
    objectSizeGreaterThan: 500, 
    prefix: 'prefix',
    objectSizeLessThan: 10000, 
    transitions: [{
      storageClass: s3.StorageClass.GLACIER,

      // the properties below are optional
      transitionAfter: cdk.Duration.days(30),
      transitionDate: new Date(),
    }],
  }]
});
```
