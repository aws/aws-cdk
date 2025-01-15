import { BaseDeployOptions } from './deploy';

export interface WatchOptions extends BaseDeployOptions {
  /**
   * Whether to show CloudWatch logs for hotswapped resources
   * locally in the users terminal
   *
   * @default - false
   */
  readonly traceLogs?: boolean;

  /**
   * The extra string to append to the User-Agent header when performing AWS SDK calls.
   *
   * @default - nothing extra is appended to the User-Agent header
   */
  readonly extraUserAgent?: string;

  /**
   * Watch the files in this list
   *
   * @default - []
   */
  readonly include?: string[];

  /**
   * Ignore watching the files in this list
   *
   * @default - []
   */
  readonly exclude?: string[];
}
