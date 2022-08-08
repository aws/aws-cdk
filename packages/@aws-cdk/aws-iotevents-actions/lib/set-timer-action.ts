import * as iotevents from '@aws-cdk/aws-iotevents';
import { Construct } from 'constructs';
import { TimerDuration } from './timer-duration';

/**
 * The action to create a timer with duration in seconds.
 */
export class SetTimerAction implements iotevents.IAction {
  /**
   * @param timerName the name of the timer
   * @param timerDuration the duration of the timer
   */
  constructor(
    private readonly timerName: string,
    private readonly timerDuration: TimerDuration,
  ) {
  }

  /**
   * @internal
   */
  public _bind(_scope: Construct, _options: iotevents.ActionBindOptions): iotevents.ActionConfig {
    return {
      configuration: {
        setTimer: {
          timerName: this.timerName,
          durationExpression: this.timerDuration._bind(),
        },
      },
    };
  }
}
