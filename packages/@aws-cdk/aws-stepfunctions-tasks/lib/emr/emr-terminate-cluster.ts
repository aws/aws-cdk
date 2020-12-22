import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for EmrTerminateCluster
 *
 * @experimental
 */
export interface EmrTerminateClusterProps extends sfn.TaskStateBaseProps {
  /**
   * The ClusterId to terminate.
   */
  readonly clusterId: string;
}

/**
 * A Step Functions Task to terminate an EMR Cluster.
 *
 * @experimental
 */
export class EmrTerminateCluster extends sfn.TaskStateBase {
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
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('elasticmapreduce', 'terminateCluster', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        ClusterId: this.props.clusterId,
      }),
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