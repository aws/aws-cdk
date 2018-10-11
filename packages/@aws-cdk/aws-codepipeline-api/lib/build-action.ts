import cdk = require("@aws-cdk/cdk");
import { Action, ActionCategory, CommonActionConstructProps, CommonActionProps } from "./action";
import { Artifact } from "./artifact";

/**
 * Construction properties of the low level {@link BuildAction build action}.
 */
export interface BuildActionProps extends CommonActionProps, CommonActionConstructProps {
  /**
   * The source to use as input for this build.
   */
  inputArtifact?: Artifact;

  /**
   * The service provider that the action calls. For example, a valid provider for Source actions is CodeBuild.
   */
  provider: string;

  /**
   * The source action owner (could be 'AWS', 'ThirdParty' or 'Custom').
   *
   * @default 'AWS'
   */
  owner?: string;

  /**
   * The name of the build's output artifact.
   */
  outputArtifactName?: string;

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

  constructor(parent: cdk.Construct, name: string, props: BuildActionProps) {
    super(parent, name, {
      category: ActionCategory.Build,
      artifactBounds: { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 1 },
      ...props,
    });

    this.addInputArtifact(props.inputArtifact);
    this.outputArtifact = this.addOutputArtifact(props.outputArtifactName);
  }
}
