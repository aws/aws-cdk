import { App, Construct, PolicyStatement, Stack } from "aws-cdk";
import { User } from "aws-cdk-iam";
import { Bucket, BucketRef, BucketRefProps } from "aws-cdk-s3";

// Define a stack with an S3 bucket and export it using `bucket.export()`.
// bucket.export returns a `BucketRef` object which can later be used in
// `Bucket.import`.

class Producer extends Stack {
    public readonly myBucketRef: BucketRefProps;

    constructor(parent: App, name: string) {
        super(parent, name);

        const bucket = new Bucket(this, 'MyBucket');
        this.myBucketRef = bucket.export();
    }
}

interface ConsumerConstructProps {
    bucket: BucketRef;
}

class ConsumerConstruct extends Construct {
    constructor(parent: Construct, name: string, props: ConsumerConstructProps) {
        super(parent, name);

        props.bucket.addToResourcePolicy(new PolicyStatement().addAction('*'));
    }
}

// Define a stack that requires a BucketRef as an input and uses `Bucket.import`
// to create a `Bucket` object that represents this external bucket. Grant a
// user principal created within this consuming stack read/write permissions to
// this bucket and contents.

interface ConsumerProps {
    userBucketRef: BucketRefProps;
}

class Consumer extends Stack {
    constructor(parent: App, name: string, props: ConsumerProps) {
        super(parent, name);

        const user = new User(this, 'MyUser');
        const userBucket = Bucket.import(this, 'ImportBucket', props.userBucketRef);

        new ConsumerConstruct(this, 'SomeConstruct', { bucket: userBucket });

        userBucket.grantReadWrite(user);
    }
}

// -------------------------------------------------------
// NOTE: To deploy this, just run `cdk -a "node file.js" deploy`. The stacks
// will be deployed IN-ORDER which means that the producer will be deployed
// first. In the future the toolkit will be able to understand the relationships
// between the stacks and will deploy them in order.

const app = new App(process.argv);

const producer = new Producer(app, 'produce');

new Consumer(app, 'consume', {
    userBucketRef: producer.myBucketRef
});

process.stdout.write(app.run());