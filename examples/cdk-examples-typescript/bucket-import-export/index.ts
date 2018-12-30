import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');

// Define a stack with an S3 bucket and export it using `bucket.export()`.
// bucket.export returns an `IBucket` object which can later be used in
// `Bucket.import`.

class Producer extends cdk.Stack {
  public readonly myBucketRef: s3.BucketImportProps;

  constructor(scope: cdk.App, scid: string) {
    super(scope, scid);

    const bucket = new s3.Bucket(this, 'MyBucket');
    this.myBucketRef = bucket.export();
  }
}

interface ConsumerConstructProps {
  bucket: s3.IBucket;
}

class ConsumerConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, scid: string, props: ConsumerConstructProps) {
    super(scope, scid);

    props.bucket.addToResourcePolicy(new iam.PolicyStatement().addAction('*'));
  }
}

// Define a stack that requires an IBucket as an input and uses `Bucket.import`
// to create a `Bucket` object that represents this external bucket. Grant a
// user principal created within this consuming stack read/write permissions to
// this bucket and contents.

interface ConsumerProps {
  userBucketRef: s3.BucketImportProps;
}

class Consumer extends cdk.Stack {
  constructor(scope: cdk.App, scid: string, props: ConsumerProps) {
    super(scope, scid);

    const user = new iam.User(this, 'MyUser');
    const userBucket = s3.Bucket.import(this, 'ImportBucket', props.userBucketRef);

    new ConsumerConstruct(this, 'SomeConstruct', { bucket: userBucket });

    userBucket.grantReadWrite(user);
  }
}

// -------------------------------------------------------
// NOTE: To deploy this, just run `cdk -a "node file.js" deploy`. The stacks
// will be deployed IN-ORDER which means that the producer will be deployed
// first. In the future the toolkit will be able to understand the relationships
// between the stacks and will deploy them in order.

const app = new cdk.App();

const producer = new Producer(app, 'produce');

new Consumer(app, 'consume', {
  userBucketRef: producer.myBucketRef
});

app.run();
