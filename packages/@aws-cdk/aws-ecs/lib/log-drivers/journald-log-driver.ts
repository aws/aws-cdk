import { Construct } from '@aws-cdk/core';
import { BaseLogDriverProps } from './base-log-driver';
import { ContainerDefinition } from '../container-definition';
import { LogDriver, LogDriverConfig } from "./log-driver";
import { stringifyOptions } from './utils'

/**
 * Specifies the journald log driver configuration options.
 * 
 * [Source](https://docs.docker.com/config/containers/logging/journald/)
 */
export interface JournaldLogDriverProps extends BaseLogDriverProps {
  /**
   * Specify template to set CONTAINER_TAG and SYSLOG_IDENTIFIER value in
   * journald logs. Refer to log tag option documentation to customize the
   * log tag format.
   *
   * @default - No tag
   */
  readonly tag?: string;
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
        'tag': this.props.tag,
        'labels': this.props.labels,
        'env': this.props.env,
        'env-regex': this.props.envRegex
      }),
    };
  }
}
