import { DeployOptions } from '..';
import { CloudWatchLogEventMonitor } from '../../../api/aws-cdk';

export * from './helpers';

/**
 * Deploy options needed by the watch command.
 * Intentionally not exported because these options are not
 * meant to be public facing.
 */
export interface ExtendedDeployOptions extends DeployOptions {
  /**
   * The extra string to append to the User-Agent header when performing AWS SDK calls.
   *
   * @default - nothing extra is appended to the User-Agent header
   */
  readonly extraUserAgent?: string;

  /**
   * Allows adding CloudWatch log groups to the log monitor via
   * cloudWatchLogMonitor.setLogGroups();
   *
   * @default - not monitoring CloudWatch logs
   */
  readonly cloudWatchLogMonitor?: CloudWatchLogEventMonitor;
}
