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
    .addAllResources());
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
const sourceStage = pipeline.addStage('Source');
const sourceAction = new s3.PipelineSourceAction(this, 'S3Source', {
    stage: sourceStage,
    bucket: sourceBucket,
    bucketKey: 'path/to/file.zip',
});
```

You can also add the Bucket to the Pipeline directly:

```ts
// equivalent to the code above:
const sourceAction = sourceBucket.addToPipeline(sourceStage, 'S3Source', {
    bucketKey: 'path/to/file.zip',
});
```

### Importing and Exporting Buckets

You can create a `Bucket` construct that represents an external/existing/unowned bucket by using the `Bucket.import` factory method.

This method accepts an object that adheres to `BucketRef` which basically include tokens to bucket's attributes.

This means that you can define a `BucketRef` using token literals:

```ts
const bucket = Bucket.import(this, {
    bucketArn: new BucketArn('arn:aws:s3:::my-bucket')
});

// now you can just call methods on the bucket
bucket.grantReadWrite(user);
```

The `bucket.export()` method can be used to "export" the bucket from the current stack. It returns a `BucketRef` object that can later be used in a call to `Bucket.import` in another stack.

Here's an example.

Let's define a stack with an S3 bucket and export it using `bucket.export()`.

```ts
class Producer extends Stack {
    public readonly myBucketRef: BucketRef;

    constructor(parent: App, name: string) {
        super(parent, name);

        const bucket = new Bucket(this, 'MyBucket');
        this.myBucketRef = bucket.export();
    }
}
```

Now let's define a stack that requires a BucketRef as an input and uses
`Bucket.import` to create a `Bucket` object that represents this external
bucket. Grant a user principal created within this consuming stack read/write
permissions to this bucket and contents.

```ts
interface ConsumerProps {
    public userBucketRef: BucketRef;
}

class Consumer extends Stack {
    constructor(parent: App, name: string, props: ConsumerProps) {
        super(parent, name);

        const user = new User(this, 'MyUser');
        const userBucket = Bucket.import(this, props.userBucketRef);
        userBucket.grantReadWrite(user);
    }
}
```

Now, let's define our CDK app to bind these together:

```ts
const app = new App();

const producer = new Producer(app, 'produce');

new Consumer(app, 'consume', {
    userBucketRef: producer.myBucketRef
});

app.run();
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
