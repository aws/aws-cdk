import { CfnTaskDefinition } from '../ecs.generated';
import { AppMeshProxyConfiguration, AppMeshProxyConfigurationConfigProps } from './app-mesh-proxy-configuration';

/**
 * The base class for proxy configurations.
 */
export abstract class ProxyConfiguration {
  /**
   * Constructs a new instance of the ProxyConfiguration class.
   */
  public static appMeshProxyConfiguration(props: AppMeshProxyConfigurationConfigProps): ProxyConfiguration {
    return new AppMeshProxyConfiguration(props);
  }

  /**
   * Called when the proxy configuration is configured on a task definition.
   */
  public abstract bind(): CfnTaskDefinition.ProxyConfigurationProperty;
}

/**
 * The configuration to use when setting a proxy configuration.
 */
export interface ProxyConfigurationConfigProps {
  /**
   * The name of the container that will serve as the App Mesh proxy.
   */
  readonly containerName: string;

  /**
   * The proxy type.
   */
  readonly type?: string;
}