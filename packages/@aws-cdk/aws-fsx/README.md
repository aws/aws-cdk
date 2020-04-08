## Amazon FSx Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module.**
>
> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib))
> are auto-generated from CloudFormation. They are stable and safe to use.
>
> However, all other classes, i.e., higher level constructs, are under active development and subject to non-backward
> compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model.
> This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

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

```ts
import fsx = require('@aws-cdk/aws-fsx');
```

### Basic Usage

Setup required properties and create:

```ts
const stack = new Stack(app, 'Stack');
const vpc = new Vpc(stack, 'VPC');

const fileSystem = new LustreFileSystem(stack, 'FsxLustreFileSystem', {
  lustreConfiguration: { deploymentType: LustreDeploymentType.SCRATCH_2 },
  storageCapacityGiB: 1200,
  vpc,
  vpcSubnet: vpc.privateSubnets[0]});
```

### Connecting

To control who can access the file system, use the `.connections` attribute. FSx has a fixed default port, so you don't
need to specify the port. This example allows an EC2 instance to connect to a file system:

```ts
fileSystem.connections.allowDefaultPortFrom(instance);
```

### Mounting

To mount an FSx for Lustre file system programmatically, the mount name of the file system needs to be determined. The
easiest way to do that is with the AWS CLI, which can be written into a User Data script to be run on start-up of your
instance. The following example can be used for reference on how to bring up a file system and EC2 instance with the
file system mounted on the instance at start-up:

```ts
const app = new App();
const stack = new Stack(app, 'AwsCdkFsxLustre');
const vpc = new Vpc(stack, 'VPC');

const lustreConfiguration = {
  deploymentType: LustreDeploymentType.SCRATCH_2,
};
const fs = new LustreFileSystem(stack, 'FsxLustreFileSystem', {
  lustreConfiguration,
  storageCapacityGiB: 1200,
  vpc,
  vpcSubnet: vpc.privateSubnets[0]});

const inst = new Instance(stack, 'inst', {
  instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.LARGE),
  machineImage: new AmazonLinuxImage({
    generation: AmazonLinuxGeneration.AMAZON_LINUX_2
  }),
  vpc,
  vpcSubnets: {
    subnetType: SubnetType.PUBLIC,
  }
});
inst.connections.securityGroups.forEach((securityGroup => {
    fs.connections.addSecurityGroup(securityGroup);
}));
// Need to give the instance access to read information about FSx to determine the file system's mount name.
inst.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonFSxReadOnlyAccess"));

// Add a dependency on the file system to the instance so that we can be sure the file system is instantiated before querying
// for its mount name.
if (fs.node.defaultChild) {
  inst.node.addDependency(fs.node.defaultChild);
}

const mountPath = '/mnt/fsx';
const dnsName = fs.dnsName;

inst.userData.addCommands(
  'set -eux',
  'yum update -y',
  'amazon-linux-extras install -y lustre2.10',
  // The version of the AWS CLI currently on AL2 doesn't surface the required MountName field, so install the latest version.
  'curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"',
  'unzip awscliv2.zip',
  './aws/install',
  // Call the AWS CLI and extract the mount name.
  `mountName=$(/usr/local/bin/aws fsx describe-file-systems --output text --query 'FileSystems[?DNSName==\`${dnsName}\`].LustreConfiguration.MountName')`,
  // Set up the directory to mount the file system to and change the owner to the AL2 default ec2-user.
  `mkdir -p ${mountPath}`,
  `chmod 777 ${mountPath}`,
  `chown ec2-user:ec2-user ${mountPath}`,
  // Set the file system up to mount automatically on start up and mount it.
  `echo "${dnsName}@tcp:/$mountName ${mountPath} lustre defaults,noatime,flock,_netdev 0 0" >> /etc/fstab`,
  `mount -a`);
```

### Importing

An FSx for Lustre file system can be imported with `fromLustreFileSystemAttributes(stack, id, attributes)`. The
following example lays out how you could import the SecurityGroup a file system belongs to, use that to import the file
system, and then also import the VPC the file system is in and add an EC2 instance to it, giving it access to the file
system.

```ts
const app = new App();
const stack = new Stack(app, 'AwsCdkFsxLustreImport');

const sg = SecurityGroup.fromSecurityGroupId(stack, 'FsxSecurityGroup', '{SECURITY-GROUP-ID}');
const fs = LustreFileSystem.fromLustreFileSystemAttributes(stack, 'FsxLustreFileSystem', {
    dnsName: '{FILE-SYSTEM-DNS-NAME}'
    fileSystemId: '{FILE-SYSTEM-ID}',
    securityGroup: sg
});

const vpc = Vpc.fromVpcAttributes(stack, 'Vpc', {
    availabilityZones: ['us-west-2a', 'us-west-2b'],
    publicSubnetIds: ['{US-WEST-2A-SUBNET-ID}', '{US-WEST-2B-SUBNET-ID}'],
    vpcId: '{VPC-ID}'
});
const inst = new Instance(stack, 'inst', {
  instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.LARGE),
  machineImage: new AmazonLinuxImage({
    generation: AmazonLinuxGeneration.AMAZON_LINUX_2
  }),
  vpc,
  vpcSubnets: {
    subnetType: SubnetType.PUBLIC,
  }
});

inst.connections.securityGroups.forEach((securityGroup => {
  fs.connections.addSecurityGroup(securityGroup);
}));
```

## FSx for Windows File Server

The L2 construct for the FSx for Windows File Server has not yet been implemented. To instantiate an FSx for Windows
file system, the L1 constructs can be used as defined by CloudFormation.
