"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnParameter = void 0;
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
        return this.value;
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXBhcmFtZXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNmbi1wYXJhbWV0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0NBQTJDO0FBQzNDLDJEQUF1RDtBQUV2RCxtQ0FBZ0M7QUFDaEMsNkNBQWtEO0FBdUZsRDs7Ozs7O0dBTUc7QUFDSCxNQUFhLFlBQWEsU0FBUSx3QkFBVTtJQWMxQzs7Ozs7OztPQU9HO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUEyQixFQUFFO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO1FBQzVDLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztRQUMxQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFDO1FBQzFELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUN0QyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUNsQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lB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bnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuRWxlbWVudCB9IGZyb20gJy4vY2ZuLWVsZW1lbnQnO1xuaW1wb3J0IHsgQ2ZuUmVmZXJlbmNlIH0gZnJvbSAnLi9wcml2YXRlL2Nmbi1yZWZlcmVuY2UnO1xuaW1wb3J0IHsgSVJlc29sdmFibGUsIElSZXNvbHZlQ29udGV4dCB9IGZyb20gJy4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gJy4vdG9rZW4nO1xuaW1wb3J0IHsgUmVzb2x1dGlvblR5cGVIaW50IH0gZnJvbSAnLi90eXBlLWhpbnRzJztcblxuZXhwb3J0IGludGVyZmFjZSBDZm5QYXJhbWV0ZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgZGF0YSB0eXBlIGZvciB0aGUgcGFyYW1ldGVyIChEYXRhVHlwZSkuXG4gICAqXG4gICAqIEBkZWZhdWx0IFN0cmluZ1xuICAgKi9cbiAgcmVhZG9ubHkgdHlwZT86IHN0cmluZztcblxuICAvKipcbiAgICogQSB2YWx1ZSBvZiB0aGUgYXBwcm9wcmlhdGUgdHlwZSBmb3IgdGhlIHRlbXBsYXRlIHRvIHVzZSBpZiBubyB2YWx1ZSBpcyBzcGVjaWZpZWRcbiAgICogd2hlbiBhIHN0YWNrIGlzIGNyZWF0ZWQuIElmIHlvdSBkZWZpbmUgY29uc3RyYWludHMgZm9yIHRoZSBwYXJhbWV0ZXIsIHlvdSBtdXN0IHNwZWNpZnlcbiAgICogYSB2YWx1ZSB0aGF0IGFkaGVyZXMgdG8gdGhvc2UgY29uc3RyYWludHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVmYXVsdCB2YWx1ZSBmb3IgcGFyYW1ldGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdD86IGFueTtcblxuICAvKipcbiAgICogQSByZWd1bGFyIGV4cHJlc3Npb24gdGhhdCByZXByZXNlbnRzIHRoZSBwYXR0ZXJucyB0byBhbGxvdyBmb3IgU3RyaW5nIHR5cGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGNvbnN0cmFpbnRzIG9uIHBhdHRlcm5zIGFsbG93ZWQgZm9yIHBhcmFtZXRlci5cbiAgICovXG4gIHJlYWRvbmx5IGFsbG93ZWRQYXR0ZXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBjb250YWluaW5nIHRoZSBsaXN0IG9mIHZhbHVlcyBhbGxvd2VkIGZvciB0aGUgcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGNvbnN0cmFpbnRzIG9uIHZhbHVlcyBhbGxvd2VkIGZvciBwYXJhbWV0ZXIuXG4gICAqL1xuICByZWFkb25seSBhbGxvd2VkVmFsdWVzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEEgc3RyaW5nIHRoYXQgZXhwbGFpbnMgYSBjb25zdHJhaW50IHdoZW4gdGhlIGNvbnN0cmFpbnQgaXMgdmlvbGF0ZWQuXG4gICAqIEZvciBleGFtcGxlLCB3aXRob3V0IGEgY29uc3RyYWludCBkZXNjcmlwdGlvbiwgYSBwYXJhbWV0ZXIgdGhhdCBoYXMgYW4gYWxsb3dlZFxuICAgKiBwYXR0ZXJuIG9mIFtBLVphLXowLTldKyBkaXNwbGF5cyB0aGUgZm9sbG93aW5nIGVycm9yIG1lc3NhZ2Ugd2hlbiB0aGUgdXNlciBzcGVjaWZpZXNcbiAgICogYW4gaW52YWxpZCB2YWx1ZTpcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbiB3aXRoIGN1c3RvbWl6ZWQgZXJyb3IgbWVzc2FnZSB3aGVuIHVzZXIgc3BlY2lmaWVzIGludmFsaWQgdmFsdWVzLlxuICAgKi9cbiAgcmVhZG9ubHkgY29uc3RyYWludERlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHN0cmluZyBvZiB1cCB0byA0MDAwIGNoYXJhY3RlcnMgdGhhdCBkZXNjcmliZXMgdGhlIHBhcmFtZXRlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbiBmb3IgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbiBpbnRlZ2VyIHZhbHVlIHRoYXQgZGV0ZXJtaW5lcyB0aGUgbGFyZ2VzdCBudW1iZXIgb2YgY2hhcmFjdGVycyB5b3Ugd2FudCB0byBhbGxvdyBmb3IgU3RyaW5nIHR5cGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICByZWFkb25seSBtYXhMZW5ndGg/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEEgbnVtZXJpYyB2YWx1ZSB0aGF0IGRldGVybWluZXMgdGhlIGxhcmdlc3QgbnVtZXJpYyB2YWx1ZSB5b3Ugd2FudCB0byBhbGxvdyBmb3IgTnVtYmVyIHR5cGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICByZWFkb25seSBtYXhWYWx1ZT86IG51bWJlcjtcblxuICAvKipcbiAgICogQW4gaW50ZWdlciB2YWx1ZSB0aGF0IGRldGVybWluZXMgdGhlIHNtYWxsZXN0IG51bWJlciBvZiBjaGFyYWN0ZXJzIHlvdSB3YW50IHRvIGFsbG93IGZvciBTdHJpbmcgdHlwZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IG1pbkxlbmd0aD86IG51bWJlcjtcblxuICAvKipcbiAgICogQSBudW1lcmljIHZhbHVlIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc21hbGxlc3QgbnVtZXJpYyB2YWx1ZSB5b3Ugd2FudCB0byBhbGxvdyBmb3IgTnVtYmVyIHR5cGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICByZWFkb25seSBtaW5WYWx1ZT86IG51bWJlcjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBtYXNrIHRoZSBwYXJhbWV0ZXIgdmFsdWUgd2hlbiBhbnlvbmUgbWFrZXMgYSBjYWxsIHRoYXQgZGVzY3JpYmVzIHRoZSBzdGFjay5cbiAgICogSWYgeW91IHNldCB0aGUgdmFsdWUgdG8gYGB0cnVlYGAsIHRoZSBwYXJhbWV0ZXIgdmFsdWUgaXMgbWFza2VkIHdpdGggYXN0ZXJpc2tzIChgYCoqKioqYGApLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFBhcmFtZXRlciB2YWx1ZXMgYXJlIG5vdCBtYXNrZWQuXG4gICAqL1xuICByZWFkb25seSBub0VjaG8/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gcGFyYW1ldGVyLlxuICpcbiAqIFVzZSB0aGUgb3B0aW9uYWwgUGFyYW1ldGVycyBzZWN0aW9uIHRvIGN1c3RvbWl6ZSB5b3VyIHRlbXBsYXRlcy5cbiAqIFBhcmFtZXRlcnMgZW5hYmxlIHlvdSB0byBpbnB1dCBjdXN0b20gdmFsdWVzIHRvIHlvdXIgdGVtcGxhdGUgZWFjaCB0aW1lIHlvdSBjcmVhdGUgb3JcbiAqIHVwZGF0ZSBhIHN0YWNrLlxuICovXG5leHBvcnQgY2xhc3MgQ2ZuUGFyYW1ldGVyIGV4dGVuZHMgQ2ZuRWxlbWVudCB7XG4gIHByaXZhdGUgX3R5cGU6IHN0cmluZztcbiAgcHJpdmF0ZSBfZGVmYXVsdD86IGFueTtcbiAgcHJpdmF0ZSBfYWxsb3dlZFBhdHRlcm4/OiBzdHJpbmc7XG4gIHByaXZhdGUgX2FsbG93ZWRWYWx1ZXM/OiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSBfY29uc3RyYWludERlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBwcml2YXRlIF9kZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJpdmF0ZSBfbWF4TGVuZ3RoPzogbnVtYmVyO1xuICBwcml2YXRlIF9tYXhWYWx1ZT86IG51bWJlcjtcbiAgcHJpdmF0ZSBfbWluTGVuZ3RoPzogbnVtYmVyO1xuICBwcml2YXRlIF9taW5WYWx1ZT86IG51bWJlcjtcbiAgcHJpdmF0ZSBfbm9FY2hvPzogYm9vbGVhbjtcbiAgcHJpdmF0ZSB0eXBlSGludDogUmVzb2x1dGlvblR5cGVIaW50O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgcGFyYW1ldGVyIGNvbnN0cnVjdC5cbiAgICogTm90ZSB0aGF0IHRoZSBuYW1lIChsb2dpY2FsIElEKSBvZiB0aGUgcGFyYW1ldGVyIHdpbGwgZGVyaXZlIGZyb20gaXQncyBgY29uYW1lYCBhbmQgbG9jYXRpb25cbiAgICogd2l0aGluIHRoZSBzdGFjay4gVGhlcmVmb3JlLCBpdCBpcyByZWNvbW1lbmRlZCB0aGF0IHBhcmFtZXRlcnMgYXJlIGRlZmluZWQgYXQgdGhlIHN0YWNrIGxldmVsLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjb25zdHJ1Y3QuXG4gICAqIEBwYXJhbSBwcm9wcyBUaGUgcGFyYW1ldGVyIHByb3BlcnRpZXMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuUGFyYW1ldGVyUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLl90eXBlID0gcHJvcHMudHlwZSB8fCAnU3RyaW5nJztcbiAgICB0aGlzLl9kZWZhdWx0ID0gcHJvcHMuZGVmYXVsdDtcbiAgICB0aGlzLl9hbGxvd2VkUGF0dGVybiA9IHByb3BzLmFsbG93ZWRQYXR0ZXJuO1xuICAgIHRoaXMuX2FsbG93ZWRWYWx1ZXMgPSBwcm9wcy5hbGxvd2VkVmFsdWVzO1xuICAgIHRoaXMuX2NvbnN0cmFpbnREZXNjcmlwdGlvbiA9IHByb3BzLmNvbnN0cmFpbnREZXNjcmlwdGlvbjtcbiAgICB0aGlzLl9kZXNjcmlwdGlvbiA9IHByb3BzLmRlc2NyaXB0aW9uO1xuICAgIHRoaXMuX21heExlbmd0aCA9IHByb3BzLm1heExlbmd0aDtcbiAgICB0aGlzLl9tYXhWYWx1ZSA9IHByb3BzLm1heFZhbHVlO1xuICAgIHRoaXMuX21pbkxlbmd0aCA9IHByb3BzLm1pbkxlbmd0aDtcbiAgICB0aGlzLl9taW5WYWx1ZSA9IHByb3BzLm1pblZhbHVlO1xuICAgIHRoaXMuX25vRWNobyA9IHByb3BzLm5vRWNobztcbiAgICB0aGlzLnR5cGVIaW50ID0gdHlwZVRvVHlwZUhpbnQodGhpcy5fdHlwZSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGRhdGEgdHlwZSBmb3IgdGhlIHBhcmFtZXRlciAoRGF0YVR5cGUpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTdHJpbmdcbiAgICovXG4gIHB1YmxpYyBnZXQgdHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl90eXBlO1xuICB9XG5cbiAgcHVibGljIHNldCB0eXBlKHR5cGU6IHN0cmluZykge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMudHlwZUhpbnQgPSB0eXBlVG9UeXBlSGludCh0aGlzLl90eXBlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHZhbHVlIG9mIHRoZSBhcHByb3ByaWF0ZSB0eXBlIGZvciB0aGUgdGVtcGxhdGUgdG8gdXNlIGlmIG5vIHZhbHVlIGlzIHNwZWNpZmllZFxuICAgKiB3aGVuIGEgc3RhY2sgaXMgY3JlYXRlZC4gSWYgeW91IGRlZmluZSBjb25zdHJhaW50cyBmb3IgdGhlIHBhcmFtZXRlciwgeW91IG11c3Qgc3BlY2lmeVxuICAgKiBhIHZhbHVlIHRoYXQgYWRoZXJlcyB0byB0aG9zZSBjb25zdHJhaW50cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZWZhdWx0IHZhbHVlIGZvciBwYXJhbWV0ZXIuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGRlZmF1bHQoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fZGVmYXVsdDtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgZGVmYXVsdCh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fZGVmYXVsdCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgcmVndWxhciBleHByZXNzaW9uIHRoYXQgcmVwcmVzZW50cyB0aGUgcGF0dGVybnMgdG8gYWxsb3cgZm9yIFN0cmluZyB0eXBlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjb25zdHJhaW50cyBvbiBwYXR0ZXJucyBhbGxvd2VkIGZvciBwYXJhbWV0ZXIuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGFsbG93ZWRQYXR0ZXJuKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2FsbG93ZWRQYXR0ZXJuO1xuICB9XG5cbiAgcHVibGljIHNldCBhbGxvd2VkUGF0dGVybihwYXR0ZXJuOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9hbGxvd2VkUGF0dGVybiA9IHBhdHRlcm47XG4gIH1cblxuICAvKipcbiAgICogQW4gYXJyYXkgY29udGFpbmluZyB0aGUgbGlzdCBvZiB2YWx1ZXMgYWxsb3dlZCBmb3IgdGhlIHBhcmFtZXRlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBjb25zdHJhaW50cyBvbiB2YWx1ZXMgYWxsb3dlZCBmb3IgcGFyYW1ldGVyLlxuICAgKi9cbiAgcHVibGljIGdldCBhbGxvd2VkVmFsdWVzKCk6IHN0cmluZ1tdIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fYWxsb3dlZFZhbHVlcztcbiAgfVxuXG4gIHB1YmxpYyBzZXQgYWxsb3dlZFZhbHVlcyh2YWx1ZXM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fYWxsb3dlZFZhbHVlcyA9IHZhbHVlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHN0cmluZyB0aGF0IGV4cGxhaW5zIGEgY29uc3RyYWludCB3aGVuIHRoZSBjb25zdHJhaW50IGlzIHZpb2xhdGVkLlxuICAgKiBGb3IgZXhhbXBsZSwgd2l0aG91dCBhIGNvbnN0cmFpbnQgZGVzY3JpcHRpb24sIGEgcGFyYW1ldGVyIHRoYXQgaGFzIGFuIGFsbG93ZWRcbiAgICogcGF0dGVybiBvZiBbQS1aYS16MC05XSsgZGlzcGxheXMgdGhlIGZvbGxvd2luZyBlcnJvciBtZXNzYWdlIHdoZW4gdGhlIHVzZXIgc3BlY2lmaWVzXG4gICAqIGFuIGludmFsaWQgdmFsdWU6XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVzY3JpcHRpb24gd2l0aCBjdXN0b21pemVkIGVycm9yIG1lc3NhZ2Ugd2hlbiB1c2VyIHNwZWNpZmllcyBpbnZhbGlkIHZhbHVlcy5cbiAgICovXG4gIHB1YmxpYyBnZXQgY29uc3RyYWludERlc2NyaXB0aW9uKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnN0cmFpbnREZXNjcmlwdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgY29uc3RyYWludERlc2NyaXB0aW9uKGRlc2M6IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX2NvbnN0cmFpbnREZXNjcmlwdGlvbiA9IGRlc2M7XG4gIH1cblxuICAvKipcbiAgICogQSBzdHJpbmcgb2YgdXAgdG8gNDAwMCBjaGFyYWN0ZXJzIHRoYXQgZGVzY3JpYmVzIHRoZSBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVzY3JpcHRpb24gZm9yIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGRlc2NyaXB0aW9uKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0aW9uO1xuICB9XG5cbiAgcHVibGljIHNldCBkZXNjcmlwdGlvbihkZXNjOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9kZXNjcmlwdGlvbiA9IGRlc2M7XG4gIH1cblxuICAvKipcbiAgICogQW4gaW50ZWdlciB2YWx1ZSB0aGF0IGRldGVybWluZXMgdGhlIGxhcmdlc3QgbnVtYmVyIG9mIGNoYXJhY3RlcnMgeW91IHdhbnQgdG8gYWxsb3cgZm9yIFN0cmluZyB0eXBlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcHVibGljIGdldCBtYXhMZW5ndGgoKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4TGVuZ3RoO1xuICB9XG5cbiAgcHVibGljIHNldCBtYXhMZW5ndGgobGVuOiBudW1iZXIgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLl9tYXhMZW5ndGggPSBsZW47XG4gIH1cblxuICAvKipcbiAgICogQW4gaW50ZWdlciB2YWx1ZSB0aGF0IGRldGVybWluZXMgdGhlIHNtYWxsZXN0IG51bWJlciBvZiBjaGFyYWN0ZXJzIHlvdSB3YW50IHRvIGFsbG93IGZvciBTdHJpbmcgdHlwZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHB1YmxpYyBnZXQgbWluTGVuZ3RoKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX21pbkxlbmd0aDtcbiAgfVxuXG4gIHB1YmxpYyBzZXQgbWluTGVuZ3RoKGxlbjogbnVtYmVyIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fbWluTGVuZ3RoID0gbGVuO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgbnVtZXJpYyB2YWx1ZSB0aGF0IGRldGVybWluZXMgdGhlIGxhcmdlc3QgbnVtZXJpYyB2YWx1ZSB5b3Ugd2FudCB0byBhbGxvdyBmb3IgTnVtYmVyIHR5cGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICBwdWJsaWMgZ2V0IG1heFZhbHVlKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX21heFZhbHVlO1xuICB9XG5cbiAgcHVibGljIHNldCBtYXhWYWx1ZShsZW46IG51bWJlciB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX21heFZhbHVlID0gbGVuO1xuICB9XG4gIC8qKlxuICAgKiBBIG51bWVyaWMgdmFsdWUgdGhhdCBkZXRlcm1pbmVzIHRoZSBzbWFsbGVzdCBudW1lcmljIHZhbHVlIHlvdSB3YW50IHRvIGFsbG93IGZvciBOdW1iZXIgdHlwZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHB1YmxpYyBnZXQgbWluVmFsdWUoKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fbWluVmFsdWU7XG4gIH1cblxuICBwdWJsaWMgc2V0IG1pblZhbHVlKGxlbjogbnVtYmVyIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fbWluVmFsdWUgPSBsZW47XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoaXMgcGFyYW1ldGVyIGlzIGNvbmZpZ3VyZWQgd2l0aCBcIk5vRWNob1wiIGVuYWJsZWQuXG4gICAqL1xuICBwdWJsaWMgZ2V0IG5vRWNobygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLl9ub0VjaG87XG4gIH1cblxuICBwdWJsaWMgc2V0IG5vRWNobyhlY2hvOiBib29sZWFuKSB7XG4gICAgdGhpcy5fbm9FY2hvID0gZWNobztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGFyYW1ldGVyIHZhbHVlIGFzIGEgVG9rZW5cbiAgICovXG4gIHB1YmxpYyBnZXQgdmFsdWUoKTogSVJlc29sdmFibGUge1xuICAgIHJldHVybiBDZm5SZWZlcmVuY2UuZm9yKHRoaXMsICdSZWYnLCB1bmRlZmluZWQsIHRoaXMudHlwZUhpbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwYXJhbWV0ZXIgdmFsdWUsIGlmIGl0IHJlcHJlc2VudHMgYSBzdHJpbmcuXG4gICAqL1xuICBwdWJsaWMgZ2V0IHZhbHVlQXNTdHJpbmcoKTogc3RyaW5nIHtcbiAgICBpZiAoIWlzU3RyaW5nVHlwZSh0aGlzLnR5cGUpICYmICFpc051bWJlclR5cGUodGhpcy50eXBlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQYXJhbWV0ZXIgdHlwZSAoJHt0aGlzLnR5cGV9KSBpcyBub3QgYSBzdHJpbmcgb3IgbnVtYmVyIHR5cGVgKTtcbiAgICB9XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwYXJhbWV0ZXIgdmFsdWUsIGlmIGl0IHJlcHJlc2VudHMgYSBzdHJpbmcgbGlzdC5cbiAgICovXG4gIHB1YmxpYyBnZXQgdmFsdWVBc0xpc3QoKTogc3RyaW5nW10ge1xuICAgIGlmICghaXNMaXN0VHlwZSh0aGlzLnR5cGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFBhcmFtZXRlciB0eXBlICgke3RoaXMudHlwZX0pIGlzIG5vdCBhIHN0cmluZyBsaXN0IHR5cGVgKTtcbiAgICB9XG4gICAgcmV0dXJuIFRva2VuLmFzTGlzdCh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGFyYW1ldGVyIHZhbHVlLCBpZiBpdCByZXByZXNlbnRzIGEgbnVtYmVyLlxuICAgKi9cbiAgcHVibGljIGdldCB2YWx1ZUFzTnVtYmVyKCk6IG51bWJlciB7XG4gICAgaWYgKCFpc051bWJlclR5cGUodGhpcy50eXBlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQYXJhbWV0ZXIgdHlwZSAoJHt0aGlzLnR5cGV9KSBpcyBub3QgYSBudW1iZXIgdHlwZWApO1xuICAgIH1cbiAgICByZXR1cm4gVG9rZW4uYXNOdW1iZXIodGhpcy52YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3RvQ2xvdWRGb3JtYXRpb24oKTogb2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBbdGhpcy5sb2dpY2FsSWRdOiB7XG4gICAgICAgICAgVHlwZTogdGhpcy50eXBlLFxuICAgICAgICAgIERlZmF1bHQ6IHRoaXMuZGVmYXVsdCxcbiAgICAgICAgICBBbGxvd2VkUGF0dGVybjogdGhpcy5hbGxvd2VkUGF0dGVybixcbiAgICAgICAgICBBbGxvd2VkVmFsdWVzOiB0aGlzLmFsbG93ZWRWYWx1ZXMsXG4gICAgICAgICAgQ29uc3RyYWludERlc2NyaXB0aW9uOiB0aGlzLmNvbnN0cmFpbnREZXNjcmlwdGlvbixcbiAgICAgICAgICBEZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICAgICBNYXhMZW5ndGg6IHRoaXMubWF4TGVuZ3RoLFxuICAgICAgICAgIE1heFZhbHVlOiB0aGlzLm1heFZhbHVlLFxuICAgICAgICAgIE1pbkxlbmd0aDogdGhpcy5taW5MZW5ndGgsXG4gICAgICAgICAgTWluVmFsdWU6IHRoaXMubWluVmFsdWUsXG4gICAgICAgICAgTm9FY2hvOiB0aGlzLl9ub0VjaG8sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZShfY29udGV4dDogSVJlc29sdmVDb250ZXh0KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxufVxuXG4vKipcbiAqIFdoZXRoZXIgdGhlIGdpdmVuIHBhcmFtZXRlciB0eXBlIGxvb2tzIGxpa2UgYSBsaXN0IHR5cGVcbiAqL1xuZnVuY3Rpb24gaXNMaXN0VHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHR5cGUuaW5kZXhPZignTGlzdDwnKSA+PSAwIHx8IHR5cGUuaW5kZXhPZignQ29tbWFEZWxpbWl0ZWRMaXN0JykgPj0gMDtcbn1cblxuLyoqXG4gKiBXaGV0aGVyIHRoZSBnaXZlbiBwYXJhbWV0ZXIgdHlwZSBsb29rcyBsaWtlIGEgbnVtYmVyIHR5cGVcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXJUeXBlKHR5cGU6IHN0cmluZykge1xuICByZXR1cm4gdHlwZSA9PT0gJ051bWJlcic7XG59XG5cbi8qKlxuICogV2hldGhlciB0aGUgZ2l2ZW4gcGFyYW1ldGVyIHR5cGUgbG9va3MgbGlrZSBhIHN0cmluZyB0eXBlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nVHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgcmV0dXJuICFpc0xpc3RUeXBlKHR5cGUpICYmICFpc051bWJlclR5cGUodHlwZSk7XG59XG5cbmZ1bmN0aW9uIHR5cGVUb1R5cGVIaW50KHR5cGU6IHN0cmluZyk6IFJlc29sdXRpb25UeXBlSGludCB7XG4gIGlmIChpc0xpc3RUeXBlKHR5cGUpKSB7XG4gICAgcmV0dXJuIFJlc29sdXRpb25UeXBlSGludC5TVFJJTkdfTElTVDtcbiAgfSBlbHNlIGlmIChpc051bWJlclR5cGUodHlwZSkpIHtcbiAgICByZXR1cm4gUmVzb2x1dGlvblR5cGVIaW50Lk5VTUJFUjtcbiAgfVxuXG4gIHJldHVybiBSZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HO1xufVxuIl19