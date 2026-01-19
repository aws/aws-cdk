/// !cdk-integ * pragma:enable-lookups
import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

/**
 * Integration test for bucket deployment with single security group:
 * - Lambda function runs in VPC with a single custom security group
 * - Tests that explicit security group assignment works correctly
 */
class TestBucketDeploymentSecurityGroupSingle extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props,
    });

    // Create a VPC inline
    // Use isolated subnets with S3 VPC endpoint - no NAT Gateway or Elastic IP needed
    const vpc = new ec2.Vpc(this, 'TestVpc', {
      restrictDefaultSecurityGroup: false,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Add S3 Gateway endpoint so Lambda can access S3 without NAT Gateway
    vpc.addGatewayEndpoint('S3Endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });

    // Create security group with explicit outbound rules for S3 access
    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup1', {
      vpc,
    });

    const destinationBucket = new s3.Bucket(this, 'Destination', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Test deployment with single security group
    new s3deploy.BucketDeployment(this, 'DeployWithSingleSecurityGroup', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      destinationKeyPrefix: 'single-sg/',
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

const testCase = new TestBucketDeploymentSecurityGroupSingle(app, 'test-bucket-deployment-security-groups-single');

new integ.IntegTest(app, 'integ-test-bucket-deployment-security-groups-single', {
  testCases: [testCase],
  diffAssets: false,
});

app.synth();
