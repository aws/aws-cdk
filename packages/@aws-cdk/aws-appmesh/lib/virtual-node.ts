import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnVirtualNode } from './appmesh.generated';
import { IMesh } from './mesh';
import { AccessLog, HealthCheck, PortMapping, Protocol, HttpTimeout, Http2Timeout, TcpTimeout, GrpcTimeout } from './shared-interfaces';
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
   * NodeListener
   */
  addListener(listener: VirtualNodeListener): void;

  /**
   * Utility method to add Node Listeners for new or existing VirtualNodes
   */
  addListeners(listeners: VirtualNodeListener[]): void;
}

/**
 * Represents the properties needed to define HTTP Listeners for a VirtualGateway
 */
export interface NodeListenerProps {
  /**
   * Port to listen for connections on
   *
   * @default - 8080
   */
  readonly port?: number

  /**
   * The health check information for the listener
   *
   * @default - no healthcheck
   */
  readonly healthCheck?: HealthCheck;
}

/**
 * NodeListener
 */
export interface HttpNodeListenerProps extends NodeListenerProps {
  /**
   * Timeout
   *
   * @default - None
   */

  readonly timeout?: HttpTimeout;
}
/**
 * NodeListener
 */
export interface Http2NodeListenerProps extends NodeListenerProps {
  /**
   * Timeout
   *
   * @default - None
   */

  readonly timeout?: Http2Timeout;
}
/**
 * NodeListener
 */
export interface GrpcNodeListenerProps extends NodeListenerProps {
  /**
   * Timeout
   *
   * @default - None
   */

  readonly timeout?: GrpcTimeout;
}

/**
 * NodeListener
 */
export interface TcpNodeListenerProps extends NodeListenerProps {
  /**
   * Timeout
   *
   * @default - None
   */

  readonly timeout?: TcpTimeout;
}
/**
 * NodeListener
 */
export abstract class VirtualNodeListener {

  /**
   * NodeListener
   */
  public static getTimeUnitAndValue(time: cdk.Duration) {
    let timeObj: any = {};
    let timeUnit = time.toHumanString().split(' ')[1];
    if (timeUnit === 'seconds' || 'second') {
      let timeValue: number = time.toSeconds();
      timeObj.unit = 's';
      timeObj.value = timeValue;
    } else {
      let timeValue: number = time.toMilliseconds();
      timeObj.unit = 'ms';
      timeObj.value = timeValue;
    }
    return timeObj;
  }

  /**
   * NodeListener
   */
  public static renderHealthCheck(pm: PortMapping, hc: HealthCheck | undefined): CfnVirtualNode.HealthCheckProperty | undefined {
    const HEALTH_CHECK_PROPERTY_THRESHOLDS: {[key in (keyof CfnVirtualNode.HealthCheckProperty)]?: [number, number]} = {
      healthyThreshold: [2, 10],
      intervalMillis: [5000, 300000],
      port: [1, 65535],
      timeoutMillis: [2000, 60000],
      unhealthyThreshold: [2, 10],
    };
    if (hc === undefined) { return undefined; }

    if (hc.protocol === Protocol.TCP && hc.path) {
      throw new Error('The path property cannot be set with Protocol.TCP');
    }

    if (hc.protocol === Protocol.GRPC && hc.path) {
      throw new Error('The path property cannot be set with Protocol.GRPC');
    }

    const healthCheck: CfnVirtualNode.HealthCheckProperty = {
      healthyThreshold: hc.healthyThreshold || 2,
      intervalMillis: (hc.interval || cdk.Duration.seconds(5)).toMilliseconds(), // min
      path: hc.path || (hc.protocol === Protocol.HTTP ? '/' : undefined),
      port: hc.port || pm.port,
      protocol: hc.protocol || pm.protocol,
      timeoutMillis: (hc.timeout || cdk.Duration.seconds(2)).toMilliseconds(),
      unhealthyThreshold: hc.unhealthyThreshold || 2,
    };

    (Object.keys(healthCheck) as Array<keyof CfnVirtualNode.HealthCheckProperty>)
      .filter((key) =>
        HEALTH_CHECK_PROPERTY_THRESHOLDS[key] &&
            typeof healthCheck[key] === 'number' &&
            !cdk.Token.isUnresolved(healthCheck[key]),
      ).map((key) => {
        const [min, max] = HEALTH_CHECK_PROPERTY_THRESHOLDS[key]!;
        const value = healthCheck[key]!;

        if (value < min) {
          throw new Error(`The value of '${key}' is below the minimum threshold (expected >=${min}, got ${value})`);
        }
        if (value > max) {
          throw new Error(`The value of '${key}' is above the maximum threshold (expected <=${max}, got ${value})`);
        }
      });

    return healthCheck;
  }

  /**
   * NodeListener
   */
  public static httpNodeListener(props?: HttpNodeListenerProps): VirtualNodeListener {
    return new HttpNodeListener(props);
  }

  /**
   * NodeListener
   */
  public static http2NodeListener(props?: Http2NodeListenerProps): VirtualNodeListener {
    return new Http2NodeListener(props);
  }

  /**
   * NodeListener
   */
  public static grpcNodeListener(props?: GrpcNodeListenerProps): VirtualNodeListener {
    return new GrpcNodeListener(props);
  }

  /**
   * NodeListener
   */
  public static tcpNodeListener(props?: TcpNodeListenerProps): VirtualNodeListener {
    return new TcpNodeListener(props);
  }

  /**
 * NodeListener
 */
  public abstract bind(scope: cdk.Construct): CfnVirtualNode.ListenerProperty;
}

/**
 * NodeListener
 */
export class HttpNodeListener extends VirtualNodeListener {
  /**
 * NodeListener
 */
  public static renderTimeout(tm: HttpTimeout| undefined): CfnVirtualNode.ListenerTimeoutProperty | undefined {
    if (tm===undefined) {
      return tm;
    }
    let httpTimeout: CfnVirtualNode.ListenerTimeoutProperty = {};
    let httpTypeObj: any = {
      http: {},
    };
    let obj: any = {};
    if (typeof tm?.idle === 'object' && tm?.idle !== null && Object.keys(tm?.idle).length) {
      obj.idle = {
        unit: VirtualNodeListener.getTimeUnitAndValue(tm.idle as cdk.Duration).unit,
        value: VirtualNodeListener.getTimeUnitAndValue(tm.idle as cdk.Duration).value,
      };
    }
    if (typeof tm?.perRequest === 'object' && tm?.perRequest !== null && Object.keys(tm?.perRequest).length) {
      obj.perRequest = {
        unit: VirtualNodeListener.getTimeUnitAndValue(tm.perRequest as cdk.Duration).unit,
        value: VirtualNodeListener.getTimeUnitAndValue(tm.perRequest as cdk.Duration).value,
      };
    }
    httpTypeObj.http = obj;
    httpTimeout = httpTypeObj;
    return httpTimeout;
  }
  /**
   * Port to listen for connections on
   *
   * @default - 8080
   */
  readonly port: number;

  /**
   * Health checking strategy upstream nodes should use when communicating with the listener
   *
   * @default - no healthcheck
   */
  readonly healthCheck?: HealthCheck;
  /**
   * Timeout
   *
   * @default - none
   */
  readonly timeout?: HttpTimeout;
  constructor(props?: HttpNodeListenerProps) {
    super();
    const checkedProps = props ?? {};
    this.port = checkedProps.port ? checkedProps.port : 8080;
    this.healthCheck = checkedProps.healthCheck;
    this.timeout = checkedProps.timeout;
  }

  /**
 * NodeListener
 */
  public bind(_scope: cdk.Construct): CfnVirtualNode.ListenerProperty {
    return {
      portMapping: {
        port: this.port,
        protocol: Protocol.HTTP,
      },
      healthCheck: HttpNodeListener.renderHealthCheck({
        port: this.port,
        protocol: Protocol.HTTP,
      }, this.healthCheck),
      timeout: HttpNodeListener.renderTimeout(this.timeout),
    };
  }
}

/**
 * NodeListener
 */
export class Http2NodeListener extends VirtualNodeListener {
  /**
 * NodeListener
 */
  public static renderTimeout(tm: Http2Timeout| undefined): CfnVirtualNode.ListenerTimeoutProperty | undefined {
    if (tm===undefined) {
      return tm;
    }
    let http2Timeout: CfnVirtualNode.ListenerTimeoutProperty = {};
    let http2TypeObj: any = {
      http2: {},
    };
    let obj: any = {};
    if (typeof tm?.idle === 'object' && tm?.idle !== null && Object.keys(tm?.idle).length) {
      obj.idle = {
        unit: VirtualNodeListener.getTimeUnitAndValue(tm.idle as cdk.Duration).unit,
        value: VirtualNodeListener.getTimeUnitAndValue(tm.idle as cdk.Duration).value,
      };
    }
    if (typeof tm?.perRequest === 'object' && tm?.perRequest !== null && Object.keys(tm?.perRequest).length) {
      obj.perRequest = {
        unit: VirtualNodeListener.getTimeUnitAndValue(tm.perRequest as cdk.Duration).unit,
        value: VirtualNodeListener.getTimeUnitAndValue(tm.perRequest as cdk.Duration).value,
      };
    }
    http2TypeObj.http2 = obj;
    http2Timeout = http2TypeObj;
    return http2Timeout;
  }
  /**
   * Port to listen for connections on
   *
   * @default - 8080
   */
  readonly port: number;

  /**
   * Health checking strategy upstream nodes should use when communicating with the listener
   *
   * @default - no healthcheck
   */
  readonly healthCheck?: HealthCheck;
  /**
   * Timeout
   *
   * @default - none
   */
  readonly timeout?: Http2Timeout;
  constructor(props?: Http2NodeListenerProps) {
    super();
    const checkedProps = props ?? {};
    this.port = checkedProps.port ? checkedProps.port : 8080;
    this.healthCheck = checkedProps.healthCheck;
    this.timeout = checkedProps.timeout;
  }

  /**
 * NodeListener
 */
  public bind(_scope: cdk.Construct): CfnVirtualNode.ListenerProperty {
    return {
      portMapping: {
        port: this.port,
        protocol: Protocol.HTTP2,
      },
      healthCheck: Http2NodeListener.renderHealthCheck({
        port: this.port,
        protocol: Protocol.HTTP2,
      }, this.healthCheck),
      timeout: Http2NodeListener.renderTimeout(this.timeout),
    };
  }
}

/**
 * NodeListener
 */
export class GrpcNodeListener extends VirtualNodeListener {
  /**
 * NodeListener
 */
  public static renderTimeout(tm: GrpcTimeout| undefined): CfnVirtualNode.ListenerTimeoutProperty | undefined {
    if (tm===undefined) {
      return tm;
    }
    let grpcTimeout: CfnVirtualNode.ListenerTimeoutProperty = {};
    let grpcTypeObj: any = {
      grpc: {},
    };
    let obj: any = {};
    if (typeof tm?.idle === 'object' && tm?.idle !== null && Object.keys(tm?.idle).length) {
      obj.idle = {
        unit: VirtualNodeListener.getTimeUnitAndValue(tm.idle as cdk.Duration).unit,
        value: VirtualNodeListener.getTimeUnitAndValue(tm.idle as cdk.Duration).value,
      };
    }
    if (typeof tm?.perRequest === 'object' && tm?.perRequest !== null && Object.keys(tm?.perRequest).length) {
      obj.perRequest = {
        unit: VirtualNodeListener.getTimeUnitAndValue(tm.perRequest as cdk.Duration).unit,
        value: VirtualNodeListener.getTimeUnitAndValue(tm.perRequest as cdk.Duration).value,
      };
    }
    grpcTypeObj.grpc = obj;
    grpcTimeout = grpcTypeObj;
    return grpcTimeout;
  }
  /**
   * Port to listen for connections on
   *
   * @default - 8080
   */
  readonly port: number;

  /**
   * Health checking strategy upstream nodes should use when communicating with the listener
   *
   * @default - no healthcheck
   */
  readonly healthCheck?: HealthCheck;
  /**
   * Timeout
   *
   * @default - none
   */
  readonly timeout?: GrpcTimeout;
  constructor(props?: GrpcNodeListenerProps) {
    super();
    const checkedProps = props ?? {};
    this.port = checkedProps.port ? checkedProps.port : 8080;
    this.healthCheck = checkedProps.healthCheck;
    this.timeout = checkedProps.timeout;
  }

  /**
 * NodeListener
 */
  public bind(_scope: cdk.Construct): CfnVirtualNode.ListenerProperty {
    return {
      portMapping: {
        port: this.port,
        protocol: Protocol.GRPC,
      },
      healthCheck: GrpcNodeListener.renderHealthCheck({
        port: this.port,
        protocol: Protocol.GRPC,
      }, this.healthCheck),
      timeout: GrpcNodeListener.renderTimeout(this.timeout),
    };
  }
}
/**
 * NodeListener
 */
export class TcpNodeListener extends VirtualNodeListener {
  /**
 * NodeListener
 */
  public static renderTimeout(tm: TcpTimeout| undefined): CfnVirtualNode.ListenerTimeoutProperty | undefined {
    if (tm===undefined) {
      return tm;
    }
    let tcpTimeout: CfnVirtualNode.ListenerTimeoutProperty = {};
    let tcpTypeObj: any = {
      tcp: {},
    };
    let obj: any = {};
    if (typeof tm?.idle === 'object' && tm?.idle !== null && Object.keys(tm?.idle).length) {
      obj.idle = {
        unit: VirtualNodeListener.getTimeUnitAndValue(tm.idle as cdk.Duration).unit,
        value: VirtualNodeListener.getTimeUnitAndValue(tm.idle as cdk.Duration).value,
      };
    }
    tcpTypeObj.tcp = obj;
    tcpTimeout = tcpTypeObj;
    return tcpTimeout;
  }
  /**
   * Port to listen for connections on
   *
   * @default - 8080
   */
  readonly port: number;

  /**
   * Health checking strategy upstream nodes should use when communicating with the listener
   *
   * @default - no healthcheck
   */
  readonly healthCheck?: HealthCheck;
  /**
   * Timeout
   *
   * @default - none
   */
  readonly timeout?: TcpTimeout;
  constructor(props?: TcpNodeListenerProps) {
    super();
    const checkedProps = props ?? {};
    this.port = checkedProps.port ? checkedProps.port : 8080;
    this.healthCheck = checkedProps.healthCheck;
    this.timeout = checkedProps.timeout;
  }

  /**
 * NodeListener
 */
  public bind(_scope: cdk.Construct): CfnVirtualNode.ListenerProperty {
    return {
      portMapping: {
        port: this.port,
        protocol: Protocol.TCP,
      },
      healthCheck: TcpNodeListener.renderHealthCheck({
        port: this.port,
        protocol: Protocol.TCP,
      }, this.healthCheck),
      timeout: TcpNodeListener.renderTimeout(this.timeout),
    };
  }
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
  public addListeners(listeners: VirtualNodeListener[]) {
    if (listeners.length + this.listeners.length > 1) {
      throw new Error('VirtualNode may have at most one listener');
    }
    for (const listener of listeners) {
      this.addListener(listener);
    }
  }

  /**
   * Utility method to add a single listener to this VirtualGateway
   */
  public addListener(listener: VirtualNodeListener) {
    if (this.listeners.length > 0) {
      throw new Error('VirtualNode may have at most one listener');
    }
    this.listeners.push(listener.bind(this));
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
    this.addListeners(props.listeners ? props.listeners : [VirtualNodeListener.httpNodeListener()]);
    const accessLogging = props.accessLog?.bind(this);

    const node = new CfnVirtualNode(this, 'Resource', {
      virtualNodeName: this.physicalName,
      meshName: this.mesh.meshName,
      spec: {
        backends: cdk.Lazy.anyValue({ produce: () => this.backends }, { omitEmptyArray: true }),
        listeners: cdk.Lazy.anyValue({ produce: () => this.listeners }, { omitEmptyArray: true }),
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
