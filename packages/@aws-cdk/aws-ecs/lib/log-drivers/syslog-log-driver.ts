import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { LogDriver, LogDriverConfig } from "./log-driver";
import { removeEmpty } from './utils'

/**
 * Specifies the syslog log driver configuration options.
 */
export interface SyslogLogDriverProps {
  /**
   * The address of an external syslog server. The URI specifier may be
   * [tcp|udp|tcp+tls]://host:port, unix://path, or unixgram://path. If
   * the transport is tcp, udp, or tcp+tls, the default port is 514.
   *
   * @default - address not set
   */
  readonly address?: string;

  /**
   * The syslog facility to use. Can be the number or name for any valid
   * syslog facility. See the syslog documentation:
   * https://tools.ietf.org/html/rfc5424#section-6.2.1.
   *
   * @default - facility not set
   */
  readonly facility?: string;

  /**
   * The absolute path to the trust certificates signed by the CA. Ignored
   * if the address protocol is not tcp+tls.
   *
   * @default - tlsCaCert not set
   */
  readonly tlsCaCert?: string;

  /**
   * The absolute path to the TLS certificate file. Ignored if the address
   * protocol is not tcp+tls.
   *
   * @default - tlsCert not set
   */
  readonly tlsCert?: string;

  /**
   * The absolute path to the TLS key file. Ignored if the address protocol
   * is not tcp+tls.
   *
   * @default - tlsKey not set
   */
  readonly tlsKey?: string;

  /**
   * If set to true, TLS verification is skipped when connecting to the syslog
   * daemon. Defaults to false. Ignored if the address protocol is not tcp+tls.
   *
   * @default - tlsSkipVerify not set
   */
  readonly tlsSkipVerify?: boolean;

  /**
   * The syslog message format to use. If not specified the local UNIX syslog
   * format is used, without a specified hostname. Specify rfc3164 for the RFC-3164
   * compatible format, rfc5424 for RFC-5424 compatible format, or rfc5424micro
   * for RFC-5424 compatible format with microsecond timestamp resolution.
   *
   * @default - format not set
   */
  readonly format?: string;

  /**
   * A string that is appended to the APP-NAME in the syslog message. By default,
   * Docker uses the first 12 characters of the container ID to tag log messages.
   * Refer to the log tag option documentation for customizing the log tag format.
   *
   * @default - tag not set
   */
  readonly tag?: string;

  /**
   * Applies when starting the Docker daemon. A comma-separated list of
   * logging-related labels this daemon accepts. Used for advanced log tag options.
   *
   * @default - labels not set
   */
  readonly labels?: string;

  /**
   * Applies when starting the Docker daemon. A comma-separated list of
   * logging-related environment variables this daemon accepts. Used for advanced
   * log tag options.
   *
   * @default - env not set
   */
  readonly env?: string;

  /**
   * Applies when starting the Docker daemon. Similar to and compatible with env.
   * A regular expression to match logging-related environment variables. Used for
   * advanced log tag options.
   *
   * @default - envRegex not set
   */
  readonly envRegex?: string;
}

/**
 * A log driver that sends log information to syslog Logs.
 */
export class SyslogLogDriver extends LogDriver {
  /**
   * Constructs a new instance of the FluentdLogDriver class.
   *
   * @param props the syslog log driver configuration options.
   */
  constructor(private readonly props?: SyslogLogDriverProps) {
    super();
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    const options = this.props ? {
      'syslog-address': this.props.address,
      'syslog-facility': this.props.facility,
      'syslog-tls-ca-cert': this.props.tlsCaCert,
      'syslog-tls-cert': this.props.tlsCert,
      'syslog-tls-key': this.props.tlsKey,
      'syslog-tls-skip-verify': this.props.tlsSkipVerify,
      'syslog-format': this.props.format,
      'tag': this.props.tag,
      'labels': this.props.labels,
      'env': this.props.env,
      'env-regex': this.props.envRegex
    } : {};

    return {
      logDriver: 'syslog',
      options: removeEmpty(options),
    };
  }
}
