import * as iotevents from '@aws-cdk/aws-iotevents';
import { Construct } from 'constructs';

/**
 * The action to delete an existing timer.
 */
export class ClearTimerAction implements iotevents.IAction {
  /**
   * @param timerName the name of the timer
   */
  constructor(private readonly timerName: string) {}

  bind(_scope: Construct, _options: iotevents.ActionBindOptions): iotevents.ActionConfig {
    return {
      configuration: {
        clearTimer: {
          timerName: this.timerName,
        },
      },
    };
  }
}
