import cdk = require("@aws-cdk/cdk");
import { Action, ActionArtifactBounds, ActionCategory, CommonActionConstructProps, CommonActionProps } from "./action";
import { Artifact } from "./artifact";

/**
 * Construction properties of the low-level {@link TestAction test Action}.
 */
export interface TestActionProps extends CommonActionProps, CommonActionConstructProps {
  /**
   * The source to use as input for this test.
   *
   * @default CodePipeline will use the output of the last Action from a previous Stage as input
   */
  inputArtifact?: Artifact;

  /**
   * The optional name of the output artifact.
   * If you provide a value here,
   * then the `outputArtifact` property of your Action will be non-null.
   * If you don't, `outputArtifact` will be `null`.
   *
   * @default the Action will not have an output artifact
   */
  outputArtifactName?: string;

  /**
   * The service provider that the action calls.
   *
   * @example 'CodeBuild'
   */
  provider: string;

  /**
   * The upper and lower bounds on the number of input and output artifacts for this Action.
   */
  artifactBounds: ActionArtifactBounds;

  /**
   * The source action owner (could be 'AWS', 'ThirdParty' or 'Custom').
   *
   * @default 'AWS'
   */
  owner?: string;

  /**
   * The action's configuration. These are key-value pairs that specify input values for an action.
   * For more information, see the AWS CodePipeline User Guide.
   *
   * http://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
   */
  configuration?: any;
}

/**
 * The low-level test Action.
 *
 * Test Actions are very similar to build Actions -
 * the difference is that test Actions don't have to have an output artifact.
 *
 * You should never need to use this class directly,
 * instead preferring the concrete implementations,
 * like {@link codebuild.PipelineTestAction}.
 */
export abstract class TestAction extends Action {
  public readonly outputArtifact?: Artifact;

  constructor(parent: cdk.Construct, name: string, props: TestActionProps) {
    super(parent, name, {
      category: ActionCategory.Test,
      ...props,
    });

    this.addInputArtifact(props.inputArtifact);
    if (props.outputArtifactName) {
      this.outputArtifact = this.addOutputArtifact(props.outputArtifactName);
    }
  }
}
