/* eslint-disable import/no-extraneous-dependencies */
import * as cdk from '@aws-cdk/core';
import { REDSHIFT_COLUMN_ID } from '@aws-cdk/cx-api';
import { Construct, IConstruct } from 'constructs';
import { ICluster } from './cluster';
import { DatabaseOptions } from './database-options';
import { DatabaseQuery } from './private/database-query';
import { HandlerName } from './private/database-query-provider/handler-name';
import { getDistKeyColumn, getSortKeyColumns } from './private/database-query-provider/util';
import { TableHandlerProps } from './private/handler-props';
import { IUser } from './user';

/**
 * An action that a Redshift user can be granted privilege to perform on a table.
 */
export enum TableAction {
  /**
   * Grants privilege to select data from a table or view using a SELECT statement.
   */
  SELECT,

  /**
   * Grants privilege to load data into a table using an INSERT statement or a COPY statement.
   */
  INSERT,

  /**
   * Grants privilege to update a table column using an UPDATE statement.
   */
  UPDATE,

  /**
   * Grants privilege to delete a data row from a table.
   */
  DELETE,

  /**
   * Grants privilege to drop a table.
   */
  DROP,

  /**
   * Grants privilege to create a foreign key constraint.
   *
   * You need to grant this privilege on both the referenced table and the referencing table; otherwise, the user can't create the constraint.
   */
  REFERENCES,

  /**
   * Grants all available privileges at once to the specified user or user group.
   */
  ALL
}

/**
 * A column in a Redshift table.
 */
export interface Column {
  /**
   * The unique identifier of the column.
   *
   * This is not the name of the column, and renaming this identifier will cause a new column to be created and the old column to be dropped.
   *
   * **NOTE** - This field will be set, however, only by setting the `@aws-cdk/aws-redshift:columnId` feature flag will this field be used.
   *
   * @default - the column name is used as the identifier
   */
  readonly id?: string;

  /**
   * The name of the column. This will appear on Amazon Redshift.
   */
  readonly name: string;

  /**
   * The data type of the column.
   */
  readonly dataType: string;

  /**
   * Boolean value that indicates whether the column is to be configured as DISTKEY.
   *
   * @default - column is not DISTKEY
   */
  readonly distKey?: boolean;

  /**
   * Boolean value that indicates whether the column is to be configured as SORTKEY.
   *
   * @default - column is not a SORTKEY
   */
  readonly sortKey?: boolean;

  /**
   * The encoding to use for the column.
   *
   * @default - Amazon Redshift determines the encoding based on the data type.
   */
  readonly encoding?: ColumnEncoding;

  /**
   * A comment to attach to the column.
   *
   * @default - no comment
   */
  readonly comment?: string;
}

/**
 * Properties for configuring a Redshift table.
 */
export interface TableProps extends DatabaseOptions {
  /**
   * The name of the table.
   *
   * @default - a name is generated
   */
  readonly tableName?: string;

  /**
   * The columns of the table.
   */
  readonly tableColumns: Column[];

  /**
   * The distribution style of the table.
   *
   * @default TableDistStyle.AUTO
   */
  readonly distStyle?: TableDistStyle;

  /**
   * The sort style of the table.
   *
   * @default TableSortStyle.AUTO if no sort key is specified, TableSortStyle.COMPOUND if a sort key is specified
   */
  readonly sortStyle?: TableSortStyle;

  /**
   * The policy to apply when this resource is removed from the application.
   *
   * @default cdk.RemovalPolicy.Retain
   */
  readonly removalPolicy?: cdk.RemovalPolicy;

  /**
     * A comment to attach to the table.
     *
     * @default - no comment
     */
  readonly tableComment?: string;
}

/**
 * Represents a table in a Redshift database.
 */
export interface ITable extends IConstruct {
  /**
   * Name of the table.
   */
  readonly tableName: string;

  /**
   * The columns of the table.
   */
  readonly tableColumns: Column[];

  /**
   * The cluster where the table is located.
   */
  readonly cluster: ICluster;

  /**
   * The name of the database where the table is located.
   */
  readonly databaseName: string;

  /**
   * Grant a user privilege to access this table.
   */
  grant(user: IUser, ...actions: TableAction[]): void;
}

/**
 * A full specification of a Redshift table that can be used to import it fluently into the CDK application.
 */
export interface TableAttributes {
  /**
   * Name of the table.
   */
  readonly tableName: string;

  /**
   * The columns of the table.
   */
  readonly tableColumns: Column[];

  /**
   * The cluster where the table is located.
   */
  readonly cluster: ICluster;

  /**
   * The name of the database where the table is located.
   */
  readonly databaseName: string;
}

abstract class TableBase extends Construct implements ITable {
  abstract readonly tableName: string;
  abstract readonly tableColumns: Column[];
  abstract readonly cluster: ICluster;
  abstract readonly databaseName: string;
  grant(user: IUser, ...actions: TableAction[]) {
    user.addTablePrivileges(this, ...actions);
  }
}

/**
 * A table in a Redshift cluster.
 */
export class Table extends TableBase {
  /**
   * Specify a Redshift table using a table name and schema that already exists.
   */
  static fromTableAttributes(scope: Construct, id: string, attrs: TableAttributes): ITable {
    return new class extends TableBase {
      readonly tableName = attrs.tableName;
      readonly tableColumns = attrs.tableColumns;
      readonly cluster = attrs.cluster;
      readonly databaseName = attrs.databaseName;
    }(scope, id);
  }

  readonly tableName: string;
  readonly tableColumns: Column[];
  readonly cluster: ICluster;
  readonly databaseName: string;

  private resource: DatabaseQuery<TableHandlerProps>;

  constructor(scope: Construct, id: string, props: TableProps) {
    super(scope, id);

    this.addColumnIds(props.tableColumns);
    this.validateDistKeyColumns(props.tableColumns);
    if (props.distStyle) {
      this.validateDistStyle(props.distStyle, props.tableColumns);
    }
    if (props.sortStyle) {
      this.validateSortStyle(props.sortStyle, props.tableColumns);
    }

    this.tableColumns = props.tableColumns;
    this.cluster = props.cluster;
    this.databaseName = props.databaseName;

    const useColumnIds = !!cdk.FeatureFlags.of(this).isEnabled(REDSHIFT_COLUMN_ID);

    this.resource = new DatabaseQuery<TableHandlerProps>(this, 'Resource', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      ...props,
      handler: HandlerName.Table,
      properties: {
        tableName: {
          prefix: props.tableName ?? cdk.Names.uniqueId(this),
          generateSuffix: !props.tableName ? 'true' : 'false',
        },
        tableColumns: this.tableColumns,
        distStyle: props.distStyle,
        sortStyle: props.sortStyle ?? this.getDefaultSortStyle(props.tableColumns),
        tableComment: props.tableComment,
        useColumnIds,
      },
    });

    this.tableName = this.resource.ref;
  }

  /**
   * Apply the given removal policy to this resource
   *
   * The Removal Policy controls what happens to this resource when it stops
   * being managed by CloudFormation, either because you've removed it from the
   * CDK application or because you've made a change that requires the resource
   * to be replaced.
   *
   * The resource can be destroyed (`RemovalPolicy.DESTROY`), or left in your AWS
   * account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).
   *
   * This resource is retained by default.
   */
  public applyRemovalPolicy(policy: cdk.RemovalPolicy): void {
    this.resource.applyRemovalPolicy(policy);
  }

  private validateDistKeyColumns(columns: Column[]): void {
    try {
      getDistKeyColumn(columns);
    } catch {
      throw new Error('Only one column can be configured as distKey.');
    }
  }

  private validateDistStyle(distStyle: TableDistStyle, columns: Column[]): void {
    const distKeyColumn = getDistKeyColumn(columns);
    if (distKeyColumn && distStyle !== TableDistStyle.KEY) {
      throw new Error(`Only 'TableDistStyle.KEY' can be configured when distKey is also configured. Found ${distStyle}`);
    }
    if (!distKeyColumn && distStyle === TableDistStyle.KEY) {
      throw new Error('distStyle of "TableDistStyle.KEY" can only be configured when distKey is also configured.');
    }
  }

  private validateSortStyle(sortStyle: TableSortStyle, columns: Column[]): void {
    const sortKeyColumns = getSortKeyColumns(columns);
    if (sortKeyColumns.length === 0 && sortStyle !== TableSortStyle.AUTO) {
      throw new Error(`sortStyle of '${sortStyle}' can only be configured when sortKey is also configured.`);
    }
    if (sortKeyColumns.length > 0 && sortStyle === TableSortStyle.AUTO) {
      throw new Error(`sortStyle of '${TableSortStyle.AUTO}' cannot be configured when sortKey is also configured.`);
    }
  }

  private getDefaultSortStyle(columns: Column[]): TableSortStyle {
    const sortKeyColumns = getSortKeyColumns(columns);
    return (sortKeyColumns.length === 0) ? TableSortStyle.AUTO : TableSortStyle.COMPOUND;
  }

  private addColumnIds(columns: Column[]): void {
    const columnIds = new Set<string>();
    for (const column of columns) {
      if (column.id) {
        if (columnIds.has(column.id)) {
          throw new Error(`Column id '${column.id}' is not unique.`);
        }
        columnIds.add(column.id);
      }
    }
  }
}

/**
 * The data distribution style of a table.
 */
export enum TableDistStyle {
  /**
   *  Amazon Redshift assigns an optimal distribution style based on the table data
   */
  AUTO = 'AUTO',

  /**
   * The data in the table is spread evenly across the nodes in a cluster in a round-robin distribution.
   */
  EVEN = 'EVEN',

  /**
   * The data is distributed by the values in the DISTKEY column.
   */
  KEY = 'KEY',

  /**
   * A copy of the entire table is distributed to every node.
   */
  ALL = 'ALL',
}

/**
 * The sort style of a table.
 */
export enum TableSortStyle {
  /**
   * Amazon Redshift assigns an optimal sort key based on the table data.
   */
  AUTO = 'AUTO',

  /**
   * Specifies that the data is sorted using a compound key made up of all of the listed columns,
   * in the order they are listed.
   */
  COMPOUND = 'COMPOUND',

  /**
   * Specifies that the data is sorted using an interleaved sort key.
   */
  INTERLEAVED = 'INTERLEAVED',
}

/**
 * The compression encoding of a column.
 *
 * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Compression_encodings.html
 */
export enum ColumnEncoding {
  /**
   * Amazon Redshift assigns an optimal encoding based on the column data.
   * This is the default.
   */
  AUTO = 'AUTO',

  /**
   * The column is not compressed.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Raw_encoding.html
   */
  RAW = 'RAW',

  /**
   * The column is compressed using the AZ64 algorithm.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/az64-encoding.html
   */
  AZ64 = 'AZ64',

  /**
   * The column is compressed using a separate dictionary for each block column value on disk.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Byte_dictionary_encoding.html
   */
  BYTEDICT = 'BYTEDICT',

  /**
   * The column is compressed based on the difference between values in the column.
   * This records differences as 1-byte values.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Delta_encoding.html
   */
  DELTA = 'DELTA',

  /**
   * The column is compressed based on the difference between values in the column.
   * This records differences as 2-byte values.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Delta_encoding.html
   */
  DELTA32K = 'DELTA32K',

  /**
   * The column is compressed using the LZO algorithm.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/lzo-encoding.html
   */
  LZO = 'LZO',

  /**
   * The column is compressed to a smaller storage size than the original data type.
   * The compressed storage size is 1 byte.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_MostlyN_encoding.html
   */
  MOSTLY8 = 'MOSTLY8',

  /**
   * The column is compressed to a smaller storage size than the original data type.
   * The compressed storage size is 2 bytes.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_MostlyN_encoding.html
   */
  MOSTLY16 = 'MOSTLY16',

  /**
   * The column is compressed to a smaller storage size than the original data type.
   * The compressed storage size is 4 bytes.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_MostlyN_encoding.html
   */
  MOSTLY32 = 'MOSTLY32',

  /**
   * The column is compressed by recording the number of occurrences of each value in the column.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Runlength_encoding.html
   */
  RUNLENGTH = 'RUNLENGTH',

  /**
   * The column is compressed by recording the first 245 unique words and then using a 1-byte index to represent each word.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Text255_encoding.html
   */
  TEXT255 = 'TEXT255',

  /**
   * The column is compressed by recording the first 32K unique words and then using a 2-byte index to represent each word.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/c_Text255_encoding.html
   */
  TEXT32K = 'TEXT32K',

  /**
   * The column is compressed using the ZSTD algorithm.
   *
   * @see https://docs.aws.amazon.com/redshift/latest/dg/zstd-encoding.html
   */
  ZSTD = 'ZSTD',
}
