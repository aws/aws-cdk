import * as cdk from '@aws-cdk/core';
import { CfnVirtualNode } from './appmesh.generated';
import { validateHealthChecks } from './private/utils';
import { HealthCheck, HttpTimeout, TcpTimeout, Protocol, GrpcTimeout } from './shared-interfaces';

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
 *  Defines listener for a VirtualNode
 */
export abstract class VirtualNodeListener {
  /**
   * Returns an HTTP Listener for a VirtualNode
   */
  public static httpNodeListener(props: HttpNodeListenerProps = {}): VirtualNodeListener {
    return new HttpNodeListener(props);
  }

  /**
   * Returns an HTTP2 Listener for a VirtualNode
   */
  public static http2NodeListener(props: HttpNodeListenerProps = {}): VirtualNodeListener {
    return new Http2NodeListener(props);
  }

  /**
   * Returns an GRPC Listener for a VirtualNode
   */
  public static grpcNodeListener(props: GrpcNodeListenerProps = {}): VirtualNodeListener {
    return new GrpcNodeListener(props);
  }

  /**
   * Returns an TCP Listener for a VirtualNode
   */
  public static tcpNodeListener(props: TcpNodeListenerProps = {}): VirtualNodeListener {
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
   * Binds the current object when adding Listener to a VirtualNode
   */
  public abstract bind(scope: cdk.Construct): VirtualNodeListenerConfig;

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
  protected renderTimeout(timeout: any): CfnVirtualNode.ListenerTimeoutProperty {
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

  constructor(props: HttpNodeListenerProps = {}) {
    super();
    this.port = props.port ? props.port : 8080;
    this.healthCheck = props.healthCheck;
    this.timeout = props.timeout;
  }

  /**
   * Return Listener for HTTP protocol when Listener is added to Virtual Node.
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
}

/**
* Represents the properties needed to define an HTTP2 Listener for a VirtualGateway
*/
class Http2NodeListener extends HttpNodeListener {
  constructor(props: HttpNodeListenerProps = {}) {
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

  constructor(props: GrpcNodeListenerProps = {}) {
    super();
    this.port = props.port ? props.port : 8080;
    this.healthCheck = props.healthCheck;
    this.timeout = props.timeout;
  }

  /**
   * Return Listener for GRPC protocol when Listener is added to Virtual Node.
   */
  public bind(_scope: cdk.Construct): VirtualNodeListenerConfig {
    return {
      listener: {
        portMapping: {
          port: this.port,
          protocol: Protocol.GRPC,
        },
        healthCheck: this.healthCheck ? this.renderHealthCheck(this.healthCheck) : undefined,
        timeout: this.timeout ? this.renderTimeout(this.timeout) : undefined,
      },
    };
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

  constructor(props: TcpNodeListenerProps = {}) {
    super();
    this.port = props.port ? props.port : 8080;
    this.healthCheck = props.healthCheck;
    this.timeout = props.timeout;
  }

  /**
   * Return Listener for TCP protocol when Listener is added to Virtual Node.
  */
  public bind(_scope: cdk.Construct): VirtualNodeListenerConfig {
    return {
      listener: {
        portMapping: {
          port: this.port,
          protocol: Protocol.TCP,
        },
        healthCheck: this.healthCheck ? this.renderHealthCheck(this.healthCheck) : undefined,
        timeout: this.timeout ? this.renderTimeout(this.timeout) : undefined,
      },
    };
  }
}

/**
 * Represents the properties needed to define a Listeners for a VirtualNode
 */
interface VirtualNodeListenerProps {
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
export interface HttpNodeListenerProps extends VirtualNodeListenerProps {
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
export interface GrpcNodeListenerProps extends VirtualNodeListenerProps {
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
export interface TcpNodeListenerProps extends VirtualNodeListenerProps {
  /**
   * Timeout for TCP protocol
   *
   * @default - None
   */
  readonly timeout?: TcpTimeout;
}

