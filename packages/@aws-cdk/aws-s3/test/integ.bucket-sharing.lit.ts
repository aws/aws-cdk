import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import s3 = require('../lib');

const app = new cdk.App();

/// !show

/**
 * Stack that defines the bucket
 */
class Producer extends cdk.Stack {
    public readonly myBucket: s3.Bucket;

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const bucket = new s3.Bucket(this, 'MyBucket', {
          removalPolicy: cdk.RemovalPolicy.Destroy
        });
        this.myBucket = bucket;
    }
}

interface ConsumerProps extends cdk.StackProps {
    userBucket: s3.IBucket;
}

/**
 * Stack that consumes the bucket
 */
class Consumer extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props: ConsumerProps) {
        super(scope, id, props);

        const user = new iam.User(this, 'MyUser');
        props.userBucket.grantReadWrite(user);
    }
}

const producer = new Producer(app, 'ProducerStack');
new Consumer(app, 'ConsumerStack', { userBucket: producer.myBucket });
/// !hide

app.run();