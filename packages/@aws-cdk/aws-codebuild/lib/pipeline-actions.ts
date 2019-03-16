import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { IProject } from './project';

/**
 * Common construction properties of all CodeBuild Pipeline Actions.
 */
export interface CommonCodeBuildActionProps {
  /**
   * The list of additional input Artifacts for this Action.
   */
  additionalInputArtifacts?: codepipeline.Artifact[];

  /**
   * The list of names for additional output Artifacts for this Action.
   * The resulting output artifacts can be accessed with the `additionalOutputArtifacts`
   * method of the Action.
   */
  additionalOutputArtifactNames?: string[];
}

/**
 * Common properties for creating {@link PipelineBuildAction} -
 * either directly, through its constructor,
 * or through {@link IProject#toCodePipelineBuildAction}.
 */
export interface CommonPipelineBuildActionProps extends CommonCodeBuildActionProps,
    codepipeline.CommonActionProps {
  /**
   * The source to use as input for this build.
   */
  inputArtifact: codepipeline.Artifact;

  /**
   * The name of the build's output artifact.
   *
   * @default an auto-generated name will be used
   */
  outputArtifactName?: string;
}

/**
 * Construction properties of the {@link PipelineBuildAction CodeBuild build CodePipeline Action}.
 */
export interface PipelineBuildActionProps extends CommonPipelineBuildActionProps {
  /**
   * The build project
   */
  project: IProject;
}

/**
 * CodePipeline build Action that uses AWS CodeBuild.
 */
export class PipelineBuildAction extends codepipeline.BuildAction {
  private readonly props: PipelineBuildActionProps;

  constructor(props: PipelineBuildActionProps) {
    super({
      ...props,
      provider: 'CodeBuild',
      artifactBounds: { minInputs: 1, maxInputs: 5, minOutputs: 0, maxOutputs: 5 },
      outputArtifactName: props.outputArtifactName || `Artifact_${props.actionName}_${props.project.node.uniqueId}`,
      configuration: {
        ProjectName: props.project.projectName,
      },
    });

    this.props = props;

    handleAdditionalInputOutputArtifacts(props, this,
      // pass functions to get around protected members
      (artifact) => this.addInputArtifact(artifact),
      (artifactName) => this.addOutputArtifact(artifactName));
  }

  /**
   * Returns the additional output artifacts defined for this Action.
   * Their names will be taken from the {@link CommonCodeBuildActionProps#additionalOutputArtifactNames}
   * property.
   *
   * @returns all additional output artifacts defined for this Action
   * @see #additionalOutputArtifact
   */
  public additionalOutputArtifacts(): codepipeline.Artifact[] {
    return this._outputArtifacts.slice(1);
  }

  /**
   * Returns the additional output artifact with the given name,
   * or throws an exception if an artifact with that name was not found
   * in the additonal output artifacts.
   * The names are defined by the {@link CommonCodeBuildActionProps#additionalOutputArtifactNames}
   * property.
   *
   * @param name the name of the artifact to find
   * @returns the artifact with the given name
   * @see #additionalOutputArtifacts
   */
  public additionalOutputArtifact(name: string): codepipeline.Artifact {
    return findOutputArtifact(this.additionalOutputArtifacts(), name);
  }

  protected bind(stage: codepipeline.IStage, _scope: cdk.Construct): void {
    setCodeBuildNeededPermissions(stage, this.props.project, true);
  }
}

/**
 * Common properties for creating {@link PipelineTestAction} -
 * either directly, through its constructor,
 * or through {@link IProject#toCodePipelineTestAction}.
 */
export interface CommonPipelineTestActionProps extends CommonCodeBuildActionProps,
    codepipeline.CommonActionProps {
  /**
   * The source to use as input for this test.
   */
  inputArtifact: codepipeline.Artifact;

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
 * Construction properties of the {@link PipelineTestAction CodeBuild test CodePipeline Action}.
 */
export interface PipelineTestActionProps extends CommonPipelineTestActionProps {
  /**
   * The build Project.
   */
  project: IProject;
}

export class PipelineTestAction extends codepipeline.TestAction {
  private readonly props: PipelineTestActionProps;

  constructor(props: PipelineTestActionProps) {
    super({
      ...props,
      provider: 'CodeBuild',
      artifactBounds: { minInputs: 1, maxInputs: 5, minOutputs: 0, maxOutputs: 5 },
      configuration: {
        ProjectName: props.project.projectName,
      },
    });

    this.props = props;

    handleAdditionalInputOutputArtifacts(props, this,
      // pass functions to get around protected members
      (artifact) => this.addInputArtifact(artifact),
      (artifactName) => this.addOutputArtifact(artifactName));
  }

  /**
   * Returns the additional output artifacts defined for this Action.
   * Their names will be taken from the {@link CommonCodeBuildActionProps#additionalOutputArtifactNames}
   * property.
   *
   * @returns all additional output artifacts defined for this Action
   * @see #additionalOutputArtifact
   */
  public additionalOutputArtifacts(): codepipeline.Artifact[] {
    return this.outputArtifact === undefined
      ? this._outputArtifacts
      : this._outputArtifacts.slice(1);
  }

  /**
   * Returns the additional output artifact with the given name,
   * or throws an exception if an artifact with that name was not found
   * in the additonal output artifacts.
   * The names are defined by the {@link CommonCodeBuildActionProps#additionalOutputArtifactNames}
   * property.
   *
   * @param name the name of the artifact to find
   * @returns the artifact with the given name
   * @see #additionalOutputArtifacts
   */
  public additionalOutputArtifact(name: string): codepipeline.Artifact {
    return findOutputArtifact(this.additionalOutputArtifacts(), name);
  }

  protected bind(stage: codepipeline.IStage, _scope: cdk.Construct): void {
    setCodeBuildNeededPermissions(stage, this.props.project, this._outputArtifacts.length > 0);
  }
}

function setCodeBuildNeededPermissions(stage: codepipeline.IStage, project: IProject,
                                       needsPipelineBucketWrite: boolean) {
  // grant the Pipeline role the required permissions to this Project
  stage.pipeline.role.addToPolicy(new iam.PolicyStatement()
    .addResource(project.projectArn)
    .addActions(
      'codebuild:BatchGetBuilds',
      'codebuild:StartBuild',
      'codebuild:StopBuild',
    ));

  // allow the Project access to the Pipline's artifact Bucket
  if (needsPipelineBucketWrite) {
    stage.pipeline.grantBucketReadWrite(project.role);
  } else {
    stage.pipeline.grantBucketRead(project.role);
  }
}

function handleAdditionalInputOutputArtifacts(props: CommonCodeBuildActionProps, action: codepipeline.Action,
                                              addInputArtifact: (_: codepipeline.Artifact) => void,
                                              addOutputArtifact: (_: string) => void) {
  if ((props.additionalInputArtifacts || []).length > 0) {
    // we have to set the primary source in the configuration
    action.configuration.PrimarySource = action._inputArtifacts[0].artifactName;
    // add the additional artifacts
    for (const additionalInputArtifact of props.additionalInputArtifacts || []) {
      addInputArtifact(additionalInputArtifact);
    }
  }

  for (const additionalArtifactName of props.additionalOutputArtifactNames || []) {
    addOutputArtifact(additionalArtifactName);
  }
}

function findOutputArtifact(artifacts: codepipeline.Artifact[], name: string): codepipeline.Artifact {
  const ret = artifacts.find((artifact) => artifact.artifactName === name);
  if (!ret) {
    throw new Error(`Could not find output artifact with name '${name}'`);
  }
  return ret;
}
