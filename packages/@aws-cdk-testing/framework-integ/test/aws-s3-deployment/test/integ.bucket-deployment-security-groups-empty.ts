import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

/**
 * Integration test for bucket deployment with empty security groups array:
 * - Lambda function runs in VPC with explicitly empty security groups array
 * - Tests that empty security groups array is handled correctly
 */
class TestBucketDeploymentEmptySecurityGroups extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC inline instead of looking it up
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

    const destinationBucket = new s3.Bucket(this, 'Destination', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // needed for integration test cleanup
    });

    // Test deployment with empty security groups array
    new s3deploy.BucketDeployment(this, 'DeployWithEmptySecurityGroups', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket,
      destinationKeyPrefix: 'empty-sg/',
      vpc,
      securityGroups: [],
      retainOnDelete: false, // default is true, which will block the integration test cleanup
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const testCase = new TestBucketDeploymentEmptySecurityGroups(app, 'test-bucket-deployment-security-groups-empty');

new integ.IntegTest(app, 'integ-test-bucket-deployment-security-groups-empty', {
  testCases: [testCase],
  diffAssets: false,
});

app.synth();
