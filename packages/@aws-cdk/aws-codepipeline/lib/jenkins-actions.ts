import cpapi = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { IJenkinsProvider, jenkinsArtifactsBounds } from "./jenkins-provider";

/**
 * Common construction properties of all Jenkins Pipeline Actions.
 */
export interface BasicJenkinsActionProps extends cpapi.CommonActionProps {
  /**
   * The name of the project (sometimes also called job, or task)
   * on your Jenkins installation that will be invoked by this Action.
   *
   * @example 'MyJob'
   */
  projectName: string;

  /**
   * The source to use as input for this build.
   */
  inputArtifact: cpapi.Artifact;
}

/**
 * Common properties for creating {@link JenkinsBuildAction} -
 * either directly, through its constructor,
 * or through {@link IJenkinsProvider#toCodePipelineBuildAction}.
 */
export interface BasicJenkinsBuildActionProps extends BasicJenkinsActionProps {
  /**
   * The name of the build's output artifact.
   *
   * @default an auto-generated name will be used
   */
  outputArtifactName?: string;
}

/**
 * Construction properties of {@link JenkinsBuildAction}.
 */
export interface JenkinsBuildActionProps extends BasicJenkinsBuildActionProps {
  /**
   * The Jenkins Provider for this Action.
   */
  jenkinsProvider: IJenkinsProvider;
}

/**
 * Jenkins build CodePipeline Action.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/tutorials-four-stage-pipeline.html
 */
export class JenkinsBuildAction extends cpapi.BuildAction {
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

  protected bind(_stage: cpapi.IStage, _scope: cdk.Construct): void {
    this.jenkinsProvider._registerBuildProvider();
  }
}

/**
 * Common properties for creating {@link JenkinsTestAction} -
 * either directly, through its constructor,
 * or through {@link IJenkinsProvider#toCodePipelineTestAction}.
 */
export interface BasicJenkinsTestActionProps extends BasicJenkinsActionProps {
  /**
   * The optional name of the primary output artifact.
   * If you provide a value here,
   * then the `outputArtifact` property of your Action will be non-null.
   * If you don't, `outputArtifact` will be `null`.
   *
   * @default the Action will not have an output artifact
   */
  outputArtifactName?: string;
}

/**
 * Construction properties of {@link JenkinsTestAction}.
 */
export interface JenkinsTestActionProps extends BasicJenkinsTestActionProps {
  /**
   * The Jenkins Provider for this Action.
   */
  jenkinsProvider: IJenkinsProvider;
}

/**
 * Jenkins test CodePipeline Action.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/tutorials-four-stage-pipeline.html
 */
export class JenkinsTestAction extends cpapi.TestAction {
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

  protected bind(_stage: cpapi.IStage, _scope: cdk.Construct): void {
    this.jenkinsProvider._registerTestProvider();
  }
}
