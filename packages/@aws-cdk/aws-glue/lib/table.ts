import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { IDatabase } from './database';
import { CfnTable } from './glue.generated';
import { Column } from './schema';
import { StorageType } from './storage-type';

export interface ITable extends cdk.IConstruct {
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
  Unencrypted = 'Unecrypted',

  /**
   * Server side encryption (SSE) with an Amazon S3-managed key.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html
   */
  SSE_S3 = 'SSE-S3',

  /**
   * Server-side encryption (SSE) with an AWS KMS key managed by KMS.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html
   */
  SSE_KMS = 'SSE-KMS',

  /**
   * Server-side encryption (SSE) with an AWS KMS key managed by the account owner.
   */
  SSE_KMS_MANAGED = 'SSE-KMS-MANAGED',

  /**
   * Client-side encryption (CSE) with an AWS KMS key managed by the account owner.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingClientSideEncryption.html
   */
  CSE_KMS = 'CSE-KMS'
}

export interface TableImportProps {
  tableArn: string;
  tableName: string;
}

export interface TableProps {
  /**
   * Name of the table.
   */
  tableName: string;

  /**
   * Description of the table.
   *
   * @default generated
   */
  description?: string;

  /**
   * Database in which to store the table.
   */
  database: IDatabase;

  /**
   * S3 bucket in which to store data.
   *
   * @default one is created for you
   */
  bucket?: s3.IBucket;

  /**
   * S3 prefix under which table objects are stored.
   *
   * @default data/
   */
  s3Prefix?: string;

  /**
   * Columns of the table.
   */
  columns: Column[];

  /**
   * Partition columns of the table.
   *
   * @default table is not partitioned
   */
  partitionKeys?: Column[]

  /**
   * Storage type of the table's data.
   */
  storageType: StorageType;

  /**
   * Indicates whether the table's data is compressed or not.
   *
   * @default false
   */
  compressed?: boolean;

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
  encryption?: TableEncryption;

  /**
   * External KMS key to use for bucket encryption.
   *
   * The `encryption` property must be `SSE-KMS` or `CSE-KMS`.
   *
   * @default key is managed by KMS.
   */
  encryptionKey?: kms.IEncryptionKey;

  /**
   * Indicates whether the table data is stored in subdirectories.
   *
   * @default false
   */
  storedAsSubDirectories?: boolean;
}

/**
 * A Glue table.
 */
export class Table extends cdk.Construct implements ITable {
  /**
   * Creates a Table construct that represents an external table.
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param props A `TableImportProps` object. Can be obtained from a call to `table.export()` or manually created.
   */
  public static import(scope: cdk.Construct, id: string, props: TableImportProps): ITable {
    return new ImportedTable(scope, id, props);
  }

  public readonly database: IDatabase;
  public readonly encryption: TableEncryption;
  public readonly encryptionKey?: kms.IEncryptionKey;
  public readonly bucket: s3.IBucket;
  public readonly prefix: string;

  public readonly tableName: string;
  public readonly tableArn: string;

  public readonly storageType: StorageType;
  public readonly columns: Column[];
  public readonly partitionKeys?: Column[];

  constructor(scope: cdk.Construct, id: string, props: TableProps) {
    validateProps(props);
    super(scope, id);

    this.database = props.database;
    this.encryption = props.encryption === undefined ? TableEncryption.Unencrypted : props.encryption;
    if (props.bucket) {
      this.bucket = props.bucket;
    } else {
      const bucketProps: s3.BucketProps = {};
      bucketProps.encryption = encryptionMappings[this.encryption];
      if (this.encryption === TableEncryption.CSE_KMS) {
        if (props.encryptionKey === undefined) {
          this.encryptionKey = new kms.EncryptionKey(this, 'Key');
        } else {
          this.encryptionKey = props.encryptionKey;
        }
      } else {
        bucketProps.encryptionKey = props.encryptionKey;
      }
      this.bucket = new s3.Bucket(this, 'Bucket', bucketProps);
      if (!this.encryptionKey) {
        this.encryptionKey = this.bucket.encryptionKey;
      }
    }

    this.storageType = props.storageType;
    this.prefix = props.s3Prefix || 'data/';
    this.columns = props.columns;
    this.partitionKeys = props.partitionKeys;

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
          location: cdk.Fn.join('', ['s3://', this.bucket.bucketName, '/', this.prefix]),
          compressed: props.compressed === undefined ? false : props.compressed,
          storedAsSubDirectories: props.storedAsSubDirectories === undefined ? false : props.storedAsSubDirectories,
          columns: renderColumns(props.columns),
          inputFormat: props.storageType.inputFormat.className,
          outputFormat: props.storageType.outputFormat.className,
          serdeInfo: {
            serializationLibrary: props.storageType.serializationLibrary.className
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
      tableName: new cdk.Output(this, 'TableName', { value: this.tableName }).makeImportValue().toString(),
      tableArn: new cdk.Output(this, 'TableArn', { value: this.tableArn }).makeImportValue().toString(),
    };
  }

  /**
   * Grant read permissions to the table and the underlying data stored in S3 to an IAM principal.
   *
   * @param identity the principal
   */
  public grantRead(identity: iam.IPrincipal): void {
    this.grant(identity, {
      permissions: readPermissions,
      kmsActions: ['kms:Decrypt']
    });
    this.bucket.grantRead(identity, this.prefix);
  }

  /**
   * Grant write permissions to the table and the underlying data stored in S3 to an IAM principal.
   *
   * @param identity the principal
   */
  public grantWrite(identity: iam.IPrincipal): void {
    this.grant(identity, {
      permissions: writePermissions,
      kmsActions: ['kms:Encrypt', 'kms:GenerateDataKey']
    });
    this.bucket.grantWrite(identity, this.prefix);
  }

  /**
   * Grant read and write permissions to the table and the underlying data stored in S3 to an IAM principal.
   *
   * @param identity the principal
   */
  public grantReadWrite(identity: iam.IPrincipal): void {
    this.grant(identity, {
      permissions: readPermissions.concat(writePermissions),
      kmsActions: ['kms:Decrypt', 'kms:Encrypt', 'kms:GenerateDataKey']
    });
    this.bucket.grantReadWrite(identity, this.prefix);
  }

  private grant(identity: iam.IPrincipal, props: {
    permissions: string[];
    kmsActions?: string[]; // TODO: this should be a grant method on the key itself.
  }) {
    identity.addToPolicy(new iam.PolicyStatement()
      .addResource(this.tableArn)
      .addActions(...props.permissions));
    if (this.encryption === TableEncryption.CSE_KMS) {
      identity.addToPolicy(new iam.PolicyStatement()
        .addResource(this.encryptionKey!.keyArn)
        .addActions(...props.kmsActions!));
    }
  }
}

/**
 * Check there is at least one column and no duplicated column names or partition keys.
 *
 * @param props the TableProps
 */
function validateProps(props: TableProps): void {
  if (props.bucket && (props.encryption || props.encryptionKey)) {
    throw new Error('you can not specify both an encryption key and s3 bucket');
  }
  if (props.columns.length === 0) {
    throw new Error('you must specify at least one column for the table');
  }
  const names = new Set<string>();
  (props.columns.concat(props.partitionKeys || [])).forEach(column => {
    if (names.has(column.name)) {
      throw new Error(`column names and partition keys must be unique, but 'p1' is duplicated`);
    }
    names.add(column.name);
  });
}

const encryptionMappings = {
  [TableEncryption.SSE_S3]: s3.BucketEncryption.S3Managed,
  [TableEncryption.SSE_KMS_MANAGED]: s3.BucketEncryption.KmsManaged,
  [TableEncryption.SSE_KMS]: s3.BucketEncryption.Kms,
  [TableEncryption.CSE_KMS]: s3.BucketEncryption.Unencrypted,
  [TableEncryption.Unencrypted]: s3.BucketEncryption.Unencrypted,
};

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

class ImportedTable extends cdk.Construct implements ITable {
  public readonly tableArn: string;
  public readonly tableName: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: TableImportProps) {
    super(scope, id);
    this.tableArn = props.tableArn;
    this.tableName = props.tableName;
  }

  public export(): TableImportProps {
    return this.props;
  }
}
