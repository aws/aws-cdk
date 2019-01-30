import cdk = require('@aws-cdk/cdk');
import { Attribute, AttributeType, Table, TableOptions } from './table';

export interface SimpleTableProps extends TableOptions {
  /**
   * Partition key attribute definition. This is eventually required, but you
   * can also use `addPartitionKey` to specify the partition key at a later stage.
   */
  partitionKey?: Attribute;
}

export class SimpleTable extends Table {
  constructor(scope: cdk.Construct, id: string, props: SimpleTableProps) {
    super(scope, id, {
      partitionKey: props.partitionKey || { name: 'ID', type: AttributeType.String },
      ...props
    });
  }
}