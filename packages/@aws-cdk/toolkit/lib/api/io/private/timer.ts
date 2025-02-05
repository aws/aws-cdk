import { VALID_CODE } from './codes';
import { info } from './messages';
import { ActionAwareIoHost } from './types';
import { formatTime } from '../../aws-cdk';

/**
 * Helper class to measure the time of code.
 */
export class Timer {
  /**
   * Start the timer.
   * @return the timer instance
   */
  public static start(): Timer {
    return new Timer();
  }

  private readonly startTime: number;

  private constructor() {
    this.startTime = new Date().getTime();
  }

  /**
   * End the current timer.
   * @returns the elapsed time
   */
  public end() {
    const elapsedTime = new Date().getTime() - this.startTime;
    return {
      asMs: elapsedTime,
      asSec: formatTime(elapsedTime),
    };
  }

  /**
   * Ends the current timer as a specified timing and notifies the IoHost.
   * @returns the elapsed time
   */
  public async endAs(ioHost: ActionAwareIoHost, type: 'synth' | 'deploy' | 'rollback' | 'destroy') {
    const duration = this.end();
    const { code, text } = timerMessageProps(type);

    await ioHost.notify(info(`\n✨  ${text} time: ${duration.asSec}s\n`, code, {
      duration: duration.asMs,
    }));

    return duration;
  }
}

function timerMessageProps(type: 'synth' | 'deploy' | 'rollback'| 'destroy'): {
  code: VALID_CODE;
  text: string;
} {
  switch (type) {
    case 'synth': return { code: 'CDK_TOOLKIT_I1000', text: 'Synthesis' };
    case 'deploy': return { code: 'CDK_TOOLKIT_I5000', text: 'Deployment' };
    case 'rollback': return { code: 'CDK_TOOLKIT_I6000', text: 'Rollback' };
    case 'destroy': return { code: 'CDK_TOOLKIT_I7000', text: 'Destroy' };
  }
}
