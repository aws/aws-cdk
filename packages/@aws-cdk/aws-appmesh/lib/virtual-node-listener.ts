import * as cdk from '@aws-cdk/core';
import { CfnVirtualNode } from './appmesh.generated';
import { validateHealthChecks } from './private/utils';
import { HealthCheck, Protocol, HttpTimeout, GrpcTimeout, TcpTimeout } from './shared-interfaces';
import { TlsCertificate, TlsCertificateConfig } from './tls-certificate';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

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

  /**
   * Represents the configuration for enabling TLS on a listener
   *
   * @default - none
   */
  readonly tlsCertificate?: TlsCertificate;
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
 *  Defines listener for a VirtualNode
 */
export abstract class VirtualNodeListener {
  /**
   * Returns an HTTP Listener for a VirtualNode
   */
  public static http(props: HttpVirtualNodeListenerOptions = {}): VirtualNodeListener {
    return new VirtualNodeListenerImpl(Protocol.HTTP, props.healthCheck, props.timeout, props.port, props.tlsCertificate);
  }

  /**
   * Returns an HTTP2 Listener for a VirtualNode
   */
  public static http2(props: HttpVirtualNodeListenerOptions = {}): VirtualNodeListener {
    return new VirtualNodeListenerImpl(Protocol.HTTP2, props.healthCheck, props.timeout, props.port, props.tlsCertificate);
  }

  /**
   * Returns an GRPC Listener for a VirtualNode
   */
  public static grpc(props: GrpcVirtualNodeListenerOptions = {}): VirtualNodeListener {
    return new VirtualNodeListenerImpl(Protocol.GRPC, props.healthCheck, props.timeout, props.port, props.tlsCertificate);
  }

  /**
   * Returns an TCP Listener for a VirtualNode
   */
  public static tcp(props: TcpVirtualNodeListenerOptions = {}): VirtualNodeListener {
    return new VirtualNodeListenerImpl(Protocol.TCP, props.healthCheck, props.timeout, props.port, props.tlsCertificate);
  }

  /**
   * Binds the current object when adding Listener to a VirtualNode
   */
  public abstract bind(scope: Construct): VirtualNodeListenerConfig;

}

class VirtualNodeListenerImpl extends VirtualNodeListener {
  constructor(private readonly protocol: Protocol,
    private readonly healthCheck: HealthCheck | undefined,
    private readonly timeout: HttpTimeout | undefined,
    private readonly port: number = 8080,
    private readonly tlsCertificate: TlsCertificate | undefined) { super(); }

  public bind(scope: Construct): VirtualNodeListenerConfig {
    const tlsConfig = this.tlsCertificate?.bind(scope);
    return {
      listener: {
        portMapping: {
          port: this.port,
          protocol: this.protocol,
        },
        healthCheck: this.healthCheck ? this.renderHealthCheck(this.healthCheck) : undefined,
        timeout: this.timeout ? this.renderTimeout(this.timeout) : undefined,
        tls: tlsConfig ? this.renderTls(tlsConfig) : undefined,
      },
    };
  }

  /**
   * Renders the TLS config for a listener
   */
  private renderTls(tlsCertificateConfig: TlsCertificateConfig): CfnVirtualNode.ListenerTlsProperty {
    return {
      certificate: tlsCertificateConfig.tlsCertificate,
      mode: tlsCertificateConfig.tlsMode.toString(),
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

