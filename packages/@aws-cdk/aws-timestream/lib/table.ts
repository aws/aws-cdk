import { UnknownPrincipal, IGrantable, Grant } from '@aws-cdk/aws-iam';
import { IKey } from '@aws-cdk/aws-kms';
import { IBucket } from '@aws-cdk/aws-s3';
import { ArnFormat, Duration, IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IDatabase } from './database';
import { EncryptionOptions } from './enums';
import { CfnTable, CfnTableProps } from './timestream.generated';

/**
 * Table Interface
 */
export interface ITable extends IResource {
  /**
   * Table ARN
   *
   * @attribute
   */
  readonly tableArn: string;

  /**
   * Table Name
   *
   * @attribute
   */
  readonly tableName: string;

  /**
   * Database Name
   */
  readonly databaseName: string


  /**
   * Grant Permissions to read from the Table
   * @param identity
   */
  grantRead(identity: IGrantable): Grant

  /**
    * Grant Permissions to read & write to the Table
    * @param identity
    */
  grantReadWrite(identity: IGrantable): Grant


}

/**
 * Table Properties
 */
export interface TableProps {
  /**
   * The name of the Timestream database that contains this table.
   */
  readonly database: IDatabase,

  /**
  * A boolean flag to enable magnetic store writes.
  * @default true, when DataLocation is set
  */
  readonly magneticWriteEnable?: boolean

  /**
   * The name of the S3 bucket, to write rejected Data to
   * @default no Bucket
   */
  readonly magneticWriteBucket?: IBucket,

  /**
   * The encryption option for the S3 location, to write rejected Data to. Valid values are S3 server-side encryption with an S3 managed key (SSE_S3) or AWS managed key (SSE_KMS).
   * @default SSE_S3
   */
  readonly magneticWriteEncryptionOption?: EncryptionOptions,

  /**
   * The AWS KMS key to use when encrypting with an AWS managed key, upon rejected data write
   *
   * @default None
   */
  readonly magneticWriteKey?: IKey,

  /**
   * The prefix to use option for the objects stored in S3, upon rejected magnetic write
   *
   * @default None
   */
  readonly magneticWriteObjectKeyPrefix?: string

  /**
  * Retention duration for memory store.
  * @default default lifecycle
  */
  readonly memoryStoreRetentionPeriod?: Duration

  /**
  * Retention duration for magnetic store.
  * @default default lifecycle
  */
  readonly magneticStoreRetentionPeriod?: Duration

  /**
   * The name of the Timestream table.
   *
   * @default None
   */
  readonly tableName?: string
}

abstract class TableBase extends Resource implements ITable {

  /**
   * References a table object via its ARN
   *
   * @param scope CDK construct
   * @param id The ID of the construct
   * @param tableArn The table ARN to reference
   * @returns Table construct
   */
  public static fromTableArn(scope: Construct, id: string, tableArn: string): ITable {
    const stack = Stack.of(scope);
    const splitArn = stack.splitArn(tableArn, ArnFormat.SLASH_RESOURCE_NAME);

    const re = /(?<database>.*?)\/table\/(?<table>.*)/;
    const groups = splitArn.resourceName?.match(re)?.groups;

    class Import extends TableBase {
      public readonly tableArn = tableArn;
      public readonly tableName = groups?.table || ''
      public readonly databaseName = groups?.database || ''
      public readonly grantPrincipal = new UnknownPrincipal({ resource: this });
    }
    return new Import(scope, id, {
      environmentFromArn: tableArn,
    });
  }

  public abstract readonly tableArn: string;
  public abstract readonly tableName: string;
  public abstract readonly databaseName: string;

  grantReadWrite(grantee: IGrantable) {
    return Grant.addToPrincipal({
      grantee,
      actions: ['timestream:Select', 'timestream:ListMeasures', 'timestream:DescribeTable', 'timestream:WriteRecords'],
      resourceArns: [this.tableArn],
    });
  }


  grantRead(grantee: IGrantable) {
    return Grant.addToPrincipal({
      grantee,
      actions: ['timestream:Select', 'timestream:ListMeasures', 'timestream:DescribeTable'],
      resourceArns: [this.tableArn],
    });
  }


}

/**
 * Timestream Table in Database
 */
export class Table extends TableBase {
  /**
   * Table ARN
   *
   * @attribute
   */
  public readonly tableArn: string;

  /**
   * Table Name
   *
   * @attribute
   */
  public readonly tableName: string;

  /**
   * Database Name
   */
  public readonly databaseName: string;

  constructor(scope: Construct, id: string, props: TableProps) {
    super(scope, id, {
      physicalName: props.tableName,
    });

    this.node.addDependency(props.database);

    if (props.magneticWriteEnable && !props.magneticWriteBucket?.bucketName) {
      throw Error('If enable for MagneticStoreWrites is true magneticWriteBucket must be defined.');
    }

    let cfnTableProps: CfnTableProps = {
      databaseName: props.database.databaseName,
      tableName: props.tableName,
    };

    if (props.memoryStoreRetentionPeriod && props.magneticStoreRetentionPeriod) {
      (cfnTableProps.retentionProperties as any) = {
        memoryStoreRetentionPeriodInHours: props.memoryStoreRetentionPeriod.toHours().toString(),
        magneticStoreRetentionPeriodInDays: props.magneticStoreRetentionPeriod.toDays().toString(),
      };


    }

    if (props.magneticWriteEnable && props.magneticWriteBucket?.bucketName) {

      (cfnTableProps.magneticStoreWriteProperties as any) = {
        enableMagneticStoreWrites: !!props.magneticWriteEnable ? props.magneticWriteEnable : true,
        magneticStoreRejectedDataLocation: {
          s3Configuration: {
            bucketName: props.magneticWriteBucket.bucketName,
            encryptionOption: props.magneticWriteEncryptionOption || EncryptionOptions.SSE_S3,
            kmsKeyId: props.magneticWriteKey?.keyId,
            objectKeyPrefix: props.magneticWriteObjectKeyPrefix,
          },
        },
      };
    }


    const resource = new CfnTable(this, 'Resource', cfnTableProps);
    // resource.node.addDependency(props.database);

    this.tableArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'timestream',
      resource: this.physicalName,
    });
    // does not use the ref, because of the ref behaving strange:
    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#aws-resource-timestream-table-return-values
    this.tableName = this.getResourceNameAttribute(resource.attrName);
    this.databaseName = resource.databaseName;
  }
}