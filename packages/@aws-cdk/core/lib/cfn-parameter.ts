import { CfnElement } from './cfn-element';
import { Construct } from './construct-compat';
import { CfnReference } from './private/cfn-reference';
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
  default?: any;

  /**
   * A regular expression that represents the patterns to allow for String types.
   *
   * @default - No constraints on patterns allowed for parameter.
   */
  allowedPattern?: string;

  /**
   * An array containing the list of values allowed for the parameter.
   *
   * @default - No constraints on values allowed for parameter.
   */
  allowedValues?: string[];

  /**
   * A string that explains a constraint when the constraint is violated.
   * For example, without a constraint description, a parameter that has an allowed
   * pattern of [A-Za-z0-9]+ displays the following error message when the user specifies
   * an invalid value:
   *
   * @default - No description with customized error message when user specifies invalid values.
   */
  constraintDescription?: string;

  /**
   * A string of up to 4000 characters that describes the parameter.
   *
   * @default - No description for the parameter.
   */
  description?: string;

  /**
   * An integer value that determines the largest number of characters you want to allow for String types.
   *
   * @default - None.
   */
  maxLength?: number;

  /**
   * A numeric value that determines the largest numeric value you want to allow for Number types.
   *
   * @default - None.
   */
  maxValue?: number;

  /**
   * An integer value that determines the smallest number of characters you want to allow for String types.
   *
   * @default - None.
   */
  minLength?: number;

  /**
   * A numeric value that determines the smallest numeric value you want to allow for Number types.
   *
   * @default - None.
   */
  minValue?: number;

  /**
   * Whether to mask the parameter value when anyone makes a call that describes the stack.
   * If you set the value to ``true``, the parameter value is masked with asterisks (``*****``).
   *
   * @default - Parameter values are not masked.
   */
  noEcho?: boolean;
}

/**
 * A CloudFormation parameter.
 *
 * Use the optional Parameters section to customize your templates.
 * Parameters enable you to input custom values to your template each time you create or
 * update a stack.
 */
export class CfnParameter extends CfnElement {
  private _type: string;
  /**
   * Creates a parameter construct.
   * Note that the name (logical ID) of the parameter will derive from it's `coname` and location
   * within the stack. Therefore, it is recommended that parameters are defined at the stack level.
   *
   * @param scope The parent construct.
   * @param props The parameter properties.
   */
  constructor(scope: Construct, id: string, public props: CfnParameterProps = {}) {
    super(scope, id);

    this._type = props.type || 'String';
  }


  /**
   * The data type for the parameter (DataType).
   *
   * @default String
   */
  public get type(): string {
    return this._type;
  }

  public set type(type: string) {
    this._type = type;
  }


  /**
   * A value of the appropriate type for the template to use if no value is specified
   * when a stack is created. If you define constraints for the parameter, you must specify
   * a value that adheres to those constraints.
   *
   * @default - No default value for parameter.
   */
  public get default(): any {
    return this.props.default;
  }

  public set default(value: any) {
    this.props.default = value;
  }

  /**
   * A regular expression that represents the patterns to allow for String types.
   *
   * @default - No constraints on patterns allowed for parameter.
   */
  public get allowedPattern(): string | undefined {
    return this.props.allowedPattern;
  }

  public set allowedPattern(pattern: string | undefined) {
    this.props.allowedPattern = pattern;
  }

  /**
   * An array containing the list of values allowed for the parameter.
   *
   * @default - No constraints on values allowed for parameter.
   */

  public get allowedValues(): string[] | undefined {
    return this.props.allowedValues;
  }

  public set allowedValues(values: string[] | undefined) {
    this.props.allowedValues = values;
  }

  /**
   * A string that explains a constraint when the constraint is violated.
   * For example, without a constraint description, a parameter that has an allowed
   * pattern of [A-Za-z0-9]+ displays the following error message when the user specifies
   * an invalid value:
   *
   * @default - No description with customized error message when user specifies invalid values.
   */
  public get constraintDescription(): string | undefined {
    return this.props.constraintDescription;
  }

  public set constraintDescription(desc: string | undefined) {
    this.props.constraintDescription = desc;
  }

  /**
   * A string of up to 4000 characters that describes the parameter.
   *
   * @default - No description for the parameter.
   */
  public get description(): string | undefined {
    return this.props.description;
  }

  public set description(desc: string | undefined) {
    this.props.description = desc;
  }


  /**
   * An integer value that determines the largest number of characters you want to allow for String types.
   *
   * @default - None.
   */
  public get maxLength(): number | undefined {
    return this.props.maxLength;
  }

  public set maxLength(len: number | undefined) {
    this.props.maxLength = len;
  }

  /**
   * An integer value that determines the smallest number of characters you want to allow for String types.
   *
   * @default - None.
   */
  public get minLength(): number | undefined {
    return this.props.minLength;
  }

  public set minLength(len: number | undefined) {
    this.props.minLength = len;
  }

  /**
   * A numeric value that determines the largest numeric value you want to allow for Number types.
   *
   * @default - None.
   */
  public get maxValue(): number | undefined {
    return this.props.maxValue;
  }

  public set maxValue(len: number | undefined) {
    this.props.maxValue = len;
  }
  /**
   * A numeric value that determines the smallest numeric value you want to allow for Number types.
   *
   * @default - None.
   */
  public get minValue(): number | undefined {
    return this.props.minValue;
  }

  public set minValue(len: number | undefined) {
    this.props.minValue = len;
  }

  /**
   * Indicates if this parameter is configured with "NoEcho" enabled.
   */
  public get noEcho(): boolean {
    return !!this.props.noEcho;
  }

  public set noEcho(echo: boolean) {
    this.props.noEcho = echo;
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
    if (!isStringType(this._type)) {
      throw new Error(`Parameter type (${this._type}) is not a string type`);
    }
    return Token.asString(this.value);
  }

  /**
   * The parameter value, if it represents a string list.
   */
  public get valueAsList(): string[] {
    if (!isListType(this._type)) {
      throw new Error(`Parameter type (${this._type}) is not a string list type`);
    }
    return Token.asList(this.value);
  }

  /**
   * The parameter value, if it represents a number.
   */
  public get valueAsNumber(): number {
    if (!isNumberType(this._type)) {
      throw new Error(`Parameter type (${this._type}) is not a number type`);
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
          Type: this._type,
          Default: this.props.default,
          AllowedPattern: this.props.allowedPattern,
          AllowedValues: this.props.allowedValues,
          ConstraintDescription: this.props.constraintDescription,
          Description: this.props.description,
          MaxLength: this.props.maxLength,
          MaxValue: this.props.maxValue,
          MinLength: this.props.minLength,
          MinValue: this.props.minValue,
          NoEcho: this.props.noEcho,
        },
      },
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
