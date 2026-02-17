import type { Construct } from 'constructs';
import { VirtualNodeGrants } from './appmesh-grants.generated';
import type { IVirtualNodeRef, VirtualNodeReference } from './appmesh.generated';
import { CfnVirtualNode } from './appmesh.generated';
import type { IMesh } from './mesh';
import { Mesh } from './mesh';
import { renderMeshOwner, renderTlsClientPolicy } from './private/utils';
import type { ServiceDiscovery, ServiceDiscoveryConfig } from './service-discovery';
import type { AccessLog, BackendDefaults, Backend } from './shared-interfaces';
import type { VirtualNodeListener, VirtualNodeListenerConfig } from './virtual-node-listener';
import type * as iam from '../../aws-iam';
import * as cdk from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Interface which all VirtualNode based classes must implement
 */
export interface IVirtualNode extends cdk.IResource, IVirtualNodeRef {
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

  /**
   * Grants the given entity `appmesh:StreamAggregatedResources`.
   */
  grantStreamAggregatedResources(identity: iam.IGrantable): iam.Grant;
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
   * Defines how upstream clients will discover this VirtualNode
   *
   * @default - No Service Discovery
   */
  readonly serviceDiscovery?: ServiceDiscovery;

  /**
   * Virtual Services that this is node expected to send outbound traffic to
   *
   * @default - No backends
   */
  readonly backends?: Backend[];

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

  /**
   * Default Configuration Virtual Node uses to communicate with Virtual Service
   *
   * @default - No Config
   */
  readonly backendDefaults?: BackendDefaults;
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

  /**
   * Collection of grants for this Virtual Node
   */
  public readonly grants = VirtualNodeGrants.fromVirtualNode(this);

  public get virtualNodeRef(): VirtualNodeReference {
    return {
      virtualNodeArn: this.virtualNodeArn,
    };
  }

  /**
   *
   * The use of this method is discouraged. Please use `grants.streamAggregatedResources()` instead.
   *
   * [disable-awslint:no-grants]
   */
  public grantStreamAggregatedResources(identity: iam.IGrantable): iam.Grant {
    return this.grants.streamAggregatedResources(identity);
  }
}

/**
 * VirtualNode represents a newly defined AppMesh VirtualNode
 *
 * Any inbound traffic that your virtual node expects should be specified as a
 * listener. Any outbound traffic that your virtual node expects to reach
 * should be specified as a backend.
 * [disable-awslint:no-grants]
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_nodes.html
 */
@propertyInjectable
export class VirtualNode extends VirtualNodeBase {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-appmesh.VirtualNode';

  /**
   * Import an existing VirtualNode given an ARN
   */
  public static fromVirtualNodeArn(scope: Construct, id: string, virtualNodeArn: string): IVirtualNode {
    return new class extends VirtualNodeBase {
      readonly virtualNodeArn = virtualNodeArn;
      private readonly parsedArn = cdk.Fn.split('/', cdk.Stack.of(scope).splitArn(virtualNodeArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName!);
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
  @memoizedGetter
  public get virtualNodeName(): string {
    return this.getResourceNameAttribute(this.resource.attrVirtualNodeName);
  }

  /**
   * The Amazon Resource Name belonging to the VirtualNode
   */
  @memoizedGetter
  public get virtualNodeArn(): string {
    return this.getResourceArnAttribute(this.resource.ref, {
      service: 'appmesh',
      resource: `mesh/${this.mesh.meshName}/virtualNode`,
      resourceName: this.physicalName,
    });
  }

  /**
   * The Mesh which the VirtualNode belongs to
   */
  public readonly mesh: IMesh;

  private readonly serviceDiscoveryConfig?: ServiceDiscoveryConfig;

  private readonly backends = new Array<CfnVirtualNode.BackendProperty>();
  private readonly listeners = new Array<VirtualNodeListenerConfig>();
  private readonly resource: CfnVirtualNode;

  constructor(scope: Construct, id: string, props: VirtualNodeProps) {
    super(scope, id, {
      physicalName: props.virtualNodeName || cdk.Lazy.string({ produce: () => cdk.Names.uniqueId(this) }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.mesh = props.mesh;
    this.serviceDiscoveryConfig = props.serviceDiscovery?.bind(this);

    props.backends?.forEach(backend => this.addBackend(backend));
    props.listeners?.forEach(listener => this.addListener(listener));
    const accessLogging = props.accessLog?.bind(this);

    this.resource = new CfnVirtualNode(this, 'Resource', {
      virtualNodeName: this.physicalName,
      meshName: this.mesh.meshName,
      meshOwner: renderMeshOwner(this.env.account, this.mesh.env.account),
      spec: {
        backends: cdk.Lazy.any({ produce: () => this.backends }, { omitEmptyArray: true }),
        listeners: cdk.Lazy.any({ produce: () => this.listeners.map(listener => listener.listener) }, { omitEmptyArray: true }),
        backendDefaults: props.backendDefaults !== undefined
          ? {
            clientPolicy: {
              tls: renderTlsClientPolicy(this, props.backendDefaults?.tlsClientPolicy),
            },
          }
          : undefined,
        serviceDiscovery: renderServiceDiscovery(this.serviceDiscoveryConfig),
        logging: accessLogging !== undefined ? {
          accessLog: accessLogging.virtualNodeAccessLog,
        } : undefined,
      },
    });
  }

  /**
   * Utility method to add an inbound listener for this VirtualNode
   *
   * Note: At this time, Virtual Nodes support at most one listener. Adding
   * more than one will result in a failure to deploy the CloudFormation stack.
   * However, the App Mesh team has plans to add support for multiple listeners
   * on Virtual Nodes and Virtual Routers.
   *
   * @see https://github.com/aws/aws-app-mesh-roadmap/issues/120
   */
  @MethodMetadata()
  public addListener(listener: VirtualNodeListener) {
    if (!this.serviceDiscoveryConfig) {
      throw new cdk.ValidationError('Service discovery information is required for a VirtualNode with a listener.', this);
    }
    this.listeners.push(listener.bind(this));
  }

  /**
   * Add a Virtual Services that this node is expected to send outbound traffic to
   */
  @MethodMetadata()
  public addBackend(backend: Backend) {
    this.backends.push(backend.bind(this).virtualServiceBackend);
  }
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

function renderServiceDiscovery(config?: ServiceDiscoveryConfig): CfnVirtualNode.ServiceDiscoveryProperty | undefined {
  return config
    ? {
      dns: config?.dns,
      awsCloudMap: config?.cloudmap,
    }
    : undefined;
}
