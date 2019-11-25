## AWS Glue Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

### Connection

TODO

### Database

A `Database` is a logical grouping of `Tables` in the Glue Catalog.

```ts
new glue.Database(stack, 'MyDatabase', {
  databaseName: 'my_database'
});
```

By default, a S3 bucket is created and the Database is stored under  `s3://<bucket-name>/`, but you can manually specify another location:

```ts
new glue.Database(stack, 'MyDatabase', {
  databaseName: 'my_database',
  locationUri: 's3://explicit-bucket/some-path/'
});
```

### Job

TODO

### Table

A Glue table describes a table of data in S3: its structure (column names and types), location of data (S3 objects with a common prefix in a S3 bucket), and format for the files (Json, Avro, Parquet, etc.):

```ts
new glue.Table(stack, 'MyTable', {
  database: myDatabase,
  tableName: 'my_table',
  columns: [{
    name: 'col1',
    type: glue.Schema.string,
  }, {
    name: 'col2',
    type: glue.Schema.array(Schema.string),
    comment: 'col2 is an array of strings' // comment is optional
  }]
  dataFormat: glue.DataFormat.Json
});
```

By default, a S3 bucket will be created to store the table's data but you can manually pass the `bucket` and `s3Prefix`:

```ts
new glue.Table(stack, 'MyTable', {
  bucket: myBucket,
  s3Prefix: 'my-table/'
  ...
});
```

#### Partitions

To improve query performance, a table can specify `partitionKeys` on which data is stored and queried separately. For example, you might partition a table by `year` and `month` to optimize queries based on a time window:

```ts
new glue.Table(stack, 'MyTable', {
  database: myDatabase,
  tableName: 'my_table',
  columns: [{
    name: 'col1',
    type: glue.Schema.string
  }],
  partitionKeys: [{
    name: 'year',
    type: glue.Schema.smallint
  }, {
    name: 'month',
    type: glue.Schema.smallint
  }],
  dataFormat: glue.DataFormat.Json
});
```

### [Encryption](https://docs.aws.amazon.com/athena/latest/ug/encryption.html)

You can enable encryption on a Table's data:
* `Unencrypted` - files are not encrypted. The default encryption setting.
* [S3Managed](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html) - Server side encryption (`SSE-S3`) with an Amazon S3-managed key.
```ts
new glue.Table(stack, 'MyTable', {
  encryption: glue.TableEncryption.S3Managed
  ...
});
```
* [Kms](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html) - Server-side encryption (`SSE-KMS`) with an AWS KMS Key managed by the account owner.

```ts
// KMS key is created automatically
new glue.Table(stack, 'MyTable', {
  encryption: glue.TableEncryption.Kms
  ...
});

// with an explicit KMS key
new glue.Table(stack, 'MyTable', {
  encryption: glue.TableEncryption.Kms,
  encryptionKey: new kms.Key(stack, 'MyKey')
  ...
});
```
* [KmsManaged](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html) - Server-side encryption (`SSE-KMS`), like `Kms`, except with an AWS KMS Key managed by the AWS Key Management Service.
```ts
new glue.Table(stack, 'MyTable', {
  encryption: glue.TableEncryption.KmsManaged
  ...
});
```
* [ClientSideKms](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingClientSideEncryption.html#client-side-encryption-kms-managed-master-key-intro) - Client-side encryption (`CSE-KMS`) with an AWS KMS Key managed by the account owner.
```ts
// KMS key is created automatically
new glue.Table(stack, 'MyTable', {
  encryption: glue.TableEncryption.ClientSideKms
  ...
});

// with an explicit KMS key
new glue.Table(stack, 'MyTable', {
  encryption: glue.TableEncryption.ClientSideKms,
  encryptionKey: new kms.Key(stack, 'MyKey')
  ...
});
```

*Note: you cannot provide a `Bucket` when creating the `Table` if you wish to use server-side encryption (`Kms`, `KmsManaged` or `S3Managed`)*.

### Types

A table's schema is a collection of columns, each of which have a `name` and a `type`. Types are recursive structures, consisting of primitive and complex types:

```ts
new glue.Table(stack, 'MyTable', {
  columns: [{
    name: 'primitive_column',
    type: glue.Schema.string
  }, {
    name: 'array_column',
    type: glue.Schema.array(glue.Schema.integer),
    comment: 'array<integer>'
  }, {
    name: 'map_column',
    type: glue.Schema.map(
      glue.Schema.string,
      glue.Schema.timestamp),
    comment: 'map<string,string>'
  }, {
    name: 'struct_column',
    type: glue.Schema.struct([{
      name: 'nested_column',
      type: glue.Schema.date,
      comment: 'nested comment'
    }]),
    comment: "struct<nested_column:date COMMENT 'nested comment'>"
  }],
  ...
```

#### Primitive

Numeric:
* `bigint`
* `float`
* `integer`
* `smallint`
* `tinyint`

Date and Time:
* `date`
* `timestamp`

String Types:

* `string`
* `decimal`
* `char`
* `varchar`

Misc:
* `boolean`
* `binary`

#### Complex

* `array` - array of some other type
* `map` - map of some primitive key type to any value type.
* `struct` - nested structure containing individually named and typed columns.
