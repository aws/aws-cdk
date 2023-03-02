import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Duration, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { EmrCreateCluster } from './emr-create-cluster';
import { InstanceGroupModifyConfigPropertyToJson } from './private/cluster-utils';
import { integrationResourceArn } from '../private/task-utils';

/**
 * Properties for EmrModifyInstanceGroupByName
 *
 */
export interface EmrModifyInstanceGroupByNameProps extends sfn.TaskStateBaseProps {
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
 */
export class EmrModifyInstanceGroupByName extends sfn.TaskStateBase {
  protected readonly taskPolicies?: iam.PolicyStatement[];
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;

  constructor(scope: Construct, id: string, private readonly props: EmrModifyInstanceGroupByNameProps) {
    super(scope, id, props);
    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: [
          'elasticmapreduce:ModifyInstanceGroups',
          'elasticmapreduce:ListInstanceGroups',
        ],
        resources: [
          Stack.of(this).formatArn({
            service: 'elasticmapreduce',
            resource: 'cluster',
            resourceName: '*',
          }),
        ],
      }),
    ];
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('elasticmapreduce', 'modifyInstanceGroupByName', sfn.IntegrationPattern.REQUEST_RESPONSE),
      Parameters: sfn.FieldUtils.renderObject({
        ClusterId: this.props.clusterId,
        InstanceGroupName: this.props.instanceGroupName,
        InstanceGroup: InstanceGroupModifyConfigPropertyToJson(this.props.instanceGroup),
      }),
    };
  }
}

export namespace EmrModifyInstanceGroupByName {
  /**
   * Custom policy for requesting termination protection or termination of specific instances when shrinking an instance group.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_InstanceResizePolicy.html
   *
   */
  export interface InstanceResizePolicyProperty {
    /**
     * Specific list of instances to be protected when shrinking an instance group.
     *
     * @default - No instances will be protected when shrinking an instance group
     */
    readonly instancesToProtect?: string[];

    /**
     * Specific list of instances to be terminated when shrinking an instance group.
     *
     * @default - No instances will be terminated when shrinking an instance group.
     */
    readonly instancesToTerminate?: string[];

    /**
     * Decommissioning timeout override for the specific list of instances to be terminated.
     *
     * @default cdk.Duration.seconds
     */
    readonly instanceTerminationTimeout?: Duration;
  }

  /**
   * Policy for customizing shrink operations. Allows configuration of decommissioning timeout and targeted instance shrinking.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_ShrinkPolicy.html
   *
   */
  export interface ShrinkPolicyProperty {
    /**
     * The desired timeout for decommissioning an instance. Overrides the default YARN decommissioning timeout.
     *
     * @default - EMR selected default
     */
    readonly decommissionTimeout?: Duration;

    /**
     * Custom policy for requesting termination protection or termination of specific instances when shrinking an instance group.
     *
     * @default - None
     */
    readonly instanceResizePolicy?: InstanceResizePolicyProperty;
  }

  /**
   * Modify the size or configurations of an instance group.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_InstanceGroupModifyConfig.html
   *
   */
  export interface InstanceGroupModifyConfigProperty {
    /**
     * A list of new or modified configurations to apply for an instance group.
     *
     * @default - None
     */
    readonly configurations?: EmrCreateCluster.ConfigurationProperty[];

    /**
     * The EC2 InstanceIds to terminate. After you terminate the instances, the instance group will not return to its original requested size.
     *
     * @default - None
     */
    readonly eC2InstanceIdsToTerminate?: string[];

    /**
     * Target size for the instance group.
     *
     * @default - None
     */
    readonly instanceCount?: number;

    /**
     * Policy for customizing shrink operations.
     *
     * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_ShrinkPolicy.html
     *
     * @default - None
     */
    readonly shrinkPolicy?: ShrinkPolicyProperty;
  }
}
