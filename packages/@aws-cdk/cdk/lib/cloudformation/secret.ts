import { Construct } from '../core/construct';
import { Token } from '../core/tokens';
import { Parameter } from './parameter';

/**
 * A token that represents a value that's expected to be a secret, like
 * passwords and keys.
 *
 * It is recommended to use the `SecretParameter` construct in order to import
 * secret values from the SSM Parameter Store instead of storing them in your
 * code.
 *
 * However, you can also just pass in values, like any other token: `new Secret('bla')`
 */
export class Secret extends Token { }

export interface SecretProps {
  /**
   * The name of the SSM parameter where the secret value is stored.
   */
  ssmParameter: string;

  /**
   * A string of up to 4000 characters that describes the parameter.
   * @default No description
   */
  description?: string;

  /**
   * A regular expression that represents the patterns to allow for String types.
   */
  allowedPattern?: string;

  /**
   * An array containing the list of values allowed for the parameter.
   */
  allowedValues?: string[];

  /**
   * A string that explains a constraint when the constraint is violated.
   * For example, without a constraint description, a parameter that has an allowed
   * pattern of [A-Za-z0-9]+ displays the following error message when the user specifies
   * an invalid value:
   */
  constraintDescription?: string;

  /**
   * An integer value that determines the largest number of characters you want to allow for String types.
   */
  maxLength?: number;

  /**
   * An integer value that determines the smallest number of characters you want to allow for String types.
   */
  minLength?: number;
}

/**
 * Defines a secret value resolved from the Systems Manager (SSM) Parameter
 * Store during deployment. This is useful for referencing values that you do
 * not wish to include in your code base, such as secrets, passwords and keys.
 *
 * This construct will add a CloudFormation parameter to your template bound to
 * an SSM parameter (of type "AWS::SSM::Parameter::Value<String>"). Deployment
 * will fail if the value doesn't exist in the target environment.
 *
 * Important: For values other than secrets, prefer to use the
 * `SSMParameterProvider` which resolves SSM parameter in design-time, and
 * ensures that stack deployments are deterministic.
 */
export class SecretParameter extends Construct {
  /**
   * The value of the secret parameter.
   */
  public value: Secret;

  constructor(parent: Construct, name: string, props: SecretProps) {
    super(parent, name);

    const param = new Parameter(this, 'Parameter', {
      type: 'AWS::SSM::Parameter::Value<String>',
      default: props.ssmParameter,
      description: props.description,
      allowedPattern: props.allowedPattern,
      allowedValues: props.allowedValues,
      constraintDescription: props.constraintDescription,
      maxLength: props.maxLength,
      minLength: props.minLength,
      noEcho: true,
    });

    this.value = new Secret(param.ref);
  }
}
