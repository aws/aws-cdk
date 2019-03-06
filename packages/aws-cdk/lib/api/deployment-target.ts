import cxapi = require('@aws-cdk/cx-api');
import { debug } from '../logging';
import { deserializeStructure } from '../serialize';
import { Mode } from './aws-auth/credentials';
import { deployStack, DeployStackResult } from './deploy-stack';
import { loadToolkitInfo } from './toolkit-info';
import { SDK } from './util/sdk';

export const DEFAULT_TOOLKIT_STACK_NAME = 'CDKToolkit';

export type Template = { [key: string]: any };

/**
 * Interface for provisioners
 *
 * Provisioners apply templates to the cloud infrastructure.
 */
export interface IDeploymentTarget {
  readCurrentTemplate(stack: cxapi.SynthesizedStack): Promise<Template>;
  deployStack(options: DeployStackOptions): Promise<DeployStackResult>;
}

export interface DeployStackOptions {
  stack: cxapi.SynthesizedStack;
  roleArn?: string;
  deployName?: string;
  quiet?: boolean;
  ci?: boolean;
  toolkitStackName?: string;
  reuseAssets?: string[];
}

export interface ProvisionerProps {
  aws: SDK;
}

/**
 * Default provisioner (applies to CloudFormation).
 */
export class CloudFormationDeploymentTarget implements IDeploymentTarget {
  private readonly aws: SDK;

  constructor(props: ProvisionerProps) {
    this.aws = props.aws;
  }

  public async readCurrentTemplate(stack: cxapi.SynthesizedStack): Promise<Template> {
    debug(`Reading existing template for stack ${stack.name}.`);

    const cfn = await this.aws.cloudFormation(stack.environment, Mode.ForReading);
    try {
      const response = await cfn.getTemplate({ StackName: stack.name }).promise();
      return (response.TemplateBody && deserializeStructure(response.TemplateBody)) || {};
    } catch (e) {
      if (e.code === 'ValidationError' && e.message === `Stack with id ${stack.name} does not exist`) {
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
      quiet: options.quiet,
      sdk: this.aws,
      ci: options.ci,
      reuseAssets: options.reuseAssets,
      toolkitInfo,
    });
  }
}