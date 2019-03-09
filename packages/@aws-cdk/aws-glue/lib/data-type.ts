import cdk = require('@aws-cdk/cdk');
import { Column } from './schema';

export interface IDataType extends cdk.IConstruct {
  readonly name: string;
  readonly columns: Column[];
  readonly partitionKeys?: Column[];
}

export class DataType extends cdk.Construct implements IDataType {

}
