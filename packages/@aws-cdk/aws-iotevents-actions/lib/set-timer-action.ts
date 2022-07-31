import * as iotevents from '@aws-cdk/aws-iotevents';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Configuration properties of an action to set a timer.
 */
export interface SetTimerActionProps {
  /**
   * The duration of the timer, in seconds. One of `duration` or `durationExpression` is required.
   *
   * The range of the duration is 60-31622400 seconds.
   * The evaluated result of the duration expression is rounded down to the nearest whole number.
   * For example, if you set the timer to 60.99 seconds, the evaluated result of the duration expression is 60 seconds.
   *
   * @default - none, required if no `durationExpression` is defined.
   */
  readonly duration?: cdk.Duration;

  /**
   * The duration of the timer, in seconds. One of `duration` or `durationExpression` is required.
   *
   * You can use a string expression that includes numbers, variables ($variable.<variable-name>),
   * and input values ($input.<input-name>.<path-to-datum>) as the duration.
   *
   * The range of the duration is 60-31622400 seconds.
   * The evaluated result of the duration expression is rounded down to the nearest whole number.
   * For example, if you set the timer to 60.99 seconds, the evaluated result of the duration expression is 60 seconds.
   *
   * @default - none, required if no `duration` is defined.
   */
  readonly durationExpression?: iotevents.Expression;
}

/**
 * The action to create a timer with duration in seconds.
 */
export class SetTimerAction implements iotevents.IAction {
  private readonly durationExpression: string | undefined;

  /**
   * @param timerName the name of the timer
   * @param props the properties to set duration
   */
  constructor(private readonly timerName: string, props: SetTimerActionProps) {
    if (!props.duration && !props.durationExpression) {
      throw new Error('Either duration or durationExpression must be specified');
    }
    if (props.duration && props.durationExpression) {
      throw new Error('duration and durationExpression cannot be specified at the same time');
    }
    if (props.duration) {
      const seconds = props.duration.toSeconds();
      if (seconds < 60) {
        throw new Error(`duration cannot be less than 60 seconds, got: ${props.duration.toString()}`);
      }
      if (seconds > 31622400) {
        throw new Error(`duration cannot be greater than 31622400 seconds, got: ${props.duration.toString()}`);
      }
      this.durationExpression = seconds.toString();
    }
    if (props.durationExpression) {
      this.durationExpression = props.durationExpression.evaluate();
    }
  }

  bind(_scope: Construct, _options: iotevents.ActionBindOptions): iotevents.ActionConfig {
    return {
      configuration: {
        setTimer: {
          timerName: this.timerName,
          durationExpression: this.durationExpression,
        },
      },
    };
  }
}
