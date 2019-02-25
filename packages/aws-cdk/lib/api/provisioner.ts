import cxapi = require('@aws-cdk/cx-api');
import { debug } from '../logging';
import { deserializeStructure } from '../serialize';
import { Mode } from './aws-auth/credentials';
import { SDK } from './util/sdk';

export type Template = { [key: string]: any };

/**
 * Interface for provisioners
 *
 * Provisioners apply templates to the cloud infrastructure.
 */
export interface IProvisioner {
  readCurrentTemplate(stack: cxapi.SynthesizedStack): Promise<Template>;
}

export interface ProvisionerProps {
  aws: SDK;
}

/**
 * Default provisioner (applies to CloudFormation).
 */
export class CfnProvisioner implements IProvisioner {
  constructor(private readonly props: ProvisionerProps) {
  }

  public async readCurrentTemplate(stack: cxapi.SynthesizedStack): Promise<Template> {
    debug(`Reading existing template for stack ${stack.name}.`);

    const cfn = await this.props.aws.cloudFormation(stack.environment, Mode.ForReading);
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
}