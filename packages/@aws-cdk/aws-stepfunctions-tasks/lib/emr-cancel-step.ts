import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Aws } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * Properties for EmrCancelStep
 *
 * @experimental
 */
export interface EmrCancelStepProps {
  /**
   * The ClusterId to update.
   */
  readonly clusterId: string;

  /**
   * The StepId to cancel.
   */
  readonly stepId: string;
}

/**
 * A Step Functions Task to to cancel a Step on an EMR Cluster.
 *
 * @experimental
 */
export class EmrCancelStep implements sfn.IStepFunctionsTask {

  constructor(private readonly props: EmrCancelStepProps) {}

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn('elasticmapreduce', 'cancelStep',
        sfn.ServiceIntegrationPattern.FIRE_AND_FORGET),
      policyStatements: [
        new iam.PolicyStatement({
          actions: ['elasticmapreduce:CancelSteps'],
          resources: [`arn:aws:elasticmapreduce:${Aws.REGION}:${Aws.ACCOUNT_ID}:cluster/*`]
        })
      ],
      parameters: {
        ClusterId: this.props.clusterId,
        StepId: this.props.stepId
      }
    };
  }
}