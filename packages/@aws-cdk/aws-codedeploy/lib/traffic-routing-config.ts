import { CfnDeploymentConfig } from './codedeploy.generated';

/**
 * Interface for traffic routing configs.
 */
export interface ITrafficRoutingConfig {
  /**
   * Abstract method on interface for subclasses to implement to render themselves as a TrafficRoutingConfigProperty.
   */
  renderTrafficRoutingConfig(): CfnDeploymentConfig.TrafficRoutingConfigProperty
}

/**
 * Define a traffic routing config of type 'AllAtOnce'.
 */
export class AllAtOnceTrafficRoutingConfig implements ITrafficRoutingConfig {
  constructor() {}

  /**
   * Render a TrafficRoutingConfigProperty of type `AllAtOnce`.
   */
  renderTrafficRoutingConfig(): CfnDeploymentConfig.TrafficRoutingConfigProperty {
    return {
      type: 'AllAtOnce',
    };
  }
}

/**
 * Define a traffic routing config of type 'TimeBasedCanary'.
 */
export class TimeBasedCanaryTrafficRoutingConfig implements ITrafficRoutingConfig {
  /**
   * The amount of time between additional traffic shifts.
   */
  readonly interval: number;
  /**
   * The percentage to increase traffic on each traffic shift.
   */
  readonly percentage: number;

  constructor(interval: number, percentage: number) {
    this.interval = interval;
    this.percentage = percentage;
  }

  /**
   * Render a TrafficRoutingConfigProperty of type `TimeBasedCanary`.
   */
  renderTrafficRoutingConfig(): CfnDeploymentConfig.TrafficRoutingConfigProperty {
    return {
      type: 'TimeBasedCanary',
      timeBasedCanary: {
        canaryInterval: this.interval,
        canaryPercentage: this.percentage,
      },
    };
  }
}

/**
 * Define a traffic routing config of type 'TimeBasedLinear'.
 */
export class TimeBasedLinearTrafficRoutingConfig implements ITrafficRoutingConfig {
  /**
   * The amount of time between additional traffic shifts.
   */
  readonly interval: number;
  /**
   * The percentage to increase traffic on each traffic shift.
   */
  readonly percentage: number;

  constructor(interval: number, percentage: number) {
    this.interval = interval;
    this.percentage = percentage;
  }

  /**
   * Render a TrafficRoutingConfigProperty of type `TimeBasedLinear`.
   */
  renderTrafficRoutingConfig(): CfnDeploymentConfig.TrafficRoutingConfigProperty {
    return {
      type: 'TimeBasedLinear',
      timeBasedLinear: {
        linearInterval: this.interval,
        linearPercentage: this.percentage,
      },
    };
  }
}
