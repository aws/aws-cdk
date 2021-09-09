import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { DatabaseOptions } from '../database-options';
import { ITable, TableAction } from '../table';
import { IUser } from '../user';
import { DatabaseQuery } from './database-query';
import { TablePrivilege as SerializedTablePrivilege, UserTablePrivilegesHandlerProps } from './handler-props';

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
 * Properties for specifying privileges granted to a Redshift user on Redshift tables.
 */
export interface UserTablePrivilegesProps extends DatabaseOptions {
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
 *
 * This construct is located in the `private` directory to ensure that it is not exported for direct public use. This
 * means that user privileges must be managed through the `Table.grant` method or the `User.addTablePrivileges`
 * method. Thus, each `User` will have at most one `UserTablePrivileges` construct to manage its privileges. For details
 * on why this is a Good Thing, see the README, under "Granting Privileges".
 */
export class UserTablePrivileges extends CoreConstruct {
  private privileges: TablePrivilege[];

  constructor(scope: Construct, id: string, props: UserTablePrivilegesProps) {
    super(scope, id);

    this.privileges = props.privileges ?? [];

    new DatabaseQuery<UserTablePrivilegesHandlerProps>(this, 'Resource', {
      ...props,
      handler: 'user-table-privileges',
      properties: {
        username: props.user.username,
        tablePrivileges: cdk.Lazy.any({
          produce: () => {
            const reducedPrivileges = this.privileges.map(({ table, actions }) => {
              if (actions.includes(TableAction.ALL)) {
                actions = [TableAction.ALL];
              }
              if (actions.includes(TableAction.UPDATE) || actions.includes(TableAction.DELETE)) {
                actions.push(TableAction.SELECT);
              }
              const actionSet = new Set(actions);
              return { table, actions: Array.from(actionSet) };
            });
            const serializedPrivileges: SerializedTablePrivilege[] = reducedPrivileges.map(({ table, actions }) => ({
              tableName: table.tableName,
              actions: Array.from(actions).map(action => TableAction[action]),
            }));
            return serializedPrivileges;
          },
        }) as any,
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
