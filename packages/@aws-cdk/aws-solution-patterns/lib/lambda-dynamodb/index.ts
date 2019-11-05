import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import { Construct } from '@aws-cdk/core';
import { DefaultTableProps } from '../core/dynamodb-table-defaults';
import { DefaultFunctionProps } from '../core/lambda-defaults';
import { overrideProps } from '../core/utils';

export interface LambdaToDynamoDBProps {
  /**
   * Whether to create a new lambda function or use an existing lambda function
   *
   * If set to false, you must provide a lambda function object as `existingObj`
   *
   * @default true
   */
  readonly deployLambda: boolean,
  /**
   * [disable-awslint:ref-via-interface]
   * Existing instance of Lambda Function object
   *
   * If `deploy` is set to false only then this property is required
   *
   * @default - None
   */
  readonly existingLambdaObj?: lambda.Function,
  /**
   * Optional user provided props to override the default props
   *
   * If `deploy` is set to true only then this property is required
   *
   * @default - Default props are used
   */
  readonly lambdaFunctionProps?: lambda.FunctionProps,
  /**
   * Optional user provided props to override the default props
   *
   * @default - Default props are used
   */
  readonly dynamoTableProps?: dynamodb.TableProps
}

export class LambdaToDynamoDB extends Construct {
  private fn: lambda.Function;
  private table: dynamodb.Table;

  /**
   * @param {cdk.App} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope: Construct, id: string, props: LambdaToDynamoDBProps) {
    super(scope, id);

    // Set the default props for DynamoDB table
    if (props.dynamoTableProps) {
      const dynamoTableProps = overrideProps(DefaultTableProps, props.dynamoTableProps);
      this.table = new dynamodb.Table(this, 'DynamoTable', dynamoTableProps);
    } else {
      this.table = new dynamodb.Table(this, 'DynamoTable', DefaultTableProps);
    }

    // Conditional lambda function creation
    // If deployLambda == false
    if (props.hasOwnProperty('deployLambda') && props.deployLambda === false) {
      if (props.existingLambdaObj) {
        this.fn = props.existingLambdaObj;
      } else {
        throw Error('Missing existingLambdaObj from props for deploy = false');
      }
    // If deployLambda == true
    } else {
      if (props.lambdaFunctionProps) {
        const lambdaFunctionProps = overrideProps(DefaultFunctionProps, props.lambdaFunctionProps);
        this.fn = new lambda.Function(this, 'LambdaFunction', lambdaFunctionProps);
      } else {
        throw Error('Missing lambdaFunctionProps from props for deploy = true');
      }
    }

    this.fn.addEnvironment('DDB_TABLE_NAME', this.table.tableName);

    this.table.grantReadWriteData(this.fn.grantPrincipal);
  }

  public dynamoTable(): dynamodb.Table {
    return this.table;
  }

  public lambdaFunction(): lambda.Function {
    return this.fn;
  }
}