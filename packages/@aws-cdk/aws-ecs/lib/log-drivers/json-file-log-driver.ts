import { GenericLogDriver } from "./generic-log-driver"

/**
 * The configuration to use when creating a json-file log driver.
 */
export interface JsonFileLogDriverProps {
  /**
   * The configuration options to send to the log driver.
   */
  [key: string]: string;
}

/**
 * A log driver that sends logs to json-file.
 */
export class JsonFileLogDriver extends GenericLogDriver {
  /**
   * Constructs a new instance of the JsonFileLogDriver class.
   *
   * @param options the json-file log driver configuration options.
   */
  constructor(options?: JsonFileLogDriverProps) {
    super({ logDriver: 'json-file', options })
  }
}
