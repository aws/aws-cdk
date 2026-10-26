/**
 * Integration test for Volume with availabilityZoneId.
 *
 * Verifies that an EBS Volume can be created using an Availability Zone ID
 * (e.g., `use1-az1`) instead of an AZ name, and that the AZ ID is
 * correctly passed to CloudFormation.
 */
import * as cdk from '../../core';
import * as ec2 from '../lib';

const app = new cdk.App();

class VolumeAzIdStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a volume using availabilityZoneId instead of availabilityZone
    new ec2.Volume(this, 'VolumeWithAzId', {
      availabilityZoneId: 'use1-az1',
      size: cdk.Size.gibibytes(8),
      volumeType: ec2.EbsDeviceVolumeType.GP3,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create a volume using the traditional availabilityZone — must still work
    new ec2.Volume(this, 'VolumeWithAzName', {
      availabilityZone: 'us-east-1a',
      size: cdk.Size.gibibytes(8),
      volumeType: ec2.EbsDeviceVolumeType.GP3,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}

new VolumeAzIdStack(app, 'aws-cdk-ec2-volume-az-id', {
  env: {
    region: 'us-east-1',
  },
});

app.synth();
