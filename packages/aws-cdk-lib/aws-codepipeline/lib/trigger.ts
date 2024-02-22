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

  /**
   * The list of patterns of Git branches that, when a commit is pushed, are
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
   * The list of patterns of Git branches that, when a commit is pushed, are
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
   * The list of patterns of Git repository file paths that, when a commit is pushed,
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
   * The list of patterns of Git repository file paths that, when a commit is pushed,
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
   * The length must be less than or equal to 3.
   *
   * @default - no filter.
   */
  readonly pushFilter?: GitPushFilter[];
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
        if ((filter.tagsExcludes || filter.tagsIncludes) && (filter.branchesExcludes || filter.branchesIncludes)) {
          throw new Error(`cannot specify both tags and branches in pushFilter for sourceAction with name '${sourceAction.actionProperties.actionName}'`);
        }
        if (!filter.branchesExcludes && !filter.branchesIncludes && (filter.filePathsExcludes || filter.filePathsIncludes)) {
          throw new Error(`cannot specify filePaths without branches in pushFilter for sourceAction with name '${sourceAction.actionProperties.actionName}'`);
        }
        if (filter.tagsExcludes && filter.tagsExcludes.length > 8) {
          throw new Error(`maximum length of tagsExcludes in pushFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' is 8, got ${filter.tagsExcludes.length}`);
        }
        if (filter.tagsIncludes && filter.tagsIncludes.length > 8) {
          throw new Error(`maximum length of tagsIncludes in pushFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' is 8, got ${filter.tagsIncludes.length}`);
        }
        if (filter.branchesExcludes && filter.branchesExcludes.length > 8) {
          throw new Error(`maximum length of branchesExcludes in pushFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' is 8, got ${filter.branchesExcludes.length}`);
        }
        if (filter.branchesIncludes && filter.branchesIncludes.length > 8) {
          throw new Error(`maximum length of branchesIncludes in pushFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' is 8, got ${filter.branchesIncludes.length}`);
        }
        if (filter.filePathsExcludes && filter.filePathsExcludes.length > 8) {
          throw new Error(`maximum length of filePathsExcludes in pushFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' is 8, got ${filter.filePathsExcludes.length}`);
        }
        if (filter.filePathsIncludes && filter.filePathsIncludes.length > 8) {
          throw new Error(`maximum length of filePathsIncludes in pushFilter for sourceAction with name '${sourceAction.actionProperties.actionName}' is 8, got ${filter.filePathsIncludes.length}`);
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

      const push: CfnPipeline.GitPushFilterProperty[] | undefined = pushFilter?.map(filter => {
        const tags: CfnPipeline.GitTagFilterCriteriaProperty | undefined = {
          // set to undefined if empty array because CloudFormation does not accept empty array
          excludes: filter.tagsExcludes?.length ? filter.tagsExcludes : undefined,
          includes: filter.tagsIncludes?.length ? filter.tagsIncludes : undefined,
        };
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
        return { tags, branches, filePaths };
      });

      gitConfiguration = {
        // set to undefined if empty array because CloudFormation does not accept empty array
        push: push?.length ? push : undefined,
        sourceActionName: sourceAction.actionProperties.actionName,
      };
    }

    return {
      gitConfiguration,
      providerType: this.props.providerType,
    };
  }
}