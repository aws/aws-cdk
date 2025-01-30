import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

class TestBucketDeploymentSecurityGroupsMultiple extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC inline instead of looking it up
    const vpc = new ec2.Vpc(this, 'TestVpc', {
      restrictDefaultSecurityGroup: false,
    });

    // Create security groups with different configurations
    const sg1 = new ec2.SecurityGroup(this, 'SecurityGroup1', {
      vpc,
      description: 'Security group 1 - allow all outbound',
      allowAllOutbound: true,
    });

    const sg2 = new ec2.SecurityGroup(this, 'SecurityGroup2', {
      vpc,
      description: 'Security group 2 - restrictive outbound',
      allowAllOutbound: false,
    });

    // Allow HTTPS outbound for S3 access
    sg2.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS outbound for S3 access',
    );

    const destinationBucket = new s3.Bucket(this, 'Destination', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    // Test deployment with multiple security groups
    new s3deploy.BucketDeployment(this, 'DeployWithMultipleSecurityGroups', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      destinationKeyPrefix: 'multiple-sg/',
      vpc,
      securityGroups: [sg1, sg2],
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });
  }
}

const app = new cdk.App();
const testCase = new TestBucketDeploymentSecurityGroupsMultiple(app, 'test-bucket-deployment-multiple-security-groups');

new integ.IntegTest(app, 'integ-test-bucket-deployment-multiple-security-groups', {
  testCases: [testCase],
  diffAssets: false,
});

app.synth();
