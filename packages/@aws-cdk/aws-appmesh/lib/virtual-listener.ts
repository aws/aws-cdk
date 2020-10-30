import * as cdk from '@aws-cdk/core';
import { CfnVirtualNode } from './appmesh.generated';
import { HealthCheck, HttpTimeout, TcpTimeout, Protocol, GrpcTimeout, PortMapping } from './shared-interfaces';

/**
 *  Defines listener for a VirtualNode
 */
export abstract class VirtualNodeListener {
  /**
   * Returns an HTTP Listener for a VirtualNode
   */
  public static httpNodeListener(props?: HttpNodeListenerProps): VirtualNodeListener {
    return new HttpNodeListener(props);
  }

  /**
   * Returns an HTTP2 Listener for a VirtualNode
   */
  public static http2NodeListener(props?: HttpNodeListenerProps): VirtualNodeListener {
    return new HttpNodeListener(props, Protocol.HTTP2);
  }

  /**
   * Returns an GRPC Listener for a VirtualNode
   */
  public static grpcNodeListener(props?: GrpcNodeListenerProps): VirtualNodeListener {
    return new GrpcNodeListener(props);
  }

  /**
   * Returns an TCP Listener for a VirtualNode
   */
  public static tcpNodeListener(props?: TcpNodeListenerProps): VirtualNodeListener {
    return new TcpNodeListener(props);
  }

  /**
   * Binds the current object when adding Listener to a VirtualNode
   */
  public abstract bind(scope: cdk.Construct): CfnVirtualNode.ListenerProperty;
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
  readonly protocol?: Protocol;

  constructor(props?: HttpNodeListenerProps, protocol?: Protocol) {
    super();
    const checkedProps = props ?? {};
    this.port = checkedProps.port ? checkedProps.port : 8080;
    this.healthCheck = checkedProps.healthCheck;
    this.protocol = protocol;
    this.timeout = checkedProps.timeout;
  }

  /**
   * Return Listener for HTTP protocol when Listener is added to Virtual Node.
   */
  public bind(_scope: cdk.Construct): CfnVirtualNode.ListenerProperty {
    return {
      portMapping: {
        port: this.port,
        protocol: this.protocol ? this.protocol : Protocol.HTTP,
      },
      healthCheck: renderHealthCheck({
        port: this.port,
        protocol: this.protocol ? this.protocol : Protocol.HTTP,
      }, this.healthCheck),
      timeout: this.timeout ? renderTimeout(this.timeout, this.protocol ? this.protocol : Protocol.HTTP) : undefined,
    };
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

  constructor(props?: GrpcNodeListenerProps) {
    super();
    const checkedProps = props ?? {};
    this.port = checkedProps.port ? checkedProps.port : 8080;
    this.healthCheck = checkedProps.healthCheck;
    this.timeout = checkedProps.timeout;
  }

  /**
   * Return Listener for GRPC protocol when Listener is added to Virtual Node.
   */
  public bind(_scope: cdk.Construct): CfnVirtualNode.ListenerProperty {
    return {
      portMapping: {
        port: this.port,
        protocol: Protocol.GRPC,
      },
      healthCheck: renderHealthCheck({
        port: this.port,
        protocol: Protocol.GRPC,
      }, this.healthCheck),
      timeout: this.timeout ? renderTimeout(this.timeout, Protocol.GRPC) : undefined,
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

  constructor(props?: TcpNodeListenerProps) {
    super();
    const checkedProps = props ?? {};
    this.port = checkedProps.port ? checkedProps.port : 8080;
    this.healthCheck = checkedProps.healthCheck;
    this.timeout = checkedProps.timeout;
  }

  /**
   * Return Listener for TCP protocol when Listener is added to Virtual Node.
  */
  public bind(_scope: cdk.Construct): CfnVirtualNode.ListenerProperty {
    return {
      portMapping: {
        port: this.port,
        protocol: Protocol.TCP,
      },
      healthCheck: renderHealthCheck({
        port: this.port,
        protocol: Protocol.TCP,
      }, this.healthCheck),
      timeout: this.timeout ? renderTimeout(this.timeout, Protocol.TCP) : undefined,
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
   * Protocol
   *
   * @default - HTTP
   */
  readonly protocol?: Protocol;
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

/**
 * Returns an HealthCheck for a VirtualNode
 */
function renderHealthCheck(pm: PortMapping, hc: HealthCheck | undefined): CfnVirtualNode.HealthCheckProperty | undefined {
  /**
   * Minimum and maximum thresholds for HeathCheck numeric properties
   *
   * @see https://docs.aws.amazon.com/app-mesh/latest/APIReference/API_HealthCheckPolicy.html
   */
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
 * Returns the ListenerTimeoutProperty for HTTP protocol
 */
function renderTimeout(tm: any, pr: Protocol): CfnVirtualNode.ListenerTimeoutProperty {
  return ({
    [pr]: {
      idle: tm?.idle !== undefined ? {
        unit: 'ms',
        value: tm?.idle.toMilliseconds(),
      } : undefined,
      perRequest: tm?.perRequest !== undefined ? {
        unit: 'ms',
        value: tm?.perRequest.toMilliseconds(),
      } : undefined,
    },
  });
}
