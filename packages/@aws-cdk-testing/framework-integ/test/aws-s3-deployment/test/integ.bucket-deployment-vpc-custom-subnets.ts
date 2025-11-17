import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

/**
 * Integration test for bucket deployment with VPC and custom subnet configuration:
 * - Lambda function runs in VPC with custom maxAzs and subnet configuration
 * - Tests that custom VPC configurations work with bucket deployments
 */
class TestBucketDeploymentVpcCustomSubnets extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC with custom subnet configuration
    // Use isolated subnets with S3 VPC endpoint - no NAT Gateway or Elastic IP needed
    const vpc = new ec2.Vpc(this, 'CustomVpc', {
      restrictDefaultSecurityGroup: false,
      maxAzs: 2,
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

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const testCase = new TestBucketDeploymentVpcCustomSubnets(app, 'test-bucket-deployment-vpc-custom-subnets');

new integ.IntegTest(app, 'integ-test-bucket-deployment-vpc-custom-subnets', {
  testCases: [testCase],
  diffAssets: false,
});

app.synth();
