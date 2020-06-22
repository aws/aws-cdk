## Amazon S3 Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---
<!--END STABILITY BANNER-->

Define an unencrypted S3 bucket.

```ts
new Bucket(this, 'MyFirstBucket');
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
 * `s3UrlForObject(key)` - the S3 URL of an object within the bucket (i.e.
   `s3://bucket/mykey`)

### Encryption

Define a KMS-encrypted bucket:

```ts
const bucket = new Bucket(this, 'MyUnencryptedBucket', {
    encryption: BucketEncryption.KMS
});

// you can access the encryption key:
assert(bucket.encryptionKey instanceof kms.Key);
```

You can also supply your own key:

```ts
const myKmsKey = new kms.Key(this, 'MyKey');

const bucket = new Bucket(this, 'MyEncryptedBucket', {
    encryption: BucketEncryption.KMS,
    encryptionKey: myKmsKey
});

assert(bucket.encryptionKey === myKmsKey);
```

Use `BucketEncryption.ManagedKms` to use the S3 master KMS key:

```ts
const bucket = new Bucket(this, 'Buck', {
    encryption: BucketEncryption.KMS_MANAGED
});

assert(bucket.encryptionKey == null);
```

### Permissions

A bucket policy will be automatically created for the bucket upon the first call to
`addToResourcePolicy(statement)`:

```ts
const bucket = new Bucket(this, 'MyBucket');
bucket.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['s3:GetObject'],
  resources: [bucket.arnForObjects('file.txt')],
  principals: [new iam.AccountRootPrincipal()],
}));
```

The bucket policy can be directly accessed after creation to add statements or
adjust the removal policy.

```ts
bucket.policy?.applyRemovalPolicy(RemovalPolicy.RETAIN);
```

Most of the time, you won't have to manipulate the bucket policy directly.
Instead, buckets have "grant" methods called to give prepackaged sets of permissions
to other resources. For example:

```ts
const lambda = new lambda.Function(this, 'Lambda', { /* ... */ });

const bucket = new Bucket(this, 'MyBucket');
bucket.grantReadWrite(lambda);
```

Will give the Lambda's execution role permissions to read and write
from the bucket.

### Sharing buckets between stacks

To use a bucket in a different stack in the same CDK application, pass the object to the other stack:

[sharing bucket between stacks](test/integ.bucket-sharing.lit.ts)

### Importing existing buckets

To import an existing bucket into your CDK application, use the `Bucket.fromBucketAttributes`
factory method. This method accepts `BucketAttributes` which describes the properties of an already
existing bucket:

```ts
const bucket = Bucket.fromBucketAttributes(this, 'ImportedBucket', {
    bucketArn: 'arn:aws:s3:::my-bucket'
});

// now you can just call methods on the bucket
bucket.grantReadWrite(user);
```

Alternatively, short-hand factories are available as `Bucket.fromBucketName` and
`Bucket.fromBucketArn`, which will derive all bucket attributes from the bucket
name or ARN respectively:

```ts
const byName = Bucket.fromBucketName(this, 'BucketByName', 'my-bucket');
const byArn  = Bucket.fromBucketArn(this, 'BucketByArn', 'arn:aws:s3:::my-bucket');
```

### Bucket Notifications

The Amazon S3 notification feature enables you to receive notifications when
certain events happen in your bucket as described under [S3 Bucket
Notifications] of the S3 Developer Guide.

To subscribe for bucket notifications, use the `bucket.addEventNotification` method. The
`bucket.addObjectCreatedNotification` and `bucket.addObjectRemovedNotification` can also be used for
these common use cases.

The following example will subscribe an SNS topic to be notified of all `s3:ObjectCreated:*` events:

```ts
import * as s3n from '@aws-cdk/aws-s3-notifications';

const myTopic = new sns.Topic(this, 'MyTopic');
bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.SnsDestination(topic));
```

This call will also ensure that the topic policy can accept notifications for
this specific bucket.

Supported S3 notification targets are exposed by the `@aws-cdk/aws-s3-notifications` package.

It is also possible to specify S3 object key filters when subscribing. The
following example will notify `myQueue` when objects prefixed with `foo/` and
have the `.jpg` suffix are removed from the bucket.

```ts
bucket.addEventNotification(s3.EventType.OBJECT_REMOVED,
  new s3n.SqsDestination(myQueue),
  { prefix: 'foo/', suffix: '.jpg' });
```

[S3 Bucket Notifications]: https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html


### Block Public Access

Use `blockPublicAccess` to specify [block public access settings] on the bucket.

Enable all block public access settings:
```ts
const bucket = new Bucket(this, 'MyBlockedBucket', {
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL
});
```

Block and ignore public ACLs:
```ts
const bucket = new Bucket(this, 'MyBlockedBucket', {
    blockPublicAccess: BlockPublicAccess.BLOCK_ACLS
});
```

Alternatively, specify the settings manually:
```ts
const bucket = new Bucket(this, 'MyBlockedBucket', {
    blockPublicAccess: new BlockPublicAccess({ blockPublicPolicy: true })
});
```

When `blockPublicPolicy` is set to `true`, `grantPublicRead()` throws an error.

[block public access settings]: https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html

### Logging configuration

Use `serverAccessLogsBucket` to describe where server access logs are to be stored.

```ts
const accessLogsBucket = new Bucket(this, 'AccessLogsBucket');

const bucket = new Bucket(this, 'MyBucket', {
  serverAccessLogsBucket: accessLogsBucket,
});
```

It's also possible to specify a prefix for Amazon S3 to assign to all log object keys.

```ts
const bucket = new Bucket(this, 'MyBucket', {
  serverAccessLogsBucket: accessLogsBucket,
  serverAccessLogsPrefix: 'logs'
});
```

[S3 Server access logging]: https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerLogs.html

### Website redirection

You can use the two following properties to specify the bucket [redirection policy]. Please note that these methods cannot both be applied to the same bucket.

[redirection policy]: https://docs.aws.amazon.com/AmazonS3/latest/dev/how-to-page-redirect.html#advanced-conditional-redirects

#### Static redirection

You can statically redirect a to a given Bucket URL or any other host name with `websiteRedirect`:

```ts
const bucket = new Bucket(this, 'MyRedirectedBucket', {
    websiteRedirect: { hostName: 'www.example.com' }
});
```

#### Routing rules

Alternatively, you can also define multiple `websiteRoutingRules`, to define complex, conditional redirections:

```ts
const bucket = new Bucket(this, 'MyRedirectedBucket', {
  websiteRoutingRules: [{
    hostName: 'www.example.com',
    httpRedirectCode: '302',
    protocol: RedirectProtocol.HTTPS,
    replaceKey: ReplaceKey.prefixWith('test/'),
    condition: {
      httpErrorCodeReturnedEquals: '200',
      keyPrefixEquals: 'prefix',
    }
  }]
});
```

### Filling the bucket as part of deployment

To put files into a bucket as part of a deployment (for example, to host a
website), see the `@aws-cdk/aws-s3-deployment` package, which provides a
resource that can do just that.
