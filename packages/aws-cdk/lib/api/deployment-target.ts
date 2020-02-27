import { CloudFormationStackArtifact } from '@aws-cdk/cx-api';
import { Tag } from "../api/cxapp/stacks";
import { debug } from '../logging';
import { Mode } from './aws-auth/credentials';
import { deployStack, DeployStackResult, destroyStack, readCurrentTemplate } from './deploy-stack';
import { loadToolkitInfo } from './toolkit-info';
import { stackExists } from './util/cloudformation';
import { replaceAwsPlaceholders } from './util/placeholders';
import { ISDK } from './util/sdk';

export const DEFAULT_TOOLKIT_STACK_NAME = 'CDKToolkit';

export type Template = { [key: string]: any };

/**
 * Interface for provisioners
 *
 * Provisioners apply templates to the cloud infrastructure.
 */
export interface IDeploymentTarget {
  readCurrentTemplate(stack: CloudFormationStackArtifact): Promise<Template>;
  deployStack(options: DeployStackOptions): Promise<DeployStackResult>;
  destroyStack(options: DestroyStackOptions): Promise<void>;
  stackExists(options: StackExistsOptions): Promise<boolean>;
}

export interface DeployStackOptions {
  stack: CloudFormationStackArtifact;
  roleArn?: string;
  notificationArns?: string[];
  deployName?: string;
  quiet?: boolean;
  toolkitStackName?: string;
  reuseAssets?: string[];
  tags?: Tag[];
  execute?: boolean;

  /**
   * Force deployment, even if the deployed template is identical to the one we are about to deploy.
   * @default false deployment will be skipped if the template is identical
   */
  force?: boolean;
}

export interface DestroyStackOptions {
  stack: CloudFormationStackArtifact;
  deployName?: string;
  roleArn?: string;
  quiet?: boolean;
  force?: boolean;
}

export interface StackExistsOptions {
  stack: CloudFormationStackArtifact;
  deployName?: string;
}

export interface ProvisionerProps {
  aws: ISDK;
}

/**
 * Default provisioner (applies to CloudFormation).
 */
export class CloudFormationDeploymentTarget implements IDeploymentTarget {
  private readonly aws: ISDK;

  constructor(props: ProvisionerProps) {
    this.aws = props.aws;
  }

  public async readCurrentTemplate(stack: CloudFormationStackArtifact): Promise<Template> {
    debug(`Reading existing template for stack ${stack.displayName}.`);
    const { sdk } = await this.cloudFormationOptionsFor(stack);

    const cfn = await sdk.cloudFormation(stack.environment.account, stack.environment.region, Mode.ForReading);
    return readCurrentTemplate(cfn, stack.stackName);
  }

  public async deployStack(options: DeployStackOptions): Promise<DeployStackResult> {
    const toolkitInfo = await loadToolkitInfo(options.stack.environment, this.aws, options.toolkitStackName || DEFAULT_TOOLKIT_STACK_NAME);

    const { sdk, roleArn } = await this.cloudFormationOptionsFor(options.stack, options.roleArn);

    return deployStack({
      stack: options.stack,
      deployName: options.deployName,
      notificationArns: options.notificationArns,
      quiet: options.quiet,
      sdk,
      roleArn,
      reuseAssets: options.reuseAssets,
      toolkitInfo,
      tags: options.tags,
      execute: options.execute,
      force: options.force
    });
  }

  public async destroyStack(options: DestroyStackOptions): Promise<void> {
    const { sdk, roleArn } = await this.cloudFormationOptionsFor(options.stack, options.roleArn);

    return destroyStack({
      sdk,
      roleArn,
      stack: options.stack,
      deployName: options.deployName,
      quiet: options.quiet,
    });
  }

  public async stackExists(options: StackExistsOptions): Promise<boolean> {
    const { sdk } = await this.cloudFormationOptionsFor(options.stack);
    const cfn = await sdk.cloudFormation(options.stack.environment.account, options.stack.environment.region, Mode.ForReading);
    return stackExists(cfn, options.deployName ?? options.stack.stackName);
  }

  /**
   * Return CloudFormation options for touching the given stack
   *
   * Return an SDK with the right credentials, and return the CloudFormation Execution Role
   */
  private async cloudFormationOptionsFor(stack: CloudFormationStackArtifact, roleArn?: string) {
    // Substitute any placeholders with information about the current environment
    const arns = await replaceAwsPlaceholders({
      assumeRoleArn: stack.assumeRoleArn,

      // Use the override if given, otherwise use the field from the stack
      cloudFormationRoleArn: roleArn ?? stack.cloudFormationExecutionRoleArn
    }, this.aws);

    let sdk = this.aws;
    if (arns.assumeRoleArn) {
      sdk = await sdk.assumeRole(arns.assumeRoleArn, stack.environment.region);
    }

    return { sdk, roleArn: arns.cloudFormationRoleArn };
  }
}
