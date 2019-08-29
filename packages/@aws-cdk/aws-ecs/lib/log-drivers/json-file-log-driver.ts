import { Construct } from '@aws-cdk/core';
import { BaseLogDriverProps } from './base-log-driver';
import { ContainerDefinition } from '../container-definition';
import { LogDriver, LogDriverConfig } from "./log-driver";
import { removeEmpty } from './utils'

/**
 * Specifies the json-file log driver configuration options.
 */
export interface JsonFileLogDriverProps extends BaseLogDriverProps {
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
  constructor(private readonly props: JsonFileLogDriverProps = {}) {
    super();
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    return {
      logDriver: 'json-file',
      options: removeEmpty({
        'max-size': this.props.maxSize,
        'max-file': this.props.maxFile,
        'compress': this.props.compress,
        'labels': this.props.labels,
        'env': this.props.env,
        'env-regex': this.props.envRegex
      }),
    };
  }
}
