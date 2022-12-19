import { Construct } from 'constructs';
import { CfnElement } from './cfn-element';
import { CfnReference } from './private/cfn-reference';
import { IResolvable, IResolveContext } from './resolvable';
import { Token } from './token';
import { ResolutionTypeHint } from './type-hints';

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
  private _type: string;
  private _default?: any;
  private _allowedPattern?: string;
  private _allowedValues?: string[];
  private _constraintDescription?: string;
  private _description?: string;
  private _maxLength?: number;
  private _maxValue?: number;
  private _minLength?: number;
  private _minValue?: number;
  private _noEcho?: boolean;
  private typeHint: ResolutionTypeHint;

  /**
   * Creates a parameter construct.
   * Note that the name (logical ID) of the parameter will derive from it's `coname` and location
   * within the stack. Therefore, it is recommended that parameters are defined at the stack level.
   *
   * @param scope The parent construct.
   * @param props The parameter properties.
   */
  constructor(scope: Construct, id: string, props: CfnParameterProps = {}) {
    super(scope, id);

    this._type = props.type || 'String';
    this._default = props.default;
    this._allowedPattern = props.allowedPattern;
    this._allowedValues = props.allowedValues;
    this._constraintDescription = props.constraintDescription;
    this._description = props.description;
    this._maxLength = props.maxLength;
    this._maxValue = props.maxValue;
    this._minLength = props.minLength;
    this._minValue = props.minValue;
    this._noEcho = props.noEcho;
    this.typeHint = typeToTypeHint(this._type);
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
    this.typeHint = typeToTypeHint(this._type);
  }

  /**
   * A value of the appropriate type for the template to use if no value is specified
   * when a stack is created. If you define constraints for the parameter, you must specify
   * a value that adheres to those constraints.
   *
   * @default - No default value for parameter.
   */
  public get default(): any {
    return this._default;
  }

  public set default(value: any) {
    this._default = value;
  }

  /**
   * A regular expression that represents the patterns to allow for String types.
   *
   * @default - No constraints on patterns allowed for parameter.
   */
  public get allowedPattern(): string | undefined {
    return this._allowedPattern;
  }

  public set allowedPattern(pattern: string | undefined) {
    this._allowedPattern = pattern;
  }

  /**
   * An array containing the list of values allowed for the parameter.
   *
   * @default - No constraints on values allowed for parameter.
   */
  public get allowedValues(): string[] | undefined {
    return this._allowedValues;
  }

  public set allowedValues(values: string[] | undefined) {
    this._allowedValues = values;
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
    return this._constraintDescription;
  }

  public set constraintDescription(desc: string | undefined) {
    this._constraintDescription = desc;
  }

  /**
   * A string of up to 4000 characters that describes the parameter.
   *
   * @default - No description for the parameter.
   */
  public get description(): string | undefined {
    return this._description;
  }

  public set description(desc: string | undefined) {
    this._description = desc;
  }

  /**
   * An integer value that determines the largest number of characters you want to allow for String types.
   *
   * @default - None.
   */
  public get maxLength(): number | undefined {
    return this._maxLength;
  }

  public set maxLength(len: number | undefined) {
    this._maxLength = len;
  }

  /**
   * An integer value that determines the smallest number of characters you want to allow for String types.
   *
   * @default - None.
   */
  public get minLength(): number | undefined {
    return this._minLength;
  }

  public set minLength(len: number | undefined) {
    this._minLength = len;
  }

  /**
   * A numeric value that determines the largest numeric value you want to allow for Number types.
   *
   * @default - None.
   */
  public get maxValue(): number | undefined {
    return this._maxValue;
  }

  public set maxValue(len: number | undefined) {
    this._maxValue = len;
  }
  /**
   * A numeric value that determines the smallest numeric value you want to allow for Number types.
   *
   * @default - None.
   */
  public get minValue(): number | undefined {
    return this._minValue;
  }

  public set minValue(len: number | undefined) {
    this._minValue = len;
  }

  /**
   * Indicates if this parameter is configured with "NoEcho" enabled.
   */
  public get noEcho(): boolean {
    return !!this._noEcho;
  }

  public set noEcho(echo: boolean) {
    this._noEcho = echo;
  }

  /**
   * The parameter value as a Token
   */
  public get value(): IResolvable {
    return CfnReference.for(this, 'Ref', undefined, this.typeHint);
  }

  /**
   * The parameter value, if it represents a string.
   */
  public get valueAsString(): string {
    if (!isStringType(this.type) && !isNumberType(this.type)) {
      throw new Error(`Parameter type (${this.type}) is not a string or number type`);
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
          Default: this.default,
          AllowedPattern: this.allowedPattern,
          AllowedValues: this.allowedValues,
          ConstraintDescription: this.constraintDescription,
          Description: this.description,
          MaxLength: this.maxLength,
          MaxValue: this.maxValue,
          MinLength: this.minLength,
          MinValue: this.minValue,
          NoEcho: this._noEcho,
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

function typeToTypeHint(type: string): ResolutionTypeHint {
  if (isListType(type)) {
    return ResolutionTypeHint.STRING_LIST;
  } else if (isNumberType(type)) {
    return ResolutionTypeHint.NUMBER;
  }

  return ResolutionTypeHint.STRING;
}
