import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const bucket2 = s3.Bucket.fromBucketAttributes(this, 'MyBucket2', {
      bucketArn: 'arn:aws:s3:::my-bucket-test',
    });

    new cdk.CfnOutput(this, 'RealBucketDomain', { value: bucket.bucketDomainName });
    new cdk.CfnOutput(this, 'ImportedBucketDomain', { value: bucket2.bucketDomainName });
  }
}

const app = new cdk.App();

new IntegTest(app, 'cdk-integ-bucket-domain-name', {
  testCases: [new TestStack(app, 'aws-cdk-domain-name')],
});
