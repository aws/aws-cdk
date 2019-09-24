import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { Action } from '../action';

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
export interface CodeBuildActionProps extends codepipeline.CommonAwsActionProps {
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

  /**
   * Whether to validate if the action,
   * if it references a project in a different account,
   * does not have any outputs.
   * This is a known CodeBuild limitation.
   * If the action is cross-account, and has outputs,
   * and this property is true (which is the default),
   * an exception will be thrown.
   * You can set this to false to skip this validation.
   *
   * @default true
   * @see https://github.com/aws/aws-cdk/issues/4169
   */
  readonly validateCrossAccountOutputs?: boolean;
}

/**
 * CodePipeline build action that uses AWS CodeBuild.
 */
export class CodeBuildAction extends Action {
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
    });

    this.props = props;
  }

  protected bound(scope: cdk.Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
      codepipeline.ActionConfig {
    // check for a cross-account action if there are any outputs
    if (this.props.validateCrossAccountOutputs !== false &&
        (this.actionProperties.outputs || []).length > 0) {
      const pipelineStack = cdk.Stack.of(scope);
      const projectStack = cdk.Stack.of(this.props.project);
      if (pipelineStack.account !== projectStack.account) {
        throw new Error('A cross-account CodeBuild action cannot have outputs. ' +
          'This is a known CodeBuild limitation. ' +
          'See https://github.com/aws/aws-cdk/issues/4169 for details. ' +
          'You can pass the validateCrossAccountOutputs property as false to skip this validation');
      }
    }

    // grant the Pipeline role the required permissions to this Project
    options.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.props.project.projectArn],
      actions: [
        'codebuild:BatchGetBuilds',
        'codebuild:StartBuild',
        'codebuild:StopBuild',
      ]
    }));

    // allow the Project access to the Pipeline's artifact Bucket
    if ((this.actionProperties.outputs || []).length > 0) {
      options.bucket.grantReadWrite(this.props.project);
    } else {
      options.bucket.grantRead(this.props.project);
    }

    const configuration: any = {
      ProjectName: this.props.project.projectName,
    };
    if ((this.actionProperties.inputs || []).length > 1) {
      // lazy, because the Artifact name might be generated lazily
      configuration.PrimarySource = cdk.Lazy.stringValue({ produce: () => this.props.input.artifactName });
    }
    return {
      configuration,
    };
  }
}
