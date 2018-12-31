import cdk = require("@aws-cdk/cdk");
import { Action, ActionCategory, CommonActionConstructProps, CommonActionProps } from "./action";
import { Artifact } from "./artifact";

/**
 * Construction properties of the low-level {@link SourceAction source Action}.
 */
export interface SourceActionProps extends CommonActionProps, CommonActionConstructProps {
  /**
   * The source action owner (could be "AWS", "ThirdParty" or "Custom").
   *
   * @default "AWS"
   */
  owner?: string;

  /**
   * The source action verison.
   *
   * @default "1"
   */
  version?: string;

  /**
   * The name of the source's output artifact.
   * Output artifacts are used by CodePipeline as inputs into other actions.
   *
   * @default a name will be auto-generated
   */
  outputArtifactName?: string;

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

  constructor(scope: cdk.Construct, id: string, props: SourceActionProps) {
    super(scope, id, {
      category: ActionCategory.Source,
      artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 1, maxOutputs: 1 },
      ...props,
    });

    this.outputArtifact = this.addOutputArtifact(props.outputArtifactName);
  }
}
