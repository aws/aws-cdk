import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BaseLogDriverProps } from './base-log-driver';
import { LogDriver, LogDriverConfig } from './log-driver';
import { ensureInRange, ensurePositiveInteger, renderCommonLogDriverOptions, stringifyOptions } from './utils';
import { ContainerDefinition } from '../container-definition';

/**
 * The type of compression the GELF driver uses to compress each log message.
 */
export enum GelfCompressionType {
  GZIP = 'gzip',
  ZLIB = 'zlib',
  NONE = 'none'
}

/**
 * Specifies the journald log driver configuration options.
 *
 * [Source](https://docs.docker.com/config/containers/logging/gelf/)
 */
export interface GelfLogDriverProps extends BaseLogDriverProps {
  /**
   * The address of the GELF server. tcp and udp are the only supported URI
   * specifier and you must specify the port.
   */
  readonly address: string;

  /**
   * UDP Only The type of compression the GELF driver uses to compress each
   * log message. Allowed values are gzip, zlib and none.
   *
   * @default - gzip
   */
  readonly compressionType?: GelfCompressionType;

  /**
   * UDP Only The level of compression when gzip or zlib is the gelf-compression-type.
   * An integer in the range of -1 to 9 (BestCompression). Higher levels provide more
   * compression at lower speed. Either -1 or 0 disables compression.
   *
   * @default - 1
   */
  readonly compressionLevel?: number;

  /**
   * TCP Only The maximum number of reconnection attempts when the connection drop.
   * A positive integer.
   *
   * @default - 3
   */
  readonly tcpMaxReconnect?: number;

  /**
   * TCP Only The number of seconds to wait between reconnection attempts.
   * A positive integer.
   *
   * @default - 1
   */
  readonly tcpReconnectDelay?: Duration;
}

/**
 * A log driver that sends log information to journald Logs.
 */
export class GelfLogDriver extends LogDriver {
  /**
   * Constructs a new instance of the GelfLogDriver class.
   *
   * @param props the gelf log driver configuration options.
   */
  constructor(private readonly props: GelfLogDriverProps) {
    super();

    // Validation
    if (props.compressionLevel) {
      ensureInRange(props.compressionLevel, -1, 9);
    }

    if (props.tcpMaxReconnect) {
      ensurePositiveInteger(props.tcpMaxReconnect);
    }
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    return {
      logDriver: 'gelf',
      options: stringifyOptions({
        'gelf-address': this.props.address,
        'gelf-compression-type': this.props.compressionType,
        'gelf-compression-level': this.props.compressionLevel,
        'gelf-tcp-max-reconnect': this.props.tcpMaxReconnect,
        'gelf-tcp-reconnect-delay': this.props.tcpReconnectDelay && this.props.tcpReconnectDelay.toSeconds(),
        ...renderCommonLogDriverOptions(this.props),
      }),
    };
  }
}
