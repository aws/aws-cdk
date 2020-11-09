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
interface VirtualNodeListenerCommonOptions {
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
export interface HttpVirtualNodeListenerOptions extends VirtualNodeListenerCommonOptions {
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
export interface GrpcVirtualNodeListenerOptions extends VirtualNodeListenerCommonOptions {
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
export interface TcpVirtualNodeListenerOptions extends VirtualNodeListenerCommonOptions {
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
  public static http(props: HttpVirtualNodeListenerOptions = {}): VirtualNodeListener {
    return new VirtualNodeListenerImpl(Protocol.HTTP, props.healthCheck, props.timeout, props.port);
  }

  /**
   * Returns an HTTP2 Listener for a VirtualNode
   */
  public static http2(props: HttpVirtualNodeListenerOptions = {}): VirtualNodeListener {
    return new VirtualNodeListenerImpl(Protocol.HTTP2, props.healthCheck, props.timeout, props.port);
  }

  /**
   * Returns an GRPC Listener for a VirtualNode
   */
  public static grpc(props: GrpcVirtualNodeListenerOptions = {}): VirtualNodeListener {
    return new VirtualNodeListenerImpl(Protocol.GRPC, props.healthCheck, props.timeout, props.port);
  }

  /**
   * Returns an TCP Listener for a VirtualNode
   */
  public static tcp(props: TcpVirtualNodeListenerOptions = {}): VirtualNodeListener {
    return new VirtualNodeListenerImpl(Protocol.TCP, props.healthCheck, props.timeout, props.port);
  }

  /**
   * Binds the current object when adding Listener to a VirtualNode
   */
  public abstract bind(scope: cdk.Construct): VirtualNodeListenerConfig;

}

class VirtualNodeListenerImpl extends VirtualNodeListener {
  constructor(private readonly protocol: Protocol,
    private readonly healthCheck: HealthCheck | undefined,
    private readonly timeout: HttpTimeout | undefined,
    private readonly port: number = 8080) { super(); }

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

  private renderHealthCheck(hc: HealthCheck): CfnVirtualNode.HealthCheckProperty | undefined {
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
