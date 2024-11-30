import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

/**
 * Stack that defines the bucket
 */
class Producer extends cdk.Stack {
  public readonly myBucket: s3.Bucket;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
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

new IntegTest(app, 'cdk-integ-bucket-sharing', {
  testCases: [new Consumer(app, 'ConsumerStack', { userBucket: producer.myBucket })],
});
