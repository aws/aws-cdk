import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cpactions = require('@aws-cdk/aws-codepipeline-actions');
import iam = require('@aws-cdk/aws-iam');
import { Stack } from '@aws-cdk/cdk';
import { DeploymentPipeline } from './application-pipeline';

export interface DeployStackActionProps {
  /**
   * The stack to deploy
   */
  readonly stack: Stack;

  /**
   * Grant administrator permissions to the deployment action. This is likely to
   * be needed in order to deploy arbitrary infrastructure into your account.
   *
   * You can also grant specific permissions to the execution role through
   * `addToRolePolicy` or by using a grant method on a resource and referencing
   * the `project.role`.
   */
  readonly admin: boolean;
}

/**
 * An AWS CodePipeline action for deploying CDK stacks.
 *
 * This action can only be added to an `ApplicationPipeline` which is bound to a
 * bootstrap pipeline source.
 */
export class DeployStackAction extends codepipeline.Action {
  private readonly stackName: string;
  private _buildAction?: cpactions.CodeBuildBuildAction;
  private _project?: codebuild.Project;
  private readonly admin: boolean;

  constructor(props: DeployStackActionProps) {
    super({
      category: codepipeline.ActionCategory.Build,
      provider: 'CodeBuild',
      artifactBounds: { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 },
      actionName: props.stack.name,
    });

    this.stackName = props.stack.name;
    this.admin = props.admin;

    Object.defineProperty(this, 'configuration', {
      get: () => this.buildAction.configuration
    });
  }

  // public get configuration(): any | undefined {
  //   return this.buildAction.configuration;
  // }
  //
  // public set configuration(_: any) {
  //   return;
  // }

  private get buildAction() {
    if (!this._buildAction) {
      throw new Error(`Action not bound to pipeline`);
    }

    return this._buildAction;
  }

  public get project() {
    if (!this._project) {
      throw new Error(`Action not bound to pipeline`);
    }

    return this._project;
  }

  public bind(info: codepipeline.ActionBind) {
    if (!DeploymentPipeline.isApplicationPipeline(info.pipeline)) {
      throw new Error(`DeployStackAction must be added to an ApplicationPipeline`);
    }

    const source = info.pipeline.source;
    if (!source) {
      throw new Error(`Cannot find source of ApplicationPipeline`);
    }

    const version = source.pipelineAttributes.toolkitVersion;
    const stackName = this.stackName;

    const project = new codebuild.PipelineProject(info.scope, `${stackName}Deployment`, {
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
      },
      buildSpec: {
        version: '0.2',
        phases: {
          install: {
            commands: [
              `npx npm@latest ci`
            ]
          },
          build: {
            commands: [
              `npx --package aws-cdk@${version} -- cdk deploy --require-approval=never ${stackName}`
            ]
          }
        }
      }
    });

    this.addInputArtifact(source.outputArtifact);

    this._project = project;

    this._buildAction = new cpactions.CodeBuildBuildAction({
      actionName: this.stackName,
      inputArtifact: source.outputArtifact,
      project,
    });

    (this._buildAction as any).bind(info.stage, info.scope);

    if (this.admin) {
      this.addToRolePolicy(new iam.PolicyStatement()
        .addAllResources()
        .addAction('*'));
    }
  }

  /**
   * Adds statements to the IAM policy associated with the execution role
   * of this deployment task.
   */
  public addToRolePolicy(statement: iam.PolicyStatement) {
    this.project.addToRolePolicy(statement);
  }
}
