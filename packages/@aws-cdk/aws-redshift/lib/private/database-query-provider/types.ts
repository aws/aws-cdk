import { DatabaseQueryHandlerProps, TableHandlerProps } from '../handler-props';

export type ClusterProps = Omit<DatabaseQueryHandlerProps, 'handler'>;
export type TableAndClusterProps = TableHandlerProps & ClusterProps;

/**
 * The sort style of a table.
 * This has been duplicated here to exporting private types.
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
