import { GenericLogDriver } from "./generic-log-driver";

/**
 * The configuration to use when creating a gelf log driver.
 */
export interface GelfLogDriverProps {
  /**
   * The configuration options to send to the log driver.
   */
  [key: string]: string;
}

/**
 * A log driver that sends logs to gelf.
 */
export class GelfLogDriver extends GenericLogDriver {
  /**
   * Constructs a new instance of the GelfLogDriver class.
   *
   * @param options the gelf log driver configuration options.
   */
  constructor(options?: GelfLogDriverProps) {
    super({ logDriver: 'gelf', options });
  }
}
