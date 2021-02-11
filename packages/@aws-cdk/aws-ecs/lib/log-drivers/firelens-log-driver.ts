import { Construct } from 'constructs';
import { ContainerDefinition } from '../container-definition';
import { BaseLogDriverProps } from './base-log-driver';
import { LogDriver, LogDriverConfig } from './log-driver';
import { removeEmpty } from './utils';

/**
 * Specifies the firelens log driver configuration options.
 */
export interface FireLensLogDriverProps extends BaseLogDriverProps {
  /**
   * The configuration options to send to the log driver.
   * @default - the log driver options
   */
  readonly options?: { [key: string]: string };
}

/**
 * FireLens enables you to use task definition parameters to route logs to an AWS service
 *  or AWS Partner Network (APN) destination for log storage and analytics
 */
export class FireLensLogDriver extends LogDriver {
  /**
   * The configuration options to send to the log driver.
   * @default - the log driver options
   */
  private options?: { [key: string]: string };

  /**
   * Constructs a new instance of the FireLensLogDriver class.
   * @param props the awsfirelens log driver configuration options.
   */
  constructor(props: FireLensLogDriverProps) {
    super();

    this.options = props.options;
  }

  /**
   * Called when the log driver is configured on a container
   */
  public bind(_scope: Construct, _containerDefinition: ContainerDefinition): LogDriverConfig {
    return {
      logDriver: 'awsfirelens',
      ...(this.options && { options: removeEmpty(this.options) }),
    };
  }
}
