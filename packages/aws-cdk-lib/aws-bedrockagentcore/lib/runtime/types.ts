
/******************************************************************************
 *                                 Enums
 *****************************************************************************/

import type { Duration } from '../../../core';

/**
 * Protocol configuration for Agent Runtime
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-bedrockagentcore-runtime.html#cfn-bedrockagentcore-runtime-protocolconfiguration
 */
export class ProtocolType {
  /**
   * Model Context Protocol
   */
  public static readonly MCP = new ProtocolType('MCP');

  /**
   * HTTP protocol
   */
  public static readonly HTTP = new ProtocolType('HTTP');

  /**
   * A2A protocol
   */
  public static readonly A2A = new ProtocolType('A2A');

  /**
   * Agent User Interaction (AGUI) protocol
   */
  public static readonly AGUI = new ProtocolType('AGUI');

  /**
   * Use a custom protocol type not yet defined in this class.
   * @param value The protocol type string value
   */
  public static of(value: string): ProtocolType {
    return new ProtocolType(value);
  }

  /**
   * The protocol type string value.
   */
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /** Returns the string value. */
  public toString(): string {
    return this.value;
  }
}

/**
 * The platform version that controls how AgentCore Runtime starts an agent.
 *
 * This is unrelated to the runtime versions that capture the configuration history
 * of an AgentCore Runtime.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-how-it-works.html#runtime-platform-versions
 */
export enum RuntimePlatformVersion {
  /**
   * Initializes the agent environment on every cold start.
   */
  V1 = 'V1',

  /**
   * Starts the agent by restoring a prepared snapshot, which keeps cold start latency
   * consistent regardless of concurrency or container image size.
   *
   * V2 is only available in a subset of AWS Regions, create and update operations take
   * several minutes to reach `READY`, and the agent must report healthy from `/ping`
   * within 120 seconds of startup.
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-v2-optimize.html
   */
  V2 = 'V2',
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
