import { Duration } from '@aws-cdk/core';
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
 * Common properties of traffic shifting routing configurations
 */
export interface BaseTrafficShiftingConfigProps {
  /**
   * The amount of time between traffic shifts.
   */
  readonly interval: Duration;

  /**
   * The percentage to increase traffic on each traffic shift.
   */
  readonly percentage: number;
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
 * Construction properties for {@link TimeBasedCanaryTrafficRoutingConfig}.
 */
export interface TimeBasedCanaryTrafficRoutingConfigProps extends BaseTrafficShiftingConfigProps {}

/**
 * Define a traffic routing config of type 'TimeBasedCanary'.
 */
export class TimeBasedCanaryTrafficRoutingConfig implements ITrafficRoutingConfig {
  /**
   * The amount of time between additional traffic shifts.
   */
  readonly interval: Duration;
  /**
   * The percentage to increase traffic on each traffic shift.
   */
  readonly percentage: number;

  constructor(props: TimeBasedCanaryTrafficRoutingConfigProps) {
    this.interval = props.interval;
    this.percentage = props.percentage;
  }

  /**
   * Render a TrafficRoutingConfigProperty of type `TimeBasedCanary`.
   */
  renderTrafficRoutingConfig(): CfnDeploymentConfig.TrafficRoutingConfigProperty {
    return {
      type: 'TimeBasedCanary',
      timeBasedCanary: {
        canaryInterval: this.interval.toMinutes(),
        canaryPercentage: this.percentage,
      },
    };
  }
}

/**
 * Construction properties for {@link TimeBasedLinearTrafficRoutingConfig}.
 */
export interface TimeBasedLinearTrafficRoutingConfigProps extends BaseTrafficShiftingConfigProps {}

/**
 * Define a traffic routing config of type 'TimeBasedLinear'.
 */
export class TimeBasedLinearTrafficRoutingConfig implements ITrafficRoutingConfig {
  /**
   * The amount of time between additional traffic shifts.
   */
  readonly interval: Duration;
  /**
   * The percentage to increase traffic on each traffic shift.
   */
  readonly percentage: number;

  constructor(props: TimeBasedLinearTrafficRoutingConfigProps) {
    this.interval = props.interval;
    this.percentage = props.percentage;
  }

  /**
   * Render a TrafficRoutingConfigProperty of type `TimeBasedLinear`.
   */
  renderTrafficRoutingConfig(): CfnDeploymentConfig.TrafficRoutingConfigProperty {
    return {
      type: 'TimeBasedLinear',
      timeBasedLinear: {
        linearInterval: this.interval.toMinutes(),
        linearPercentage: this.percentage,
      },
    };
  }
}
