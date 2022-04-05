import * as ec2 from '../lib';

/// !show
// Pick the right Amazon Linux edition. All arguments shown are optional
// and will default to these values when omitted.
const amznLinux = ec2.MachineImage.latestAmazonLinux({
  generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX,
  edition: ec2.AmazonLinuxEdition.STANDARD,
  virtualization: ec2.AmazonLinuxVirt.HVM,
  storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
  cpuType: ec2.AmazonLinuxCpuType.X86_64,
});

// Pick a Windows edition to use
const windows = ec2.MachineImage.latestWindows(ec2.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_FULL_BASE);

// Read AMI id from SSM parameter store
const ssm = ec2.MachineImage.fromSsmParameter('/my/ami', { os: ec2.OperatingSystemType.LINUX });

// Look up the most recent image matching a set of AMI filters.
// In this case, look up the NAT instance AMI, by using a wildcard
// in the 'name' field:
const natAmi = ec2.MachineImage.lookup({
  name: 'amzn-ami-vpc-nat-*',
  owners: ['amazon'],
});

// For other custom (Linux) images, instantiate a `GenericLinuxImage` with
// a map giving the AMI to in for each region:
const linux = ec2.MachineImage.genericLinux({
  'us-east-1': 'ami-97785bed',
  'eu-west-1': 'ami-12345678',
  // ...
});

// For other custom (Windows) images, instantiate a `GenericWindowsImage` with
// a map giving the AMI to in for each region:
const genericWindows = ec2.MachineImage.genericWindows({
  'us-east-1': 'ami-97785bed',
  'eu-west-1': 'ami-12345678',
  // ...
});
/// !hide

Array.isArray(windows);
Array.isArray(amznLinux);
Array.isArray(linux);
Array.isArray(ssm);
Array.isArray(genericWindows);
Array.isArray(natAmi);
