import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Construct } from 'constructs';
import { Action } from '../action';
/**
 * The type of the CodeBuild action that determines its CodePipeline Category -
 * Build, or Test.
 * The default is Build.
 */
export declare enum CodeBuildActionType {
    /**
     * The action will have the Build Category.
     * This is the default.
     */
    BUILD = 0,
    /**
     * The action will have the Test Category.
     */
    TEST = 1
}
/**
 * Construction properties of the `CodeBuildAction CodeBuild build CodePipeline action`.
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
     * the one pointed to by the `input` property.
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
    readonly environmentVariables?: {
        [name: string]: codebuild.BuildEnvironmentVariable;
    };
    /**
     * Whether to check for the presence of any secrets in the environment variables of the default type, BuildEnvironmentVariableType.PLAINTEXT.
     * Since using a secret for the value of that kind of variable would result in it being displayed in plain text in the AWS Console,
     * the construct will throw an exception if it detects a secret was passed there.
     * Pass this property as false if you want to skip this validation,
     * and keep using a secret in a plain text environment variable.
     *
     * @default true
     */
    readonly checkSecretsInPlainTextEnvVariables?: boolean;
    /**
     * Trigger a batch build.
     *
     * Enabling this will enable batch builds on the CodeBuild project.
     *
     * @default false
     */
    readonly executeBatchBuild?: boolean;
    /**
     * Combine the build artifacts for a batch builds.
     *
     * Enabling this will combine the build artifacts into the same location for batch builds.
     * If `executeBatchBuild` is not set to `true`, this property is ignored.
     *
     * @default false
     */
    readonly combineBatchBuildArtifacts?: boolean;
}
/**
 * CodePipeline build action that uses AWS CodeBuild.
 */
export declare class CodeBuildAction extends Action {
    private readonly props;
    constructor(props: CodeBuildActionProps);
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
    variable(variableName: string): string;
    protected bound(scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig;
}
