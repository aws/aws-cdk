import { Construct } from 'constructs';
import { CfnVirtualGateway, CfnVirtualNode } from './appmesh.generated';
import { renderTlsClientPolicy } from './private/utils';
import { TlsClientPolicy } from './tls-client-policy';
import { IVirtualService } from './virtual-service';
import * as cdk from '../../core';

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
 * Enum of supported AppMesh protocols
 *
 * @deprecated not for use outside package
 */
export enum Protocol {
  HTTP = 'http',
  TCP = 'tcp',
  HTTP2 = 'http2',
  GRPC = 'grpc',
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
  public static fromFilePath(filePath: string, loggingFormat?: LoggingFormat): AccessLog {
    return new FileAccessLog(filePath, loggingFormat);
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
  private readonly virtualNodeLoggingFormat?: CfnVirtualNode.LoggingFormatProperty;
  private readonly virtualGatewayLoggingFormat?: CfnVirtualGateway.LoggingFormatProperty;

  constructor(filePath: string, loggingFormat?: LoggingFormat) {
    super();
    this.filePath = filePath;
    // For now we have the same setting for Virtual Gateway and Virtual Nodes
    this.virtualGatewayLoggingFormat = loggingFormat?.bind().formatConfig;
    this.virtualNodeLoggingFormat = loggingFormat?.bind().formatConfig;
  }

  public bind(_scope: Construct): AccessLogConfig {
    return {
      virtualNodeAccessLog: {
        file: {
          path: this.filePath,
          format: this.virtualNodeLoggingFormat,
        },
      },
      virtualGatewayAccessLog: {
        file: {
          path: this.filePath,
          format: this.virtualGatewayLoggingFormat,
        },
      },
    };
  }
}

/**
 * All Properties for Envoy Access Logging Format for mesh endpoints
 */
export interface LoggingFormatConfig {
  /**
   * CFN configuration for Access Logging Format
   *
   * @default - no access logging format
   */
  readonly formatConfig?: CfnVirtualNode.LoggingFormatProperty;
}

/**
 * Configuration for Envoy Access Logging Format for mesh endpoints
 */
export abstract class LoggingFormat {
  /**
   * Generate logging format from text pattern
   */
  public static fromText(text: string): LoggingFormat {
    return new TextLoggingFormat(text);
  }
  /**
   * Generate logging format from json key pairs
   */
  public static fromJson(jsonLoggingFormat :{[key:string]: string}): LoggingFormat {
    if (Object.keys(jsonLoggingFormat).length == 0) {
      throw new Error('Json key pairs cannot be empty.');
    }

    return new JsonLoggingFormat(jsonLoggingFormat);
  };

  /**
   * Called when the Access Log Format is initialized. Can be used to enforce
   * mutual exclusivity with future properties
   */
  public abstract bind(): LoggingFormatConfig;
}

/**
 * Configuration for Json logging format
 */
class JsonLoggingFormat extends LoggingFormat {
  /**
  * Json pattern for the output logs
  */
  private readonly json: Array<CfnVirtualNode.JsonFormatRefProperty>;
  constructor(json: {[key:string]: string}) {
    super();
    this.json = Object.entries(json).map(([key, value]) => ({ key, value }));
  }

  bind(): LoggingFormatConfig {
    return {
      formatConfig: {
        json: this.json,
      },
    };
  }
}

class TextLoggingFormat extends LoggingFormat {
  /**
  * Json pattern for the output logs
  */
  private readonly text: string;
  constructor(text: string) {
    super();
    this.text = text;
  }

  public bind(): LoggingFormatConfig {
    return {
      formatConfig: {
        text: this.text,
      },
    };
  }
}

/**
 * Represents the properties needed to define backend defaults
 */
export interface BackendDefaults {
  /**
   * TLS properties for Client policy for backend defaults
   *
   * @default - none
   */
  readonly tlsClientPolicy?: TlsClientPolicy;
}

/**
 * Represents the properties needed to define a Virtual Service backend
 */
export interface VirtualServiceBackendOptions {

  /**
   * TLS properties for  Client policy for the backend
   *
   * @default - none
   */
  readonly tlsClientPolicy?: TlsClientPolicy;
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
    return new VirtualServiceBackend(virtualService, props.tlsClientPolicy);
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
    private readonly tlsClientPolicy: TlsClientPolicy | undefined) {
    super();
  }

  /**
   * Return config for a Virtual Service backend
   */
  public bind(scope: Construct): BackendConfig {
    return {
      virtualServiceBackend: {
        virtualService: {
          /**
           * We want to use the name of the Virtual Service here directly instead of
           * a `{ 'Fn::GetAtt' }` CFN expression. This avoids a circular dependency in
           * the case where this Virtual Node is the Virtual Service's provider.
           */
          virtualServiceName: cdk.Token.isUnresolved(this.virtualService.virtualServiceName)
            ? (this.virtualService as any).physicalName
            : this.virtualService.virtualServiceName,
          clientPolicy: this.tlsClientPolicy
            ? {
              tls: renderTlsClientPolicy(scope, this.tlsClientPolicy),
            }
            : undefined,
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
