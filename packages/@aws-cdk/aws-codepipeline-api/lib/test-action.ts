import { Action, ActionArtifactBounds, ActionCategory, CommonActionProps } from "./action";
import { Artifact } from "./artifact";

/**
 * Construction properties of the low-level {@link TestAction test Action}.
 */
export interface TestActionProps extends CommonActionProps {
  /**
   * The source to use as input for this test.
   */
  readonly inputArtifact: Artifact;

  /**
   * The optional name of the output artifact.
   * If you provide a value here,
   * then the `outputArtifact` property of your Action will be non-null.
   * If you don't, `outputArtifact` will be `null`.
   *
   * @default the Action will not have an output artifact
   */
  readonly outputArtifactName?: string;

  /**
   * The service provider that the action calls.
   *
   * @example 'CodeBuild'
   */
  readonly provider: string;

  /**
   * The upper and lower bounds on the number of input and output artifacts for this Action.
   */
  readonly artifactBounds: ActionArtifactBounds;

  /**
   * The test Action owner (could be 'AWS', 'ThirdParty' or 'Custom').
   *
   * @default 'AWS'
   */
  readonly owner?: string;

  /**
   * The test Action version.
   *
   * @default '1'
   */
  readonly version?: string;

  /**
   * The action's configuration. These are key-value pairs that specify input values for an action.
   * For more information, see the AWS CodePipeline User Guide.
   *
   * http://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
   */
  readonly configuration?: any;
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

  constructor(props: TestActionProps) {
    super({
      ...props,
      category: ActionCategory.Test,
    });

    this.addInputArtifact(props.inputArtifact);
    if (props.outputArtifactName) {
      this.outputArtifact = this.addOutputArtifact(props.outputArtifactName);
    }
  }
}
