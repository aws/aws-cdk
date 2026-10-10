# Amazon S3 Vectors Construct Library
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

## Amazon S3 Vectors

Amazon S3 Vectors provides native vector storage in Amazon S3. A vector bucket
stores one or more vector indexes, which in turn store vectors used for
similarity search and retrieval-augmented generation (RAG) workloads.

[Product Page](https://aws.amazon.com/s3/features/vectors/) | [User Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors.html)

## Usage

### Define an S3 Vector Bucket

```ts
// Build a vector bucket
const sampleVectorBucket = new VectorBucket(scope, 'ExampleVectorBucket', {
  vectorBucketName: 'example-vector-bucket',
});
```

### Define a Vector Index

```ts
// Build a vector index inside a bucket
const sampleVectorIndex = new VectorIndex(scope, 'ExampleVectorIndex', {
  vectorBucket: vectorBucket,
  indexName: 'example-index',
  dimension: 1024,
  dataType: VectorDataType.FLOAT32,
  distanceMetric: DistanceMetric.COSINE,
});
```

### Non-filterable Metadata Keys

Metadata keys that should not be usable as filters during query time can be
declared on the index.

```ts
new VectorIndex(scope, 'IndexWithNonFilterableMetadata', {
  vectorBucket: vectorBucket,
  dimension: 768,
  dataType: VectorDataType.FLOAT32,
  distanceMetric: DistanceMetric.COSINE,
  nonFilterableMetadataKeys: ['source', 'author'],
});
```

### Controlling Bucket Encryption

S3 Vectors supports SSE-S3 (`S3_MANAGED`) or customer-managed KMS (`KMS`)
encryption.

Default (managed by S3):

```ts
new VectorBucket(scope, 'DefaultEncryption', {
  vectorBucketName: 'default-encryption',
});
```

Explicit SSE-S3:

```ts
new VectorBucket(scope, 'S3Encryption', {
  vectorBucketName: 's3-encryption',
  encryption: VectorBucketEncryption.S3_MANAGED,
});
```

KMS with a CDK-managed key:

```ts
new VectorBucket(scope, 'KmsAutoEncryption', {
  vectorBucketName: 'kms-auto-encryption',
  encryption: VectorBucketEncryption.KMS,
});
```

KMS with a user-supplied key:

```ts
declare const key: kms.IKey;
new VectorBucket(scope, 'KmsUserEncryption', {
  vectorBucketName: 'kms-user-encryption',
  encryption: VectorBucketEncryption.KMS,
  encryptionKey: key,
});
```

### Controlling Bucket Permissions

Use the `grant*` helpers to grant read or write access to the vector bucket and
its indexes. Each helper also grants the relevant KMS actions when the bucket
is encrypted with a customer-managed key.

By default, grants apply to the bucket and all indexes underneath it:

```ts
declare const role: iam.Role;
vectorBucket.grantRead(role);
vectorBucket.grantWrite(role);
vectorBucket.grantReadWrite(role);
```

Grant access only to a specific index by passing its name:

```ts
declare const role: iam.Role;
vectorBucket.grantReadWrite(role, 'my-index');
```

Attach a custom statement directly via `addToResourcePolicy`. A
`VectorBucketPolicy` is auto-created on the first call.

```ts
vectorBucket.addToResourcePolicy(new iam.PolicyStatement({
  actions: ['s3vectors:GetVectorBucket'],
  principals: [new iam.AccountPrincipal('123456789012')],
  resources: [vectorBucket.vectorBucketArn],
}));
```

### Controlling Index Permissions

Each index exposes its own grant helpers for vector data-plane actions.

```ts
declare const role: iam.Role;
vectorIndex.grantRead(role);
vectorIndex.grantWrite(role);
vectorIndex.grantReadWrite(role);
```
