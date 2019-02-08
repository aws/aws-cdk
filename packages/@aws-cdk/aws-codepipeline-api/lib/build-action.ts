import { Action, ActionArtifactBounds, ActionCategory, CommonActionProps } from "./action";
import { Artifact } from "./artifact";

/**
 * Construction properties of the low level {@link BuildAction build action}.
 */
export interface BuildActionProps extends CommonActionProps {
  /**
   * The source to use as input for this build.
   */
  inputArtifact: Artifact;

  /**
   * The service provider that the action calls. For example, a valid provider for Source actions is CodeBuild.
   */
  provider: string;

  /**
   * The upper and lower bounds on the number of input and output artifacts for this Action.
   */
  artifactBounds: ActionArtifactBounds;

  /**
   * The build Action owner (could be 'AWS', 'ThirdParty' or 'Custom').
   *
   * @default 'AWS'
   */
  owner?: string;

  /**
   * The build Action version.
   *
   * @default '1'
   */
  version?: string;

  /**
   * The name of the build's output artifact.
   */
  outputArtifactName: string;

  /**
   * The action's configuration. These are key-value pairs that specify input values for an action.
   * For more information, see the AWS CodePipeline User Guide.
   *
   * http://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
   */
  configuration?: any;
}

/**
 * Low level class for build actions.
 * It is recommended that concrete types are used instead,
 * such as {@link codebuild.PipelineBuildAction}.
 */
export abstract class BuildAction extends Action {
  public readonly outputArtifact: Artifact;

  constructor(props: BuildActionProps) {
    super({
      ...props,
      category: ActionCategory.Build,
    });

    this.addInputArtifact(props.inputArtifact);
    this.outputArtifact = this.addOutputArtifact(props.outputArtifactName);
  }
}
