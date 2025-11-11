import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

/**
 * Integration test for bucket deployment with multiple security groups:
 * - Lambda function runs in VPC with multiple security groups attached
 * - Tests that deployments work with multiple security groups having different configurations
 */
class TestBucketDeploymentSecurityGroupsMultiple extends cdk.Stack {
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

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const testCase = new TestBucketDeploymentSecurityGroupsMultiple(app, 'test-bucket-deployment-security-groups-multiple');

new integ.IntegTest(app, 'integ-test-bucket-deployment-security-groups-multiple', {
  testCases: [testCase],
  diffAssets: false,
});

app.synth();
