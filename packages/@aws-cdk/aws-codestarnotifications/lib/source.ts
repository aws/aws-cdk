import { IRule } from './rule';

/**
 * Information about the Codebuild or CodePipeline associated with a notification source.
 */
export interface RuleSourceConfig {

  /**
   * The source type. Can be an AWS CodeCommit, CodeBuild, CodePipeline or CodeDeploy.
   */
  readonly sourceType: string;

  /**
   * The Amazon Resource Name (ARN) of the notification source.
   */
  readonly sourceArn: string;
}

/**
 * Represents a notification source
 * The source that allows CodeBuild and CodePipeline to associate with this rule.
 */
export interface IRuleSource {
  /**
   * Binds source to notification rule
   * @param _rule The notification rule
   */
  bind(_rule: IRule): RuleSourceConfig;
}