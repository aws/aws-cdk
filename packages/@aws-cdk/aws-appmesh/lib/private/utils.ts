/**
 * Generated Connection pool config
 */
export interface ConnectionPoolConfig {
  /**
   * The maximum connections in the pool
   *
   * @default - none
   */
  readonly maxConnections?: number;

  /**
   * The maximum pending requests in the pool
   *
   * @default - none
   */
  readonly maxPendingRequests?: number;

  /**
   * The maximum requests in the pool
   *
   * @default - none
   */
  readonly maxRequests?: number;
}

/**
 * Enum of supported AppMesh protocols
 */
export enum Protocol {
  HTTP = 'http',
  TCP = 'tcp',
  HTTP2 = 'http2',
  GRPC = 'grpc',
}