import { CfnElement } from './cfn-element';
import { CfnReference } from './cfn-reference';
import { Construct } from './construct';
import { IResolvable, IResolveContext } from './resolvable';
import { Token } from './token';

export interface CfnParameterProps {
  /**
   * The data type for the parameter (DataType).
   *
   * @default String
   */
  readonly type?: string;

  /**
   * A value of the appropriate type for the template to use if no value is specified
   * when a stack is created. If you define constraints for the parameter, you must specify
   * a value that adheres to those constraints.
   *
   * @default - No default value for parameter.
   */
  readonly default?: any;

  /**
   * A regular expression that represents the patterns to allow for String types.
   *
   * @default - No constraints on patterns allowed for parameter.
   */
  readonly allowedPattern?: string;

  /**
   * An array containing the list of values allowed for the parameter.
   *
   * @default - No constraints on values allowed for parameter.
   */
  readonly allowedValues?: string[];

  /**
   * A string that explains a constraint when the constraint is violated.
   * For example, without a constraint description, a parameter that has an allowed
   * pattern of [A-Za-z0-9]+ displays the following error message when the user specifies
   * an invalid value:
   *
   * @default - No description with customized error message when user specifies invalid values.
   */
  readonly constraintDescription?: string;

  /**
   * A string of up to 4000 characters that describes the parameter.
   *
   * @default - No description for the parameter.
   */
  readonly description?: string;

  /**
   * An integer value that determines the largest number of characters you want to allow for String types.
   *
   * @default - None.
   */
  readonly maxLength?: number;

  /**
   * A numeric value that determines the largest numeric value you want to allow for Number types.
   *
   * @default - None.
   */
  readonly maxValue?: number;

  /**
   * An integer value that determines the smallest number of characters you want to allow for String types.
   *
   * @default - None.
   */
  readonly minLength?: number;

  /**
   * A numeric value that determines the smallest numeric value you want to allow for Number types.
   *
   * @default - None.
   */
  readonly minValue?: number;

  /**
   * Whether to mask the parameter value when anyone makes a call that describes the stack.
   * If you set the value to ``true``, the parameter value is masked with asterisks (``*****``).
   *
   * @default - Parameter values are not masked.
   */
  readonly noEcho?: boolean;
}

/**
 * A CloudFormation parameter.
 *
 * Use the optional Parameters section to customize your templates.
 * Parameters enable you to input custom values to your template each time you create or
 * update a stack.
 */
export class CfnParameter extends CfnElement {
  private readonly type: string;

  /**
   * Creates a parameter construct.
   * Note that the name (logical ID) of the parameter will derive from it's `coname` and location
   * within the stack. Therefore, it is recommended that parameters are defined at the stack level.
   *
   * @param scope The parent construct.
   * @param props The parameter properties.
   */
  constructor(scope: Construct, id: string, private readonly props: CfnParameterProps = {}) {
    super(scope, id);

    this.type = props.type || 'String';
  }

  /**
   * Indicates if this parameter is configured with "NoEcho" enabled.
   */
  public get noEcho(): boolean {
    return !!this.props.noEcho;
  }

  /**
   * The parameter value as a Token
   */
  public get value(): IResolvable {
    return CfnReference.for(this, 'Ref');
  }

  /**
   * The parameter value, if it represents a string.
   */
  public get valueAsString(): string {
    if (!isStringType(this.type)) {
      throw new Error(`Parameter type (${this.type}) is not a string type`);
    }
    return Token.asString(this.value);
  }

  /**
   * The parameter value, if it represents a string list.
   */
  public get valueAsList(): string[] {
    if (!isListType(this.type)) {
      throw new Error(`Parameter type (${this.type}) is not a string list type`);
    }
    return Token.asList(this.value);
  }

  /**
   * The parameter value, if it represents a number.
   */
  public get valueAsNumber(): number {
    if (!isNumberType(this.type)) {
      throw new Error(`Parameter type (${this.type}) is not a number type`);
    }
    return Token.asNumber(this.value);
  }

  /**
   * @internal
   */
  public _toCloudFormation(): object {
    return {
      Parameters: {
        [this.logicalId]: {
          Type: this.type,
          Default: this.props.default,
          AllowedPattern: this.props.allowedPattern,
          AllowedValues: this.props.allowedValues,
          ConstraintDescription: this.props.constraintDescription,
          Description: this.props.description,
          MaxLength: this.props.maxLength,
          MaxValue: this.props.maxValue,
          MinLength: this.props.minLength,
          MinValue: this.props.minValue,
          NoEcho: this.props.noEcho
        }
      }
    };
  }

  public resolve(_context: IResolveContext): any {
    return this.value;
  }
}

/**
 * Whether the given parameter type looks like a list type
 */
function isListType(type: string) {
  return type.indexOf('List<') >= 0 || type.indexOf('CommaDelimitedList') >= 0;
}

/**
 * Whether the given parameter type looks like a number type
 */
function isNumberType(type: string) {
  return type === 'Number';
}

/**
 * Whether the given parameter type looks like a string type
 */
function isStringType(type: string) {
  return !isListType(type) && !isNumberType(type);
}
