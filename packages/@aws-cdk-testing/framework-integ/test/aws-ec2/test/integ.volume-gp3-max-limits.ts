import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-ec2-volume-gp3-max-limits');
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

// Test GP3 volume with maximum throughput (2000 MiB/s)
// Note: Requires at least 8000 IOPS (2000 / 0.25 ratio) and at least 16 GiB (8000 / 500 IOPS/GiB)
new ec2.Volume(stack, 'TestVolumeMaxThroughput', {
  availabilityZone: 'us-east-1a',
  size: cdk.Size.gibibytes(16), // Minimum size for 8000 IOPS
  volumeType: ec2.EbsDeviceVolumeType.GP3,
  throughput: 2000,
  iops: 8000, // Minimum IOPS to support 2000 MiB/s (2000 / 0.25 = 8000)
});

// Test GP3 volume with maximum IOPS (80000)
// Note: Maximum IOPS requires at least 160 GiB (80000 / 500 ratio)
new ec2.Volume(stack, 'TestVolumeMaxIOPS', {
  availabilityZone: 'us-east-1a',
  size: cdk.Size.gibibytes(160),
  volumeType: ec2.EbsDeviceVolumeType.GP3,
  iops: 80000,
  throughput: 125, // Default throughput
});

// Test GP3 volume with both maximum throughput and IOPS
// Note: 2000 MiB/s requires at least 8000 IOPS, but we're using 80000 IOPS which is fine
// Ratio = 2000 / 80000 = 0.025 (well below 0.25 limit)
new ec2.Volume(stack, 'TestVolumeMaxBoth', {
  availabilityZone: 'us-east-1a',
  size: cdk.Size.gibibytes(160),
  volumeType: ec2.EbsDeviceVolumeType.GP3,
  iops: 80000,
  throughput: 2000,
});

new integ.IntegTest(app, 'VolumeGP3MaxLimitsTest', {
  testCases: [stack],
});

app.synth();
