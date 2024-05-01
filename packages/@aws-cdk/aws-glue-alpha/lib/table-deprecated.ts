import { S3Table, S3TableProps } from './s3-table';

export interface TableProps extends S3TableProps {}

/**
 * A Glue table.
 *
 * @deprecated Use {@link S3Table} instead.
 */
export class Table extends S3Table {}
