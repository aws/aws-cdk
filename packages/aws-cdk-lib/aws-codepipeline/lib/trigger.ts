import { IAction } from './action';

/**
 * Git push filter for trigger.
 */
export interface GitPushFilter {
  /**
   * The list of patterns of Git tags that, when pushed, are to be excluded from
   * starting the pipeline.
   *
   * You can filter with glob patterns. The `excludedTags` takes priority
   * over the `includedTags`.
   *
   * Maximum length of this array is 8.
   *
   * @default - no tags.
   */
  readonly excludedTags?: string[];

  /**
   * The list of patterns of Git tags that, when pushed, are to be included as
   * criteria that starts the pipeline.
   *
   * You can filter with glob patterns. The `excludedTags` takes priority
   * over the `includedTags`.
   *
   * Maximum length of this array is 8.
   *
   * @default - no tags.
   */
  readonly includedTags?: string[];
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
   * The length must be between 1 and 3.
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
 * Pipeline trigger.
 */
export interface Trigger {
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