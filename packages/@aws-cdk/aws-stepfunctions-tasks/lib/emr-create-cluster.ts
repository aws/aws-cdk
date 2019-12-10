import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';
import { setFlagsFromString } from 'v8';


/**
 * Properties for EmrCreateCluster
 */
export interface EmrCreateClusterProps {
  /**
   * The JSON that you want to provide to your CreateCluster call as input.
   *
   * This uses the same syntax as the runJobFlow API: https://docs.aws.amazon.com/emr/latest/APIReference/API_RunJobFlow.html
   */
  readonly clusterConfiguration?: { [key: string]: any };

  /**
   * The Service, Instance, and AutoScaling Roles used by your cluster. The StepFunction will be ALLOWED iam:PassRole to these.
   *
   */
  readonly clusterRoles?: iam.IRole[];

  /**
   * The service integration pattern indicates different ways to call Create Cluster.
   *
   * The valid value is either FIRE_AND_FORGET or SYNC.
   *
   * @default FIRE_AND_FORGET
   */
  readonly integrationPattern?: sfn.ServiceIntegrationPattern;
}

/**
 * A Step Functions Task to create an EMR Cluster.
 *
 * The Cluster Configuration is defined as Parameters in the state machine definition.
 *
 * OUTPUT: the ClusterId.
 */
export class EmrCreateCluster implements sfn.IStepFunctionsTask {

  private readonly integrationPattern: sfn.ServiceIntegrationPattern;

  constructor(private readonly props: EmrCreateClusterProps = {}) {
    this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.FIRE_AND_FORGET;

    const supportedPatterns = [
      sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
      sfn.ServiceIntegrationPattern.SYNC
    ];

    if (!supportedPatterns.includes(this.integrationPattern)) {
      throw new Error(`Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call CreateCluster.`);
    }

    if (!props.clusterConfiguration) {
      throw new Error(`The property clusterConfiguration is required to call CreateCluster.`);
    }

    if (!props.clusterRoles || props.clusterRoles.length == 0) {
      throw new Error(`The property clusterRoles is required and must have length greater than 0.`);
    }
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn("states", "createCluster", this.integrationPattern),
      policyStatements: this.createPolicyStatements(_task),
      parameters: this.props.clusterConfiguration
    };
  }

  /**
  * This generates the PolicyStatements required by the Task to call CreateCluster.
  */
  private createPolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
    const stack = Stack.of(task);

    const policyStatements = [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'elasticmapreduce:RunJobFlow', 
          'elasticmapreduce:DescribeCluster', 
          'elasticmapreduce:TerminateJobFlows'
        ],
        resources: ['*']
      })
    ];

    if (this.props.clusterRoles && this.props.clusterRoles.length > 0) {
      policyStatements.push(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
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