import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');

/**
 * The type of the CodeBuild action that determines its CodePipeline Category -
 * Build, or Test.
 * The default is Build.
 */
export enum CodeBuildActionType {
  /**
   * The action will have the Build Category.
   * This is the default.
   */
  BUILD,

  /**
   * The action will have the Test Category.
   */
  TEST
}

/**
 * Construction properties of the {@link CodeBuildAction CodeBuild build CodePipeline action}.
 */
export interface CodeBuildActionProps extends codepipeline.CommonActionProps {
  /**
   * The source to use as input for this action.
   */
  readonly input: codepipeline.Artifact;

  /**
   * The list of additional input Artifacts for this action.
   */
  readonly extraInputs?: codepipeline.Artifact[];

  /**
   * The list of output Artifacts for this action.
   * **Note**: if you specify more than one output Artifact here,
   * you cannot use the primary 'artifacts' section of the buildspec;
   * you have to use the 'secondary-artifacts' section instead.
   * See https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html
   * for details.
   *
   * @default the action will not have any outputs
   */
  readonly outputs?: codepipeline.Artifact[];

  /**
   * The action's Project.
   */
  readonly project: codebuild.IProject;

  /**
   * The type of the action that determines its CodePipeline Category -
   * Build, or Test.
   *
   * @default CodeBuildActionType.BUILD
   */
  readonly type?: CodeBuildActionType;
}

/**
 * CodePipeline build action that uses AWS CodeBuild.
 */
export class CodeBuildAction extends codepipeline.Action {
  private readonly props: CodeBuildActionProps;

  constructor(props: CodeBuildActionProps) {
    super({
      ...props,
      category: props.type === CodeBuildActionType.TEST
        ? codepipeline.ActionCategory.TEST
        : codepipeline.ActionCategory.BUILD,
      provider: 'CodeBuild',
      artifactBounds: { minInputs: 1, maxInputs: 5, minOutputs: 0, maxOutputs: 5 },
      inputs: [props.input, ...props.extraInputs || []],
      resource: props.project,
      configuration: {
        ProjectName: props.project.projectName,
      },
    });

    this.props = props;

    if (this.inputs.length > 1) {
      this.configuration.PrimarySource = cdk.Lazy.stringValue({ produce: () => this.inputs[0].artifactName });
    }
  }

  protected bind(info: codepipeline.ActionBind): void {
    // grant the Pipeline role the required permissions to this Project
    info.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.props.project.projectArn],
      actions: [
        'codebuild:BatchGetBuilds',
        'codebuild:StartBuild',
        'codebuild:StopBuild',
      ]
    }));

    // allow the Project access to the Pipeline's artifact Bucket
    if (this.outputs.length > 0) {
      info.pipeline.grantBucketReadWrite(this.props.project);
    } else {
      info.pipeline.grantBucketRead(this.props.project);
    }
  }
}
