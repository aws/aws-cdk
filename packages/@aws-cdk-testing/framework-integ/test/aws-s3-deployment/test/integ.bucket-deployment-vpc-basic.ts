import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

class TestBucketDeploymentVpcBasic extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Basic VPC with default settings
    const vpc = new ec2.Vpc(this, 'BasicVpc', {
      restrictDefaultSecurityGroup: false,
    });

    const bucket = new s3.Bucket(this, 'Destination', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3deploy.BucketDeployment(this, 'DeployWithBasicVpc', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
      destinationKeyPrefix: 'basic-vpc/',
      vpc: vpc,
      retainOnDelete: false,
    });
  }
}

const app = new cdk.App();
const testCase = new TestBucketDeploymentVpcBasic(app, 'test-bucket-deployment-vpc-basic');

new integ.IntegTest(app, 'integ-test-bucket-deployment-vpc-basic', {
  testCases: [testCase],
  diffAssets: false,
});

app.synth();
