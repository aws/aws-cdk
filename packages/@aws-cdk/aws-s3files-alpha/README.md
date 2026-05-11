# Amazon S3 Files Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

[Amazon S3 Files](https://aws.amazon.com/s3/) lets you mount an Amazon S3 bucket as
a POSIX file system on EC2 instances in a VPC. This module provides L2 constructs for the
`AWS::S3Files::FileSystem`, `AWS::S3Files::AccessPoint`, `AWS::S3Files::MountTarget`, and
`AWS::S3Files::FileSystemPolicy` CloudFormation resources.

## Create an S3 Files file system

In its simplest form, an S3 Files file system needs an S3 bucket and a VPC. A mount target
is created in each Availability Zone of the VPC, and an IAM service role is generated
automatically with read/write access to the bucket.

```ts
const vpc = new ec2.Vpc(this, 'Vpc');
const bucket = new s3.Bucket(this, 'Bucket');

const fileSystem = new s3files.FileSystem(this, 'FileSystem', {
  bucket,
  vpc,
});
```

By default, the file system has a `RemovalPolicy.RETAIN` removal policy. To allow CDK
to delete the file system on stack removal, set `removalPolicy` to `DESTROY`.

```ts
declare const bucket: s3.IBucket;
declare const vpc: ec2.IVpc;

new s3files.FileSystem(this, 'FileSystem', {
  bucket,
  vpc,
  removalPolicy: RemovalPolicy.DESTROY,
});
```

## Limit the file system to a bucket prefix

Use `prefix` to scope the file system to a key prefix within the bucket. The prefix must
be empty or end with `/`. Set `acceptBucketWarning` if the AWS service emits a warning
that the bucket has properties that may incur additional cost or latency.

```ts
declare const bucket: s3.IBucket;
declare const vpc: ec2.IVpc;

new s3files.FileSystem(this, 'FileSystem', {
  bucket,
  vpc,
  prefix: 'projects/team-a/',
  acceptBucketWarning: true,
});
```

## Synchronization configuration

Synchronization rules describe which objects to import into the file system and when to
expire them. Sizes are expressed with `Size`, durations with `Duration`.

```ts
declare const bucket: s3.IBucket;
declare const vpc: ec2.IVpc;

new s3files.FileSystem(this, 'FileSystem', {
  bucket,
  vpc,
  synchronizationConfiguration: {
    importDataRules: [{
      prefix: 'incoming',
      sizeLessThan: Size.gibibytes(10),
      trigger: s3files.ImportDataTrigger.CONTINUOUS,
    }],
    expirationDataRules: [{
      afterLastAccess: Duration.days(30),
    }],
  },
});
```

## Custom IAM role

By default, a service role is created with read/write access to the backing bucket
(and KMS permissions when `kmsKey` is set). To use an existing role, pass it via
`role`. The role must trust `elasticfilesystem.amazonaws.com` (S3 Files reuses the
EFS service principal) and grant the S3 (and optional KMS) permissions S3 Files
needs to synchronize data; the L2 does not attach anything to a user-supplied
role.

```ts
declare const bucket: s3.IBucket;
declare const vpc: ec2.IVpc;
declare const role: iam.IRole;

new s3files.FileSystem(this, 'FileSystem', {
  bucket,
  vpc,
  role,
});
```

## Encryption with a customer managed KMS key

Provide a KMS key when the bucket is encrypted with SSE-KMS. The service role is granted
the KMS actions required by S3 Files (`kms:GenerateDataKey`, `kms:Encrypt`, `kms:Decrypt`,
`kms:ReEncryptFrom`, `kms:ReEncryptTo`) scoped via `kms:ViaService` and the bucket-ARN
encryption context.

```ts
declare const bucket: s3.IBucket;
declare const vpc: ec2.IVpc;
declare const key: kms.IKey;

new s3files.FileSystem(this, 'FileSystem', {
  bucket,
  vpc,
  kmsKey: key,
});
```

## Resource (file system) policy

A file system can have an attached resource policy. You can pass an initial document
through `resourcePolicy`, and add statements later with `addToResourcePolicy()`.
The `CfnFileSystemPolicy` is created lazily on the first statement, so a file system
without any resource-policy statements emits no policy resource.

```ts fixture=with-filesystem
fileSystem.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['s3files:ClientMount'],
  principals: [new iam.AccountPrincipal('123456789012')],
  resources: ['*'],
}));
```

> Resource policies cannot be added to file systems imported via
> `FileSystem.fromFileSystemAttributes()`; `addToResourcePolicy()` returns
> `{ statementAdded: false }` in that case.

## Granting permissions

Grants are exposed as a Facade on the file system: `fileSystem.grants`. Each method
returns an `iam.Grant`.

```ts fixture=with-filesystem
declare const taskRole: iam.IRole;

fileSystem.grants.mount(taskRole);
fileSystem.grants.write(taskRole);
fileSystem.grants.rootAccess(taskRole);
```

For custom action sets, use `actions()`:

```ts fixture=with-filesystem
declare const taskRole: iam.IRole;

fileSystem.grants.actions(taskRole, ['s3files:DescribeFileSystem']);
```

## Access points

An access point exposes a sub-tree of the file system with a fixed POSIX identity. Use
`addAccessPoint()` to create one against an existing file system.

```ts fixture=with-filesystem
fileSystem.addAccessPoint('AccessPoint', {
  path: '/projects/team-a',
  createAcl: { ownerUid: '1000', ownerGid: '1000', permissions: '0755' },
  posixUser: { uid: '1000', gid: '1000' },
});
```

You can also import an existing access point.

```ts
const ap = s3files.AccessPoint.fromAccessPointId(this, 'ImportedAP', 'fsap-1234567890abcdef0');
```

## Connecting from EC2

The file system is `IConnectable` and exposes a security group through `connections`.
Allow traffic from your instances on the default port (NFS, exposed as
`FileSystem.DEFAULT_PORT = 2049`):

```ts fixture=with-filesystem
declare const instance: ec2.Instance;
fileSystem.connections.allowDefaultPortFrom(instance);
```

## Waiting for mount targets

Mount targets are created asynchronously and a client may try to mount the file
system before they are ready. Use `mountTargetsAvailable` as a dependency to
ensure another resource only deploys after every mount target is available:

```ts fixture=with-filesystem
declare const instance: ec2.Instance;
instance.node.addDependency(fileSystem.mountTargetsAvailable);
```

## Importing an existing file system

```ts
declare const vpc: ec2.IVpc;
const sg = new ec2.SecurityGroup(this, 'SG', { vpc });

const imported = s3files.FileSystem.fromFileSystemAttributes(this, 'Imported', {
  fileSystemId: 'fs-1234567890abcdef0',
  securityGroup: sg,
});
```
