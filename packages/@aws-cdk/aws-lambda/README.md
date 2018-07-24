## AWS Lambda Construct Library

```ts
const fn = new Lambda(this, 'MyFunction', {
    runtime: LambdaRuntime.DOTNETCORE_2,
    code: new LambdaS3Code(bucket, 'myKey'),
    handler: 'index.handler'
});

fn.role.addToPolicy(new PolicyStatement()....);
```

### Inline node.js Lambda Functions

The subclass called `LambdaInlineNodeJS` allows embedding the function's handler
as a JavaScript function within the construct code.

The following example defines a node.js Lambda and an S3 bucket. When invoked,
a file named "myfile.txt" will be uploaded to the bucket with the string "hello, world".

A few things to note:

 - The function's execution role is granted read/write permissions on the
   bucket.
 - The require statement for `aws-sdk` is invoked within the function's body. Due to
   node.js' module caching, this is equivalent in performance to requiring
   outside.
 - The bucket name is passed to the function via the environment variable
   `BUCKET_NAME`.

```ts
const bucket = new Bucket(this, 'MyBucket');

const lambda = new InlineJavaScriptLambda(this, 'MyLambda', {
    environment: {
        BUCKET_NAME: bucket.bucketName
    },
    handler: {
        fn: (_event: any, _context: any, callback: any) => {
            const S3 = require('aws-sdk').S3;
            const s3 = new S3();
            const bucketName = process.env.BUCKET_NAME;
            s3.upload({ Bucket: bucketName, Key: 'myfile.txt', Body: 'Hello, world' }, (err, data) => {
                if (err) {
                    return callback(err);
                }
                console.log(data);
                return callback();
            });
        }
    }
});

bucket.grantReadWrite(lambda.role);
```
