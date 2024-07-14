# Amazon FSx Construct Library

[Amazon FSx](https://docs.aws.amazon.com/fsx/?id=docs_gateway) provides fully managed third-party file systems with the
native compatibility and feature sets for workloads such as Microsoft Windows–based storage, high-performance computing,
machine learning, and electronic design automation.

Amazon FSx supports four file system types: [Lustre](https://docs.aws.amazon.com/fsx/latest/LustreGuide/index.html),
[Windows File Server](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/index.html), [NetApp ONTAP](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/what-is-fsx-ontap.html) and [OpenZFS](https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/what-is-fsx.html).

## Installation

Import to your project:

```ts nofixture
import * as fsx from 'aws-cdk-lib/aws-fsx';
```

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

When you turn data compression on for an existing file system, only newly written files are compressed.  Existing files are not compressed. For more information, see [Compressing previously written files](https://docs.aws.amazon.com/fsx/latest/LustreGuide/data-compression.html#migrate-compression).


### Backups
You can take daily automatic backups by setting `automaticBackupRetention` to a non-zero day in the `lustreConfiguration`.

Additionally, you can set the backup window by specifying the `dailyAutomaticBackupStartTime`.

```ts
import * as cdk from 'aws-cdk-lib';

const lustreConfiguration = {
  // ...
  automaticBackupRetention: cdk.Duration.days(3), // backup retention
  copyTagsToBackups: true, // if true, tags are copied to backups
  dailyAutomaticBackupStartTime: new fsx.DailyAutomaticBackupStartTime({ hour: 11, minute: 30 }),  // backup window
  // ...
}
```

For more information, see [Working with backups
](https://docs.aws.amazon.com/fsx/latest/LustreGuide/using-backups-fsx.html).

## FSx for NetApp ONTAP

Amazon FSx for NetApp ONTAP is a fully managed service that provides highly reliable, scalable, high-performing, and feature-rich file storage built on NetApp's popular ONTAP file system. FSx for ONTAP combines the familiar features, performance, capabilities, and API operations of NetApp file systems with the agility, scalability, and simplicity of a fully managed AWS service.

FSx for ONTAP provides feature-rich, fast, and flexible shared file storage that’s broadly accessible from Linux, Windows, and macOS compute instances running in AWS or on premises. FSx for ONTAP offers high-performance solid state drive (SSD) storage with submillisecond latencies. With FSx for ONTAP, you can achieve SSD levels of performance for your workload while paying for SSD storage for only a small fraction of your data.

### Basic Usage for FSx for NetApp ONTAP

Setup required properties and create:

```ts
declare const vpc: ec2.Vpc;

const fileSystem = new fsx.OntapFileSystem(this, 'FsxOntapFileSystem', {
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
  },
  storageCapacityGiB: 1200,
  vpc,
  vpcSubnet: vpc.privateSubnets,
});
```

### Connecting to FSx for NetApp ONTAP

To control who can access the file system, use the `.connections` attribute.

This example allows an EC2 instance to connect to a file system on port 2049:

```ts
declare const fileSystem: fsx.OntapFileSystem;
declare const instance: ec2.Instance;

fileSystem.connections.allowFrom(instance, ec2.Port.tcp(2049));
```

### Deployment Type

The `OntapFileSystem` construct supports the following deployment types:

- `SINGLE_AZ_1`:  A file system configured for Single-AZ redundancy. This is a first-generation FSx for ONTAP file system.
- `SINGLE_AZ_2`: A file system configured with multiple high-availability (HA) pairs for Single-AZ redundancy. This is a second-generation FSx for ONTAP file system.
- `MULTI_AZ_1`:  A high availability file system configured for Multi-AZ redundancy to tolerate temporary Availability Zone (AZ) unavailability.  This is a first-generation FSx for ONTAP file system.
- `MULTI_AZ_2`: A high availability file system configured for Multi-AZ redundancy to tolerate temporary AZ unavailability. This is a second-generation FSx for ONTAP file system.

Only `SINGLE_AZ_2` allows setting HA pairs to a value other than 1.

### Backup

With FSx for ONTAP, you can protect your data by taking automatic daily backups and user-initiated backups of the volumes on your file system. Creating regular backups for your volumes is a best practice that helps support your data retention and compliance needs. You can restore volume backups to any existing FSx for ONTAP file system you have access to that is in the same AWS Region where the backup is stored. Working with Amazon FSx backups makes it is easy to create, view, restore, and delete backups of your volumes.

To enable automatic backups, set the `automaticBackupRetention` property to a non-zero value in the `ontapConfiguration`:

```ts
declare const vpc: ec2.Vpc;

const fileSystem = new fsx.OntapFileSystem(this, 'FsxOntapFileSystem', {
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
    // Enable automatic backups and set the retention period to 3 days
    automaticBackupRetention: cdk.Duration.days(3),
    // Set the backup window to 1:00 AM UTC
    dailyAutomaticBackupStartTime: new fsx.DailyAutomaticBackupStartTime({
      hour: 1,
      minute: 0,
    }),
  },
  storageCapacityGiB: 1200,
  vpc,
  vpcSubnet: vpc.privateSubnets,
});
```

### File system storage capacity and IOPS

When you create an FSx for ONTAP file system, you specify the storage capacity of the SSD tier. For second-generation Single-AZ file systems, the storage capacity that you specify is spread evenly among the storage pools of each high-availability (HA) pair; these storage pools are called aggregates.

For each GiB of SSD storage that you provision, Amazon FSx automatically provisions 3 SSD input/output operations per second (IOPS) for the file system, up to a maximum of 160,000 SSD IOPS per file system. For second-generation Single-AZ file systems, your SSD IOPS are spread evenly across each of your file system's aggregates. You have the option to specify a level of provisioned SSD IOPS above the automatic 3 SSD IOPS per GiB.

For more information, see [File system storage capacity and IOPS](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/storage-capacity-and-IOPS.html).

To specify the storage capacity and level of provisioned SSD IOPS, set the `storageCapacityGiB` in the `OntapFileSystemProps` and `diskIops` property in the `ontapConfiguration`:

```ts
declare const vpc: ec2.Vpc;

const fileSystem = new fsx.OntapFileSystem(this, 'FsxOntapFileSystem', {
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
    // Set the level of provisioned SSD IOPS to 12,288
    diskIops: 12288,
    haPairs: 2,
  },
  // Set the storage capacity to 2 TiB
  storageCapacityGiB: 2048,
  vpc,
  vpcSubnet: vpc.privateSubnets,
});
```

**Note**:

- The storage capacity has a minimum and maximum value based on the HA pairs. The minimum value is `1,024 * haPairs` GiB and the maximum value is smaller one between `524,288 * haPairs` and `1,048,576` GiB.
- The level of provisioned SSD IOPS has a minimum and maximum value based on the storage capacity. The minimum value is `3 * storageCapacityGiB * haPairs` IOPS and the maximum value is `200,000 * haPairs` IOPS.

### Multi-AZ file systems

Multi-AZ file systems support all the availability and durability features of Single-AZ file systems. In addition, they are designed to provide continuous availability to data even when an Availability Zone is unavailable. Multi-AZ deployments have a single HA pair of file servers, the standby file server is deployed in a different Availability Zone from the active file server in the same AWS Region. Any changes written to your file system are synchronously replicated across Availability Zones to the standby.

To create a Multi-AZ file system, set the `deploymentType` to `MULTI_AZ_X` and specify `endpointIpAddressRange`, `routeTables` and `preferredSubnet` in the `ontapConfiguration`:

```ts
declare const vpc: ec2.Vpc;

const fileSystem = new fsx.OntapFileSystem(this, 'FsxOntapFileSystem', {
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
    // The IP address range in which the endpoints to access your file system will be created.
    endpointIpAddressRange: '192.168.39.0/24',
    // The route tables in which Amazon FSx creates the rules for routing traffic to the correct file server.
    // You should specify all virtual private cloud (VPC) route tables associated with the subnets in which your clients are located.
    routeTables: [vpc.privateSubnets.routeTable],
    // The subnet in which you want the preferred file server to be located.
    preferredSubnet: vpc.privateSubnets[0],
  },
  storageCapacityGiB: 1200,
  vpc,
  vpcSubnet: vpc.privateSubnets,
});
```

**Note**:

- `preferredSubnet` must be the part of the `vpcSubnet`.
- Amazon FSx manages VPC route tables for Multi-AZ file systems using tag-based authentication. These route tables are tagged with Key: `AmazonFSx`; Value: `ManagedByAmazonFSx`.

### Throughput Capacity

FSx for ONTAP configures throughput capacity when you create the file system. You can modify your file system's throughput capacity at any time. Keep in mind that your file system requires a specific configuration to achieve the maximum amount of throughput capacity.

For more information, see [Managing throughput capacity](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/managing-throughput-capacity.html).

To specify the throughput capacity, set the `throughputCapacity`  or `throughputCapacityPreHaPair` property in the `ontapConfiguration`. These properties are mutually exclusive and cannot be specified together.

`throughputCapacity` sets the total throughput amount, and `throughputCapacityPreHaPair` sets the throughput amount per HA pair. Setting `throughputCapacity` to `X` and setting `throughputCapacityPreHaPair` to `X / HA pair` have the same meaning.

This example sets the throughput capacity to 1536 MiB/s per HA pair:

```ts
declare const vpc: ec2.Vpc;

const fileSystem = new fsx.OntapFileSystem(this, 'FsxOntapFileSystem', {
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
    haPairs: 4,
    // Set the throughput capacity to 1536 MiB/s
    throughputCapacity: 6144,
    // This is equivalent to setting throughputCapacity to 1536 MiB/s
    // throughputCapacityPerHaPair: 1536,
  },
  storageCapacityGiB: 4096,
  vpc,
  vpcSubnet: vpc.privateSubnets,
});
```

### Maintenance Window

As a fully-managed service, FSx for ONTAP regularly performs maintenance on and updates to your file system. This maintenance has no impact for most workloads. For workloads that are performance-sensitive, on rare occasions you may notice a brief (<60 seconds) impact on performance when maintenance is occurring; Amazon FSx enables you to use the maintenance window to control when any such potential maintenance activity occurs.

To set the maintenance window, specify the `maintenanceWindow` property in the `ontapConfiguration`:

```ts
declare const vpc: ec2.Vpc;

const fileSystem = new fsx.OntapFileSystem(this, 'FsxOntapFileSystem', {
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
    // Set the weekly maintenance window to SUNDAY 1:00 AM UTC
    weeklyMaintenanceStartTime: new fsx.MaintenanceTime({
      day: fsx.Weekday.SUNDAY,
      hour: 1,
      minute: 0,
    }),
  },
  storageCapacityGiB: 1200,
  vpc,
  vpcSubnet: vpc.privateSubnets,
});
```

## FSx for Windows File Server

The L2 construct for the FSx for Windows File Server has not yet been implemented. To instantiate an FSx for Windows
file system, the L1 constructs can be used as defined by CloudFormation.
