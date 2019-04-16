import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import iam = require('@aws-cdk/aws-iam');

/**
 * Common construction properties of all CodeBuild Pipeline Actions.
 */
export interface CommonCodeBuildActionProps extends codepipeline.CommonActionProps {
  /**
   * The source to use as input for this Action.
   */
  readonly inputArtifact: codepipeline.Artifact;

  /**
   * The list of additional input Artifacts for this Action.
   */
  readonly additionalInputArtifacts?: codepipeline.Artifact[];

  /**
   * The list of names for additional output Artifacts for this Action.
   * The resulting output artifacts can be accessed with the `additionalOutputArtifacts`
   * method of the Action.
   */
  readonly additionalOutputArtifactNames?: string[];

  /**
   * The Action's Project.
   */
  readonly project: codebuild.IProject;
}

/**
 * Construction properties of the {@link CodeBuildBuildAction CodeBuild build CodePipeline Action}.
 */
export interface CodeBuildBuildActionProps extends CommonCodeBuildActionProps {
  /**
   * The name of the build's output artifact.
   *
   * @default an auto-generated name will be used
   */
  readonly outputArtifactName?: string;
}

/**
 * CodePipeline build Action that uses AWS CodeBuild.
 */
export class CodeBuildBuildAction extends codepipeline.BuildAction {
  private readonly props: CodeBuildBuildActionProps;

  constructor(props: CodeBuildBuildActionProps) {
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
      this.actionInputArtifacts,
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
    return this.actionOutputArtifacts.slice(1);
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

  protected bind(info: codepipeline.ActionBind): void {
    setCodeBuildNeededPermissions(info, this.props.project, true);
  }
}

/**
 * Construction properties of the {@link CodeBuildTestAction CodeBuild test CodePipeline Action}.
 */
export interface CodeBuildTestActionProps extends CommonCodeBuildActionProps {
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
 * CodePipeline test Action that uses AWS CodeBuild.
 */
export class CodeBuildTestAction extends codepipeline.TestAction {
  private readonly props: CodeBuildTestActionProps;

  constructor(props: CodeBuildTestActionProps) {
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
      this.actionInputArtifacts,
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
      ? this.actionOutputArtifacts
      : this.actionOutputArtifacts.slice(1);
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

  protected bind(info: codepipeline.ActionBind): void {
    setCodeBuildNeededPermissions(info, this.props.project, this.actionOutputArtifacts.length > 0);
  }
}

function setCodeBuildNeededPermissions(info: codepipeline.ActionBind, project: codebuild.IProject,
                                       needsPipelineBucketWrite: boolean): void {
  // grant the Pipeline role the required permissions to this Project
  info.role.addToPolicy(new iam.PolicyStatement()
    .addResource(project.projectArn)
    .addActions(
      'codebuild:BatchGetBuilds',
      'codebuild:StartBuild',
      'codebuild:StopBuild',
    ));

  // allow the Project access to the Pipline's artifact Bucket
  if (needsPipelineBucketWrite) {
    info.pipeline.grantBucketReadWrite(project);
  } else {
    info.pipeline.grantBucketRead(project);
  }
}

function handleAdditionalInputOutputArtifacts(props: CommonCodeBuildActionProps, action: codepipeline.Action,
                                              inputArtifacts: codepipeline.Artifact[],
                                              addInputArtifact: (_: codepipeline.Artifact) => void,
                                              addOutputArtifact: (_: string) => void) {
  if ((props.additionalInputArtifacts || []).length > 0) {
    // we have to set the primary source in the configuration
    action.configuration.PrimarySource = inputArtifacts[0].artifactName;
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
