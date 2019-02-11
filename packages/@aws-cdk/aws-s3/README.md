## AWS S3 Construct Library

Define an unencrypted S3 bucket.

```ts
new Bucket(this, 'MyFirstBucket');
```

`Bucket` constructs expose the following deploy-time attributes:

 * `bucketArn` - the ARN of the bucket (i.e. `arn:aws:s3:::bucket_name`)
 * `bucketName` - the name of the bucket (i.e. `bucket_name`)
 * `bucketUrl` - the URL of the bucket (i.e.
   `https://s3.us-west-1.amazonaws.com/onlybucket`)
 * `arnForObjects(...pattern)` - the ARN of an object or objects within the
   bucket (i.e.
   `arn:aws:s3:::my_corporate_bucket/exampleobject.png` or
   `arn:aws:s3:::my_corporate_bucket/Development/*`)
 * `urlForObject(key)` - the URL of an object within the bucket (i.e.
   `https://s3.cn-north-1.amazonaws.com.cn/china-bucket/mykey`)

### Encryption

Define a KMS-encrypted bucket:

```ts
const bucket = new Bucket(this, 'MyUnencryptedBucket', {
    encryption: BucketEncryption.Kms
});

// you can access the encryption key:
assert(bucket.encryptionKey instanceof kms.EncryptionKey);
```

You can also supply your own key:

```ts
const myKmsKey = new kms.EncryptionKey(this, 'MyKey');

const bucket = new Bucket(this, 'MyEncryptedBucket', {
    encryption: BucketEncryption.Kms,
    encryptionKey: myKmsKey
});

assert(bucket.encryptionKey === myKmsKey);
```

Use `BucketEncryption.ManagedKms` to use the S3 master KMS key:

```ts
const bucket = new Bucket(this, 'Buck', {
    encryption: BucketEncryption.ManagedKms
});

assert(bucket.encryptionKey == null);
```

### Permissions

A bucket policy will be automatically created for the bucket upon the first call to
`addToResourcePolicy(statement)`:

```ts
const bucket = new Bucket(this, 'MyBucket');
bucket.addToResourcePolicy(new iam.PolicyStatement()
  .addActions('s3:GetObject')
  .addResources(bucket.arnForObjects('file.txt'))
  .addAccountRootPrincipal());
```

Most of the time, you won't have to manipulate the bucket policy directly.
Instead, buckets have "grant" methods called to give prepackaged sets of permissions
to other resources. For example:

```ts
const lambda = new lambda.Function(this, 'Lambda', { /* ... */ });

const bucket = new Bucket(this, 'MyBucket');
bucket.grantReadWrite(lambda.role);
```

Will give the Lambda's execution role permissions to read and write
from the bucket.

### Buckets as sources in CodePipeline

This package also defines an Action that allows you to use a
Bucket as a source in CodePipeline:

```ts
import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');

const sourceBucket = new s3.Bucket(this, 'MyBucket', {
  versioned: true, // a Bucket used as a source in CodePipeline must be versioned
});

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const sourceAction = new s3.PipelineSourceAction({
  actionName: 'S3Source',
  bucket: sourceBucket,
  bucketKey: 'path/to/file.zip',
});
pipeline.addStage({
  name: 'Source',
  actions: [sourceAction],
});
```

You can also create the action from the Bucket directly:

```ts
// equivalent to the code above:
const sourceAction = sourceBucket.toCodePipelineSourceAction({
  actionName: 'S3Source',
  bucketKey: 'path/to/file.zip',
});
```

By default, the Pipeline will poll the Bucket to detect changes.
You can change that behavior to use CloudWatch Events by setting the `pollForSourceChanges`
property to `false` (it's `true` by default).
If you do that, make sure the source Bucket is part of an AWS CloudTrail Trail -
otherwise, the CloudWatch Events will not be emitted,
and your Pipeline will not react to changes in the Bucket.
You can do it through the CDK:

```typescript
import cloudtrail = require('@aws-cdk/aws-cloudtrail');

const key = 'some/key.zip';
const trail = new cloudtrail.CloudTrail(this, 'CloudTrail');
trail.addS3EventSelector([sourceBucket.arnForObjects(key)], cloudtrail.ReadWriteType.WriteOnly);
const sourceAction = sourceBucket.toCodePipelineSourceAction({
  actionName: 'S3Source',
  bucketKey: key,
  pollForSourceChanges: false, // default: true
});
```

### Buckets as deploy targets in CodePipeline

This package also defines an Action that allows you to use a
Bucket as a deployment target in CodePipeline:

```ts
import codepipeline = require('@aws-cdk/aws-codepipeline');
import s3 = require('@aws-cdk/aws-s3');

const targetBucket = new s3.Bucket(this, 'MyBucket', {});

const pipeline = new codepipeline.Pipeline(this, 'MyPipeline');
const deployAction = new s3.PipelineDeployAction({
  actionName: 'S3Deploy',
  stage: deployStage,
  bucket: targetBucket,
  inputArtifact: sourceAction.outputArtifact,
});
const deployStage = pipeline.addStage({
  name: 'Deploy',
  actions: [deployAction],
});
```

You can also create the action from the Bucket directly:

```ts
// equivalent to the code above:
const deployAction = targetBucket.toCodePipelineDeployAction({
  actionName: 'S3Deploy',
  extract: false, // default: true
  objectKey: 'path/in/bucket', // required if extract is false
  inputArtifact: sourceAction.outputArtifact,
});
```

### Sharing buckets between stacks

To use a bucket in a different stack in the same CDK application, pass the object to the other stack:

[sharing bucket between stacks](test/integ.bucket-sharing.lit.ts)

### Importing existing buckets

To import an existing bucket into your CDK application, use the `Bucket.import` factory method.  This method accepts a
`BucketImportProps` which describes the properties of the already existing bucket:

```ts
const bucket = Bucket.import(this, {
    bucketArn: 'arn:aws:s3:::my-bucket'
});

// now you can just call methods on the bucket
bucket.grantReadWrite(user);
```

### Bucket Notifications

The Amazon S3 notification feature enables you to receive notifications when
certain events happen in your bucket as described under [S3 Bucket
Notifications] of the S3 Developer Guide.

To subscribe for bucket notifications, use the `bucket.onEvent` method. The
`bucket.onObjectCreated` and `bucket.onObjectRemoved` can also be used for these
common use cases.

The following example will subscribe an SNS topic to be notified of all
``s3:ObjectCreated:*` events:

```ts
const myTopic = new sns.Topic(this, 'MyTopic');
bucket.onEvent(s3.EventType.ObjectCreated, myTopic);
```

This call will also ensure that the topic policy can accept notifications for
this specific bucket.

The following destinations are currently supported:

 * `sns.Topic`
 * `sqs.Queue`
 * `lambda.Function`

It is also possible to specify S3 object key filters when subscribing. The
following example will notify `myQueue` when objects prefixed with `foo/` and
have the `.jpg` suffix are removed from the bucket.

```ts
bucket.onEvent(s3.EventType.ObjectRemoved, myQueue, { prefix: 'foo/', suffix: '.jpg' });
```

[S3 Bucket Notifications]: https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html


### Block Public Access

Use `blockPublicAccess` to specify [block public access settings] on the bucket.

Enable all block public access settings:
```ts
const bucket = new Bucket(this, 'MyBlockedBucket', {
    blockPublicAccess: BlockPublicAccess.BlockAll
});
```

Block and ignore public ACLs:
```ts
const bucket = new Bucket(this, 'MyBlockedBucket', {
    blockPublicAccess: BlockPublicAccess.BlockAcls
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
