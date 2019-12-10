import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * Properties for EmrCreateCluster
 */
export interface EmrSetClusterTerminationProtectionProps {
  /**
   * The ClusterId to update.
   */
  readonly clusterId: string;

  /**
   * Termination protection indicator.
   */
  readonly terminationProtected: boolean;
}

/**
 * A Step Functions Task to to set Termination Protection on an EMR Cluster.
 *
 * The Cluster Configuration is defined as Parameters in the state machine definition.
 */
export class EmrSetClusterTerminationProtection implements sfn.IStepFunctionsTask {

  private readonly integrationPattern: sfn.ServiceIntegrationPattern;

  constructor(private readonly props: EmrSetClusterTerminationProtectionProps) {}

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn("elasticmapreduce", "setClusterTerminationProtection", 
        sfn.ServiceIntegrationPattern.FIRE_AND_FORGET),
      policyStatements: this.createPolicyStatements(_task),
      parameters: {
          ClusterId: this.props.clusterId,
          TerminationProtected: this.props.terminationProtected
      }
    };
  }

  /**
   * This generates the PolicyStatements required by the Task to call CreateCluster.
   */
  private createPolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
    const stack = Stack.of(task);

    const policyStatements = [
      new iam.PolicyStatement({
        actions: ['elasticmapreduce:SetTerminationProtection'],
        resources: ['arn:aws:elasticmapreduce:*:*:cluster/*']
      })
    ];

    return policyStatements;
  }
}