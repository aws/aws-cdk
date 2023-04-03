"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.unionValidator = exports.requireProperty = exports.requiredValidator = exports.propertyValidator = exports.hashValidator = exports.listValidator = exports.validateCfnTag = exports.validateObject = exports.validateDate = exports.validateBoolean = exports.validateNumber = exports.validateString = exports.canInspect = exports.VALIDATION_SUCCESS = exports.ValidationResults = exports.ValidationResult = exports.unionMapper = exports.hashMapper = exports.listMapper = exports.cfnTagToCloudFormation = exports.dateToCloudFormation = exports.numberToCloudFormation = exports.objectToCloudFormation = exports.booleanToCloudFormation = exports.stringToCloudFormation = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
function identity(x) {
    return x;
}
exports.stringToCloudFormation = identity;
exports.booleanToCloudFormation = identity;
exports.objectToCloudFormation = identity;
exports.numberToCloudFormation = identity;
/**
 * The date needs to be formatted as an ISO date in UTC
 *
 * Some usage sites require a date, some require a timestamp. We'll
 * always output a timestamp and hope the parser on the other end
 * is smart enough to ignore the time part... (?)
 */
function dateToCloudFormation(x) {
    if (!x) {
        return undefined;
    }
    // eslint-disable-next-line max-len
    return `${x.getUTCFullYear()}-${pad(x.getUTCMonth() + 1)}-${pad(x.getUTCDate())}T${pad(x.getUTCHours())}:${pad(x.getUTCMinutes())}:${pad(x.getUTCSeconds())}`;
}
exports.dateToCloudFormation = dateToCloudFormation;
/**
 * Pad a number to 2 decimal places
 */
function pad(x) {
    if (x < 10) {
        return '0' + x.toString();
    }
    return x.toString();
}
/**
 * Turn a tag object into the proper CloudFormation representation
 */
function cfnTagToCloudFormation(x) {
    return {
        Key: x.key,
        Value: x.value,
    };
}
exports.cfnTagToCloudFormation = cfnTagToCloudFormation;
function listMapper(elementMapper) {
    return (x) => {
        if (!canInspect(x)) {
            return x;
        }
        return x.map(elementMapper);
    };
}
exports.listMapper = listMapper;
function hashMapper(elementMapper) {
    return (x) => {
        if (!canInspect(x)) {
            return x;
        }
        const ret = {};
        Object.keys(x).forEach((key) => {
            ret[key] = elementMapper(x[key]);
        });
        return ret;
    };
}
exports.hashMapper = hashMapper;
/**
 * Return a union mapper
 *
 * Takes a list of validators and a list of mappers, which should correspond pairwise.
 *
 * The mapper of the first successful validator will be called.
 */
function unionMapper(validators, mappers) {
    if (validators.length !== mappers.length) {
        throw Error('Not the same amount of validators and mappers passed to unionMapper()');
    }
    return (x) => {
        if (!canInspect(x)) {
            return x;
        }
        for (let i = 0; i < validators.length; i++) {
            if (validators[i](x).isSuccess) {
                return mappers[i](x);
            }
        }
        // Should not be possible because the union must have passed validation before this function
        // will be called, but catch it anyway.
        throw new TypeError('No validators matched in the union()');
    };
}
exports.unionMapper = unionMapper;
// ----------------------------------------------------------------------
// VALIDATORS
//
// These are used while checking that supplied property bags match the expected schema
//
// We have a couple of datatypes that model validation errors and collections of validation
// errors (together forming a tree of errors so that we can trace validation errors through
// an object graph), and validators.
//
// Validators are simply functions that take a value and return a validation results. Then
// we have some combinators to turn primitive validators into more complex validators.
//
/**
 * Representation of validation results
 *
 * Models a tree of validation errors so that we have as much information as possible
 * about the failure that occurred.
 */
class ValidationResult {
    constructor(errorMessage = '', results = new ValidationResults()) {
        this.errorMessage = errorMessage;
        this.results = results;
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ValidationResults(results);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ValidationResult);
            }
            throw error;
        }
    }
    get isSuccess() {
        return !this.errorMessage && this.results.isSuccess;
    }
    /**
     * Turn a failed validation into an exception
     */
    assertSuccess() {
        if (!this.isSuccess) {
            let message = this.errorTree();
            // The first letter will be lowercase, so uppercase it for a nicer error message
            message = message.slice(0, 1).toUpperCase() + message.slice(1);
            throw new CfnSynthesisError(message);
        }
    }
    /**
     * Return a string rendering of the tree of validation failures
     */
    errorTree() {
        const childMessages = this.results.errorTreeList();
        return this.errorMessage + (childMessages.length ? `\n  ${childMessages.replace(/\n/g, '\n  ')}` : '');
    }
    /**
     * Wrap this result with an error message, if it concerns an error
     */
    prefix(message) {
        if (this.isSuccess) {
            return this;
        }
        return new ValidationResult(`${message}: ${this.errorMessage}`, this.results);
    }
}
exports.ValidationResult = ValidationResult;
_a = JSII_RTTI_SYMBOL_1;
ValidationResult[_a] = { fqn: "@aws-cdk/core.ValidationResult", version: "0.0.0" };
/**
 * A collection of validation results
 */
class ValidationResults {
    constructor(results = []) {
        this.results = results;
    }
    collect(result) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ValidationResult(result);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.collect);
            }
            throw error;
        }
        // Only collect failures
        if (!result.isSuccess) {
            this.results.push(result);
        }
    }
    get isSuccess() {
        return this.results.every(x => x.isSuccess);
    }
    errorTreeList() {
        return this.results.map(child => child.errorTree()).join('\n');
    }
    /**
     * Wrap up all validation results into a single tree node
     *
     * If there are failures in the collection, add a message, otherwise
     * return a success.
     */
    wrap(message) {
        if (this.isSuccess) {
            return exports.VALIDATION_SUCCESS;
        }
        return new ValidationResult(message, this);
    }
}
exports.ValidationResults = ValidationResults;
_b = JSII_RTTI_SYMBOL_1;
ValidationResults[_b] = { fqn: "@aws-cdk/core.ValidationResults", version: "0.0.0" };
// Singleton object to save on allocations
exports.VALIDATION_SUCCESS = new ValidationResult();
/**
 * Return whether this object can be validated at all
 *
 * True unless it's undefined or a CloudFormation intrinsic
 */
function canInspect(x) {
    // Note: using weak equality on purpose, we also want to catch undefined
    return (x != null && !isCloudFormationIntrinsic(x) && !isCloudFormationDynamicReference(x));
}
exports.canInspect = canInspect;
// CloudFormation validators for primitive types
function validateString(x) {
    if (canInspect(x) && typeof x !== 'string') {
        return new ValidationResult(`${JSON.stringify(x)} should be a string`);
    }
    return exports.VALIDATION_SUCCESS;
}
exports.validateString = validateString;
function validateNumber(x) {
    if (canInspect(x) && typeof x !== 'number') {
        return new ValidationResult(`${JSON.stringify(x)} should be a number`);
    }
    return exports.VALIDATION_SUCCESS;
}
exports.validateNumber = validateNumber;
function validateBoolean(x) {
    if (canInspect(x) && typeof x !== 'boolean') {
        return new ValidationResult(`${JSON.stringify(x)} should be a boolean`);
    }
    return exports.VALIDATION_SUCCESS;
}
exports.validateBoolean = validateBoolean;
function validateDate(x) {
    if (canInspect(x) && !(x instanceof Date)) {
        return new ValidationResult(`${JSON.stringify(x)} should be a Date`);
    }
    if (x !== undefined && isNaN(x.getTime())) {
        return new ValidationResult('got an unparseable Date');
    }
    return exports.VALIDATION_SUCCESS;
}
exports.validateDate = validateDate;
function validateObject(x) {
    if (canInspect(x) && typeof x !== 'object') {
        return new ValidationResult(`${JSON.stringify(x)} should be an 'object'`);
    }
    return exports.VALIDATION_SUCCESS;
}
exports.validateObject = validateObject;
function validateCfnTag(x) {
    if (!canInspect(x)) {
        return exports.VALIDATION_SUCCESS;
    }
    if (x.key == null || x.value == null) {
        return new ValidationResult(`${JSON.stringify(x)} should have a 'key' and a 'value' property`);
    }
    return exports.VALIDATION_SUCCESS;
}
exports.validateCfnTag = validateCfnTag;
/**
 * Return a list validator based on the given element validator
 */
function listValidator(elementValidator) {
    return (x) => {
        if (!canInspect(x)) {
            return exports.VALIDATION_SUCCESS;
        }
        if (!x.forEach) {
            return new ValidationResult(`${JSON.stringify(x)} should be a list`);
        }
        for (let i = 0; i < x.length; i++) {
            const element = x[i];
            const result = elementValidator(element);
            if (!result.isSuccess) {
                return result.prefix(`element ${i}`);
            }
        }
        return exports.VALIDATION_SUCCESS;
    };
}
exports.listValidator = listValidator;
/**
 * Return a hash validator based on the given element validator
 */
function hashValidator(elementValidator) {
    return (x) => {
        if (!canInspect(x)) {
            return exports.VALIDATION_SUCCESS;
        }
        for (const key of Object.keys(x)) {
            const result = elementValidator(x[key]);
            if (!result.isSuccess) {
                return result.prefix(`element '${key}'`);
            }
        }
        return exports.VALIDATION_SUCCESS;
    };
}
exports.hashValidator = hashValidator;
/**
 * Decorate a validator with a message clarifying the property the failure is for.
 */
function propertyValidator(propName, validator) {
    return (x) => {
        return validator(x).prefix(propName);
    };
}
exports.propertyValidator = propertyValidator;
/**
 * Return a validator that will fail if the passed property is not present
 *
 * Does not distinguish between the property actually not being present, vs being present but 'null'
 * or 'undefined' (courtesy of JavaScript), which is generally the behavior that we want.
 *
 * Empty strings are considered "present"--don't know if this agrees with how CloudFormation looks
 * at the world.
 */
function requiredValidator(x) {
    if (x == null) {
        return new ValidationResult('required but missing');
    }
    return exports.VALIDATION_SUCCESS;
}
exports.requiredValidator = requiredValidator;
/**
 * Require a property from a property bag.
 *
 * @param props  the property bag from which a property is required.
 * @param name   the name of the required property.
 * @param typeName the name of the construct type that requires the property
 *
 * @returns the value of ``props[name]``
 *
 * @throws if the property ``name`` is not present in ``props``.
 */
function requireProperty(props, name, context) {
    const value = props[name];
    if (value == null) {
        throw new Error(`${context.toString()} is missing required property: ${name}`);
    }
    // Possibly add type-checking here...
    return value;
}
exports.requireProperty = requireProperty;
/**
 * Validates if any of the given validators matches
 *
 * We add either/or words to the front of the error mesages so that they read
 * more nicely. Example:
 *
 *   Properties not correct for 'FunctionProps'
 *     codeUri: not one of the possible types
 *       either: properties not correct for 'S3LocationProperty'
 *         bucket: required but missing
 *         key: required but missing
 *         version: required but missing
 *       or: '3' should be a 'string'
 *
 */
function unionValidator(...validators) {
    return (x) => {
        const results = new ValidationResults();
        let eitherOr = 'either';
        for (const validator of validators) {
            const result = validator(x);
            if (result.isSuccess) {
                return result;
            }
            results.collect(result.prefix(eitherOr));
            eitherOr = 'or';
        }
        return results.wrap('not one of the possible types');
    };
}
exports.unionValidator = unionValidator;
/**
 * Return whether the indicated value represents a CloudFormation intrinsic.
 *
 * CloudFormation intrinsics are modeled as objects with a single key, which
 * look like: { "Fn::GetAtt": [...] } or similar.
 */
function isCloudFormationIntrinsic(x) {
    if (!(typeof x === 'object')) {
        return false;
    }
    const keys = Object.keys(x);
    if (keys.length !== 1) {
        return false;
    }
    return keys[0] === 'Ref' || keys[0].slice(0, 4) === 'Fn::';
}
/**
 * Check whether the indicated value is a CloudFormation dynamic reference.
 *
 * CloudFormation dynamic references take the format: '{{resolve:service-name:reference-key}}'
 */
function isCloudFormationDynamicReference(x) {
    return (typeof x === 'string' && x.startsWith('{{resolve:') && x.endsWith('}}'));
}
// Cannot be public because JSII gets confused about es5.d.ts
class CfnSynthesisError extends Error {
    constructor() {
        super(...arguments);
        this.type = 'CfnSynthesisError';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJ1bnRpbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBWUEsU0FBUyxRQUFRLENBQUMsQ0FBTTtJQUN0QixPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFFWSxRQUFBLHNCQUFzQixHQUFXLFFBQVEsQ0FBQztBQUMxQyxRQUFBLHVCQUF1QixHQUFXLFFBQVEsQ0FBQztBQUMzQyxRQUFBLHNCQUFzQixHQUFXLFFBQVEsQ0FBQztBQUMxQyxRQUFBLHNCQUFzQixHQUFXLFFBQVEsQ0FBQztBQUV2RDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixvQkFBb0IsQ0FBQyxDQUFRO0lBQzNDLElBQUksQ0FBQyxDQUFDLEVBQUU7UUFDTixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELG1DQUFtQztJQUNuQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDaEssQ0FBQztBQVBELG9EQU9DO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLEdBQUcsQ0FBQyxDQUFTO0lBQ3BCLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNWLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUMzQjtJQUNELE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3RCLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLHNCQUFzQixDQUFDLENBQU07SUFDM0MsT0FBTztRQUNMLEdBQUcs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O0FBQzdELENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxnQ0FBZ0MsQ0FBQyxDQUFNO0lBQzlDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkYsQ0FBQztBQUVELDZEQUE2RDtBQUM3RCxNQUFNLGlCQUFrQixTQUFRLEtBQUs7SUFBckM7O1FBQ2tCLFNBQUksR0FBRyxtQkFBbUIsQ0FBQztJQUM3QyxDQUFDO0NBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUFJPUEVSVFkgTUFQUEVSU1xuLy9cbi8vIFRoZXNlIGFyZSB1c2VkIHdoaWxlIGNvbnZlcnRpbmcgZ2VuZXJhdGVkIGNsYXNzZXMvcHJvcGVydHkgYmFncyB0byBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0eSBvYmplY3RzXG4vL1xuLy8gV2UgdXNlIGlkZW50aXR5IG1hcHBlcnMgZm9yIHRoZSBwcmltaXRpdmUgdHlwZXMuIFRoZXNlIGRvbid0IGRvIGFueXRoaW5nIGJ1dCBhcmUgdGhlcmUgdG8gbWFrZSB0aGUgY29kZVxuLy8gZ2VuZXJhdGlvbiB3b3JrIG91dCBuaWNlbHkgKHNvIHRoZSBjb2RlIGdlbmVyYXRvciBkb2Vzbid0IG5lZWQgdG8gZW1pdCBkaWZmZXJlbnQgY29kZSBmb3IgcHJpbWl0aXZlXG4vLyB2cy4gY29tcGxleCB0eXBlcykuXG5leHBvcnQgdHlwZSBNYXBwZXIgPSAoeDogYW55KSA9PiBhbnk7XG5cbmZ1bmN0aW9uIGlkZW50aXR5KHg6IGFueSkge1xuICByZXR1cm4geDtcbn1cblxuZXhwb3J0IGNvbnN0IHN0cmluZ1RvQ2xvdWRGb3JtYXRpb246IE1hcHBlciA9IGlkZW50aXR5O1xuZXhwb3J0IGNvbnN0IGJvb2xlYW5Ub0Nsb3VkRm9ybWF0aW9uOiBNYXBwZXIgPSBpZGVudGl0eTtcbmV4cG9ydCBjb25zdCBvYmplY3RUb0Nsb3VkRm9ybWF0aW9uOiBNYXBwZXIgPSBpZGVudGl0eTtcbmV4cG9ydCBjb25zdCBudW1iZXJUb0Nsb3VkRm9ybWF0aW9uOiBNYXBwZXIgPSBpZGVudGl0eTtcblxuLyoqXG4gKiBUaGUgZGF0ZSBuZWVkcyB0byBiZSBmb3JtYXR0ZWQgYXMgYW4gSVNPIGRhdGUgaW4gVVRDXG4gKlxuICogU29tZSB1c2FnZSBzaXRlcyByZXF1aXJlIGEgZGF0ZSwgc29tZSByZXF1aXJlIGEgdGltZXN0YW1wLiBXZSdsbFxuICogYWx3YXlzIG91dHB1dCBhIHRpbWVzdGFtcCBhbmQgaG9wZSB0aGUgcGFyc2VyIG9uIHRoZSBvdGhlciBlbmRcbiAqIGlzIHNtYXJ0IGVub3VnaCB0byBpZ25vcmUgdGhlIHRpbWUgcGFydC4uLiAoPylcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGVUb0Nsb3VkRm9ybWF0aW9uKHg/OiBEYXRlKTogYW55IHtcbiAgaWYgKCF4KSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gIHJldHVybiBgJHt4LmdldFVUQ0Z1bGxZZWFyKCl9LSR7cGFkKHguZ2V0VVRDTW9udGgoKSArIDEpfS0ke3BhZCh4LmdldFVUQ0RhdGUoKSl9VCR7cGFkKHguZ2V0VVRDSG91cnMoKSl9OiR7cGFkKHguZ2V0VVRDTWludXRlcygpKX06JHtwYWQoeC5nZXRVVENTZWNvbmRzKCkpfWA7XG59XG5cbi8qKlxuICogUGFkIGEgbnVtYmVyIHRvIDIgZGVjaW1hbCBwbGFjZXNcbiAqL1xuZnVuY3Rpb24gcGFkKHg6IG51bWJlcikge1xuICBpZiAoeCA8IDEwKSB7XG4gICAgcmV0dXJuICcwJyArIHgudG9TdHJpbmcoKTtcbiAgfVxuICByZXR1cm4geC50b1N0cmluZygpO1xufVxuXG4vKipcbiAqIFR1cm4gYSB0YWcgb2JqZWN0IGludG8gdGhlIHByb3BlciBDbG91ZEZvcm1hdGlvbiByZXByZXNlbnRhdGlvblxuICovXG5leHBvcnQgZnVuY3Rpb24gY2ZuVGFnVG9DbG91ZEZvcm1hdGlvbih4OiBhbnkpOiBhbnkge1xuICByZXR1cm4ge1xuICAgIEtleTogeC5rZXksXG4gICAgVmFsdWU6IHgudmFsdWUsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXN0TWFwcGVyKGVsZW1lbnRNYXBwZXI6IE1hcHBlcik6IE1hcHBlciB7XG4gIHJldHVybiAoeDogYW55KSA9PiB7XG4gICAgaWYgKCFjYW5JbnNwZWN0KHgpKSB7IHJldHVybiB4OyB9XG4gICAgcmV0dXJuIHgubWFwKGVsZW1lbnRNYXBwZXIpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzaE1hcHBlcihlbGVtZW50TWFwcGVyOiBNYXBwZXIpOiBNYXBwZXIge1xuICByZXR1cm4gKHg6IGFueSkgPT4ge1xuICAgIGlmICghY2FuSW5zcGVjdCh4KSkgeyByZXR1cm4geDsgfVxuXG4gICAgY29uc3QgcmV0OiBhbnkgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKHgpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgcmV0W2tleV0gPSBlbGVtZW50TWFwcGVyKHhba2V5XSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmV0O1xuICB9O1xufVxuXG4vKipcbiAqIFJldHVybiBhIHVuaW9uIG1hcHBlclxuICpcbiAqIFRha2VzIGEgbGlzdCBvZiB2YWxpZGF0b3JzIGFuZCBhIGxpc3Qgb2YgbWFwcGVycywgd2hpY2ggc2hvdWxkIGNvcnJlc3BvbmQgcGFpcndpc2UuXG4gKlxuICogVGhlIG1hcHBlciBvZiB0aGUgZmlyc3Qgc3VjY2Vzc2Z1bCB2YWxpZGF0b3Igd2lsbCBiZSBjYWxsZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlvbk1hcHBlcih2YWxpZGF0b3JzOiBWYWxpZGF0b3JbXSwgbWFwcGVyczogTWFwcGVyW10pOiBNYXBwZXIge1xuICBpZiAodmFsaWRhdG9ycy5sZW5ndGggIT09IG1hcHBlcnMubGVuZ3RoKSB7XG4gICAgdGhyb3cgRXJyb3IoJ05vdCB0aGUgc2FtZSBhbW91bnQgb2YgdmFsaWRhdG9ycyBhbmQgbWFwcGVycyBwYXNzZWQgdG8gdW5pb25NYXBwZXIoKScpO1xuICB9XG5cbiAgcmV0dXJuICh4OiBhbnkpID0+IHtcbiAgICBpZiAoIWNhbkluc3BlY3QoeCkpIHsgcmV0dXJuIHg7IH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsaWRhdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZhbGlkYXRvcnNbaV0oeCkuaXNTdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiBtYXBwZXJzW2ldKHgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNob3VsZCBub3QgYmUgcG9zc2libGUgYmVjYXVzZSB0aGUgdW5pb24gbXVzdCBoYXZlIHBhc3NlZCB2YWxpZGF0aW9uIGJlZm9yZSB0aGlzIGZ1bmN0aW9uXG4gICAgLy8gd2lsbCBiZSBjYWxsZWQsIGJ1dCBjYXRjaCBpdCBhbnl3YXkuXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTm8gdmFsaWRhdG9ycyBtYXRjaGVkIGluIHRoZSB1bmlvbigpJyk7XG4gIH07XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFZBTElEQVRPUlNcbi8vXG4vLyBUaGVzZSBhcmUgdXNlZCB3aGlsZSBjaGVja2luZyB0aGF0IHN1cHBsaWVkIHByb3BlcnR5IGJhZ3MgbWF0Y2ggdGhlIGV4cGVjdGVkIHNjaGVtYVxuLy9cbi8vIFdlIGhhdmUgYSBjb3VwbGUgb2YgZGF0YXR5cGVzIHRoYXQgbW9kZWwgdmFsaWRhdGlvbiBlcnJvcnMgYW5kIGNvbGxlY3Rpb25zIG9mIHZhbGlkYXRpb25cbi8vIGVycm9ycyAodG9nZXRoZXIgZm9ybWluZyBhIHRyZWUgb2YgZXJyb3JzIHNvIHRoYXQgd2UgY2FuIHRyYWNlIHZhbGlkYXRpb24gZXJyb3JzIHRocm91Z2hcbi8vIGFuIG9iamVjdCBncmFwaCksIGFuZCB2YWxpZGF0b3JzLlxuLy9cbi8vIFZhbGlkYXRvcnMgYXJlIHNpbXBseSBmdW5jdGlvbnMgdGhhdCB0YWtlIGEgdmFsdWUgYW5kIHJldHVybiBhIHZhbGlkYXRpb24gcmVzdWx0cy4gVGhlblxuLy8gd2UgaGF2ZSBzb21lIGNvbWJpbmF0b3JzIHRvIHR1cm4gcHJpbWl0aXZlIHZhbGlkYXRvcnMgaW50byBtb3JlIGNvbXBsZXggdmFsaWRhdG9ycy5cbi8vXG5cbi8qKlxuICogUmVwcmVzZW50YXRpb24gb2YgdmFsaWRhdGlvbiByZXN1bHRzXG4gKlxuICogTW9kZWxzIGEgdHJlZSBvZiB2YWxpZGF0aW9uIGVycm9ycyBzbyB0aGF0IHdlIGhhdmUgYXMgbXVjaCBpbmZvcm1hdGlvbiBhcyBwb3NzaWJsZVxuICogYWJvdXQgdGhlIGZhaWx1cmUgdGhhdCBvY2N1cnJlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25SZXN1bHQge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBlcnJvck1lc3NhZ2U6IHN0cmluZyA9ICcnLCByZWFkb25seSByZXN1bHRzOiBWYWxpZGF0aW9uUmVzdWx0cyA9IG5ldyBWYWxpZGF0aW9uUmVzdWx0cygpKSB7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGlzU3VjY2VzcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuZXJyb3JNZXNzYWdlICYmIHRoaXMucmVzdWx0cy5pc1N1Y2Nlc3M7XG4gIH1cblxuICAvKipcbiAgICogVHVybiBhIGZhaWxlZCB2YWxpZGF0aW9uIGludG8gYW4gZXhjZXB0aW9uXG4gICAqL1xuICBwdWJsaWMgYXNzZXJ0U3VjY2VzcygpIHtcbiAgICBpZiAoIXRoaXMuaXNTdWNjZXNzKSB7XG4gICAgICBsZXQgbWVzc2FnZSA9IHRoaXMuZXJyb3JUcmVlKCk7XG4gICAgICAvLyBUaGUgZmlyc3QgbGV0dGVyIHdpbGwgYmUgbG93ZXJjYXNlLCBzbyB1cHBlcmNhc2UgaXQgZm9yIGEgbmljZXIgZXJyb3IgbWVzc2FnZVxuICAgICAgbWVzc2FnZSA9IG1lc3NhZ2Uuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIG1lc3NhZ2Uuc2xpY2UoMSk7XG4gICAgICB0aHJvdyBuZXcgQ2ZuU3ludGhlc2lzRXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIHN0cmluZyByZW5kZXJpbmcgb2YgdGhlIHRyZWUgb2YgdmFsaWRhdGlvbiBmYWlsdXJlc1xuICAgKi9cbiAgcHVibGljIGVycm9yVHJlZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNoaWxkTWVzc2FnZXMgPSB0aGlzLnJlc3VsdHMuZXJyb3JUcmVlTGlzdCgpO1xuICAgIHJldHVybiB0aGlzLmVycm9yTWVzc2FnZSArIChjaGlsZE1lc3NhZ2VzLmxlbmd0aCA/IGBcXG4gICR7Y2hpbGRNZXNzYWdlcy5yZXBsYWNlKC9cXG4vZywgJ1xcbiAgJyl9YCA6ICcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwIHRoaXMgcmVzdWx0IHdpdGggYW4gZXJyb3IgbWVzc2FnZSwgaWYgaXQgY29uY2VybnMgYW4gZXJyb3JcbiAgICovXG4gIHB1YmxpYyBwcmVmaXgobWVzc2FnZTogc3RyaW5nKTogVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKHRoaXMuaXNTdWNjZXNzKSB7IHJldHVybiB0aGlzOyB9XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KGAke21lc3NhZ2V9OiAke3RoaXMuZXJyb3JNZXNzYWdlfWAsIHRoaXMucmVzdWx0cyk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGNvbGxlY3Rpb24gb2YgdmFsaWRhdGlvbiByZXN1bHRzXG4gKi9cbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uUmVzdWx0cyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZXN1bHRzOiBWYWxpZGF0aW9uUmVzdWx0W10gPSBbXSkge1xuICB9XG5cbiAgcHVibGljIGNvbGxlY3QocmVzdWx0OiBWYWxpZGF0aW9uUmVzdWx0KSB7XG4gICAgLy8gT25seSBjb2xsZWN0IGZhaWx1cmVzXG4gICAgaWYgKCFyZXN1bHQuaXNTdWNjZXNzKSB7XG4gICAgICB0aGlzLnJlc3VsdHMucHVzaChyZXN1bHQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXQgaXNTdWNjZXNzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnJlc3VsdHMuZXZlcnkoeCA9PiB4LmlzU3VjY2Vzcyk7XG4gIH1cblxuICBwdWJsaWMgZXJyb3JUcmVlTGlzdCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnJlc3VsdHMubWFwKGNoaWxkID0+IGNoaWxkLmVycm9yVHJlZSgpKS5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwIHVwIGFsbCB2YWxpZGF0aW9uIHJlc3VsdHMgaW50byBhIHNpbmdsZSB0cmVlIG5vZGVcbiAgICpcbiAgICogSWYgdGhlcmUgYXJlIGZhaWx1cmVzIGluIHRoZSBjb2xsZWN0aW9uLCBhZGQgYSBtZXNzYWdlLCBvdGhlcndpc2VcbiAgICogcmV0dXJuIGEgc3VjY2Vzcy5cbiAgICovXG4gIHB1YmxpYyB3cmFwKG1lc3NhZ2U6IHN0cmluZyk6IFZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICh0aGlzLmlzU3VjY2Vzcykge8KgcmV0dXJuIFZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIHJldHVybiBuZXcgVmFsaWRhdGlvblJlc3VsdChtZXNzYWdlLCB0aGlzKTtcbiAgfVxufVxuXG4vLyBTaW5nbGV0b24gb2JqZWN0IHRvIHNhdmUgb24gYWxsb2NhdGlvbnNcbmV4cG9ydCBjb25zdCBWQUxJREFUSU9OX1NVQ0NFU1MgPSBuZXcgVmFsaWRhdGlvblJlc3VsdCgpO1xuXG5leHBvcnQgdHlwZSBWYWxpZGF0b3IgPSAoeDogYW55KSA9PiBWYWxpZGF0aW9uUmVzdWx0O1xuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIHRoaXMgb2JqZWN0IGNhbiBiZSB2YWxpZGF0ZWQgYXQgYWxsXG4gKlxuICogVHJ1ZSB1bmxlc3MgaXQncyB1bmRlZmluZWQgb3IgYSBDbG91ZEZvcm1hdGlvbiBpbnRyaW5zaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbkluc3BlY3QoeDogYW55KSB7XG4gIC8vIE5vdGU6IHVzaW5nIHdlYWsgZXF1YWxpdHkgb24gcHVycG9zZSwgd2UgYWxzbyB3YW50IHRvIGNhdGNoIHVuZGVmaW5lZFxuICByZXR1cm4gKHggIT0gbnVsbCAmJiAhaXNDbG91ZEZvcm1hdGlvbkludHJpbnNpYyh4KSAmJiAhaXNDbG91ZEZvcm1hdGlvbkR5bmFtaWNSZWZlcmVuY2UoeCkpO1xufVxuXG4vLyBDbG91ZEZvcm1hdGlvbiB2YWxpZGF0b3JzIGZvciBwcmltaXRpdmUgdHlwZXNcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVN0cmluZyh4OiBhbnkpOiBWYWxpZGF0aW9uUmVzdWx0IHtcbiAgaWYgKGNhbkluc3BlY3QoeCkgJiYgdHlwZW9mIHggIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KGAke0pTT04uc3RyaW5naWZ5KHgpfSBzaG91bGQgYmUgYSBzdHJpbmdgKTtcbiAgfVxuICByZXR1cm4gVkFMSURBVElPTl9TVUNDRVNTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVOdW1iZXIoeDogYW55KTogVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmIChjYW5JbnNwZWN0KHgpICYmIHR5cGVvZiB4ICE9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBuZXcgVmFsaWRhdGlvblJlc3VsdChgJHtKU09OLnN0cmluZ2lmeSh4KX0gc2hvdWxkIGJlIGEgbnVtYmVyYCk7XG4gIH1cbiAgcmV0dXJuIFZBTElEQVRJT05fU1VDQ0VTUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQm9vbGVhbih4OiBhbnkpOiBWYWxpZGF0aW9uUmVzdWx0IHtcbiAgaWYgKGNhbkluc3BlY3QoeCkgJiYgdHlwZW9mIHggIT09ICdib29sZWFuJykge1xuICAgIHJldHVybiBuZXcgVmFsaWRhdGlvblJlc3VsdChgJHtKU09OLnN0cmluZ2lmeSh4KX0gc2hvdWxkIGJlIGEgYm9vbGVhbmApO1xuICB9XG4gIHJldHVybiBWQUxJREFUSU9OX1NVQ0NFU1M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZURhdGUoeDogYW55KTogVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmIChjYW5JbnNwZWN0KHgpICYmICEoeCBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KGAke0pTT04uc3RyaW5naWZ5KHgpfSBzaG91bGQgYmUgYSBEYXRlYCk7XG4gIH1cblxuICBpZiAoeCAhPT0gdW5kZWZpbmVkICYmIGlzTmFOKHguZ2V0VGltZSgpKSkge1xuICAgIHJldHVybiBuZXcgVmFsaWRhdGlvblJlc3VsdCgnZ290IGFuIHVucGFyc2VhYmxlIERhdGUnKTtcbiAgfVxuXG4gIHJldHVybiBWQUxJREFUSU9OX1NVQ0NFU1M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZU9iamVjdCh4OiBhbnkpOiBWYWxpZGF0aW9uUmVzdWx0IHtcbiAgaWYgKGNhbkluc3BlY3QoeCkgJiYgdHlwZW9mIHggIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KGAke0pTT04uc3RyaW5naWZ5KHgpfSBzaG91bGQgYmUgYW4gJ29iamVjdCdgKTtcbiAgfVxuICByZXR1cm4gVkFMSURBVElPTl9TVUNDRVNTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVDZm5UYWcoeDogYW55KTogVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmICghY2FuSW5zcGVjdCh4KSkgeyByZXR1cm4gVkFMSURBVElPTl9TVUNDRVNTOyB9XG5cbiAgaWYgKHgua2V5ID09IG51bGwgfHwgeC52YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KGAke0pTT04uc3RyaW5naWZ5KHgpfSBzaG91bGQgaGF2ZSBhICdrZXknIGFuZCBhICd2YWx1ZScgcHJvcGVydHlgKTtcbiAgfVxuXG4gIHJldHVybiBWQUxJREFUSU9OX1NVQ0NFU1M7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgbGlzdCB2YWxpZGF0b3IgYmFzZWQgb24gdGhlIGdpdmVuIGVsZW1lbnQgdmFsaWRhdG9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsaXN0VmFsaWRhdG9yKGVsZW1lbnRWYWxpZGF0b3I6IFZhbGlkYXRvcik6IFZhbGlkYXRvciB7XG4gIHJldHVybiAoeDogYW55KSA9PiB7XG4gICAgaWYgKCFjYW5JbnNwZWN0KHgpKSB7IHJldHVybiBWQUxJREFUSU9OX1NVQ0NFU1M7IH1cblxuICAgIGlmICgheC5mb3JFYWNoKSB7XG4gICAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25SZXN1bHQoYCR7SlNPTi5zdHJpbmdpZnkoeCl9IHNob3VsZCBiZSBhIGxpc3RgKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHgubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB4W2ldO1xuICAgICAgY29uc3QgcmVzdWx0ID0gZWxlbWVudFZhbGlkYXRvcihlbGVtZW50KTtcbiAgICAgIGlmICghcmVzdWx0LmlzU3VjY2VzcykgeyByZXR1cm4gcmVzdWx0LnByZWZpeChgZWxlbWVudCAke2l9YCk7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gVkFMSURBVElPTl9TVUNDRVNTO1xuICB9O1xufVxuXG4vKipcbiAqIFJldHVybiBhIGhhc2ggdmFsaWRhdG9yIGJhc2VkIG9uIHRoZSBnaXZlbiBlbGVtZW50IHZhbGlkYXRvclxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzaFZhbGlkYXRvcihlbGVtZW50VmFsaWRhdG9yOiBWYWxpZGF0b3IpOiBWYWxpZGF0b3Ige1xuICByZXR1cm4gKHg6IGFueSkgPT4ge1xuICAgIGlmICghY2FuSW5zcGVjdCh4KSkgeyByZXR1cm4gVkFMSURBVElPTl9TVUNDRVNTOyB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh4KSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZWxlbWVudFZhbGlkYXRvcih4W2tleV0pO1xuICAgICAgaWYgKCFyZXN1bHQuaXNTdWNjZXNzKSB7IHJldHVybiByZXN1bHQucHJlZml4KGBlbGVtZW50ICcke2tleX0nYCk7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gVkFMSURBVElPTl9TVUNDRVNTO1xuICB9O1xufVxuXG4vKipcbiAqIERlY29yYXRlIGEgdmFsaWRhdG9yIHdpdGggYSBtZXNzYWdlIGNsYXJpZnlpbmcgdGhlIHByb3BlcnR5IHRoZSBmYWlsdXJlIGlzIGZvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnR5VmFsaWRhdG9yKHByb3BOYW1lOiBzdHJpbmcsIHZhbGlkYXRvcjogVmFsaWRhdG9yKTogVmFsaWRhdG9yIHtcbiAgcmV0dXJuICh4OiBhbnkpID0+IHtcbiAgICByZXR1cm4gdmFsaWRhdG9yKHgpLnByZWZpeChwcm9wTmFtZSk7XG4gIH07XG59XG5cbi8qKlxuICogUmV0dXJuIGEgdmFsaWRhdG9yIHRoYXQgd2lsbCBmYWlsIGlmIHRoZSBwYXNzZWQgcHJvcGVydHkgaXMgbm90IHByZXNlbnRcbiAqXG4gKiBEb2VzIG5vdCBkaXN0aW5ndWlzaCBiZXR3ZWVuIHRoZSBwcm9wZXJ0eSBhY3R1YWxseSBub3QgYmVpbmcgcHJlc2VudCwgdnMgYmVpbmcgcHJlc2VudCBidXQgJ251bGwnXG4gKiBvciAndW5kZWZpbmVkJyAoY291cnRlc3kgb2YgSmF2YVNjcmlwdCksIHdoaWNoIGlzIGdlbmVyYWxseSB0aGUgYmVoYXZpb3IgdGhhdCB3ZSB3YW50LlxuICpcbiAqIEVtcHR5IHN0cmluZ3MgYXJlIGNvbnNpZGVyZWQgXCJwcmVzZW50XCItLWRvbid0IGtub3cgaWYgdGhpcyBhZ3JlZXMgd2l0aCBob3cgQ2xvdWRGb3JtYXRpb24gbG9va3NcbiAqIGF0IHRoZSB3b3JsZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVkVmFsaWRhdG9yKHg6IGFueSkge1xuICBpZiAoeCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KCdyZXF1aXJlZCBidXQgbWlzc2luZycpO1xuICB9XG4gIHJldHVybiBWQUxJREFUSU9OX1NVQ0NFU1M7XG59XG5cbi8qKlxuICogUmVxdWlyZSBhIHByb3BlcnR5IGZyb20gYSBwcm9wZXJ0eSBiYWcuXG4gKlxuICogQHBhcmFtIHByb3BzICB0aGUgcHJvcGVydHkgYmFnIGZyb20gd2hpY2ggYSBwcm9wZXJ0eSBpcyByZXF1aXJlZC5cbiAqIEBwYXJhbSBuYW1lICAgdGhlIG5hbWUgb2YgdGhlIHJlcXVpcmVkIHByb3BlcnR5LlxuICogQHBhcmFtIHR5cGVOYW1lIHRoZSBuYW1lIG9mIHRoZSBjb25zdHJ1Y3QgdHlwZSB0aGF0IHJlcXVpcmVzIHRoZSBwcm9wZXJ0eVxuICpcbiAqIEByZXR1cm5zIHRoZSB2YWx1ZSBvZiBgYHByb3BzW25hbWVdYGBcbiAqXG4gKiBAdGhyb3dzIGlmIHRoZSBwcm9wZXJ0eSBgYG5hbWVgYCBpcyBub3QgcHJlc2VudCBpbiBgYHByb3BzYGAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlUHJvcGVydHkocHJvcHM6IHsgW25hbWU6IHN0cmluZ106IGFueSB9LCBuYW1lOiBzdHJpbmcsIGNvbnRleHQ6IENvbnN0cnVjdCk6IGFueSB7XG4gIGNvbnN0IHZhbHVlID0gcHJvcHNbbmFtZV07XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke2NvbnRleHQudG9TdHJpbmcoKX0gaXMgbWlzc2luZyByZXF1aXJlZCBwcm9wZXJ0eTogJHtuYW1lfWApO1xuICB9XG4gIC8vIFBvc3NpYmx5IGFkZCB0eXBlLWNoZWNraW5nIGhlcmUuLi5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlcyBpZiBhbnkgb2YgdGhlIGdpdmVuIHZhbGlkYXRvcnMgbWF0Y2hlc1xuICpcbiAqIFdlIGFkZCBlaXRoZXIvb3Igd29yZHMgdG8gdGhlIGZyb250IG9mIHRoZSBlcnJvciBtZXNhZ2VzIHNvIHRoYXQgdGhleSByZWFkXG4gKiBtb3JlIG5pY2VseS4gRXhhbXBsZTpcbiAqXG4gKiAgIFByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yICdGdW5jdGlvblByb3BzJ1xuICogICAgIGNvZGVVcmk6IG5vdCBvbmUgb2YgdGhlIHBvc3NpYmxlIHR5cGVzXG4gKiAgICAgICBlaXRoZXI6IHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yICdTM0xvY2F0aW9uUHJvcGVydHknXG4gKiAgICAgICAgIGJ1Y2tldDogcmVxdWlyZWQgYnV0IG1pc3NpbmdcbiAqICAgICAgICAga2V5OiByZXF1aXJlZCBidXQgbWlzc2luZ1xuICogICAgICAgICB2ZXJzaW9uOiByZXF1aXJlZCBidXQgbWlzc2luZ1xuICogICAgICAgb3I6ICczJyBzaG91bGQgYmUgYSAnc3RyaW5nJ1xuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaW9uVmFsaWRhdG9yKC4uLnZhbGlkYXRvcnM6IFZhbGlkYXRvcltdKTogVmFsaWRhdG9yIHtcbiAgcmV0dXJuICh4OiBhbnkpID0+IHtcbiAgICBjb25zdCByZXN1bHRzID0gbmV3IFZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgbGV0IGVpdGhlck9yID0gJ2VpdGhlcic7XG5cbiAgICBmb3IgKGNvbnN0IHZhbGlkYXRvciBvZiB2YWxpZGF0b3JzKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB2YWxpZGF0b3IoeCk7XG4gICAgICBpZiAocmVzdWx0LmlzU3VjY2VzcykgeyByZXR1cm4gcmVzdWx0OyB9XG4gICAgICByZXN1bHRzLmNvbGxlY3QocmVzdWx0LnByZWZpeChlaXRoZXJPcikpO1xuICAgICAgZWl0aGVyT3IgPSAnb3InO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cy53cmFwKCdub3Qgb25lIG9mIHRoZSBwb3NzaWJsZSB0eXBlcycpO1xuICB9O1xufVxuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIHRoZSBpbmRpY2F0ZWQgdmFsdWUgcmVwcmVzZW50cyBhIENsb3VkRm9ybWF0aW9uIGludHJpbnNpYy5cbiAqXG4gKiBDbG91ZEZvcm1hdGlvbiBpbnRyaW5zaWNzIGFyZSBtb2RlbGVkIGFzIG9iamVjdHMgd2l0aCBhIHNpbmdsZSBrZXksIHdoaWNoXG4gKiBsb29rIGxpa2U6IHsgXCJGbjo6R2V0QXR0XCI6IFsuLi5dIH0gb3Igc2ltaWxhci5cbiAqL1xuZnVuY3Rpb24gaXNDbG91ZEZvcm1hdGlvbkludHJpbnNpYyh4OiBhbnkpIHtcbiAgaWYgKCEodHlwZW9mIHggPT09ICdvYmplY3QnKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHgpO1xuICBpZiAoa2V5cy5sZW5ndGggIT09IDEpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcmV0dXJuIGtleXNbMF0gPT09ICdSZWYnIHx8IGtleXNbMF0uc2xpY2UoMCwgNCkgPT09ICdGbjo6Jztcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBpbmRpY2F0ZWQgdmFsdWUgaXMgYSBDbG91ZEZvcm1hdGlvbiBkeW5hbWljIHJlZmVyZW5jZS5cbiAqXG4gKiBDbG91ZEZvcm1hdGlvbiBkeW5hbWljIHJlZmVyZW5jZXMgdGFrZSB0aGUgZm9ybWF0OiAne3tyZXNvbHZlOnNlcnZpY2UtbmFtZTpyZWZlcmVuY2Uta2V5fX0nXG4gKi9cbmZ1bmN0aW9uIGlzQ2xvdWRGb3JtYXRpb25EeW5hbWljUmVmZXJlbmNlKHg6IGFueSkge1xuICByZXR1cm4gKHR5cGVvZiB4ID09PSAnc3RyaW5nJyAmJiB4LnN0YXJ0c1dpdGgoJ3t7cmVzb2x2ZTonKSAmJiB4LmVuZHNXaXRoKCd9fScpKTtcbn1cblxuLy8gQ2Fubm90IGJlIHB1YmxpYyBiZWNhdXNlIEpTSUkgZ2V0cyBjb25mdXNlZCBhYm91dCBlczUuZC50c1xuY2xhc3MgQ2ZuU3ludGhlc2lzRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIHB1YmxpYyByZWFkb25seSB0eXBlID0gJ0NmblN5bnRoZXNpc0Vycm9yJztcbn1cbiJdfQ==