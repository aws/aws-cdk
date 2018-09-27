import { Construct } from '../core/construct';
import { Token } from '../core/tokens';
import { Ref, Referenceable } from './stack';

export interface ParameterProps {
  /**
   * The data type for the parameter (DataType).
   */
  type: string;

  /**
   * A value of the appropriate type for the template to use if no value is specified
   * when a stack is created. If you define constraints for the parameter, you must specify
   * a value that adheres to those constraints.
   */
  default?: any;

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
   * A string of up to 4000 characters that describes the parameter.
   */
  description?: string;

  /**
   * An integer value that determines the largest number of characters you want to allow for String types.
   */
  maxLength?: number;

  /**
   * A numeric value that determines the largest numeric value you want to allow for Number types.
   */
  maxValue?: number;

  /**
   * An integer value that determines the smallest number of characters you want to allow for String types.
   */
  minLength?: number;

  /**
   * A numeric value that determines the smallest numeric value you want to allow for Number types.
   */
  minValue?: number;

  /**
   * Whether to mask the parameter value when anyone makes a call that describes the stack.
   * If you set the value to ``true``, the parameter value is masked with asterisks (``*****``).
   */
  noEcho?: boolean;
}

/**
 * Use the optional Parameters section to customize your templates.
 * Parameters enable you to input custom values to your template each time you create or
 * update a stack.
 */
export class Parameter extends Referenceable {
  /**
   * A token that represents the actual value of this parameter.
   */
  public value: Token;

  private properties: ParameterProps;

  /**
   * Creates a parameter construct.
   * Note that the name (logical ID) of the parameter will derive from it's `coname` and location
   * within the stack. Therefore, it is recommended that parameters are defined at the stack level.
   *
   * @param parent The parent construct.
   * @param props The parameter properties.
   */
  constructor(parent: Construct, name: string, props: ParameterProps) {
    super(parent, name);
    this.properties = props;
    this.value = new Ref(this);
  }

  public toCloudFormation(): object {
    return {
      Parameters: {
        [this.logicalId]: {
          Type: this.properties.type,
          Default: this.properties.default,
          AllowedPattern: this.properties.allowedPattern,
          AllowedValues: this.properties.allowedValues,
          ConstraintDescription: this.properties.constraintDescription,
          Description: this.properties.description,
          MaxLength: this.properties.maxLength,
          MaxValue: this.properties.maxValue,
          MinLength: this.properties.minLength,
          MinValue: this.properties.minValue,
          NoEcho: this.properties.noEcho
        }
      }
    };
  }

  /**
   * Allows using parameters as tokens without the need to dereference them.
   * This implicitly implements Token, until we make it an interface.
   */
  public resolve(): any {
    return this.value;
  }
}
