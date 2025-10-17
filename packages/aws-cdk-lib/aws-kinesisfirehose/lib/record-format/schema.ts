import { Construct } from 'constructs';
import * as glue from '../../../aws-glue';
import * as iam from '../../../aws-iam';
import * as cdk from '../../../core';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';

/**
 * Options when binding a SchemaConfig to a Destination
 */
export interface SchemaConfigurationBindOptions {

  /**
   * The IAM Role that will be used by the Delivery Stream for access to the Glue data catalog for record format conversion.
   */
  readonly role: iam.IRole;
}

/**
 * Options for creating a Schema for record format conversion from a `glue.CfnTable`
 */
export interface SchemaConfigurationFromCfnTableProps {

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
   * The region of the database the table is in.
   *
   * @default the region of the stack that contains the table reference is used
   */
  readonly region?: string;
}

/**
 * Represents a schema configuration for Firehose S3 data record format conversion.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-dataformatconversionconfiguration.html#cfn-kinesisfirehose-deliverystream-dataformatconversionconfiguration-schemaconfiguration
 */
export class SchemaConfiguration {
  /**
   * Obtain schema configuration for data record format conversion from an `aws_glue.CfnTable`
   */
  public static fromCfnTable(table: glue.CfnTable, props?: SchemaConfigurationFromCfnTableProps) {
    const stack = cdk.Stack.of(table);
    return new SchemaConfiguration(
      table.databaseName,
      table.ref,
      table.catalogId,
      props?.region ?? stack.region,
      props?.versionId ?? 'LATEST',
    );
  }

  private constructor(
    private readonly databaseName: string,
    private readonly tableName: string,
    private readonly catalogId: string,
    private readonly databaseRegion: string,
    private readonly versionId: string,
  ) {}

  /**
   * Binds this Schema to the Destination, adding the necessary permissions to the Destination role.
   */
  public bind(
    scope: Construct,
    options: SchemaConfigurationBindOptions,
  ): CfnDeliveryStream.SchemaConfigurationProperty {
    const stack = cdk.Stack.of(scope);

    const catalogArn = stack.formatArn({
      service: 'glue',
      resource: 'catalog',
      region: this.databaseRegion,
      account: this.catalogId,
    });

    const databaseArn = stack.formatArn({
      service: 'glue',
      resource: 'database',
      resourceName: this.databaseName,
      region: this.databaseRegion,
      account: this.catalogId,
    });

    const tableArn = stack.formatArn({
      service: 'glue',
      resource: 'table',
      resourceName: `${this.databaseName}/${this.tableName}`,
      region: this.databaseRegion,
      account: this.catalogId,
    });

    /*
     * Permissions reference https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html#using-iam-glue
     * Note that actions on a table require specifying the database and the catalog in the resources as well.
     * See https://docs.aws.amazon.com/glue/latest/dg/glue-specifying-resource-arns.html
     */
    iam.Grant.addToPrincipal({
      actions: ['glue:GetTable', 'glue:GetTableVersion', 'glue:GetTableVersions'],
      grantee: options.role,
      resourceArns: [catalogArn, databaseArn, tableArn],
    });

    /*
     * Needed if the table schema is stored in AWS Glue Schema Registry
     * The resource must be '*' due to Firehose limitation
     */
    iam.Grant.addToPrincipal({
      actions: ['glue:GetSchemaVersion'],
      grantee: options.role,
      resourceArns: ['*'],
    });

    return {
      roleArn: options.role.roleArn,
      region: this.databaseRegion,
      tableName: this.tableName,
      databaseName: this.databaseName,
      versionId: this.versionId,
      catalogId: this.catalogId,
    };
  }
}
