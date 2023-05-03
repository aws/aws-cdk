import { Column, TableDistStyle, TableSortStyle } from '../table';

export enum AccessorType {
  USER = 'USER',
  USER_GROUP = 'GROUP',
}

export interface DatabaseQueryHandlerProps {
  readonly handler: string;
  readonly clusterName: string;
  readonly adminUserArn: string;
  readonly databaseName: string;
}

export interface UserHandlerProps {
  readonly username: string;
  readonly passwordSecretArn: string;
}

export interface UserGroupHandlerProps {
  readonly groupName: string;
  readonly users?: string[];
}

export interface TableHandlerProps {
  readonly tableName: {
    readonly prefix: string;
    readonly generateSuffix: string;
  };
  readonly tableColumns: Column[];
  readonly distStyle?: TableDistStyle;
  readonly sortStyle: TableSortStyle;
  readonly tableComment?: string;
  readonly useColumnIds: boolean;
}

export interface TablePrivilege {
  readonly tableName: string;
  readonly actions: string[];
}

export interface Accessor {
  readonly accessorType: AccessorType;
  readonly name: string;
}

export interface UserTablePrivilegesHandlerProps {
  readonly accessor: Accessor;
  readonly tablePrivileges: TablePrivilege[];
}
