import codepipeline = require('@aws-cdk/aws-codepipeline');
import { IJenkinsProvider, jenkinsArtifactsBounds } from "./jenkins-provider";

/**
 * The type of the Jenkins Action that determines its CodePipeline Category -
 * Build, or Test.
 * Note that a Jenkins provider, even if it has the same name,
 * must be separately registered for each type.
 */
export enum JenkinsActionType {
  /**
   * The Action will have the Build Category.
   */
  BUILD,

  /**
   * The Action will have the Test Category.
   */
  TEST
}

/**
 * Construction properties of {@link JenkinsAction}.
 */
export interface JenkinsActionProps extends codepipeline.CommonActionProps {
  /**
   * The source to use as input for this build.
   */
  readonly inputs?: codepipeline.Artifact[];

  /**
   *
   */
  readonly outputs?: codepipeline.Artifact[];

  /**
   * The Jenkins Provider for this Action.
   */
  readonly jenkinsProvider: IJenkinsProvider;

  /**
   * The name of the project (sometimes also called job, or task)
   * on your Jenkins installation that will be invoked by this Action.
   *
   * @example 'MyJob'
   */
  readonly projectName: string;

  /**
   * The type of the Action - Build, or Test.
   */
  readonly type: JenkinsActionType;
}

/**
 * Jenkins build CodePipeline Action.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/tutorials-four-stage-pipeline.html
 */
export class JenkinsAction extends codepipeline.Action {
  private readonly jenkinsProvider: IJenkinsProvider;

  constructor(props: JenkinsActionProps) {
    super({
      ...props,
      category: props.type === JenkinsActionType.BUILD
        ? codepipeline.ActionCategory.Build
        : codepipeline.ActionCategory.Test,
      provider: props.jenkinsProvider.providerName,
      owner: 'Custom',
      artifactBounds: jenkinsArtifactsBounds,
      version: props.jenkinsProvider.version,
      configuration: {
        ProjectName: props.projectName,
      },
    });

    this.jenkinsProvider = props.jenkinsProvider;
  }

  protected bind(_info: codepipeline.ActionBind): void {
    if (this.category === codepipeline.ActionCategory.Build) {
      this.jenkinsProvider._registerBuildProvider();
    } else {
      this.jenkinsProvider._registerTestProvider();
    }
  }
}
