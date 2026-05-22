
/******************************************************************************
 *                                 Enums
 *****************************************************************************/

import type { CfnRuntime } from '../../../aws-bedrockagentcore';
import { Token } from '../../../core';
import type { Duration } from '../../../core';
import { UnscopedValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/helpers-internal';
import { validateStringFieldLength, validateFieldPattern } from '../common/validation-helpers';

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

/******************************************************************************
 *                          Filesystem configurations
 *****************************************************************************/

const MOUNT_PATH_PATTERN = /^\/mnt\/[a-zA-Z0-9._-]+\/?$/;
const MOUNT_PATH_MIN = 6;
const MOUNT_PATH_MAX = 200;

/**
 * Validates a mount path against the AgentCore service constraints. Skips
 * validation for tokenized values.
 *
 * @internal
 */
export function validateMountPath(value: string, fieldName: string): string[] {
  if (Token.isUnresolved(value)) {
    return [];
  }
  return [
    ...validateStringFieldLength({
      value,
      fieldName,
      minLength: MOUNT_PATH_MIN,
      maxLength: MOUNT_PATH_MAX,
    }),
    ...validateFieldPattern(
      value,
      fieldName,
      MOUNT_PATH_PATTERN,
      `${fieldName} must be under /mnt with one subdirectory level (for example, /mnt/data)`,
    ),
  ];
}

/**
 * The kind of a `Filesystem` configuration. Used internally for validating
 * service-side limits on combinations.
 *
 * @internal
 */
export enum FilesystemKind {
  SESSION_STORAGE = 'sessionStorage',
}

/**
 * Result of binding a `Filesystem` to a Runtime.
 *
 * @internal
 */
export interface FilesystemBindResult {
  readonly kind: FilesystemKind;
  readonly mountPath: string;
  readonly cfnFilesystemConfiguration: CfnRuntime.FilesystemConfigurationProperty;
}

/**
 * Configuration for a filesystem mounted into the AgentCore Runtime.
 *
 * Use the static factories to create instances:
 * - `Filesystem.sessionStorage(mountPath)` - service-managed per-session
 *   storage that persists across stop/resume cycles. No VPC required.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-filesystem-configurations.html
 */
export abstract class Filesystem {
  /**
   * Configure managed session storage. Each session gets an isolated directory
   * at the configured mount path that persists across stop/resume cycles.
   *
   * @param mountPath The mount path inside the runtime container. Must be under
   *   `/mnt` with one subdirectory level (for example, `/mnt/workspace`).
   *
   * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-filesystem-configurations.html
   */
  public static sessionStorage(mountPath: string): Filesystem {
    return new SessionStorageFilesystem(mountPath);
  }

  /**
   * Bind this filesystem configuration to the Runtime that consumes it.
   *
   * @internal
   */
  public abstract _bind(): FilesystemBindResult;
}

class SessionStorageFilesystem extends Filesystem {
  constructor(private readonly mountPath: string) {
    super();
  }

  public _bind(): FilesystemBindResult {
    const errors = validateMountPath(this.mountPath, 'Session storage mount path');
    if (errors.length > 0) {
      throw new UnscopedValidationError(lit`InvalidFilesystem`, errors.join('\n'));
    }
    return {
      kind: FilesystemKind.SESSION_STORAGE,
      mountPath: this.mountPath,
      cfnFilesystemConfiguration: {
        sessionStorage: { mountPath: this.mountPath },
      },
    };
  }
}
