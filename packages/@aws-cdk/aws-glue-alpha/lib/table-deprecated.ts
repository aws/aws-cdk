import { S3Table, S3TableProps } from './s3-table';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';

export interface TableProps extends S3TableProps {}

/**
 * A Glue table.
 *
 * @deprecated Use {@link S3Table} instead.
 */
@propertyInjectable
export class Table extends S3Table {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-glue-alpha.Table';
}
