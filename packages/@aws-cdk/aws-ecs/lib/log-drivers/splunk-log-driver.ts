import { GenericLogDriver } from "./generic-log-driver"

/**
 * The configuration to use when creating a splunk log driver.
 */
export interface SplunkLogDriverProps {
  /**
   * The configuration options to send to the log driver.
   */
  [key: string]: string;
}

/**
 * A log driver that sends logs to splunk.
 */
export class SplunkLogDriver extends GenericLogDriver {
  /**
   * Constructs a new instance of the SplunkLogDriver class.
   *
   * @param options the splunk log driver configuration options.
   */
  constructor(options?: SplunkLogDriverProps) {
    super({ logDriver: 'splunk', options })
  }
}
