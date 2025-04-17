import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { DatabaseOptions } from '../database-options';
import { ITable, TableAction } from '../table';
import { IUser } from '../user';
import { DatabaseQuery } from './database-query';
import { HandlerName } from './database-query-provider/handler-name';
import { UserTablePrivilegesHandlerProps } from './handler-props';

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
          produce: () =>
            Object.entries(groupPrivilegesByTable(this.privileges))
              .map(([tableId, tablePrivileges]) => ({
                tableId,
                // The first element always exists since the groupBy element is at least a singleton.
                tableName: tablePrivileges[0]!.table.tableName,
                actions: unifyTableActions(tablePrivileges).map(action => TableAction[action]),
              })),
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

const unifyTableActions = (tablePrivileges: TablePrivilege[]): TableAction[] => {
  const set = new Set<TableAction>(tablePrivileges.flatMap(x => x.actions));

  if (set.has(TableAction.ALL)) {
    return [TableAction.ALL];
  }

  if (set.has(TableAction.UPDATE) || set.has(TableAction.DELETE)) {
    set.add(TableAction.SELECT);
  }

  return [...set];
};

const groupPrivilegesByTable = (privileges: TablePrivilege[]): Record<string, TablePrivilege[]> => {
  return privileges.reduce((grouped, privilege) => {
    const { table } = privilege;
    const tableId = table.node.id;
    const tablePrivileges = grouped[tableId] ?? [];
    return {
      ...grouped,
      [tableId]: [...tablePrivileges, privilege],
    };
  }, {} as Record<string, TablePrivilege[]>);
};
