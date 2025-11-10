import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

/**
 * Integration test for bucket deployment with VPC and explicit subnet selection:
 * - Lambda function runs in VPC with explicit subnet type selection
 * - Tests vpcSubnets property for controlling which subnets Lambda uses
 */
class TestBucketDeploymentVpcSubnetSelection extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC with specific subnets
    // Use isolated subnets with S3 VPC endpoint - no NAT Gateway or Elastic IP needed
    // Use a different CIDR to avoid conflicts with existing stacks
    const vpc = new ec2.Vpc(this, 'SubnetVpc', {
      restrictDefaultSecurityGroup: false,
      natGateways: 0,
      ipAddresses: ec2.IpAddresses.cidr('10.1.0.0/16'),
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
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
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
