import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnVirtualNode } from './appmesh.generated';
import { IMesh } from './mesh';
import { AccessLog } from './shared-interfaces';
import { VirtualNodeListener, VirtualNodeListenerConfig } from './virtual-node-listener';
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
  addListeners(listeners: VirtualNodeListener[]): void;
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
  readonly listeners?: VirtualNodeListener[];

  /**
   * Access Logging Configuration for the virtual node
   *
   * @default - No access logging
   */
  readonly accessLog?: AccessLog;
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
  protected readonly listeners = new Array<VirtualNodeListenerConfig>();

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
   * Utility method to add an inbound listener for this VirtualNode
   */
  public addListeners(listeners: VirtualNodeListener[]) {
    listeners.forEach(listener => this.listeners.push(listener.bind(this)));
  }
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
  public static fromVirtualNodeArn(scope: Construct, id: string, virtualNodeArn: string): IVirtualNode {
    return new ImportedVirtualNode(scope, id, { virtualNodeArn });
  }

  /**
   * Import an existing VirtualNode given its name
   */
  public static fromVirtualNodeName(scope: Construct, id: string, meshName: string, virtualNodeName: string): IVirtualNode {
    return new ImportedVirtualNode(scope, id, {
      meshName,
      virtualNodeName,
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

  constructor(scope: Construct, id: string, props: VirtualNodeProps) {
    super(scope, id, {
      physicalName: props.virtualNodeName || cdk.Lazy.stringValue({ produce: () => this.node.uniqueId }),
    });

    this.mesh = props.mesh;

    this.addBackends(...props.backends || []);
    this.addListeners(props.listeners ? props.listeners : []);
    const accessLogging = props.accessLog?.bind(this);

    const node = new CfnVirtualNode(this, 'Resource', {
      virtualNodeName: this.physicalName,
      meshName: this.mesh.meshName,
      spec: {
        backends: cdk.Lazy.anyValue({ produce: () => this.backends }, { omitEmptyArray: true }),
        listeners: cdk.Lazy.anyValue({ produce: () => this.listeners.map(listener => listener.listener) }, { omitEmptyArray: true }),
        serviceDiscovery: {
          dns: props.dnsHostName !== undefined ? { hostname: props.dnsHostName } : undefined,
          awsCloudMap: props.cloudMapService !== undefined ? {
            serviceName: props.cloudMapService.serviceName,
            namespaceName: props.cloudMapService.namespace.namespaceName,
            attributes: renderAttributes(props.cloudMapServiceInstanceAttributes),
          } : undefined,
        },
        logging: accessLogging !== undefined ? {
          accessLog: accessLogging.virtualNodeAccessLog,
        } : undefined,
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

  constructor(scope: Construct, id: string, props: VirtualNodeAttributes) {
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
