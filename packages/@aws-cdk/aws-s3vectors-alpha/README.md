# AWS S3 Vectors Construct Library (Alpha)

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

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

Amazon S3 Vectors delivers purpose-built, cost-optimized vector storage for semantic search and AI applications.

## Installation

Install the module:

```sh
npm install @aws-cdk/aws-s3vectors-alpha
```

## Usage

### Creating a Vector Bucket

```ts
const vectorBucket = new s3vectors.VectorBucket(this, 'MyVectorBucket');
```

### Creating a Vector Index

```ts
const vectorBucket = new s3vectors.VectorBucket(this, 'MyVectorBucket');

const index = new s3vectors.Index(this, 'MyIndex', {
  vectorBucket,
  dimension: 1536,
  distanceMetric: s3vectors.DistanceMetric.COSINE,
});
```

### Index Encryption

By default, a vector index uses the encryption configuration of its vector bucket. You can override this by specifying encryption settings at the index level.

#### S3 Managed Encryption (SSE-S3)

```ts
const vectorBucket = new s3vectors.VectorBucket(this, 'MyVectorBucket');

const index = new s3vectors.Index(this, 'MyIndex', {
  vectorBucket,
  dimension: 1536,
  encryption: s3vectors.IndexEncryption.S3_MANAGED,
});
```

#### KMS Encryption (SSE-KMS)

With auto-generated KMS key:

```ts
const vectorBucket = new s3vectors.VectorBucket(this, 'MyVectorBucket');

const index = new s3vectors.Index(this, 'MyIndex', {
  vectorBucket,
  dimension: 1536,
  encryption: s3vectors.IndexEncryption.KMS,
});
```

With a customer-managed KMS key:

```ts
const key = new kms.Key(this, 'MyKey');
const vectorBucket = new s3vectors.VectorBucket(this, 'MyVectorBucket');

const index = new s3vectors.Index(this, 'MyIndex', {
  vectorBucket,
  dimension: 1536,
  encryption: s3vectors.IndexEncryption.KMS,
  encryptionKey: key,
});
```

## Contributing

See [CONTRIBUTING](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md) for more information.

## License

This project is licensed under the Apache-2.0 License.
