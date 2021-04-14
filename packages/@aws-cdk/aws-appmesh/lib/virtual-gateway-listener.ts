import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnVirtualGateway } from './appmesh.generated';
import { validateHealthChecks } from './private/utils';
import { HealthCheck, Protocol } from './shared-interfaces';
import { TlsCertificate, TlsCertificateConfig } from './tls-certificate';

/**
 * Represents the properties needed to define HTTP Listeners for a VirtualGateway
 */
export interface HttpGatewayListenerOptions {
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
 * Represents the properties needed to define GRPC Listeners for a VirtualGateway
 */
export interface GrpcGatewayListenerOptions {
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
   * Represents the listener certificate
   *
   * @default - none
   */
  readonly tlsCertificate?: TlsCertificate;
}

/**
 * Properties for a VirtualGateway listener
 */
export interface VirtualGatewayListenerConfig {
  /**
   * Single listener config for a VirtualGateway
   */
  readonly listener: CfnVirtualGateway.VirtualGatewayListenerProperty;
}

/**
 * Represents the properties needed to define listeners for a VirtualGateway
 */
export abstract class VirtualGatewayListener {
  /**
   * Returns an HTTP Listener for a VirtualGateway
   */
  public static http(options: HttpGatewayListenerOptions = {}): VirtualGatewayListener {
    return new VirtualGatewayListenerImpl(Protocol.HTTP, options.healthCheck, options.port, options.tlsCertificate);
  }

  /**
   * Returns an HTTP2 Listener for a VirtualGateway
   */
  public static http2(options: HttpGatewayListenerOptions = {}): VirtualGatewayListener {
    return new VirtualGatewayListenerImpl(Protocol.HTTP2, options.healthCheck, options.port, options.tlsCertificate);
  }

  /**
   * Returns a GRPC Listener for a VirtualGateway
   */
  public static grpc(options: GrpcGatewayListenerOptions = {}): VirtualGatewayListener {
    return new VirtualGatewayListenerImpl(Protocol.GRPC, options.healthCheck, options.port, options.tlsCertificate);
  }

  /**
   * Called when the GatewayListener type is initialized. Can be used to enforce
   * mutual exclusivity
   */
  public abstract bind(scope: Construct): VirtualGatewayListenerConfig;
}

/**
 * Represents the properties needed to define an HTTP Listener for a VirtualGateway
 */
class VirtualGatewayListenerImpl extends VirtualGatewayListener {

  constructor(private readonly protocol: Protocol,
    private readonly healthCheck: HealthCheck | undefined,
    private readonly port: number = 8080,
    private readonly tlsCertificate: TlsCertificate | undefined) {
    super();
  }

  /**
   * Called when the GatewayListener type is initialized. Can be used to enforce
   * mutual exclusivity
   */
  public bind(scope: Construct): VirtualGatewayListenerConfig {
    const tlsConfig = this.tlsCertificate?.bind(scope);
    return {
      listener: {
        portMapping: {
          port: this.port,
          protocol: this.protocol,
        },
        healthCheck: this.healthCheck ? renderHealthCheck(this.healthCheck, this.protocol, this.port): undefined,
        tls: tlsConfig ? renderTls(tlsConfig) : undefined,
      },
    };
  }

}

/**
 * Renders the TLS config for a listener
 */
function renderTls(tlsCertificateConfig: TlsCertificateConfig): CfnVirtualGateway.VirtualGatewayListenerTlsProperty {
  return {
    certificate: tlsCertificateConfig.tlsCertificate,
    mode: tlsCertificateConfig.tlsMode.toString(),
  };
}

function renderHealthCheck(hc: HealthCheck, listenerProtocol: Protocol,
  listenerPort: number): CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty {

  if (hc.protocol === Protocol.TCP) {
    throw new Error('TCP health checks are not permitted for gateway listeners');
  }

  if (hc.protocol === Protocol.GRPC && hc.path) {
    throw new Error('The path property cannot be set with Protocol.GRPC');
  }

  const protocol = hc.protocol? hc.protocol : listenerProtocol;

  const healthCheck: CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty = {
    healthyThreshold: hc.healthyThreshold || 2,
    intervalMillis: (hc.interval || cdk.Duration.seconds(5)).toMilliseconds(), // min
    path: hc.path || ((protocol === Protocol.HTTP || protocol === Protocol.HTTP2) ? '/' : undefined),
    port: hc.port || listenerPort,
    protocol: hc.protocol || listenerProtocol,
    timeoutMillis: (hc.timeout || cdk.Duration.seconds(2)).toMilliseconds(),
    unhealthyThreshold: hc.unhealthyThreshold || 2,
  };

  validateHealthChecks(healthCheck);

  return healthCheck;
}
