import cloudmap = require('@aws-cdk/aws-servicediscovery');
import cdk = require('@aws-cdk/core');

import { Lazy } from '@aws-cdk/core';
import { CfnVirtualNode } from './appmesh.generated';
import { IMesh } from './mesh';
import { HealthCheck, PortMapping, Protocol, VirtualNodeListener } from './shared-interfaces';
import { IVirtualService } from './virtual-service';

/**
 * Interface which all VirtualNode based classes must implement
 */
export interface IVirtualNode extends cdk.IResource {
  /**
   * The name of the VirtualNode
   *
   * @attribute
   */
  readonly virtualNodeName: string;

  /**
   * The Amazon Resource Name belonging to the VirtualNdoe
   *
   * Set this value as the APPMESH_VIRTUAL_NODE_NAME environment variable for
   * your task group's Envoy proxy container in your task definition or pod
   * spec.
   *
   * @attribute
   */
  readonly virtualNodeArn: string;

  /**
   * Utility method to add backends for existing or new VirtualNodes
   */
  addBackends(...props: IVirtualService[]): void;

  /**
   * Utility method to add Node Listeners for new or existing VirtualNodes
   */
  addListeners(...listeners: VirtualNodeListener[]): void;
}

/**
 * Basic configuration properties for a VirtualNode
 */
export interface VirtualNodeBaseProps {
  /**
   * The name of the VirtualNode
   *
   * @default - A name is automatically determined
   */
  readonly virtualNodeName?: string;

  /**
   * Host name of DNS record used to discover Virtual Node members
   *
   * The IP addresses returned by querying this DNS record will be considered
   * part of the Virtual Node.
   *
   * @default - Don't use DNS-based service discovery
   */
  readonly dnsHostName?: string;

  /**
   * CloudMap service where Virtual Node members register themselves
   *
   * Instances registering themselves into this CloudMap will
   * be considered part of the Virtual Node.
   *
   * @default - Don't use CloudMap-based service discovery
   */
  readonly cloudMapService?: cloudmap.IService;

  /**
   * Filter down the list of CloudMap service instance
   *
   * @default - No CloudMap instance filter
   */
  readonly cloudMapServiceInstanceAttributes?: {[key: string]: string};

  /**
   * Virtual Services that this is node expected to send outbound traffic to
   *
   * @default - No backends
   */
  readonly backends?: IVirtualService[];

  /**
   * Initial listener for the virtual node
   *
   * @default - No listeners
   */
  readonly listener?: VirtualNodeListener;
}

/**
 * The properties used when creating a new VirtualNode
 */
export interface VirtualNodeProps extends VirtualNodeBaseProps {
  /**
   * The name of the AppMesh which the virtual node belongs to
   */
  readonly mesh: IMesh;
}

abstract class VirtualNodeBase extends cdk.Resource implements IVirtualNode {
  /**
   * The name of the VirtualNode
   */
  public abstract readonly virtualNodeName: string;

  /**
   * The Amazon Resource Name belonging to the VirtualNdoe
   */
  public abstract readonly virtualNodeArn: string;

  protected readonly backends = new Array<CfnVirtualNode.BackendProperty>();
  protected readonly listeners = new Array<CfnVirtualNode.ListenerProperty>();

  /**
   * Add a Virtual Services that this node is expected to send outbound traffic to
   */
  public addBackends(...props: IVirtualService[]) {
    for (const s of props) {
      this.backends.push({
        virtualService: {
          virtualServiceName: s.virtualServiceName,
        },
      });
    }
  }

  /**
   * Utility method to add an inbound listener for this virtual node
   */
  public addListeners(...listeners: VirtualNodeListener[]) {
    if (this.listeners.length + listeners.length > 1) {
      throw new Error('VirtualNode may have at most one listener');
    }

    for (const listener of listeners) {
      const portMapping = listener.portMapping || { port: 8080, protocol: Protocol.HTTP };
      this.listeners.push({
        portMapping,
        healthCheck: renderHealthCheck(listener.healthCheck, portMapping),
      });
    }
  }
}

/**
 * Minimum and maximum thresholds for HeathCheck numeric properties
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/APIReference/API_HealthCheckPolicy.html
 */
const HEALTH_CHECK_PROPERTY_THRESHOLDS: {[key in (keyof CfnVirtualNode.HealthCheckProperty)]?: [number, number]} = {
  healthyThreshold: [2, 10],
  intervalMillis: [5000, 300000],
  port: [1, 65535],
  timeoutMillis: [2000, 60000],
  unhealthyThreshold: [2, 10],
};

function renderHealthCheck(hc: HealthCheck | undefined, pm: PortMapping): CfnVirtualNode.HealthCheckProperty | undefined {
  if (hc === undefined) { return undefined; }

  const healthCheck: CfnVirtualNode.HealthCheckProperty = {
    healthyThreshold: hc.healthyThreshold || 2,
    intervalMillis: (hc.interval || cdk.Duration.seconds(5)).toMilliseconds(), // min
    path: hc.path || hc.protocol === Protocol.HTTP ? '/' : undefined,
    port: hc.port || pm.port,
    protocol: hc.protocol || pm.protocol,
    timeoutMillis: (hc.timeout || cdk.Duration.seconds(2)).toMilliseconds(),
    unhealthyThreshold: hc.unhealthyThreshold || 2,
  };

  (Object.keys(healthCheck) as (keyof CfnVirtualNode.HealthCheckProperty)[])
    .filter((key) => HEALTH_CHECK_PROPERTY_THRESHOLDS[key] && typeof healthCheck[key] === 'number')
    .map((key) => {
      const [min, max] = HEALTH_CHECK_PROPERTY_THRESHOLDS[key]!;
      const value = healthCheck[key]!;

      if (value < min) {
        throw new Error(`The value of '${key}' is below the minimum threshold (expected ${min}, got ${value})`);
      }
      if (value > max) {
        throw new Error(`The value of '${key}' is above the maximum threshold (expected ${max}, got ${value})`);
      }
    });

  return healthCheck;
}

/**
 * VirtualNode represents a newly defined AppMesh VirtualNode
 *
 * Any inbound traffic that your virtual node expects should be specified as a
 * listener. Any outbound traffic that your virtual node expects to reach
 * should be specified as a backend.
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_nodes.html
 */
export class VirtualNode extends VirtualNodeBase {
  /**
   * Import an existing VirtualNode given an ARN
   */
  public static fromVirtualNodeArn(scope: cdk.Construct, id: string, virtualNodeArn: string): IVirtualNode {
    return new ImportedVirtualNode(scope, id, { virtualNodeArn });
  }

  /**
   * Import an existing VirtualNode given its name
   */
  public static fromVirtualNodeName(scope: cdk.Construct, id: string, meshName: string, virtualNodeName: string): IVirtualNode {
    return new ImportedVirtualNode(scope, id, {
      meshName,
      virtualNodeName
    });
  }

  /**
   * The name of the VirtualNode
   */
  public readonly virtualNodeName: string;

  /**
   * The Amazon Resource Name belonging to the VirtualNdoe
   */
  public readonly virtualNodeArn: string;

  /**
   * The service mesh that the virtual node resides in
   */
  public readonly mesh: IMesh;

  constructor(scope: cdk.Construct, id: string, props: VirtualNodeProps) {
    super(scope, id, {
      physicalName: props.virtualNodeName || cdk.Lazy.stringValue({ produce: () => this.node.uniqueId })
    });

    this.mesh = props.mesh;

    this.addBackends(...props.backends || []);
    this.addListeners(...props.listener ? [props.listener] : []);

    const node = new CfnVirtualNode(this, 'Resource', {
      virtualNodeName: this.physicalName,
      meshName: this.mesh.meshName,
      spec: {
        backends: Lazy.anyValue({ produce: () => this.backends }, { omitEmptyArray: true }),
        listeners: Lazy.anyValue({ produce: () => this.listeners }, { omitEmptyArray: true }),
        serviceDiscovery: {
          dns: props.dnsHostName !== undefined ? { hostname: props.dnsHostName } : undefined,
          awsCloudMap: props.cloudMapService !== undefined ? {
            serviceName: props.cloudMapService.serviceName,
            namespaceName: props.cloudMapService.namespace.namespaceName,
            attributes: renderAttributes(props.cloudMapServiceInstanceAttributes)
          } : undefined,
        },
        logging: {
          accessLog: {
            file: {
              path: '/dev/stdout',
            },
          },
        },
      },
    });

    this.virtualNodeName = this.getResourceNameAttribute(node.attrVirtualNodeName);
    this.virtualNodeArn = this.getResourceArnAttribute(node.ref, {
      service: 'appmesh',
      resource: `mesh/${props.mesh.meshName}/virtualNode`,
      resourceName: this.physicalName,
    });
  }
}

function renderAttributes(attrs?: {[key: string]: string}) {
  if (attrs === undefined) { return undefined; }
  return Object.entries(attrs).map(([key, value]) => ({ key, value }));
}

/**
 * Interface with properties ncecessary to import a reusable VirtualNode
 */
interface VirtualNodeAttributes {
  /**
   * The name of the VirtualNode
   */
  readonly virtualNodeName?: string;

  /**
   * The Amazon Resource Name belonging to the VirtualNdoe
   */
  readonly virtualNodeArn?: string;

  /**
   * The service mesh that the virtual node resides in
   */
  readonly meshName?: string;
}

/**
 * Used to import a VirtualNode and read it's properties
 */
class ImportedVirtualNode extends VirtualNodeBase {
  /**
   * The name of the VirtualNode
   */
  public readonly virtualNodeName: string;

  /**
   * The Amazon Resource Name belonging to the VirtualNdoe
   */
  public readonly virtualNodeArn: string;

  constructor(scope: cdk.Construct, id: string, props: VirtualNodeAttributes) {
    super(scope, id);

    if (props.virtualNodeArn) {
      this.virtualNodeArn = props.virtualNodeArn;
      this.virtualNodeName = cdk.Fn.select(2, cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(props.virtualNodeArn).resourceName!));
    } else if (props.virtualNodeName && props.meshName) {
      this.virtualNodeName = props.virtualNodeName;
      this.virtualNodeArn = cdk.Stack.of(this).formatArn({
        service: 'appmesh',
        resource: `mesh/${props.meshName}/virtualNode`,
        resourceName: this.virtualNodeName,
      });
    } else {
      throw new Error('Need either arn or both names');
    }
  }
}
