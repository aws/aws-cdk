import { UnknownPrincipal, IGrantable, Grant } from '@aws-cdk/aws-iam';
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
 * S3 Configuration
 */
export interface MagneticS3Configuration {
  /**
   * The name of the S3 bucket.
   */
  readonly bucket: IBucket,

  /**
   * The encryption option for the S3 location. Valid values are S3 server-side encryption with an S3 managed key (SSE_S3) or AWS managed key (SSE_KMS).
   */
  readonly encryptionOption: EncryptionOptions,

  /**
   * The AWS KMS key ID to use when encrypting with an AWS managed key.
   *
   * @default None
   */
  readonly kmsKeyId?: string,

  /**
   * The prefix to use option for the objects stored in S3.
   *
   * @default None
   */
  readonly objectKeyPrefix?: string
}

/**
 * The location to write error reports for records rejected, asynchronously, during magnetic store writes. Only S3Configuration objects are allowed
 */
export interface MagneticStoreRejectedDataLocation {
  /**
   * S3 Configuration
   */
  readonly s3Configuration: MagneticS3Configuration
}

/**
 * Contains properties to set on the table when enabling magnetic store writes.
 */
export interface MagneticStoreWriteProperties {
  /**
   * A boolean flag to enable magnetic store writes.
   */
  readonly enableMagneticStoreWrites: boolean

  /**
   * The location to write error reports for records rejected, asynchronously, during magnetic store writes. Only S3Configuration objects are allowed
   *
   * @default None
   */
  readonly magneticStoreRejectedDataLocation?: MagneticStoreRejectedDataLocation
}

/**
 * The retention duration for the memory store and magnetic store. This object has the following attributes:
 */
export interface RetentionProperties {
  /**
   * Retention duration for memory store.
   */
  readonly memoryStoreRetentionPeriod: Duration

  /**
   * Retention duration for magnetic store.
   */
  readonly magneticStoreRetentionPeriod: Duration
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
   * Contains properties to set on the table when enabling magnetic store writes.
   *
   * @default None
   */
  readonly magneticStoreWriteProperties?: MagneticStoreWriteProperties,

  /**
   * The retention duration for the memory store and magnetic store. This object has the following attributes:
   *
   * @default None
   */
  readonly retentionProperties?: RetentionProperties

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

    if (props.magneticStoreWriteProperties?.enableMagneticStoreWrites && !props.magneticStoreWriteProperties.magneticStoreRejectedDataLocation) {
      throw Error('If enableMagneticStoreWrites is true magneticStoreRejectedDataLocation must be defined.');
    }

    const cfnTableProps: CfnTableProps = {
      databaseName: props.database.databaseName,
      tableName: props.tableName,
    };

    if (props.retentionProperties !== undefined) {
      cfnTableProps.retentionProperties.memoryStoreRetentionPeriodInHours =
        props.retentionProperties.memoryStoreRetentionPeriod.toHours().toString();
      cfnTableProps.retentionProperties.magneticStoreRetentionPeriodInDays =
        props.retentionProperties.magneticStoreRetentionPeriod.toDays().toString();
    }

    if (cfnTableProps.magneticStoreWriteProperties) {
      cfnTableProps.magneticStoreWriteProperties.magneticStoreRejectedDataLocation.s3Configuration.bucketName =
      props.magneticStoreWriteProperties?.magneticStoreRejectedDataLocation?.s3Configuration.bucket.bucketName;

      cfnTableProps.magneticStoreWriteProperties.magneticStoreRejectedDataLocation.s3Configuration.encryptionOption =
      props.magneticStoreWriteProperties?.magneticStoreRejectedDataLocation?.s3Configuration.encryptionOption;

      cfnTableProps.magneticStoreWriteProperties.magneticStoreRejectedDataLocation.s3Configuration.kmsKeyId =
      props.magneticStoreWriteProperties?.magneticStoreRejectedDataLocation?.s3Configuration.kmsKeyId;

      cfnTableProps.magneticStoreWriteProperties.magneticStoreRejectedDataLocation.s3Configuration.objectKeyPrefix =
      props.magneticStoreWriteProperties?.magneticStoreRejectedDataLocation?.s3Configuration.objectKeyPrefix;
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