import { removeEmpty } from './aws-log-driver';
import { Construct } from '@aws-cdk/core';
import { ContainerDefinition } from '../container-definition';
import { LogDriver, LogDriverConfig } from "./log-driver";

/**
 * Specifies the journald log driver configuration options.
 */
export interface JournaldLogDriverProps {
  /**
   * Options for the log driver
   *
   * @default - No options.
   */
  readonly options?: { [key: string]: any };
}

/**
 * A log driver that sends log information to journald.
 */
export class JournaldLogDriver extends LogDriver {
  /**
   * The log driver options.
   */
  public options?: { [key: string]: any };

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
    if (this.props) {
      this.options = this.props.options || {};
    } else {
      this.options = {};
    }

    return {
      logDriver: 'journald',
      options: removeEmpty(this.options),
    };
  }
}
