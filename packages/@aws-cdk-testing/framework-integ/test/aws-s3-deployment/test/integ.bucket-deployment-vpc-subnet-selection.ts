import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

class TestBucketDeploymentVpcSubnetSelection extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC with specific subnets
    const vpc = new ec2.Vpc(this, 'SubnetVpc', {
      restrictDefaultSecurityGroup: false,
    });

    const bucket = new s3.Bucket(this, 'Destination', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3deploy.BucketDeployment(this, 'DeployWithVpcAndSubnets', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
      destinationKeyPrefix: 'subnet-vpc/',
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      retainOnDelete: false,
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const testCase = new TestBucketDeploymentVpcSubnetSelection(app, 'test-bucket-deployment-vpc-subnet-selection');

new integ.IntegTest(app, 'integ-test-bucket-deployment-vpc-subnet-selection', {
  testCases: [testCase],
  diffAssets: false,
});

app.synth();
