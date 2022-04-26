import { ContainerDefinition } from '../container-definition';
import { BaseLogDriverProps } from './base-log-driver';
import { LogDriver, LogDriverConfig } from './log-driver';
import { renderCommonLogDriverOptions, stringifyOptions } from './utils';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';

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
  public bind(_scope: CoreConstruct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    return {
      logDriver: 'journald',
      options: stringifyOptions({
        ...renderCommonLogDriverOptions(this.props),
      }),
    };
  }
}
