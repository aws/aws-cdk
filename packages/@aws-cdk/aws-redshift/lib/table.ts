import * as cdk from '@aws-cdk/core';
import { ICluster } from './cluster';
import { DatabaseOptions } from './database-options';
import { DatabaseQuery } from './private/database-query';
import { HandlerName } from './private/database-query-provider/handler-name';
import { getDistKeyColumn, getSortKeyColumns } from './private/database-query-provider/util';
import { TableHandlerProps } from './private/handler-props';
import { IUser } from './user';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct, IConstruct } from 'constructs';

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
   * The name of the column.
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
    } catch (err) {
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
