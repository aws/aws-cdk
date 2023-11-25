import { DatabaseQueryHandlerProps, TableHandlerProps } from './handler-props';

export type ClusterProps = Omit<DatabaseQueryHandlerProps, 'handler'>;
export type TableAndClusterProps = TableHandlerProps & ClusterProps;