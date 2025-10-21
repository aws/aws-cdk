import * as ec2 from 'aws-cdk-lib/aws-ec2';
// Internal Libs
import { CfnBrowserCustom, CfnCodeInterpreterCustom } from 'aws-cdk-lib/aws-bedrockagentcore';
import { Construct } from 'constructs';

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
   * Whether to allow the resource to send all network traffic (except ipv6)
   *
   * If set to false, you must individually add traffic rules to allow the
   * resource to connect to network targets.
   *
   * Do not specify this property if the `securityGroups` property is set.
   * Instead, configure `allowAllOutbound` directly on the security group.
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
   * The VPC subnets to use.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;
  /**
   * Creates a new network configuration.
   * @param mode - the network mode to use for the tool.
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
      throw new Error('Cannot configure \'securityGroups\' or \'allowAllOutbound\' without configuring a VPC');
    }

    if (!vpcConfig?.vpc) {
      return undefined;
    }

    if ((vpcConfig?.securityGroups && vpcConfig?.securityGroups.length > 0) && vpcConfig?.allowAllOutbound !== undefined) {
      throw new Error('Configure \'allowAllOutbound\' directly on the supplied SecurityGroups');
    }

    if (!this.scope) {
      throw new Error('Scope is required to create the security group');
    }

    let securityGroups: ec2.ISecurityGroup[];
    if (vpcConfig.securityGroups && vpcConfig.securityGroups.length > 0) {
      securityGroups = vpcConfig.securityGroups;
    } else {
      const securityGroup = new ec2.SecurityGroup(this.scope!, 'SecurityGroup', {
        vpc: vpcConfig.vpc,
        allowAllOutbound: vpcConfig.allowAllOutbound ?? true,
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
 * Network configuration for the Browser tool.
 */
export class BrowserNetworkConfiguration extends NetworkConfiguration {
  /**
   * Creates a public network configuration. PUBLIC is the default network mode.
   * @returns A BrowserNetworkConfiguration.
   * Run this tool to operate in a public environment with internet access, suitable for less sensitive or open-use scenarios.
   */
  public static usingPublicNetwork(): BrowserNetworkConfiguration {
    return new BrowserNetworkConfiguration('PUBLIC');
  }

  /**
   * Creates a network configuration from a VPC configuration.
   * @param vpcConfig - The VPC configuration.
   * @returns A BrowserNetworkConfiguration.
   */
  public static usingVpc(scope: Construct, vpcConfig: VpcConfigProps): BrowserNetworkConfiguration {
    return new BrowserNetworkConfiguration('VPC', scope, vpcConfig);
  }

  /**
   * Renders the network configuration as a CloudFormation property.
   * @param browserConnections - The connections object to the browser.
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(browserConnections?: ec2.Connections): CfnBrowserCustom.BrowserNetworkConfigurationProperty {
    return {
      networkMode: this.networkMode,
      vpcConfig: (this.networkMode === 'VPC' && browserConnections) ? {
        subnets: this.vpcSubnets?.subnets?.map(subnet => subnet.subnetId) ?? [],
        securityGroups: browserConnections?.securityGroups?.map(s => s.securityGroupId) ?? [],
      } : undefined,
    };
  }
}

/**
 * Network configuration for the Code Interpreter tool.
 */
export class CodeInterpreterNetworkConfiguration extends NetworkConfiguration {
  /**
   * Creates a public network configuration.
   * @returns A CodeInterpreterNetworkConfiguration.
   * Run this tool to operate in a public environment with internet access, suitable for less sensitive or open-use scenarios.
   */
  public static usingPublicNetwork(): CodeInterpreterNetworkConfiguration {
    return new CodeInterpreterNetworkConfiguration('PUBLIC');
  }

  /**
   * Creates a sandbox network configuration.
   * @returns A CodeInterpreterNetworkConfiguration.
   * Run this tool in a restricted environment with limited Permissions and Encryption to enhance safety and reduce potential risks.
   */
  public static usingSandboxNetwork(): CodeInterpreterNetworkConfiguration {
    return new CodeInterpreterNetworkConfiguration('SANDBOX');
  }

  /**
   * Creates a network configuration from a VPC configuration.
   * @param vpcConfig - The VPC configuration.
   * @returns A CodeInterpreterNetworkConfiguration.
   */
  public static usingVpc(scope: Construct, vpcConfig: VpcConfigProps): CodeInterpreterNetworkConfiguration {
    return new CodeInterpreterNetworkConfiguration('VPC', scope, vpcConfig);
  }

  /**
   * Renders the network configuration as a CloudFormation property.
   * @param codeInterpreterConnections - The connections object to the code interpreter.
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(codeInterpreterConnections?: ec2.Connections): CfnCodeInterpreterCustom.CodeInterpreterNetworkConfigurationProperty {
    return {
      networkMode: this.networkMode,
      vpcConfig: (this.networkMode === 'VPC' && codeInterpreterConnections) ? {
        subnets: this.vpcSubnets?.subnets?.map(subnet => subnet.subnetId) ?? [],
        securityGroups: codeInterpreterConnections?.securityGroups?.map(s => s.securityGroupId) ?? [],
      } : undefined,
    };
  }
}
