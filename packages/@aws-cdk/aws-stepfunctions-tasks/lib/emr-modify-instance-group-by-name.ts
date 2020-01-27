import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { EmrCreateCluster } from './emr-create-cluster';
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
  readonly instanceGroup: EmrModifyInstanceGroupByName.InstanceGroupModifyConfigProperty;
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
          resources: [`arn:aws:elasticmapreduce:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:cluster/*`]
        })
      ],
      parameters: {
        ClusterId: this.props.clusterId,
        InstanceGroupName: this.props.instanceGroupName,
        InstanceGroup: EmrModifyInstanceGroupByName.InstanceGroupModifyConfigPropertyToJson(this.props.instanceGroup)
      }
    };
  }
}

export namespace EmrModifyInstanceGroupByName {
  /**
   * Custom policy for requesting termination protection or termination of specific instances when shrinking an instance group.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_InstanceResizePolicy.html
   *
   * @experimental
   */
  export interface InstanceResizePolicyProperty {
    /**
     * Specific list of instances to be protected when shrinking an instance group.
     */
    readonly instancesToProtect?: string[];

    /**
     * Specific list of instances to be terminated when shrinking an instance group.
     */
    readonly instancesToTerminate?: string[];

    /**
     * Decommissioning timeout override for the specific list of instances to be terminated.
     */
    readonly instanceTerminationTimeout?: number;
  }

  /**
   * Render the InstanceResizePolicyProperty to JSON
   *
   * @param property
   */
  export function InstanceResizePolicyPropertyToJson(property: InstanceResizePolicyProperty) {
    return {
      InstancesToProtect: cdk.listMapper(cdk.stringToCloudFormation)(property.instancesToProtect),
      InstancesToTerminate: cdk.listMapper(cdk.stringToCloudFormation)(property.instancesToTerminate),
      InstanceTerminationTimeout: cdk.numberToCloudFormation(property.instanceTerminationTimeout)
    };
  }

  /**
   * Policy for customizing shrink operations. Allows configuration of decommissioning timeout and targeted instance shrinking.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_ShrinkPolicy.html
   *
   * @experimental
   */
  export interface ShrinkPolicyProperty {
    /**
     * The desired timeout for decommissioning an instance. Overrides the default YARN decommissioning timeout.
     */
    readonly decommissionTimeout?: number;

    /**
     * Custom policy for requesting termination protection or termination of specific instances when shrinking an instance group.
     */
    readonly instanceResizePolicy?: InstanceResizePolicyProperty;
  }

  /**
   * Render the ShrinkPolicyProperty to JSON
   *
   * @param property
   */
  export function ShrinkPolicyPropertyToJson(property: ShrinkPolicyProperty) {
    return {
      DecommissionTimeout: cdk.numberToCloudFormation(property.decommissionTimeout),
      InstanceResizePolicy: (property.instanceResizePolicy === undefined) ?
        property.instanceResizePolicy :
        InstanceResizePolicyPropertyToJson(property.instanceResizePolicy)
    };
  }

  /**
   * Modify the size or configurations of an instance group.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_InstanceGroupModifyConfig.html
   *
   * @experimental
   */
  export interface InstanceGroupModifyConfigProperty {
    /**
     * A list of new or modified configurations to apply for an instance group.
     *
     */
    readonly configurations?: EmrCreateCluster.ConfigurationProperty[];

    /**
     * The EC2 InstanceIds to terminate. After you terminate the instances, the instance group will not return to its original requested size.
     */
    readonly eC2InstanceIdsToTerminate?: string[];

    /**
     * Target size for the instance group.
     */
    readonly instanceCount?: number;

    /**
     * Policy for customizing shrink operations.
     *
     * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_ShrinkPolicy.html
     */
    readonly shrinkPolicy?: ShrinkPolicyProperty;
  }

  /**
   * Render the InstanceGroupModifyConfigPropety to JSON
   *
   * @param instanceGroupName
   * @param property
   */
  export function InstanceGroupModifyConfigPropertyToJson(property: InstanceGroupModifyConfigProperty) {
    return {
      Configurations: cdk.listMapper(EmrCreateCluster.ConfigurationPropertyToJson)(property.configurations),
      EC2InstanceIdsToTerminate: cdk.listMapper(cdk.stringToCloudFormation)(property.eC2InstanceIdsToTerminate),
      InstanceCount: cdk.numberToCloudFormation(property.instanceCount),
      ShrinkPolicy: (property.shrinkPolicy === undefined) ?
        property.shrinkPolicy :
        ShrinkPolicyPropertyToJson(property.shrinkPolicy)
    };
  }
}