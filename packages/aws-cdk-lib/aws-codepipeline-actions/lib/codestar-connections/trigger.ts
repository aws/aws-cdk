import { CfnPipeline } from '../../../aws-codepipeline/lib';

/**
 * The patterns used for filtering criteria.
 */
export interface FilterPattern {
  /**
   * The excludes patterns to use. If any pattern are included in both includes and excludes,
   * excludes take precedence.
   *
   * @default - No patterns are excluded in this filter.
   */
  readonly excludes?: string[];

  /**
   * The includes patterns to use. If any pattern are included in both includes and excludes,
   * excludes take precedence.
   *
   * @default - No patterns are included in this filter.
   */
  readonly includes?: string[];
}

/**
 * Filtering options for filtering on a branch.
 */
export interface BranchFilterOptions {
  /**
   * The list of branches to filter on.
   */
  readonly branches: FilterPattern;
  /**
   * The list of filepaths to filter on.
   *
   * @default - No filtering for filepaths.
   */
  readonly filePaths?: FilterPattern;
}

/**
 * Filtering options for pull requests
 */
export interface PullRequestFilterOptions extends BranchFilterOptions { }

/**
 * Filtering options for filtering on a tag,
 */
export interface TagFilterOptions extends FilterPattern { }

enum Events {
  OPENED = 'OPENED',
  UPDATED = 'UPDATED',
  CLOSED = 'CLOSED',
};

/**
 * Adds a filter to the trigger.
 */
export class Filter {
  /**
   * Triggers on all pull request events. These include: OPENED, UPDATED, and CLOSED.
   * @param filter The filters to use to limit which pull requests are included in the trigger
   */
  public static pullRequestEvents(filter: PullRequestFilterOptions) {
    return Filter._pullRequest([Events.OPENED, Events.UPDATED, Events.CLOSED], filter);
  }

  /**
   * Triggers on OPENED pull request events.
   * @param filter The filters to use to limit which pull requests are included in the trigger
   */
  public static pullRequestOpened(filter: PullRequestFilterOptions) {
    return Filter._pullRequest([Events.OPENED], filter);
  }

  /**
   * Triggers on UPDATED pull request events.
   * @param filter The filters to use to limit which pull requests are included in the trigger
   */
  public static pullRequestUpdated(filter: PullRequestFilterOptions) {
    return Filter._pullRequest([Events.UPDATED], filter);
  }

  /**
   * Triggers on CLOSED pull request events.
   * @param filter The filters to use to limit which pull requests are included in the trigger
   */
  public static pullRequestClosed(filter: PullRequestFilterOptions) {
    return Filter._pullRequest([Events.CLOSED], filter);
  }

  /**
   * Triggers on OPENED or UPDATED pull request events.
   * @param filter The filters to use to limit which pull requests are included in the trigger
   */
  public static pullRequestOpenedOrUpdated(filter: PullRequestFilterOptions) {
    return Filter._pullRequest([Events.OPENED, Events.UPDATED], filter);
  }

  /**
   * Triggers on OPENED or CLOSED pull request events.
   * @param filter The filters to use to limit which pull requests are included in the trigger
   */
  public static pullRequestOpenedOrClosed(filter: PullRequestFilterOptions) {
    return Filter._pullRequest([Events.OPENED, Events.CLOSED], filter);
  }

  /**
   * Triggers on UPDATED or CLOSED pull request events.
   * @param filter The filters to use to limit which pull requests are included in the trigger
   */
  public static pullRequestUpdatedOrClosed(filter: PullRequestFilterOptions) {
    return Filter._pullRequest([Events.UPDATED, Events.CLOSED], filter);
  }

  /**
   * Trigger on push events.
   * @param filter The filters to use to limit which push events are included in the trigger
   */
  public static push(filter: PushFilter) {
    return new Filter(undefined, { tags: filter._tags, branches: filter._branches, filePaths: filter._filePaths });
  }

  private static _pullRequest(events: Events[], filter: PullRequestFilterOptions) {
    mustContainValue('Functions filtering on a pull request', filter.branches, ' on the \'branches\' field');
    return new Filter({ events, branches: filter.branches, filePaths: filter.filePaths }, undefined);
  }

  /**
   * @internal
   */
  public readonly _pullRequest?: CfnPipeline.GitPullRequestFilterProperty;

  /**
   * @internal
   */
  public readonly _push?: CfnPipeline.GitPushFilterProperty;

  constructor(
    pullRequest?: CfnPipeline.GitPullRequestFilterProperty,
    push?: CfnPipeline.GitPushFilterProperty,
  ) {
    this._pullRequest = pullRequest;
    this._push = push;
  }
}

/**
 * Represents a CodePipeline V2 Pipeline trigger. Each trigger may include filters to limit the
 * circumstances in which the pipeline will trigger.
 */
export class Trigger {
  /**
   * Trigger on all code pushes to the default branch.
   */
  public static readonly ENABLED = new Trigger(true);

  /**
   * Disables triggers for the pipeline.
   */
  public static readonly DISABLED = new Trigger(false);

  /**
   * Enables a trigger for the pipeline, filtering for specific events.
   * Requires at least one filter.
   * @param filters Additional filters for this trigger
   */
  public static withFilters(filter: Filter, ...filters: Filter[]) {
    const trigger = new Trigger(true);
    trigger._filters.push(filter, ...filters);
    return trigger;
  }

  /**
   * @internal
   */
  public _filters: Filter[] = [];

  /**
   * @internal
   */
  public _enabled: boolean;

  constructor(enabled: boolean) {
    this._enabled = enabled;
  }
}

/**
 * Filters specific to push triggers.
 */
export class PushFilter {
  /**
   * Filter on tags
   * @param options The filtering options for tags
   */
  public static onTags(options: TagFilterOptions) {
    mustContainValue('PushFilter.onTags()', options);
    return new PushFilter(options);
  }

  /**
   * Filter on branches
   * @param options The filtering options for branches
   */
  public static onBranches(options: BranchFilterOptions) {
    mustContainValue('PushFilter.onBranches()', options.branches, ' on the \'branches\' field');
    return new PushFilter(undefined, options.branches, options.filePaths);
  }

  /**
   * @internal
   */
  public readonly _tags?: CfnPipeline.GitTagFilterCriteriaProperty;

  /**
   * @internal
   */
  public readonly _branches?: CfnPipeline.GitBranchFilterCriteriaProperty;

  /**
   * @internal
   */
  public readonly _filePaths?: CfnPipeline.GitFilePathFilterCriteriaProperty;

  constructor(
    tags?: CfnPipeline.GitTagFilterCriteriaProperty,
    branches?: CfnPipeline.GitBranchFilterCriteriaProperty,
    filePaths?: CfnPipeline.GitFilePathFilterCriteriaProperty,
  ) {
    this._tags = maybeUndefined(tags);
    this._branches = maybeUndefined(branches);
    this._filePaths = maybeUndefined(filePaths);
  }
}

function maybeUndefined(input?: FilterPattern) {
  return (input?.excludes || input?.includes) ?
    (input?.excludes?.length == 0 && input.includes?.length == 0 ? undefined : input) :
    undefined;
}

function mustContainValue(type: string, input?: FilterPattern, additionalDetails?: string) {
  if (!maybeUndefined(input)) {
    throw new Error(`${type} must contain at least one 'includes' or 'excludes' pattern${additionalDetails ?? ''}.`);
  }
}