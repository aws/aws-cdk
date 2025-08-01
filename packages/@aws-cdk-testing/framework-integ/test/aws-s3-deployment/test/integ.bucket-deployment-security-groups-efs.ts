import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

class TestBucketDeploymentSecurityGroupsEfs extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC inline instead of looking it up
    const vpc = new ec2.Vpc(this, 'TestVpc', {
      restrictDefaultSecurityGroup: false,
    });

    // Create security group with allow all outbound
    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      description: 'Security group - allow all outbound',
      allowAllOutbound: true,
    });

    const destinationBucket = new s3.Bucket(this, 'Destination', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    // Test deployment with EFS storage and security groups
    new s3deploy.BucketDeployment(this, 'DeployWithEfsAndSecurityGroups', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      destinationKeyPrefix: 'efs-sg/',
      useEfs: true,
      vpc,
      securityGroups: [securityGroup],
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });
  }
}

const app = new cdk.App();
const testCase = new TestBucketDeploymentSecurityGroupsEfs(app, 'test-bucket-deployment-efs-security-groups');

new integ.IntegTest(app, 'integ-test-bucket-deployment-efs-security-groups', {
  testCases: [testCase],
  diffAssets: false,
});

app.synth();
