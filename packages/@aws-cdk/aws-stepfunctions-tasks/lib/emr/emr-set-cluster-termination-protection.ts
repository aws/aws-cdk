import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Aws } from '@aws-cdk/core';
import { getResourceArn } from '../resource-arn-suffix';

/**
 * Properties for EmrSetClusterTerminationProtection
 *
 * @experimental
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
 * @experimental
 */
export class EmrSetClusterTerminationProtection implements sfn.IStepFunctionsTask {

  constructor(private readonly props: EmrSetClusterTerminationProtectionProps) {}

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn('elasticmapreduce', 'setClusterTerminationProtection',
        sfn.ServiceIntegrationPattern.FIRE_AND_FORGET),
      policyStatements: [
        new iam.PolicyStatement({
          actions: ['elasticmapreduce:SetTerminationProtection'],
          resources: [`arn:aws:elasticmapreduce:${Aws.REGION}:${Aws.ACCOUNT_ID}:cluster/*`],
        }),
      ],
      parameters: {
        ClusterId: this.props.clusterId,
        TerminationProtected: this.props.terminationProtected,
      },
    };
  }
}