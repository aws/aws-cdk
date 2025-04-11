# Amazon S3 Tables Construct Library

<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

## Amazon S3 Tables

Amazon S3 Tables deliver the first cloud object store with built-in Apache Iceberg support and streamline storing tabular data at scale.

[Product Page](https://aws.amazon.com/s3/features/tables/) | [User Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables.html)


## Usage

### Define an S3 Table Bucket

```ts
// Build a Table bucket
const tableBucket = new TableBucket(scope, 'ExampleTableBucket', {
    tableBucketName: 'example-bucket-1',
    // optional fields:
    unreferencedFileRemoval: {
        status: UnreferencedFileRemovalStatus.ENABLED,
        noncurrentDays: 20,
        unreferencedDays: 20,
    }
});
```

Learn more about table buckets maintenance operations and default behavior from the [S3 Tables User Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-table-buckets-maintenance.html)

### Controlling Table Bucket Permissions

```ts
// Grant the principal read permissions to the bucket and all tables within
const accountId = '123456789012'
tableBucket.grantRead(new iam.AccountPrincipal(accountId), '*');
// Grant the role write permissions to the bucket and all tables within
tableBucket.grantWrite(new iam.Role(stack, 'MyRole'), '*');
// Grant the user read and write permissions to the bucket and all tables within 
tableBucket.grantReadWrite(new iam.User(stack, 'MyUser'), '*');

// Grant permissions to the bucket and a particular table within it
const tableId = '6ba046b2-26de-44cf-9144-0c7862593a7b'
tableBucket.grantReadWrite(new iam.AccountPrincipal(accountId), tableId);

// Add custom resource policy statements
const permissions = new iam.PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['s3tables:*'],
    principals: [ new iam.ServicePrincipal('example.aws.internal') ],
    resources: ['*']
});

tableBucket.addToResourcePolicy(permissions);
```

## Coming Soon

L2 Construct support for:

- Namespaces
- Tables
