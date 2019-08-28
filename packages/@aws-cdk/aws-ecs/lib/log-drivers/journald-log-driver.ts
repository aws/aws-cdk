import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { LogDriver, LogDriverConfig } from "./log-driver";

/**
 * Specifies the journald log driver configuration options.
 */
export interface JournaldLogDriverProps {
  /**
   * The tag log option specifies how to format a tag that identifies the container’s
   * log messages.
   *
   * @default - No tag
   */
  readonly tag?: string;

  /**
   * Comma-separated list of keys of labels, which should be included in message, if
   * these labels are specified for the container.
   *
   * @default - No labels
   */
  readonly labels?: string;

  /**
   * Comma-separated list of keys of environment variables, which should be included in
   * message, if these variables are specified for the container.
   *
   * @default - No env
   */
  readonly env?: string;

  /**
   * Similar to and compatible with env. A regular expression to match logging-related
   * environment variables. Used for advanced log tag options.
   *
   * @default - No envRegex
   */
  readonly envRegex?: string;
}

/**
 * A log driver that sends log information to journald Logs.
 */
export class JournaldLogDriver extends LogDriver {
  /**
   * Constructs a new instance of the JournaldLogDriver class.
   *
   * @param props the journald log driver configuration options.
   */
  constructor(private readonly props?: JournaldLogDriverProps) {
    super();
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    const options = this.props ? {
      'tag': this.props.tag,
      'labels': this.props.labels,
      'env': this.props.env,
      'env-regex': this.props.envRegex
    } : {};

    return {
      logDriver: 'journald',
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
