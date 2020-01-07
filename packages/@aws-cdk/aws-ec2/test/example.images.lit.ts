import * as ec2 from '../lib';

/// !show
// Pick the right Amazon Linux edition. All arguments shown are optional
// and will default to these values when omitted.
const amznLinux = new ec2.AmazonLinuxImage({
  generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX,
  edition: ec2.AmazonLinuxEdition.STANDARD,
  virtualization: ec2.AmazonLinuxVirt.HVM,
  storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
});

// Pick a Windows edition to use
const windows = new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_FULL_BASE);

// Look up the most recent image matching a set of AMI filters.
// In this case, look up the NAT instance AMI, by using a wildcard
// in the 'name' field:
const natAmi = new ec2.LookupMachineImage({
  name: 'amzn-ami-vpc-nat-*',
  owners: ['amazon'],
});

// For other custom (Linux) images, instantiate a `GenericLinuxImage` with
// a map giving the AMI to in for each region:

const linux = new ec2.GenericLinuxImage({
    'us-east-1': 'ami-97785bed',
    'eu-west-1': 'ami-12345678',
    // ...
});

// For other custom (Windows) images, instantiate a `GenericWindowsImage` with
// a map giving the AMI to in for each region:

const genericWindows = new ec2.GenericWindowsImage({
  'us-east-1': 'ami-97785bed',
  'eu-west-1': 'ami-12345678',
  // ...
});
/// !hide

Array.isArray(windows);
Array.isArray(amznLinux);
Array.isArray(linux);
Array.isArray(genericWindows);
Array.isArray(natAmi);
