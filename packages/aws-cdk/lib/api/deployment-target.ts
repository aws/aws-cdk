import { CloudFormationStackArtifact } from '@aws-cdk/cx-api';
import { Tag } from "../api/cxapp/stacks";
import { debug } from '../logging';
import { deserializeStructure } from '../serialize';
import { Mode } from './aws-auth/credentials';
import { deployStack, DeployStackResult } from './deploy-stack';
import { loadToolkitInfo } from './toolkit-info';
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
}

export interface DeployStackOptions {
  stack: CloudFormationStackArtifact;
  roleArn?: string;
  notificationArns?: string[];
  deployName?: string;
  quiet?: boolean;
  ci?: boolean;
  toolkitStackName?: string;
  reuseAssets?: string[];
  tags?: Tag[];
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

    const cfn = await this.aws.cloudFormation(stack.environment.account, stack.environment.region, Mode.ForReading);
    try {
      const response = await cfn.getTemplate({ StackName: stack.stackName }).promise();
      return (response.TemplateBody && deserializeStructure(response.TemplateBody)) || {};
    } catch (e) {
      if (e.code === 'ValidationError' && e.message === `Stack with id ${stack.stackName} does not exist`) {
        return {};
      } else {
        throw e;
      }
    }
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
      ci: options.ci,
      reuseAssets: options.reuseAssets,
      toolkitInfo,
      tags: options.tags
    });
  }
}
