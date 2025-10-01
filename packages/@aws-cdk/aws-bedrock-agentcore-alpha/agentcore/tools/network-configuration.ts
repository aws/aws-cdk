// Internal Libs
import { CfnBrowserCustom, CfnCodeInterpreterCustom } from 'aws-cdk-lib/aws-bedrockagentcore';

/**
 * Network modes. Configure the security level for agent
 * execution to control access, isolate resources, and protect sensitive data.
 */
export enum NetworkMode {
  /**
   * Run this tool to operate in a public environment with internet access, suitable for less sensitive or open-use scenarios.
   */
  PUBLIC = 'PUBLIC',
  /**
   * Run this tool in a restricted environment with limited Permissions and Encryption to enhance safety and reduce potential risks.
   */
  SANDBOX = 'SANDBOX',
}

/**
 * Abstract base class for network configuration.
 */
export abstract class NetworkConfiguration {
  /**
   * The network mode to use for the tool.
   */
  readonly networkMode: NetworkMode;
  /**
   * Creates a new network configuration.
   * @param mode - the network mode to use for the tool.
   */
  protected constructor (mode: NetworkMode) {
    this.networkMode = mode;
  }
}

/**
 * Network configuration for the Browser tool.
 */
export class BrowserNetworkConfiguration extends NetworkConfiguration {
  /**
   * Creates a public network configuration.
   */
  public static readonly PUBLIC_NETWORK = new BrowserNetworkConfiguration(NetworkMode.PUBLIC);

  /**
   * Renders the network configuration as a CloudFormation property.
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): CfnBrowserCustom.BrowserNetworkConfigurationProperty {
    return {
      networkMode: this.networkMode,
    };
  }
}

/**
 * Network configuration for the Code Interpreter tool.
 */
export class CodeInterpreterNetworkConfiguration extends NetworkConfiguration {
  /**
   * Creates a public network configuration.
   */
  public static readonly PUBLIC_NETWORK = new CodeInterpreterNetworkConfiguration(NetworkMode.PUBLIC);
  /**
   * Creates a sandbox network configuration.
   */
  public static readonly SANDBOX_NETWORK = new CodeInterpreterNetworkConfiguration(NetworkMode.SANDBOX);

  /**
   * Renders the network configuration as a CloudFormation property.
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): CfnCodeInterpreterCustom.CodeInterpreterNetworkConfigurationProperty {
    return {
      networkMode: this.networkMode,
    };
  }
}
