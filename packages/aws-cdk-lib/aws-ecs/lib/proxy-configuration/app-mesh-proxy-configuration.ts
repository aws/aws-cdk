import { Construct } from 'constructs';
import { ProxyConfiguration } from './proxy-configuration';
import { TaskDefinition } from '../base/task-definition';
import { CfnTaskDefinition } from '../ecs.generated';

/**
 * Interface for setting the properties of proxy configuration.
 */
export interface AppMeshProxyConfigurationProps {
  /**
   * The user ID (UID) of the proxy container as defined by the user parameter in a container definition.
   * This is used to ensure the proxy ignores its own traffic. If IgnoredGID is specified, this field can be empty.
   */
  readonly ignoredUID?: number;

  /**
   * The group ID (GID) of the proxy container as defined by the user parameter in a container definition.
   * This is used to ensure the proxy ignores its own traffic. If IgnoredUID is specified, this field can be empty.
   */
  readonly ignoredGID?: number;

  /**
   * The list of ports that the application uses.
   * Network traffic to these ports is forwarded to the ProxyIngressPort and ProxyEgressPort.
   */
  readonly appPorts: number[];

  /**
   * Specifies the port that incoming traffic to the AppPorts is directed to.
   */
  readonly proxyIngressPort: number;

  /**
   * Specifies the port that outgoing traffic from the AppPorts is directed to.
   */
  readonly proxyEgressPort: number;

  /**
   * The egress traffic going to these specified ports is ignored and not redirected to the ProxyEgressPort. It can be an empty list.
   */
  readonly egressIgnoredPorts?: number[];

  /**
   * The egress traffic going to these specified IP addresses is ignored and not redirected to the ProxyEgressPort. It can be an empty list.
   */
  readonly egressIgnoredIPs?: string[];
}

/**
 * The configuration to use when setting an App Mesh proxy configuration.
 */
export interface AppMeshProxyConfigurationConfigProps {
  /**
   * The name of the container that will serve as the App Mesh proxy.
   */
  readonly containerName: string;

  /**
   * The set of network configuration parameters to provide the Container Network Interface (CNI) plugin.
   */
  readonly properties: AppMeshProxyConfigurationProps;
}

/**
 * The class for App Mesh proxy configurations.
 *
 * For tasks using the EC2 launch type, the container instances require at least version 1.26.0 of the container agent and at least version
 * 1.26.0-1 of the ecs-init package to enable a proxy configuration. If your container instances are launched from the Amazon ECS-optimized
 * AMI version 20190301 or later, then they contain the required versions of the container agent and ecs-init.
 * For more information, see [Amazon ECS-optimized AMIs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html).
 *
 * For tasks using the Fargate launch type, the task or service requires platform version 1.3.0 or later.
 */
export class AppMeshProxyConfiguration extends ProxyConfiguration {
  /**
   * Constructs a new instance of the AppMeshProxyConfiguration class.
   */
  constructor(private readonly props: AppMeshProxyConfigurationConfigProps) {
    super();
    if (props.properties) {
      if (!props.properties.ignoredUID && !props.properties.ignoredGID) {
        throw new Error('At least one of ignoredUID or ignoredGID should be specified.');
      }
    }
  }

  /**
   * Called when the proxy configuration is configured on a task definition.
   */
  public bind(_scope: Construct, _taskDefinition: TaskDefinition): CfnTaskDefinition.ProxyConfigurationProperty {
    const configProps = this.props.properties;
    const configType = 'APPMESH';
    return {
      containerName: this.props.containerName,
      proxyConfigurationProperties: renderProperties(configProps),
      type: configType,
    };
  }
}

function renderProperties(props: AppMeshProxyConfigurationProps): CfnTaskDefinition.KeyValuePairProperty[] {
  const ret = new Array<CfnTaskDefinition.KeyValuePairProperty>();
  for (const [k, v] of Object.entries(props)) {
    const key = String(k);
    const value = String(v);
    if (value !== 'undefined' && value !== '') {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      ret.push({ ['name']: capitalizedKey, ['value']: value });
    }
  }
  return ret;
}