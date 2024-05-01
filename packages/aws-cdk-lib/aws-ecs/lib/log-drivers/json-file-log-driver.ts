import { Construct } from 'constructs';
import { BaseLogDriverProps } from './base-log-driver';
import { LogDriver, LogDriverConfig } from './log-driver';
import { joinWithCommas, stringifyOptions } from './utils';
import { ContainerDefinition } from '../container-definition';

/**
 * Specifies the json-file log driver configuration options.
 *
 * [Source](https://docs.docker.com/config/containers/logging/json-file/)
 */
export interface JsonFileLogDriverProps extends BaseLogDriverProps {
  /**
   * The maximum size of the log before it is rolled. A positive integer plus a modifier
   * representing the unit of measure (k, m, or g).
   *
   * @default - -1 (unlimited)
   */
  readonly maxSize?: string;

  /**
   * The maximum number of log files that can be present. If rolling the logs creates
   * excess files, the oldest file is removed. Only effective when max-size is also set.
   * A positive integer.
   *
   * @default - 1
   */
  readonly maxFile?: number;

  /**
   * Toggles compression for rotated logs.
   *
   * @default - false
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

    // Validation
    if (props.maxFile && props.maxFile < 0) {
      throw new Error('`maxFile` must be a positive integer.');
    }
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    return {
      logDriver: 'json-file',
      options: stringifyOptions({
        'max-size': this.props.maxSize,
        'max-file': this.props.maxFile,
        'compress': this.props.compress,
        'labels': joinWithCommas(this.props.labels),
        'env': joinWithCommas(this.props.env),
        'env-regex': this.props.envRegex,
      }),
    };
  }
}
