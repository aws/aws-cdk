import { GenericLogDriver } from "./generic-log-driver"

/**
 * The configuration to use when creating a fluentd log driver.
 */
export interface FluentdLogDriverProps {
  /**
   * The configuration options to send to the log driver.
   */
  [key: string]: string;
}

/**
 * A log driver that sends logs to fluentd.
 */
export class FluentdLogDriver extends GenericLogDriver {
  /**
   * Constructs a new instance of the FluentdLogDriver class.
   *
   * @param options the fluentd log driver configuration options.
   */
  constructor(options?: FluentdLogDriverProps) {
    super({ logDriver: 'fluentd', options })
  }
}
