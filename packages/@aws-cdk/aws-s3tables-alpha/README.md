# Amazon S3 Tables Construct Library
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

## Amazon S3 Tables

Amazon S3 Tables deliver the first cloud object store with built-in Apache Iceberg support and streamline storing tabular data at scale.

[Product Page](https://aws.amazon.com/s3/features/tables/) | [User Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables.html)


## Usage

### Define an S3 Table Bucket

```ts
// Build a Table bucket
const sampleTableBucket = new TableBucket(scope, 'ExampleTableBucket', {
    tableBucketName: 'example-bucket-1',
    // optional fields:
    unreferencedFileRemoval: {
        status: UnreferencedFileRemovalStatus.ENABLED,
        noncurrentDays: 20,
        unreferencedDays: 20,
    }
});
```

### Define an S3 Tables Namespace

```ts
// Build a namespace
const sampleNamespace = new Namespace(scope, 'ExampleNamespace', {
    namespaceName: 'example-namespace-1',
    tableBucket: tableBucket,
});
```

### Define an S3 Table

```ts
// Build a table
const sampleTable = new Table(scope, 'ExampleTable', {
    tableName: 'example_table',
    namespace: namespace,
    openTableFormat: OpenTableFormat.ICEBERG,
    withoutMetadata: true,
});

// Build a table with an Iceberg Schema
const sampleTableWithSchema = new Table(scope, 'ExampleSchemaTable', {
    tableName: 'example_table_with_schema',
    namespace: namespace,
    openTableFormat: OpenTableFormat.ICEBERG,
    icebergMetadata: {
        icebergSchema: {
            schemaFieldList: [
            {
                name: 'id',
                type: 'int',
                required: true,
            },
            {
                name: 'name',
                type: 'string',
            },
            ],
        },
    },
    compaction: {
        status: Status.ENABLED,
        targetFileSizeMb: 128,
    },
    snapshotManagement: {
        status: Status.ENABLED,
        maxSnapshotAgeHours: 48,
        minSnapshotsToKeep: 5,
    },
});
```

Learn more about table buckets maintenance operations and default behavior from the [S3 Tables User Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-table-buckets-maintenance.html)

### Controlling Table Bucket Permissions

```ts
// Grant the principal read permissions to the bucket and all tables within
const accountId = '123456789012'
tableBucket.grantRead(new iam.AccountPrincipal(accountId), '*');

// Grant the role write permissions to the bucket and all tables within
const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('sample') });
tableBucket.grantWrite(role, '*');

// Grant the user read and write permissions to the bucket and all tables within 
tableBucket.grantReadWrite(new iam.User(stack, 'MyUser'), '*');

// Grant permissions to the bucket and a particular table within it
const tableId = '6ba046b2-26de-44cf-9144-0c7862593a7b'
tableBucket.grantReadWrite(new iam.AccountPrincipal(accountId), tableId);

// Add custom resource policy statements
const permissions = new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ['s3tables:*'],
    principals: [ new iam.ServicePrincipal('example.aws.internal') ],
    resources: ['*']
});

tableBucket.addToResourcePolicy(permissions);
```

### Controlling Table Bucket Encryption Settings

S3 TableBuckets have SSE (server-side encryption with AES-256) enabled by default with S3 managed keys.
You can also bring your own KMS key for KMS-SSE or have S3 create a KMS key for you.

If a bucket is encrypted with KMS, grant functions on the bucket will also grant access
to the TableBucket's associated KMS key.

```ts
// Provide a user defined KMS Key:
const key = new kms.Key(scope, 'UserKey', {});
const encryptedBucket = new TableBucket(scope, 'EncryptedTableBucket', {
    tableBucketName: 'table-bucket-1',
    encryption: TableBucketEncryption.KMS,
    encryptionKey: key,
});
// This account principal will also receive kms:Decrypt access to the KMS key
encryptedBucket.grantRead(new iam.AccountPrincipal('123456789012'), '*');

// Use S3 managed server side encryption (default)
const encryptedBucketDefault = new TableBucket(scope, 'EncryptedTableBucketDefault', {
    tableBucketName: 'table-bucket-3',
    encryption: TableBucketEncryption.S3_MANAGED, // Uses AES-256 encryption by default
});
```

When using KMS encryption (`TableBucketEncryption.KMS`), if no encryption key is provided, CDK will automatically create a new KMS key for the table bucket with necessary permissions.

```ts
// If no key is provided, one will be created automatically
const encryptedBucketAuto = new TableBucket(scope, 'EncryptedTableBucketAuto', {
    tableBucketName: 'table-bucket-2',
    encryption: TableBucketEncryption.KMS,
});
```

### Controlling Table Permissions

```ts
// Grant the principal read permissions to the table
const accountId = '123456789012'
table.grantRead(new iam.AccountPrincipal(accountId));

// Grant the role write permissions to the table
const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('sample') });
table.grantWrite(role);

// Grant the user read and write permissions to the table 
table.grantReadWrite(new iam.User(stack, 'MyUser'));

// Grant an account permissions to the table
table.grantReadWrite(new iam.AccountPrincipal(accountId));

// Add custom resource policy statements
const permissions = new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ['s3tables:*'],
    principals: [ new iam.ServicePrincipal('example.aws.internal') ],
    resources: ['*']
});

table.addToResourcePolicy(permissions);
```

## Coming Soon

L2 Construct support for:

- KMS encryption support for Tables
