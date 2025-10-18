import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'SubnetSelectionCombinedTest');

// Create VPC with multiple subnet groups of the same type
const vpc = new ec2.Vpc(stack, 'TestVpc', {
  maxAzs: 2,
  subnetConfiguration: [
    {
      name: 'PublicGroup1',
      subnetType: ec2.SubnetType.PUBLIC,
      cidrMask: 24,
    },
    {
      name: 'PublicGroup2',
      subnetType: ec2.SubnetType.PUBLIC,
      cidrMask: 24,
    },
    {
      name: 'PrivateGroup1',
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      cidrMask: 24,
    },
  ],
});

// Test 1: EC2 Instance with combined type+name selection for public subnets
new ec2.Instance(stack, 'InstanceInPublicGroup2', {
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
    subnetGroupName: 'PublicGroup2',
  },
  instanceType: ec2.InstanceType.of(
    ec2.InstanceClass.T3,
    ec2.InstanceSize.MICRO,
  ),
  machineImage: new ec2.AmazonLinuxImage(),
  associatePublicIpAddress: true, // This should work with combined selection
});

// Test 2: EC2 Instance with combined type+name selection for private subnets
new ec2.Instance(stack, 'InstanceInPrivateGroup1', {
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    subnetGroupName: 'PrivateGroup1',
  },
  instanceType: ec2.InstanceType.of(
    ec2.InstanceClass.T3,
    ec2.InstanceSize.MICRO,
  ),
  machineImage: new ec2.AmazonLinuxImage(),
});

// Test 3: Verify backward compatibility - type only selection
new ec2.Instance(stack, 'InstanceTypeOnly', {
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
  instanceType: ec2.InstanceType.of(
    ec2.InstanceClass.T3,
    ec2.InstanceSize.MICRO,
  ),
  machineImage: new ec2.AmazonLinuxImage(),
});

// Test 4: Verify backward compatibility - name only selection
new ec2.Instance(stack, 'InstanceNameOnly', {
  vpc,
  vpcSubnets: {
    subnetGroupName: 'PublicGroup1',
  },
  instanceType: ec2.InstanceType.of(
    ec2.InstanceClass.T3,
    ec2.InstanceSize.MICRO,
  ),
  machineImage: new ec2.AmazonLinuxImage(),
});

// Output subnet information for verification
new cdk.CfnOutput(stack, 'PublicGroup1Subnets', {
  value: vpc
    .selectSubnets({ subnetGroupName: 'PublicGroup1' })
    .subnetIds.join(','),
  description: 'Subnet IDs for PublicGroup1',
});

new cdk.CfnOutput(stack, 'PublicGroup2Subnets', {
  value: vpc
    .selectSubnets({ subnetGroupName: 'PublicGroup2' })
    .subnetIds.join(','),
  description: 'Subnet IDs for PublicGroup2',
});

new cdk.CfnOutput(stack, 'CombinedSelectionSubnets', {
  value: vpc
    .selectSubnets({
      subnetType: ec2.SubnetType.PUBLIC,
      subnetGroupName: 'PublicGroup2',
    })
    .subnetIds.join(','),
  description:
    'Subnet IDs for combined type+name selection (PUBLIC + PublicGroup2)',
});

// Create the integration test
new IntegTest(app, 'SubnetSelectionCombinedIntegTest', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
