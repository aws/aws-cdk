import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { DatabaseProps } from './database-props';
import { DatabaseQuery } from './database-query';
import { ITable } from './table';
import { IUser } from './user';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * The Redshift table and action that make up a privilege that can be granted to a Redshift user.
 */
export interface TablePrivilege {
  /**
   * The table on which priveleges will be granted.
   */
  readonly table: ITable;

  /**
   * The actions that will be granted.
   */
  readonly actions: TableAction[];
}

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
 * Properties for specifying privileges granted to a Redshift user on Redshift tables.
 */
export interface UserTablePrivilegesProps extends DatabaseProps {
  /**
   * The user to which privileges will be granted.
   */
  readonly user: IUser;

  /**
   * The privileges to be granted.
   *
   * @default [] - use `addPrivileges` to grant privileges after construction
   */
  readonly privileges?: TablePrivilege[];
}

/**
 * Privileges granted to a Redshift user on Redshift tables.
 */
export class UserTablePrivileges extends CoreConstruct {
  private privileges: TablePrivilege[];

  constructor(scope: Construct, id: string, props: UserTablePrivilegesProps) {
    super(scope, id);

    this.privileges = props.privileges ?? [];

    new DatabaseQuery(this, 'Resource', {
      ...props,
      handler: 'grant-user-table-privileges',
      properties: {
        username: props.user.username,
        tablePrivileges: cdk.Lazy.string({
          produce: () => JSON.stringify(
            // TODO: needs to be `reduce`d to combine tables
            this.privileges.map(({ table, actions }) => {
              if (actions.includes(TableAction.ALL)) {
                actions = [TableAction.ALL];
              }
              if (actions.includes(TableAction.UPDATE) || actions.includes(TableAction.DELETE)) {
                actions.push(TableAction.SELECT);
              }
              const actionSet = new Set(actions);
              return { tableName: table.tableName, actions: Array.from(actionSet).map(action => TableAction[action]) };
            }),
          ),
        }),
      },
    });
  }

  /**
   * Grant this user additional privileges.
   */
  addPrivileges(table: ITable, ...actions: TableAction[]): void {
    this.privileges.push({ table, actions });
  }
}
