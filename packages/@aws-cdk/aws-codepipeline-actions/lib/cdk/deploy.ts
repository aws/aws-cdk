import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cpactions = require('@aws-cdk/aws-codepipeline-actions');
import iam = require('@aws-cdk/aws-iam');
// import { DeploymentPipeline } from './application-pipeline';

export interface DeployActionProps {
  /**
   * Names of all the stacks to deploy.
   * @default - deploys all stacks in the assembly that are not marked "autoDeploy: false"
   */
  readonly stacks?: string[];

  /**
   * Indicates if only these stacks should be deployed or also any dependencies.
   * @default false deploys all stacks and their dependencies in topological order.
   */
  readonly exclusively?: boolean;

  /**
   * Grant administrator permissions to the deployment action. This is likely to
   * be needed in order to deploy arbitrary infrastructure into your account.
   *
   * You can also grant specific permissions to the execution role through
   * `addToRolePolicy` or by using a grant method on a resource and referencing
   * the `project.role`.
   */
  readonly admin: boolean;

  /**
   * Toolchain version to use.
   * @default - lastest
   */
  readonly version?: string;

  /**
   * A CodePipeline artifact that contains the cloud assembly to deploy.
   */
  readonly assembly: codepipeline.Artifact;
}

/**
 * An AWS CodePipeline action for deploying CDK stacks.
 *
 * This action can only be added to an `ApplicationPipeline` which is bound to a
 * bootstrap pipeline source.
 */
export class DeployStackAction extends codepipeline.Action {
  private readonly stacks: string;
  private _buildAction?: cpactions.CodeBuildBuildAction;
  private _project?: codebuild.Project;
  private readonly admin: boolean;
  private readonly toolchainVersion: string;
  private readonly assembly: codepipeline.Artifact;
  private readonly exclusively: boolean;

  constructor(props: DeployActionProps) {
    const stacks = props.stacks ? props.stacks.join(' ') : '';

    super({
      category: codepipeline.ActionCategory.Build,
      provider: 'CodeBuild',
      artifactBounds: { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 },
      actionName: (props.stacks || [ 'all' ]).join('-'),
    });

    this.stacks = stacks;
    this.admin = props.admin;
    this.toolchainVersion = props.version || 'latest';
    this.assembly = props.assembly;
    this.exclusively = props.exclusively === undefined ? false : true;

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
    const exclusively = this.exclusively ? '--exclusively' : '';
    const project = new codebuild.PipelineProject(info.scope, `DeployStackProject`, {
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
              `npx --package aws-cdk@${this.toolchainVersion} -- cdk deploy ${exclusively} --require-approval=never ${this.stacks}`
            ]
          }
        }
      }
    });

    this.addInputArtifact(this.assembly);

    this._project = project;

    this._buildAction = new cpactions.CodeBuildBuildAction({
      actionName: this.actionName,
      inputArtifact: this.assembly,
      project,
    });

    (this._buildAction as any).bind(info);

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
