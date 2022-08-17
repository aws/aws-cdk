import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as s3deploy from '../lib';

class TestBucketDeployment extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const destinationBucket = new s3.Bucket(this, 'Destination', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    new s3deploy.BucketDeployment(this, 'DeployMe', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });

    new s3deploy.BucketDeployment(this, 'DeployMeWithEfsStorage', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      destinationKeyPrefix: 'efs/',
      useEfs: true,
      vpc: new ec2.Vpc(this, 'InlineVpc'),
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });

    const bucket2 = new s3.Bucket(this, 'Destination2', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    new s3deploy.BucketDeployment(this, 'DeployWithPrefix', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket2,
      destinationKeyPrefix: 'deploy/here/',
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });

    const bucket3 = new s3.Bucket(this, 'Destination3', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    new s3deploy.BucketDeployment(this, 'DeployWithMetadata', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket3,
      retainOnDelete: false, // default is true, which will block the integration test cleanup
      cacheControl: [s3deploy.CacheControl.setPublic(), s3deploy.CacheControl.maxAge(cdk.Duration.minutes(1))],
      contentType: 'text/html',
      metadata: { A: 'aaa', B: 'bbb', C: 'ccc' },
    });

    new s3deploy.BucketDeployment(this, 'DeployMeWithoutDeletingFilesOnDestination', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      prune: false,
      retainOnDelete: false,
    });

    new s3deploy.BucketDeployment(this, 'DeployMeWithExcludedFilesOnDestination', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      exclude: ['*.gif'],
      retainOnDelete: false,
    });

  }
}

const app = new cdk.App();
const testCase = new TestBucketDeployment(app, 'test-bucket-deployments-2');
new integ.IntegTest(app, 'integ-test-bucket-deployments', {
  testCases: [testCase],
});

app.synth();
