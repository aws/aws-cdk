import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
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
   * The target capacity of On-Demand units for the instance fleet.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_InstanceFleetModifyConfig.html
   *
   * @default None
   */
  readonly targetOnDemandCapacity: number;

  /**
   * The target capacity of Spot units for the instance fleet.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_InstanceFleetModifyConfig.html
   *
   * @default None
   */
  readonly targetSpotCapacity: number;
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
        InstanceFleet: {
          TargetOnDemandCapacity: this.props.targetOnDemandCapacity,
          TargetSpotCapacity: this.props.targetSpotCapacity
        }
      }
    };
  }
}