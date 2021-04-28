import * as cdk from '@aws-cdk/core';
import { CfnVirtualGateway, CfnVirtualNode } from './appmesh.generated';
import { ClientPolicy } from './client-policy';
import { Protocol } from './private/utils';
import { IVirtualService } from './virtual-service';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

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
 * Properties used to define healthchecks.
 */
export interface HealthCheckCommonOptions {
  /**
   * The number of consecutive successful health checks that must occur before declaring listener healthy.
   *
   * @default 5
   */
  readonly healthyThreshold?: number;

  /**
   * The time period in milliseconds between each health check execution.
   *
   * @default Duration.seconds(30)
   */
  readonly interval?: cdk.Duration;

  /**
   * The amount of time to wait when receiving a response from the health check, in milliseconds.
   *
   * @default Duration.seconds(5)
   */
  readonly timeout?: cdk.Duration;

  /**
   * The number of consecutive failed health checks that must occur before declaring a listener unhealthy.
   *
   * @default - 2
   */
  readonly unhealthyThreshold?: number;
}

/**
 * Properties used to define healthchecks.
 */
export interface HttpHealthCheckOptions extends HealthCheckCommonOptions {
  /**
   * The destination path for the health check request.
   *
   * @default /
   */
  readonly path?: string;
}

/**
 * All Properties for Health Checks for mesh endpoints
 */
export interface HealthCheckConfig {
  /**
   * VirtualNode CFN configuration for Health Checks
   *
   * @default - no health checks
   */
  readonly virtualNodeHealthCheck?: CfnVirtualNode.HealthCheckProperty;

  /**
   * VirtualGateway CFN configuration for Health Checks
   *
   * @default - no health checks
   */
  readonly virtualGatewayHealthCheck?: CfnVirtualGateway.VirtualGatewayHealthCheckPolicyProperty;
}

/**
 * Contains static factory methods for creating health checks for different protocols
 */
export abstract class HealthCheck {
  /**
   * Construct a HTTP health check
   */
  public static http(options: HttpHealthCheckOptions = {}): HealthCheck {
    return new HealthCheckImpl(Protocol.HTTP, options.healthyThreshold, options.unhealthyThreshold, options.interval, options.timeout, options.path);
  }

  /**
   * Construct a HTTP2 health check
   */
  public static http2(options: HttpHealthCheckOptions = {}): HealthCheck {
    return new HealthCheckImpl(Protocol.HTTP2, options.healthyThreshold, options.unhealthyThreshold, options.interval, options.timeout, options.path);
  }

  /**
   * Construct a GRPC health check
   */
  public static grpc(options: HealthCheckCommonOptions= {}): HealthCheck {
    return new HealthCheckImpl(Protocol.GRPC, options.healthyThreshold, options.unhealthyThreshold, options.interval, options.timeout);
  }

  /**
   * Construct a TCP health check
   */
  public static tcp(options: HealthCheckCommonOptions = {}): HealthCheck {
    return new HealthCheckImpl(Protocol.TCP, options.healthyThreshold, options.unhealthyThreshold, options.interval, options.timeout);
  }

  /**
   * Called when the AccessLog type is initialized. Can be used to enforce
   * mutual exclusivity with future properties
   */
  public abstract bind(scope: Construct): HealthCheckConfig;
}

class HealthCheckImpl extends HealthCheck {
  constructor(
    private readonly protocol: Protocol,
    private readonly healthyThreshold: number = 5,
    private readonly unhealthyThreshold: number = 2,
    private readonly interval: cdk.Duration = cdk.Duration.seconds(30),
    private readonly timeout: cdk.Duration = cdk.Duration.seconds(5),
    private readonly path?: string) {
    super();
    if (healthyThreshold < 2 || healthyThreshold > 10) {
      throw new Error('healthyThreshold must be between 2 and 10');
    }

    if (unhealthyThreshold < 2 || unhealthyThreshold > 10) {
      throw new Error('unhealthyThreshold must be between 2 and 10');
    }

    if (interval.toMilliseconds() < 5000 || interval.toMilliseconds() > 300_000) {
      throw new Error('interval must be more than 5 seconds and less than 300 seconds');
    }

    if (timeout.toMilliseconds() < 2000 || timeout.toMilliseconds() > 60_000) {
      throw new Error('timeout must be more than 2 seconds and less than 60 seconds');
    }

    // Default to / for HTTP Health Checks
    if (path === undefined && (protocol === Protocol.HTTP || protocol === Protocol.HTTP2)) {
      this.path = '/';
    }
  }

  public bind(_scope: Construct): HealthCheckConfig {
    return {
      virtualNodeHealthCheck: {
        protocol: this.protocol,
        healthyThreshold: this.healthyThreshold,
        unhealthyThreshold: this.unhealthyThreshold,
        intervalMillis: this.interval.toMilliseconds(),
        timeoutMillis: this.timeout.toMilliseconds(),
        path: this.path,
      },
      virtualGatewayHealthCheck: {
        protocol: this.protocol,
        healthyThreshold: this.healthyThreshold,
        unhealthyThreshold: this.unhealthyThreshold,
        intervalMillis: this.interval.toMilliseconds(),
        timeoutMillis: this.timeout.toMilliseconds(),
        path: this.path,
      },
    };
  }

}

/**
 * Represents the outlier detection for a listener.
 */
export interface OutlierDetection {
  /**
   * The base amount of time for which a host is ejected.
   */
  readonly baseEjectionDuration: cdk.Duration;

  /**
   * The time interval between ejection sweep analysis.
   */
  readonly interval: cdk.Duration;

  /**
   * Maximum percentage of hosts in load balancing pool for upstream service that can be ejected. Will eject at
   * least one host regardless of the value.
   */
  readonly maxEjectionPercent: number;

  /**
   * Number of consecutive 5xx errors required for ejection.
   */
  readonly maxServerErrors: number;
}

/**
 * All Properties for Envoy Access logs for mesh endpoints
 */
export interface AccessLogConfig {

  /**
   * VirtualNode CFN configuration for Access Logging
   *
   * @default - no access logging
   */
  readonly virtualNodeAccessLog?: CfnVirtualNode.AccessLogProperty;

  /**
   * VirtualGateway CFN configuration for Access Logging
   *
   * @default - no access logging
   */
  readonly virtualGatewayAccessLog?: CfnVirtualGateway.VirtualGatewayAccessLogProperty;
}

/**
 * Configuration for Envoy Access logs for mesh endpoints
 */
export abstract class AccessLog {
  /**
   * Path to a file to write access logs to
   *
   * @default - no file based access logging
   */
  public static fromFilePath(filePath: string): AccessLog {
    return new FileAccessLog(filePath);
  }

  /**
   * Called when the AccessLog type is initialized. Can be used to enforce
   * mutual exclusivity with future properties
   */
  public abstract bind(scope: Construct): AccessLogConfig;
}

/**
 * Configuration for Envoy Access logs for mesh endpoints
 */
class FileAccessLog extends AccessLog {
  /**
   * Path to a file to write access logs to
   *
   * @default - no file based access logging
   */
  public readonly filePath: string;

  constructor(filePath: string) {
    super();
    this.filePath = filePath;
  }

  public bind(_scope: Construct): AccessLogConfig {
    return {
      virtualNodeAccessLog: {
        file: {
          path: this.filePath,
        },
      },
      virtualGatewayAccessLog: {
        file: {
          path: this.filePath,
        },
      },
    };
  }
}

/**
 * Represents the properties needed to define backend defaults
 */
export interface BackendDefaults {
  /**
   * Client policy for backend defaults
   *
   * @default none
   */
  readonly clientPolicy?: ClientPolicy;
}

/**
 * Represents the properties needed to define a Virtual Service backend
 */
export interface VirtualServiceBackendOptions {

  /**
   * Client policy for the backend
   *
   * @default none
   */
  readonly clientPolicy?: ClientPolicy;
}

/**
 * Properties for a backend
 */
export interface BackendConfig {
  /**
   * Config for a Virtual Service backend
   */
  readonly virtualServiceBackend: CfnVirtualNode.BackendProperty;
}


/**
 * Contains static factory methods to create backends
 */
export abstract class Backend {
  /**
   * Construct a Virtual Service backend
   */
  public static virtualService(virtualService: IVirtualService, props: VirtualServiceBackendOptions = {}): Backend {
    return new VirtualServiceBackend(virtualService, props.clientPolicy);
  }

  /**
   * Return backend config
   */
  public abstract bind(_scope: Construct): BackendConfig;
}

/**
 * Represents the properties needed to define a Virtual Service backend
 */
class VirtualServiceBackend extends Backend {

  constructor (private readonly virtualService: IVirtualService,
    private readonly clientPolicy: ClientPolicy | undefined) {
    super();
  }

  /**
   * Return config for a Virtual Service backend
   */
  public bind(_scope: Construct): BackendConfig {
    return {
      virtualServiceBackend: {
        virtualService: {
          virtualServiceName: this.virtualService.virtualServiceName,
          clientPolicy: this.clientPolicy?.bind(_scope).clientPolicy,
        },
      },
    };
  }
}

/**
 * Connection pool properties for HTTP listeners
 */
export interface HttpConnectionPool {
  /**
   * The maximum connections in the pool
   *
   * @default - none
   */
  readonly maxConnections: number;

  /**
   * The maximum pending requests in the pool
   *
   * @default - none
   */
  readonly maxPendingRequests: number;
}

/**
 * Connection pool properties for TCP listeners
 */
export interface TcpConnectionPool {
  /**
   * The maximum connections in the pool
   *
   * @default - none
   */
  readonly maxConnections: number;
}

/**
 * Connection pool properties for gRPC listeners
 */
export interface GrpcConnectionPool {
  /**
   * The maximum requests in the pool
   *
   * @default - none
   */
  readonly maxRequests: number;
}

/**
 * Connection pool properties for HTTP2 listeners
 */
export interface Http2ConnectionPool {
  /**
   * The maximum requests in the pool
   *
   * @default - none
   */
  readonly maxRequests: number;
}