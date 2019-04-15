import cdk = require('@aws-cdk/cdk');
import { CfnVirtualNode } from './appmesh.generated';
import { HealthCheckProps, ListenerProps, NAME_TAG, PortMappingProps, Protocol } from './shared-interfaces';

// TODO: Add import() and eport() capabilities

/**
 * The backend props for which a node communicates within the mesh
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appmesh-virtualnode-backend.html
 */
export interface VirtualNodeBackendProps {
  /**
   * The VirtualService name for the backend service
   */
  readonly virtualServiceName: string;
}

/**
 * The properties used when creating a new VirtualNode
 */
export interface VirtualNodeProps {
  /**
   * The name of the AppMesh which the virtual node belongs to
   */
  readonly meshName: string;
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
  readonly namespaceName: string;
  /**
   * Array of VirtualNodeBackendProps
   */
  readonly backends?: VirtualNodeBackendProps[];
  /**
   * Listener properties, such as portMappings and optional healthChecks
   */
  readonly listeners?: ListenerProps;
}

/**
 * VritualNode represents a newly createded AppMesh VirtualNode
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_nodes.html
 */
export class VirtualNode extends cdk.Construct {
  /**
   * The name of the AppMesh which the virtual node belongs to
   *
   * @type {string}
   * @memberof VirtualNode
   */
  public readonly meshName: string;
  /**
   * The name of the VirtualNode
   *
   * @type {string}
   * @memberof VirtualNode
   */
  public readonly virtualNodeName: string;
  /**
   * The Amazon Resource Name belonging to the VirtualNdoe
   *
   * @type {string}
   * @memberof VirtualNode
   */
  public readonly virtualNodeArn: string;

  private readonly backends: CfnVirtualNode.BackendProperty[] = [];
  private readonly listeners: CfnVirtualNode.ListenerProperty[] = [];
  private readonly namespaceName: string;

  constructor(scope: cdk.Construct, id: string, props: VirtualNodeProps) {
    super(scope, id);

    this.meshName = props.meshName;
    this.namespaceName = props.namespaceName;

    if (props.backends) {
      this.addBackends(props.backends);
    }

    if (props.listeners) {
      this.addListeners(props.listeners);
    }

    this.node.apply(new cdk.Tag(NAME_TAG, this.node.path));
    const name = props.nodeName ? props.nodeName : id;

    const node = new CfnVirtualNode(this, 'VirtualNode', {
      virtualNodeName: name,
      meshName: this.meshName,
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
  }

  /**
   * Utility method to add a single backend for existing or new VritualNodes
   *
   * @param {VirtualNodeBackendProps[]} props
   * @memberof VirtualNode
   */
  public addBackend(props: VirtualNodeBackendProps) {
    this.backends.push({
      virtualService: {
        virtualServiceName: props.virtualServiceName,
      },
    });
  }

  /**
   * Utility method to add backends for existing or new VritualNodes
   *
   * @param {VirtualNodeBackendProps[]} props
   * @memberof VirtualNode
   */
  public addBackends(props: VirtualNodeBackendProps[]) {
    props.forEach(s => {
      this.backends.push({
        virtualService: {
          virtualServiceName: s.virtualServiceName,
        },
      });
    });
  }

  /**
   * Utility method to add Node Listeners for new or existing VirtualNodes
   *
   * @param {ListenerProps} props
   * @memberof VirtualNode
   */
  public addListeners(props: ListenerProps) {
    if (props.portMappings && props.healthChecks) {
      this.addPortAndHealthCheckMappings(props.portMappings, props.healthChecks);
    } else if (props.portMappings) {
      this.addPortMappings(props.portMappings);
    } else {
      this.addPortMappings([{ port: 8080, protocol: Protocol.HTTP }]);
    }
  }

  /**
   * Utility method which adds only port mappings to the listener property as healthchecks are optional
   *
   * @param {PortMappingProps[]} props
   * @memberof VirtualNode
   */
  public addPortMappings(props: PortMappingProps[]) {
    props.forEach(p => {
      this.listeners.push({
        portMapping: {
          port: p.port || 8080,
          protocol: p.protocol,
        },
      });
    });
  }

  /**
   * Utility method to add port mappings and healthecks, preferred method would be to use addListeners()
   *
   * @param {PortMappingProps[]} ports
   * @param {HealthCheckProps[]} health
   * @memberof VirtualNode
   */
  public addPortAndHealthCheckMappings(ports: PortMappingProps[], health: HealthCheckProps[]) {
    if (ports.length != health.length) {
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
          intervalMillis: health[i].interval || 5000, // min
          path: health[i].path || health[i].protocol === Protocol.HTTP ? '/' : undefined,
          port: health[i].port || 8080,
          protocol: health[i].protocol || Protocol.HTTP,
          timeoutMillis: health[i].timeout || 2000,
          unhealthyThreshold: health[i].unhealthyThreshold || 2,
        },
      });
    }
  }
}
