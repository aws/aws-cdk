import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Aws } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * Properties for EmrModifyInstanceFleetByName
 * 
 * @experimental
 */
export interface EmrModifyInstanceFleetByNameProps {
  /**
   * The ClusterId to update.
   */
  readonly clusterId: string;

  /**
   * The InstanceFleetName to update.
   */
  readonly instanceFleetName: string;

  /**
   * The JSON that you want to provide to your ModifyInstanceFleet call as input.
   *
   * This uses the same syntax as the ModifyInstanceFleet API.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_ModifyInstanceFleet.html
   */
  readonly instanceFleetConfiguration: sfn.TaskInput;
}

/**
 * A Step Functions Task to to modify an InstanceFleet on an EMR Cluster.
 * 
 * @experimental
 */
export class EmrModifyInstanceFleetByName implements sfn.IStepFunctionsTask {

  constructor(private readonly props: EmrModifyInstanceFleetByNameProps) {}

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn('elasticmapreduce', 'modifyInstanceFleetByName',
        sfn.ServiceIntegrationPattern.FIRE_AND_FORGET),
      policyStatements: [
        new iam.PolicyStatement({
          actions: [
            'elasticmapreduce:ModifyInstanceFleet',
            'elasticmapreduce:ListInstanceFleets'
          ],
          resources: [`arn:aws:elasticmapreduce:${Aws.REGION}:${Aws.ACCOUNT_ID}:cluster/*`]
        })
      ],
      parameters: {
        ClusterId: this.props.clusterId,
        InstanceFleetName: this.props.instanceFleetName,
        InstanceFleet: this.props.instanceFleetConfiguration.value
      }
    };
  }
}