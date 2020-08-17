import * as path from 'path';
import { IAutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import { ICluster, AddCapacityOptions } from './cluster';
import { CfnCapacityProvider } from './ecs.generated';
import { CustomResource } from '@aws-cdk/core';

/**
 * Represents the CapacityProvider
 */
export interface ICapacityProvider extends cdk.IResource {
  /**
   * The name of the CapacityProvider.
   * @attribute
   */
  readonly name: string;

  /**
   * default strategy for the CapacityProvider
   */
  readonly defaultStrategy: CapacityProviderStrategy;
}

/**
 *  The properties for CapacityProvider.
 */
export interface CapacityProviderBase {
  /**
   * The name of the CapacityProvider
   *
   * @default - physical ID of the resource
   */
  readonly capacityProviderName?: string;

  /**
   * Whether to enable the managed scaling. 
   *
   * @default True
   */
  readonly managedScaling?: boolean;

  /**
   * Whether to enable the managed termination protection. Will be ignored and set to `False` if
   * `managedScaling` is `False`
   *
   * @default True
   */
  readonly managedTerminationProtection?: boolean;

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

  /**
   * The default strategy for this CapacityProvider.
   */
  readonly defaultStrategy: CapacityProviderStrategy;

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
  public static fromCapacityProviderName(scope: cdk.Construct, id: string, capacityProviderName: string, defaultStrategy: CapacityProviderStrategy): ICapacityProvider {
    class Import extends cdk.Resource implements ICapacityProvider {
      public readonly name = capacityProviderName;
      public readonly defaultStrategy = defaultStrategy;
    }
    return new Import(scope, id);
  }

  /**
   * The name of the CapacityProvider
   */
  public readonly name: string;

  /**
   * default strategy for this capacity provider
   */
  public readonly defaultStrategy: CapacityProviderStrategy;
  constructor(scope: cdk.Construct, id: string, props: CapacityProviderProps) {
    super(scope, id);

    const managedScaling = (props.managedScaling === false) ? false : true;
    const managedTerminationProtection = (managedScaling === false) ? false : 
      props.managedTerminationProtection ?? true

    const onEvent = new lambda.Function(this, 'InstanceProtectionHandler',  {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'index.on_event',
      timeout: cdk.Duration.seconds(60),
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
        ManagedTerminationProtection: managedTerminationProtection,
        AutoscalingGroupName: props.autoscalingGroup.autoScalingGroupName,
      },
    });

    instanceProtection.node.addDependency(props.autoscalingGroup);

    const resource = new CfnCapacityProvider(this, 'Resource', {
      autoScalingGroupProvider: {
        autoScalingGroupArn: props.autoscalingGroup.autoScalingGroupName,
        managedScaling: {
          maximumScalingStepSize: props.maximumScalingStepSize ?? 10000,
          minimumScalingStepSize: props.minimumScalingStepSize ?? 1,
          status: managedScaling ? 'ENABLED' : 'DISABLED',
          targetCapacity: props.targetCapacity ?? 100,
        },
        managedTerminationProtection: managedTerminationProtection ? 'ENABLED' :  'DISABLED',
      },
      name: props.capacityProviderName,
    });
    resource.node.addDependency(instanceProtection);
    this.name = resource.ref;
    this.defaultStrategy = props.defaultStrategy;
  }
}


export interface CapacityProviderStrategy {
  /**
   * The `weight` value designates the relative percentage of the total number of tasks launched that should
   * use the specified capacity provider.
   */
  readonly weight: number;

  /**
   * The base value designates how many tasks, at a minimum, to run on the specified capacity provider.
   * Only one capacity provider in a capacity provider strategy can have a base defined.
   *
   * @default - no base capacity
   */
  readonly base?: number;
}


/**
 * Options for addCapacityProviderConfiguration
 */
export interface CapacityProviderConfigurationOpts {
  /**
   * the capacity provisers to be configured with
   */
  readonly capacityProvider: any;
}


/**
 * Properties of the CapacityProviderConfiguration construct
 */
export interface CapacityProviderConfigurationProps extends CapacityProviderConfigurationOpts {
  /**
   * the cluster for the capacity providers
   */
  readonly cluster: ICluster;

  readonly runsAfter?: cdk.IDependable[];
}


/**
 * create and configure capacity provider(s)
 */
export class CapacityProviderConfiguration extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: CapacityProviderConfigurationProps ) {
    super(scope, id);

    const stack = cdk.Stack.of(this);

    const onEvent = new lambda.Function(this, 'CapacityProviderConfigurationHandler', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'index.on_event',
      timeout: cdk.Duration.seconds(60),
      code: lambda.Code.fromAsset(path.join(__dirname, './capacity-provider-config-handler')),
    });

    onEvent.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'ecs:PutClusterCapacityProviders',
      ],
      resources: [ '*' ],
    }));

    const capacityProviderConfigurationProvider = new cr.Provider(this, 'CapacityProviderConfigurationProvider', {
      onEventHandler: onEvent,
    });

    const configurationResource = new CustomResource(this, 'CapacityProviderConfiguration', {
      serviceToken: capacityProviderConfigurationProvider.serviceToken,
      properties: {
        cluster: props.cluster.clusterName,
        capacityProviders: stack.toJsonString(props.capacityProvider),
      }
    })
    if(props.runsAfter){
      configurationResource.node.addDependency(...props.runsAfter)
    }
  }
}
