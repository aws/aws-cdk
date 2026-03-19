
/******************************************************************************
 *                                 Enums
 *****************************************************************************/

import type { Duration } from 'aws-cdk-lib';

/**
 * Protocol configuration for Agent Runtime
 */
export enum ProtocolType {
  /**
   * Model Context Protocol
   */
  MCP = 'MCP',

  /**
   * HTTP protocol
   */
  HTTP = 'HTTP',

  /**
   * A2A protocol
   */
  A2A = 'A2A',
}

/**
 * Configuration for HTTP request headers that will be passed through to the runtime.
 */
export interface RequestHeaderConfiguration {
  /**
   * A list of HTTP request headers that are allowed to be passed through to the runtime.
   * @default - No request headers allowed
   */
  readonly allowlistedHeaders?: string[];
}

/**
 * LifecycleConfiguration lets you manage the lifecycle of runtime sessions and resources in AgentCore Runtime.
 * This configuration helps optimize resource utilization by automatically cleaning up idle sessions and preventing
 * long-running instances from consuming resources indefinitely.
 */
export interface LifecycleConfiguration {
  /**
   * Timeout in seconds for idle runtime sessions. When a session remains idle for this duration,
   * it will be automatically terminated.
   * @default undefined - service default setting is 900 seconds (15 minutes)
   */
  readonly idleRuntimeSessionTimeout?: Duration;

  /**
   * Maximum lifetime for the instance in seconds. Once reached, instances will be automatically
   * terminated and replaced.
   * @default undefined - service default setting is 28800 seconds (8 hours)
   */
  readonly maxLifetime?: Duration;
}
