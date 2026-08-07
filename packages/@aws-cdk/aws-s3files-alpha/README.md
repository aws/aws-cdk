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

[Amazon S3 Files](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-files.html)
allows customers to access data in existing S3 general purpose buckets
as a POSIX-compliant file system using NFSv4. Data is lazily imported
from S3 when read through the file system, and modified files are
automatically exported back to the bucket after a short idle period.

## File System

Create an S3 Bucket backed by a File System:

```ts
declare const vpc: ec2.Vpc;
declare const bucket: s3.Bucket;

const fileSystem = new s3files.FileSystem(this, 'MyFileSystem', {
  bucket,
  vpcConfiguration: {
    vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
  },
});
```

The construct automatically:

* Creates mount targets in the specified subnets
* Creates a security group for NFS traffic (port 2049)
* Creates an IAM role with S3 bucket/object permissions and
  EventBridge permissions for the S3 Files service
* Sets `AcceptBucketWarning: true` on the CFN resource

## Encryption

Encrypt the file system with a customer-managed KMS key:

```ts
declare const vpc: ec2.Vpc;
declare const bucket: s3.Bucket;
declare const key: kms.Key;

const fileSystem = new s3files.FileSystem(this, 'MyFileSystem', {
  bucket,
  vpcConfiguration: {
    vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
  },
  kmsKey: key,
});
```

## Synchronization Configuration

Control how data is imported from S3 and when cached data expires:

```ts
declare const vpc: ec2.Vpc;
declare const bucket: s3.Bucket;

const fileSystem = new s3files.FileSystem(this, 'MyFileSystem', {
  bucket,
  vpcConfiguration: {
    vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
  },
  prefix: 'data/',
  synchronizationConfiguration: {
    importDataRules: [{
      prefix: '/',
      sizeLessThan: Size.gibibytes(1),
      trigger: s3files.ImportDataRuleTrigger.ON_FILE_ACCESS,
    }],
    dataExpiration: Duration.days(30),
  },
});
```

## Granting Access

Use the grants facade to authorize principals for NFS client operations:

```ts
declare const fileSystem: s3files.FileSystem;
declare const lambdaFunction: lambda.Function;

fileSystem.grants.read(lambdaFunction);
fileSystem.grants.readWrite(lambdaFunction);
fileSystem.grants.rootAccess(lambdaFunction);
```

## File System Policy

Add a resource policy to control NFS access:

```ts
declare const fileSystem: s3files.FileSystem;
declare const accessPoint: s3files.AccessPoint;

fileSystem.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['s3files:ClientMount'],
  principals: [new iam.AnyPrincipal()],
  conditions: {
    StringEquals: {
      's3files:AccessPointArn': accessPoint.accessPointArn,
    },
  },
}));
```

## Access Points

An access point is an application-specific view into a file system:

```ts
declare const fileSystem: s3files.FileSystem;

const accessPoint = fileSystem.addAccessPoint('AccessPoint', {
  path: '/lambda',
  createAcl: {
    ownerUid: '1000',
    ownerGid: '1000',
    permissions: '755',
  },
  posixUser: {
    uid: '1000',
    gid: '1000',
  },
});
```

## Importing Existing Resources

```ts
declare const securityGroup: ec2.SecurityGroup;

const fileSystem = s3files.FileSystem.fromFileSystemAttributes(
  this, 'ImportedFs', {
    fileSystemArn:
      'arn:aws:s3files:us-east-1:123456789012:file-system/fs-12345678',
    securityGroup,
  },
);

const accessPoint = s3files.AccessPoint.fromAccessPointId(
  this, 'ImportedAp', 'fsap-12345678',
);
```
