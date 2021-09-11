import { Column } from '../table';

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

export interface TableHandlerProps {
  readonly tableName: {
    readonly prefix: string;
    readonly generateSuffix: boolean;
  };
  readonly tableColumns: Column[];
}

export interface TablePrivilege {
  readonly tableName: string;
  readonly actions: string[];
}

export interface UserTablePrivilegesHandlerProps {
  readonly username: string;
  readonly tablePrivileges: TablePrivilege[];
}
