import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

class TestBucketDeploymentVpcCustomSubnets extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC with custom subnet configuration
    const vpc = new ec2.Vpc(this, 'CustomVpc', {
      restrictDefaultSecurityGroup: false,
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    const bucket = new s3.Bucket(this, 'Destination', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3deploy.BucketDeployment(this, 'DeployWithCustomVpc', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
      destinationKeyPrefix: 'custom-vpc/',
      vpc: vpc,
      retainOnDelete: false,
    });
  }
}

const app = new cdk.App();
const testCase = new TestBucketDeploymentVpcCustomSubnets(app, 'test-bucket-deployment-vpc-custom-subnets');

new integ.IntegTest(app, 'integ-test-bucket-deployment-vpc-custom-subnets', {
  testCases: [testCase],
  diffAssets: false,
});

app.synth();
