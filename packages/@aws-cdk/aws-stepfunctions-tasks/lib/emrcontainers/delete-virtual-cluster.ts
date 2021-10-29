import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties to define a EMR Containers DeleteVirtualCluster Task
 */
export interface EmrContainersDeleteVirtualClusterProps extends sfn.TaskStateBaseProps {

  /**
   * The ID of the virtual cluster that will be deleted.
   */
  readonly virtualClusterId: sfn.TaskInput;
}

/**
 * Deletes an EMR Containers virtual cluster as a Task.
 *
 * @see https://docs.amazonaws.cn/en_us/step-functions/latest/dg/connect-emr-eks.html
 */
export class EmrContainersDeleteVirtualCluster extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: EmrContainersDeleteVirtualClusterProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, EmrContainersDeleteVirtualCluster.SUPPORTED_INTEGRATION_PATTERNS);

    this.taskPolicies = this.createPolicyStatements();
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('emr-containers', 'deleteVirtualCluster', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        Id: this.props.virtualClusterId.value,
      }),
    };
  };

  private createPolicyStatements(): iam.PolicyStatement[] {
    const actions = ['emr-containers:DeleteVirtualCluster'];
    if (this.integrationPattern === sfn.IntegrationPattern.RUN_JOB) {
      actions.push('emr-containers:DescribeVirtualCluster');
    }

    return [new iam.PolicyStatement({
      resources: [
        cdk.Stack.of(this).formatArn({
          arnFormat: cdk.ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME,
          service: 'emr-containers',
          resource: 'virtualclusters',
          resourceName: sfn.JsonPath.isEncodedJsonPath(this.props.virtualClusterId.value) ? '*' : this.props.virtualClusterId.value,
        }),
      ],
      actions: actions,
    })];
  }
}
