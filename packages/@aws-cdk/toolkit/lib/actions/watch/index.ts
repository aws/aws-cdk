import type { BaseDeployOptions, HotswapMode } from '../deploy';

export interface WatchOptions extends BaseDeployOptions {
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
   * @default process.cwd()
   */
  readonly watchDir?: string;

  /**
   * The output directory to write CloudFormation template to
   *
   * @deprecated this should be grabbed from the cloud assembly itself
   *
   * @default 'cdk.out'
   */
  readonly outdir?: string;

  /**
   * @TODO can this be part of `DeploymentMethod`
   *
   * Whether to perform a 'hotswap' deployment.
   * A 'hotswap' deployment will attempt to short-circuit CloudFormation
   * and update the affected resources like Lambda functions directly.
   *
   * @default HotswapMode.HOTSWAP_ONLY
   */
  readonly hotswap?: HotswapMode;
}

export function patternsArrayForWatch(
  patterns: string | string[] | undefined,
  options: { rootDir: string; returnRootDirIfEmpty: boolean },
): string[] {
  const patternsArray: string[] = patterns !== undefined ? (Array.isArray(patterns) ? patterns : [patterns]) : [];
  return patternsArray.length > 0 ? patternsArray : options.returnRootDirIfEmpty ? [options.rootDir] : [];
}
