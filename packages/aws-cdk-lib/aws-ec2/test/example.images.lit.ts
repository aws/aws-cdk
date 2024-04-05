import * as ec2 from '../lib';

/// !show
// Pick the right Amazon Linux edition. All arguments shown are optional
// and will default to these values when omitted.
const amznLinux2 = ec2.MachineImage.latestAmazonLinux2({
  edition: ec2.AmazonLinuxEdition.STANDARD,
  virtualization: ec2.AmazonLinuxVirt.HVM,
  storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
  cpuType: ec2.AmazonLinuxCpuType.X86_64,
  kernel: ec2.AmazonLinux2Kernel.KERNEL_5_10,
});

const amznLinux2023 = ec2.MachineImage.latestAmazonLinux2023({
  edition: ec2.AmazonLinuxEdition.STANDARD,
  cpuType: ec2.AmazonLinuxCpuType.X86_64,
  kernel: ec2.AmazonLinux2023Kernel.KERNEL_6_1,
});

// Pick a Windows edition to use
const windows2022 = ec2.MachineImage.latestWindows(
  ec2.WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_FULL_BASE,
);

// You can also select a specific datestamped version of Windows
// This will prevent the CDK from replacing your instance when
// a new version of `WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_FULL_BASE` becomes available
const windows2024_02_14 = ec2.MachineImage.specificWindows(
  ec2.WindowsSpecificVersion.WINDOWS_SERVER_2022_ENGLISH_FULL_BASE_2024_02_14,
);

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

Array.isArray(windows2022);
Array.isArray(windows2024_02_14);
Array.isArray(amznLinux2);
Array.isArray(amznLinux2023);
Array.isArray(linux);
Array.isArray(ssm);
Array.isArray(genericWindows);
Array.isArray(natAmi);
