/**
 * The source type of the notification rule.
 */
export enum SourceType {
  /**
   * AWS CodeBuild is specified as CodeBuild.
   */
  CODE_BUILD = 'CodeBuild',

  /**
   * AWS CodePipeline is specified as CodePipeline.
   */
  CODE_PIPELINE = 'CodePipeline',
}

/**
 * Information about the Codebuild or CodePipeline associated with a notification source.
 */
export interface SourceConfig {

  /**
   * The source type. Can be an AWS CodeCommit, CodeBuild, CodePipeline or CodeDeploy.
   */
  readonly sourceType: SourceType;

  /**
   * The Amazon Resource Name (ARN) of the notification source.
   */
  readonly sourceAddress: string;
}

/**
 * The source that allows CodeBuild and CodePipeline to associate with this rule.
 */
export interface IRuleSource {

  /**
   * The ARN of AWS Codebuild Project
   * It's own property of AWS CodeBuild, which means it should be type of codebuild project if the source has `projectArn` property.
   * In the form of arn:aws:codebuild:{region}:{account}:project/{projectName}
   *
   * @default None
   */
  readonly projectArn?: string;

  /**
   * The ARN of AWS CodePipeline
   * The own property of AWS CodePipeline, which means it should be type of pipeline if the source has `pipelineArn` property.
   * In the form of arn:aws:codepipeline:{region}:{account}:{pipelineName}
   *
   * @default None
   */
  readonly pipelineArn?: string;
}