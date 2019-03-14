import { Action, ActionCategory, CommonActionProps } from "./action";
import { Artifact } from "./artifact";

/**
 * Construction properties of the low-level {@link SourceAction source Action}.
 */
export interface SourceActionProps extends CommonActionProps {
  /**
   * The source action owner (could be "AWS", "ThirdParty" or "Custom").
   *
   * @default "AWS"
   */
  owner?: string;

  /**
   * The source Action version.
   *
   * @default "1"
   */
  version?: string;

  /**
   * The name of the source's output artifact.
   * CfnOutput artifacts are used by CodePipeline as inputs into other actions.
   */
  outputArtifactName: string;

  /**
   * The service provider that the action calls.
   * For example, a valid provider for Source actions is "S3".
   */
  provider: string;

  /**
   * The action's configuration. These are key-value pairs that specify input values for an action.
   * For more information, see the AWS CodePipeline User Guide.
   *
   * http://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
   */
  configuration?: any;
}

/**
 * Low-level class for source actions.
 * It is recommended that concrete types are used instead,
 * such as {@link s3.PipelineSourceAction} or
 * {@link codecommit.PipelineSourceAction}.
 */
export abstract class SourceAction extends Action {
  public readonly outputArtifact: Artifact;

  constructor(props: SourceActionProps) {
    super({
      ...props,
      category: ActionCategory.Source,
      artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 1, maxOutputs: 1 },
    });

    this.outputArtifact = this.addOutputArtifact(props.outputArtifactName);
  }
}
