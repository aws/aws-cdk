import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import { CfnVirtualNode } from './appmesh.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';


/**
 * Represents the properties needed to define CloudMap Service Discovery
 */
export interface CloudMapServiceDiscoveryOptions {
  /**
   * The AWS Cloud Map Service to use for service discovery
   */
  readonly service: cloudmap.IService;

  /**
   * A string map that contains attributes with values that you can use to
   * filter instances by any custom attribute that you specified when you
   * registered the instance. Only instances that match all of the specified
   * key/value pairs will be returned.
   *
   * @default - no instance attributes
   */
  readonly instanceAttributes?: {[key: string]: string};
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
 * Provides the Service Discovery method a VirtualNode uses
 */
export abstract class ServiceDiscovery {
  /**
   * Returns DNS based service discovery
   */
  public static dns(hostname: string): ServiceDiscovery {
    return new DnsServiceDiscovery(hostname);
  }

  /**
   * Returns Cloud Map based service discovery
   */
  public static cloudMap(options: CloudMapServiceDiscoveryOptions): ServiceDiscovery {
    return new CloudMapServiceDiscovery(options);
  }

  /**
   * Binds the current object when adding Service Discovery to a VirtualNode
   */
  public abstract bind(scope: Construct): ServiceDiscoveryConfig;
}

class DnsServiceDiscovery extends ServiceDiscovery {
  private readonly hostname: string;

  constructor(hostname: string) {
    super();
    this.hostname = hostname;
  }

  public bind(_scope: Construct): ServiceDiscoveryConfig {
    return {
      dns: {
        hostname: this.hostname,
      },
    };
  }
}

class CloudMapServiceDiscovery extends ServiceDiscovery {
  private readonly service: cloudmap.IService;
  private readonly instanceAttributes?: {[key: string]: string};

  constructor(options: CloudMapServiceDiscoveryOptions) {
    super();
    this.service = options.service;
    this.instanceAttributes = options.instanceAttributes;
  }

  public bind(_scope: Construct): ServiceDiscoveryConfig {
    return {
      cloudmap: {
        namespaceName: this.service.namespace.namespaceName,
        serviceName: this.service.serviceName,
        attributes: renderAttributes(this.instanceAttributes),
      },
    };
  }
}

function renderAttributes(attrs?: {[key: string]: string}) {
  if (attrs === undefined) { return undefined; }
  return Object.entries(attrs).map(([key, value]) => ({ key, value }));
}