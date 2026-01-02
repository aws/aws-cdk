# AWS::S3Express Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

```ts nofixture
import * as s3express from 'aws-cdk-lib/aws-s3express';
```

## S3 Express One Zone

Amazon S3 Express One Zone is a high-performance, single-Availability Zone storage class that delivers consistent single-digit millisecond data access. Directory buckets are designed for latency-sensitive applications requiring high transaction rates.

### Directory Buckets

Directory buckets provide up to 10x faster performance compared to S3 Standard, with request costs reduced by 50%.

#### Basic Usage

```ts
const bucket = new s3express.DirectoryBucket(this, 'MyDirectoryBucket', {
  location: {
    availabilityZone: 'us-east-1a',
  },
});

// Bucket name format: bucket-base-name--useast1-az1--x-s3
console.log(bucket.bucketName);
```

#### Encryption

Directory buckets support server-side encryption with either S3-managed keys (default) or AWS KMS keys:

```ts
// S3-managed encryption (default)
const bucketWithS3Encryption = new s3express.DirectoryBucket(this, 'S3Encrypted', {
  location: { availabilityZone: 'us-west-2a' },
  encryption: s3express.DirectoryBucketEncryption.S3_MANAGED,
});

// KMS encryption with customer-managed key
const encryptionKey = new kms.Key(this, 'BucketKey');
const bucketWithKMSEncryption = new s3express.DirectoryBucket(this, 'KMSEncrypted', {
  location: { availabilityZone: 'us-west-2a' },
  encryption: s3express.DirectoryBucketEncryption.KMS,
  encryptionKey: encryptionKey,
});
```

#### Data Redundancy

Choose between single Availability Zone or single Local Zone redundancy:

```ts
// Single Availability Zone (default)
const azBucket = new s3express.DirectoryBucket(this, 'AZBucket', {
  location: { availabilityZone: 'us-east-1a' },
  dataRedundancy: s3express.DataRedundancy.SINGLE_AVAILABILITY_ZONE,
});

// Single Local Zone
const lzBucket = new s3express.DirectoryBucket(this, 'LZBucket', {
  location: { localZone: 'us-west-2-lax-1a' },
  dataRedundancy: s3express.DataRedundancy.SINGLE_LOCAL_ZONE,
});
```

#### Granting Permissions

Grant read, write, or full access permissions to IAM principals:

```ts
const bucket = new s3express.DirectoryBucket(this, 'MyBucket', {
  location: { availabilityZone: 'us-east-1a' },
});

const readFunction = new lambda.Function(this, 'ReadFunction', {
  // ... function configuration
});

const writeFunction = new lambda.Function(this, 'WriteFunction', {
  // ... function configuration
});

// Grant read access
bucket.grantRead(readFunction);

// Grant write access
bucket.grantWrite(writeFunction);

// Grant full read/write access
bucket.grantReadWrite(readFunction);

// Grant read access to specific objects
bucket.grantRead(readFunction, 'prefix/*');
```

#### Importing Existing Buckets

Reference existing directory buckets by ARN or name:

```ts
// Import by ARN
const importedByArn = s3express.DirectoryBucket.fromBucketArn(
  this,
  'ImportedBucket',
  'arn:aws:s3express:us-east-1:123456789012:bucket/my-bucket--useast1-az1--x-s3'
);

// Import by bucket name
const importedByName = s3express.DirectoryBucket.fromBucketName(
  this,
  'ImportedBucket',
  'my-bucket--useast1-az1--x-s3'
);

// Use imported bucket
importedByArn.grantRead(someRole);
```

#### Bucket Policies

Apply resource policies to directory buckets:

```ts
const bucket = new s3express.DirectoryBucket(this, 'MyBucket', {
  location: { availabilityZone: 'us-east-1a' },
});

bucket.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['s3express:CreateSession'],
  resources: [bucket.bucketArn],
  principals: [new iam.AccountPrincipal('123456789012')],
}));
```

### Performance Considerations

- **Co-location**: For optimal performance, deploy compute resources (Lambda, ECS, EC2) in the same Availability Zone as your directory bucket
- **Latency**: Directory buckets provide consistent single-digit millisecond latency for data access
- **Throughput**: Supports hundreds of thousands of requests per second
- **Use Cases**: Ideal for ML training, financial modeling, real-time analytics, and media content creation

### Limitations

Directory buckets have some limitations compared to standard S3 buckets:

- No versioning support
- No website hosting
- No replication (CRR/SRR)
- No lifecycle policies
- No object lock
- Single-zone redundancy only

For more information, see the [CloudFormation documentation for AWS::S3Express](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_S3Express.html).

(Read the [CDK Contributing Guide](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md) and submit an RFC if you are interested in contributing to this construct library.)

<!--END CFNONLY DISCLAIMER-->
