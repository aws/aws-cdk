import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import { integrationResourceArn, isJsonPathOrJsonataExpression, validatePatternSupported } from '../private/task-utils';

interface EmrContainersDeleteVirtualClusterOptions {
  /**
   * The ID of the virtual cluster that will be deleted.
   */
  readonly virtualClusterId: sfn.TaskInput;
}

/**
 * Properties to define a EMR Containers DeleteVirtualCluster Task using JSONPath
 */
export interface EmrContainersDeleteVirtualClusterJsonPathProps extends sfn.TaskStateJsonPathBaseProps, EmrContainersDeleteVirtualClusterOptions { }

/**
 * Properties to define a EMR Containers DeleteVirtualCluster Task using JSONata
 */
export interface EmrContainersDeleteVirtualClusterJsonataProps extends sfn.TaskStateJsonataBaseProps, EmrContainersDeleteVirtualClusterOptions { }

/**
 * Properties to define a EMR Containers DeleteVirtualCluster Task
 */
export interface EmrContainersDeleteVirtualClusterProps extends sfn.TaskStateBaseProps, EmrContainersDeleteVirtualClusterOptions { }

/**
 * Deletes an EMR Containers virtual cluster as a Task.
 *
 * @see https://docs.amazonaws.cn/en_us/step-functions/latest/dg/connect-emr-eks.html
 */
export class EmrContainersDeleteVirtualCluster extends sfn.TaskStateBase {
  /**
   * Deletes an EMR Containers virtual cluster as a Task using JSONPath.
   */
  public static jsonPath(scope: Construct, id: string, props: EmrContainersDeleteVirtualClusterJsonPathProps) {
    return new EmrContainersDeleteVirtualCluster(scope, id, props);
  }

  /**
   * Deletes an EMR Containers virtual cluster as a Task using JSONata.
   */
  public static jsonata(scope: Construct, id: string, props: EmrContainersDeleteVirtualClusterJsonataProps) {
    return new EmrContainersDeleteVirtualCluster(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }

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
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('emr-containers', 'deleteVirtualCluster', this.integrationPattern),
      ...this._renderParametersOrArguments({
        Id: this.props.virtualClusterId.value,
      }, queryLanguage),
    };
  }

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
          resourceName: isJsonPathOrJsonataExpression(this.props.virtualClusterId.value) ? '*' : this.props.virtualClusterId.value,
        }),
      ],
      actions: actions,
    })];
  }
}
