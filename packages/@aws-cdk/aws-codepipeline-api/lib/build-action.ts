import cdk = require("@aws-cdk/cdk");
import { Action, ActionCategory, CommonActionProps } from "./action";
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
   * The name of the build's output artifact.
   */
  artifactName?: string;

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
  public readonly artifact?: Artifact;

  constructor(parent: cdk.Construct, name: string, props: BuildActionProps) {
    super(parent, name, {
      stage: props.stage,
      artifactBounds: { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 1 },
      category: ActionCategory.Build,
      provider: props.provider,
      configuration: props.configuration
    });

    this.addInputArtifact(props.inputArtifact);
    if (props.artifactName) {
      this.artifact = this.addOutputArtifact(props.artifactName);
    }
  }
}
