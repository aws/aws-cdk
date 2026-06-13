# Amazon FSx Construct Library

[Amazon FSx](https://docs.aws.amazon.com/fsx/?id=docs_gateway) provides fully managed third-party file systems with the
native compatibility and feature sets for workloads such as Microsoft Windows–based storage, high-performance computing,
machine learning, and electronic design automation.

Amazon FSx supports several file system types: [Lustre](https://docs.aws.amazon.com/fsx/latest/LustreGuide/index.html),
[NetApp ONTAP](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/index.html), and
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

### File System Type Version

You can set [the Lustre version for the file system](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html#cfn-fsx-filesystem-filesystemtypeversion). To do this, use the `fileSystemTypeVersion` property:

```ts
declare const vpc: ec2.Vpc;

const fileSystem = new fsx.LustreFileSystem(this, 'FsxLustreFileSystem', {
lustreConfiguration: { deploymentType: fsx.LustreDeploymentType.SCRATCH_2 },
  storageCapacityGiB: 1200,
  vpc,
  vpcSubnet: vpc.privateSubnets[0],
  fileSystemTypeVersion: fsx.FileSystemTypeVersion.V_2_15,
});
```

**Note**: The `fileSystemTypeVersion` has a restrictions on the values that can be set based on the `deploymentType`.

- `V_2_10` is supported by the Scratch and `PERSISTENT_1` deployment types.
- `V_2_12` is supported by all Lustre deployment types.
- `V_2_15` is supported by all Lustre deployment types and is recommended for all new file systems.

**Note**: The default value of `fileSystemTypeVersion` is `V_2_10` except for `PERSISTENT_2` deployment type where the default value is `V_2_12`.

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

### Storage Type

By default, FSx for Lustre uses SSD storage. To use HDD storage, specify `storageType`:

```ts
declare const vpc: ec2.Vpc;

const fileSystem = new fsx.LustreFileSystem(this, 'FsxLustreFileSystem', {
  lustreConfiguration: { deploymentType: fsx.LustreDeploymentType.PERSISTENT_1 },
  storageCapacityGiB: 1200,
  vpc,
  vpcSubnet: vpc.privateSubnets[0],
  storageType: fsx.StorageType.HDD,
});
```

**Note:** The HDD storage type is only supported for `PERSISTENT_1` deployment types.

To improve the performance of frequently accessed files by caching up to 20% of the total storage capacity of the file system, set `driveCacheType` to `READ`:

```ts
declare const vpc: ec2.Vpc;

const fileSystem = new fsx.LustreFileSystem(this, 'FsxLustreFileSystem', {
  lustreConfiguration: {
    deploymentType: fsx.LustreDeploymentType.PERSISTENT_1,
    driveCacheType: fsx.DriveCacheType.READ,
    },
  storageCapacityGiB: 1200,
  vpc,
  vpcSubnet: vpc.privateSubnets[0],
  storageType: fsx.StorageType.HDD,
});
```

## FSx for NetApp ONTAP

[Amazon FSx for NetApp ONTAP](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/what-is-fsx-ontap.html) provides fully
managed shared storage built on NetApp's popular ONTAP file system. FSx for ONTAP offers multi-protocol access (NFS,
SMB, iSCSI), built-in data protection with snapshots and replication, and automatic storage tiering between SSD and
capacity pool storage.

The L2 covers three resource types:

- `OntapFileSystem` for the file system itself.
- `OntapStorageVirtualMachine` (SVM) for an isolated server within a file system.
- `OntapVolume` for a data container within an SVM.

Topics in this section:

- [Basic Usage](#basic-usage-1)
- [Deployment Types](#deployment-types)
- [High Availability Pairs](#high-availability-pairs)
- [Throughput Capacity](#throughput-capacity)
- [Total Throughput Capacity](#total-throughput-capacity)
- [SSD IOPS](#ssd-iops)
- [Encryption at Rest](#encryption-at-rest)
- [Removal Policy](#removal-policy)
- [Backups](#backups-1)
- [Admin Credentials](#admin-credentials)
- [Storage Virtual Machines](#storage-virtual-machines)
- [Active Directory join with Secrets Manager](#active-directory-join-with-secrets-manager)
- [Volumes](#volumes)
- [FlexGroup Volumes](#flexgroup-volumes)
- [Data Protection Volumes](#data-protection-volumes)
- [SnapLock (WORM/Compliance) Volumes](#snaplock-wormcompliance-volumes)
- [Restoring a Volume from a Backup](#restoring-a-volume-from-a-backup)
- [Connecting](#connecting-1)
- [IPv6 Dual-Stack Networking](#ipv6-dual-stack-networking)
- [Importing Existing Resources](#importing-existing-resources)
- [Common Pitfalls](#common-pitfalls)

### Basic Usage

Create an FSx for ONTAP file system with a Storage Virtual Machine (SVM) and Volume:

```ts
declare const vpc: ec2.Vpc;

// Create the ONTAP file system
const fileSystem = new fsx.OntapFileSystem(this, 'OntapFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0], vpc.privateSubnets[1]],
  storageCapacityGiB: 1024,
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
    throughputCapacityPerHaPair: fsx.ThroughputCapacityPerHaPair.MB_PER_SEC_384,
    preferredSubnet: vpc.privateSubnets[0],
  },
});

// Create a Storage Virtual Machine
const svm = new fsx.OntapStorageVirtualMachine(this, 'Svm', {
  fileSystem,
  name: 'my_svm',
});

// Create a Volume
new fsx.OntapVolume(this, 'Volume', {
  storageVirtualMachine: svm,
  name: 'my_volume',
  sizeInBytes: 107374182400, // 100 GiB
  junctionPath: '/data',
});
```

### Deployment Types

FSx for ONTAP supports four deployment types:

- **MULTI_AZ_1**: First-generation multi-AZ, high availability across two AZs
- **MULTI_AZ_2**: Second-generation multi-AZ with improved performance
- **SINGLE_AZ_1**: First-generation single-AZ
- **SINGLE_AZ_2**: Second-generation single-AZ with support for multiple HA pairs

```ts
declare const vpc: ec2.Vpc;

// Single-AZ deployment requires exactly one subnet
const singleAz = new fsx.OntapFileSystem(this, 'SingleAzFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0]],
  storageCapacityGiB: 1024,
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
    throughputCapacityPerHaPair: fsx.ThroughputCapacityPerHaPair.MB_PER_SEC_1536,
  },
});
```

### High Availability Pairs

A `SINGLE_AZ_2` file system can scale out by running multiple HA pairs of file servers, from 1 (default) up to 12. Storage capacity, IOPS, and throughput all scale linearly with the number of HA pairs. The other deployment types (`SINGLE_AZ_1`, `MULTI_AZ_1`, `MULTI_AZ_2`) only support a single HA pair.

```ts
declare const vpc: ec2.Vpc;

new fsx.OntapFileSystem(this, 'OntapFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0]],
  storageCapacityGiB: 12288, // 1024 GiB per HA pair, minimum
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
    haPairs: 12,
    throughputCapacityPerHaPair: fsx.ThroughputCapacityPerHaPair.MB_PER_SEC_6144,
  },
});
```

For more information, see [High availability and durability](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/high-availability-multi-AZ.html).

### Throughput Capacity

Throughput capacity per HA pair is configured using the `ThroughputCapacityPerHaPair` class. Valid values depend on the deployment type:

- `SINGLE_AZ_1` and `MULTI_AZ_1`: 128, 256, 512, 1024, 2048, 4096 MBps
- `SINGLE_AZ_2`: 1536, 3072, 6144 MBps
- `MULTI_AZ_2`: 384, 768, 1536, 3072, 6144 MBps

For more information, see [Managing throughput capacity](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/managing-throughput-capacity.html).

### SSD IOPS

By default, FSx for ONTAP provisions 3 SSD IOPS per GiB of storage capacity, multiplied by the number of HA pairs. To provision a custom amount, set `diskIops`:

```ts
declare const vpc: ec2.Vpc;

new fsx.OntapFileSystem(this, 'OntapFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0]],
  storageCapacityGiB: 1024,
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_1,
    diskIops: 10000,
  },
});
```

The minimum is 3 IOPS per GiB of storage capacity. The maximum is 80,000 for first-generation deployments and up to 200,000 per HA pair (capped at 2,400,000 total) for second-generation deployments.

### Encryption at Rest

FSx for ONTAP file systems are encrypted at rest by default with an AWS-managed KMS key. To use a customer-managed key, pass it as `kmsKey`:

```ts
import * as kms from 'aws-cdk-lib/aws-kms';

declare const vpc: ec2.Vpc;

const key = new kms.Key(this, 'FsxKey');

new fsx.OntapFileSystem(this, 'OntapFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0]],
  storageCapacityGiB: 1024,
  kmsKey: key,
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_1,
  },
});
```

### Removal Policy

`OntapFileSystem`, `OntapStorageVirtualMachine`, and `OntapVolume` all default to `RemovalPolicy.RETAIN`. These resources are stateful and removing them on stack delete would silently destroy customer data. To opt in to deletion (for example for ephemeral test stacks), set `removalPolicy: RemovalPolicy.DESTROY` on each construct:

```ts
import { RemovalPolicy } from 'aws-cdk-lib';

declare const svm: fsx.OntapStorageVirtualMachine;

new fsx.OntapVolume(this, 'EphemeralVolume', {
  storageVirtualMachine: svm,
  name: 'temp_vol',
  sizeInBytes: 53687091200,
  removalPolicy: RemovalPolicy.DESTROY,
});
```

### Backups

By default, automatic backups are retained for 30 days. You can configure the retention period and backup window:

```ts
import * as cdk from 'aws-cdk-lib';

declare const vpc: ec2.Vpc;

const fileSystem = new fsx.OntapFileSystem(this, 'OntapFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0]],
  storageCapacityGiB: 1024,
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_1,
    throughputCapacityPerHaPair: fsx.ThroughputCapacityPerHaPair.MB_PER_SEC_128,
    automaticBackupRetention: cdk.Duration.days(7),
    dailyAutomaticBackupStartTime: new fsx.DailyAutomaticBackupStartTime({ hour: 1, minute: 0 }),
  },
});
```

To disable automatic backups, set `automaticBackupRetention` to `Duration.days(0)`.

### Admin Credentials

Admin passwords for the file system (`fsxAdminPassword`) and SVM (`svmAdminPassword`) accept any `SecretValue`. For
convenience, the `OntapFileSystemSecret` class generates a Secrets Manager secret with a strong password that excludes
the characters not allowed by FSx for ONTAP (`"`, `@`, `/`, `\`):

```ts
declare const vpc: ec2.Vpc;

const adminSecret = new fsx.OntapFileSystemSecret(this, 'FsxAdminSecret');

const fileSystem = new fsx.OntapFileSystem(this, 'OntapFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0]],
  storageCapacityGiB: 1024,
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_1,
    throughputCapacityPerHaPair: fsx.ThroughputCapacityPerHaPair.MB_PER_SEC_128,
    fsxAdminPassword: adminSecret.secretValueFromJson('password'),
  },
});
```

### Storage Virtual Machines

A Storage Virtual Machine (SVM) is an isolated file server within a file system. Each SVM has its own set of credentials
and can be joined to an Active Directory domain:

```ts
declare const fileSystem: fsx.OntapFileSystem;

const svm = new fsx.OntapStorageVirtualMachine(this, 'Svm', {
  fileSystem,
  name: 'my_svm',
  rootVolumeSecurityStyle: fsx.SecurityStyle.UNIX,
});
```

To set the SVM admin password, use the same `OntapFileSystemSecret` helper. The file system admin and the SVM admin are
two different accounts and need two different secrets:

```ts
declare const fileSystem: fsx.OntapFileSystem;

const svmAdminSecret = new fsx.OntapFileSystemSecret(this, 'SvmAdminSecret');

new fsx.OntapStorageVirtualMachine(this, 'Svm', {
  fileSystem,
  name: 'my_svm',
  svmAdminPassword: svmAdminSecret.secretValueFromJson('password'),
});
```

### Volumes

Volumes are the data containers within an SVM. You can configure tiering policies to automatically move infrequently
accessed data to lower-cost capacity pool storage:

```ts
import * as cdk from 'aws-cdk-lib';

declare const svm: fsx.OntapStorageVirtualMachine;

const volume = new fsx.OntapVolume(this, 'Volume', {
  storageVirtualMachine: svm,
  name: 'my_volume',
  sizeInBytes: 214748364800, // 200 GiB
  junctionPath: '/data',
  storageEfficiencyEnabled: true,
  tieringPolicy: {
    name: fsx.TieringPolicyName.AUTO,
    coolingPeriod: cdk.Duration.days(31),
  },
});
```

### FlexGroup Volumes

By default, `OntapVolume` creates a FlexVol volume backed by a single aggregate. For very large workloads, you can
create a FlexGroup volume that spans multiple aggregates. Set `volumeStyle` to `FLEXGROUP` and supply
`aggregateConfiguration`:

```ts
declare const svm: fsx.OntapStorageVirtualMachine;

new fsx.OntapVolume(this, 'FlexGroupVolume', {
  storageVirtualMachine: svm,
  name: 'flexgroup_vol',
  sizeInBytes: 1099511627776, // 1 TiB
  volumeStyle: fsx.VolumeStyle.FLEXGROUP,
  aggregateConfiguration: {
    aggregates: ['aggr1', 'aggr2'],
    constituentsPerAggregate: 8,
  },
});
```

Each aggregate name must match the pattern `aggrX` where `X` is between 1 and 12, and the list must contain between 1
and 6 entries. `constituentsPerAggregate` ranges from 1 to 200.

### Data Protection Volumes

Data Protection (DP) volumes are read-only and used as SnapMirror destinations. Unlike read/write (RW) volumes, DP
volumes do not accept `storageEfficiencyEnabled`:

```ts
declare const svm: fsx.OntapStorageVirtualMachine;

new fsx.OntapVolume(this, 'DpVolume', {
  storageVirtualMachine: svm,
  name: 'dp_vol',
  sizeInBytes: 107374182400,
  ontapVolumeType: fsx.OntapVolumeType.DP,
});
```

The default `ontapVolumeType` is `RW` (read/write) and matches the most common use case.

### Connecting

To control who can access the file system, use the `.connections` attribute. FSx for ONTAP uses port 2049 (NFSv4) as the
default port, but the file system also exposes other protocols on different ports.

> **Note:** `connections.allowDefaultPortFrom(instance)` opens **only TCP/2049**, which is sufficient for NFSv4. For
> **NFSv3** mounts you must additionally allow TCP/UDP **111** (portmapper) and TCP/UDP **635** (mountd), **4045**
> (lockd), and **4046** (statd). For SMB use TCP **445** (and UDP **137-139** for NetBIOS name resolution). For iSCSI
> use TCP **3260**. For ONTAP REST/CLI management use TCP **443**.

This example allows an EC2 instance to connect to the file system over NFSv4:

```ts
declare const fileSystem: fsx.OntapFileSystem;
declare const instance: ec2.Instance;

fileSystem.connections.allowDefaultPortFrom(instance);
```

To allow NFSv3 (which requires the additional ports listed above):

```ts
declare const fileSystem: fsx.OntapFileSystem;
declare const instance: ec2.Instance;

fileSystem.connections.allowFrom(instance, ec2.Port.tcp(2049), 'NFS');
fileSystem.connections.allowFrom(instance, ec2.Port.tcp(111), 'portmapper TCP');
fileSystem.connections.allowFrom(instance, ec2.Port.udp(111), 'portmapper UDP');
fileSystem.connections.allowFrom(instance, ec2.Port.tcpRange(635, 635), 'mountd TCP');
fileSystem.connections.allowFrom(instance, ec2.Port.udpRange(635, 635), 'mountd UDP');
fileSystem.connections.allowFrom(instance, ec2.Port.tcp(4045), 'lockd');
fileSystem.connections.allowFrom(instance, ec2.Port.tcp(4046), 'statd');
```

To also allow SMB access from the same instance:

```ts
declare const fileSystem: fsx.OntapFileSystem;
declare const instance: ec2.Instance;

fileSystem.connections.allowFrom(instance, ec2.Port.tcp(445), 'SMB');
```

### IPv6 Dual-Stack Networking

By default, FSx for ONTAP file systems are created with IPv4-only networking. To enable IPv6 dual-stack, set the
`networkType` property to `NetworkType.DUAL`:

```ts
declare const vpc: ec2.Vpc;

new fsx.OntapFileSystem(this, 'OntapFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0]],
  storageCapacityGiB: 1024,
  networkType: fsx.NetworkType.DUAL,
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_1,
    throughputCapacityPerHaPair: fsx.ThroughputCapacityPerHaPair.MB_PER_SEC_128,
  },
});
```

The VPC and subnets must already be configured with IPv6 CIDR blocks.

### Total Throughput Capacity

In addition to specifying throughput per HA pair via `throughputCapacityPerHaPair`, you can specify the total
throughput for the file system using `throughputCapacity`. The valid range depends on the deployment type and
on `haPairs` (multiple HA pairs are only supported on `SINGLE_AZ_2`):

- `SINGLE_AZ_1`: 128 to 4,096 MBps (1 HA pair only)
- `MULTI_AZ_1`: 128 to 4,096 MBps (1 HA pair only)
- `MULTI_AZ_2`: 384 to 6,144 MBps (1 HA pair only)
- `SINGLE_AZ_2`: 1,536 to (6,144 * `haPairs`) MBps, up to 73,728 MBps with 12 HA pairs

`throughputCapacity` divided by `haPairs` must equal one of the valid per-HA-pair values
listed in the [Throughput Capacity](#throughput-capacity) section above (the per-HA-pair set
is discrete; values inside the range that don't divide evenly are rejected by FSx).

The two properties are mutually exclusive, set exactly one of them:

```ts
declare const vpc: ec2.Vpc;

new fsx.OntapFileSystem(this, 'OntapFileSystem', {
  vpc,
  vpcSubnets: [vpc.privateSubnets[0]],
  storageCapacityGiB: 12288,
  ontapConfiguration: {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
    haPairs: 2,
    throughputCapacity: 6144, // total MBps across all HA pairs
  },
});
```

### Active Directory join with Secrets Manager

Storage Virtual Machines can join a self-managed Active Directory domain. The domain-join service account credentials
can be supplied either inline (`userName` + `password`) or via a Secrets Manager secret using
`domainJoinServiceAccountSecret` (recommended). The two flows are mutually exclusive:

```ts
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

declare const fileSystem: fsx.OntapFileSystem;
declare const adServiceAccountSecret: secretsmanager.ISecret;

// FSx for ONTAP must be allowed to read the secret at SVM-create time. Without this
// resource policy the SVM creation fails at deploy with `Could not retrieve secret`.
adServiceAccountSecret.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['secretsmanager:GetSecretValue'],
  principals: [new iam.ServicePrincipal('fsx.amazonaws.com')],
  resources: ['*'],
}));

new fsx.OntapStorageVirtualMachine(this, 'Svm', {
  fileSystem,
  name: 'svm1',
  activeDirectoryConfiguration: {
    netBiosName: 'SVM1',
    selfManagedActiveDirectoryConfiguration: {
      dnsIps: ['10.0.0.10', '10.0.0.11'],
      domainName: 'corp.example.com',
      domainJoinServiceAccountSecret: adServiceAccountSecret,
    },
  },
});
```

The secret must contain a JSON blob with the keys
`CUSTOMER_MANAGED_ACTIVE_DIRECTORY_USERNAME` and
`CUSTOMER_MANAGED_ACTIVE_DIRECTORY_PASSWORD`, as required by FSx for ONTAP.

> **Customer-managed KMS keys:** If the secret is encrypted with a
> customer-managed KMS key (rather than the default AWS-managed key), you must
> *also* grant `fsx.amazonaws.com` `kms:Decrypt` permission on that key.
> Without this, SVM creation fails at deploy with `Could not retrieve secret`.
> The most common AD-join deploy-time failures stem from this missing KMS grant.

See [Storing Active Directory credentials in AWS Secrets Manager](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/self-managed-AD-best-practices.html#bp-store-ad-creds-using-secret-manager).

### SnapLock (WORM/Compliance) Volumes

SnapLock provides write-once, read-many (WORM) storage for regulatory compliance and ransomware protection. Configure
SnapLock at volume-creation time via `snaplockConfiguration`:

```ts
declare const svm: fsx.OntapStorageVirtualMachine;

new fsx.OntapVolume(this, 'WormVolume', {
  storageVirtualMachine: svm,
  name: 'compliance_vol',
  sizeInBytes: 107374182400,
  junctionPath: '/compliance',
  snaplockConfiguration: {
    snaplockType: fsx.SnaplockType.ENTERPRISE,
    privilegedDelete: fsx.PrivilegedDelete.ENABLED,
    autocommitPeriod: { type: fsx.AutocommitPeriodType.DAYS, value: 7 },
    retentionPeriod: {
      defaultRetention: { type: fsx.RetentionPeriodType.YEARS, value: 7 },
      minimumRetention: { type: fsx.RetentionPeriodType.DAYS, value: 1 },
      maximumRetention: { type: fsx.RetentionPeriodType.INFINITE },
    },
  },
});
```

`SnaplockType.COMPLIANCE` mode forbids deletion until retention expires; `ENTERPRISE` mode permits privileged delete by
SnapLock administrators.

### Restoring a Volume from a Backup

To create a volume from an existing backup, set the `backupId` property:

```ts
declare const svm: fsx.OntapStorageVirtualMachine;

new fsx.OntapVolume(this, 'RestoredVolume', {
  storageVirtualMachine: svm,
  name: 'restored_vol',
  sizeInBytes: 107374182400,
  backupId: 'backup-1234567890abcdef0',
});
```

### Importing Existing Resources

An existing FSx for ONTAP file system can be imported using `fromOntapFileSystemAttributes`:

```ts
const sg = ec2.SecurityGroup.fromSecurityGroupId(this, 'FsxSecurityGroup', '{SECURITY-GROUP-ID}');
const fs = fsx.OntapFileSystem.fromOntapFileSystemAttributes(this, 'ImportedFileSystem', {
  dnsName: '{FILE-SYSTEM-DNS-NAME}',
  fileSystemId: '{FILE-SYSTEM-ID}',
  securityGroup: sg,
});

declare const instance: ec2.Instance;
fs.connections.allowDefaultPortFrom(instance);
```

`resourceArn` is optional on the import and only required if your stack reads
`fileSystem.resourceArn` (for example to compose ARNs for IAM grants or related
resources). Accessing `resourceArn` on an import that omitted it raises a
`ValidationError` so the misuse surfaces clearly at synth. Pass it for the full case:

```ts
const sg = ec2.SecurityGroup.fromSecurityGroupId(this, 'FsxSecurityGroup', '{SECURITY-GROUP-ID}');
const fsWithArn = fsx.OntapFileSystem.fromOntapFileSystemAttributes(this, 'ImportedFileSystemWithArn', {
  dnsName: '{FILE-SYSTEM-DNS-NAME}',
  fileSystemId: '{FILE-SYSTEM-ID}',
  resourceArn: '{FILE-SYSTEM-ARN}',
  securityGroup: sg,
});

// fsWithArn.resourceArn is now safe to read in IAM grants and ARN composition.
```

### Common Pitfalls

A few configurations that the L2 catches at synth time, with the fix:

- **Multi-AZ requires exactly 2 subnets in different AZs.** Pass `vpcSubnets: [vpc.privateSubnets[0], vpc.privateSubnets[1]]` and set `preferredSubnet`.
- **Single-AZ requires exactly 1 subnet** and `preferredSubnet` must not be set.
- **`haPairs` greater than 1 is only valid on `SINGLE_AZ_2`.** Other deployment types are single-HA-pair only.
- **`throughputCapacity` divided by `haPairs` must equal a valid per-HA-pair value** for the deployment type. The per-HA-pair set is discrete, see [Throughput Capacity](#throughput-capacity).
- **`throughputCapacity` and `throughputCapacityPerHaPair` are mutually exclusive.** Set exactly one of them.
- **`endpointIpv6AddressRange` requires `networkType: NetworkType.DUAL`.**
- **DP volumes do not accept `storageEfficiencyEnabled`.** Drop the prop on `OntapVolumeType.DP` volumes.
- **FlexGroup volumes require `aggregateConfiguration`** and FlexVol volumes must not have it.
- **`junctionPath` must start with `/` and cannot be `/`** (the SVM root namespace), end with `/`, or contain `//`.
- **Volume `name` must begin with a letter or underscore and contain only ASCII letters, digits, and underscore.** Hyphens, dots, and spaces are rejected at deploy with an opaque `BadRequest`. Use `my_volume`, not `my-volume`.
- **SVM `name` must begin with a letter and contain only ASCII letters, digits, and underscore.** Same shape as the volume rule, except the leading character must be a letter (no leading underscore).

A few that the L2 cannot catch at synth, with the fix:

- **`Could not retrieve secret` when creating an SVM with `domainJoinServiceAccountSecret`.** The secret needs an explicit resource policy granting `secretsmanager:GetSecretValue` to the `fsx.amazonaws.com` service principal. See [Active Directory join with Secrets Manager](#active-directory-join-with-secrets-manager).
- **Same `Could not retrieve secret` error when the secret is encrypted with a customer-managed KMS key.** Grant `kms:Decrypt` on the key to the `fsx.amazonaws.com` service principal.
- **`Minimum storage capacity for ONTAP FlexGroup volumes is 100 GiB per constituent` on `SINGLE_AZ_2` with `haPairs > 1`.** When `haPairs > 1`, FSx implicitly spreads the volume across HA pairs as a multi-constituent FlexGroup. The default layout is **8 constituents per HA pair** (NetApp's default) and FSx enforces a per-constituent minimum of **100 GiB**, so the per-volume floor is `8 * haPairs * 100 GiB`. For `haPairs=2`, that is **1600 GiB minimum**. The CDK only sees the file system's `haPairs` from `OntapFileSystem`, not from the volume props, so this floor is not enforced at synth. Size accordingly.

## FSx for Windows File Server

The L2 construct for the FSx for Windows File Server has not yet been implemented. To instantiate an FSx for Windows
file system, the L1 constructs can be used as defined by CloudFormation.
