import { Construct } from 'constructs';
import { CfnElement } from './cfn-element';
import { IResolvable, IResolveContext } from './resolvable';
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
export declare class CfnParameter extends CfnElement {
    private _type;
    private _default?;
    private _allowedPattern?;
    private _allowedValues?;
    private _constraintDescription?;
    private _description?;
    private _maxLength?;
    private _maxValue?;
    private _minLength?;
    private _minValue?;
    private _noEcho?;
    private typeHint;
    /**
     * Creates a parameter construct.
     * Note that the name (logical ID) of the parameter will derive from it's `coname` and location
     * within the stack. Therefore, it is recommended that parameters are defined at the stack level.
     *
     * @param scope The parent construct.
     * @param props The parameter properties.
     */
    constructor(scope: Construct, id: string, props?: CfnParameterProps);
    /**
     * The data type for the parameter (DataType).
     *
     * @default String
     */
    get type(): string;
    set type(type: string);
    /**
     * A value of the appropriate type for the template to use if no value is specified
     * when a stack is created. If you define constraints for the parameter, you must specify
     * a value that adheres to those constraints.
     *
     * @default - No default value for parameter.
     */
    get default(): any;
    set default(value: any);
    /**
     * A regular expression that represents the patterns to allow for String types.
     *
     * @default - No constraints on patterns allowed for parameter.
     */
    get allowedPattern(): string | undefined;
    set allowedPattern(pattern: string | undefined);
    /**
     * An array containing the list of values allowed for the parameter.
     *
     * @default - No constraints on values allowed for parameter.
     */
    get allowedValues(): string[] | undefined;
    set allowedValues(values: string[] | undefined);
    /**
     * A string that explains a constraint when the constraint is violated.
     * For example, without a constraint description, a parameter that has an allowed
     * pattern of [A-Za-z0-9]+ displays the following error message when the user specifies
     * an invalid value:
     *
     * @default - No description with customized error message when user specifies invalid values.
     */
    get constraintDescription(): string | undefined;
    set constraintDescription(desc: string | undefined);
    /**
     * A string of up to 4000 characters that describes the parameter.
     *
     * @default - No description for the parameter.
     */
    get description(): string | undefined;
    set description(desc: string | undefined);
    /**
     * An integer value that determines the largest number of characters you want to allow for String types.
     *
     * @default - None.
     */
    get maxLength(): number | undefined;
    set maxLength(len: number | undefined);
    /**
     * An integer value that determines the smallest number of characters you want to allow for String types.
     *
     * @default - None.
     */
    get minLength(): number | undefined;
    set minLength(len: number | undefined);
    /**
     * A numeric value that determines the largest numeric value you want to allow for Number types.
     *
     * @default - None.
     */
    get maxValue(): number | undefined;
    set maxValue(len: number | undefined);
    /**
     * A numeric value that determines the smallest numeric value you want to allow for Number types.
     *
     * @default - None.
     */
    get minValue(): number | undefined;
    set minValue(len: number | undefined);
    /**
     * Indicates if this parameter is configured with "NoEcho" enabled.
     */
    get noEcho(): boolean;
    set noEcho(echo: boolean);
    /**
     * The parameter value as a Token
     */
    get value(): IResolvable;
    /**
     * The parameter value, if it represents a string.
     */
    get valueAsString(): string;
    /**
     * The parameter value, if it represents a string list.
     */
    get valueAsList(): string[];
    /**
     * The parameter value, if it represents a number.
     */
    get valueAsNumber(): number;
    /**
     * @internal
     */
    _toCloudFormation(): object;
    resolve(_context: IResolveContext): any;
}
