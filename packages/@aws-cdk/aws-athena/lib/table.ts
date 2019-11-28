import { PolicyStatement } from '@aws-cdk/aws-iam';
import { IBucket } from '@aws-cdk/aws-s3';
import { Aws, Construct, IConstruct } from '@aws-cdk/core';
import { AwsCustomResource } from '@aws-cdk/custom-resources';
import { DataType } from './datatypes';

/**
 * Creates a Table with the name and the parameters that you specify.
 */
export interface ITable extends IConstruct {
  /**
   * The Table name.
   * @attribute
   */
  readonly tableName: string;
}

/**
 * Properties used to define an Athena Table
 */
export interface TableProps {
  /**
   * The database to add the Table to.
   * @default none
   */
  readonly databaseName: string;

  /**
   * The name for the Table.
   * @default none
   */
  readonly tableName: string;

  /**
   * Specifies the name for each column to be created, along with the column's data type.
   * Column names do not allow special characters other than underscore (_).
   * If col_name begins with an underscore, enclose the column name in backticks, for example `_mycolumn`.
   */
   readonly schema: {[key: string]: DataType}

  /**
   * Table comment.
   * @default none
   */
  readonly comment?: string;

  /**
   * The Bucket that this Table databases.
   * @default none
   */
  readonly queryBucket: IBucket;
}

/**
 * An Athena Table
 */
export class Table extends Construct implements ITable {
  /**
   * some docstring
   */
  public readonly tableName: string;

  constructor(scope: Construct, id: string, props: TableProps) {
  super(scope, id);
  this.tableName = props.tableName;

  const s3Policy = new PolicyStatement();
  s3Policy.addActions('s3:*');
  s3Policy.addResources(props.queryBucket.arnForObjects('*'));
  s3Policy.addResources(props.queryBucket.bucketArn);

  const athenaPolicy = new PolicyStatement();
  athenaPolicy.addActions('athena:StartQueryExecution');
  athenaPolicy.addAllResources();

  const gluePolicy = new PolicyStatement();
  gluePolicy.addActions('glue:GetDatabase', 'glue:GetTable');
  athenaPolicy.addResources(`arn:aws:glue:${Aws.REGION}:${Aws.ACCOUNT_ID}:catalog`);

  new AwsCustomResource(this, 'CreateAthenaTable', {
    onCreate: {
      service: 'Athena',
      action: 'startQueryExecution',
      parameters: {
        QueryString: `CREATE EXTERNAL TABLE IF NOT EXISTS ${props.databaseName}.${props.tableName} (${schemaStringBuilder(props.schema)}) LOCATION 's3://${props.queryBucket.bucketName}'/`,
        ResultConfiguration: {
        OutputLocation: `s3://${props.queryBucket.bucketName}/`
        },
      },
      physicalResourceIdPath: 'QueryExecutionId'
    },
      policyStatements: [s3Policy, athenaPolicy, gluePolicy]
  });
  }
}

function schemaStringBuilder(schema: {[key: string]: DataType}) {
  const tempStrings: string[] = [];
  tempStrings.concat(Object.keys(schema)
    .map(key => `'${key}' '${schema[key]}'`));
  return `(${tempStrings.join(", ")})`;
}