import { IAction } from './action';
import { CfnPipeline } from './codepipeline.generated';

/**
 * Git push filter for trigger.
 */
export interface GitPushFilter {
  /**
   * The list of patterns of Git tags that, when pushed, are to be excluded from
   * starting the pipeline.
   *
   * You can filter with glob patterns. The `tagsExcludes` takes priority
   * over the `tagsIncludes`.
   *
   * Maximum length of this array is 8.
   *
   * @default - no tags.
   */
  readonly tagsExcludes?: string[];

  /**
   * The list of patterns of Git tags that, when pushed, are to be included as
   * criteria that starts the pipeline.
   *
   * You can filter with glob patterns. The `tagsExcludes` takes priority
   * over the `tagsIncludes`.
   *
   * Maximum length of this array is 8.
   *
   * @default - no tags.
   */
  readonly tagsIncludes?: string[];
}

/**
 * Git pull request filter for trigger.
 */
export interface GitPullRequestFilter {
  /**
   * The list of patterns of Git branches that, when pull request events occurs, are
   * to be excluded from starting the pipeline.
   *
   * You can filter with glob patterns. The `branchesExcludes` takes priority
   * over the `branchesIncludes`.
   *
   * Maximum length of this array is 8.
   *
   * @default - no branches.
   */
  readonly branchesExcludes?: string[];

  /**
   * The list of patterns of Git branches that, when pull request events occurs, are
   * to be included as criteria that starts the pipeline.
   *
   * You can filter with glob patterns. The `branchesExcludes` takes priority
   * over the `branchesIncludes`.
   *
   * Maximum length of this array is 8.
   *
   * @default - no branches.
   */
  readonly branchesIncludes?: string[];

  /**
   * The list of patterns of Git repository file paths that, when pull request events occurs,
   * are to be excluded from starting the pipeline.
   *
   * You can filter with glob patterns. The `filePathsExcludes` takes priority
   * over the `filePathsIncludes`.
   *
   * Maximum length of this array is 8.
   *
   * @default - no filePaths.
   */
  readonly filePathsExcludes?: string[];

  /**
   * The list of patterns of Git repository file paths that, when pull request events occurs,
   * are to be included as criteria that starts the pipeline.
   *
   * You can filter with glob patterns. The `filePathsExcludes` takes priority
   * over the `filePathsIncludes`.
   *
   * Maximum length of this array is 8.
   *
   * @default - no filePaths.
   */
  readonly filePathsIncludes?: string[];

  /**
   * The field that specifies which pull request events to filter on (opened, updated, closed)
   * for the trigger configuration.
   *
   * Maximum length of this array is 3.
   *
   * @default - no events.
   */
  readonly events?: GitPullRequestEvent[];
}

/**
 * Event for trigger with pull request filter.
 */
export enum GitPullRequestEvent {
  /**
   * OPEN
   */
  OPEN = 'OPEN',
  /**
   * UPDATED
   */
  UPDATED = 'UPDATED',
  /**
   * CLOSED
   */
  CLOSED = 'CLOSED',
}

/**
 * Git configuration for trigger.
 */
export interface GitConfiguration {
  /**
   * The pipeline source action where the trigger configuration, such as Git tags.
   *
   * The trigger configuration will start the pipeline upon the specified change only.
   * You can only specify one trigger configuration per source action.
   *
   * Since the provider for `sourceAction` must be `CodeStarSourceConnection`, you can use
   * `CodeStarConnectionsSourceAction` construct in `aws-codepipeline-actions` module.
   */
  readonly sourceAction: IAction;

  /**
   * The field where the repository event that will start the pipeline,
   * such as pushing Git tags, is specified with details.
   *
   * Git tags is the only supported event type.
   *
   * The length must be less than or equal to 3.
   *
   * @default - no filter.
   */
  readonly pushFilter?: GitPushFilter[];

  /**
   * The field where the repository event that will start the pipeline
   * is specified as pull requests.
   *
   * The length must be less than or equal to 3.
   *
   * @default - no filter.
   */
  readonly pullRequestFilter?: GitPullRequestFilter[];
}

/**
 * Provider type for trigger.
 */
export enum ProviderType {
  /**
   * CodeStarSourceConnection
   */
  CODE_STAR_SOURCE_CONNECTION = 'CodeStarSourceConnection',
}

/**
 * Properties of trigger.
 */
export interface TriggerProps {
  /**
   * The source provider for the event, such as connections configured
   * for a repository with Git tags, for the specified trigger configuration.
   */
  readonly providerType: ProviderType;

  /**
   * Provides the filter criteria and the source stage for the repository
   * event that starts the pipeline, such as Git tags.
   *
   * @default - no configuration.
   */
  readonly gitConfiguration?: GitConfiguration;
}

/**
 * Trigger.
 */
export class Trigger {
  /**
   * The pipeline source action where the trigger configuration.
   */
  public readonly sourceAction: IAction | undefined;

  constructor(private readonly props: TriggerProps) {
    this.sourceAction = props.gitConfiguration?.sourceAction;
    this.validate();
  }

  private validate() {
    if (this.props.gitConfiguration) {
      const sourceAction = this.props.gitConfiguration.sourceAction;
      if (sourceAction.actionProperties.provider !== 'CodeStarSourceConnection') {
        throw new Error(`provider for actionProperties in sourceAction with name '${sourceAction.actionProperties.actionName}' must be 'CodeStarSourceConnection', got '${sourceAction.actionProperties.provider}'`);
      }

      const pushFilter = this.props.gitConfiguration.pushFilter;
      if (pushFilter !== undefined && pushFilter.length > 3) {
        throw new Error(`length of pushFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' must be less than or equal to 3, got ${pushFilter.length}`);
      }

      pushFilter?.forEach(filter => {
        if (filter.tagsExcludes && filter.tagsExcludes.length > 8) {
          throw new Error(`maximum length of tagsExcludes in pushFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' is 8, got ${filter.tagsExcludes.length}`);
        }
        if (filter.tagsIncludes && filter.tagsIncludes.length > 8) {
          throw new Error(`maximum length of tagsIncludes in pushFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' is 8, got ${filter.tagsIncludes.length}`);
        }
      });

      const pullRequestFilter = this.props.gitConfiguration.pullRequestFilter;
      if (pullRequestFilter !== undefined && pullRequestFilter.length > 3) {
        throw new Error(`length of pullRequestFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' must be less than or equal to 3, got ${pullRequestFilter.length}`);
      }

      pullRequestFilter?.forEach(filter => {
        if (!filter.branchesExcludes && !filter.branchesIncludes && (filter.filePathsExcludes || filter.filePathsIncludes)) {
          throw new Error(`cannot specify filePaths without branches in pullRequestFilter for sourceAction with name '${sourceAction.actionProperties.actionName}'`);
        }
        if (filter.branchesExcludes && filter.branchesExcludes.length > 8) {
          throw new Error(`maximum length of branchesExcludes in pullRequestFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' is 8, got ${filter.branchesExcludes.length}`);
        }
        if (filter.branchesIncludes && filter.branchesIncludes.length > 8) {
          throw new Error(`maximum length of branchesIncludes in pullRequestFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' is 8, got ${filter.branchesIncludes.length}`);
        }
        if (filter.filePathsExcludes && filter.filePathsExcludes.length > 8) {
          throw new Error(`maximum length of filePathsExcludes in pullRequestFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' is 8, got ${filter.filePathsExcludes.length}`);
        }
        if (filter.filePathsIncludes && filter.filePathsIncludes.length > 8) {
          throw new Error(`maximum length of filePathsIncludes in pullRequestFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' is 8, got ${filter.filePathsIncludes.length}`);
        }
        if (filter.events && filter.events.length > 3) {
          throw new Error(`maximum length of events in pullRequestFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' is 3, got ${filter.events.length}`);
        }
      });
    }
  }

  /**
   * Render to CloudFormation property.
   *
   * @internal
   */
  public _render(): CfnPipeline.PipelineTriggerDeclarationProperty {
    let gitConfiguration: CfnPipeline.GitConfigurationProperty | undefined;
    if (this.props.gitConfiguration) {
      const sourceAction = this.props.gitConfiguration.sourceAction;
      const pushFilter = this.props.gitConfiguration.pushFilter;
      const pullRequestFilter = this.props.gitConfiguration.pullRequestFilter;

      const push: CfnPipeline.GitPushFilterProperty[] | undefined = pushFilter?.map(filter => {
        const tags: CfnPipeline.GitTagFilterCriteriaProperty | undefined = {
          // set to undefined if empty array because CloudFormation does not accept empty array
          excludes: filter.tagsExcludes?.length ? filter.tagsExcludes : undefined,
          includes: filter.tagsIncludes?.length ? filter.tagsIncludes : undefined,
        };
        return { tags };
      });
      const pullRequest: CfnPipeline.GitPullRequestFilterProperty[] | undefined = pullRequestFilter?.map(filter => {
        const branches: CfnPipeline.GitBranchFilterCriteriaProperty | undefined = {
          // set to undefined if empty array because CloudFormation does not accept empty array
          excludes: filter.branchesExcludes?.length ? filter.branchesExcludes : undefined,
          includes: filter.branchesIncludes?.length ? filter.branchesIncludes : undefined,
        };
        const filePaths: CfnPipeline.GitFilePathFilterCriteriaProperty | undefined = {
          // set to undefined if empty array because CloudFormation does not accept empty array
          excludes: filter.filePathsExcludes?.length ? filter.filePathsExcludes : undefined,
          includes: filter.filePathsIncludes?.length ? filter.filePathsIncludes : undefined,
        };
        // set to undefined if empty array because CloudFormation does not accept empty array
        const events: string[] | undefined = filter.events?.length ? filter.events : undefined;
        return { branches, filePaths, events };
      });

      gitConfiguration = {
        // set to undefined if empty array because CloudFormation does not accept empty array
        push: push?.length ? push : undefined,
        // set to undefined if empty array because CloudFormation does not accept empty array
        pullRequest: pullRequest?.length ? pullRequest : undefined,
        sourceActionName: sourceAction.actionProperties.actionName,
      };
    }

    return {
      gitConfiguration,
      providerType: this.props.providerType,
    };
  }
}