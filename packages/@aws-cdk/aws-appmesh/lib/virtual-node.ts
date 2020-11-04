import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnVirtualNode } from './appmesh.generated';
import { IMesh } from './mesh';
import { validateHealthChecks } from './private/utils';
import { AccessLog, HealthCheck, PortMapping, Protocol, VirtualNodeListener } from './shared-interfaces';
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

  /**
   * Utility method to add Default Backend Configuration for new or existing VirtualNodes
   */
  addBackendDefaults(backendDefaults: BackendDefaults): void;
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

  /**
   * Access Logging Configuration for the virtual node
   *
   * @default - No access logging
   */
  readonly accessLog?: AccessLog;

  /**
   * Default Configuration Virtual Node uses to communicate with Vritual Service
   *
   * @default - No Config
   */
  readonly backendDefaults?: BackendDefaults;
}

/**
 * Default configuration that is applied to all backends for the virtual node.
 * Any configuration defined will be overwritten by configurations specified for a particular backend.
 */
export interface BackendDefaults {
  /**
   * Client policy for TLS
   */
  readonly tlsClientPolicy: TLSClientPolicyProps;
}

/**
 * Properties with respect to TLS backend default.
 */
export interface TLSClientPolicyProps {
  /**
   * TLS enforced if True.
   *
   * @default - True
   */
  readonly enforce?: boolean;

  /**
   * TLS enforced on these ports. If not specified it is enforced on all ports.
   *
   * @default - none
   */
  readonly ports?: number[];

  /**
   * To enforce the trust is one of file, acmpca, or sds.
   *
   * @default - none
   */
  readonly validation: TLSClientValidation;
}

/**
 * Defines the TLS validation context trust.
 */
export abstract class TLSClientValidation {
  /**
   * TLS validation context trust for a local file
   */
  public static fileTrustValidation(props: FileTrustProps): TLSClientValidation {
    return new FileTrust(props);
  }

  /**
   * TLS validation context trust for AWS Certicate Manager (ACM) certificate.
   */
  public static acmTrustValidation(props: ACMTrustProps): TLSClientValidation {
    return new ACMTrust(props);
  }

  /**
   * Returns Trust context based on trust type.
   */
  public abstract bind(scope: cdk.Construct): CfnVirtualNode.TlsValidationContextProperty;
}

/**
 * ACM Trust Properties
 */
export interface ACMTrustProps {
  /**
   * Amazon Resource Name of the Certificates
   */
  readonly certificateAuthorityArns: string[];
}

/**
 * File Trust Properties
 */
export interface FileTrustProps {
  /**
   * Path to the Certificate Chain file on the file system where the Envoy is deployed.
   */
  readonly certificateChain: string;
}

/**
 * Represents a Transport Layer Security (TLS) validation context trust for a local file
 */
export class FileTrust extends TLSClientValidation {
  /**
   * Path to the Certificate Chain file on the file system where the Envoy is deployed.
   */
  readonly certificateChain: string;

  constructor(props: FileTrustProps) {
    super();
    this.certificateChain = props.certificateChain;
  }

  public bind(_scope: cdk.Construct): CfnVirtualNode.TlsValidationContextProperty {
    return {
      trust: {
        file: {
          certificateChain: this.certificateChain,
        },
      },
    };
  }
}

/**
 * Represents a TLS validation context trust for an AWS Certicate Manager (ACM) certificate.
 */
export class ACMTrust extends TLSClientValidation {
  /**
   * Amazon Resource Name of the Certificates
   */
  readonly certificateAuthorityArns: string[];

  constructor(props: ACMTrustProps) {
    super();
    this.certificateAuthorityArns = props.certificateAuthorityArns;
  }

  public bind(_scope: cdk.Construct): CfnVirtualNode.TlsValidationContextProperty {
    return {
      trust: {
        acm: {
          certificateAuthorityArns: this.certificateAuthorityArns,
        },
      },
    };
  }
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
  protected readonly backendDefaults = new Array<CfnVirtualNode.BackendDefaultsProperty>();

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
   * Adds Default Backend Configuration for virtual node to communicate with Virtual Services.
   */
  public addBackendDefaults(backendDefaults: BackendDefaults) {
    // eslint-disable-next-line no-console
    console.log(backendDefaults.tlsClientPolicy.enforce);
    this.backendDefaults.push({
      clientPolicy: {
        tls: {
          enforce: backendDefaults.tlsClientPolicy.enforce === undefined ? true : backendDefaults.tlsClientPolicy.enforce,
          validation: backendDefaults.tlsClientPolicy.validation.bind(this),
          ports: backendDefaults.tlsClientPolicy.ports ? backendDefaults.tlsClientPolicy.ports : undefined,
        },
      },
    });
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

function renderHealthCheck(hc: HealthCheck | undefined, pm: PortMapping): CfnVirtualNode.HealthCheckProperty | undefined {
  if (hc === undefined) { return undefined; }

  if (hc.protocol === Protocol.TCP && hc.path) {
    throw new Error('The path property cannot be set with Protocol.TCP');
  }

  if (hc.protocol === Protocol.GRPC && hc.path) {
    throw new Error('The path property cannot be set with Protocol.GRPC');
  }

  const protocol = hc.protocol ?? pm.protocol;

  const healthCheck: CfnVirtualNode.HealthCheckProperty = {
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
 * VirtualNode represents a newly defined App Mesh VirtualNode
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
   * The Amazon Resource Name belonging to the VirtualNode
   */
  public readonly virtualNodeArn: string;

  /**
   * The service mesh that the virtual node resides in
   */
  public readonly mesh: IMesh;

  constructor(scope: Construct, id: string, props: VirtualNodeProps) {
    super(scope, id, {
      physicalName: props.virtualNodeName || cdk.Lazy.stringValue({ produce: () => cdk.Names.uniqueId(this) }),
    });

    this.mesh = props.mesh;

    this.addBackends(...props.backends || []);
    this.addListeners(...props.listener ? [props.listener] : []);
    if (props.backendDefaults) {
      this.addBackendDefaults(props.backendDefaults);
    }
    const accessLogging = props.accessLog?.bind(this);

    const node = new CfnVirtualNode(this, 'Resource', {
      virtualNodeName: this.physicalName,
      meshName: this.mesh.meshName,
      spec: {
        backends: cdk.Lazy.anyValue({ produce: () => this.backends }, { omitEmptyArray: true }),
        listeners: cdk.Lazy.anyValue({ produce: () => this.listeners }, { omitEmptyArray: true }),
        backendDefaults: cdk.Lazy.anyValue({ produce: () => this.backendDefaults[0] }, { omitEmptyArray: true }),
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
 * Used to import a VirtualNode and read its properties
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
