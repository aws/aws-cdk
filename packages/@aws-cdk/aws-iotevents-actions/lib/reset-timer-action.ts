import * as iotevents from '@aws-cdk/aws-iotevents';
import { Construct } from 'constructs';

/**
 * The action to reset an existing timer.
 */
export class ResetTimerAction implements iotevents.IAction {
  /**
   * @param timerName the name of the timer
   */
  constructor(private readonly timerName: string) {}

  bind(_scope: Construct, _options: iotevents.ActionBindOptions): iotevents.ActionConfig {
    return {
      configuration: {
        resetTimer: {
          timerName: this.timerName,
        },
      },
    };
  }
}
