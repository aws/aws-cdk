import { Construct } from 'constructs';
import { BaseLogDriverProps } from './base-log-driver';
import { LogDriver, LogDriverConfig } from './log-driver';
import { renderCommonLogDriverOptions, stringifyOptions } from './utils';
import { ContainerDefinition } from '../container-definition';

/**
 * Specifies the journald log driver configuration options.
 *
 * [Source](https://docs.docker.com/config/containers/logging/journald/)
 */
export interface JournaldLogDriverProps extends BaseLogDriverProps {}

/**
 * A log driver that sends log information to journald Logs.
 */
export class JournaldLogDriver extends LogDriver {
  /**
   * Constructs a new instance of the JournaldLogDriver class.
   *
   * @param props the journald log driver configuration options.
   */
  constructor(private readonly props: JournaldLogDriverProps = {}) {
    super();
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    return {
      logDriver: 'journald',
      options: stringifyOptions({
        ...renderCommonLogDriverOptions(this.props),
      }),
    };
  }
}
