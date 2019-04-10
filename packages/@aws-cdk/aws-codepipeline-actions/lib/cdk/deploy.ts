import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import iam = require('@aws-cdk/aws-iam');
import { Construct } from '@aws-cdk/cdk';
import { CodeBuildBuildAction } from '../codebuild/pipeline-actions';

export interface CdkDeployActionProps {
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
   * Runtime environment for your CDK app.
   */
  readonly environment?: codebuild.BuildEnvironment;

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
export class CdkDeployAction extends CodeBuildBuildAction {
  private readonly project: codebuild.Project;

  constructor(scope: Construct, id: string, props: CdkDeployActionProps) {
    const child = new Construct(scope, id);
    const stacks = props.stacks ? props.stacks.join(' ') : '';
    const toolchainVersion = props.version || 'latest';
    const exclusively = props.exclusively ? '--exclusively' : '';
    const actionName = (props.stacks || [ 'all' ]).join('-');

    const environment = props.environment || {
      buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
    };

    const project = new codebuild.PipelineProject(child, `DeployStackProject`, {
      environment,
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
              `npx --package aws-cdk@${toolchainVersion} -- cdk deploy ${exclusively} --require-approval=never ${stacks}`
            ]
          }
        }
      }
    });

    super({
      actionName,
      project,
      inputArtifact: props.assembly,
    });

    this.project = project;

    if (props.admin) {
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
