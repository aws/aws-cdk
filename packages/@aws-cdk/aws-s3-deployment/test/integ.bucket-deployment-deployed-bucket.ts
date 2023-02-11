import * as path from 'path';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as s3deploy from '../lib';

class TestBucketDeployment extends cdk.Stack {
  public readonly bucket: s3.IBucket;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'Destination', {
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    const deploy = new s3deploy.BucketDeployment(this, 'DeployMe5', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website-second'))],
      destinationBucket: this.bucket,
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });

    this.exportValue(deploy.deployedBucket.bucketWebsiteUrl, {
      name: 'WebsiteUrl',
    });
  }
}

const app = new cdk.App();
const testCase = new TestBucketDeployment(app, 'test-bucket-deployment-deployed-bucket');


new integ.IntegTest(app, 'integ-test-bucket-deployments', {
  testCases: [testCase],
});

app.synth();
