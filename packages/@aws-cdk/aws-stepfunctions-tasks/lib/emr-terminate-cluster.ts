import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * Properties for EmrTerminateCluster
 * 
 * @experimental
 */
export interface EmrTerminateClusterProps {
  /**
   * The ClusterId to terminate.
   */
  readonly clusterId: string;

  /**
   * The service integration pattern indicates different ways to call TerminateCluster.
   *
   * The valid value is either FIRE_AND_FORGET or SYNC.
   *
   * @default SYNC
   */
  readonly integrationPattern?: sfn.ServiceIntegrationPattern;
}

/**
 * A Step Functions Task to terminate an EMR Cluster.
 * 
 * @experimental
 */
export class EmrTerminateCluster implements sfn.IStepFunctionsTask {

  private readonly integrationPattern: sfn.ServiceIntegrationPattern;

  constructor(private readonly props: EmrTerminateClusterProps) {
    this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.SYNC;

    const supportedPatterns = [
      sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
      sfn.ServiceIntegrationPattern.SYNC
    ];

    if (!supportedPatterns.includes(this.integrationPattern)) {
      throw new Error(`Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call TerminateCluster.`);
    }
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn('elasticmapreduce', 'terminateCluster', this.integrationPattern),
      policyStatements: this.createPolicyStatements(_task),
      parameters: {
        ClusterId: this.props.clusterId
      }
    };
  }

  /**
   * This generates the PolicyStatements required by the Task to call TerminateCluster.
   */
  private createPolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
    const stack = Stack.of(task);

    const policyStatements = [
      new iam.PolicyStatement({
        actions: [
          'elasticmapreduce:DescribeCluster',
          'elasticmapreduce:TerminateJobFlows'
        ],
        resources: ['arn:aws:elasticmapreduce:*:*:cluster/*']
      })
    ];

    if (this.integrationPattern === sfn.ServiceIntegrationPattern.SYNC) {
      policyStatements.push(new iam.PolicyStatement({
        actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
        resources: [stack.formatArn({
          service: 'events',
          resource: 'rule',
          resourceName: 'StepFunctionsGetEventForEMRTerminateJobFlowsRule'
        })]
      }));
    }

    return policyStatements;
  }
}