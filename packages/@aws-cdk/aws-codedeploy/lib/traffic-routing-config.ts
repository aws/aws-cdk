import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDeploymentConfig } from './codedeploy.generated';

/**
 * Represents the structure to pass into the underlying CfnDeploymentConfig class.
 */
export interface TrafficRoutingConfig {
  /**
   * represents the underlying traffic routing config structure
   */
  readonly config: CfnDeploymentConfig.TrafficRoutingConfigProperty;
}

/**
 * Represents how traffic is shifted during a CodeDeploy deployment.
 */
export abstract class TrafficRouting {
  /**
   * Shifts 100% of traffic in a single shift.
   */
  public static allAtOnce(): AllAtOnceTrafficRouting {
    return new AllAtOnceTrafficRouting();
  }

  /**
   * Shifts a specified percentage of traffic, waits for a specified amount of time, then shifts the rest of traffic.
   */
  public static timeBasedCanary(props: TimeBasedCanaryTrafficRoutingProps): TrafficRouting {
    return new TimeBasedCanaryTrafficRouting(props);
  }

  /**
   * Keeps shifting a specified percentage of traffic until reaching 100%, waiting for a specified amount of time in between each traffic shift.
   */
  public static timeBasedLinear(props: TimeBasedLinearTrafficRoutingProps): TrafficRouting {
    return new TimeBasedLinearTrafficRouting(props);
  }

  /**
   * Returns the traffic routing configuration.
   */
  public abstract bind(scope: Construct): TrafficRoutingConfig;
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
export class AllAtOnceTrafficRouting extends TrafficRouting {
  constructor() {
    super();
  }

  /**
   * Return a TrafficRoutingConfig of type `AllAtOnce`.
   */
  bind(_scope: Construct): TrafficRoutingConfig {
    return {
      config: {
        type: 'AllAtOnce',
      },
    };
  }
}

/**
 * Construction properties for {@link TimeBasedCanaryTrafficRouting}.
 */
export interface TimeBasedCanaryTrafficRoutingProps extends BaseTrafficShiftingConfigProps {}

/**
 * Define a traffic routing config of type 'TimeBasedCanary'.
 */
export class TimeBasedCanaryTrafficRouting extends TrafficRouting {
  /**
   * The amount of time between additional traffic shifts.
   */
  readonly interval: Duration;
  /**
   * The percentage to increase traffic on each traffic shift.
   */
  readonly percentage: number;

  constructor(props: TimeBasedCanaryTrafficRoutingProps) {
    super();
    this.interval = props.interval;
    this.percentage = props.percentage;
  }

  /**
   * Return a TrafficRoutingConfig of type `TimeBasedCanary`.
   */
  bind(_scope: Construct): TrafficRoutingConfig {
    return {
      config: {
        type: 'TimeBasedCanary',
        timeBasedCanary: {
          canaryInterval: this.interval.toMinutes(),
          canaryPercentage: this.percentage,
        },
      },
    };
  }
}

/**
 * Construction properties for {@link TimeBasedLinearTrafficRouting}.
 */
export interface TimeBasedLinearTrafficRoutingProps extends BaseTrafficShiftingConfigProps {}

/**
 * Define a traffic routing config of type 'TimeBasedLinear'.
 */
export class TimeBasedLinearTrafficRouting extends TrafficRouting {
  /**
   * The amount of time between additional traffic shifts.
   */
  readonly interval: Duration;
  /**
   * The percentage to increase traffic on each traffic shift.
   */
  readonly percentage: number;

  constructor(props: TimeBasedLinearTrafficRoutingProps) {
    super();
    this.interval = props.interval;
    this.percentage = props.percentage;
  }

  /**
   * Return a TrafficRoutingConfig of type `TimeBasedLinear`.
   */
  bind(_scope: Construct): TrafficRoutingConfig {
    return {
      config: {
        type: 'TimeBasedLinear',
        timeBasedLinear: {
          linearInterval: this.interval.toMinutes(),
          linearPercentage: this.percentage,
        },
      },
    };
  }
}
