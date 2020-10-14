import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnGatewayRoute, CfnVirtualGateway } from './appmesh.generated';
import { GatewayRoute, GatewayGrpcRouteBaseProps, GatewayHttp2RouteBaseProps, GatewayHttpRouteBaseProps } from './gateway-route';

import { IMesh, Mesh } from './mesh';
import { AccessLog, HealthCheck, PortMapping, Protocol, VirtualGatewayListener } from './shared-interfaces';
import { validateHealthChecks } from './utils';

/**
 * Interface which all Virtual Gateway based classes must implement
 */
export interface IVirtualGateway extends cdk.IResource {
  /**
   * Name of the VirtualGateway
   *
   * @attribute
   */
  readonly virtualGatewayName: string;

  /**
   * The Amazon Resource Name (ARN) for the VirtualGateway
   *
   * @attribute
   */
  readonly virtualGatewayArn: string;

  /**
   * The mesh which the VirtualGateway belongs to
   */
  readonly mesh: IMesh;

  /**
   * Utility method to add a list of listeners to this VirtualGateway
   */
  addListeners(listeners: VirtualGatewayListener[]): void;

  /**
   * Utility method to add a new GatewayRoute to the VirtualGateway
   */
  addGatewayRoute(id: string, route: GatewayHttpRouteBaseProps | GatewayHttp2RouteBaseProps | GatewayGrpcRouteBaseProps): GatewayRoute;
}

/**
 * Basic configuration properties for a VirtualGateway
 */
export interface VirtualGatewayBaseProps {
  /**
   * Name of the VirtualGateway
   *
   * @default - A name is automatically determined
   */
  readonly virtualGatewayName?: string;

  /**
   * Listeners for the VirtualGateway. Only one is supported.
   *
   * @default - Single HTTP listener on port 8080
   */
  readonly listeners?: VirtualGatewayListener[];

  /**
   * Access Logging Configuration for the VirtualGateway
   *
   * @default no access logging
   */
  readonly accessLog?: AccessLog;
}

/**
 * Properties used when creating a new VirtualGateway
 */
export interface VirtualGatewayProps extends VirtualGatewayBaseProps {
  /**
   * The mesh which the VirtualGateway belongs to
   */
  readonly mesh: IMesh;
}

abstract class VirtualGatewayBase extends cdk.Resource implements IVirtualGateway {
  /**
   * Name of the VirtualGateway
   */
  public abstract readonly virtualGatewayName: string;

  /**
   * The Amazon Resource Name (ARN) for the VirtualGateway
   */
  public abstract readonly virtualGatewayArn: string;

  /**
   * The name of the mesh which the VirtualGateway belongs to
   */
  public abstract readonly mesh: IMesh;

  protected readonly listeners = new Array<CfnVirtualGateway.VirtualGatewayListenerProperty>();
  protected readonly routes = new Array<CfnGatewayRoute>();

  /**
   * Utility method to add a list of listeners to this VirtualGateway
   */
  public addListeners(listeners: VirtualGatewayListener[]) {
    if (this.listeners.length + this.listeners.length > 1) {
      throw new Error('VirtualGateway may have at most one listener');
    }
    for (const listener of listeners) {
      const portMapping = listener.portMapping || { port: 8080, protocol: Protocol.HTTP };
      this.listeners.push({
        portMapping,
        healthCheck: renderHealthCheck(listener.healthCheck, portMapping),
      });
    }
  }

  /**
   * Utility method to add a new GatewayRoute to the VirtualGateway
   */
  public addGatewayRoute(id: string, props: GatewayHttpRouteBaseProps | GatewayHttp2RouteBaseProps | GatewayGrpcRouteBaseProps): GatewayRoute {
    return new GatewayRoute(this, id, {
      ...props,
      virtualGateway: this,
    });
  }
}

/**
 * VirtualGateway represents a newly defined App Mesh Virtual Gateway
 *
 * A virtual gateway allows resources that are outside of your mesh to communicate to resources that
 * are inside of your mesh.
 *
 * @see https://docs.aws.amazon.com/app-mesh/latest/userguide/virtual_gateways.html
 */
export class VirtualGateway extends VirtualGatewayBase {
  /**
   * Import an existing VirtualGateway given an ARN
   */
  public static fromVirtualGatewayArn(scope: Construct, id: string, virtualGatewayArn: string): IVirtualGateway {
    return new ImportedVirtualGateway(scope, id, { virtualGatewayArn });
  }

  /**
   * Import an existing VirtualGateway given its name
   */
  public static fromVirtualGatewayName(scope: Construct, id: string, meshName: string, virtualGatewayName: string): IVirtualGateway {
    return new ImportedVirtualGateway(scope, id, {
      meshName,
      virtualGatewayName,
    });
  }

  /**
   * The name of the VirtualGateway
   */
  public readonly virtualGatewayName: string;

  /**
   * The Amazon Resource Name (ARN) for the VirtualGateway
   */
  public readonly virtualGatewayArn: string;

  /**
   * The Mesh that the VirtualGateway belongs to
   */
  public readonly mesh: IMesh;

  constructor(scope: Construct, id: string, props: VirtualGatewayProps) {
    super(scope, id, {
      physicalName: props.virtualGatewayName || cdk.Lazy.stringValue({ produce: () => this.node.uniqueId }),
    });

    this.mesh = props.mesh;

    // Use listener default of http listener port 8080 if no listener is defined
    this.addListeners(props.listeners ? props.listeners : [{}]);
    const accessLogging = props.accessLog?.bind(this);

    const node = new CfnVirtualGateway(this, 'Resource', {
      virtualGatewayName: this.physicalName,
      meshName: this.mesh.meshName,
      spec: {
        listeners: this.listeners,
        logging: accessLogging !== undefined ? {
          accessLog: accessLogging.virtualGatewayAccessLog,
        } : undefined,
      },
    });

    this.virtualGatewayName = this.getResourceNameAttribute(node.attrVirtualGatewayName);
    this.virtualGatewayArn = this.getResourceArnAttribute(node.ref, {
      service: 'appmesh',
      resource: `mesh/${props.mesh.meshName}/virtualGateway`,
      resourceName: this.physicalName,
    });
  }
}

function renderHealthCheck(hc: HealthCheck | undefined, pm: PortMapping): CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty | undefined {
  if (hc === undefined) { return undefined; }

  if (hc.protocol === Protocol.TCP && hc.path) {
    throw new Error('The path property cannot be set with Protocol.TCP');
  }

  if (hc.protocol === Protocol.GRPC && hc.path) {
    throw new Error('The path property cannot be set with Protocol.GRPC');
  }

  const protocol = hc.protocol? hc.protocol : pm.protocol;

  const healthCheck: CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty = {
    healthyThreshold: hc.healthyThreshold || 2,
    intervalMillis: (hc.interval || cdk.Duration.seconds(5)).toMilliseconds(), // min
    path: hc.path || (protocol === Protocol.HTTP ? '/' : undefined),
    port: hc.port || pm.port,
    protocol: hc.protocol || pm.protocol,
    timeoutMillis: (hc.timeout || cdk.Duration.seconds(2)).toMilliseconds(),
    unhealthyThreshold: hc.unhealthyThreshold || 2,
  };

  validateHealthChecks(healthCheck);

  return healthCheck;
}

/**
 * Unterface with properties necessary to import a reusable VirtualGateway
 */
interface VirtualGatewayAttributes {
  /**
   * The name of the VirtualGateway
   */
  readonly virtualGatewayName?: string;

  /**
   * The Amazon Resource Name (ARN) belonging to the VirtualGateway
   */
  readonly virtualGatewayArn?: string;

  /**
   * The Mesh that the VirtualGateway belongs to
   */
  readonly mesh?: IMesh;

  /**
   * The name of the mesh that the VirtualGateway belongs to
   */
  readonly meshName?: string;
}

/**
 * Used to import a VirtualGateway and read its properties
 */
class ImportedVirtualGateway extends VirtualGatewayBase {
  /**
   * The name of the VirtualGateway
   */
  public readonly virtualGatewayName: string;

  /**
   * The Amazon Resource Name (ARN) belonging to the VirtualGateway
   */
  public readonly virtualGatewayArn: string;

  /**
   * The Mesh that the VirtualGateway belongs to
   */
  public readonly mesh: IMesh;

  constructor(scope: Construct, id: string, props: VirtualGatewayAttributes) {
    super(scope, id);

    if (props.mesh) {
      this.mesh = props.mesh;
    } else if (props.meshName) {
      if (props.mesh) {
        throw new Error('Supply either \'mesh\' or \'meshName\', but not both');
      }
      this.mesh = Mesh.fromMeshName(this, 'Mesh', props.meshName);
    } else if (props.virtualGatewayArn) {
      const meshName = cdk.Fn.select(0, cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(props.virtualGatewayArn).resourceName!));
      this.mesh = Mesh.fromMeshName(this, 'Mesh', meshName);
    } else {
      throw new Error('Supply either \'mesh\' or \'meshName\' or \'virtualGatewayArn\'');
    }
    if (props.virtualGatewayArn) {
      this.virtualGatewayArn = props.virtualGatewayArn;
      this.virtualGatewayName = cdk.Fn.select(2, cdk.Fn.split('/', cdk.Stack.of(scope).parseArn(props.virtualGatewayArn).resourceName!));
    } else if (props.virtualGatewayName && props.meshName) {
      this.virtualGatewayName = props.virtualGatewayName;
      this.virtualGatewayArn = cdk.Stack.of(this).formatArn({
        service: 'appmesh',
        resource: `mesh/${props.meshName}/virtualGateway`,
        resourceName: this.virtualGatewayName,
      });
    } else {
      throw new Error('Need either arn or both names');
    }
  }
}
