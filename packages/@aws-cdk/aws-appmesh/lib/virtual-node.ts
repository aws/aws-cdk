import { INamespace } from '@aws-cdk/aws-servicediscovery';
import cdk = require('@aws-cdk/cdk');

import { CfnVirtualNode } from './appmesh.generated';
import { IMesh } from './mesh';
import { HealthCheckProps, ListenerProps, PortMappingProps, Protocol } from './shared-interfaces';
import { IVirtualService } from './virtual-service';

/**
 * Interface with properties ncecessary to import a reusable VirtualNode
 */
export interface VirtualNodeImportProps {
  /**
   * The name of the VirtualNode
   */
  readonly virtualNodeName: string;

  /**
   * The Amazon Resource Name belonging to the VirtualNdoe
   */
  readonly virtualNodeArn: string;

  /**
   * The unique identifier for the virtual node
   */
  readonly virtualNodeUid: string;
}
/**
 * Interface which all VirtualNode based classes must implement
 */
export interface IVirtualNode extends cdk.IConstruct {
  /**
   * The name of the VirtualNode
   */
  readonly virtualNodeName: string;

  /**
   * The Amazon Resource Name belonging to the VirtualNdoe
   */
  readonly virtualNodeArn: string;

  /**
   * The unique identifier for the virtual node
   */
  readonly virtualNodeUid: string;

  /**
   * Utility method to add a single backend for existing or new VritualNodes
   */
  addBackend(props: VirtualNodeBackendProps): void;

  /**
   * Utility method to add backends for existing or new VritualNodes
   */
  addBackends(props: VirtualNodeBackendProps[]): void;

  /**
   * Utility method to add Node Listeners for new or existing VirtualNodes
   */
  addListener(props: ListenerProps): void;

  /**
   * Utility method which adds only a single port mapping to the listener property as healthchecks are optional
   */
  addPortMapping(props: PortMappingProps): void;

  /**
   * Utility method which adds only port mappings to the listener property as healthchecks are optional
   */
  addPortMappings(props: PortMappingProps[]): void;

  /**
   * Utility method to add port mappings and healthecks, preferred method would be to use addListeners()
   */
  addPortAndHealthCheckMappings(ports: PortMappingProps[], health: HealthCheckProps[]): void;

  /**
   * Exports properties for VirtualNode reusability
   */
  export(): VirtualNodeImportProps;
}

/**
 * The backend props for which a node communicates within the mesh
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-backend.html
 */
export interface VirtualNodeBackendProps {
  /**
   * The VirtualService name for the backend service
   */
  readonly virtualService: IVirtualService;
}

/**
 * The properties used when creating a new VirtualNode
 */
export interface VirtualNodeProps {
  /**
   * The name of the AppMesh which the virtual node belongs to
   */
  readonly mesh: IMesh;

  /**
   * The name of the VirtualNode
   */
  readonly nodeName?: string;

  /**
   * The hostname of the virtual node, only the host portion
   *
   * @example node-1
   */
  readonly hostname: string;

  /**
   * The service discovery namespace name, this is used for service discovery
   *
   * @example domain.local
   */
  readonly namespace: INamespace;

  /**
   * Array of VirtualNodeBackendProps
   */
  readonly backends?: VirtualNodeBackendProps[];

  /**
   * Listener properties, such as portMappings and optional healthChecks
   */
  readonly listener?: ListenerProps;
}

export abstract class VirtualNodeBase extends cdk.Construct implements IVirtualNode {
  /**
   * The name of the VirtualNode
   */
  public abstract readonly virtualNodeName: string;

  /**
   * The Amazon Resource Name belonging to the VirtualNdoe
   */
  public abstract readonly virtualNodeArn: string;

  /**
   * The unique identifier for the virtual node
   */
  public abstract readonly virtualNodeUid: string;

  protected readonly backends = new Array<CfnVirtualNode.BackendProperty>();
  protected readonly listeners = new Array<CfnVirtualNode.ListenerProperty>();

  /**
   * Exports properties for VirtualNode reusability
   */
  public abstract export(): VirtualNodeImportProps;

  /**
   * Utility method to add a single backend for existing or new VritualNodes
   */
  public addBackend(props: VirtualNodeBackendProps) {
    this.backends.push({
      virtualService: {
        virtualServiceName: props.virtualService.virtualServiceName,
      },
    });
  }

  /**
   * Utility method to add backends for existing or new VritualNodes
   */
  public addBackends(props: VirtualNodeBackendProps[]) {
    for (const s of props) {
      this.backends.push({
        virtualService: {
          virtualServiceName: s.virtualService.virtualServiceName,
        },
      });
    }
  }

  /**
   * Utility method to add Node Listeners for new or existing VirtualNodes
   */
  public addListener(props: ListenerProps) {
    if (props.portMappings && props.healthChecks) {
      this.addPortAndHealthCheckMappings(props.portMappings, props.healthChecks);
    } else if (props.portMappings) {
      this.addPortMappings(props.portMappings);
    } else {
      this.addPortMappings([{ port: 8080, protocol: Protocol.HTTP }]);
    }
  }

  /**
   * Utility method which adds only a single port mapping to the listener property as healthchecks are optional
   */
  public addPortMapping(props: PortMappingProps) {
    this.listeners.push({
      portMapping: {
        port: props.port || 8080,
        protocol: props.protocol,
      },
    });
  }

  /**
   * Utility method which adds only port mappings to the listener property as healthchecks are optional
   */
  public addPortMappings(props: PortMappingProps[]) {
    for (const p of props) {
      this.listeners.push({
        portMapping: {
          port: p.port || 8080,
          protocol: p.protocol,
        },
      });
    }
  }

  /**
   * Utility method to add port mappings and healthecks, preferred method would be to use addListeners()
   */
  public addPortAndHealthCheckMappings(ports: PortMappingProps[], health: HealthCheckProps[]) {
    if (ports.length !== health.length) {
      throw new Error('Must provide the same number of health checks and port mappings.');
    }

    for (let i = 0; i < ports.length; i++) {
      this.listeners.push({
        portMapping: {
          port: ports[i].port,
          protocol: ports[i].protocol,
        },
        healthCheck: {
          healthyThreshold: health[i].healthyThreshold || 2,
          intervalMillis: health[i].intervalMillis || 5000, // min
          path: health[i].path || health[i].protocol === Protocol.HTTP ? '/' : undefined,
          port: health[i].port || 8080,
          protocol: health[i].protocol || Protocol.HTTP,
          timeoutMillis: health[i].timeoutMillis || 2000,
          unhealthyThreshold: health[i].unhealthyThreshold || 2,
        },
      });
    }
  }
}

/**
 * VritualNode represents a newly defined AppMesh VirtualNode
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_nodes.html
 */
export class VirtualNode extends VirtualNodeBase {
  /**
   * A static method to import a VirtualNode an make it re-usable accross stacks
   */
  public static import(scope: cdk.Construct, id: string, props: VirtualNodeImportProps): IVirtualNode {
    return new ImportedVirtualNode(scope, id, props);
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
   * The unique identifier for the virtual node
   */
  public readonly virtualNodeUid: string;

  /**
   * The AppMesh mesh name for whiich the VirtualService belongs to
   */
  public readonly virtualNodeMeshName: string;

  private readonly mesh: IMesh;
  private readonly namespaceName: string;

  constructor(scope: cdk.Construct, id: string, props: VirtualNodeProps) {
    super(scope, id);

    this.mesh = props.mesh;
    this.virtualNodeMeshName = this.mesh.meshName;

    this.namespaceName = props.namespace.namespaceName;

    if (props.backends) {
      this.addBackends(props.backends);
    }

    if (props.listener) {
      this.addListener(props.listener);
    }

    const name = props.nodeName || id;

    const node = new CfnVirtualNode(this, 'VirtualNode', {
      virtualNodeName: name,
      meshName: this.mesh.meshName,
      spec: {
        backends: this.backends,
        listeners: this.listeners,
        serviceDiscovery: {
          dns: {
            hostname: `${props.hostname}.${this.namespaceName}`,
          },
        },
        logging: {
          accessLog: {
            file: {
              path: '/dev/stdoout',
            },
          },
        },
      },
    });

    this.virtualNodeName = node.virtualNodeName;
    this.virtualNodeArn = node.virtualNodeArn;
    this.virtualNodeUid = node.virtualNodeUid;
  }

  /**
   * Exports properties for VirtualNode reusability
   */
  public export(): VirtualNodeImportProps {
    return {
      virtualNodeName: this.virtualNodeName,
      virtualNodeArn: this.virtualNodeArn,
      virtualNodeUid: this.virtualNodeUid,
    };
  }
}

/**
 * Used to import a VirtualNode and read it's properties
 */
export class ImportedVirtualNode extends VirtualNodeBase {
  /**
   * The name of the VirtualNode
   */
  public readonly virtualNodeName: string;

  /**
   * The Amazon Resource Name belonging to the VirtualNdoe
   */
  public readonly virtualNodeArn: string;

  /**
   * The unique identifier for the virtual node
   */
  public readonly virtualNodeUid: string;

  constructor(scope: cdk.Construct, id: string, props: VirtualNodeImportProps) {
    super(scope, id);

    this.virtualNodeName = props.virtualNodeName;
    this.virtualNodeArn = props.virtualNodeArn;
    this.virtualNodeUid = props.virtualNodeUid;
  }

  /**
   * Exports properties for VirtualNode reusability
   */
  public export(): VirtualNodeImportProps {
    return {
      virtualNodeName: this.virtualNodeName,
      virtualNodeArn: this.virtualNodeArn,
      virtualNodeUid: this.virtualNodeUid,
    };
  }
}
