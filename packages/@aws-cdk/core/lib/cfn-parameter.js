"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnParameter = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cfn_element_1 = require("./cfn-element");
const cfn_reference_1 = require("./private/cfn-reference");
const token_1 = require("./token");
const type_hints_1 = require("./type-hints");
/**
 * A CloudFormation parameter.
 *
 * Use the optional Parameters section to customize your templates.
 * Parameters enable you to input custom values to your template each time you create or
 * update a stack.
 */
class CfnParameter extends cfn_element_1.CfnElement {
    /**
     * Creates a parameter construct.
     * Note that the name (logical ID) of the parameter will derive from it's `coname` and location
     * within the stack. Therefore, it is recommended that parameters are defined at the stack level.
     *
     * @param scope The parent construct.
     * @param props The parameter properties.
     */
    constructor(scope, id, props = {}) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnParameterProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnParameter);
            }
            throw error;
        }
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
    get type() {
        return this._type;
    }
    set type(type) {
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
    get default() {
        return this._default;
    }
    set default(value) {
        this._default = value;
    }
    /**
     * A regular expression that represents the patterns to allow for String types.
     *
     * @default - No constraints on patterns allowed for parameter.
     */
    get allowedPattern() {
        return this._allowedPattern;
    }
    set allowedPattern(pattern) {
        this._allowedPattern = pattern;
    }
    /**
     * An array containing the list of values allowed for the parameter.
     *
     * @default - No constraints on values allowed for parameter.
     */
    get allowedValues() {
        return this._allowedValues;
    }
    set allowedValues(values) {
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
    get constraintDescription() {
        return this._constraintDescription;
    }
    set constraintDescription(desc) {
        this._constraintDescription = desc;
    }
    /**
     * A string of up to 4000 characters that describes the parameter.
     *
     * @default - No description for the parameter.
     */
    get description() {
        return this._description;
    }
    set description(desc) {
        this._description = desc;
    }
    /**
     * An integer value that determines the largest number of characters you want to allow for String types.
     *
     * @default - None.
     */
    get maxLength() {
        return this._maxLength;
    }
    set maxLength(len) {
        this._maxLength = len;
    }
    /**
     * An integer value that determines the smallest number of characters you want to allow for String types.
     *
     * @default - None.
     */
    get minLength() {
        return this._minLength;
    }
    set minLength(len) {
        this._minLength = len;
    }
    /**
     * A numeric value that determines the largest numeric value you want to allow for Number types.
     *
     * @default - None.
     */
    get maxValue() {
        return this._maxValue;
    }
    set maxValue(len) {
        this._maxValue = len;
    }
    /**
     * A numeric value that determines the smallest numeric value you want to allow for Number types.
     *
     * @default - None.
     */
    get minValue() {
        return this._minValue;
    }
    set minValue(len) {
        this._minValue = len;
    }
    /**
     * Indicates if this parameter is configured with "NoEcho" enabled.
     */
    get noEcho() {
        return !!this._noEcho;
    }
    set noEcho(echo) {
        this._noEcho = echo;
    }
    /**
     * The parameter value as a Token
     */
    get value() {
        return cfn_reference_1.CfnReference.for(this, 'Ref', undefined, this.typeHint);
    }
    /**
     * The parameter value, if it represents a string.
     */
    get valueAsString() {
        if (!isStringType(this.type) && !isNumberType(this.type)) {
            throw new Error(`Parameter type (${this.type}) is not a string or number type`);
        }
        return token_1.Token.asString(this.value);
    }
    /**
     * The parameter value, if it represents a string list.
     */
    get valueAsList() {
        if (!isListType(this.type)) {
            throw new Error(`Parameter type (${this.type}) is not a string list type`);
        }
        return token_1.Token.asList(this.value);
    }
    /**
     * The parameter value, if it represents a number.
     */
    get valueAsNumber() {
        if (!isNumberType(this.type)) {
            throw new Error(`Parameter type (${this.type}) is not a number type`);
        }
        return token_1.Token.asNumber(this.value);
    }
    /**
     * @internal
     */
    _toCloudFormation() {
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
    resolve(_context) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IResolveContext(_context);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.resolve);
            }
            throw error;
        }
        return this.value;
    }
}
_a = JSII_RTTI_SYMBOL_1;
CfnParameter[_a] = { fqn: "@aws-cdk/core.CfnParameter", version: "0.0.0" };
exports.CfnParameter = CfnParameter;
/**
 * Whether the given parameter type looks like a list type
 */
function isListType(type) {
    return type.indexOf('List<') >= 0 || type.indexOf('CommaDelimitedList') >= 0;
}
/**
 * Whether the given parameter type looks like a number type
 */
function isNumberType(type) {
    return type === 'Number';
}
/**
 * Whether the given parameter type looks like a string type
 */
function isStringType(type) {
    return !isListType(type) && !isNumberType(type);
}
function typeToTypeHint(type) {
    if (isListType(type)) {
        return type_hints_1.ResolutionTypeHint.STRING_LIST;
    }
    else if (isNumberType(type)) {
        return type_hints_1.ResolutionTypeHint.NUMBER;
    }
    return type_hints_1.ResolutionTypeHint.STRING;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXBhcmFtZXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNmbi1wYXJhbWV0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsK0NBQTJDO0FBQzNDLDJEQUF1RDtBQUV2RCxtQ0FBZ0M7QUFDaEMsNkNBQWtEO0FBdUZsRDs7Ozs7O0dBTUc7QUFDSCxNQUFhLFlBQWEsU0FBUSx3QkFBVTtJQWMxQzs7Ozs7OztPQU9HO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUEyQixFQUFFO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0F2QlIsWUFBWTs7OztRQXlCckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1FBQzVDLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztRQUMxQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFDO1FBQzFELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUN0QyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUNsQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFL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QUUsSUFBSSxDQUFDLFNBQVM7b0JBQ3pCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPO2lCQUNyQjthQUNGO1NBQ0YsQ0FBQztLQUNIO0lBRU0sT0FBTyxDQUFDLFFBQXlCOzs7Ozs7Ozs7O1FBQ3RDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjs7OztBQXZQVSxvQ0FBWTtBQTBQekI7O0dBRUc7QUFDSCxTQUFTLFVBQVUsQ0FBQyxJQUFZO0lBQzlCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvRSxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLFlBQVksQ0FBQyxJQUFZO0lBQ2hDLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQztBQUMzQixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLFlBQVksQ0FBQyxJQUFZO0lBQ2hDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLElBQVk7SUFDbEMsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDcEIsT0FBTywrQkFBa0IsQ0FBQyxXQUFXLENBQUM7S0FDdkM7U0FBTSxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM3QixPQUFPLCtCQUFrQixDQUFDLE1BQU0sQ0FBQztLQUNsQztJQUVELE9BQU8sK0JBQWtCLENBQUMsTUFBTSxDQUFDO0FBQ25DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkVsZW1lbnQgfSBmcm9tICcuL2Nmbi1lbGVtZW50JztcbmltcG9ydCB7IENmblJlZmVyZW5jZSB9IGZyb20gJy4vcHJpdmF0ZS9jZm4tcmVmZXJlbmNlJztcbmltcG9ydCB7IElSZXNvbHZhYmxlLCBJUmVzb2x2ZUNvbnRleHQgfSBmcm9tICcuL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICcuL3Rva2VuJztcbmltcG9ydCB7IFJlc29sdXRpb25UeXBlSGludCB9IGZyb20gJy4vdHlwZS1oaW50cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuUGFyYW1ldGVyUHJvcHMge1xuICAvKipcbiAgICogVGhlIGRhdGEgdHlwZSBmb3IgdGhlIHBhcmFtZXRlciAoRGF0YVR5cGUpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdHJpbmdcbiAgICovXG4gIHJlYWRvbmx5IHR5cGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgdmFsdWUgb2YgdGhlIGFwcHJvcHJpYXRlIHR5cGUgZm9yIHRoZSB0ZW1wbGF0ZSB0byB1c2UgaWYgbm8gdmFsdWUgaXMgc3BlY2lmaWVkXG4gICAqIHdoZW4gYSBzdGFjayBpcyBjcmVhdGVkLiBJZiB5b3UgZGVmaW5lIGNvbnN0cmFpbnRzIGZvciB0aGUgcGFyYW1ldGVyLCB5b3UgbXVzdCBzcGVjaWZ5XG4gICAqIGEgdmFsdWUgdGhhdCBhZGhlcmVzIHRvIHRob3NlIGNvbnN0cmFpbnRzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlZmF1bHQgdmFsdWUgZm9yIHBhcmFtZXRlci5cbiAgICovXG4gIHJlYWRvbmx5IGRlZmF1bHQ/OiBhbnk7XG5cbiAgLyoqXG4gICAqIEEgcmVndWxhciBleHByZXNzaW9uIHRoYXQgcmVwcmVzZW50cyB0aGUgcGF0dGVybnMgdG8gYWxsb3cgZm9yIFN0cmluZyB0eXBlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjb25zdHJhaW50cyBvbiBwYXR0ZXJucyBhbGxvd2VkIGZvciBwYXJhbWV0ZXIuXG4gICAqL1xuICByZWFkb25seSBhbGxvd2VkUGF0dGVybj86IHN0cmluZztcblxuICAvKipcbiAgICogQW4gYXJyYXkgY29udGFpbmluZyB0aGUgbGlzdCBvZiB2YWx1ZXMgYWxsb3dlZCBmb3IgdGhlIHBhcmFtZXRlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjb25zdHJhaW50cyBvbiB2YWx1ZXMgYWxsb3dlZCBmb3IgcGFyYW1ldGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dlZFZhbHVlcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBIHN0cmluZyB0aGF0IGV4cGxhaW5zIGEgY29uc3RyYWludCB3aGVuIHRoZSBjb25zdHJhaW50IGlzIHZpb2xhdGVkLlxuICAgKiBGb3IgZXhhbXBsZSwgd2l0aG91dCBhIGNvbnN0cmFpbnQgZGVzY3JpcHRpb24sIGEgcGFyYW1ldGVyIHRoYXQgaGFzIGFuIGFsbG93ZWRcbiAgICogcGF0dGVybiBvZiBbQS1aYS16MC05XSsgZGlzcGxheXMgdGhlIGZvbGxvd2luZyBlcnJvciBtZXNzYWdlIHdoZW4gdGhlIHVzZXIgc3BlY2lmaWVzXG4gICAqIGFuIGludmFsaWQgdmFsdWU6XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVzY3JpcHRpb24gd2l0aCBjdXN0b21pemVkIGVycm9yIG1lc3NhZ2Ugd2hlbiB1c2VyIHNwZWNpZmllcyBpbnZhbGlkIHZhbHVlcy5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnN0cmFpbnREZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogQSBzdHJpbmcgb2YgdXAgdG8gNDAwMCBjaGFyYWN0ZXJzIHRoYXQgZGVzY3JpYmVzIHRoZSBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVzY3JpcHRpb24gZm9yIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogQW4gaW50ZWdlciB2YWx1ZSB0aGF0IGRldGVybWluZXMgdGhlIGxhcmdlc3QgbnVtYmVyIG9mIGNoYXJhY3RlcnMgeW91IHdhbnQgdG8gYWxsb3cgZm9yIFN0cmluZyB0eXBlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgbWF4TGVuZ3RoPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBIG51bWVyaWMgdmFsdWUgdGhhdCBkZXRlcm1pbmVzIHRoZSBsYXJnZXN0IG51bWVyaWMgdmFsdWUgeW91IHdhbnQgdG8gYWxsb3cgZm9yIE51bWJlciB0eXBlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgbWF4VmFsdWU/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEFuIGludGVnZXIgdmFsdWUgdGhhdCBkZXRlcm1pbmVzIHRoZSBzbWFsbGVzdCBudW1iZXIgb2YgY2hhcmFjdGVycyB5b3Ugd2FudCB0byBhbGxvdyBmb3IgU3RyaW5nIHR5cGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICByZWFkb25seSBtaW5MZW5ndGg/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEEgbnVtZXJpYyB2YWx1ZSB0aGF0IGRldGVybWluZXMgdGhlIHNtYWxsZXN0IG51bWVyaWMgdmFsdWUgeW91IHdhbnQgdG8gYWxsb3cgZm9yIE51bWJlciB0eXBlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgbWluVmFsdWU/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gbWFzayB0aGUgcGFyYW1ldGVyIHZhbHVlIHdoZW4gYW55b25lIG1ha2VzIGEgY2FsbCB0aGF0IGRlc2NyaWJlcyB0aGUgc3RhY2suXG4gICAqIElmIHlvdSBzZXQgdGhlIHZhbHVlIHRvIGBgdHJ1ZWBgLCB0aGUgcGFyYW1ldGVyIHZhbHVlIGlzIG1hc2tlZCB3aXRoIGFzdGVyaXNrcyAoYGAqKioqKmBgKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBQYXJhbWV0ZXIgdmFsdWVzIGFyZSBub3QgbWFza2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgbm9FY2hvPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIHBhcmFtZXRlci5cbiAqXG4gKiBVc2UgdGhlIG9wdGlvbmFsIFBhcmFtZXRlcnMgc2VjdGlvbiB0byBjdXN0b21pemUgeW91ciB0ZW1wbGF0ZXMuXG4gKiBQYXJhbWV0ZXJzIGVuYWJsZSB5b3UgdG8gaW5wdXQgY3VzdG9tIHZhbHVlcyB0byB5b3VyIHRlbXBsYXRlIGVhY2ggdGltZSB5b3UgY3JlYXRlIG9yXG4gKiB1cGRhdGUgYSBzdGFjay5cbiAqL1xuZXhwb3J0IGNsYXNzIENmblBhcmFtZXRlciBleHRlbmRzIENmbkVsZW1lbnQge1xuICBwcml2YXRlIF90eXBlOiBzdHJpbmc7XG4gIHByaXZhdGUgX2RlZmF1bHQ/OiBhbnk7XG4gIHByaXZhdGUgX2FsbG93ZWRQYXR0ZXJuPzogc3RyaW5nO1xuICBwcml2YXRlIF9hbGxvd2VkVmFsdWVzPzogc3RyaW5nW107XG4gIHByaXZhdGUgX2NvbnN0cmFpbnREZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJpdmF0ZSBfZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIHByaXZhdGUgX21heExlbmd0aD86IG51bWJlcjtcbiAgcHJpdmF0ZSBfbWF4VmFsdWU/OiBudW1iZXI7XG4gIHByaXZhdGUgX21pbkxlbmd0aD86IG51bWJlcjtcbiAgcHJpdmF0ZSBfbWluVmFsdWU/OiBudW1iZXI7XG4gIHByaXZhdGUgX25vRWNobz86IGJvb2xlYW47XG4gIHByaXZhdGUgdHlwZUhpbnQ6IFJlc29sdXRpb25UeXBlSGludDtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHBhcmFtZXRlciBjb25zdHJ1Y3QuXG4gICAqIE5vdGUgdGhhdCB0aGUgbmFtZSAobG9naWNhbCBJRCkgb2YgdGhlIHBhcmFtZXRlciB3aWxsIGRlcml2ZSBmcm9tIGl0J3MgYGNvbmFtZWAgYW5kIGxvY2F0aW9uXG4gICAqIHdpdGhpbiB0aGUgc3RhY2suIFRoZXJlZm9yZSwgaXQgaXMgcmVjb21tZW5kZWQgdGhhdCBwYXJhbWV0ZXJzIGFyZSBkZWZpbmVkIGF0IHRoZSBzdGFjayBsZXZlbC5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFRoZSBwYXJlbnQgY29uc3RydWN0LlxuICAgKiBAcGFyYW0gcHJvcHMgVGhlIHBhcmFtZXRlciBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmblBhcmFtZXRlclByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5fdHlwZSA9IHByb3BzLnR5cGUgfHwgJ1N0cmluZyc7XG4gICAgdGhpcy5fZGVmYXVsdCA9IHByb3BzLmRlZmF1bHQ7XG4gICAgdGhpcy5fYWxsb3dlZFBhdHRlcm4gPSBwcm9wcy5hbGxvd2VkUGF0dGVybjtcbiAgICB0aGlzLl9hbGxvd2VkVmFsdWVzID0gcHJvcHMuYWxsb3dlZFZhbHVlcztcbiAgICB0aGlzLl9jb25zdHJhaW50RGVzY3JpcHRpb24gPSBwcm9wcy5jb25zdHJhaW50RGVzY3JpcHRpb247XG4gICAgdGhpcy5fZGVzY3JpcHRpb24gPSBwcm9wcy5kZXNjcmlwdGlvbjtcbiAgICB0aGlzLl9tYXhMZW5ndGggPSBwcm9wcy5tYXhMZW5ndGg7XG4gICAgdGhpcy5fbWF4VmFsdWUgPSBwcm9wcy5tYXhWYWx1ZTtcbiAgICB0aGlzLl9taW5MZW5ndGggPSBwcm9wcy5taW5MZW5ndGg7XG4gICAgdGhpcy5fbWluVmFsdWUgPSBwcm9wcy5taW5WYWx1ZTtcbiAgICB0aGlzLl9ub0VjaG8gPSBwcm9wcy5ub0VjaG87XG4gICAgdGhpcy50eXBlSGludCA9IHR5cGVUb1R5cGVIaW50KHRoaXMuX3R5cGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkYXRhIHR5cGUgZm9yIHRoZSBwYXJhbWV0ZXIgKERhdGFUeXBlKS5cbiAgICpcbiAgICogQGRlZmF1bHQgU3RyaW5nXG4gICAqL1xuICBwdWJsaWMgZ2V0IHR5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgdHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB0aGlzLnR5cGVIaW50ID0gdHlwZVRvVHlwZUhpbnQodGhpcy5fdHlwZSk7XG4gIH1cblxuICAvKipcbiAgICogQSB2YWx1ZSBvZiB0aGUgYXBwcm9wcmlhdGUgdHlwZSBmb3IgdGhlIHRlbXBsYXRlIHRvIHVzZSBpZiBubyB2YWx1ZSBpcyBzcGVjaWZpZWRcbiAgICogd2hlbiBhIHN0YWNrIGlzIGNyZWF0ZWQuIElmIHlvdSBkZWZpbmUgY29uc3RyYWludHMgZm9yIHRoZSBwYXJhbWV0ZXIsIHlvdSBtdXN0IHNwZWNpZnlcbiAgICogYSB2YWx1ZSB0aGF0IGFkaGVyZXMgdG8gdGhvc2UgY29uc3RyYWludHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVmYXVsdCB2YWx1ZSBmb3IgcGFyYW1ldGVyLlxuICAgKi9cbiAgcHVibGljIGdldCBkZWZhdWx0KCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHQ7XG4gIH1cblxuICBwdWJsaWMgc2V0IGRlZmF1bHQodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX2RlZmF1bHQgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHJlZ3VsYXIgZXhwcmVzc2lvbiB0aGF0IHJlcHJlc2VudHMgdGhlIHBhdHRlcm5zIHRvIGFsbG93IGZvciBTdHJpbmcgdHlwZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gY29uc3RyYWludHMgb24gcGF0dGVybnMgYWxsb3dlZCBmb3IgcGFyYW1ldGVyLlxuICAgKi9cbiAgcHVibGljIGdldCBhbGxvd2VkUGF0dGVybigpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9hbGxvd2VkUGF0dGVybjtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgYWxsb3dlZFBhdHRlcm4ocGF0dGVybjogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fYWxsb3dlZFBhdHRlcm4gPSBwYXR0ZXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGxpc3Qgb2YgdmFsdWVzIGFsbG93ZWQgZm9yIHRoZSBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gY29uc3RyYWludHMgb24gdmFsdWVzIGFsbG93ZWQgZm9yIHBhcmFtZXRlci5cbiAgICovXG4gIHB1YmxpYyBnZXQgYWxsb3dlZFZhbHVlcygpOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2FsbG93ZWRWYWx1ZXM7XG4gIH1cblxuICBwdWJsaWMgc2V0IGFsbG93ZWRWYWx1ZXModmFsdWVzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX2FsbG93ZWRWYWx1ZXMgPSB2YWx1ZXM7XG4gIH1cblxuICAvKipcbiAgICogQSBzdHJpbmcgdGhhdCBleHBsYWlucyBhIGNvbnN0cmFpbnQgd2hlbiB0aGUgY29uc3RyYWludCBpcyB2aW9sYXRlZC5cbiAgICogRm9yIGV4YW1wbGUsIHdpdGhvdXQgYSBjb25zdHJhaW50IGRlc2NyaXB0aW9uLCBhIHBhcmFtZXRlciB0aGF0IGhhcyBhbiBhbGxvd2VkXG4gICAqIHBhdHRlcm4gb2YgW0EtWmEtejAtOV0rIGRpc3BsYXlzIHRoZSBmb2xsb3dpbmcgZXJyb3IgbWVzc2FnZSB3aGVuIHRoZSB1c2VyIHNwZWNpZmllc1xuICAgKiBhbiBpbnZhbGlkIHZhbHVlOlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlc2NyaXB0aW9uIHdpdGggY3VzdG9taXplZCBlcnJvciBtZXNzYWdlIHdoZW4gdXNlciBzcGVjaWZpZXMgaW52YWxpZCB2YWx1ZXMuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGNvbnN0cmFpbnREZXNjcmlwdGlvbigpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9jb25zdHJhaW50RGVzY3JpcHRpb247XG4gIH1cblxuICBwdWJsaWMgc2V0IGNvbnN0cmFpbnREZXNjcmlwdGlvbihkZXNjOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9jb25zdHJhaW50RGVzY3JpcHRpb24gPSBkZXNjO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgc3RyaW5nIG9mIHVwIHRvIDQwMDAgY2hhcmFjdGVycyB0aGF0IGRlc2NyaWJlcyB0aGUgcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlc2NyaXB0aW9uIGZvciB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgcHVibGljIGdldCBkZXNjcmlwdGlvbigpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9kZXNjcmlwdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgZGVzY3JpcHRpb24oZGVzYzogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fZGVzY3JpcHRpb24gPSBkZXNjO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGludGVnZXIgdmFsdWUgdGhhdCBkZXRlcm1pbmVzIHRoZSBsYXJnZXN0IG51bWJlciBvZiBjaGFyYWN0ZXJzIHlvdSB3YW50IHRvIGFsbG93IGZvciBTdHJpbmcgdHlwZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHB1YmxpYyBnZXQgbWF4TGVuZ3RoKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX21heExlbmd0aDtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgbWF4TGVuZ3RoKGxlbjogbnVtYmVyIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fbWF4TGVuZ3RoID0gbGVuO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGludGVnZXIgdmFsdWUgdGhhdCBkZXRlcm1pbmVzIHRoZSBzbWFsbGVzdCBudW1iZXIgb2YgY2hhcmFjdGVycyB5b3Ugd2FudCB0byBhbGxvdyBmb3IgU3RyaW5nIHR5cGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICBwdWJsaWMgZ2V0IG1pbkxlbmd0aCgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9taW5MZW5ndGg7XG4gIH1cblxuICBwdWJsaWMgc2V0IG1pbkxlbmd0aChsZW46IG51bWJlciB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX21pbkxlbmd0aCA9IGxlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIG51bWVyaWMgdmFsdWUgdGhhdCBkZXRlcm1pbmVzIHRoZSBsYXJnZXN0IG51bWVyaWMgdmFsdWUgeW91IHdhbnQgdG8gYWxsb3cgZm9yIE51bWJlciB0eXBlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcHVibGljIGdldCBtYXhWYWx1ZSgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9tYXhWYWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgbWF4VmFsdWUobGVuOiBudW1iZXIgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9tYXhWYWx1ZSA9IGxlbjtcbiAgfVxuICAvKipcbiAgICogQSBudW1lcmljIHZhbHVlIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc21hbGxlc3QgbnVtZXJpYyB2YWx1ZSB5b3Ugd2FudCB0byBhbGxvdyBmb3IgTnVtYmVyIHR5cGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICBwdWJsaWMgZ2V0IG1pblZhbHVlKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX21pblZhbHVlO1xuICB9XG5cbiAgcHVibGljIHNldCBtaW5WYWx1ZShsZW46IG51bWJlciB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX21pblZhbHVlID0gbGVuO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiB0aGlzIHBhcmFtZXRlciBpcyBjb25maWd1cmVkIHdpdGggXCJOb0VjaG9cIiBlbmFibGVkLlxuICAgKi9cbiAgcHVibGljIGdldCBub0VjaG8oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5fbm9FY2hvO1xuICB9XG5cbiAgcHVibGljIHNldCBub0VjaG8oZWNobzogYm9vbGVhbikge1xuICAgIHRoaXMuX25vRWNobyA9IGVjaG87XG4gIH1cblxuICAvKipcbiAgICogVGhlIHBhcmFtZXRlciB2YWx1ZSBhcyBhIFRva2VuXG4gICAqL1xuICBwdWJsaWMgZ2V0IHZhbHVlKCk6IElSZXNvbHZhYmxlIHtcbiAgICByZXR1cm4gQ2ZuUmVmZXJlbmNlLmZvcih0aGlzLCAnUmVmJywgdW5kZWZpbmVkLCB0aGlzLnR5cGVIaW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGFyYW1ldGVyIHZhbHVlLCBpZiBpdCByZXByZXNlbnRzIGEgc3RyaW5nLlxuICAgKi9cbiAgcHVibGljIGdldCB2YWx1ZUFzU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgaWYgKCFpc1N0cmluZ1R5cGUodGhpcy50eXBlKSAmJiAhaXNOdW1iZXJUeXBlKHRoaXMudHlwZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUGFyYW1ldGVyIHR5cGUgKCR7dGhpcy50eXBlfSkgaXMgbm90IGEgc3RyaW5nIG9yIG51bWJlciB0eXBlYCk7XG4gICAgfVxuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGFyYW1ldGVyIHZhbHVlLCBpZiBpdCByZXByZXNlbnRzIGEgc3RyaW5nIGxpc3QuXG4gICAqL1xuICBwdWJsaWMgZ2V0IHZhbHVlQXNMaXN0KCk6IHN0cmluZ1tdIHtcbiAgICBpZiAoIWlzTGlzdFR5cGUodGhpcy50eXBlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQYXJhbWV0ZXIgdHlwZSAoJHt0aGlzLnR5cGV9KSBpcyBub3QgYSBzdHJpbmcgbGlzdCB0eXBlYCk7XG4gICAgfVxuICAgIHJldHVybiBUb2tlbi5hc0xpc3QodGhpcy52YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHBhcmFtZXRlciB2YWx1ZSwgaWYgaXQgcmVwcmVzZW50cyBhIG51bWJlci5cbiAgICovXG4gIHB1YmxpYyBnZXQgdmFsdWVBc051bWJlcigpOiBudW1iZXIge1xuICAgIGlmICghaXNOdW1iZXJUeXBlKHRoaXMudHlwZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUGFyYW1ldGVyIHR5cGUgKCR7dGhpcy50eXBlfSkgaXMgbm90IGEgbnVtYmVyIHR5cGVgKTtcbiAgICB9XG4gICAgcmV0dXJuIFRva2VuLmFzTnVtYmVyKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF90b0Nsb3VkRm9ybWF0aW9uKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFBhcmFtZXRlcnM6IHtcbiAgICAgICAgW3RoaXMubG9naWNhbElkXToge1xuICAgICAgICAgIFR5cGU6IHRoaXMudHlwZSxcbiAgICAgICAgICBEZWZhdWx0OiB0aGlzLmRlZmF1bHQsXG4gICAgICAgICAgQWxsb3dlZFBhdHRlcm46IHRoaXMuYWxsb3dlZFBhdHRlcm4sXG4gICAgICAgICAgQWxsb3dlZFZhbHVlczogdGhpcy5hbGxvd2VkVmFsdWVzLFxuICAgICAgICAgIENvbnN0cmFpbnREZXNjcmlwdGlvbjogdGhpcy5jb25zdHJhaW50RGVzY3JpcHRpb24sXG4gICAgICAgICAgRGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICAgICAgTWF4TGVuZ3RoOiB0aGlzLm1heExlbmd0aCxcbiAgICAgICAgICBNYXhWYWx1ZTogdGhpcy5tYXhWYWx1ZSxcbiAgICAgICAgICBNaW5MZW5ndGg6IHRoaXMubWluTGVuZ3RoLFxuICAgICAgICAgIE1pblZhbHVlOiB0aGlzLm1pblZhbHVlLFxuICAgICAgICAgIE5vRWNobzogdGhpcy5fbm9FY2hvLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoX2NvbnRleHQ6IElSZXNvbHZlQ29udGV4dCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBXaGV0aGVyIHRoZSBnaXZlbiBwYXJhbWV0ZXIgdHlwZSBsb29rcyBsaWtlIGEgbGlzdCB0eXBlXG4gKi9cbmZ1bmN0aW9uIGlzTGlzdFR5cGUodHlwZTogc3RyaW5nKSB7XG4gIHJldHVybiB0eXBlLmluZGV4T2YoJ0xpc3Q8JykgPj0gMCB8fCB0eXBlLmluZGV4T2YoJ0NvbW1hRGVsaW1pdGVkTGlzdCcpID49IDA7XG59XG5cbi8qKlxuICogV2hldGhlciB0aGUgZ2l2ZW4gcGFyYW1ldGVyIHR5cGUgbG9va3MgbGlrZSBhIG51bWJlciB0eXBlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyVHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHR5cGUgPT09ICdOdW1iZXInO1xufVxuXG4vKipcbiAqIFdoZXRoZXIgdGhlIGdpdmVuIHBhcmFtZXRlciB0eXBlIGxvb2tzIGxpa2UgYSBzdHJpbmcgdHlwZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZ1R5cGUodHlwZTogc3RyaW5nKSB7XG4gIHJldHVybiAhaXNMaXN0VHlwZSh0eXBlKSAmJiAhaXNOdW1iZXJUeXBlKHR5cGUpO1xufVxuXG5mdW5jdGlvbiB0eXBlVG9UeXBlSGludCh0eXBlOiBzdHJpbmcpOiBSZXNvbHV0aW9uVHlwZUhpbnQge1xuICBpZiAoaXNMaXN0VHlwZSh0eXBlKSkge1xuICAgIHJldHVybiBSZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HX0xJU1Q7XG4gIH0gZWxzZSBpZiAoaXNOdW1iZXJUeXBlKHR5cGUpKSB7XG4gICAgcmV0dXJuIFJlc29sdXRpb25UeXBlSGludC5OVU1CRVI7XG4gIH1cblxuICByZXR1cm4gUmVzb2x1dGlvblR5cGVIaW50LlNUUklORztcbn1cbiJdfQ==