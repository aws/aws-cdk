import codepipeline = require('@aws-cdk/aws-codepipeline');
import { IJenkinsProvider, jenkinsArtifactsBounds } from "./jenkins-provider";

/**
 * Common construction properties of all Jenkins Pipeline Actions.
 */
export interface CommonJenkinsActionProps extends codepipeline.CommonActionProps {
  /**
   * The name of the project (sometimes also called job, or task)
   * on your Jenkins installation that will be invoked by this Action.
   *
   * @example 'MyJob'
   */
  readonly projectName: string;

  /**
   * The source to use as input for this build.
   */
  readonly inputArtifact: codepipeline.Artifact;

  /**
   * The Jenkins Provider for this Action.
   */
  readonly jenkinsProvider: IJenkinsProvider;
}

/**
 * Construction properties of {@link JenkinsBuildAction}.
 */
export interface JenkinsBuildActionProps extends CommonJenkinsActionProps {
  /**
   * The name of the build's output artifact.
   *
   * @default an auto-generated name will be used
   */
  readonly outputArtifactName?: string;
}

/**
 * Jenkins build CodePipeline Action.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/tutorials-four-stage-pipeline.html
 */
export class JenkinsBuildAction extends codepipeline.BuildAction {
  private readonly jenkinsProvider: IJenkinsProvider;

  constructor(props: JenkinsBuildActionProps) {
    super({
      ...props,
      provider: props.jenkinsProvider.providerName,
      owner: 'Custom',
      artifactBounds: jenkinsArtifactsBounds,
      version: props.jenkinsProvider.version,
      configuration: {
        ProjectName: props.projectName,
      },
      outputArtifactName: props.outputArtifactName || `Artifact_${props.actionName}_${props.jenkinsProvider.node.uniqueId}`,
    });

    this.jenkinsProvider = props.jenkinsProvider;
  }

  protected bind(_info: codepipeline.ActionBind): void {
    this.jenkinsProvider._registerBuildProvider();
  }
}

/**
 * Construction properties of {@link JenkinsTestAction}.
 */
export interface JenkinsTestActionProps extends CommonJenkinsActionProps {
  /**
   * The optional name of the primary output artifact.
   * If you provide a value here,
   * then the `outputArtifact` property of your Action will be non-null.
   * If you don't, `outputArtifact` will be `null`.
   *
   * @default the Action will not have an output artifact
   */
  readonly outputArtifactName?: string;
}

/**
 * Jenkins test CodePipeline Action.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/tutorials-four-stage-pipeline.html
 */
export class JenkinsTestAction extends codepipeline.TestAction {
  private readonly jenkinsProvider: IJenkinsProvider;

  constructor(props: JenkinsTestActionProps) {
    super({
      ...props,
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
    this.jenkinsProvider._registerTestProvider();
  }
}
