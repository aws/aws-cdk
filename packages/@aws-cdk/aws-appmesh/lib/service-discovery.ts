import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import { Construct } from 'constructs';
import { CfnVirtualNode } from './appmesh.generated';

/**
 * Enum of supported IP preferences.
 * Used to dictate the IP version for mesh wide and virtual node service discovery.
 * Also used to specify the IP version that a sidecar Envoy uses when sending traffic to a local application.
 */

export enum IpPreference {
  /**
   * Use IPv4 when sending traffic to a local application.
   * Only use IPv4 for service discovery.
   */
  IPV4_ONLY = 'IPv4_ONLY',
  /**
   * Use IPv4 when sending traffic to a local application.
   * First attempt to use IPv4 and fall back to IPv6 for service discovery.
   */
  IPV4_PREFERRED = 'IPv4_PREFERRED',
  /**
   * Use IPv6 when sending traffic to a local application.
   * Only use IPv6 for service discovery.
   */
  IPV6_ONLY = 'IPv6_ONLY',
  /**
   * Use IPv6 when sending traffic to a local application.
   * First attempt to use IPv6 and fall back to IPv4 for service discovery.
   */
  IPV6_PREFERRED = 'IPv6_PREFERRED'
}

/**
 * Properties for Mesh Service Discovery
 */
export interface MeshServiceDiscovery {
  /**
   * IP preference applied to all Virtual Nodes in the Mesh
   *
   * @default - No IP preference is applied to any of the Virtual Nodes in the Mesh.
   *  Virtual Nodes without an IP preference will have the following configured.
   *  Envoy listeners are configured to bind only to IPv4.
   *  Envoy will use IPv4 when sending traffic to a local application.
   *  For DNS service discovery, the Envoy DNS resolver to prefer using IPv6 and fall back to IPv4.
   *  For CloudMap service discovery, App Mesh will prefer using IPv4 and fall back to IPv6 for IPs returned by CloudMap.
   */
  readonly ipPreference?: IpPreference;
}

/**
 * Properties for VirtualNode Service Discovery
 */
export interface ServiceDiscoveryConfig {
  /**
   * DNS based Service Discovery
   *
   * @default - no DNS based service discovery
   */
  readonly dns?: CfnVirtualNode.DnsServiceDiscoveryProperty;

  /**
   * Cloud Map based Service Discovery
   *
   * @default - no Cloud Map based service discovery
   */
  readonly cloudmap?: CfnVirtualNode.AwsCloudMapServiceDiscoveryProperty;
}

/**
 * Enum of DNS service discovery response type
 */
export enum DnsResponseType {
  /**
   * DNS resolver returns a loadbalanced set of endpoints and the traffic would be sent to the given endpoints.
   * It would not drain existing connections to other endpoints that are not part of this list.
   */
  LOAD_BALANCER = 'LOADBALANCER',

  /**
   * DNS resolver is returning all the endpoints.
   * This also means that if an endpoint is missing, it would drain the current connections to the missing endpoint.
   */
  ENDPOINTS = 'ENDPOINTS',
}

/**
 * Provides the Service Discovery method a VirtualNode uses
 */
export abstract class ServiceDiscovery {
  /**
   * Returns DNS based service discovery
   *
   * @param hostname
   * @param responseType Specifies the DNS response type for the virtual node.
   *  The default is `DnsResponseType.LOAD_BALANCER`.
   * @param ipPreference No IP preference is applied to the Virtual Node.
   */
  public static dns(hostname: string, responseType?: DnsResponseType, ipPreference?: IpPreference): ServiceDiscovery {
    return new DnsServiceDiscovery(hostname, responseType, ipPreference);
  }

  /**
   * Returns Cloud Map based service discovery
   *
   * @param service The AWS Cloud Map Service to use for service discovery
   * @param instanceAttributes A string map that contains attributes with values that you can use to
   *  filter instances by any custom attribute that you specified when you
   *  registered the instance. Only instances that match all of the specified
   *  key/value pairs will be returned.
   * @param ipPreference No IP preference is applied to the Virtual Node.
   */
  public static cloudMap(service: cloudmap.IService, instanceAttributes?: {[key: string]: string}, ipPreference?: IpPreference): ServiceDiscovery {
    return new CloudMapServiceDiscovery(service, instanceAttributes, ipPreference);
  }

  /**
   * Binds the current object when adding Service Discovery to a VirtualNode
   */
  public abstract bind(scope: Construct): ServiceDiscoveryConfig;
}

class DnsServiceDiscovery extends ServiceDiscovery {
  private readonly hostname: string;
  private readonly responseType?: DnsResponseType;
  private readonly ipPreference?: IpPreference;

  constructor(hostname: string, responseType?: DnsResponseType, ipPreference?: IpPreference) {
    super();
    this.hostname = hostname;
    this.responseType = responseType;
    this.ipPreference = ipPreference;
  }

  public bind(_scope: Construct): ServiceDiscoveryConfig {
    return {
      dns: {
        hostname: this.hostname,
        responseType: this.responseType,
        ipPreference: this.ipPreference,
      },
    };
  }
}

class CloudMapServiceDiscovery extends ServiceDiscovery {
  private readonly service: cloudmap.IService;
  private readonly instanceAttributes?: {[key: string]: string};
  private readonly ipPreference?: IpPreference;

  constructor(service: cloudmap.IService, instanceAttributes?: {[key: string]: string}, ipPreference?: IpPreference) {
    super();
    this.service = service;
    this.instanceAttributes = instanceAttributes;
    this.ipPreference = ipPreference;
  }

  public bind(_scope: Construct): ServiceDiscoveryConfig {
    return {
      cloudmap: {
        namespaceName: this.service.namespace.namespaceName,
        serviceName: this.service.serviceName,
        attributes: renderAttributes(this.instanceAttributes),
        ipPreference: this.ipPreference,
      },
    };
  }
}

function renderAttributes(attrs?: {[key: string]: string}) {
  if (attrs === undefined) { return undefined; }
  return Object.entries(attrs).map(([key, value]) => ({ key, value }));
}
