import { Construct } from 'constructs';
import * as glue from '../../../aws-glue';
import * as iam from '../../../aws-iam';
import * as core from '../../../core';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';

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

export interface SchemaBindOptions {

  /**
   * The IAM Role to grant permissions to read the glue table schema to
   */
  readonly role: iam.IRole;
}

export interface SchemaFromCfnTableProps {

  /**
   * Specifies the table version for the output data schema.
   *
   * if set to `LATEST`, Firehose uses the most recent table version. This means that any updates to the table are automatically picked up.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-versionid
   * @default `LATEST`
   */
  readonly versionId?: string,
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
    const stack = core.Stack.of(table);
    return new Schema({
      tableName: table.ref,
      databaseName: table.databaseName,
      databaseRegion: stack.region,
      catalogId: stack.account,
      versionId: props?.versionId ?? 'LATEST',
    });
  }

  // Once Glue L2 constructs are stable, we can do something like the following to support it
  // static fromTable(table: glue.Table) {}

  public constructor(readonly props: SchemaConfiguration) {}

  public bind(
    scope: Construct,
    options: SchemaBindOptions,
  ): CfnDeliveryStream.SchemaConfigurationProperty {
    const stack = core.Stack.of(scope);
    const region = this.props.databaseRegion ?? stack.region;

    const tableArn = stack.formatArn({
      service: 'glue',
      resource: 'table',
      resourceName: `${this.props.databaseName}/${this.props.tableName}`,
      region: region,
      account: this.props.catalogId,
    });

    iam.Grant.addToPrincipal({
      actions: [
        'glue:GetTable',
        'glue:GetTableVersion',
        'glue:GetTableVersions',
      ],
      grantee: options.role,
      resourceArns: [tableArn],
    });

    iam.Grant.addToPrincipal({
      actions: ['glue:GetSchemaVersion'],
      grantee: options.role,
      resourceArns: ['*'],
    });

    return {
      roleArn: options.role.roleArn,
      region: region,
      ...this.props,
    };
  }
}
