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


export interface ValidSource {

  /**
   * The own property of AWS CodeBuild , that means it should be type of codebuild project if the source has pipelineArn property.
   */
  readonly projectArn?: string;

  /**
   * The own property of AWS CodePipeline , that means it should be type of pipeline if the source has pipelineArn property.
   */
  readonly pipelineArn?: string;
}