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
_a = JSII_RTTI_SYMBOL_1;
ValidationResult[_a] = { fqn: "@aws-cdk/core.ValidationResult", version: "0.0.0" };
exports.ValidationResult = ValidationResult;
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
_b = JSII_RTTI_SYMBOL_1;
ValidationResults[_b] = { fqn: "@aws-cdk/core.ValidationResults", version: "0.0.0" };
exports.ValidationResults = ValidationResults;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJ1bnRpbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBWUEsU0FBUyxRQUFRLENBQUMsQ0FBTTtJQUN0QixPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFFWSxRQUFBLHNCQUFzQixHQUFXLFFBQVEsQ0FBQztBQUMxQyxRQUFBLHVCQUF1QixHQUFXLFFBQVEsQ0FBQztBQUMzQyxRQUFBLHNCQUFzQixHQUFXLFFBQVEsQ0FBQztBQUMxQyxRQUFBLHNCQUFzQixHQUFXLFFBQVEsQ0FBQztBQUV2RDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixvQkFBb0IsQ0FBQyxDQUFRO0lBQzNDLElBQUksQ0FBQyxDQUFDLEVBQUU7UUFDTixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELG1DQUFtQztJQUNuQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDaEssQ0FBQztBQVBELG9EQU9DO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLEdBQUcsQ0FBQyxDQUFTO0lBQ3BCLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNWLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUMzQjtJQUNELE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3RCLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLHNCQUFzQixDQUFDLENBQU07SUFDM0MsT0FBTztRQUNMLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRztRQUNWLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSztLQUNmLENBQUM7QUFDSixDQUFDO0FBTEQsd0RBS0M7QUFFRCxTQUFnQixVQUFVLENBQUMsYUFBcUI7SUFDOUMsT0FBTyxDQUFDLENBQU0sRUFBRSxFQUFFO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFBRSxPQUFPLENBQUMsQ0FBQztTQUFFO1FBQ2pDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM5QixDQUFDLENBQUM7QUFDSixDQUFDO0FBTEQsZ0NBS0M7QUFFRCxTQUFnQixVQUFVLENBQUMsYUFBcUI7SUFDOUMsT0FBTyxDQUFDLENBQU0sRUFBRSxFQUFFO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFBRSxPQUFPLENBQUMsQ0FBQztTQUFFO1FBRWpDLE1BQU0sR0FBRyxHQUFRLEVBQUUsQ0FBQztRQUVwQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzdCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUMsQ0FBQztBQUNKLENBQUM7QUFaRCxnQ0FZQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxVQUF1QixFQUFFLE9BQWlCO0lBQ3BFLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxPQUFPLENBQUMsTUFBTSxFQUFFO1FBQ3hDLE1BQU0sS0FBSyxDQUFDLHVFQUF1RSxDQUFDLENBQUM7S0FDdEY7SUFFRCxPQUFPLENBQUMsQ0FBTSxFQUFFLEVBQUU7UUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQUU7UUFFakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFO2dCQUM5QixPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0QjtTQUNGO1FBRUQsNEZBQTRGO1FBQzVGLHVDQUF1QztRQUN2QyxNQUFNLElBQUksU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWxCRCxrQ0FrQkM7QUFFRCx5RUFBeUU7QUFDekUsYUFBYTtBQUNiLEVBQUU7QUFDRixzRkFBc0Y7QUFDdEYsRUFBRTtBQUNGLDJGQUEyRjtBQUMzRiwyRkFBMkY7QUFDM0Ysb0NBQW9DO0FBQ3BDLEVBQUU7QUFDRiwwRkFBMEY7QUFDMUYsc0ZBQXNGO0FBQ3RGLEVBQUU7QUFFRjs7Ozs7R0FLRztBQUNILE1BQWEsZ0JBQWdCO0lBQzNCLFlBQXFCLGVBQXVCLEVBQUUsRUFBVyxVQUE2QixJQUFJLGlCQUFpQixFQUFFO1FBQXhGLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQVcsWUFBTyxHQUFQLE9BQU8sQ0FBNkM7Ozs7OzsrQ0FEbEcsZ0JBQWdCOzs7O0tBRTFCO0lBRUQsSUFBVyxTQUFTO1FBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0tBQ3JEO0lBRUQ7O09BRUc7SUFDSSxhQUFhO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUMvQixnRkFBZ0Y7WUFDaEYsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0QsTUFBTSxJQUFJLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3RDO0tBQ0Y7SUFFRDs7T0FFRztJQUNJLFNBQVM7UUFDZCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ25ELE9BQU8sSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDeEc7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxPQUFlO1FBQzNCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDO1NBQUU7UUFDcEMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsT0FBTyxLQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDL0U7Ozs7QUFsQ1UsNENBQWdCO0FBcUM3Qjs7R0FFRztBQUNILE1BQWEsaUJBQWlCO0lBQzVCLFlBQW1CLFVBQThCLEVBQUU7UUFBaEMsWUFBTyxHQUFQLE9BQU8sQ0FBeUI7S0FDbEQ7SUFFTSxPQUFPLENBQUMsTUFBd0I7Ozs7Ozs7Ozs7UUFDckMsd0JBQXdCO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzNCO0tBQ0Y7SUFFRCxJQUFXLFNBQVM7UUFDbEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM3QztJQUVNLGFBQWE7UUFDbEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNoRTtJQUVEOzs7OztPQUtHO0lBQ0ksSUFBSSxDQUFDLE9BQWU7UUFDekIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQUUsT0FBTywwQkFBa0IsQ0FBQztTQUFFO1FBQ2xELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDNUM7Ozs7QUE1QlUsOENBQWlCO0FBK0I5QiwwQ0FBMEM7QUFDN0IsUUFBQSxrQkFBa0IsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7QUFJekQ7Ozs7R0FJRztBQUNILFNBQWdCLFVBQVUsQ0FBQyxDQUFNO0lBQy9CLHdFQUF3RTtJQUN4RSxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RixDQUFDO0FBSEQsZ0NBR0M7QUFFRCxnREFBZ0Q7QUFDaEQsU0FBZ0IsY0FBYyxDQUFDLENBQU07SUFDbkMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO1FBQzFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUM7S0FDeEU7SUFDRCxPQUFPLDBCQUFrQixDQUFDO0FBQzVCLENBQUM7QUFMRCx3Q0FLQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxDQUFNO0lBQ25DLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtRQUMxQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0tBQ3hFO0lBQ0QsT0FBTywwQkFBa0IsQ0FBQztBQUM1QixDQUFDO0FBTEQsd0NBS0M7QUFFRCxTQUFnQixlQUFlLENBQUMsQ0FBTTtJQUNwQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxTQUFTLEVBQUU7UUFDM0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQztLQUN6RTtJQUNELE9BQU8sMEJBQWtCLENBQUM7QUFDNUIsQ0FBQztBQUxELDBDQUtDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLENBQU07SUFDakMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxJQUFJLENBQUMsRUFBRTtRQUN6QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQ3RFO0lBRUQsSUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRTtRQUN6QyxPQUFPLElBQUksZ0JBQWdCLENBQUMseUJBQXlCLENBQUMsQ0FBQztLQUN4RDtJQUVELE9BQU8sMEJBQWtCLENBQUM7QUFDNUIsQ0FBQztBQVZELG9DQVVDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLENBQU07SUFDbkMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO1FBQzFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUM7S0FDM0U7SUFDRCxPQUFPLDBCQUFrQixDQUFDO0FBQzVCLENBQUM7QUFMRCx3Q0FLQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxDQUFNO0lBQ25DLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFBRSxPQUFPLDBCQUFrQixDQUFDO0tBQUU7SUFFbEQsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtRQUNwQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0tBQ2hHO0lBRUQsT0FBTywwQkFBa0IsQ0FBQztBQUM1QixDQUFDO0FBUkQsd0NBUUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLGFBQWEsQ0FBQyxnQkFBMkI7SUFDdkQsT0FBTyxDQUFDLENBQU0sRUFBRSxFQUFFO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFBRSxPQUFPLDBCQUFrQixDQUFDO1NBQUU7UUFFbEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUU7WUFDZCxPQUFPLElBQUksZ0JBQWdCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDakMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sTUFBTSxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUFFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7YUFBRTtTQUNqRTtRQUVELE9BQU8sMEJBQWtCLENBQUM7SUFDNUIsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWhCRCxzQ0FnQkM7QUFFRDs7R0FFRztBQUNILFNBQWdCLGFBQWEsQ0FBQyxnQkFBMkI7SUFDdkQsT0FBTyxDQUFDLENBQU0sRUFBRSxFQUFFO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFBRSxPQUFPLDBCQUFrQixDQUFDO1NBQUU7UUFFbEQsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2hDLE1BQU0sTUFBTSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUFFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDLENBQUM7YUFBRTtTQUNyRTtRQUVELE9BQU8sMEJBQWtCLENBQUM7SUFDNUIsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQVhELHNDQVdDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxRQUFnQixFQUFFLFNBQW9CO0lBQ3RFLE9BQU8sQ0FBQyxDQUFNLEVBQUUsRUFBRTtRQUNoQixPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUpELDhDQUlDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxDQUFNO0lBQ3RDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtRQUNiLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0tBQ3JEO0lBQ0QsT0FBTywwQkFBa0IsQ0FBQztBQUM1QixDQUFDO0FBTEQsOENBS0M7QUFFRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsU0FBZ0IsZUFBZSxDQUFDLEtBQThCLEVBQUUsSUFBWSxFQUFFLE9BQWtCO0lBQzlGLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsa0NBQWtDLElBQUksRUFBRSxDQUFDLENBQUM7S0FDaEY7SUFDRCxxQ0FBcUM7SUFDckMsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBUEQsMENBT0M7QUFFRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILFNBQWdCLGNBQWMsQ0FBQyxHQUFHLFVBQXVCO0lBQ3ZELE9BQU8sQ0FBQyxDQUFNLEVBQUUsRUFBRTtRQUNoQixNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7UUFDeEMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXhCLEtBQUssTUFBTSxTQUFTLElBQUksVUFBVSxFQUFFO1lBQ2xDLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Z0JBQUUsT0FBTyxNQUFNLENBQUM7YUFBRTtZQUN4QyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN6QyxRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ2pCO1FBQ0QsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7SUFDdkQsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWJELHdDQWFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFTLHlCQUF5QixDQUFDLENBQU07SUFDdkMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFDLEVBQUU7UUFBRSxPQUFPLEtBQUssQ0FBQztLQUFFO0lBQy9DLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUFFLE9BQU8sS0FBSyxDQUFDO0tBQUU7SUFFeEMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQztBQUM3RCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsZ0NBQWdDLENBQUMsQ0FBTTtJQUM5QyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ25GLENBQUM7QUFFRCw2REFBNkQ7QUFDN0QsTUFBTSxpQkFBa0IsU0FBUSxLQUFLO0lBQXJDOztRQUNrQixTQUFJLEdBQUcsbUJBQW1CLENBQUM7SUFDN0MsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBST1BFUlRZIE1BUFBFUlNcbi8vXG4vLyBUaGVzZSBhcmUgdXNlZCB3aGlsZSBjb252ZXJ0aW5nIGdlbmVyYXRlZCBjbGFzc2VzL3Byb3BlcnR5IGJhZ3MgdG8gQ2xvdWRGb3JtYXRpb24gcHJvcGVydHkgb2JqZWN0c1xuLy9cbi8vIFdlIHVzZSBpZGVudGl0eSBtYXBwZXJzIGZvciB0aGUgcHJpbWl0aXZlIHR5cGVzLiBUaGVzZSBkb24ndCBkbyBhbnl0aGluZyBidXQgYXJlIHRoZXJlIHRvIG1ha2UgdGhlIGNvZGVcbi8vIGdlbmVyYXRpb24gd29yayBvdXQgbmljZWx5IChzbyB0aGUgY29kZSBnZW5lcmF0b3IgZG9lc24ndCBuZWVkIHRvIGVtaXQgZGlmZmVyZW50IGNvZGUgZm9yIHByaW1pdGl2ZVxuLy8gdnMuIGNvbXBsZXggdHlwZXMpLlxuZXhwb3J0IHR5cGUgTWFwcGVyID0gKHg6IGFueSkgPT4gYW55O1xuXG5mdW5jdGlvbiBpZGVudGl0eSh4OiBhbnkpIHtcbiAgcmV0dXJuIHg7XG59XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdUb0Nsb3VkRm9ybWF0aW9uOiBNYXBwZXIgPSBpZGVudGl0eTtcbmV4cG9ydCBjb25zdCBib29sZWFuVG9DbG91ZEZvcm1hdGlvbjogTWFwcGVyID0gaWRlbnRpdHk7XG5leHBvcnQgY29uc3Qgb2JqZWN0VG9DbG91ZEZvcm1hdGlvbjogTWFwcGVyID0gaWRlbnRpdHk7XG5leHBvcnQgY29uc3QgbnVtYmVyVG9DbG91ZEZvcm1hdGlvbjogTWFwcGVyID0gaWRlbnRpdHk7XG5cbi8qKlxuICogVGhlIGRhdGUgbmVlZHMgdG8gYmUgZm9ybWF0dGVkIGFzIGFuIElTTyBkYXRlIGluIFVUQ1xuICpcbiAqIFNvbWUgdXNhZ2Ugc2l0ZXMgcmVxdWlyZSBhIGRhdGUsIHNvbWUgcmVxdWlyZSBhIHRpbWVzdGFtcC4gV2UnbGxcbiAqIGFsd2F5cyBvdXRwdXQgYSB0aW1lc3RhbXAgYW5kIGhvcGUgdGhlIHBhcnNlciBvbiB0aGUgb3RoZXIgZW5kXG4gKiBpcyBzbWFydCBlbm91Z2ggdG8gaWdub3JlIHRoZSB0aW1lIHBhcnQuLi4gKD8pXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkYXRlVG9DbG91ZEZvcm1hdGlvbih4PzogRGF0ZSk6IGFueSB7XG4gIGlmICgheCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICByZXR1cm4gYCR7eC5nZXRVVENGdWxsWWVhcigpfS0ke3BhZCh4LmdldFVUQ01vbnRoKCkgKyAxKX0tJHtwYWQoeC5nZXRVVENEYXRlKCkpfVQke3BhZCh4LmdldFVUQ0hvdXJzKCkpfToke3BhZCh4LmdldFVUQ01pbnV0ZXMoKSl9OiR7cGFkKHguZ2V0VVRDU2Vjb25kcygpKX1gO1xufVxuXG4vKipcbiAqIFBhZCBhIG51bWJlciB0byAyIGRlY2ltYWwgcGxhY2VzXG4gKi9cbmZ1bmN0aW9uIHBhZCh4OiBudW1iZXIpIHtcbiAgaWYgKHggPCAxMCkge1xuICAgIHJldHVybiAnMCcgKyB4LnRvU3RyaW5nKCk7XG4gIH1cbiAgcmV0dXJuIHgudG9TdHJpbmcoKTtcbn1cblxuLyoqXG4gKiBUdXJuIGEgdGFnIG9iamVjdCBpbnRvIHRoZSBwcm9wZXIgQ2xvdWRGb3JtYXRpb24gcmVwcmVzZW50YXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNmblRhZ1RvQ2xvdWRGb3JtYXRpb24oeDogYW55KTogYW55IHtcbiAgcmV0dXJuIHtcbiAgICBLZXk6IHgua2V5LFxuICAgIFZhbHVlOiB4LnZhbHVlLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzdE1hcHBlcihlbGVtZW50TWFwcGVyOiBNYXBwZXIpOiBNYXBwZXIge1xuICByZXR1cm4gKHg6IGFueSkgPT4ge1xuICAgIGlmICghY2FuSW5zcGVjdCh4KSkgeyByZXR1cm4geDsgfVxuICAgIHJldHVybiB4Lm1hcChlbGVtZW50TWFwcGVyKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc2hNYXBwZXIoZWxlbWVudE1hcHBlcjogTWFwcGVyKTogTWFwcGVyIHtcbiAgcmV0dXJuICh4OiBhbnkpID0+IHtcbiAgICBpZiAoIWNhbkluc3BlY3QoeCkpIHsgcmV0dXJuIHg7IH1cblxuICAgIGNvbnN0IHJldDogYW55ID0ge307XG5cbiAgICBPYmplY3Qua2V5cyh4KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHJldFtrZXldID0gZWxlbWVudE1hcHBlcih4W2tleV0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSB1bmlvbiBtYXBwZXJcbiAqXG4gKiBUYWtlcyBhIGxpc3Qgb2YgdmFsaWRhdG9ycyBhbmQgYSBsaXN0IG9mIG1hcHBlcnMsIHdoaWNoIHNob3VsZCBjb3JyZXNwb25kIHBhaXJ3aXNlLlxuICpcbiAqIFRoZSBtYXBwZXIgb2YgdGhlIGZpcnN0IHN1Y2Nlc3NmdWwgdmFsaWRhdG9yIHdpbGwgYmUgY2FsbGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pb25NYXBwZXIodmFsaWRhdG9yczogVmFsaWRhdG9yW10sIG1hcHBlcnM6IE1hcHBlcltdKTogTWFwcGVyIHtcbiAgaWYgKHZhbGlkYXRvcnMubGVuZ3RoICE9PSBtYXBwZXJzLmxlbmd0aCkge1xuICAgIHRocm93IEVycm9yKCdOb3QgdGhlIHNhbWUgYW1vdW50IG9mIHZhbGlkYXRvcnMgYW5kIG1hcHBlcnMgcGFzc2VkIHRvIHVuaW9uTWFwcGVyKCknKTtcbiAgfVxuXG4gIHJldHVybiAoeDogYW55KSA9PiB7XG4gICAgaWYgKCFjYW5JbnNwZWN0KHgpKSB7IHJldHVybiB4OyB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbGlkYXRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWxpZGF0b3JzW2ldKHgpLmlzU3VjY2Vzcykge1xuICAgICAgICByZXR1cm4gbWFwcGVyc1tpXSh4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTaG91bGQgbm90IGJlIHBvc3NpYmxlIGJlY2F1c2UgdGhlIHVuaW9uIG11c3QgaGF2ZSBwYXNzZWQgdmFsaWRhdGlvbiBiZWZvcmUgdGhpcyBmdW5jdGlvblxuICAgIC8vIHdpbGwgYmUgY2FsbGVkLCBidXQgY2F0Y2ggaXQgYW55d2F5LlxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vIHZhbGlkYXRvcnMgbWF0Y2hlZCBpbiB0aGUgdW5pb24oKScpO1xuICB9O1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBWQUxJREFUT1JTXG4vL1xuLy8gVGhlc2UgYXJlIHVzZWQgd2hpbGUgY2hlY2tpbmcgdGhhdCBzdXBwbGllZCBwcm9wZXJ0eSBiYWdzIG1hdGNoIHRoZSBleHBlY3RlZCBzY2hlbWFcbi8vXG4vLyBXZSBoYXZlIGEgY291cGxlIG9mIGRhdGF0eXBlcyB0aGF0IG1vZGVsIHZhbGlkYXRpb24gZXJyb3JzIGFuZCBjb2xsZWN0aW9ucyBvZiB2YWxpZGF0aW9uXG4vLyBlcnJvcnMgKHRvZ2V0aGVyIGZvcm1pbmcgYSB0cmVlIG9mIGVycm9ycyBzbyB0aGF0IHdlIGNhbiB0cmFjZSB2YWxpZGF0aW9uIGVycm9ycyB0aHJvdWdoXG4vLyBhbiBvYmplY3QgZ3JhcGgpLCBhbmQgdmFsaWRhdG9ycy5cbi8vXG4vLyBWYWxpZGF0b3JzIGFyZSBzaW1wbHkgZnVuY3Rpb25zIHRoYXQgdGFrZSBhIHZhbHVlIGFuZCByZXR1cm4gYSB2YWxpZGF0aW9uIHJlc3VsdHMuIFRoZW5cbi8vIHdlIGhhdmUgc29tZSBjb21iaW5hdG9ycyB0byB0dXJuIHByaW1pdGl2ZSB2YWxpZGF0b3JzIGludG8gbW9yZSBjb21wbGV4IHZhbGlkYXRvcnMuXG4vL1xuXG4vKipcbiAqIFJlcHJlc2VudGF0aW9uIG9mIHZhbGlkYXRpb24gcmVzdWx0c1xuICpcbiAqIE1vZGVscyBhIHRyZWUgb2YgdmFsaWRhdGlvbiBlcnJvcnMgc28gdGhhdCB3ZSBoYXZlIGFzIG11Y2ggaW5mb3JtYXRpb24gYXMgcG9zc2libGVcbiAqIGFib3V0IHRoZSBmYWlsdXJlIHRoYXQgb2NjdXJyZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uUmVzdWx0IHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgZXJyb3JNZXNzYWdlOiBzdHJpbmcgPSAnJywgcmVhZG9ubHkgcmVzdWx0czogVmFsaWRhdGlvblJlc3VsdHMgPSBuZXcgVmFsaWRhdGlvblJlc3VsdHMoKSkge1xuICB9XG5cbiAgcHVibGljIGdldCBpc1N1Y2Nlc3MoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmVycm9yTWVzc2FnZSAmJiB0aGlzLnJlc3VsdHMuaXNTdWNjZXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIFR1cm4gYSBmYWlsZWQgdmFsaWRhdGlvbiBpbnRvIGFuIGV4Y2VwdGlvblxuICAgKi9cbiAgcHVibGljIGFzc2VydFN1Y2Nlc3MoKSB7XG4gICAgaWYgKCF0aGlzLmlzU3VjY2Vzcykge1xuICAgICAgbGV0IG1lc3NhZ2UgPSB0aGlzLmVycm9yVHJlZSgpO1xuICAgICAgLy8gVGhlIGZpcnN0IGxldHRlciB3aWxsIGJlIGxvd2VyY2FzZSwgc28gdXBwZXJjYXNlIGl0IGZvciBhIG5pY2VyIGVycm9yIG1lc3NhZ2VcbiAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBtZXNzYWdlLnNsaWNlKDEpO1xuICAgICAgdGhyb3cgbmV3IENmblN5bnRoZXNpc0Vycm9yKG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVuZGVyaW5nIG9mIHRoZSB0cmVlIG9mIHZhbGlkYXRpb24gZmFpbHVyZXNcbiAgICovXG4gIHB1YmxpYyBlcnJvclRyZWUoKTogc3RyaW5nIHtcbiAgICBjb25zdCBjaGlsZE1lc3NhZ2VzID0gdGhpcy5yZXN1bHRzLmVycm9yVHJlZUxpc3QoKTtcbiAgICByZXR1cm4gdGhpcy5lcnJvck1lc3NhZ2UgKyAoY2hpbGRNZXNzYWdlcy5sZW5ndGggPyBgXFxuICAke2NoaWxkTWVzc2FnZXMucmVwbGFjZSgvXFxuL2csICdcXG4gICcpfWAgOiAnJyk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcCB0aGlzIHJlc3VsdCB3aXRoIGFuIGVycm9yIG1lc3NhZ2UsIGlmIGl0IGNvbmNlcm5zIGFuIGVycm9yXG4gICAqL1xuICBwdWJsaWMgcHJlZml4KG1lc3NhZ2U6IHN0cmluZyk6IFZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICh0aGlzLmlzU3VjY2VzcykgeyByZXR1cm4gdGhpczsgfVxuICAgIHJldHVybiBuZXcgVmFsaWRhdGlvblJlc3VsdChgJHttZXNzYWdlfTogJHt0aGlzLmVycm9yTWVzc2FnZX1gLCB0aGlzLnJlc3VsdHMpO1xuICB9XG59XG5cbi8qKlxuICogQSBjb2xsZWN0aW9uIG9mIHZhbGlkYXRpb24gcmVzdWx0c1xuICovXG5leHBvcnQgY2xhc3MgVmFsaWRhdGlvblJlc3VsdHMge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVzdWx0czogVmFsaWRhdGlvblJlc3VsdFtdID0gW10pIHtcbiAgfVxuXG4gIHB1YmxpYyBjb2xsZWN0KHJlc3VsdDogVmFsaWRhdGlvblJlc3VsdCkge1xuICAgIC8vIE9ubHkgY29sbGVjdCBmYWlsdXJlc1xuICAgIGlmICghcmVzdWx0LmlzU3VjY2Vzcykge1xuICAgICAgdGhpcy5yZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0IGlzU3VjY2VzcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5yZXN1bHRzLmV2ZXJ5KHggPT4geC5pc1N1Y2Nlc3MpO1xuICB9XG5cbiAgcHVibGljIGVycm9yVHJlZUxpc3QoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5yZXN1bHRzLm1hcChjaGlsZCA9PiBjaGlsZC5lcnJvclRyZWUoKSkuam9pbignXFxuJyk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcCB1cCBhbGwgdmFsaWRhdGlvbiByZXN1bHRzIGludG8gYSBzaW5nbGUgdHJlZSBub2RlXG4gICAqXG4gICAqIElmIHRoZXJlIGFyZSBmYWlsdXJlcyBpbiB0aGUgY29sbGVjdGlvbiwgYWRkIGEgbWVzc2FnZSwgb3RoZXJ3aXNlXG4gICAqIHJldHVybiBhIHN1Y2Nlc3MuXG4gICAqL1xuICBwdWJsaWMgd3JhcChtZXNzYWdlOiBzdHJpbmcpOiBWYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAodGhpcy5pc1N1Y2Nlc3MpIHvCoHJldHVybiBWQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25SZXN1bHQobWVzc2FnZSwgdGhpcyk7XG4gIH1cbn1cblxuLy8gU2luZ2xldG9uIG9iamVjdCB0byBzYXZlIG9uIGFsbG9jYXRpb25zXG5leHBvcnQgY29uc3QgVkFMSURBVElPTl9TVUNDRVNTID0gbmV3IFZhbGlkYXRpb25SZXN1bHQoKTtcblxuZXhwb3J0IHR5cGUgVmFsaWRhdG9yID0gKHg6IGFueSkgPT4gVmFsaWRhdGlvblJlc3VsdDtcblxuLyoqXG4gKiBSZXR1cm4gd2hldGhlciB0aGlzIG9iamVjdCBjYW4gYmUgdmFsaWRhdGVkIGF0IGFsbFxuICpcbiAqIFRydWUgdW5sZXNzIGl0J3MgdW5kZWZpbmVkIG9yIGEgQ2xvdWRGb3JtYXRpb24gaW50cmluc2ljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5JbnNwZWN0KHg6IGFueSkge1xuICAvLyBOb3RlOiB1c2luZyB3ZWFrIGVxdWFsaXR5IG9uIHB1cnBvc2UsIHdlIGFsc28gd2FudCB0byBjYXRjaCB1bmRlZmluZWRcbiAgcmV0dXJuICh4ICE9IG51bGwgJiYgIWlzQ2xvdWRGb3JtYXRpb25JbnRyaW5zaWMoeCkgJiYgIWlzQ2xvdWRGb3JtYXRpb25EeW5hbWljUmVmZXJlbmNlKHgpKTtcbn1cblxuLy8gQ2xvdWRGb3JtYXRpb24gdmFsaWRhdG9ycyBmb3IgcHJpbWl0aXZlIHR5cGVzXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVTdHJpbmcoeDogYW55KTogVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmIChjYW5JbnNwZWN0KHgpICYmIHR5cGVvZiB4ICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBuZXcgVmFsaWRhdGlvblJlc3VsdChgJHtKU09OLnN0cmluZ2lmeSh4KX0gc2hvdWxkIGJlIGEgc3RyaW5nYCk7XG4gIH1cbiAgcmV0dXJuIFZBTElEQVRJT05fU1VDQ0VTUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlTnVtYmVyKHg6IGFueSk6IFZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoY2FuSW5zcGVjdCh4KSAmJiB0eXBlb2YgeCAhPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25SZXN1bHQoYCR7SlNPTi5zdHJpbmdpZnkoeCl9IHNob3VsZCBiZSBhIG51bWJlcmApO1xuICB9XG4gIHJldHVybiBWQUxJREFUSU9OX1NVQ0NFU1M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUJvb2xlYW4oeDogYW55KTogVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmIChjYW5JbnNwZWN0KHgpICYmIHR5cGVvZiB4ICE9PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25SZXN1bHQoYCR7SlNPTi5zdHJpbmdpZnkoeCl9IHNob3VsZCBiZSBhIGJvb2xlYW5gKTtcbiAgfVxuICByZXR1cm4gVkFMSURBVElPTl9TVUNDRVNTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVEYXRlKHg6IGFueSk6IFZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoY2FuSW5zcGVjdCh4KSAmJiAhKHggaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgIHJldHVybiBuZXcgVmFsaWRhdGlvblJlc3VsdChgJHtKU09OLnN0cmluZ2lmeSh4KX0gc2hvdWxkIGJlIGEgRGF0ZWApO1xuICB9XG5cbiAgaWYgKHggIT09IHVuZGVmaW5lZCAmJiBpc05hTih4LmdldFRpbWUoKSkpIHtcbiAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25SZXN1bHQoJ2dvdCBhbiB1bnBhcnNlYWJsZSBEYXRlJyk7XG4gIH1cblxuICByZXR1cm4gVkFMSURBVElPTl9TVUNDRVNTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVPYmplY3QoeDogYW55KTogVmFsaWRhdGlvblJlc3VsdCB7XG4gIGlmIChjYW5JbnNwZWN0KHgpICYmIHR5cGVvZiB4ICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuZXcgVmFsaWRhdGlvblJlc3VsdChgJHtKU09OLnN0cmluZ2lmeSh4KX0gc2hvdWxkIGJlIGFuICdvYmplY3QnYCk7XG4gIH1cbiAgcmV0dXJuIFZBTElEQVRJT05fU1VDQ0VTUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQ2ZuVGFnKHg6IGFueSk6IFZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoIWNhbkluc3BlY3QoeCkpIHsgcmV0dXJuIFZBTElEQVRJT05fU1VDQ0VTUzsgfVxuXG4gIGlmICh4LmtleSA9PSBudWxsIHx8IHgudmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgVmFsaWRhdGlvblJlc3VsdChgJHtKU09OLnN0cmluZ2lmeSh4KX0gc2hvdWxkIGhhdmUgYSAna2V5JyBhbmQgYSAndmFsdWUnIHByb3BlcnR5YCk7XG4gIH1cblxuICByZXR1cm4gVkFMSURBVElPTl9TVUNDRVNTO1xufVxuXG4vKipcbiAqIFJldHVybiBhIGxpc3QgdmFsaWRhdG9yIGJhc2VkIG9uIHRoZSBnaXZlbiBlbGVtZW50IHZhbGlkYXRvclxuICovXG5leHBvcnQgZnVuY3Rpb24gbGlzdFZhbGlkYXRvcihlbGVtZW50VmFsaWRhdG9yOiBWYWxpZGF0b3IpOiBWYWxpZGF0b3Ige1xuICByZXR1cm4gKHg6IGFueSkgPT4ge1xuICAgIGlmICghY2FuSW5zcGVjdCh4KSkgeyByZXR1cm4gVkFMSURBVElPTl9TVUNDRVNTOyB9XG5cbiAgICBpZiAoIXguZm9yRWFjaCkge1xuICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KGAke0pTT04uc3RyaW5naWZ5KHgpfSBzaG91bGQgYmUgYSBsaXN0YCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0geFtpXTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGVsZW1lbnRWYWxpZGF0b3IoZWxlbWVudCk7XG4gICAgICBpZiAoIXJlc3VsdC5pc1N1Y2Nlc3MpIHsgcmV0dXJuIHJlc3VsdC5wcmVmaXgoYGVsZW1lbnQgJHtpfWApOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFZBTElEQVRJT05fU1VDQ0VTUztcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBoYXNoIHZhbGlkYXRvciBiYXNlZCBvbiB0aGUgZ2l2ZW4gZWxlbWVudCB2YWxpZGF0b3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc2hWYWxpZGF0b3IoZWxlbWVudFZhbGlkYXRvcjogVmFsaWRhdG9yKTogVmFsaWRhdG9yIHtcbiAgcmV0dXJuICh4OiBhbnkpID0+IHtcbiAgICBpZiAoIWNhbkluc3BlY3QoeCkpIHsgcmV0dXJuIFZBTElEQVRJT05fU1VDQ0VTUzsgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoeCkpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGVsZW1lbnRWYWxpZGF0b3IoeFtrZXldKTtcbiAgICAgIGlmICghcmVzdWx0LmlzU3VjY2VzcykgeyByZXR1cm4gcmVzdWx0LnByZWZpeChgZWxlbWVudCAnJHtrZXl9J2ApOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFZBTElEQVRJT05fU1VDQ0VTUztcbiAgfTtcbn1cblxuLyoqXG4gKiBEZWNvcmF0ZSBhIHZhbGlkYXRvciB3aXRoIGEgbWVzc2FnZSBjbGFyaWZ5aW5nIHRoZSBwcm9wZXJ0eSB0aGUgZmFpbHVyZSBpcyBmb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0eVZhbGlkYXRvcihwcm9wTmFtZTogc3RyaW5nLCB2YWxpZGF0b3I6IFZhbGlkYXRvcik6IFZhbGlkYXRvciB7XG4gIHJldHVybiAoeDogYW55KSA9PiB7XG4gICAgcmV0dXJuIHZhbGlkYXRvcih4KS5wcmVmaXgocHJvcE5hbWUpO1xuICB9O1xufVxuXG4vKipcbiAqIFJldHVybiBhIHZhbGlkYXRvciB0aGF0IHdpbGwgZmFpbCBpZiB0aGUgcGFzc2VkIHByb3BlcnR5IGlzIG5vdCBwcmVzZW50XG4gKlxuICogRG9lcyBub3QgZGlzdGluZ3Vpc2ggYmV0d2VlbiB0aGUgcHJvcGVydHkgYWN0dWFsbHkgbm90IGJlaW5nIHByZXNlbnQsIHZzIGJlaW5nIHByZXNlbnQgYnV0ICdudWxsJ1xuICogb3IgJ3VuZGVmaW5lZCcgKGNvdXJ0ZXN5IG9mIEphdmFTY3JpcHQpLCB3aGljaCBpcyBnZW5lcmFsbHkgdGhlIGJlaGF2aW9yIHRoYXQgd2Ugd2FudC5cbiAqXG4gKiBFbXB0eSBzdHJpbmdzIGFyZSBjb25zaWRlcmVkIFwicHJlc2VudFwiLS1kb24ndCBrbm93IGlmIHRoaXMgYWdyZWVzIHdpdGggaG93IENsb3VkRm9ybWF0aW9uIGxvb2tzXG4gKiBhdCB0aGUgd29ybGQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlZFZhbGlkYXRvcih4OiBhbnkpIHtcbiAgaWYgKHggPT0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgVmFsaWRhdGlvblJlc3VsdCgncmVxdWlyZWQgYnV0IG1pc3NpbmcnKTtcbiAgfVxuICByZXR1cm4gVkFMSURBVElPTl9TVUNDRVNTO1xufVxuXG4vKipcbiAqIFJlcXVpcmUgYSBwcm9wZXJ0eSBmcm9tIGEgcHJvcGVydHkgYmFnLlxuICpcbiAqIEBwYXJhbSBwcm9wcyAgdGhlIHByb3BlcnR5IGJhZyBmcm9tIHdoaWNoIGEgcHJvcGVydHkgaXMgcmVxdWlyZWQuXG4gKiBAcGFyYW0gbmFtZSAgIHRoZSBuYW1lIG9mIHRoZSByZXF1aXJlZCBwcm9wZXJ0eS5cbiAqIEBwYXJhbSB0eXBlTmFtZSB0aGUgbmFtZSBvZiB0aGUgY29uc3RydWN0IHR5cGUgdGhhdCByZXF1aXJlcyB0aGUgcHJvcGVydHlcbiAqXG4gKiBAcmV0dXJucyB0aGUgdmFsdWUgb2YgYGBwcm9wc1tuYW1lXWBgXG4gKlxuICogQHRocm93cyBpZiB0aGUgcHJvcGVydHkgYGBuYW1lYGAgaXMgbm90IHByZXNlbnQgaW4gYGBwcm9wc2BgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVxdWlyZVByb3BlcnR5KHByb3BzOiB7IFtuYW1lOiBzdHJpbmddOiBhbnkgfSwgbmFtZTogc3RyaW5nLCBjb250ZXh0OiBDb25zdHJ1Y3QpOiBhbnkge1xuICBjb25zdCB2YWx1ZSA9IHByb3BzW25hbWVdO1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHtjb250ZXh0LnRvU3RyaW5nKCl9IGlzIG1pc3NpbmcgcmVxdWlyZWQgcHJvcGVydHk6ICR7bmFtZX1gKTtcbiAgfVxuICAvLyBQb3NzaWJseSBhZGQgdHlwZS1jaGVja2luZyBoZXJlLi4uXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZXMgaWYgYW55IG9mIHRoZSBnaXZlbiB2YWxpZGF0b3JzIG1hdGNoZXNcbiAqXG4gKiBXZSBhZGQgZWl0aGVyL29yIHdvcmRzIHRvIHRoZSBmcm9udCBvZiB0aGUgZXJyb3IgbWVzYWdlcyBzbyB0aGF0IHRoZXkgcmVhZFxuICogbW9yZSBuaWNlbHkuIEV4YW1wbGU6XG4gKlxuICogICBQcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciAnRnVuY3Rpb25Qcm9wcydcbiAqICAgICBjb2RlVXJpOiBub3Qgb25lIG9mIHRoZSBwb3NzaWJsZSB0eXBlc1xuICogICAgICAgZWl0aGVyOiBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciAnUzNMb2NhdGlvblByb3BlcnR5J1xuICogICAgICAgICBidWNrZXQ6IHJlcXVpcmVkIGJ1dCBtaXNzaW5nXG4gKiAgICAgICAgIGtleTogcmVxdWlyZWQgYnV0IG1pc3NpbmdcbiAqICAgICAgICAgdmVyc2lvbjogcmVxdWlyZWQgYnV0IG1pc3NpbmdcbiAqICAgICAgIG9yOiAnMycgc2hvdWxkIGJlIGEgJ3N0cmluZydcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlvblZhbGlkYXRvciguLi52YWxpZGF0b3JzOiBWYWxpZGF0b3JbXSk6IFZhbGlkYXRvciB7XG4gIHJldHVybiAoeDogYW55KSA9PiB7XG4gICAgY29uc3QgcmVzdWx0cyA9IG5ldyBWYWxpZGF0aW9uUmVzdWx0cygpO1xuICAgIGxldCBlaXRoZXJPciA9ICdlaXRoZXInO1xuXG4gICAgZm9yIChjb25zdCB2YWxpZGF0b3Igb2YgdmFsaWRhdG9ycykge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdmFsaWRhdG9yKHgpO1xuICAgICAgaWYgKHJlc3VsdC5pc1N1Y2Nlc3MpIHsgcmV0dXJuIHJlc3VsdDsgfVxuICAgICAgcmVzdWx0cy5jb2xsZWN0KHJlc3VsdC5wcmVmaXgoZWl0aGVyT3IpKTtcbiAgICAgIGVpdGhlck9yID0gJ29yJztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHMud3JhcCgnbm90IG9uZSBvZiB0aGUgcG9zc2libGUgdHlwZXMnKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gd2hldGhlciB0aGUgaW5kaWNhdGVkIHZhbHVlIHJlcHJlc2VudHMgYSBDbG91ZEZvcm1hdGlvbiBpbnRyaW5zaWMuXG4gKlxuICogQ2xvdWRGb3JtYXRpb24gaW50cmluc2ljcyBhcmUgbW9kZWxlZCBhcyBvYmplY3RzIHdpdGggYSBzaW5nbGUga2V5LCB3aGljaFxuICogbG9vayBsaWtlOiB7IFwiRm46OkdldEF0dFwiOiBbLi4uXSB9IG9yIHNpbWlsYXIuXG4gKi9cbmZ1bmN0aW9uIGlzQ2xvdWRGb3JtYXRpb25JbnRyaW5zaWMoeDogYW55KSB7XG4gIGlmICghKHR5cGVvZiB4ID09PSAnb2JqZWN0JykpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh4KTtcbiAgaWYgKGtleXMubGVuZ3RoICE9PSAxKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHJldHVybiBrZXlzWzBdID09PSAnUmVmJyB8fCBrZXlzWzBdLnNsaWNlKDAsIDQpID09PSAnRm46Oic7XG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgaW5kaWNhdGVkIHZhbHVlIGlzIGEgQ2xvdWRGb3JtYXRpb24gZHluYW1pYyByZWZlcmVuY2UuXG4gKlxuICogQ2xvdWRGb3JtYXRpb24gZHluYW1pYyByZWZlcmVuY2VzIHRha2UgdGhlIGZvcm1hdDogJ3t7cmVzb2x2ZTpzZXJ2aWNlLW5hbWU6cmVmZXJlbmNlLWtleX19J1xuICovXG5mdW5jdGlvbiBpc0Nsb3VkRm9ybWF0aW9uRHluYW1pY1JlZmVyZW5jZSh4OiBhbnkpIHtcbiAgcmV0dXJuICh0eXBlb2YgeCA9PT0gJ3N0cmluZycgJiYgeC5zdGFydHNXaXRoKCd7e3Jlc29sdmU6JykgJiYgeC5lbmRzV2l0aCgnfX0nKSk7XG59XG5cbi8vIENhbm5vdCBiZSBwdWJsaWMgYmVjYXVzZSBKU0lJIGdldHMgY29uZnVzZWQgYWJvdXQgZXM1LmQudHNcbmNsYXNzIENmblN5bnRoZXNpc0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZSA9ICdDZm5TeW50aGVzaXNFcnJvcic7XG59XG4iXX0=