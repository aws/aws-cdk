import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * Properties for EmrCreateCluster
 * 
 * @experimental
 */
export interface EmrCreateClusterProps {
  /**
   * The JSON that you want to provide to your CreateCluster call as input.
   *
   * This uses the same syntax as the RunJobFlow API.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_RunJobFlow.html
   */
  readonly clusterConfiguration: sfn.TaskInput;

  /**
   * The Service, Instance, and AutoScaling Roles used by your cluster. The StepFunction will be ALLOWED iam:PassRole to these.
   */
  readonly clusterRoles: iam.IRole[];

  /**
   * The service integration pattern indicates different ways to call CreateCluster.
   *
   * The valid value is either FIRE_AND_FORGET or SYNC.
   *
   * @default SYNC
   */
  readonly integrationPattern?: sfn.ServiceIntegrationPattern;
}

/**
 * A Step Functions Task to create an EMR Cluster.
 *
 * The ClusterConfiguration is defined as Parameters in the state machine definition.
 *
 * OUTPUT: the ClusterId.
 * 
 * @experimental
 */
export class EmrCreateCluster implements sfn.IStepFunctionsTask {

  private readonly integrationPattern: sfn.ServiceIntegrationPattern;

  constructor(private readonly props: EmrCreateClusterProps) {
    this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.SYNC;

    const supportedPatterns = [
      sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
      sfn.ServiceIntegrationPattern.SYNC
    ];

    if (!supportedPatterns.includes(this.integrationPattern)) {
      throw new Error(`Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call CreateCluster.`);
    }

    if (props.clusterRoles.length === 0) {
      throw new Error(`The property clusterRoles must have length greater than 0.`);
    }
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn('elasticmapreduce', 'createCluster', this.integrationPattern),
      policyStatements: this.createPolicyStatements(_task),
      parameters: this.props.clusterConfiguration.value
    };
  }

  /**
   * This generates the PolicyStatements required by the Task to call CreateCluster.
   */
  private createPolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
    const stack = Stack.of(task);

    const policyStatements = [
      new iam.PolicyStatement({
        actions: [
          'elasticmapreduce:RunJobFlow',
          'elasticmapreduce:DescribeCluster',
          'elasticmapreduce:TerminateJobFlows'
        ],
        resources: ['*']
      })
    ];

    if (this.props.clusterRoles.length > 0) {
      policyStatements.push(new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        resources: this.props.clusterRoles.map(role => role.roleArn)
      }));
    }

    if (this.integrationPattern === sfn.ServiceIntegrationPattern.SYNC) {
      policyStatements.push(new iam.PolicyStatement({
        actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
        resources: [stack.formatArn({
          service: 'events',
          resource: 'rule',
          resourceName: 'StepFunctionsGetEventForEMRRunJobFlowRule'
        })]
      }));
    }

    return policyStatements;
  }
}