import type { Construct } from 'constructs';
import type { LogDriverConfig } from './log-driver';
import { LogDriver } from './log-driver';
import type { ContainerDefinition } from '../container-definition';

/**
 * A log driver that sets the log driver to `none` (no logs collected).
 */
export class NoneLogDriver extends LogDriver {
  /**
   * Constructs a new instance of the NoneLogDriver class.
   */
  constructor() {
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
