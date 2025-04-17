import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

interface EmrTerminateClusterOptions {
  /**
   * The ClusterId to terminate.
   */
  readonly clusterId: string;
}

/**
 * Properties for EmrTerminateCluster using JSONPath
 *
 */
export interface EmrTerminateClusterJsonPathProps extends sfn.TaskStateJsonPathBaseProps, EmrTerminateClusterOptions {}

/**
 * Properties for EmrTerminateCluster using JSONata
 *
 */
export interface EmrTerminateClusterJsonataProps extends sfn.TaskStateJsonataBaseProps, EmrTerminateClusterOptions {}

/**
 * Properties for EmrTerminateCluster
 *
 */
export interface EmrTerminateClusterProps extends sfn.TaskStateBaseProps, EmrTerminateClusterOptions {}

/**
 * A Step Functions Task to terminate an EMR Cluster.
 *
 */
export class EmrTerminateCluster extends sfn.TaskStateBase {
  /**
   * A Step Functions Task using JSONPath to terminate an EMR Cluster.
   *
   */
  public static jsonPath(scope: Construct, id: string, props: EmrTerminateClusterJsonPathProps) {
    return new EmrTerminateCluster(scope, id, props);
  }
  /**
   * A Step Functions Task using JSONata to terminate an EMR Cluster.
   *
   */
  public static jsonata(scope: Construct, id: string, props: EmrTerminateClusterJsonataProps) {
    return new EmrTerminateCluster(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  protected readonly taskPolicies?: iam.PolicyStatement[];
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: EmrTerminateClusterProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.RUN_JOB;
    validatePatternSupported(this.integrationPattern, EmrTerminateCluster.SUPPORTED_INTEGRATION_PATTERNS);

    this.taskPolicies = this.createPolicyStatements();
  }

  /**
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('elasticmapreduce', 'terminateCluster', this.integrationPattern),
      ...this._renderParametersOrArguments({
        ClusterId: this.props.clusterId,
      }, queryLanguage),
    };
  }

  /**
   * This generates the PolicyStatements required by the Task to call TerminateCluster.
   */
  private createPolicyStatements(): iam.PolicyStatement[] {
    const stack = Stack.of(this);

    const policyStatements = [
      new iam.PolicyStatement({
        actions: [
          'elasticmapreduce:DescribeCluster',
          'elasticmapreduce:TerminateJobFlows',
        ],
        resources: [
          Stack.of(this).formatArn({
            service: 'elasticmapreduce',
            resource: 'cluster',
            resourceName: '*',
          }),
        ],
      }),
    ];

    if (this.integrationPattern === sfn.IntegrationPattern.RUN_JOB) {
      policyStatements.push(new iam.PolicyStatement({
        actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
        resources: [stack.formatArn({
          service: 'events',
          resource: 'rule',
          resourceName: 'StepFunctionsGetEventForEMRTerminateJobFlowsRule',
        })],
      }));
    }

    return policyStatements;
  }
}
