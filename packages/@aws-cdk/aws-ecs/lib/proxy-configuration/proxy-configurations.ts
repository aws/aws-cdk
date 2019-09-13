import { AppMeshProxyConfiguration, AppMeshProxyConfigurationConfigProps } from './app-mesh-proxy-configuration';
import { GenericProxyConfiguration, GenericProxyConfigurationConfigProps } from './generic-proxy-configuration';
import { ProxyConfiguration } from './proxy-configuration';

/**
 * The base class for proxy configurations.
 */
export class ProxyConfigurations {
  /**
   * Constructs a new instance of the ProxyConfiguration class.
   */
  public static appMeshProxyConfiguration(props: AppMeshProxyConfigurationConfigProps): ProxyConfiguration {
    return new AppMeshProxyConfiguration(props);
  }

  /**
   * Constructs a new instance of the GenericConfiguration class.
   */
  public static genericProxyConfiguration(props: GenericProxyConfigurationConfigProps): ProxyConfiguration {
    return new GenericProxyConfiguration(props);
  }
}