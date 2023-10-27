import { Construct } from 'constructs';
import { getDynamoResourceArnFromApi } from './private/utils';
import * as ddb from '../../../aws-dynamodb';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';

/**
 * Properties for DynamoDescribeExport Task
 */
export interface DynamoDescribeExportProps extends sfn.TaskStateBaseProps {
  /**
   * The name of the table where the export is being created.
   */
  readonly table: ddb.ITable;
  /**
   * The Amazon Resource Name (ARN) associated with the export.
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeExport.html#API_DescribeExport_RequestSyntax
   */
  readonly exportArn: string;
}

/**
 * A StepFunctions task to call DynamoDescribeExport
 */
export class DynamoDescribeExport extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: DynamoDescribeExportProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: [
          Stack.of(this).formatArn({
            service: 'dynamodb',
            resource: 'table',
            resourceName: `${props.table.tableName}/export/*`,
          }),
        ],
        actions: ['dynamodb:DescribeExport'],
      }),
    ];
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: getDynamoResourceArnFromApi('describeExport'),
      Parameters: sfn.FieldUtils.renderObject({
        ExportArn: this.props.exportArn,
      }),
    };
  }
}
