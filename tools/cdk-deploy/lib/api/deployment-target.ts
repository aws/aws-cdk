import cxapi = require('@aws-cdk/cx-api');
import { debug, deserializeStructure, Mode, SDK } from '@aws-cdk/toolchain-common';
import { deployStack, DeployStackOptions, DeployStackResult } from './deploy-stack';
import { loadToolkitInfo } from './toolkit-info';

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

export interface ProvisionerProps {
  aws: SDK;
  toolkitStackName: string;
}

/**
 * Default provisioner (applies to CloudFormation).
 */
export class CloudFormationDeploymentTarget implements IDeploymentTarget {
  private readonly aws: SDK;
  private readonly toolkitStackName: string;

  constructor(props: ProvisionerProps) {
    this.aws = props.aws;
    this.toolkitStackName = props.toolkitStackName;
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
    const toolkitInfo = await loadToolkitInfo(options.stack.environment, this.aws, this.toolkitStackName || DEFAULT_TOOLKIT_STACK_NAME);
    return deployStack(this.aws, {
      stack: options.stack,
      deployName: options.deployName,
      roleArn: options.roleArn,
      quiet: options.quiet,
      ci: options.ci,
      reuseAssets: options.reuseAssets,
      toolkitInfo,
    });
  }
}