## Amazon Elastic File System Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

This construct library allows you to set up AWS Elastic File System (EFS).

```ts
import efs = require('@aws-cdk/aws-efs');

const myVpc = new ec2.Vpc(this, 'VPC');
const fileSystem = new efs.EfsFileSystem(this, 'MyEfsFileSystem', {
  vpc: myVpc,
  encrypted: true,
  lifecyclePolicy: EfsLifecyclePolicyProperty.AFTER_14_DAYS,
  performanceMode: EfsPerformanceMode.GENERAL_PURPOSE,
  throughputMode: EfsThroughputMode.BURSTING
});
```

### Connecting

To control who can access the EFS, use the `.connections` attribute. EFS has
a fixed default port, so you don't need to specify the port:

```ts
fileSystem.connections.allowDefaultPortFrom(instance);
```
### Mounting the file system using User Data

In order to automatically mount this file system during instance launch, 
following code can be used as reference:
```
const vpc = new ec2.Vpc(this, 'VPC');

const fileSystem = new efs.EfsFileSystem(this, 'EfsFileSystem', {
  vpc,
  encrypted: true,
  lifecyclePolicy: efs.EfsLifecyclePolicyProperty.AFTER_14_DAYS,
  performanceMode: efs.EfsPerformanceMode.GENERAL_PURPOSE,
  throughputMode: efs.EfsThroughputMode.BURSTING
});

const inst = new Instance(this, 'inst', {
  instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.LARGE),
  machineImage: new AmazonLinuxImage({
    generation: AmazonLinuxGeneration.AMAZON_LINUX_2
  }),
  vpc,
  vpcSubnets: {
    subnetType: SubnetType.PUBLIC,
  }
});

fileSystem.connections.allowDefaultPortFrom(inst);

inst.userData.addCommands("yum check-update -y",    // Ubuntu: apt-get -y update
  "yum upgrade -y",                                 // Ubuntu: apt-get -y upgrade
  "yum install -y amazon-efs-utils",                // Ubuntu: apt-get -y install amazon-efs-utils
  "yum install -y nfs-utils",                       // Ubuntu: apt-get -y install nfs-common
  "file_system_id_1=" + fileSystem.fileSystemId,
  "efs_mount_point_1=/mnt/efs/fs1",
  "mkdir -p \"${efs_mount_point_1}\"",
  "test -f \"/sbin/mount.efs\" && echo \"${file_system_id_1}:/ ${efs_mount_point_1} efs defaults,_netdev\" >> /etc/fstab || " +
  "echo \"${file_system_id_1}.efs." + cdk.Stack.of(this).region + ".amazonaws.com:/ ${efs_mount_point_1} nfs4 nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport,_netdev 0 0\" >> /etc/fstab",
  "mount -a -t efs,nfs4 defaults");
```

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.
