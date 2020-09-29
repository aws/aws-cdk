import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Aws, Construct } from '@aws-cdk/core';
import { integrationResourceArn } from '../private/task-utils';

/**
 * Properties for EmrCancelStep
 *
 * @experimental
 */
export interface EmrCancelStepProps extends sfn.TaskStateBaseProps {
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
export class EmrCancelStep extends sfn.TaskStateBase {

  protected readonly taskPolicies?: iam.PolicyStatement[];
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;

  constructor(scope: Construct, id: string, private readonly props: EmrCancelStepProps) {
    super(scope, id, props);
    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['elasticmapreduce:CancelSteps'],
        resources: [`arn:aws:elasticmapreduce:${Aws.REGION}:${Aws.ACCOUNT_ID}:cluster/*`],
      }),
    ];
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('elasticmapreduce', 'cancelStep', sfn.IntegrationPattern.REQUEST_RESPONSE),
      Parameters: sfn.FieldUtils.renderObject({
        ClusterId: this.props.clusterId,
        StepId: this.props.stepId,
      }),
    };
  }
}
