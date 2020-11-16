import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnVirtualNode } from './appmesh.generated';
import { IMesh, Mesh } from './mesh';
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
   * The Amazon Resource Name belonging to the VirtualNode
   *
   * Set this value as the APPMESH_VIRTUAL_NODE_NAME environment variable for
   * your task group's Envoy proxy container in your task definition or pod
   * spec.
   *
   * @attribute
   */
  readonly virtualNodeArn: string;

  /**
   * The Mesh which the VirtualNode belongs to
   */
  readonly mesh: IMesh;

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
   * The Mesh which the VirtualNode belongs to
   */
  readonly mesh: IMesh;
}

abstract class VirtualNodeBase extends cdk.Resource implements IVirtualNode {
  /**
   * The name of the VirtualNode
   */
  public abstract readonly virtualNodeName: string;

  /**
   * The Amazon Resource Name belonging to the VirtualNode
   */
  public abstract readonly virtualNodeArn: string;

  /**
   * The Mesh which the VirtualNode belongs to
   */
  public abstract readonly mesh: IMesh;
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
    return new class extends VirtualNodeBase {
      readonly virtualNodeArn = virtualNodeArn;
      private readonly parsedArn = cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(virtualNodeArn).resourceName!);
      readonly mesh = Mesh.fromMeshName(this, 'Mesh', cdk.Fn.select(0, this.parsedArn));
      readonly virtualNodeName = cdk.Fn.select(2, this.parsedArn);
    }(scope, id);
  }

  /**
   * Import an existing VirtualNode given its name
   */
  public static fromVirtualNodeAttributes(scope: Construct, id: string, attrs: VirtualNodeAttributes): IVirtualNode {
    return new class extends VirtualNodeBase {
      readonly mesh = attrs.mesh;
      readonly virtualNodeName = attrs.virtualNodeName;
      readonly virtualNodeArn = cdk.Stack.of(this).formatArn({
        service: 'appmesh',
        resource: `mesh/${attrs.mesh.meshName}/virtualNode`,
        resourceName: this.virtualNodeName,
      });
    }(scope, id);
  }

  /**
   * The name of the VirtualNode
   */
  public readonly virtualNodeName: string;

  /**
   * The Amazon Resource Name belonging to the VirtualNode
   */
  public readonly virtualNodeArn: string;

  /**
   * The Mesh which the VirtualNode belongs to
   */
  public readonly mesh: IMesh;

  private readonly backends = new Array<CfnVirtualNode.BackendProperty>();
  private readonly listeners = new Array<VirtualNodeListenerConfig>();

  constructor(scope: Construct, id: string, props: VirtualNodeProps) {
    super(scope, id, {
      physicalName: props.virtualNodeName || cdk.Lazy.stringValue({ produce: () => cdk.Names.uniqueId(this) }),
    });

    this.mesh = props.mesh;

    props.backends?.forEach(backend => this.addBackend(backend));
    props.listeners?.forEach(listener => this.addListener(listener));
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

  /**
   * Utility method to add an inbound listener for this VirtualNode
   */
  public addListener(listener: VirtualNodeListener) {
    this.listeners.push(listener.bind(this));
  }

  /**
   * Add a Virtual Services that this node is expected to send outbound traffic to
   */
  public addBackend(virtualService: IVirtualService) {
    this.backends.push({
      virtualService: {
        virtualServiceName: virtualService.virtualServiceName,
      },
    });
  }
}

function renderAttributes(attrs?: {[key: string]: string}) {
  if (attrs === undefined) { return undefined; }
  return Object.entries(attrs).map(([key, value]) => ({ key, value }));
}

/**
 * Interface with properties necessary to import a reusable VirtualNode
 */
export interface VirtualNodeAttributes {
  /**
   * The name of the VirtualNode
   */
  readonly virtualNodeName: string;

  /**
   * The Mesh that the VirtualNode belongs to
   */
  readonly mesh: IMesh;
}
