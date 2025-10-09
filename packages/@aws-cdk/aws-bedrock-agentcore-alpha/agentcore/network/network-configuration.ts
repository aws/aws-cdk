import * as ec2 from 'aws-cdk-lib/aws-ec2';
// Internal Libs
import { CfnRuntime } from 'aws-cdk-lib/aws-bedrockagentcore';
import { Construct } from 'constructs';
import { ValidationError } from './../runtime/validation-helpers';

/**
 * VPC configuration properties.
 * Only used when network mode is VPC.
 */
export interface VpcConfigProps {
  /**
   * The VPC to deploy the resource to.
   */
  readonly vpc: ec2.IVpc;
  /**
   * Where to place the network interfaces within the VPC.
   *
   * This requires `vpc` to be specified in order for interfaces to actually be
   * placed in the subnets. If `vpc` is not specify, this will raise an error.
   *
   * @default - the Vpc default strategy if not specified
   */
  readonly vpcSubnets?: ec2.SubnetSelection;
  /**
   * The list of security groups to associate with the resource's network interfaces.
   *
   * Only used if 'vpc' is supplied.
   *
   * @default - If the resource is placed within a VPC and a security group is
   * not specified by this prop, a dedicated security
   * group will be created for this resource.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
  /**
   * Whether to allow all outbound traffic by default.
   *
   * If this is set to true, the security groups created by this construct
   * will allow all outbound traffic. If this is set to false, no outbound traffic will be allowed by default
   * and all egress traffic must be explicitly authorized.
   *
   * @default true
   */
  readonly allowAllOutbound?: boolean;
}

/**
 * VPC configuration.
 * Only used when network mode is VPC.
 * @internal
 */
interface NetworkConfig {
  /**
   * The connections to the network.
   */
  readonly connections: ec2.Connections | undefined;
  /**
   * The VPC subnets to use.
   */
  readonly vpcSubnets: ec2.SelectedSubnets | undefined;
}

/**
 * Abstract base class for network configuration.
 */
export abstract class NetworkConfiguration {
  /**
   * The network mode to use.
   * Configure the security level for agent
   * execution to control access, isolate resources, and protect sensitive data.
   */
  readonly networkMode: string;
  /**
   * The connections object to the network.
   */
  readonly connections: ec2.Connections | undefined;
  /**
   * The scope to create the resource in.
   */
  readonly scope?: Construct | undefined;
  /**
   * The selected VPC subnets.
   */
  readonly vpcSubnets?: ec2.SelectedSubnets;
  /**
   * Creates a new network configuration.
   * @param mode - the network mode to use for the resource.
   */
  protected constructor (mode: string, scope?: Construct, vpcConfig?: VpcConfigProps) {
    this.scope = scope;
    this.networkMode = mode;

    // Validate vpc config and configure connections
    const networkConfig = this._validateAndConfigureVpcConfig(vpcConfig);
    this.connections = networkConfig?.connections;
    this.vpcSubnets = networkConfig?.vpcSubnets;
  }

  /**
   * Validates the vpc config.
   */
  private _validateAndConfigureVpcConfig = (vpcConfig?: VpcConfigProps): NetworkConfig | undefined => {
    if ((vpcConfig?.securityGroups || vpcConfig?.allowAllOutbound !== undefined) && !vpcConfig?.vpc) {
      throw new ValidationError('Cannot configure \'securityGroups\' or \'allowAllOutbound\' without configuring a VPC');
    }

    if (!vpcConfig?.vpc) {
      return undefined;
    }

    if ((vpcConfig?.securityGroups && vpcConfig?.securityGroups.length > 0) && vpcConfig?.allowAllOutbound !== undefined) {
      throw new ValidationError('Configure \'allowAllOutbound\' directly on the supplied SecurityGroups');
    }

    if (!this.scope) {
      throw new ValidationError('Scope is required to create the security group');
    }

    let securityGroups: ec2.ISecurityGroup[];
    if (vpcConfig.securityGroups && vpcConfig.securityGroups.length > 0) {
      securityGroups = vpcConfig.securityGroups;
    } else {
      const securityGroup = new ec2.SecurityGroup(this.scope!, 'SecurityGroup', {
        vpc: vpcConfig.vpc,
        allowAllOutbound: vpcConfig.allowAllOutbound,
      });
      securityGroups = [securityGroup];
    }

    const vpcSubnets = vpcConfig.vpcSubnets ? vpcConfig.vpc.selectSubnets(vpcConfig.vpcSubnets) : vpcConfig.vpc.selectSubnets();

    return {
      connections: new ec2.Connections({ securityGroups: securityGroups }),
      vpcSubnets: vpcSubnets,
    };
  };
}

/**
 * Network configuration for the Runtime.
 */
export class RuntimeNetworkConfiguration extends NetworkConfiguration {
  /**
   * Creates a public network configuration. PUBLIC is the default network mode.
   * @returns A RuntimeNetworkConfiguration.
   * Run the runtime in a public environment with internet access, suitable for less sensitive or open-use scenarios.
   */
  public static usingPublicNetwork(): RuntimeNetworkConfiguration {
    return new RuntimeNetworkConfiguration('PUBLIC');
  }

  /**
   * Creates a network configuration from a VPC configuration.
   * @param scope - The construct scope for creating resources.
   * @param vpcConfig - The VPC configuration.
   * @returns A RuntimeNetworkConfiguration.
   */
  public static usingVpc(scope: Construct, vpcConfig: VpcConfigProps): RuntimeNetworkConfiguration {
    return new RuntimeNetworkConfiguration('VPC', scope, vpcConfig);
  }

  /**
   * Renders the network configuration as a CloudFormation property.
   * @param runtimeConnections - The connections object to the runtime.
   * @internal This is an internal core function and should not be called directly.
   *
   * Note: The current CloudFormation spec for Runtime only supports networkMode.
   */
  public _render(_runtimeConnections?: ec2.Connections): CfnRuntime.NetworkConfigurationProperty {
    // Note: Currently only networkMode is supported in CloudFormation
    return {
      networkMode: this.networkMode,
    };
  }
}
