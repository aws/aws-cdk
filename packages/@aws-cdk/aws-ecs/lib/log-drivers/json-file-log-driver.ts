import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { LogDriver, LogDriverConfig } from "./log-driver";

/**
 * Specifies the json-file log driver configuration options.
 */
export interface JsonFileLogDriverProps {
  /**
   * The maximum size of the log before it is rolled. A positive integer plus a modifier
   * representing the unit of measure (k, m, or g). Defaults to -1 (unlimited).
   *
   * @default - maxSize not set
   */
  readonly maxSize?: string;

  /**
   * The maximum number of log files that can be present. If rolling the logs creates
   * excess files, the oldest file is removed. Only effective when max-size is also set.
   * A positive integer. Defaults to 1.
   *
   * @default - maxFile not set
   */
  readonly maxFile?: string;

  /**
   * Toggles compression for rotated logs. Default is disabled.
   *
   * @default - compress not set
   */
  readonly compress?: boolean;

  /**
   * Applies when starting the Docker daemon. A comma-separated list of logging-related
   * labels this daemon accepts. Used for advanced log tag options.
   *
   * @default - labels not set
   */
  readonly labels?: string;

  /**
   * Applies when starting the Docker daemon. A comma-separated list of logging-related
   * environment variables this daemon accepts. Used for advanced log tag options.
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
 * A log driver that sends log information to json-file Logs.
 */
export class JsonFileLogDriver extends LogDriver {
  /**
   * Constructs a new instance of the JsonFileLogDriver class.
   *
   * @param props the json-file log driver configuration options.
   */
  constructor(private readonly props?: JsonFileLogDriverProps) {
    super();
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    const options = this.props ? {
      'max-size': this.props.maxSize,
      'max-file': this.props.maxFile,
      'compress': this.props.compress,
      'labels': this.props.labels,
      'env': this.props.env,
      'env-regex': this.props.envRegex
    } : {};

    return {
      logDriver: 'json-file',
      options: removeEmpty(options),
    };
  }
}

/**
 * Remove undefined values from a dictionary
 */
function removeEmpty<T>(x: { [key: string]: (T | undefined | string) }): { [key: string]: string } {
    for (const key of Object.keys(x)) {
      if (!x[key]) {
        delete x[key];
      } else {
        x[key] = x[key] + '';
      }
    }
    return x as any;
}
