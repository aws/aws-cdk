import { ContainerDefinition } from '../container-definition';
import { BaseLogDriverProps } from './base-log-driver';
import { LogDriver, LogDriverConfig } from './log-driver';
import { renderCommonLogDriverOptions, stringifyOptions } from './utils';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Specifies the syslog log driver configuration options.
 *
 * [Source](https://docs.docker.com/config/containers/logging/syslog/)
 */
export interface SyslogLogDriverProps extends BaseLogDriverProps {
  /**
   * The address of an external syslog server. The URI specifier may be
   * [tcp|udp|tcp+tls]://host:port, unix://path, or unixgram://path.
   *
   * @default - If the transport is tcp, udp, or tcp+tls, the default port is 514.
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
   * daemon. Ignored if the address protocol is not tcp+tls.
   *
   * @default - false
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
}

/**
 * A log driver that sends log information to syslog Logs.
 */
export class SyslogLogDriver extends LogDriver {
  /**
   * Constructs a new instance of the SyslogLogDriver class.
   *
   * @param props the syslog log driver configuration options.
   */
  constructor(private readonly props: SyslogLogDriverProps = {}) {
    super();
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: CoreConstruct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    return {
      logDriver: 'syslog',
      options: stringifyOptions({
        'syslog-address': this.props.address,
        'syslog-facility': this.props.facility,
        'syslog-tls-ca-cert': this.props.tlsCaCert,
        'syslog-tls-cert': this.props.tlsCert,
        'syslog-tls-key': this.props.tlsKey,
        'syslog-tls-skip-verify': this.props.tlsSkipVerify,
        'syslog-format': this.props.format,
        ...renderCommonLogDriverOptions(this.props),
      }),
    };
  }
}
