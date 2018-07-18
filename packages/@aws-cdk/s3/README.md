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

### Bucket Policy

By default, a bucket policy will be automatically created for the bucket upon the first call to `addToPolicy(statement)`:

```ts
const bucket = new Bucket(this, 'MyBucket');
bucket.addToPolicy(statement);

// we now have a policy!
```

You can bring you own policy as well:

```ts
const policy = new BucketPolicy(this, 'MyBucketPolicy');
const bucket = new Bucket(this, 'MyBucket', { policy });
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
const app = new App(process.argv);

const producer = new Producer(app, 'produce');

new Consumer(app, 'consume', {
    userBucketRef: producer.myBucketRef
});

process.stdout.write(app.run());
```
