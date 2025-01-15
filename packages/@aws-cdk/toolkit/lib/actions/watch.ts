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

  /**
   * The root directory used for watch.
   *
   * @default - the directory of 'cdk.json'
   */
  readonly watchDir?: string;

  /**
   * The output to write CloudFormation template to
   *
   * @deprecated this should be grabbed from the cloud assembly itself
   */
  readonly output?: string;
}

export function patternsArrayForWatch(
  patterns: string | string[] | undefined,
  options: { rootDir: string; returnRootDirIfEmpty: boolean },
): string[] {
  const patternsArray: string[] = patterns !== undefined ? (Array.isArray(patterns) ? patterns : [patterns]) : [];
  return patternsArray.length > 0 ? patternsArray : options.returnRootDirIfEmpty ? [options.rootDir] : [];
}
