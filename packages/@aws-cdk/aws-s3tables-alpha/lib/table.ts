import {
  Resource,
  IResource,
  RemovalPolicy,
  UnscopedValidationError,
  Token,
} from 'aws-cdk-lib/core';
import { INamespace } from './namespace';
import { CfnTable, CfnTablePolicy } from 'aws-cdk-lib/aws-s3tables';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as perms from './permissions';
import { EOL } from 'os';

/**
 * Represents an S3 Table.
 */
export interface ITable extends IResource {
  /**
   * The ARN of this table.
   * @attribute
   */
  readonly tableArn: string;

  /**
   * The name of this table.
   * @attribute
   */
  readonly tableName: string;

  /**
   * The accountId containing this table.
   * @attribute
   */
  readonly account?: string;

  /**
   * The region containing this table.
   * @attribute
   */
  readonly region?: string;

  /**
   * Adds a statement to the resource policy for a principal (i.e.
   * account/role/service) to perform actions on this table.
   *
   * Note that the policy statement may or may not be added to the policy.
   * For example, when an `ITable` is created from an existing table,
   * it's not possible to tell whether the table already has a policy
   * attached, let alone to re-use that policy to add more statements to it.
   * So it's safest to do nothing in these cases.
   *
   * @param statement the policy statement to be added to the table's
   * policy.
   * @returns metadata about the execution of this method. If the policy
   * was not added, the value of `statementAdded` will be `false`. You
   * should always check this value to make sure that the operation was
   * actually carried out. Otherwise, synthesis and deploy will terminate
   * silently, which may be confusing.
   */
  addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;

  /**
   * Grant read permissions for this table to an IAM principal (Role/Group/User).
   *
   * If the parent TableBucket of this table has encryption,
   * you should grant kms:Decrypt permission to use this key to the same principal.
   *
   * @param identity The principal to allow read permissions to
   */
  grantRead(identity: iam.IGrantable): iam.Grant;

  /**
   * Grant write permissions for this table to an IAM principal (Role/Group/User).
   *
   * If the parent TableBucket of this table has encryption,
   * you should grant kms:GenerateDataKey and kms:Decrypt permission
   * to use this key to the same principal.
   *
   * @param identity The principal to allow write permissions to
   */
  grantWrite(identity: iam.IGrantable): iam.Grant;

  /**
   * Grant read and write permissions for this table to an IAM principal (Role/Group/User).
   *
   * If the parent TableBucket of this table has encryption,
   * you should grant kms:GenerateDataKey and kms:Decrypt permission
   * to use this key to the same principal.
   *
   * @param identity The principal to allow read and write permissions to
   */
  grantReadWrite(identity: iam.IGrantable): iam.Grant;
}

/**
 * Base class for Table implementations.
 */
abstract class TableBase extends Resource implements ITable {
  public abstract readonly tableName: string;
  public abstract readonly tableArn: string;

  /**
   * The resource policy associated with this table.
   *
   * If `autoCreatePolicy` is true, a `TablePolicy` will be created upon the
   * first call to addToResourcePolicy(s).
   */
  public abstract tablePolicy?: CfnTablePolicy;

  /**
   * Indicates if a table resource policy should automatically created upon
   * the first call to `addToResourcePolicy`.
   */
  protected abstract autoCreatePolicy: boolean;

  public addToResourcePolicy(
    statement: iam.PolicyStatement,
  ): iam.AddToResourcePolicyResult {
    if (!this.tablePolicy && this.autoCreatePolicy) {
      this.tablePolicy = new CfnTablePolicy(this, 'DefaultPolicy', {
        tableArn: this.tableArn,
        resourcePolicy: new iam.PolicyDocument({}),
      });
    }

    if (this.tablePolicy) {
      this.tablePolicy.resourcePolicy.addStatements(statement);
      return { statementAdded: true, policyDependable: this.tablePolicy };
    }

    return { statementAdded: false };
  }

  public grantRead(identity: iam.IGrantable) {
    return this.grant(
      identity,
      perms.TABLE_READ_ACCESS,
      this.tableArn,
    );
  }

  public grantWrite(identity: iam.IGrantable) {
    return this.grant(
      identity,
      perms.TABLE_WRITE_ACCESS,
      this.tableArn,
    );
  }

  public grantReadWrite(identity: iam.IGrantable) {
    return this.grant(
      identity,
      perms.TABLE_READ_WRITE_ACCESS,
      this.tableArn,
    );
  }

  /**
   * Grants the given s3tables permissions to the provided principal
   * @returns Grant object
   */
  private grant(
    grantee: iam.IGrantable,
    tableActions: string[],
    resourceArn: string,
    ...otherResourceArns: (string | undefined)[]) {
    const resources = [resourceArn, ...otherResourceArns].filter(arn => arn != undefined);

    const grant = iam.Grant.addToPrincipalOrResource({
      grantee,
      actions: tableActions,
      resourceArns: resources,
      resource: this,
    });

    return grant;
  }
}

/**
 * Properties for creating a new S3 Table.
 */
export interface TableProps {
  /**
   * Name of this table, unique within the namespace
   */
  readonly tableName: string;
  /**
   * The namespace under which this table is created
   */
  readonly namespace: INamespace;
  /**
   * Format of this table. Currently, the only supported value is OpenTableFormat.ICEBERG.
   */
  readonly openTableFormat: OpenTableFormat;
  /**
   * Settings governing the Compaction maintenance action.
   * @default Amazon S3 selects the best compaction strategy based on your table sort order.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-maintenance.html
   */
  readonly compaction?: CompactionProperty;
  /**
   * Contains details about the metadata for an Iceberg table.
   * @default table is created without any metadata
   */
  readonly icebergMetadata?: IcebergMetadataProperty;
  /**
   * Contains details about the snapshot management settings for an Iceberg table.
   * @default enabled: MinimumSnapshots is 1 by default and MaximumSnapshotAge is 120 hours by default.
   */
  readonly snapshotManagement?: SnapshotManagementProperty;
  /**
   * Controls what happens to this table it it stoped being managed by cloudformation.
   *
   * @default RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
  /**
   * If true, indicates that you don't want to specify a schema for the table.
   *
   * This property is mutually exclusive to 'IcebergMetadata'.
   *
   * @default false
   */
  readonly withoutMetadata?: boolean;
}

/**
 * Supported open table formats.
 */
export enum OpenTableFormat {
  /**
   * Apache Iceberg table format.
   */
  ICEBERG = 'ICEBERG',
}

/**
 * Settings governing the Compaction maintenance action.
 *
 * @default - No compaction settings
 */
export interface CompactionProperty {
  /**
   * Status of the compaction maintenance action.
   */
  readonly status: Status;
  /**
   * Target file size in megabytes for compaction.
   */
  readonly targetFileSizeMb: number;
}

/**
 * Status values for maintenance actions.
 */
export enum Status {
  /**
   * Enable the maintenance action.
   */
  ENABLED = 'enabled',
  /**
   * Disable the maintenance action.
   */
  DISABLED = 'disabled',
}

/**
 * Contains details about the metadata for an Iceberg table.
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3tables-table-icebergmetadata.html
 */
export interface IcebergMetadataProperty {
  /**
   * Contains details about the schema for an Iceberg table.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3tables-table-icebergmetadata.html#cfn-s3tables-table-icebergmetadata-icebergschema
   */
  readonly icebergSchema: IcebergSchemaProperty;
}

/**
 * Contains details about the schema for an Iceberg table.
 */
export interface IcebergSchemaProperty {
  /**
   * Contains details about the schema for an Iceberg table.
   */
  readonly schemaFieldList: SchemaFieldProperty[];
}

/**
 * Contains details about a schema field.
 */
export interface SchemaFieldProperty {
  /**
   * The name of the field.
   */
  readonly name: string;

  /**
   * A Boolean value that specifies whether values are required for each row in this field.
   *
   * By default, this is `false` and null values are allowed in the field. If this is `true`, the field does not allow null values.
   *
   * @default false
   */
  readonly required?: boolean;

  /**
   * The field type.
   *
   * S3 Tables supports all Apache Iceberg primitive types. For more information, see the [Apache Iceberg documentation](https://docs.aws.amazon.com/https://iceberg.apache.org/spec/#primitive-types).
   */
  readonly type: string;
}

/**
 * Contains details about the snapshot management settings for an Iceberg table.
 *
 * A snapshot is expired when it exceeds MinSnapshotsToKeep and MaxSnapshotAgeHours.
 *
 * @default - No snapshot management settings
 */
export interface SnapshotManagementProperty {
  /**
   * The maximum age of a snapshot before it can be expired.
   *
   * @default - No maximum age
   */
  readonly maxSnapshotAgeHours?: number;

  /**
   * The minimum number of snapshots to keep.
   *
   * @default - No minimum number
   */
  readonly minSnapshotsToKeep?: number;

  /**
   * Indicates whether the SnapshotManagement maintenance action is enabled.
   *
   * @default - Not specified
   */
  readonly status?: Status;
}

/**
 * A reference to a table outside this stack
 *
 * The tableName, region, and account can be provided explicitly
 * or will be inferred from the tableArn
 */
export interface TableAttributes {
  /**
   * Name of this table
   */
  readonly tableName: string;

  /**
   * The table's ARN.
   */
  readonly tableArn: string;
}

/**
 * An S3 Table with helpers.
 */
@propertyInjectable
export class Table extends TableBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-s3tables-alpha.Table';

  /**
   * Defines a Table construct that represents an external table.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs A `TableAttributes` object containing the table name and ARN.
   */
  public static fromTableAttributes(
    scope: Construct,
    id: string,
    attrs: TableAttributes,
  ): ITable {
    const tableArn = attrs.tableArn;
    Table.validateTableName(attrs.tableName);

    class Import extends TableBase {
      public readonly tableName = attrs.tableName;
      public readonly tableArn = tableArn;
      public readonly tablePolicy?: CfnTablePolicy;
      protected autoCreatePolicy: boolean = false;

      /**
       * Exports this  from the stack.
       */
      public export() {
        return attrs;
      }
    }

    return new Import(scope, id, {
      environmentFromArn: tableArn,
      physicalName: tableArn,
    });
  }

  /**
   * See https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-buckets-naming.html
   * @param tableName Name of the table
   * @throws UnscopedValidationError if any naming errors are detected
   */
  public static validateTableName(tableName: string) {
    if (tableName == undefined || Token.isUnresolved(tableName)) {
      // the name is a late-bound value, not a defined string, so skip validation
      return;
    }

    const errors: string[] = [];

    // Length validation
    if (tableName.length < 1 || tableName.length > 255) {
      errors.push(
        'Table name must be at least 1 and no more than 255 characters',
      );
    }

    // Character set validation
    const illegalCharsetRegEx = /[^a-z0-9_]/;
    const allowedEdgeCharsetRegEx = /[a-z0-9]/;

    const illegalCharMatch = tableName.match(illegalCharsetRegEx);
    if (illegalCharMatch) {
      errors.push(
        'Table name must only contain lowercase characters, numbers, and underscores (_)' +
          ` (offset: ${illegalCharMatch.index})`,
      );
    }

    // Edge character validation
    if (!allowedEdgeCharsetRegEx.test(tableName.charAt(0))) {
      errors.push(
        'Table name must start with a lowercase letter or number (offset: 0)',
      );
    }
    if (!allowedEdgeCharsetRegEx.test(tableName.charAt(tableName.length - 1))) {
      errors.push(
        `Table name must end with a lowercase letter or number (offset: ${
          tableName.length - 1
        })`,
      );
    }

    if (errors.length > 0) {
      throw new UnscopedValidationError(
        `Invalid S3 table name (value: ${tableName})${EOL}${errors.join(EOL)}`,
      );
    }
  }

  /**
   * The unique Amazon Resource Name (arn) of this table
   */
  public readonly tableArn: string;

  /**
   * The underlying CfnTable L1 resource
   * @internal
   */
  private readonly _resource: CfnTable;

  /**
   * The name of this table
   */
  public readonly tableName: string;

  /**
   * The namespace containing this table
   */
  public readonly namespace: INamespace;

  /**
   * The resource policy for this table.
   */
  public readonly tablePolicy?: CfnTablePolicy;

  protected autoCreatePolicy: boolean = true;

  constructor(scope: Construct, id: string, props: TableProps) {
    super(scope, id, {});

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    Table.validateTableName(props.tableName);

    this._resource = new CfnTable(this, id, {
      tableName: props.tableName,
      openTableFormat: props.openTableFormat,
      tableBucketArn: props.namespace.tableBucket.tableBucketArn,
      namespace: props.namespace.namespaceName,
      compaction: props.compaction,
      icebergMetadata: props.icebergMetadata,
      snapshotManagement: props.snapshotManagement,
      withoutMetadata: props.withoutMetadata ? 'Yes' : undefined,
    });

    this.namespace = props.namespace;
    this.tableName = props.tableName;
    this.tableArn = this._resource.attrTableArn;
    this._resource.applyRemovalPolicy(props.removalPolicy);
    this.node.addDependency(this.namespace);
  }
}
