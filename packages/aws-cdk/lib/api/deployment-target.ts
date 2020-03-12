import { CloudFormationStackArtifact } from '@aws-cdk/cx-api';
import { Tag } from "../api/cxapp/stacks";
import { debug } from '../logging';
import { Mode, SdkProvider } from './aws-auth';
import { deployStack, DeployStackResult, destroyStack, readCurrentTemplate } from './deploy-stack';
import { ToolkitInfo } from './toolkit-info';
import { stackExists } from './util/cloudformation';
import { replaceAwsPlaceholders } from './util/placeholders';

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

  /**
   * Extra parameters for CloudFormation
   * @default - no additional parameters will be passed to the template
   */
  parameters?: { [name: string]: string | undefined };
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
  sdkProvider: SdkProvider;
}

/**
 * Default provisioner (applies to CloudFormation).
 */
export class CloudFormationDeploymentTarget implements IDeploymentTarget {
  private readonly sdkProvider: SdkProvider;

  constructor(props: ProvisionerProps) {
    this.sdkProvider = props.sdkProvider;
  }

  public async readCurrentTemplate(stack: CloudFormationStackArtifact): Promise<Template> {
    debug(`Reading existing template for stack ${stack.displayName}.`);
    const { stackSdk } = await this.prepareSdkFor(stack, undefined, Mode.ForReading);
    const cfn = stackSdk.cloudFormation();
    return readCurrentTemplate(cfn, stack.stackName);
  }

  public async deployStack(options: DeployStackOptions): Promise<DeployStackResult> {
    const { stackSdk, resolvedEnvironment, cloudFormationRoleArn } = await this.prepareSdkFor(options.stack, options.roleArn);

    // tslint:disable-next-line:max-line-length
    const toolkitInfo = await ToolkitInfo.lookup(resolvedEnvironment, stackSdk, options.toolkitStackName);

    return deployStack({
      stack: options.stack,
      resolvedEnvironment,
      deployName: options.deployName,
      notificationArns: options.notificationArns,
      quiet: options.quiet,
      sdk: stackSdk,
      sdkProvider: this.sdkProvider,
      roleArn: cloudFormationRoleArn,
      reuseAssets: options.reuseAssets,
      toolkitInfo,
      tags: options.tags,
      execute: options.execute,
      force: options.force,
      parameters: options.parameters
    });
  }

  public async destroyStack(options: DestroyStackOptions): Promise<void> {
    const { stackSdk, cloudFormationRoleArn: roleArn } = await this.prepareSdkFor(options.stack, options.roleArn);

    return destroyStack({
      sdk: stackSdk,
      roleArn,
      stack: options.stack,
      deployName: options.deployName,
      quiet: options.quiet,
    });
  }

  public async stackExists(options: StackExistsOptions): Promise<boolean> {
    const { stackSdk } = await this.prepareSdkFor(options.stack, undefined, Mode.ForReading);
    const cfn = stackSdk.cloudFormation();
    return stackExists(cfn, options.deployName ?? options.stack.stackName);
  }

  /**
   * Return the SDK and CloudFormation options for touching the given stack
   *
   * Return an SDK with the right credentials, the resolved environment, and
   * return the CloudFormation Execution Role.
   */
  private async prepareSdkFor(stack: CloudFormationStackArtifact, roleArn?: string, mode = Mode.ForWriting) {
    // Substitute any placeholders with information about the current environment
    const arns = await replaceAwsPlaceholders({
      assumeRoleArn: stack.assumeRoleArn,

      // Use the override if given, otherwise use the field from the stack
      cloudFormationRoleArn: roleArn ?? stack.cloudFormationExecutionRoleArn,
    }, this.sdkProvider);

    if (!stack.environment) {
      throw new Error(`The stack ${stack.displayName} does not have an environment`);
    }
    const resolvedEnvironment = await this.sdkProvider.resolveEnvironment(stack.environment.account, stack.environment.region);

    const stackSdk = arns.assumeRoleArn
      ? await this.sdkProvider.withAssumedRole(arns.assumeRoleArn, undefined, resolvedEnvironment.region)
      : await this.sdkProvider.forEnvironment(stack.environment.account, stack.environment.region, mode);

    return {
      stackSdk,
      resolvedEnvironment,
      cloudFormationRoleArn: arns.cloudFormationRoleArn,
    };
  }
}
