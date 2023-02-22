import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BaseLogDriverProps } from './base-log-driver';
import { LogDriver, LogDriverConfig } from './log-driver';
import { renderCommonLogDriverOptions, stringifyOptions } from './utils';
import { ContainerDefinition } from '../container-definition';

/**
 * Specifies the fluentd log driver configuration options.
 *
 * [Source](https://docs.docker.com/config/containers/logging/fluentd/)
 */
export interface FluentdLogDriverProps extends BaseLogDriverProps {
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
   * the connection is established.
   *
   * @default - false
   */
  readonly asyncConnect?: boolean;

  /**
   * The amount of data to buffer before flushing to disk.
   *
   * @default - The amount of RAM available to the container.
   */
  readonly bufferLimit?: number;

  /**
   * How long to wait between retries.
   *
   * @default - 1 second
   */
  readonly retryWait?: Duration;

  /**
   * The maximum number of retries.
   *
   * @default - 4294967295 (2**32 - 1).
   */
  readonly maxRetries?: number;

  /**
   * Generates event logs in nanosecond resolution.
   *
   * @default - false
   */
  readonly subSecondPrecision?: boolean;
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
  constructor(private readonly props: FluentdLogDriverProps = {}) {
    super();
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    return {
      logDriver: 'fluentd',
      options: stringifyOptions({
        'fluentd-address': this.props.address,
        'fluentd-async-connect': this.props.asyncConnect,
        'fluentd-buffer-limit': this.props.bufferLimit,
        'fluentd-retry-wait': this.props.retryWait && this.props.retryWait.toSeconds(),
        'fluentd-max-retries': this.props.maxRetries,
        'fluentd-sub-second-precision': this.props.subSecondPrecision,
        ...renderCommonLogDriverOptions(this.props),
      }),
    };
  }
}
