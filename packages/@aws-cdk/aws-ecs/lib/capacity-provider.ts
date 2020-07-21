import * as path from 'path';
import { IAutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import { CfnCapacityProvider } from './ecs.generated';

/**
 * Represents the CapacityProvider
 */
export interface ICapacityProvider extends cdk.IResource {
  /**
   * The name of the CapacityProvider
   * @attribute
   */
  readonly capacityProviderName: string;
}

/**
 * Construct properties for CapacityProvider
 */
export interface CapacityProviderProps {
  /**
   * The AutoscalingGroup for the CapacityProvider
   */
  readonly autoscalingGroup: IAutoScalingGroup;

  /**
   * The name of the CapacityProvider
   *
   * @default - physical ID of the resource
   */
  readonly capacityProviderName?: string;

  /**
   * Whether to enable the managed termination protection
   *
   * @default True
   */
  readonly managedTerminationProtection?: boolean;

  /**
   * Whether to enable the managed scaling. This value will be overrided to be True
   * if the `managedTerminationProtection` is enabled.
   *
   * @default - True.
   */
  readonly managedScaling?: boolean;

  /**
   * The maximum number of container instances that Amazon ECS will scale in or scale out at one time
   *
   * @default 10000
   */
  readonly maximumScalingStepSize?: number;

  /**
   * The minimum number of container instances that Amazon ECS will scale in or scale out at one time.
   *
   * @default 1
   */
  readonly minimumScalingStepSize?: number;

  /**
   * The target capacity value for the capacity provider. The specified value must be greater than `0` and less
   * than or equal to `100`. A value of `100` will result in the Amazon EC2 instances in your Auto Scaling group
   * being completely utilized.
   *
   * @default 100;
   */
  readonly targetCapacity?: number;


}

/**
 * A CapacityProvider represents the Amazon ECS Capacity Provider
 */
export class CapacityProvider extends cdk.Resource implements ICapacityProvider {
  /**
   * Import an existing CapacityProvider into this CDK app.
   */
  public static fromCapacityProviderName(scope: cdk.Construct, id: string, capacityProviderName: string): ICapacityProvider {
    class Import extends cdk.Resource implements ICapacityProvider {
      public readonly capacityProviderName = capacityProviderName;
    }
    return new Import(scope, id);
  }

  /**
   * The name of the CapacityProvider
   */
  public readonly capacityProviderName: string;
  constructor(scope: cdk.Construct, id: string, props: CapacityProviderProps) {
    super(scope, id);

    const onEvent = new lambda.Function(this, 'InstanceProtectionHandler',  {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'index.on_event',
      timeout: cdk.Duration.seconds(60),
      environment: {
        autoscaling_group_name: props.autoscalingGroup.autoScalingGroupName,
      },
      code: lambda.Code.fromAsset(path.join(__dirname, './instance-protection-handler')),
    });

    onEvent.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'autoscaling:UpdateAutoScalingGroup',
        'autoscaling:SetInstanceProtection',
      ],
      resources: [ props.autoscalingGroup.autoScalingGroupArn ],
    }));

    onEvent.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'autoscaling:DescribeAutoScalingGroups',
      ],
      resources: [ '*' ],
    }));

    const instanceProtectionProvider = new cr.Provider(this, 'InstanceProtectionProvider', {
      onEventHandler: onEvent,
    });

    const instanceProtection= new cdk.CustomResource(this, 'EnforcedInstanceProtection', {
      serviceToken: instanceProtectionProvider.serviceToken,
    });

    instanceProtection.node.addDependency(props.autoscalingGroup);

    const resource = new CfnCapacityProvider(this, 'Resource', {
      autoScalingGroupProvider: {
        autoScalingGroupArn: props.autoscalingGroup.autoScalingGroupName,
        managedScaling: {
          maximumScalingStepSize: props.maximumScalingStepSize ?? 10000,
          minimumScalingStepSize: props.minimumScalingStepSize ?? 1,
          status: (props.managedTerminationProtection === false && props.managedScaling === false)
            ? 'DISABLED' : 'ENABLED',
          targetCapacity: props.targetCapacity ?? 100,
        },
        managedTerminationProtection: props.managedTerminationProtection ? 'ENABLED' : 'DISABLED',
      },
      name: props.capacityProviderName,
    });
    resource.node.addDependency(instanceProtection);
    this.capacityProviderName = resource.ref;
  }
}
