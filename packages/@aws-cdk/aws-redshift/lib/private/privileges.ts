import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { DatabaseQuery } from './database-query';
import { HandlerName } from './database-query-provider/handler-name';
import { TablePrivilege as SerializedTablePrivilege, UserTablePrivilegesHandlerProps } from './handler-props';
import { DatabaseOptions } from '../database-options';
import { ITable, TableAction } from '../table';
import { IUser } from '../user';

/**
 * The Redshift table and action that make up a privilege that can be granted to a Redshift user.
 */
export interface TablePrivilege {
  /**
   * The table on which privileges will be granted.
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
export class UserTablePrivileges extends Construct {
  private privileges: TablePrivilege[];

  constructor(scope: Construct, id: string, props: UserTablePrivilegesProps) {
    super(scope, id);

    this.privileges = props.privileges ?? [];

    new DatabaseQuery<UserTablePrivilegesHandlerProps>(this, 'Resource', {
      ...props,
      handler: HandlerName.UserTablePrivileges,
      properties: {
        username: props.user.username,
        tablePrivileges: cdk.Lazy.any({
          produce: () => {
            const reducedPrivileges = this.privileges.reduce((privileges, { table, actions }) => {
              const tableName = table.tableName;
              if (!(tableName in privileges)) {
                privileges[tableName] = [];
              }
              actions = actions.concat(privileges[tableName]);
              if (actions.includes(TableAction.ALL)) {
                actions = [TableAction.ALL];
              }
              if (actions.includes(TableAction.UPDATE) || actions.includes(TableAction.DELETE)) {
                actions.push(TableAction.SELECT);
              }
              privileges[tableName] = Array.from(new Set(actions));
              return privileges;
            }, {} as { [key: string]: TableAction[] });
            const serializedPrivileges: SerializedTablePrivilege[] = Object.entries(reducedPrivileges).map(([tableName, actions]) => ({
              tableName: tableName,
              actions: actions.map(action => TableAction[action]),
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
