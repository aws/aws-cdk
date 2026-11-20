
/******************************************************************************
 *                                 Enums
 *****************************************************************************/

import type { Duration } from '../../../core';
import { Token } from '../../../core';
import { UnscopedValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/helpers-internal';
import type { CfnRuntime } from '../bedrockagentcore.generated';

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
 * The platform version of the Agent Runtime.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-bedrockagentcore-runtime.html#cfn-bedrockagentcore-runtime-platformversion
 */
export class PlatformVersion {
  /**
   * Platform version V1 (the create-time default).
   */
  public static readonly V1 = new PlatformVersion('V1');

  /**
   * Platform version V2 (the new AgentCore Runtime — elastic, optimized, consistently fast starts).
   */
  public static readonly V2 = new PlatformVersion('V2');

  /**
   * Use a custom platform version not yet defined in this class.
   * @param value The platform version string value
   */
  public static of(value: string): PlatformVersion {
    return new PlatformVersion(value);
  }

  /**
   * The platform version string value.
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
 * Options for an HTTP POST lifecycle hook.
 */
export interface HttpPostLifecycleHookOptions {
  /**
   * The path in the agent's container that the service calls, for example `/warmup`.
   *
   * Must be 1-32 characters, start with `/`, and must not be a route the service already calls
   * on the container, such as the invocation path or the default health check.
   */
  readonly path: string;

  /**
   * The port in the agent's container that the service calls. Must be between 8000 and 12000.
   *
   * @default - the runtime's server port
   */
  readonly port?: number;
}

/**
 * A hook the AgentCore service calls on the agent's container.
 */
export class LifecycleHook {
  /**
   * Send an HTTP POST to the agent's container.
   *
   * Any 2xx response ends the hook; any other response fails it.
   */
  public static httpPost(options: HttpPostLifecycleHookOptions): LifecycleHook {
    validateHttpPostLifecycleHookOptions(options);
    return new LifecycleHook({ httpPost: { path: options.path, port: options.port } });
  }

  private constructor(private readonly action: CfnRuntime.LifecycleHookActionProperty) {}

  /**
   * Renders the hook for CloudFormation
   * @internal
   */
  public _render(): CfnRuntime.LifecycleHookProperty {
    return { action: this.action };
  }
}

/**
 * Hooks the AgentCore service calls while it builds the runtime.
 */
export interface BuildLifecycleHooks {
  /**
   * Called to warm up the agent before the service snapshots it.
   *
   * @default - no warmup hook
   */
  readonly warmup?: LifecycleHook;
}

const LIFECYCLE_HOOK_PATH_MAX_LENGTH = 32;
const LIFECYCLE_HOOK_PATH_PATTERN = /^\/[A-Za-z0-9._~/-]*$/;
const LIFECYCLE_HOOK_PORT_MIN = 8000;
const LIFECYCLE_HOOK_PORT_MAX = 12000;

function validateHttpPostLifecycleHookOptions(options: HttpPostLifecycleHookOptions): void {
  const { path, port } = options;
  if (!Token.isUnresolved(path)) {
    if (path.length < 1 || path.length > LIFECYCLE_HOOK_PATH_MAX_LENGTH) {
      throw new UnscopedValidationError(lit`InvalidLifecycleHookPath`,
        `lifecycle hook path must be between 1 and ${LIFECYCLE_HOOK_PATH_MAX_LENGTH} characters, got ${JSON.stringify(path)}`);
    }
    if (!LIFECYCLE_HOOK_PATH_PATTERN.test(path)) {
      throw new UnscopedValidationError(lit`InvalidLifecycleHookPath`,
        `lifecycle hook path must start with '/' and contain only letters, numbers, '.', '_', '~', '/' and '-', got ${JSON.stringify(path)}`);
    }
  }
  if (port !== undefined && !Token.isUnresolved(port)) {
    if (!Number.isInteger(port) || port < LIFECYCLE_HOOK_PORT_MIN || port > LIFECYCLE_HOOK_PORT_MAX) {
      throw new UnscopedValidationError(lit`InvalidLifecycleHookPort`,
        `lifecycle hook port must be an integer between ${LIFECYCLE_HOOK_PORT_MIN} and ${LIFECYCLE_HOOK_PORT_MAX}, got ${JSON.stringify(port)}`);
    }
  }
}
