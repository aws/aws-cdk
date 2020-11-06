import * as cdk from '@aws-cdk/core';
import { CfnVirtualNode } from './appmesh.generated';
import { validateHealthChecks } from './private/utils';
import { HealthCheck, Protocol } from './shared-interfaces';

/**
 * Properties for a VirtualNode listener
 */
export interface VirtualNodeListenerConfig {
  /**
   * Single listener config for a VirtualNode
   */
  readonly listener: CfnVirtualNode.ListenerProperty,
}

/**
 * Represents the properties needed to define a Listeners for a VirtualNode
 */
interface VirtualNodeListenerOptions {
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
 * Represent the HTTP Node Listener prorperty
 */
export interface HttpNodeListenerOptions extends VirtualNodeListenerOptions {
  /**
   * Timeout for HTTP protocol
   *
   * @default - None
   */
  readonly timeout?: HttpTimeout;
}

/**
 * Represent the GRPC Node Listener prorperty
 */
export interface GrpcNodeListenerOptions extends VirtualNodeListenerOptions {
  /**
   * Timeout for GRPC protocol
   *
   * @default - None
   */
  readonly timeout?: GrpcTimeout;
}

/**
 * Represent the TCP Node Listener prorperty
 */
export interface TcpNodeListenerOptions extends VirtualNodeListenerOptions {
  /**
   * Timeout for TCP protocol
   *
   * @default - None
   */
  readonly timeout?: TcpTimeout;
}

/**
 * Represents timeouts for HTTP protocols.
 */
export interface HttpTimeout {
  /**
   * Represents an idle timeout. The amount of time that a connection may be idle.
   *
   * @default - none
   */
  readonly idle?: cdk.Duration;

  /**
   * Represents per request timeout.
   *
   * @default - 15 s
   */
  readonly perRequest?: cdk.Duration;
}

/**
 * Represents timeouts for GRPC protocols.
 */
export interface GrpcTimeout {
  /**
   * Represents an idle timeout. The amount of time that a connection may be idle.
   *
   * @default - none
   */
  readonly idle?: cdk.Duration;

  /**
   * Represents per request timeout.
   *
   * @default - 15 s
   */
  readonly perRequest?: cdk.Duration;
}

/**
 * Represents timeouts for TCP protocols.
 */
export interface TcpTimeout {
  /**
   * Represents an idle timeout. The amount of time that a connection may be idle.
   *
   * @default - none
   */
  readonly idle?: cdk.Duration;
}

/**
 *  Defines listener for a VirtualNode
 */
export abstract class VirtualNodeListener {
  /**
   * Returns an HTTP Listener for a VirtualNode
   */
  public static http(props: HttpNodeListenerOptions = {}): VirtualNodeListener {
    return new HttpNodeListener(props);
  }

  /**
   * Returns an HTTP2 Listener for a VirtualNode
   */
  public static http2(props: HttpNodeListenerOptions = {}): VirtualNodeListener {
    return new Http2NodeListener(props);
  }

  /**
   * Returns an GRPC Listener for a VirtualNode
   */
  public static grpc(props: GrpcNodeListenerOptions = {}): VirtualNodeListener {
    return new GrpcNodeListener(props);
  }

  /**
   * Returns an TCP Listener for a VirtualNode
   */
  public static tcp(props: TcpNodeListenerOptions = {}): VirtualNodeListener {
    return new TcpNodeListener(props);
  }

  /**
   * Protocol the listener implements
   */
  protected abstract protocol: Protocol;

  /**
   * Port to listen for connections on
   */
  protected abstract port: number;

  /**
   * Health checking strategy upstream nodes should use when communicating with the listener
   */
  protected abstract healthCheck?: HealthCheck;

  /**
   * Represents Listener Timeout
   */
  protected abstract timeout?: HttpTimeout;

  /**
   * Binds the current object when adding Listener to a VirtualNode
   */
  public bind(_scope: cdk.Construct): VirtualNodeListenerConfig {
    return {
      listener: {
        portMapping: {
          port: this.port,
          protocol: this.protocol,
        },
        healthCheck: this.healthCheck ? this.renderHealthCheck(this.healthCheck) : undefined,
        timeout: this.timeout ? this.renderTimeout(this.timeout) : undefined,
      },
    };
  }

  /**
   * Returns an HealthCheck for a VirtualNode
   */
  protected renderHealthCheck(hc: HealthCheck): CfnVirtualNode.HealthCheckProperty | undefined {
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
      port: hc.port || this.port,
      protocol: hc.protocol || this.protocol,
      timeoutMillis: (hc.timeout || cdk.Duration.seconds(2)).toMilliseconds(),
      unhealthyThreshold: hc.unhealthyThreshold || 2,
    };

    validateHealthChecks(healthCheck);

    return healthCheck;
  }

  /**
   * Returns the ListenerTimeoutProperty based on protocol
   */
  private renderTimeout(timeout: HttpTimeout): CfnVirtualNode.ListenerTimeoutProperty {
    return ({
      [this.protocol]: {
        idle: timeout?.idle !== undefined ? {
          unit: 'ms',
          value: timeout?.idle.toMilliseconds(),
        } : undefined,
        perRequest: timeout?.perRequest !== undefined ? {
          unit: 'ms',
          value: timeout?.perRequest.toMilliseconds(),
        } : undefined,
      },
    });
  }
}

/**
 * Represents the properties required to define a HTTP Listener for a VirtualNode.
 */
class HttpNodeListener extends VirtualNodeListener {
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
   * Listener timeout property for HTTP protocol
   *
   * @default - none
   */
  readonly timeout?: HttpTimeout;

  /**
   * Listener timeout property for HTTP protocol
   *
   * @default - none
   */
  protected protocol: Protocol = Protocol.HTTP;

  constructor(props: HttpNodeListenerOptions = {}) {
    super();
    this.port = props.port ? props.port : 8080;
    this.healthCheck = props.healthCheck;
    this.timeout = props.timeout;
  }
}

/**
* Represents the properties needed to define an HTTP2 Listener for a VirtualGateway
*/
class Http2NodeListener extends HttpNodeListener {
  constructor(props: HttpNodeListenerOptions = {}) {
    super(props);
    this.protocol = Protocol.HTTP2;
  }
}

/**
 * Represents the properties required to define a GRPC Listener for a VirtualNode.
 */
class GrpcNodeListener extends VirtualNodeListener {
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
   * Listener timeout property for GRPC protocol
   *
   * @default - none
   */
  readonly timeout?: GrpcTimeout;

  /**
   * Listener timeout property for GRPC protocol
   *
   * @default - none
   */
  protected protocol: Protocol = Protocol.GRPC;

  constructor(props: GrpcNodeListenerOptions = {}) {
    super();
    this.port = props.port ? props.port : 8080;
    this.healthCheck = props.healthCheck;
    this.timeout = props.timeout;
  }
}

/**
 * Represents the properties required to define a TCP Listener for a VirtualNode.
 */
class TcpNodeListener extends VirtualNodeListener {
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
   * Listener timeout property for TCP protocol
   *
   * @default - none
   */
  readonly timeout?: TcpTimeout;

  /**
   * Listener timeout property for HTTP protocol
   *
   * @default - none
   */
  protected protocol: Protocol = Protocol.TCP;

  constructor(props: TcpNodeListenerOptions = {}) {
    super();
    this.port = props.port ? props.port : 8080;
    this.healthCheck = props.healthCheck;
    this.timeout = props.timeout;
  }
}

