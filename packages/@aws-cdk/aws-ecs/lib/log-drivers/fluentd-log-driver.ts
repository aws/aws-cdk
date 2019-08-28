import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { LogDriver, LogDriverConfig } from "./log-driver";

/**
 * Specifies the fluentd log driver configuration options.
 */
export interface FluentdLogDriverProps {
  /**
   * By default, the logging driver connects to localhost:24224. Supply the
   * address option to connect to a different address. tcp(default) and unix
   * sockets are supported.
   *
   * @default - address not set.
   */
  readonly address?: string;

  /**
   * Docker connects to Fluentd in the background. Messages are buffered until
   * the connection is established. Defaults to false.
   *
   * @default - asyncConnect not set.
   */
  readonly asyncConnect?: boolean;

  /**
   * The amount of data to buffer before flushing to disk. Defaults to the amount
   * of RAM available to the container.
   *
   * @default - bufferLimit not set.
   */
  readonly bufferLimit?: number;

  /**
   * How long to wait between retries. Defaults to 1 second.
   *
   * @default - retryWait not set.
   */
  readonly retryWait?: number;

  /**
   * The maximum number of retries. Defaults to 4294967295 (2**32 - 1).
   *
   * @default - maxRetries not set.
   */
  readonly maxRetries?: number;

  /**
   * Generates event logs in nanosecond resolution. Defaults to false.
   *
   * @default - subSecondPrecision not set.
   */
  readonly subSecondPrecision?: boolean;

  /**
   * By default, Docker uses the first 12 characters of the container ID to tag
   * log messages. Refer to the log tag option documentation for customizing the
   * log tag format.
   *
   * @default - No tag
   */
  readonly tag?: string;

  /**
   * The labels option takes a comma-separated list of keys. If there is collision
   * between label and env keys, the value of the env takes precedence. Adds additional
   * fields to the extra attributes of a logging message.
   *
   * @default - No labels
   */
  readonly labels?: string;

  /**
   * The env option takes a comma-separated list of keys. If there is collision between
   * label and env keys, the value of the env takes precedence. Adds additional fields
   * to the extra attributes of a logging message.
   *
   * @default - No env
   */
  readonly env?: string;

  /**
   * The env-regex option is similar to and compatible with env. Its value is a regular
   * expression to match logging-related environment variables. It is used for advanced
   * log tag options.
   *
   * @default - No envRegex
   */
  readonly envRegex?: string;
}

/**
 * A log driver that sends log information to journald Logs.
 */
export class FluentdLogDriver extends LogDriver {
  /**
   * Constructs a new instance of the FluentdLogDriver class.
   *
   * @param props the fluentd log driver configuration options.
   */
  constructor(private readonly props?: FluentdLogDriverProps) {
    super();
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    const options = this.props ? {
      'fluentd-address': this.props.address,
      'fluentd-async-connect': this.props.asyncConnect,
      'fluentd-buffer-limit': this.props.bufferLimit,
      'fluentd-retry-wait': this.props.retryWait,
      'fluentd-max-retries': this.props.maxRetries,
      'fluentd-sub-second-precision': this.props.subSecondPrecision,
      'tag': this.props.tag,
      'labels': this.props.labels,
      'env': this.props.env,
      'env-regex': this.props.envRegex
    } : {};

    return {
      logDriver: 'fluentd',
      options: removeEmpty(options),
    };
  }
}

/**
 * Remove undefined values from a dictionary
 */
function removeEmpty<T>(x: { [key: string]: (T | undefined | string) }): { [key: string]: string } {
  for (const key of Object.keys(x)) {
    if (!x[key]) {
      delete x[key];
    } else {
      x[key] = x[key] + '';
    }
  }
  return x as any;
}
