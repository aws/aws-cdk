import { GenericLogDriver } from "./generic-log-driver"

/**
 * The configuration to use when creating a syslog log driver.
 */
export interface SyslogLogDriverProps {
  /**
   * The configuration options to send to the log driver.
   */
  [key: string]: string;
}

/**
 * A log driver that sends logs to syslog.
 */
export class SyslogLogDriver extends GenericLogDriver {
  /**
   * Constructs a new instance of the SyslogLogDriver class.
   *
   * @param options the syslog log driver configuration options.
   */
  constructor(options?: SyslogLogDriverProps) {
    super({ logDriver: 'syslog', options })
  }
}
