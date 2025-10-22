import { Construct } from 'constructs';
import { LogDriver, LogDriverConfig } from './log-driver';
import { ContainerDefinition } from '../container-definition';
import { BaseLogDriverProps } from './base-log-driver';

/**
 * A log driver that disables logging for the container (Docker `none` driver).
 *
 * [Source](https://docs.docker.com/config/containers/logging/configure/#supported-logging-drivers)
 */
export interface NoneLogDriverProps extends BaseLogDriverProps {}

/**
 * A log driver that sets the log driver to `none` (no logs collected).
 */
export class NoneLogDriver extends LogDriver {
  /**
   * Constructs a new instance of the NoneLogDriver class.
   *
   * @param _props no configuration options are supported for the `none` driver.
   */
  constructor(_props: NoneLogDriverProps = {}) {
    super();
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    return {
      logDriver: 'none',
      // Intentionally no options for the `none` driver
    };
  }
}


