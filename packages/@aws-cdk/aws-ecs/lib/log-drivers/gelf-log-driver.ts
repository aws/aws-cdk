import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { LogDriver, LogDriverConfig } from "./log-driver";
import { removeEmpty } from './utils'

/**
 * Specifies the journald log driver configuration options.
 */
export interface GelfLogDriverProps {
  /**
   * The address of the GELF server. tcp and udp are the only supported URI
   * specifier and you must specify the port.
   */
  readonly address: string;

  /**
   * UDP Only The type of compression the GELF driver uses to compress each
   * log message. Allowed values are gzip, zlib and none.
   *
   * @default - compressionType not set
   */
  readonly compressionType?: string;

  /**
   * UDP Only The level of compression when gzip or zlib is the gelf-compression-type.
   * An integer in the range of -1 to 9 (BestCompression). Higher levels provide more
   * compression at lower speed. Either -1 or 0 disables compression.
   *
   * @default - compressionLevel not set
   */
  readonly compressionLevel?: number;

  /**
   * TCP Only The maximum number of reconnection attempts when the connection drop.
   * A positive integer.
   *
   * @default - tcpMaxReconnect not set
   */
  readonly tcpMaxReconnect?: number;

  /**
   * TCP Only The number of seconds to wait between reconnection attempts.
   * A positive integer.
   *
   * @default - tcpReconnectDelay not set
   */
  readonly tcpReconnectDelay?: number;

  /**
   * A string that is appended to the APP-NAME in the gelf message. By default,
   * Docker uses the first 12 characters of the container ID to tag log messages.
   * Refer to the log tag option documentation for customizing the log tag format.
   *
   * @default - tag not set
   */
  readonly tag?: string;

  /**
   * Applies when starting the Docker daemon. A comma-separated list of logging-related
   * labels this daemon accepts. Adds additional key on the extra fields, prefixed by
   * an underscore (_). Used for advanced log tag options.
   *
   * @default - labels not set
   */
  readonly labels?: string;

  /**
   * Applies when starting the Docker daemon. A comma-separated list of logging-related
   * environment variables this daemon accepts. Adds additional key on the extra fields,
   * prefixed by an underscore (_). Used for advanced log tag options.
   *
   * @default - env not set
   */
  readonly env?: string;

  /**
   * Similar to and compatible with env. A regular expression to match logging-related
   * environment variables. Used for advanced log tag options.
   *
   * @default - envRegex not set
   */
  readonly envRegex?: string;
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
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    return {
      logDriver: 'gelf',
      options: removeEmpty({
        'gelf-address': this.props.address,
        'gelf-compression-type': this.props.compressionType,
        'gelf-compression-level': this.props.compressionLevel,
        'gelf-tcp-max-reconnect': this.props.tcpMaxReconnect,
        'gelf-tcp-reconnect-delay': this.props.tcpReconnectDelay,
        'tag': this.props.tag,
        'labels': this.props.labels,
        'env': this.props.env,
        'env-regex': this.props.envRegex
      }),
    };
  }
}
