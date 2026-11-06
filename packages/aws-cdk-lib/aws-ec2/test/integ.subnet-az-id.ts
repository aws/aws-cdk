/**
 * Integration test for Subnet with availabilityZoneId.
 *
 * Verifies that a Subnet can be created using an Availability Zone ID
 * (e.g., `use1-az1`) instead of an AZ name, and that the AZ ID is
 * correctly passed to CloudFormation.
 */
import * as cdk from '../../core';
import * as ec2 from '../lib';

const app = new cdk.App();

class SubnetAzIdStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC to get a vpcId to use
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 1,
      subnetConfiguration: [], // no default subnets — we create our own
    });

    // Create a subnet using availabilityZoneId instead of availabilityZone
    new ec2.Subnet(this, 'SubnetWithAzId', {
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.0.0/24',
      availabilityZoneId: 'use1-az1',
    });

    // Create a subnet using the traditional availabilityZone — must still work
    new ec2.Subnet(this, 'SubnetWithAzName', {
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.1.0/24',
      availabilityZone: cdk.Stack.of(this).availabilityZones[0],
    });
  }
}

new SubnetAzIdStack(app, 'aws-cdk-ec2-subnet-az-id', {
  env: {
    region: 'us-east-1',
  },
});

app.synth();
