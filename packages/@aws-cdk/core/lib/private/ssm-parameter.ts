import { CfnResource } from '../cfn-resource';
import { Construct } from '../construct-compat';

export interface SsmStringParameterProps {
  /**
   * Name of the ssm string parameter. Should be unique for the AWS account.
   */
  readonly name: string;
  /**
   * The value stored in SSM
   */
  readonly value: string;
  /**
   * Optional description
   */
  readonly description?: string;
}

export class SsmStringParameter extends Construct {
  constructor(scope: Construct, id: string, props: SsmStringParameterProps) {
    super(scope, id);

    new CfnResource(this, id, {
      type: 'AWS::SSM::Parameter',
      properties: {
        Name: props.name,
        Description: props.description,
        Type: 'String',
        Value: props.value,
      },
    });
  }
}