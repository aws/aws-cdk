import { DefaultCdkOptions, RequireApproval } from './common';

/**
 * Options to use with cdk deploy
 */
export interface DeployOptions extends DefaultCdkOptions {
  /**
   * Only perform action on the given stack
   *
   * @default false
   */
  readonly exclusively?: boolean;

  /**
   * Name of the toolkit stack to use/deploy
   *
   * @default CDKToolkit
   */
  readonly toolkitStackName?: string;

  /**
   * Reuse the assets with the given asset IDs
   *
   * @default - do not reuse assets
   */
  readonly reuseAssets?: string[];

  /**
   * Optional name to use for the CloudFormation change set.
   * If not provided, a name will be generated automatically.
   *
   * @default - auto generate a name
   */
  readonly changeSetName?: string;

  /**
   * Always deploy, even if templates are identical.
   * @default false
   */
  readonly force?: boolean;

  /**
   * Rollback failed deployments
   *
   * @default true
   */
  readonly rollback?: boolean;

  /**
   * ARNs of SNS topics that CloudFormation will notify with stack related events
   *
   * @default - no notifications
   */
  readonly notificationArns?: string[];

  /**
   * What kind of security changes require approval
   *
   * @default RequireApproval.Never
   */
  readonly requireApproval?: RequireApproval;

  /**
   * Whether to execute the ChangeSet
   * Not providing `execute` parameter will result in execution of ChangeSet
   * @default true
   */
  readonly execute?: boolean;

  /**
   * Additional parameters for CloudFormation at deploy time
   * @default {}
   */
  readonly parameters?: { [name: string]: string };

  /**
   * Use previous values for unspecified parameters
   *
   * If not set, all parameters must be specified for every deployment.
   *
   * @default true
   */
  readonly usePreviousParameters?: boolean;

  /**
   * Path to file where stack outputs will be written after a successful deploy as JSON
   * @default - Outputs are not written to any file
   */
  readonly outputsFile?: string;

  /**
   * Whether we are on a CI system
   *
   * @default false
   */
  readonly ci?: boolean;

  /**
   * Display mode for stack activity events
   *
   * The default in the CLI is StackActivityProgress.BAR, but
   * since the cli-wrapper will most likely be run in automation it makes
   * more sense to set the default to StackActivityProgress.EVENTS
   *
   * @default StackActivityProgress.EVENTS
   */
  readonly progress?: StackActivityProgress;

  /**
   * Whether this 'deploy' command should actually delegate to the 'watch' command.
   *
   * @default false
   */
  readonly watch?: boolean;

  /**
   * Whether to perform a 'hotswap' deployment.
   * A 'hotswap' deployment will attempt to short-circuit CloudFormation
   * and update the affected resources like Lambda functions directly.
   *
   * @default - `HotswapMode.FALL_BACK` for regular deployments, `HotswapMode.HOTSWAP_ONLY` for 'watch' deployments
   */
  readonly hotswap?: HotswapMode;

  /**
   * Whether to show CloudWatch logs for hotswapped resources
   * locally in the users terminal
   *
   * @default - false
   */
  readonly traceLogs?: boolean;

  /**
   * Deployment method
   */
  readonly deploymentMethod?: DeploymentMethod;

  /**
   * Deploy multiple stacks in parallel
   *
   * @default 1
   */
  readonly concurrency?: number;

  /**
   * Whether to deploy if the app contains no stacks.
   *
   * @default false
   */
  readonly ignoreNoStacks?: boolean;
}
export type DeploymentMethod = 'direct' | 'change-set';

export enum HotswapMode {
  /**
   * Will fall back to CloudFormation when a non-hotswappable change is detected
   */
  FALL_BACK = 'fall-back',

  /**
   * Will not fall back to CloudFormation when a non-hotswappable change is detected
   */
  HOTSWAP_ONLY = 'hotswap-only',

  /**
   * Will not attempt to hotswap anything and instead go straight to CloudFormation
   */
  FULL_DEPLOYMENT = 'full-deployment',
}

/**
 * Supported display modes for stack deployment activity
 */
export enum StackActivityProgress {
  /**
   * Displays a progress bar with only the events for the resource currently being deployed
   */
  BAR = 'bar',

  /**
   * Displays complete history with all CloudFormation stack events
   */
  EVENTS = 'events',
}
