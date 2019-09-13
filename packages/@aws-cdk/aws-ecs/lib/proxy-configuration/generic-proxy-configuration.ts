import { CfnTaskDefinition } from '../ecs.generated';
import { ProxyConfiguration } from './proxy-configuration';

/**
 * The generic configuration to use when setting a proxy configuration.
 */
export interface GenericProxyConfigurationConfigProps {
  /**
   * The name of the container that will serve as the App Mesh proxy.
   */
  readonly containerName: string;

  /**
   * The set of network configuration parameters to provide the Container Network Interface (CNI) plugin.
   */
  readonly properties?: CfnTaskDefinition.KeyValuePairProperty[]

  /**
   * The proxy type.
   */
  readonly type: string;
}

/**
 * The generic class for proxy configurations.
 */
export class GenericProxyConfiguration extends ProxyConfiguration {
  /**
   * Constructs a new instance of the GenericProxyConfiguration class.
   */
  constructor(private readonly props: GenericProxyConfigurationConfigProps) {
    super();
  }

  /**
   * Called when the proxy configuration is configured on a task definition.
   */
  public bind(): CfnTaskDefinition.ProxyConfigurationProperty {
    return {
      containerName: this.props.containerName,
      proxyConfigurationProperties: this.props.properties,
      type: this.props.type
    };
  }
}