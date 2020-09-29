import * as cdk from '@aws-cdk/core';
import { CfnVirtualNode } from './appmesh.generated';

/**
 * Enum of supported AppMesh protocols
 */
export enum Protocol {
  HTTP = 'http',
  TCP = 'tcp',
  HTTP2 = 'http2',
  GRPC = 'grpc',
}

/**
 * Properties used to define healthchecks when creating virtual nodes.
 * All values have a default if only specified as {} when creating.
 * If property not set, then no healthchecks will be defined.
 */
export interface HealthCheck {
  /**
   * Number of successful attempts before considering the node UP
   *
   * @default 2
   */
  readonly healthyThreshold?: number;
  /**
   * Interval in milliseconds to re-check
   *
   * @default 5 seconds
   */
  readonly interval?: cdk.Duration;
  /**
   * The path where the application expects any health-checks, this can also be the application path.
   *
   * @default /
   */
  readonly path?: string;
  /**
   * The TCP port number for the healthcheck
   *
   * @default - same as corresponding port mapping
   */
  readonly port?: number;
  /**
   * The protocol to use for the healthcheck, for convinience a const enum has been defined.
   * Protocol.HTTP or Protocol.TCP
   *
   * @default - same as corresponding port mapping
   */
  readonly protocol?: Protocol;
  /**
   * Timeout in milli-seconds for the healthcheck to be considered a fail.
   *
   * @default 2 seconds
   */
  readonly timeout?: cdk.Duration;
  /**
   * Number of failed attempts before considering the node DOWN.
   *
   * @default 2
   */
  readonly unhealthyThreshold?: number;
}

/**
 * Port mappings for resources that require these attributes, such as VirtualNodes and Routes
 */
export interface PortMapping {
  /**
   * Port mapped to the VirtualNode / Route
   *
   * @default 8080
   */
  readonly port: number;

  /**
   * Protocol for the VirtualNode / Route, only GRPC, HTTP, HTTP2, or TCP is supported
   *
   * @default HTTP
   */
  readonly protocol: Protocol;
}

/**
 * Base properties all listeners share
 */
export interface ListenerBase {
  /**
   * Array of PortMappingProps for the listener
   *
   * @default - HTTP port 8080
   */
  readonly portMapping?: PortMapping;

  /**
   * Health checking strategy upstream nodes should use when communicating with the listener
   *
   * @default - no healthcheck
   */
  readonly healthCheck?: HealthCheck;
}

/**
 * Represents the properties needed to define healthy and active listeners for nodes
 */
export interface VirtualNodeListener extends ListenerBase {}

/**
 * Represents the properties needed to define listeners for Virtual Gateways
 */
export interface VirtualGatewayListener extends ListenerBase {}

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
  public abstract bind(scope: cdk.Construct): AccessLogConfig;
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

  public bind(_scope: cdk.Construct): AccessLogConfig {
    return {
      virtualNodeAccessLog: {
        file: {
          path: this.filePath,
        },
      },
    };
  }
}
