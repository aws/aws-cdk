
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

/**
 * Session storage configuration for an AgentCore Runtime filesystem.
 * Session storage is a filesystem mounted inside the AgentCore Runtime that provides
 * persistent storage across invocations (stop/resume cycles).
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-persistent-filesystems.html
 */
export interface SessionStorageConfiguration {
  /**
   * The mount path inside the runtime container where the session storage is mounted.
   * Must be under `/mnt` with one subdirectory level (for example, `/mnt/data`).
   */
  readonly mountPath: string;
}

/**
 * Filesystem configuration for the AgentCore Runtime.
 */
export interface FilesystemConfiguration {
  /**
   * Session storage configuration for the runtime.
   * @default - No session storage
   */
  readonly sessionStorage?: SessionStorageConfiguration;
}
