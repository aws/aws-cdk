# AWS Glue Construct Library
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

## Job

A `Job` encapsulates a script that connects to data sources, processes them, and then writes output to a data target.

There are 3 types of jobs supported by AWS Glue: Spark ETL, Spark Streaming, and Python Shell jobs.

The `glue.JobExecutable` allows you to specify the type of job, the language to use and the code assets required by the job.

`glue.Code` allows you to refer to the different code assets required by the job, either from an existing S3 location or from a local file path.

### Spark Jobs

These jobs run in an Apache Spark environment managed by AWS Glue.

#### ETL Jobs

An ETL job processes data in batches using Apache Spark.

```ts
declare const bucket: s3.Bucket;
new glue.Job(this, 'ScalaSparkEtlJob', {
  executable: glue.JobExecutable.scalaEtl({
    glueVersion: glue.GlueVersion.V4_0,
    script: glue.Code.fromBucket(bucket, 'src/com/example/HelloWorld.scala'),
    className: 'com.example.HelloWorld',
    extraJars: [glue.Code.fromBucket(bucket, 'jars/HelloWorld.jar')],
  }),
  description: 'an example Scala ETL job',
});
```

#### Streaming Jobs

A Streaming job is similar to an ETL job, except that it performs ETL on data streams. It uses the Apache Spark Structured Streaming framework. Some Spark job features are not available to streaming ETL jobs.

```ts
new glue.Job(this, 'PythonSparkStreamingJob', {
  executable: glue.JobExecutable.pythonStreaming({
    glueVersion: glue.GlueVersion.V4_0,
    pythonVersion: glue.PythonVersion.THREE,
    script: glue.Code.fromAsset(path.join(__dirname, 'job-script/hello_world.py')),
  }),
  description: 'an example Python Streaming job',
});
```

### Python Shell Jobs

A Python shell job runs Python scripts as a shell and supports a Python version that depends on the AWS Glue version you are using.
This can be used to schedule and run tasks that don't require an Apache Spark environment. Currently, three flavors are supported:

* PythonVersion.TWO (2.7; EOL)
* PythonVersion.THREE (3.6)
* PythonVersion.THREE_NINE (3.9)

```ts
declare const bucket: s3.Bucket;
new glue.Job(this, 'PythonShellJob', {
  executable: glue.JobExecutable.pythonShell({
    glueVersion: glue.GlueVersion.V1_0,
    pythonVersion: glue.PythonVersion.THREE,
    script: glue.Code.fromBucket(bucket, 'script.py'),
  }),
  description: 'an example Python Shell job',
});
```

### Ray Jobs

These jobs run in a Ray environment managed by AWS Glue.

```ts
new glue.Job(this, 'RayJob', {
  executable: glue.JobExecutable.pythonRay({
    glueVersion: glue.GlueVersion.V4_0,
    pythonVersion: glue.PythonVersion.THREE_NINE,
    script: glue.Code.fromAsset(path.join(__dirname, 'job-script/hello_world.py')),
  }),
  workerType: glue.WorkerType.Z_2X,
  workerCount: 2,
  description: 'an example Ray job'
});
```

See [documentation](https://docs.aws.amazon.com/glue/latest/dg/add-job.html) for more information on adding jobs in Glue.

## Connection

A `Connection` allows Glue jobs, crawlers and development endpoints to access certain types of data stores. For example, to create a network connection to connect to a data source within a VPC:

```ts
declare const securityGroup: ec2.SecurityGroup;
declare const subnet: ec2.Subnet;
new glue.Connection(this, 'MyConnection', {
  type: glue.ConnectionType.NETWORK,
  // The security groups granting AWS Glue inbound access to the data source within the VPC
  securityGroups: [securityGroup],
  // The VPC subnet which contains the data source
  subnet,
});
```

For RDS `Connection` by JDBC, it is recommended to manage credentials using AWS Secrets Manager. To use Secret, specify `SECRET_ID` in `properties` like the following code. Note that in this case, the subnet must have a route to the AWS Secrets Manager VPC endpoint or to the AWS Secrets Manager endpoint through a NAT gateway.

```ts
declare const securityGroup: ec2.SecurityGroup;
declare const subnet: ec2.Subnet;
declare const db: rds.DatabaseCluster;
new glue.Connection(this, "RdsConnection", {
  type: glue.ConnectionType.JDBC,
  securityGroups: [securityGroup],
  subnet,
  properties: {
    JDBC_CONNECTION_URL: `jdbc:mysql://${db.clusterEndpoint.socketAddress}/databasename`,
    JDBC_ENFORCE_SSL: "false",
    SECRET_ID: db.secret!.secretName,
  },
});
```

If you need to use a connection type that doesn't exist as a static member on `ConnectionType`, you can instantiate a `ConnectionType` object, e.g: `new glue.ConnectionType('NEW_TYPE')`.

See [Adding a Connection to Your Data Store](https://docs.aws.amazon.com/glue/latest/dg/populate-add-connection.html) and [Connection Structure](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-catalog-connections.html#aws-glue-api-catalog-connections-Connection) documentation for more information on the supported data stores and their configurations.

## SecurityConfiguration

A `SecurityConfiguration` is a set of security properties that can be used by AWS Glue to encrypt data at rest.

```ts
new glue.SecurityConfiguration(this, 'MySecurityConfiguration', {
  cloudWatchEncryption: {
    mode: glue.CloudWatchEncryptionMode.KMS,
  },
  jobBookmarksEncryption: {
    mode: glue.JobBookmarksEncryptionMode.CLIENT_SIDE_KMS,
  },
  s3Encryption: {
    mode: glue.S3EncryptionMode.KMS,
  },
});
```

By default, a shared KMS key is created for use with the encryption configurations that require one. You can also supply your own key for each encryption config, for example, for CloudWatch encryption:

```ts
declare const key: kms.Key;
new glue.SecurityConfiguration(this, 'MySecurityConfiguration', {
  cloudWatchEncryption: {
    mode: glue.CloudWatchEncryptionMode.KMS,
    kmsKey: key,
  },
});
```

See [documentation](https://docs.aws.amazon.com/glue/latest/dg/encryption-security-configuration.html) for more info for Glue encrypting data written by Crawlers, Jobs, and Development Endpoints.

## Database

A `Database` is a logical grouping of `Tables` in the Glue Catalog.

```ts
new glue.Database(this, 'MyDatabase');
```

## Table

A Glue table describes a table of data in S3: its structure (column names and types), location of data (S3 objects with a common prefix in a S3 bucket), and format for the files (Json, Avro, Parquet, etc.):

```ts
declare const myDatabase: glue.Database;
new glue.Table(this, 'MyTable', {
  database: myDatabase,
  columns: [{
    name: 'col1',
    type: glue.Schema.STRING,
  }, {
    name: 'col2',
    type: glue.Schema.array(glue.Schema.STRING),
    comment: 'col2 is an array of strings' // comment is optional
  }],
  dataFormat: glue.DataFormat.JSON,
});
```

By default, a S3 bucket will be created to store the table's data but you can manually pass the `bucket` and `s3Prefix`:

```ts
declare const myBucket: s3.Bucket;
declare const myDatabase: glue.Database;
new glue.Table(this, 'MyTable', {
  bucket: myBucket,
  s3Prefix: 'my-table/',
  // ...
  database: myDatabase,
  columns: [{
    name: 'col1',
    type: glue.Schema.STRING,
  }],
  dataFormat: glue.DataFormat.JSON,
});
```

By default, an S3 bucket will be created to store the table's data and stored in the bucket root. You can also manually pass the `bucket` and `s3Prefix`:

### Partition Keys

To improve query performance, a table can specify `partitionKeys` on which data is stored and queried separately. For example, you might partition a table by `year` and `month` to optimize queries based on a time window:

```ts
declare const myDatabase: glue.Database;
new glue.Table(this, 'MyTable', {
  database: myDatabase,
  columns: [{
    name: 'col1',
    type: glue.Schema.STRING,
  }],
  partitionKeys: [{
    name: 'year',
    type: glue.Schema.SMALL_INT,
  }, {
    name: 'month',
    type: glue.Schema.SMALL_INT,
  }],
  dataFormat: glue.DataFormat.JSON,
});
```

### Partition Indexes

Another way to improve query performance is to specify partition indexes. If no partition indexes are
present on the table, AWS Glue loads all partitions of the table and filters the loaded partitions using
the query expression. The query takes more time to run as the number of partitions increase. With an
index, the query will try to fetch a subset of the partitions instead of loading all partitions of the
table.

The keys of a partition index must be a subset of the partition keys of the table. You can have a
maximum of 3 partition indexes per table. To specify a partition index, you can use the `partitionIndexes`
property:

```ts
declare const myDatabase: glue.Database;
new glue.Table(this, 'MyTable', {
  database: myDatabase,
  columns: [{
    name: 'col1',
    type: glue.Schema.STRING,
  }],
  partitionKeys: [{
    name: 'year',
    type: glue.Schema.SMALL_INT,
  }, {
    name: 'month',
    type: glue.Schema.SMALL_INT,
  }],
  partitionIndexes: [{
    indexName: 'my-index', // optional
    keyNames: ['year'],
  }], // supply up to 3 indexes
  dataFormat: glue.DataFormat.JSON,
});
```

Alternatively, you can call the `addPartitionIndex()` function on a table:

```ts
declare const myTable: glue.Table;
myTable.addPartitionIndex({
  indexName: 'my-index',
  keyNames: ['year'],
});
```

### Partition Filtering

If you have a table with a large number of partitions that grows over time, consider using AWS Glue partition indexing and filtering.

```ts
declare const myDatabase: glue.Database;
new glue.Table(this, 'MyTable', {
    database: myDatabase,
    columns: [{
        name: 'col1',
        type: glue.Schema.STRING,
    }],
    partitionKeys: [{
        name: 'year',
        type: glue.Schema.SMALL_INT,
    }, {
        name: 'month',
        type: glue.Schema.SMALL_INT,
    }],
    dataFormat: glue.DataFormat.JSON,
    enablePartitionFiltering: true,
});
```

## [Encryption](https://docs.aws.amazon.com/athena/latest/ug/encryption.html)

You can enable encryption on a Table's data:

* `Unencrypted` - files are not encrypted. The default encryption setting.
* [S3Managed](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html) - Server side encryption (`SSE-S3`) with an Amazon S3-managed key.

```ts
declare const myDatabase: glue.Database;
new glue.Table(this, 'MyTable', {
  encryption: glue.TableEncryption.S3_MANAGED,
  // ...
  database: myDatabase,
  columns: [{
    name: 'col1',
    type: glue.Schema.STRING,
  }],
  dataFormat: glue.DataFormat.JSON,
});
```

* [Kms](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html) - Server-side encryption (`SSE-KMS`) with an AWS KMS Key managed by the account owner.

```ts
declare const myDatabase: glue.Database;
// KMS key is created automatically
new glue.Table(this, 'MyTable', {
  encryption: glue.TableEncryption.KMS,
  // ...
  database: myDatabase,
  columns: [{
    name: 'col1',
    type: glue.Schema.STRING,
  }],
  dataFormat: glue.DataFormat.JSON,
});

// with an explicit KMS key
new glue.Table(this, 'MyTable', {
  encryption: glue.TableEncryption.KMS,
  encryptionKey: new kms.Key(this, 'MyKey'),
  // ...
  database: myDatabase,
  columns: [{
    name: 'col1',
    type: glue.Schema.STRING,
  }],
  dataFormat: glue.DataFormat.JSON,
});
```

* [KmsManaged](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html) - Server-side encryption (`SSE-KMS`), like `Kms`, except with an AWS KMS Key managed by the AWS Key Management Service.

```ts
declare const myDatabase: glue.Database;
new glue.Table(this, 'MyTable', {
  encryption: glue.TableEncryption.KMS_MANAGED,
  // ...
  database: myDatabase,
  columns: [{
    name: 'col1',
    type: glue.Schema.STRING,
  }],
  dataFormat: glue.DataFormat.JSON,
});
```

* [ClientSideKms](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingClientSideEncryption.html#client-side-encryption-kms-managed-master-key-intro) - Client-side encryption (`CSE-KMS`) with an AWS KMS Key managed by the account owner.

```ts
declare const myDatabase: glue.Database;
// KMS key is created automatically
new glue.Table(this, 'MyTable', {
  encryption: glue.TableEncryption.CLIENT_SIDE_KMS, 
  // ...
  database: myDatabase,
  columns: [{
    name: 'col1',
    type: glue.Schema.STRING,
  }],
  dataFormat: glue.DataFormat.JSON,
});

// with an explicit KMS key
new glue.Table(this, 'MyTable', {
  encryption: glue.TableEncryption.CLIENT_SIDE_KMS,
  encryptionKey: new kms.Key(this, 'MyKey'),
  // ...
  database: myDatabase,
  columns: [{
    name: 'col1',
    type: glue.Schema.STRING,
  }],
  dataFormat: glue.DataFormat.JSON,
});
```

*Note: you cannot provide a `Bucket` when creating the `Table` if you wish to use server-side encryption (`KMS`, `KMS_MANAGED` or `S3_MANAGED`)*.

## Types

A table's schema is a collection of columns, each of which have a `name` and a `type`. Types are recursive structures, consisting of primitive and complex types:

```ts
declare const myDatabase: glue.Database;
new glue.Table(this, 'MyTable', {
  columns: [{
    name: 'primitive_column',
    type: glue.Schema.STRING,
  }, {
    name: 'array_column',
    type: glue.Schema.array(glue.Schema.INTEGER),
    comment: 'array<integer>',
  }, {
    name: 'map_column',
    type: glue.Schema.map(
      glue.Schema.STRING,
      glue.Schema.TIMESTAMP),
    comment: 'map<string,string>',
  }, {
    name: 'struct_column',
    type: glue.Schema.struct([{
      name: 'nested_column',
      type: glue.Schema.DATE,
      comment: 'nested comment',
    }]),
    comment: "struct<nested_column:date COMMENT 'nested comment'>",
  }],
  // ...
  database: myDatabase,
  dataFormat: glue.DataFormat.JSON,
});  
```

### Primitives

#### Numeric

| Name      	| Type     	| Comments                                                                                                          |
|-----------	|----------	|------------------------------------------------------------------------------------------------------------------	|
| FLOAT     	| Constant 	| A 32-bit single-precision floating point number                                                                   |
| INTEGER   	| Constant 	| A 32-bit signed value in two's complement format, with a minimum value of -2^31 and a maximum value of 2^31-1 	|
| DOUBLE    	| Constant 	| A 64-bit double-precision floating point number                                                                   |
| BIG_INT   	| Constant 	| A 64-bit signed INTEGER in two’s complement format, with a minimum value of -2^63 and a maximum value of 2^63 -1  |
| SMALL_INT 	| Constant 	| A 16-bit signed INTEGER in two’s complement format, with a minimum value of -2^15 and a maximum value of 2^15-1   |
| TINY_INT  	| Constant 	| A 8-bit signed INTEGER in two’s complement format, with a minimum value of -2^7 and a maximum value of 2^7-1      |

#### Date and time

| Name      	| Type     	| Comments                                                                                                                                                                	|
|-----------	|----------	|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| DATE      	| Constant 	| A date in UNIX format, such as YYYY-MM-DD.                                                                                                                              	|
| TIMESTAMP 	| Constant 	| Date and time instant in the UNiX format, such as yyyy-mm-dd hh:mm:ss[.f...]. For example, TIMESTAMP '2008-09-15 03:04:05.324'. This format uses the session time zone. 	|

#### String

| Name                                       	| Type     	| Comments                                                                                                                                                                                          	|
|--------------------------------------------	|----------	|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| STRING                                     	| Constant 	| A string literal enclosed in single or double quotes                                                                                                                                              	|
| decimal(precision: number, scale?: number) 	| Function 	| `precision` is the total number of digits. `scale` (optional) is the number of digits in fractional part with a default of 0. For example, use these type definitions: decimal(11,5), decimal(15) 	|
| char(length: number)                       	| Function 	| Fixed length character data, with a specified length between 1 and 255, such as char(10)                                                                                                          	|
| varchar(length: number)                    	| Function 	| Variable length character data, with a specified length between 1 and 65535, such as varchar(10)                                                                                                  	|

#### Miscellaneous

| Name    	| Type     	| Comments                      	|
|---------	|----------	|-------------------------------	|
| BOOLEAN 	| Constant 	| Values are `true` and `false` 	|
| BINARY  	| Constant 	| Value is in binary            	|

### Complex

| Name                                	| Type     	| Comments                                                          	|
|-------------------------------------	|----------	|-------------------------------------------------------------------	|
| array(itemType: Type)               	| Function 	| An array of some other type                                       	|
| map(keyType: Type, valueType: Type) 	| Function 	| A map of some primitive key type to any value type                	|
| struct(collumns: Column[])          	| Function 	| Nested structure containing individually named and typed collumns 	|
