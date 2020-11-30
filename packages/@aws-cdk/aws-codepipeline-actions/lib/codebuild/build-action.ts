import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { BitBucketSourceAction } from '..';
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
   *
   * The directories the additional inputs will be available at are available
   * during the project's build in the CODEBUILD_SRC_DIR_<artifact-name> environment variables.
   * The project's build always starts in the directory with the primary input artifact checked out,
   * the one pointed to by the {@link input} property.
   * For more information,
   * see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-multi-in-out.html .
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
   * The environment variables to pass to the CodeBuild project when this action executes.
   * If a variable with the same name was set both on the project level, and here,
   * this value will take precedence.
   *
   * @default - No additional environment variables are specified.
   */
  readonly environmentVariables?: { [name: string]: codebuild.BuildEnvironmentVariable };
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

  /**
   * Reference a CodePipeline variable defined by the CodeBuild project this action points to.
   * Variables in CodeBuild actions are defined using the 'exported-variables' subsection of the 'env'
   * section of the buildspec.
   *
   * @param variableName the name of the variable to reference.
   *   A variable by this name must be present in the 'exported-variables' section of the buildspec
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec-ref-syntax
   */
  public variable(variableName: string): string {
    return this.variableExpression(variableName);
  }

  protected bound(scope: cdk.Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // check for a cross-account action if there are any outputs
    if ((this.actionProperties.outputs || []).length > 0) {
      const pipelineStack = cdk.Stack.of(scope);
      const projectStack = cdk.Stack.of(this.props.project);
      if (pipelineStack.account !== projectStack.account) {
        throw new Error('A cross-account CodeBuild action cannot have outputs. ' +
          'This is a known CodeBuild limitation. ' +
          'See https://github.com/aws/aws-cdk/issues/4169 for details');
      }
    }

    // grant the Pipeline role the required permissions to this Project
    options.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.props.project.projectArn],
      actions: [
        'codebuild:BatchGetBuilds',
        'codebuild:StartBuild',
        'codebuild:StopBuild',
      ],
    }));

    // allow the Project access to the Pipeline's artifact Bucket
    // but only if the project is not imported
    // (ie., has a role) - otherwise, the IAM library throws an error
    if (this.props.project.role) {
      if ((this.actionProperties.outputs || []).length > 0) {
        options.bucket.grantReadWrite(this.props.project);
      } else {
        options.bucket.grantRead(this.props.project);
      }
    }

    if (this.props.project instanceof codebuild.Project) {
      this.props.project.bindToCodePipeline(scope, {
        artifactBucket: options.bucket,
      });
    }

    // if any of the inputs come from the BitBucketSourceAction
    // with codeBuildCloneOutput=true,
    // grant the Project's Role to use the connection
    for (const inputArtifact of this.actionProperties.inputs || []) {
      const connectionArn = inputArtifact.getMetadata(BitBucketSourceAction._CONNECTION_ARN_PROPERTY);
      if (connectionArn) {
        this.props.project.addToRolePolicy(new iam.PolicyStatement({
          actions: ['codestar-connections:UseConnection'],
          resources: [connectionArn],
        }));
      }
    }

    const configuration: any = {
      ProjectName: this.props.project.projectName,
      EnvironmentVariables: this.props.environmentVariables &&
        cdk.Stack.of(scope).toJsonString(codebuild.Project.serializeEnvVariables(this.props.environmentVariables)),
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
