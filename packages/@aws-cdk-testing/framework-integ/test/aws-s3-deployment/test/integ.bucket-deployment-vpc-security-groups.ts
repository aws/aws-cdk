import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

class TestBucketDeploymentVpcSecurityGroups extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC with specific security groups
    const vpc = new ec2.Vpc(this, 'SgVpc', {
      restrictDefaultSecurityGroup: false,
    });

    const securityGroup = new ec2.SecurityGroup(this, 'CustomSecurityGroup', {
      vpc: vpc,
      description: 'Custom security group for bucket deployment',
      allowAllOutbound: true,
    });

    const bucket = new s3.Bucket(this, 'Destination', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3deploy.BucketDeployment(this, 'DeployWithVpcAndSecurityGroup', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
      destinationKeyPrefix: 'sg-vpc/',
      vpc: vpc,
      securityGroups: [securityGroup],
      retainOnDelete: false,
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const testCase = new TestBucketDeploymentVpcSecurityGroups(app, 'test-bucket-deployment-vpc-security-groups');

new integ.IntegTest(app, 'integ-test-bucket-deployment-vpc-security-groups', {
  testCases: [testCase],
  diffAssets: false,
});

app.synth();
