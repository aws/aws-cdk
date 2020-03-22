import { CloudFormationStackArtifact } from '@aws-cdk/cx-api';
import { Tag } from "../api/cxapp/stacks";
import { debug } from '../logging';
import { Mode, SdkProvider } from './aws-auth';
import { deployStack, DeployStackResult, readCurrentTemplate } from './deploy-stack';
import { loadToolkitInfo } from './toolkit-info';

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

export interface ProvisionerProps {
  aws: SdkProvider;
}

/**
 * Default provisioner (applies to CloudFormation).
 */
export class CloudFormationDeploymentTarget implements IDeploymentTarget {
  private readonly aws: SdkProvider;

  constructor(props: ProvisionerProps) {
    this.aws = props.aws;
  }

  public async readCurrentTemplate(stack: CloudFormationStackArtifact): Promise<Template> {
    debug(`Reading existing template for stack ${stack.displayName}.`);
    const cfn = (await this.aws.forEnvironment(stack.environment.account, stack.environment.region, Mode.ForReading)).cloudFormation();
    return readCurrentTemplate(cfn, stack.stackName);
  }

  public async deployStack(options: DeployStackOptions): Promise<DeployStackResult> {
    const toolkitInfo = await loadToolkitInfo(options.stack.environment, this.aws, options.toolkitStackName || DEFAULT_TOOLKIT_STACK_NAME);
    return deployStack({
      stack: options.stack,
      deployName: options.deployName,
      roleArn: options.roleArn,
      notificationArns: options.notificationArns,
      quiet: options.quiet,
      sdk: this.aws,
      reuseAssets: options.reuseAssets,
      toolkitInfo,
      tags: options.tags,
      execute: options.execute,
      force: options.force,
      parameters: options.parameters
    });
  }
}
