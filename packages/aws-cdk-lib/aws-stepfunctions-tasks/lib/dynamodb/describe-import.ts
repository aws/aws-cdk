import { Construct } from 'constructs';
import { getDynamoResourceArnFromApi } from './private/utils';
import * as ddb from '../../../aws-dynamodb';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';

/**
 * Properties for DynamoDescribeImport Task
 */
export interface DynamoDescribeImportProps extends sfn.TaskStateBaseProps {
  /**
   * The name of the table where the import was created.
   */
  readonly table: ddb.ITable;
  /**
   * The Amazon Resource Name (ARN) associated with the table you're importing to.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeImport.html#API_DescribeImport_RequestSyntax
   */
  readonly importArn: string;
}

/**
 * A StepFunctions task to call DynamoDescribeImport
 */
export class DynamoDescribeImport extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: DynamoDescribeImportProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: [
          Stack.of(this).formatArn({
            service: 'dynamodb',
            resource: 'table',
            resourceName: `${props.table.tableName}/import/*`,
          }),
        ],
        actions: ['dynamodb:DescribeImport'],
      }),
    ];
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: getDynamoResourceArnFromApi('describeImport'),
      Parameters: sfn.FieldUtils.renderObject({
        ImportArn: this.props.importArn,
      }),
    };
  }
}
