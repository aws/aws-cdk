import * as path from 'path';
import { IAutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import { ICluster, AddCapacityOptions } from './cluster';
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
 * Options for addCapacityProvider()
 */
export interface CapacityProviderBase {
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
 * Options for addCapacityProvider
 */
export interface CapacityProviderOpts extends CapacityProviderBase {
  /**
   * capacity options for the autoscaling group
   */
  readonly capacityOptions: AddCapacityOptions;
}


/**
 * Construct properties for CapacityProvider
 */
export interface CapacityProviderProps extends CapacityProviderBase {
  /**
   * The AutoscalingGroup for the CapacityProvider
   */
  readonly autoscalingGroup: IAutoScalingGroup;

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
  private _managedTerminationProtection: boolean
  constructor(scope: cdk.Construct, id: string, props: CapacityProviderProps) {
    super(scope, id);

    this._managedTerminationProtection = props.managedTerminationProtection ?? true;

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
      properties: {
        ManagedTerminationProtection: this._managedTerminationProtection,
      },
    });

    instanceProtection.node.addDependency(props.autoscalingGroup);

    const resource = new CfnCapacityProvider(this, 'Resource', {
      autoScalingGroupProvider: {
        autoScalingGroupArn: props.autoscalingGroup.autoScalingGroupName,
        managedScaling: {
          maximumScalingStepSize: props.maximumScalingStepSize ?? 10000,
          minimumScalingStepSize: props.minimumScalingStepSize ?? 1,
          status: (this._managedTerminationProtection === false && props.managedScaling === false)
            ? 'DISABLED' : 'ENABLED',
          targetCapacity: props.targetCapacity ?? 100,
        },
        managedTerminationProtection: this._managedTerminationProtection ? 'ENABLED' :  'DISABLED',
      },
      name: props.capacityProviderName,
    });
    resource.node.addDependency(instanceProtection);
    this.capacityProviderName = resource.ref;
  }
}


/**
 * The capacity provider strategy to use by default for the cluster
 */
export interface CapacityProviderStrategy {
  /**
   * The capacity provider
   */
  readonly capacityProvider: ICapacityProvider;

  /**
   * The `weight` value designates the relative percentage of the total number of tasks launched that should
   * use the specified capacity provider.
   */
  readonly weight: number;

  /**
   * The base value designates how many tasks, at a minimum, to run on the specified capacity provider.
   * Only one capacity provider in a capacity provider strategy can have a base defined.
   *
   * @default  - no base value
   */
  readonly base?: number;
}

/**
 * Properties of the CapacityProviderConfiguration construct
 */
export interface CapacityProviderConfigurationProps {
  /**
   * the cluster for the capacity providers
   */
  readonly cluster: ICluster;

  /**
   * the capacity provisers to be configured with
   */
  readonly capacityProvider: ICapacityProvider[];

  /**
   * default strategy for each capacity provider
   */
  readonly defaultStrategy: CapacityProviderStrategy[];
}

/**
 * capacity provider configurations for the cluster
 */
export class CapacityProviderConfiguration extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: CapacityProviderConfigurationProps ) {
    super(scope, id);

    new cr.AwsCustomResource(this, 'CapacityProviderConfiguration', {
      onUpdate: {
        service: 'ECS',
        action: 'putClusterCapacityProviders',
        parameters: {
          cluster: props.cluster.clusterName,
          capacityProviders: props.capacityProvider.map(cp => cp.capacityProviderName),
          defaultCapacityProviderStrategy: props.defaultStrategy.map(s => ({
            capacityProvider: s.capacityProvider.capacityProviderName,
            base: s.base,
            weight: s.weight,
          })),
        },
        physicalResourceId: cr.PhysicalResourceId.of(id),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
  }
}
