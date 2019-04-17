import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import s3 = require('@aws-cdk/aws-s3');
import { CfnOutput, Construct, IResource, Resource } from '@aws-cdk/cdk';
import { DataFormat } from './data-format';
import { IDatabase } from './database';
import { CfnTable } from './glue.generated';
import { Column } from './schema';

export interface ITable extends IResource {
  readonly tableArn: string;
  readonly tableName: string;

  export(): TableImportProps;
}

/**
 * Encryption options for a Table.
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/encryption.html
 */
export enum TableEncryption {
  Unencrypted = 'Unencrypted',

  /**
   * Server side encryption (SSE) with an Amazon S3-managed key.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html
   */
  S3Managed = 'SSE-S3',

  /**
   * Server-side encryption (SSE) with an AWS KMS key managed by the account owner.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html
   */
  Kms = 'SSE-KMS',

  /**
   * Server-side encryption (SSE) with an AWS KMS key managed by the KMS service.
   */
  KmsManaged = 'SSE-KMS-MANAGED',

  /**
   * Client-side encryption (CSE) with an AWS KMS key managed by the account owner.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingClientSideEncryption.html
   */
  ClientSideKms = 'CSE-KMS'
}

export interface TableImportProps {
  readonly tableArn: string;
  readonly tableName: string;
}

export interface TableProps {
  /**
   * Name of the table.
   */
  readonly tableName: string;

  /**
   * Description of the table.
   *
   * @default generated
   */
  readonly description?: string;

  /**
   * Database in which to store the table.
   */
  readonly database: IDatabase;

  /**
   * S3 bucket in which to store data.
   *
   * @default one is created for you
   */
  readonly bucket?: s3.IBucket;

  /**
   * S3 prefix under which table objects are stored.
   *
   * @default data/
   */
  readonly s3Prefix?: string;

  /**
   * Columns of the table.
   */
  readonly columns: Column[];

  /**
   * Partition columns of the table.
   *
   * @default table is not partitioned
   */
  readonly partitionKeys?: Column[]

  /**
   * Storage type of the table's data.
   */
  readonly dataFormat: DataFormat;

  /**
   * Indicates whether the table's data is compressed or not.
   *
   * @default false
   */
  readonly compressed?: boolean;

  /**
   * The kind of encryption to secure the data with.
   *
   * You can only provide this option if you are not explicitly passing in a bucket.
   *
   * If you choose `SSE-KMS`, you *can* provide an un-managed KMS key with `encryptionKey`.
   * If you choose `CSE-KMS`, you *must* provide an un-managed KMS key with `encryptionKey`.
   *
   * @default Unencrypted
   */
  readonly encryption?: TableEncryption;

  /**
   * External KMS key to use for bucket encryption.
   *
   * The `encryption` property must be `SSE-KMS` or `CSE-KMS`.
   *
   * @default key is managed by KMS.
   */
  readonly encryptionKey?: kms.IEncryptionKey;

  /**
   * Indicates whether the table data is stored in subdirectories.
   *
   * @default false
   */
  readonly storedAsSubDirectories?: boolean;
}

/**
 * A Glue table.
 */
export class Table extends Resource implements ITable {
  /**
   * Creates a Table construct that represents an external table.
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param props A `TableImportProps` object. Can be obtained from a call to `table.export()` or manually created.
   */
  public static import(scope: Construct, id: string, props: TableImportProps): ITable {
    return new ImportedTable(scope, id, props);
  }

  /**
   * Database this table belongs to.
   */
  public readonly database: IDatabase;

  /**
   * The type of encryption enabled for the table.
   */
  public readonly encryption: TableEncryption;

  /**
   * The KMS key used to secure the data if `encryption` is set to `CSE-KMS` or `SSE-KMS`. Otherwise, `undefined`.
   */
  public readonly encryptionKey?: kms.IEncryptionKey;

  /**
   * S3 bucket in which the table's data resides.
   */
  public readonly bucket: s3.IBucket;

  /**
   * S3 Key Prefix under which this table's files are stored in S3.
   */
  public readonly s3Prefix: string;

  /**
   * Name of this table.
   */
  public readonly tableName: string;

  /**
   * ARN of this table.
   */
  public readonly tableArn: string;

  /**
   * Format of this table's data files.
   */
  public readonly dataFormat: DataFormat;

  /**
   * This table's columns.
   */
  public readonly columns: Column[];

  /**
   * This table's partition keys if the table is partitioned.
   */
  public readonly partitionKeys?: Column[];

  constructor(scope: Construct, id: string, props: TableProps) {
    super(scope, id);

    this.database = props.database;
    this.dataFormat = props.dataFormat;
    this.s3Prefix = props.s3Prefix || 'data/';

    validateSchema(props.columns, props.partitionKeys);
    this.columns = props.columns;
    this.partitionKeys = props.partitionKeys;

    const {bucket, encryption, encryptionKey} = createBucket(this, props);
    this.bucket = bucket;
    this.encryption = encryption;
    this.encryptionKey = encryptionKey;

    const tableResource = new CfnTable(this, 'Table', {
      catalogId: props.database.catalogId,

      databaseName: props.database.databaseName,

      tableInput: {
        name: props.tableName,
        description: props.description || `${props.tableName} generated by CDK`,

        partitionKeys: renderColumns(props.partitionKeys),

        parameters: {
          has_encrypted_data: this.encryption !== TableEncryption.Unencrypted
        },
        storageDescriptor: {
          location: `s3://${this.bucket.bucketName}/${this.s3Prefix}`,
          compressed: props.compressed === undefined ? false : props.compressed,
          storedAsSubDirectories: props.storedAsSubDirectories === undefined ? false : props.storedAsSubDirectories,
          columns: renderColumns(props.columns),
          inputFormat: props.dataFormat.inputFormat.className,
          outputFormat: props.dataFormat.outputFormat.className,
          serdeInfo: {
            serializationLibrary: props.dataFormat.serializationLibrary.className
          },
        },

        tableType: 'EXTERNAL_TABLE'
      }
    });

    this.tableName = tableResource.tableName;
    this.tableArn = `${this.database.databaseArn}/${this.tableName}`;
  }

  public export(): TableImportProps {
    return {
      tableName: new CfnOutput(this, 'TableName', { value: this.tableName }).makeImportValue().toString(),
      tableArn: new CfnOutput(this, 'TableArn', { value: this.tableArn }).makeImportValue().toString(),
    };
  }

  /**
   * Grant read permissions to the table and the underlying data stored in S3 to an IAM principal.
   *
   * @param grantee the principal
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    const ret = this.grant(grantee, readPermissions);
    if (this.encryptionKey && this.encryption === TableEncryption.ClientSideKms) { this.encryptionKey.grantDecrypt(grantee); }
    this.bucket.grantRead(grantee, this.s3Prefix);
    return ret;
  }

  /**
   * Grant write permissions to the table and the underlying data stored in S3 to an IAM principal.
   *
   * @param grantee the principal
   */
  public grantWrite(grantee: iam.IGrantable): iam.Grant {
    const ret = this.grant(grantee, writePermissions);
    if (this.encryptionKey && this.encryption === TableEncryption.ClientSideKms) { this.encryptionKey.grantEncrypt(grantee); }
    this.bucket.grantWrite(grantee, this.s3Prefix);
    return ret;
  }

  /**
   * Grant read and write permissions to the table and the underlying data stored in S3 to an IAM principal.
   *
   * @param grantee the principal
   */
  public grantReadWrite(grantee: iam.IGrantable): iam.Grant {
    const ret = this.grant(grantee, [...readPermissions, ...writePermissions]);
    if (this.encryptionKey && this.encryption === TableEncryption.ClientSideKms) { this.encryptionKey.grantEncryptDecrypt(grantee); }
    this.bucket.grantReadWrite(grantee, this.s3Prefix);
    return ret;
  }

  private grant(grantee: iam.IGrantable, actions: string[]) {
    return iam.Grant.addToPrincipal({
      grantee,
      resourceArns: [this.tableArn],
      actions,
    });
  }
}

function validateSchema(columns: Column[], partitionKeys?: Column[]): void {
  if (columns.length === 0) {
    throw new Error('you must specify at least one column for the table');
  }
  // Check there is at least one column and no duplicated column names or partition keys.
  const names = new Set<string>();
  (columns.concat(partitionKeys || [])).forEach(column => {
    if (names.has(column.name)) {
      throw new Error(`column names and partition keys must be unique, but 'p1' is duplicated`);
    }
    names.add(column.name);
  });
}

// map TableEncryption to bucket's SSE configuration (s3.BucketEncryption)
const encryptionMappings = {
  [TableEncryption.S3Managed]: s3.BucketEncryption.S3Managed,
  [TableEncryption.KmsManaged]: s3.BucketEncryption.KmsManaged,
  [TableEncryption.Kms]: s3.BucketEncryption.Kms,
  [TableEncryption.ClientSideKms]: s3.BucketEncryption.Unencrypted,
  [TableEncryption.Unencrypted]: s3.BucketEncryption.Unencrypted,
};

// create the bucket to store a table's data depending on the `encryption` and `encryptionKey` properties.
function createBucket(table: Table, props: TableProps) {
  const encryption = props.encryption || TableEncryption.Unencrypted;
  let bucket = props.bucket;

  if (bucket && (encryption !== TableEncryption.Unencrypted && encryption !== TableEncryption.ClientSideKms)) {
    throw new Error('you can not specify encryption settings if you also provide a bucket');
  }

  let encryptionKey: kms.IEncryptionKey | undefined;
  if (encryption === TableEncryption.ClientSideKms && props.encryptionKey === undefined) {
    // CSE-KMS should behave the same as SSE-KMS - use the provided key or create one automatically
    // Since Bucket only knows about SSE, we repeat the logic for CSE-KMS at the Table level.
    encryptionKey = new kms.EncryptionKey(table, 'Key');
  } else {
    encryptionKey = props.encryptionKey;
  }

  // create the bucket if none was provided
  if (!bucket) {
    if (encryption === TableEncryption.ClientSideKms) {
      bucket = new s3.Bucket(table, 'Bucket');
    } else {
      bucket = new s3.Bucket(table, 'Bucket', {
        encryption: encryptionMappings[encryption],
        encryptionKey
      });
      encryptionKey = bucket.encryptionKey;
    }
  }

  return {
    bucket,
    encryption,
    encryptionKey
  };
}

const readPermissions = [
  'glue:BatchDeletePartition',
  'glue:BatchGetPartition',
  'glue:GetPartition',
  'glue:GetPartitions',
  'glue:GetTable',
  'glue:GetTables',
  'glue:GetTableVersions'
];

const writePermissions = [
  'glue:BatchCreatePartition',
  'glue:BatchDeletePartition',
  'glue:CreatePartition',
  'glue:DeletePartition',
  'glue:UpdatePartition'
];

function renderColumns(columns?: Array<Column | Column>) {
  if (columns === undefined) {
    return undefined;
  }
  return columns.map(column => {
    return {
      name: column.name,
      type: column.type.inputString,
      comment: column.comment
    };
  });
}

class ImportedTable extends Construct implements ITable {
  public readonly tableArn: string;
  public readonly tableName: string;

  constructor(scope: Construct, id: string, private readonly props: TableImportProps) {
    super(scope, id);
    this.tableArn = props.tableArn;
    this.tableName = props.tableName;
  }

  public export(): TableImportProps {
    return this.props;
  }
}
