import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as s3 from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new cdk.CfnOutput(this, 'BucketURL', { value: bucket.bucketWebsiteUrl });
    new cdk.CfnOutput(this, 'ObjectURL', { value: bucket.urlForObject('myfolder/myfile.txt') });
    new cdk.CfnOutput(this, 'VirtualHostedObjectURL', { value: bucket.virtualHostedUrlForObject('myfolder/myfile.txt') });
    new cdk.CfnOutput(this, 'VirtualHostedObjectURLNonRegional', { value: bucket.virtualHostedUrlForObject('myfolder/myfile.txt', { regional: false }) });
    new cdk.CfnOutput(this, 'S3ObjectURL', { value: bucket.s3UrlForObject('myfolder/myfile.txt') });
  }
}

const app = new cdk.App();

new IntegTest(app, 'cdk-integ-s3-urls', {
  testCases: [new TestStack(app, 'aws-cdk-s3-urls')],
});