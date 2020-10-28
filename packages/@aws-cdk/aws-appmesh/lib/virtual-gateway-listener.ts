import * as cdk from '@aws-cdk/core';
import { CfnVirtualGateway } from './appmesh.generated';
import { validateHealthChecks } from './private/utils';
import { HealthCheck, Protocol } from './shared-interfaces';

/**
 * Represents the properties needed to define HTTP Listeners for a VirtualGateway
 */
export interface HttpGatewayListenerProps {
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
 * Represents the properties needed to define GRPC Listeners for a VirtualGateway
 */
export interface GrpcGatewayListenerProps {
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
 * Properties for a VirtualGateway listener
 */
export interface VirtualGatewayListenerConfig {
  /**
   * Single listener config for a VirtualGateway
   */
  readonly listener: CfnVirtualGateway.VirtualGatewayListenerProperty,
}

/**
 * Represents the properties needed to define listeners for a VirtualGateway
 */
export abstract class VirtualGatewayListener {
  /**
   * Returns an HTTP Listener for a VirtualGateway
   */
  public static httpGatewayListener(props: HttpGatewayListenerProps = {}): VirtualGatewayListener {
    return new HttpGatewayListener(props);
  }

  /**
   * Returns an HTTP2 Listener for a VirtualGateway
   */
  public static http2GatewayListener(props: HttpGatewayListenerProps = {}): VirtualGatewayListener {
    return new Http2GatewayListener(props);
  }

  /**
   * Returns a GRPC Listener for a VirtualGateway
   */
  public static grpcGatewayListener(props: GrpcGatewayListenerProps = {}): VirtualGatewayListener {
    return new GrpcGatewayListener(props);
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
   * Called when the GatewayListener type is initialized. Can be used to enforce
   * mutual exclusivity
   */
  public abstract bind(scope: cdk.Construct): VirtualGatewayListenerConfig;

  protected renderHealthCheck(hc: HealthCheck): CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty | undefined {
    if (hc.protocol === Protocol.TCP) {
      throw new Error('The path property cannot be set with Protocol.TCP');
    }

    if (hc.protocol === Protocol.GRPC && hc.path) {
      throw new Error('The path property cannot be set with Protocol.GRPC');
    }

    const protocol = hc.protocol? hc.protocol : this.protocol;

    const healthCheck: CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty = {
      healthyThreshold: hc.healthyThreshold || 2,
      intervalMillis: (hc.interval || cdk.Duration.seconds(5)).toMilliseconds(), // min
      path: hc.path || ((protocol === Protocol.HTTP || protocol === Protocol.HTTP2) ? '/' : undefined),
      port: hc.port || this.port,
      protocol: hc.protocol || this.protocol,
      timeoutMillis: (hc.timeout || cdk.Duration.seconds(2)).toMilliseconds(),
      unhealthyThreshold: hc.unhealthyThreshold || 2,
    };

    validateHealthChecks(healthCheck);

    return healthCheck;
  }
}

/**
 * Represents the properties needed to define an HTTP Listener for a VirtualGateway
 */
class HttpGatewayListener extends VirtualGatewayListener {
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
   * Protocol the listener implements
   */
  protected protocol: Protocol = Protocol.HTTP;

  constructor(props: HttpGatewayListenerProps = {}) {
    super();
    this.port = props.port ? props.port : 8080;
    this.healthCheck = props.healthCheck;
  }

  /**
   * Called when the GatewayListener type is initialized. Can be used to enforce
   * mutual exclusivity
   */
  public bind(_scope: cdk.Construct): VirtualGatewayListenerConfig {
    return {
      listener: {
        portMapping: {
          port: this.port,
          protocol: this.protocol,
        },
        healthCheck: this.healthCheck ? this.renderHealthCheck(this.healthCheck): undefined,
      },
    };
  }
}

/**
* Represents the properties needed to define an HTTP2 Listener for a VirtualGateway
*/
class Http2GatewayListener extends HttpGatewayListener {
  constructor(props: HttpGatewayListenerProps = {}) {
    super(props);
    this.protocol = Protocol.HTTP2;
  }
}

/**
 * Represents the properties needed to define a GRPC Listener for Virtual Gateway
 */
class GrpcGatewayListener extends VirtualGatewayListener {
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
   * Protocol the listener implements
   */
  protected protocol: Protocol = Protocol.GRPC;

  constructor(props: HttpGatewayListenerProps = {}) {
    super();
    this.port = props.port ? props.port : 8080;
    this.healthCheck = props.healthCheck;
  }

  /**
   * Called when the GatewayListener type is initialized. Can be used to enforce
   * mutual exclusivity
   */
  public bind(_scope: cdk.Construct): VirtualGatewayListenerConfig {
    return {
      listener: {
        portMapping: {
          port: this.port,
          protocol: Protocol.GRPC,
        },
        healthCheck: this.healthCheck? this.renderHealthCheck(this.healthCheck): undefined,
      },
    };
  }
}