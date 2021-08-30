import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ICluster } from './cluster';
import { DatabaseProps } from './database-props';
import { DatabaseQuery } from './private/database-query';
import { TableHandlerProps } from './private/handler-props';
import { TableAction } from './privileges';
import { IUser } from './user';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

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
}

/**
 * Properties for configuring a Redshift table.
 */
export interface TableProps extends DatabaseProps {
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
   * The policy to apply when this resource is removed from the application.
   *
   * @default cdk.RemovalPolicy.Retain
   */
  readonly removalPolicy?: cdk.RemovalPolicy;
}

/**
 * Represents a table in a Redshift database.
 */
export interface ITable extends cdk.IConstruct {
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

abstract class TableBase extends CoreConstruct implements ITable {
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

    this.tableColumns = props.tableColumns;
    this.cluster = props.cluster;
    this.databaseName = props.databaseName;

    this.resource = new DatabaseQuery(this, 'Resource', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      ...props,
      handler: 'create-table',
      properties: {
        tableName: props.tableName ?? cdk.Names.uniqueId(this),
        tableColumns: this.tableColumns,
      },
    });

    this.tableName = this.resource.getAttString('tableName');
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
}
