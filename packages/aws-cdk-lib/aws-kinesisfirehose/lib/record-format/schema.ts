import { Construct } from 'constructs';
import * as glue from '../../../aws-glue';
import * as iam from '../../../aws-iam';
import * as cdk from '../../../core';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';

/**
 * Options for creating a Schema to use in record format conversion
 */
export interface SchemaConfiguration {

  /**
   * Specifies the name of the AWS Glue database that contains the schema for the output data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-databasename
   */
  readonly databaseName: string;

  /**
   * The name of the AWS Glue table that contains the column information that constitutes your data schema.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-tablename
   */
  readonly tableName: string;

  /**
   * The ID of the AWS Glue Data Catalog.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-catalogid
   * @default the AWS account ID of the Firehose
   */
  readonly catalogId?: string;

  /**
   * If you don't specify an AWS Region, the default is the current Region.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-region
   *
   * @default current region of the Firehose
   */
  readonly databaseRegion?: string;

  /**
   * Specifies the table version for the output data schema.
   *
   * if set to `LATEST`, Firehose uses the most recent table version. This means that any updates to the table are automatically picked up.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-versionid
   * @default `LATEST`
   */
  readonly versionId?: string;
}

/**
 * Options when binding a Schema to a Destination
 */
export interface SchemaBindOptions {

  /**
   * The IAM Role to grant permissions to read the glue table schema to
   */
  readonly role: iam.IRole;
}

/**
 * Options for creating a Schema for record format conversion from a `glue.CfnTable`
 */
export interface SchemaFromCfnTableProps {

  /**
   * Specifies the table version for the output data schema.
   *
   * if set to `LATEST`, Firehose uses the most recent table version. This means that any updates to the table are automatically picked up.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-versionid
   * @default `LATEST`
   */
  readonly versionId?: string;

  /**
   * The region of the database.
   *
   * @default the region of the stack that contains the table reference is used
   */
  readonly region?: string;
}

/**
 * Represents a schema for Firehose S3 data record format conversion.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-dataformatconversionconfiguration.html#cfn-kinesisfirehose-deliverystream-dataformatconversionconfiguration-schemaconfiguration
 */
export class Schema {
  /**
   * Obtain schema for data record format conversion from an `aws_glue.CfnTable`
   */
  static fromCfnTable(table: glue.CfnTable, props?: SchemaFromCfnTableProps) {
    const stack = cdk.Stack.of(table);
    return new Schema({
      tableName: table.ref,
      databaseName: table.databaseName,
      databaseRegion: props?.region ?? stack.region,
      catalogId: table.catalogId,
      versionId: props?.versionId ?? 'LATEST',
    });
  }

  // Once Glue L2 constructs are stable, we can do something like the following to support it
  // static fromTable(table: glue.Table) {}

  /**
   * Configuration for creation of a Schema.
   */
  readonly config: SchemaConfiguration;

  public constructor(config: SchemaConfiguration) {
    this.config = config;
  }

  /**
   * Binds this Schema to the Destination, adding the necessary permissions to the Destination role.
   */
  public bind(
    scope: Construct,
    options: SchemaBindOptions,
  ): CfnDeliveryStream.SchemaConfigurationProperty {
    const stack = cdk.Stack.of(scope);
    const region = this.config.databaseRegion ?? stack.region;

    const catalogArn = stack.formatArn({
      service: 'glue',
      resource: 'catalog',
      region: region,
      account: this.config.catalogId,
    });

    const databaseArn = stack.formatArn({
      service: 'glue',
      resource: 'database',
      resourceName: this.config.databaseName,
      region: region,
      account: this.config.catalogId,
    });

    const tableArn = stack.formatArn({
      service: 'glue',
      resource: 'table',
      resourceName: `${this.config.databaseName}/${this.config.tableName}`,
      region: region,
      account: this.config.catalogId,
    });

    iam.Grant.addToPrincipal({
      actions: ['glue:GetTable', 'glue:GetTableVersion', 'glue:GetTableVersions'],
      grantee: options.role,
      resourceArns: [catalogArn, databaseArn, tableArn],
    });

    iam.Grant.addToPrincipal({
      actions: ['glue:GetSchemaVersion'],
      grantee: options.role,
      resourceArns: ['*'],
    });

    return {
      roleArn: options.role.roleArn,
      region: region,
      tableName: this.config.tableName,
      databaseName: this.config.databaseName,
      versionId: this.config.versionId,
      catalogId: this.config.catalogId,
    };
  }
}
