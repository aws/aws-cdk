// Internal libs

import { CfnRuntime } from 'aws-cdk-lib/aws-bedrockagentcore';

/**
 * Network mode for the agent runtime
 * @internal
 */
enum NetworkMode {
  /**
   * Public network mode - runtime accessible via internet
   */
  PUBLIC = 'PUBLIC',

  /**
   * Private network mode - runtime only accessible within VPC
   */
  PRIVATE = 'PRIVATE',
}

/**
 * Network configuration for Agent Runtime.
 * Provides static factory methods for creating network configurations.
 */
export abstract class NetworkConfiguration {
  /**
   * Network mode for the runtime
   */
  readonly networkMode: string;

  /**
   * Creates a new network configuration.
   * @param mode - the network mode to use for the runtime
   */
  protected constructor (mode: string) {
    this.networkMode = mode;
  }
}

/**
 * Network configuration for the Browser tool.
 */
export class RuntimeNetworkConfiguration extends NetworkConfiguration {
  /**
   * Legacy constant for backward compatibility
   * @deprecated Use RuntimeNetworkConfiguration.publicNetwork() instead
   */
  public static readonly PUBLIC_NETWORK = new RuntimeNetworkConfiguration(NetworkMode.PUBLIC);

  /**
   * Creates a public network configuration
   * @returns A public network configuration
   */
  public static publicNetwork(): RuntimeNetworkConfiguration {
    return new RuntimeNetworkConfiguration(NetworkMode.PUBLIC);
  }

  /**
   * Creates a new runtime network configuration.
   * @param mode - the network mode to use
   */
  private constructor(mode: string) {
    super(mode);
  }

  /**
   * Renders the network configuration as a CloudFormation property.
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): CfnRuntime.NetworkConfigurationProperty {
    return {
      networkMode: this.networkMode,
    };
  }
}
