import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Aws } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * Properties for EmrModifyInstanceGroupByName
 *
 * @experimental
 */
export interface EmrModifyInstanceGroupByNameProps {
  /**
   * The ClusterId to update.
   */
  readonly clusterId: string;

  /**
   * The InstanceGroupName to update.
   */
  readonly instanceGroupName: string;

  /**
   * The JSON that you want to provide to your ModifyInstanceGroup call as input.
   *
   * This uses the same syntax as the ModifyInstanceGroups API.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_ModifyInstanceGroups.html
   */
  readonly instanceGroupConfiguration: sfn.TaskInput;
}

/**
 * A Step Functions Task to to modify an InstanceGroup on an EMR Cluster.
 *
 * @experimental
 */
export class EmrModifyInstanceGroupByName implements sfn.IStepFunctionsTask {

  constructor(private readonly props: EmrModifyInstanceGroupByNameProps) {}

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn('elasticmapreduce', 'modifyInstanceGroupByName',
        sfn.ServiceIntegrationPattern.FIRE_AND_FORGET),
      policyStatements: [
        new iam.PolicyStatement({
          actions: [
            'elasticmapreduce:ModifyInstanceGroups',
            'elasticmapreduce:ListInstanceGroups'
          ],
          resources: [`arn:aws:elasticmapreduce:${Aws.REGION}:${Aws.ACCOUNT_ID}:cluster/*`]
        })
      ],
      parameters: {
        ClusterId: this.props.clusterId,
        InstanceGroupName: this.props.instanceGroupName,
        InstanceGroup: this.props.instanceGroupConfiguration.value
      }
    };
  }
}