import { GenericLogDriver } from "./generic-log-driver"

/**
 * The configuration to use when creating a journald log driver.
 */
export interface JournaldLogDriverProps {
  /**
   * The configuration options to send to the log driver.
   */
  [key: string]: string;
}

/**
 * A log driver that sends logs to journald.
 */
export class JournaldLogDriver extends GenericLogDriver {
  /**
   * Constructs a new instance of the JournaldLogDriver class.
   *
   * @param options the journald log driver configuration options.
   */
  constructor(options?: JournaldLogDriverProps) {
    super({ logDriver: 'journald', options })
  }
}
