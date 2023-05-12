# Amazon FSx Construct Library


[Amazon FSx](https://docs.aws.amazon.com/fsx/?id=docs_gateway) provides fully managed third-party file systems with the
native compatibility and feature sets for workloads such as Microsoft Windows–based storage, high-performance computing,
machine learning, and electronic design automation.

Amazon FSx supports two file system types: [Lustre](https://docs.aws.amazon.com/fsx/latest/LustreGuide/index.html) and
[Windows](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/index.html) File Server.

## FSx for Lustre

Amazon FSx for Lustre makes it easy and cost-effective to launch and run the popular, high-performance Lustre file
system. You use Lustre for workloads where speed matters, such as machine learning, high performance computing (HPC),
video processing, and financial modeling.

The open-source Lustre file system is designed for applications that require fast storage—where you want your storage
to keep up with your compute. Lustre was built to solve the problem of quickly and cheaply processing the world's
ever-growing datasets. It's a widely used file system designed for the fastest computers in the world. It provides
submillisecond latencies, up to hundreds of GBps of throughput, and up to millions of IOPS. For more information on
Lustre, see the [Lustre website](http://lustre.org/).

As a fully managed service, Amazon FSx makes it easier for you to use Lustre for workloads where storage speed matters.
Amazon FSx for Lustre eliminates the traditional complexity of setting up and managing Lustre file systems, enabling
you to spin up and run a battle-tested high-performance file system in minutes. It also provides multiple deployment
options so you can optimize cost for your needs.

Amazon FSx for Lustre is POSIX-compliant, so you can use your current Linux-based applications without having to make
any changes. Amazon FSx for Lustre provides a native file system interface and works as any file system does with your
Linux operating system. It also provides read-after-write consistency and supports file locking.

### Installation

Import to your project:

```ts nofixture
import * as fsx from 'aws-cdk-lib/aws-fsx';
```

### Basic Usage

Setup required properties and create:

```ts
declare const vpc: ec2.Vpc;

const fileSystem = new fsx.LustreFileSystem(this, 'FsxLustreFileSystem', {
  lustreConfiguration: { deploymentType: fsx.LustreDeploymentType.SCRATCH_2 },
  storageCapacityGiB: 1200,
  vpc,
  vpcSubnet: vpc.privateSubnets[0],
});
```

### Connecting

To control who can access the file system, use the `.connections` attribute. FSx has a fixed default port, so you don't
need to specify the port. This example allows an EC2 instance to connect to a file system:

```ts
declare const fileSystem: fsx.LustreFileSystem;
declare const instance: ec2.Instance;

fileSystem.connections.allowDefaultPortFrom(instance);
```

### Mounting

The LustreFileSystem Construct exposes both the DNS name of the file system as well as its mount name, which can be
used to mount the file system on an EC2 instance. The following example shows how to bring up a file system and EC2
instance, and then use User Data to mount the file system on the instance at start-up:

```ts
import * as iam from 'aws-cdk-lib/aws-iam';

declare const vpc: ec2.Vpc;
const lustreConfiguration = {
  deploymentType: fsx.LustreDeploymentType.SCRATCH_2,
};

const fs = new fsx.LustreFileSystem(this, 'FsxLustreFileSystem', {
  lustreConfiguration,
  storageCapacityGiB: 1200,
  vpc,
  vpcSubnet: vpc.privateSubnets[0],
});

const inst = new ec2.Instance(this, 'inst', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.LARGE),
  machineImage: new ec2.AmazonLinuxImage({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
});
fs.connections.allowDefaultPortFrom(inst);

// Need to give the instance access to read information about FSx to determine the file system's mount name.
inst.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonFSxReadOnlyAccess'));

const mountPath = '/mnt/fsx';
const dnsName = fs.dnsName;
const mountName = fs.mountName;

inst.userData.addCommands(
  'set -eux',
  'yum update -y',
  'amazon-linux-extras install -y lustre2.10',
  // Set up the directory to mount the file system to and change the owner to the AL2 default ec2-user.
  `mkdir -p ${mountPath}`,
  `chmod 777 ${mountPath}`,
  `chown ec2-user:ec2-user ${mountPath}`,
  // Set the file system up to mount automatically on start up and mount it.
  `echo "${dnsName}@tcp:/${mountName} ${mountPath} lustre defaults,noatime,flock,_netdev 0 0" >> /etc/fstab`,
  'mount -a',
);
```

### Importing an existing Lustre filesystem

An FSx for Lustre file system can be imported with `fromLustreFileSystemAttributes(this, id, attributes)`. The
following example lays out how you could import the SecurityGroup a file system belongs to, use that to import the file
system, and then also import the VPC the file system is in and add an EC2 instance to it, giving it access to the file
system.

```ts
const sg = ec2.SecurityGroup.fromSecurityGroupId(this, 'FsxSecurityGroup', '{SECURITY-GROUP-ID}');
const fs = fsx.LustreFileSystem.fromLustreFileSystemAttributes(this, 'FsxLustreFileSystem', {
  dnsName: '{FILE-SYSTEM-DNS-NAME}',
  fileSystemId: '{FILE-SYSTEM-ID}',
  securityGroup: sg,
});

const vpc = ec2.Vpc.fromVpcAttributes(this, 'Vpc', {
  availabilityZones: ['us-west-2a', 'us-west-2b'],
  publicSubnetIds: ['{US-WEST-2A-SUBNET-ID}', '{US-WEST-2B-SUBNET-ID}'],
  vpcId: '{VPC-ID}',
});

const inst = new ec2.Instance(this, 'inst', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.LARGE),
  machineImage: new ec2.AmazonLinuxImage({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
});

fs.connections.allowDefaultPortFrom(inst);
```

### Lustre Data Repository Association support

The LustreFilesystem Construct supports one [Data Repository Association](https://docs.aws.amazon.com/fsx/latest/LustreGuide/fsx-data-repositories.html) (DRA) to an S3 bucket.  This allows Lustre hierarchical storage management to S3 buckets, which in turn makes it possible to use S3 as a permanent backing store, and use FSx for Lustre as a temporary high performance cache.

Note: CloudFormation does not currently support for `PERSISTENT_2` filesystems, and so neither does CDK.

The following example illustrates setting up a DRA to an S3 bucket, including automated metadata import whenever a file is changed, created or deleted in the S3 bucket:

```ts
import { aws_s3 as s3 } from 'aws-cdk-lib';

declare const vpc: ec2.Vpc;
declare const bucket: s3.Bucket;

const lustreConfiguration = {
  deploymentType: fsx.LustreDeploymentType.SCRATCH_2,
  exportPath: bucket.s3UrlForObject(),
  importPath: bucket.s3UrlForObject(),
  autoImportPolicy: fsx.LustreAutoImportPolicy.NEW_CHANGED_DELETED,
};

const fs = new fsx.LustreFileSystem(this, "FsxLustreFileSystem", {
  vpc: vpc,
  vpcSubnet: vpc.privateSubnets[0],
  storageCapacityGiB: 1200,
  lustreConfiguration,
});
```

### Compression

By default, transparent compression of data within FSx for Lustre is switched off.  To enable it, add the following to your `lustreConfiguration`:

```ts
const lustreConfiguration = {
  // ...
  dataCompressionType: fsx.LustreDataCompressionType.LZ4,
  // ...
}
```

When you turn data compression on for an existing file system, only newly written files are compressed.  Existing files are not compressed. For more information, see [Compressing previously written files](https://docs.aws.amazon.com/fsx/latest/LustreGuide/data-compression.html#migrate-compression).```

## FSx for Windows File Server

The L2 construct for the FSx for Windows File Server has not yet been implemented. To instantiate an FSx for Windows
file system, the L1 constructs can be used as defined by CloudFormation.
