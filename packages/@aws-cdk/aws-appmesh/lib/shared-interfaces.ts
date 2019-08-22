import { Duration } from '@aws-cdk/core';

/**
 * Enum of supported AppMesh protocols
 */
export enum Protocol {
  HTTP = 'http',
  TCP = 'tcp',
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
  readonly interval?: Duration;
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
  readonly timeout?: Duration;
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
   * Protocol for the VirtualNode / Route, only TCP or HTTP supported
   *
   * @default HTTP
   */
  readonly protocol: Protocol;
}

/**
 * Represents the properties needed to define healthy and active listeners for nodes.
 */
export interface VirtualNodeListener {
  /**
   * Array of PortMappingProps for the listener
   *
   * @default - HTTP port 8080
   */
  readonly portMapping?: PortMapping;

  /**
   * Array fo HealthCheckProps for the node(s)
   *
   * @default - no healthcheck
   */
  readonly healthCheck?: HealthCheck;
}
