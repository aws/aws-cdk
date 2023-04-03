"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unionValidator = exports.requireProperty = exports.requiredValidator = exports.propertyValidator = exports.hashValidator = exports.listValidator = exports.validateCfnTag = exports.validateObject = exports.validateDate = exports.validateBoolean = exports.validateNumber = exports.validateString = exports.canInspect = exports.VALIDATION_SUCCESS = exports.ValidationResults = exports.ValidationResult = exports.unionMapper = exports.hashMapper = exports.listMapper = exports.cfnTagToCloudFormation = exports.dateToCloudFormation = exports.numberToCloudFormation = exports.objectToCloudFormation = exports.booleanToCloudFormation = exports.stringToCloudFormation = void 0;
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
/**
 * A collection of validation results
 */
class ValidationResults {
    constructor(results = []) {
        this.results = results;
    }
    collect(result) {
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
 * We add either/or words to the front of the error messages so that they read
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJ1bnRpbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBWUEsU0FBUyxRQUFRLENBQUMsQ0FBTTtJQUN0QixPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFFWSxRQUFBLHNCQUFzQixHQUFXLFFBQVEsQ0FBQztBQUMxQyxRQUFBLHVCQUF1QixHQUFXLFFBQVEsQ0FBQztBQUMzQyxRQUFBLHNCQUFzQixHQUFXLFFBQVEsQ0FBQztBQUMxQyxRQUFBLHNCQUFzQixHQUFXLFFBQVEsQ0FBQztBQUV2RDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixvQkFBb0IsQ0FBQyxDQUFRO0lBQzNDLElBQUksQ0FBQyxDQUFDLEVBQUU7UUFDTixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELG1DQUFtQztJQUNuQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDaEssQ0FBQztBQVBELG9EQU9DO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLEdBQUcsQ0FBQyxDQUFTO0lBQ3BCLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNWLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUMzQjtJQUNELE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3RCLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLHNCQUFzQixDQUFDLENBQU07SUFDM0MsT0FBTztRQUNMLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRztRQUNWLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSztLQUNmLENBQUM7QUFDSixDQUFDO0FBTEQsd0RBS0M7QUFFRCxTQUFnQixVQUFVLENBQUMsYUFBcUI7SUFDOUMsT0FBTyxDQUFDLENBQU0sRUFBRSxFQUFFO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFBRSxPQUFPLENBQUMsQ0FBQztTQUFFO1FBQ2pDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM5QixDQUFDLENBQUM7QUFDSixDQUFDO0FBTEQsZ0NBS0M7QUFFRCxTQUFnQixVQUFVLENBQUMsYUFBcUI7SUFDOUMsT0FBTyxDQUFDLENBQU0sRUFBRSxFQUFFO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFBRSxPQUFPLENBQUMsQ0FBQztTQUFFO1FBRWpDLE1BQU0sR0FBRyxHQUFRLEVBQUUsQ0FBQztRQUVwQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzdCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUMsQ0FBQztBQUNKLENBQUM7QUFaRCxnQ0FZQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxVQUF1QixFQUFFLE9BQWlCO0lBQ3BFLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxPQUFPLENBQUMsTUFBTSxFQUFFO1FBQ3hDLE1BQU0sS0FBSyxDQUFDLHVFQUF1RSxDQUFDLENBQUM7S0FDdEY7SUFFRCxPQUFPLENBQUMsQ0FBTSxFQUFFLEVBQUU7UUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQUU7UUFFakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFO2dCQUM5QixPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0QjtTQUNGO1FBRUQsNEZBQTRGO1FBQzVGLHVDQUF1QztRQUN2QyxNQUFNLElBQUksU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWxCRCxrQ0FrQkM7QUFFRCx5RUFBeUU7QUFDekUsYUFBYTtBQUNiLEVBQUU7QUFDRixzRkFBc0Y7QUFDdEYsRUFBRTtBQUNGLDJGQUEyRjtBQUMzRiwyRkFBMkY7QUFDM0Ysb0NBQW9DO0FBQ3BDLEVBQUU7QUFDRiwwRkFBMEY7QUFDMUYsc0ZBQXNGO0FBQ3RGLEVBQUU7QUFFRjs7Ozs7R0FLRztBQUNILE1BQWEsZ0JBQWdCO0lBQzNCLFlBQXFCLGVBQXVCLEVBQUUsRUFBVyxVQUE2QixJQUFJLGlCQUFpQixFQUFFO1FBQXhGLGlCQUFZLEdBQVosWUFBWSxDQUFhO1FBQVcsWUFBTyxHQUFQLE9BQU8sQ0FBNkM7SUFDN0csQ0FBQztJQUVELElBQVcsU0FBUztRQUNsQixPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztJQUN0RCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxhQUFhO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUMvQixnRkFBZ0Y7WUFDaEYsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0QsTUFBTSxJQUFJLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3RDO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0ksU0FBUztRQUNkLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDbkQsT0FBTyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6RyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsT0FBZTtRQUMzQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQztTQUFFO1FBQ3BDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLE9BQU8sS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hGLENBQUM7Q0FDRjtBQW5DRCw0Q0FtQ0M7QUFFRDs7R0FFRztBQUNILE1BQWEsaUJBQWlCO0lBQzVCLFlBQW1CLFVBQThCLEVBQUU7UUFBaEMsWUFBTyxHQUFQLE9BQU8sQ0FBeUI7SUFDbkQsQ0FBQztJQUVNLE9BQU8sQ0FBQyxNQUF3QjtRQUNyQyx3QkFBd0I7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7WUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRUQsSUFBVyxTQUFTO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVNLGFBQWE7UUFDbEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxJQUFJLENBQUMsT0FBZTtRQUN6QixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFBRSxPQUFPLDBCQUFrQixDQUFDO1NBQUU7UUFDbEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM3QyxDQUFDO0NBQ0Y7QUE3QkQsOENBNkJDO0FBRUQsMENBQTBDO0FBQzdCLFFBQUEsa0JBQWtCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO0FBSXpEOzs7O0dBSUc7QUFDSCxTQUFnQixVQUFVLENBQUMsQ0FBTTtJQUMvQix3RUFBd0U7SUFDeEUsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUYsQ0FBQztBQUhELGdDQUdDO0FBRUQsZ0RBQWdEO0FBQ2hELFNBQWdCLGNBQWMsQ0FBQyxDQUFNO0lBQ25DLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtRQUMxQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0tBQ3hFO0lBQ0QsT0FBTywwQkFBa0IsQ0FBQztBQUM1QixDQUFDO0FBTEQsd0NBS0M7QUFFRCxTQUFnQixjQUFjLENBQUMsQ0FBTTtJQUNuQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDMUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQztLQUN4RTtJQUNELE9BQU8sMEJBQWtCLENBQUM7QUFDNUIsQ0FBQztBQUxELHdDQUtDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLENBQU07SUFDcEMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssU0FBUyxFQUFFO1FBQzNDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUM7S0FDekU7SUFDRCxPQUFPLDBCQUFrQixDQUFDO0FBQzVCLENBQUM7QUFMRCwwQ0FLQztBQUVELFNBQWdCLFlBQVksQ0FBQyxDQUFNO0lBQ2pDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUFDLEVBQUU7UUFDekMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUN0RTtJQUVELElBQUksQ0FBQyxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUU7UUFDekMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDLENBQUM7S0FDeEQ7SUFFRCxPQUFPLDBCQUFrQixDQUFDO0FBQzVCLENBQUM7QUFWRCxvQ0FVQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxDQUFNO0lBQ25DLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtRQUMxQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0tBQzNFO0lBQ0QsT0FBTywwQkFBa0IsQ0FBQztBQUM1QixDQUFDO0FBTEQsd0NBS0M7QUFFRCxTQUFnQixjQUFjLENBQUMsQ0FBTTtJQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQUUsT0FBTywwQkFBa0IsQ0FBQztLQUFFO0lBRWxELElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDcEMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsNkNBQTZDLENBQUMsQ0FBQztLQUNoRztJQUVELE9BQU8sMEJBQWtCLENBQUM7QUFDNUIsQ0FBQztBQVJELHdDQVFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixhQUFhLENBQUMsZ0JBQTJCO0lBQ3ZELE9BQU8sQ0FBQyxDQUFNLEVBQUUsRUFBRTtRQUNoQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQUUsT0FBTywwQkFBa0IsQ0FBQztTQUFFO1FBRWxELElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO1lBQ2QsT0FBTyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUN0RTtRQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pDLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtnQkFBRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQUU7U0FDakU7UUFFRCxPQUFPLDBCQUFrQixDQUFDO0lBQzVCLENBQUMsQ0FBQztBQUNKLENBQUM7QUFoQkQsc0NBZ0JDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixhQUFhLENBQUMsZ0JBQTJCO0lBQ3ZELE9BQU8sQ0FBQyxDQUFNLEVBQUUsRUFBRTtRQUNoQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQUUsT0FBTywwQkFBa0IsQ0FBQztTQUFFO1FBRWxELEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNoQyxNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtnQkFBRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2FBQUU7U0FDckU7UUFFRCxPQUFPLDBCQUFrQixDQUFDO0lBQzVCLENBQUMsQ0FBQztBQUNKLENBQUM7QUFYRCxzQ0FXQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsUUFBZ0IsRUFBRSxTQUFvQjtJQUN0RSxPQUFPLENBQUMsQ0FBTSxFQUFFLEVBQUU7UUFDaEIsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQztBQUNKLENBQUM7QUFKRCw4Q0FJQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsQ0FBTTtJQUN0QyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7UUFDYixPQUFPLElBQUksZ0JBQWdCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztLQUNyRDtJQUNELE9BQU8sMEJBQWtCLENBQUM7QUFDNUIsQ0FBQztBQUxELDhDQUtDO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILFNBQWdCLGVBQWUsQ0FBQyxLQUE4QixFQUFFLElBQVksRUFBRSxPQUFrQjtJQUM5RixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO1FBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLGtDQUFrQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ2hGO0lBQ0QscUNBQXFDO0lBQ3JDLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQVBELDBDQU9DO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxTQUFnQixjQUFjLENBQUMsR0FBRyxVQUF1QjtJQUN2RCxPQUFPLENBQUMsQ0FBTSxFQUFFLEVBQUU7UUFDaEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1FBQ3hDLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUV4QixLQUFLLE1BQU0sU0FBUyxJQUFJLFVBQVUsRUFBRTtZQUNsQyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUFFLE9BQU8sTUFBTSxDQUFDO2FBQUU7WUFDeEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDekMsUUFBUSxHQUFHLElBQUksQ0FBQztTQUNqQjtRQUNELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQztBQUNKLENBQUM7QUFiRCx3Q0FhQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBUyx5QkFBeUIsQ0FBQyxDQUFNO0lBQ3ZDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxFQUFFO1FBQUUsT0FBTyxLQUFLLENBQUM7S0FBRTtJQUMvQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFBRSxPQUFPLEtBQUssQ0FBQztLQUFFO0lBRXhDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUM7QUFDN0QsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLGdDQUFnQyxDQUFDLENBQU07SUFDOUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNuRixDQUFDO0FBRUQsNkRBQTZEO0FBQzdELE1BQU0saUJBQWtCLFNBQVEsS0FBSztJQUFyQzs7UUFDa0IsU0FBSSxHQUFHLG1CQUFtQixDQUFDO0lBQzdDLENBQUM7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQUk9QRVJUWSBNQVBQRVJTXG4vL1xuLy8gVGhlc2UgYXJlIHVzZWQgd2hpbGUgY29udmVydGluZyBnZW5lcmF0ZWQgY2xhc3Nlcy9wcm9wZXJ0eSBiYWdzIHRvIENsb3VkRm9ybWF0aW9uIHByb3BlcnR5IG9iamVjdHNcbi8vXG4vLyBXZSB1c2UgaWRlbnRpdHkgbWFwcGVycyBmb3IgdGhlIHByaW1pdGl2ZSB0eXBlcy4gVGhlc2UgZG9uJ3QgZG8gYW55dGhpbmcgYnV0IGFyZSB0aGVyZSB0byBtYWtlIHRoZSBjb2RlXG4vLyBnZW5lcmF0aW9uIHdvcmsgb3V0IG5pY2VseSAoc28gdGhlIGNvZGUgZ2VuZXJhdG9yIGRvZXNuJ3QgbmVlZCB0byBlbWl0IGRpZmZlcmVudCBjb2RlIGZvciBwcmltaXRpdmVcbi8vIHZzLiBjb21wbGV4IHR5cGVzKS5cbmV4cG9ydCB0eXBlIE1hcHBlciA9ICh4OiBhbnkpID0+IGFueTtcblxuZnVuY3Rpb24gaWRlbnRpdHkoeDogYW55KSB7XG4gIHJldHVybiB4O1xufVxuXG5leHBvcnQgY29uc3Qgc3RyaW5nVG9DbG91ZEZvcm1hdGlvbjogTWFwcGVyID0gaWRlbnRpdHk7XG5leHBvcnQgY29uc3QgYm9vbGVhblRvQ2xvdWRGb3JtYXRpb246IE1hcHBlciA9IGlkZW50aXR5O1xuZXhwb3J0IGNvbnN0IG9iamVjdFRvQ2xvdWRGb3JtYXRpb246IE1hcHBlciA9IGlkZW50aXR5O1xuZXhwb3J0IGNvbnN0IG51bWJlclRvQ2xvdWRGb3JtYXRpb246IE1hcHBlciA9IGlkZW50aXR5O1xuXG4vKipcbiAqIFRoZSBkYXRlIG5lZWRzIHRvIGJlIGZvcm1hdHRlZCBhcyBhbiBJU08gZGF0ZSBpbiBVVENcbiAqXG4gKiBTb21lIHVzYWdlIHNpdGVzIHJlcXVpcmUgYSBkYXRlLCBzb21lIHJlcXVpcmUgYSB0aW1lc3RhbXAuIFdlJ2xsXG4gKiBhbHdheXMgb3V0cHV0IGEgdGltZXN0YW1wIGFuZCBob3BlIHRoZSBwYXJzZXIgb24gdGhlIG90aGVyIGVuZFxuICogaXMgc21hcnQgZW5vdWdoIHRvIGlnbm9yZSB0aGUgdGltZSBwYXJ0Li4uICg/KVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGF0ZVRvQ2xvdWRGb3JtYXRpb24oeD86IERhdGUpOiBhbnkge1xuICBpZiAoIXgpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgcmV0dXJuIGAke3guZ2V0VVRDRnVsbFllYXIoKX0tJHtwYWQoeC5nZXRVVENNb250aCgpICsgMSl9LSR7cGFkKHguZ2V0VVRDRGF0ZSgpKX1UJHtwYWQoeC5nZXRVVENIb3VycygpKX06JHtwYWQoeC5nZXRVVENNaW51dGVzKCkpfToke3BhZCh4LmdldFVUQ1NlY29uZHMoKSl9YDtcbn1cblxuLyoqXG4gKiBQYWQgYSBudW1iZXIgdG8gMiBkZWNpbWFsIHBsYWNlc1xuICovXG5mdW5jdGlvbiBwYWQoeDogbnVtYmVyKSB7XG4gIGlmICh4IDwgMTApIHtcbiAgICByZXR1cm4gJzAnICsgeC50b1N0cmluZygpO1xuICB9XG4gIHJldHVybiB4LnRvU3RyaW5nKCk7XG59XG5cbi8qKlxuICogVHVybiBhIHRhZyBvYmplY3QgaW50byB0aGUgcHJvcGVyIENsb3VkRm9ybWF0aW9uIHJlcHJlc2VudGF0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjZm5UYWdUb0Nsb3VkRm9ybWF0aW9uKHg6IGFueSk6IGFueSB7XG4gIHJldHVybiB7XG4gICAgS2V5OiB4LmtleSxcbiAgICBWYWx1ZTogeC52YWx1ZSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RNYXBwZXIoZWxlbWVudE1hcHBlcjogTWFwcGVyKTogTWFwcGVyIHtcbiAgcmV0dXJuICh4OiBhbnkpID0+IHtcbiAgICBpZiAoIWNhbkluc3BlY3QoeCkpIHsgcmV0dXJuIHg7IH1cbiAgICByZXR1cm4geC5tYXAoZWxlbWVudE1hcHBlcik7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNoTWFwcGVyKGVsZW1lbnRNYXBwZXI6IE1hcHBlcik6IE1hcHBlciB7XG4gIHJldHVybiAoeDogYW55KSA9PiB7XG4gICAgaWYgKCFjYW5JbnNwZWN0KHgpKSB7IHJldHVybiB4OyB9XG5cbiAgICBjb25zdCByZXQ6IGFueSA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMoeCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICByZXRba2V5XSA9IGVsZW1lbnRNYXBwZXIoeFtrZXldKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXQ7XG4gIH07XG59XG5cbi8qKlxuICogUmV0dXJuIGEgdW5pb24gbWFwcGVyXG4gKlxuICogVGFrZXMgYSBsaXN0IG9mIHZhbGlkYXRvcnMgYW5kIGEgbGlzdCBvZiBtYXBwZXJzLCB3aGljaCBzaG91bGQgY29ycmVzcG9uZCBwYWlyd2lzZS5cbiAqXG4gKiBUaGUgbWFwcGVyIG9mIHRoZSBmaXJzdCBzdWNjZXNzZnVsIHZhbGlkYXRvciB3aWxsIGJlIGNhbGxlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaW9uTWFwcGVyKHZhbGlkYXRvcnM6IFZhbGlkYXRvcltdLCBtYXBwZXJzOiBNYXBwZXJbXSk6IE1hcHBlciB7XG4gIGlmICh2YWxpZGF0b3JzLmxlbmd0aCAhPT0gbWFwcGVycy5sZW5ndGgpIHtcbiAgICB0aHJvdyBFcnJvcignTm90IHRoZSBzYW1lIGFtb3VudCBvZiB2YWxpZGF0b3JzIGFuZCBtYXBwZXJzIHBhc3NlZCB0byB1bmlvbk1hcHBlcigpJyk7XG4gIH1cblxuICByZXR1cm4gKHg6IGFueSkgPT4ge1xuICAgIGlmICghY2FuSW5zcGVjdCh4KSkgeyByZXR1cm4geDsgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWxpZGF0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsaWRhdG9yc1tpXSh4KS5pc1N1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIG1hcHBlcnNbaV0oeCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2hvdWxkIG5vdCBiZSBwb3NzaWJsZSBiZWNhdXNlIHRoZSB1bmlvbiBtdXN0IGhhdmUgcGFzc2VkIHZhbGlkYXRpb24gYmVmb3JlIHRoaXMgZnVuY3Rpb25cbiAgICAvLyB3aWxsIGJlIGNhbGxlZCwgYnV0IGNhdGNoIGl0IGFueXdheS5cbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdObyB2YWxpZGF0b3JzIG1hdGNoZWQgaW4gdGhlIHVuaW9uKCknKTtcbiAgfTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVkFMSURBVE9SU1xuLy9cbi8vIFRoZXNlIGFyZSB1c2VkIHdoaWxlIGNoZWNraW5nIHRoYXQgc3VwcGxpZWQgcHJvcGVydHkgYmFncyBtYXRjaCB0aGUgZXhwZWN0ZWQgc2NoZW1hXG4vL1xuLy8gV2UgaGF2ZSBhIGNvdXBsZSBvZiBkYXRhdHlwZXMgdGhhdCBtb2RlbCB2YWxpZGF0aW9uIGVycm9ycyBhbmQgY29sbGVjdGlvbnMgb2YgdmFsaWRhdGlvblxuLy8gZXJyb3JzICh0b2dldGhlciBmb3JtaW5nIGEgdHJlZSBvZiBlcnJvcnMgc28gdGhhdCB3ZSBjYW4gdHJhY2UgdmFsaWRhdGlvbiBlcnJvcnMgdGhyb3VnaFxuLy8gYW4gb2JqZWN0IGdyYXBoKSwgYW5kIHZhbGlkYXRvcnMuXG4vL1xuLy8gVmFsaWRhdG9ycyBhcmUgc2ltcGx5IGZ1bmN0aW9ucyB0aGF0IHRha2UgYSB2YWx1ZSBhbmQgcmV0dXJuIGEgdmFsaWRhdGlvbiByZXN1bHRzLiBUaGVuXG4vLyB3ZSBoYXZlIHNvbWUgY29tYmluYXRvcnMgdG8gdHVybiBwcmltaXRpdmUgdmFsaWRhdG9ycyBpbnRvIG1vcmUgY29tcGxleCB2YWxpZGF0b3JzLlxuLy9cblxuLyoqXG4gKiBSZXByZXNlbnRhdGlvbiBvZiB2YWxpZGF0aW9uIHJlc3VsdHNcbiAqXG4gKiBNb2RlbHMgYSB0cmVlIG9mIHZhbGlkYXRpb24gZXJyb3JzIHNvIHRoYXQgd2UgaGF2ZSBhcyBtdWNoIGluZm9ybWF0aW9uIGFzIHBvc3NpYmxlXG4gKiBhYm91dCB0aGUgZmFpbHVyZSB0aGF0IG9jY3VycmVkLlxuICovXG5leHBvcnQgY2xhc3MgVmFsaWRhdGlvblJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGVycm9yTWVzc2FnZTogc3RyaW5nID0gJycsIHJlYWRvbmx5IHJlc3VsdHM6IFZhbGlkYXRpb25SZXN1bHRzID0gbmV3IFZhbGlkYXRpb25SZXN1bHRzKCkpIHtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgaXNTdWNjZXNzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5lcnJvck1lc3NhZ2UgJiYgdGhpcy5yZXN1bHRzLmlzU3VjY2VzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUdXJuIGEgZmFpbGVkIHZhbGlkYXRpb24gaW50byBhbiBleGNlcHRpb25cbiAgICovXG4gIHB1YmxpYyBhc3NlcnRTdWNjZXNzKCkge1xuICAgIGlmICghdGhpcy5pc1N1Y2Nlc3MpIHtcbiAgICAgIGxldCBtZXNzYWdlID0gdGhpcy5lcnJvclRyZWUoKTtcbiAgICAgIC8vIFRoZSBmaXJzdCBsZXR0ZXIgd2lsbCBiZSBsb3dlcmNhc2UsIHNvIHVwcGVyY2FzZSBpdCBmb3IgYSBuaWNlciBlcnJvciBtZXNzYWdlXG4gICAgICBtZXNzYWdlID0gbWVzc2FnZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgbWVzc2FnZS5zbGljZSgxKTtcbiAgICAgIHRocm93IG5ldyBDZm5TeW50aGVzaXNFcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgc3RyaW5nIHJlbmRlcmluZyBvZiB0aGUgdHJlZSBvZiB2YWxpZGF0aW9uIGZhaWx1cmVzXG4gICAqL1xuICBwdWJsaWMgZXJyb3JUcmVlKCk6IHN0cmluZyB7XG4gICAgY29uc3QgY2hpbGRNZXNzYWdlcyA9IHRoaXMucmVzdWx0cy5lcnJvclRyZWVMaXN0KCk7XG4gICAgcmV0dXJuIHRoaXMuZXJyb3JNZXNzYWdlICsgKGNoaWxkTWVzc2FnZXMubGVuZ3RoID8gYFxcbiAgJHtjaGlsZE1lc3NhZ2VzLnJlcGxhY2UoL1xcbi9nLCAnXFxuICAnKX1gIDogJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXAgdGhpcyByZXN1bHQgd2l0aCBhbiBlcnJvciBtZXNzYWdlLCBpZiBpdCBjb25jZXJucyBhbiBlcnJvclxuICAgKi9cbiAgcHVibGljIHByZWZpeChtZXNzYWdlOiBzdHJpbmcpOiBWYWxpZGF0aW9uUmVzdWx0IHtcbiAgICBpZiAodGhpcy5pc1N1Y2Nlc3MpIHsgcmV0dXJuIHRoaXM7IH1cbiAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25SZXN1bHQoYCR7bWVzc2FnZX06ICR7dGhpcy5lcnJvck1lc3NhZ2V9YCwgdGhpcy5yZXN1bHRzKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgY29sbGVjdGlvbiBvZiB2YWxpZGF0aW9uIHJlc3VsdHNcbiAqL1xuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25SZXN1bHRzIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlc3VsdHM6IFZhbGlkYXRpb25SZXN1bHRbXSA9IFtdKSB7XG4gIH1cblxuICBwdWJsaWMgY29sbGVjdChyZXN1bHQ6IFZhbGlkYXRpb25SZXN1bHQpIHtcbiAgICAvLyBPbmx5IGNvbGxlY3QgZmFpbHVyZXNcbiAgICBpZiAoIXJlc3VsdC5pc1N1Y2Nlc3MpIHtcbiAgICAgIHRoaXMucmVzdWx0cy5wdXNoKHJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldCBpc1N1Y2Nlc3MoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0cy5ldmVyeSh4ID0+IHguaXNTdWNjZXNzKTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvclRyZWVMaXN0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0cy5tYXAoY2hpbGQgPT4gY2hpbGQuZXJyb3JUcmVlKCkpLmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXAgdXAgYWxsIHZhbGlkYXRpb24gcmVzdWx0cyBpbnRvIGEgc2luZ2xlIHRyZWUgbm9kZVxuICAgKlxuICAgKiBJZiB0aGVyZSBhcmUgZmFpbHVyZXMgaW4gdGhlIGNvbGxlY3Rpb24sIGFkZCBhIG1lc3NhZ2UsIG90aGVyd2lzZVxuICAgKiByZXR1cm4gYSBzdWNjZXNzLlxuICAgKi9cbiAgcHVibGljIHdyYXAobWVzc2FnZTogc3RyaW5nKTogVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKHRoaXMuaXNTdWNjZXNzKSB7wqByZXR1cm4gVkFMSURBVElPTl9TVUNDRVNTOyB9XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KG1lc3NhZ2UsIHRoaXMpO1xuICB9XG59XG5cbi8vIFNpbmdsZXRvbiBvYmplY3QgdG8gc2F2ZSBvbiBhbGxvY2F0aW9uc1xuZXhwb3J0IGNvbnN0IFZBTElEQVRJT05fU1VDQ0VTUyA9IG5ldyBWYWxpZGF0aW9uUmVzdWx0KCk7XG5cbmV4cG9ydCB0eXBlIFZhbGlkYXRvciA9ICh4OiBhbnkpID0+IFZhbGlkYXRpb25SZXN1bHQ7XG5cbi8qKlxuICogUmV0dXJuIHdoZXRoZXIgdGhpcyBvYmplY3QgY2FuIGJlIHZhbGlkYXRlZCBhdCBhbGxcbiAqXG4gKiBUcnVlIHVubGVzcyBpdCdzIHVuZGVmaW5lZCBvciBhIENsb3VkRm9ybWF0aW9uIGludHJpbnNpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuSW5zcGVjdCh4OiBhbnkpIHtcbiAgLy8gTm90ZTogdXNpbmcgd2VhayBlcXVhbGl0eSBvbiBwdXJwb3NlLCB3ZSBhbHNvIHdhbnQgdG8gY2F0Y2ggdW5kZWZpbmVkXG4gIHJldHVybiAoeCAhPSBudWxsICYmICFpc0Nsb3VkRm9ybWF0aW9uSW50cmluc2ljKHgpICYmICFpc0Nsb3VkRm9ybWF0aW9uRHluYW1pY1JlZmVyZW5jZSh4KSk7XG59XG5cbi8vIENsb3VkRm9ybWF0aW9uIHZhbGlkYXRvcnMgZm9yIHByaW1pdGl2ZSB0eXBlc1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlU3RyaW5nKHg6IGFueSk6IFZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoY2FuSW5zcGVjdCh4KSAmJiB0eXBlb2YgeCAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25SZXN1bHQoYCR7SlNPTi5zdHJpbmdpZnkoeCl9IHNob3VsZCBiZSBhIHN0cmluZ2ApO1xuICB9XG4gIHJldHVybiBWQUxJREFUSU9OX1NVQ0NFU1M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZU51bWJlcih4OiBhbnkpOiBWYWxpZGF0aW9uUmVzdWx0IHtcbiAgaWYgKGNhbkluc3BlY3QoeCkgJiYgdHlwZW9mIHggIT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KGAke0pTT04uc3RyaW5naWZ5KHgpfSBzaG91bGQgYmUgYSBudW1iZXJgKTtcbiAgfVxuICByZXR1cm4gVkFMSURBVElPTl9TVUNDRVNTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVCb29sZWFuKHg6IGFueSk6IFZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoY2FuSW5zcGVjdCh4KSAmJiB0eXBlb2YgeCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KGAke0pTT04uc3RyaW5naWZ5KHgpfSBzaG91bGQgYmUgYSBib29sZWFuYCk7XG4gIH1cbiAgcmV0dXJuIFZBTElEQVRJT05fU1VDQ0VTUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRGF0ZSh4OiBhbnkpOiBWYWxpZGF0aW9uUmVzdWx0IHtcbiAgaWYgKGNhbkluc3BlY3QoeCkgJiYgISh4IGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25SZXN1bHQoYCR7SlNPTi5zdHJpbmdpZnkoeCl9IHNob3VsZCBiZSBhIERhdGVgKTtcbiAgfVxuXG4gIGlmICh4ICE9PSB1bmRlZmluZWQgJiYgaXNOYU4oeC5nZXRUaW1lKCkpKSB7XG4gICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KCdnb3QgYW4gdW5wYXJzZWFibGUgRGF0ZScpO1xuICB9XG5cbiAgcmV0dXJuIFZBTElEQVRJT05fU1VDQ0VTUztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlT2JqZWN0KHg6IGFueSk6IFZhbGlkYXRpb25SZXN1bHQge1xuICBpZiAoY2FuSW5zcGVjdCh4KSAmJiB0eXBlb2YgeCAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25SZXN1bHQoYCR7SlNPTi5zdHJpbmdpZnkoeCl9IHNob3VsZCBiZSBhbiAnb2JqZWN0J2ApO1xuICB9XG4gIHJldHVybiBWQUxJREFUSU9OX1NVQ0NFU1M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUNmblRhZyh4OiBhbnkpOiBWYWxpZGF0aW9uUmVzdWx0IHtcbiAgaWYgKCFjYW5JbnNwZWN0KHgpKSB7IHJldHVybiBWQUxJREFUSU9OX1NVQ0NFU1M7IH1cblxuICBpZiAoeC5rZXkgPT0gbnVsbCB8fCB4LnZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25SZXN1bHQoYCR7SlNPTi5zdHJpbmdpZnkoeCl9IHNob3VsZCBoYXZlIGEgJ2tleScgYW5kIGEgJ3ZhbHVlJyBwcm9wZXJ0eWApO1xuICB9XG5cbiAgcmV0dXJuIFZBTElEQVRJT05fU1VDQ0VTUztcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBsaXN0IHZhbGlkYXRvciBiYXNlZCBvbiB0aGUgZ2l2ZW4gZWxlbWVudCB2YWxpZGF0b3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpc3RWYWxpZGF0b3IoZWxlbWVudFZhbGlkYXRvcjogVmFsaWRhdG9yKTogVmFsaWRhdG9yIHtcbiAgcmV0dXJuICh4OiBhbnkpID0+IHtcbiAgICBpZiAoIWNhbkluc3BlY3QoeCkpIHsgcmV0dXJuIFZBTElEQVRJT05fU1VDQ0VTUzsgfVxuXG4gICAgaWYgKCF4LmZvckVhY2gpIHtcbiAgICAgIHJldHVybiBuZXcgVmFsaWRhdGlvblJlc3VsdChgJHtKU09OLnN0cmluZ2lmeSh4KX0gc2hvdWxkIGJlIGEgbGlzdGApO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHhbaV07XG4gICAgICBjb25zdCByZXN1bHQgPSBlbGVtZW50VmFsaWRhdG9yKGVsZW1lbnQpO1xuICAgICAgaWYgKCFyZXN1bHQuaXNTdWNjZXNzKSB7IHJldHVybiByZXN1bHQucHJlZml4KGBlbGVtZW50ICR7aX1gKTsgfVxuICAgIH1cblxuICAgIHJldHVybiBWQUxJREFUSU9OX1NVQ0NFU1M7XG4gIH07XG59XG5cbi8qKlxuICogUmV0dXJuIGEgaGFzaCB2YWxpZGF0b3IgYmFzZWQgb24gdGhlIGdpdmVuIGVsZW1lbnQgdmFsaWRhdG9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNoVmFsaWRhdG9yKGVsZW1lbnRWYWxpZGF0b3I6IFZhbGlkYXRvcik6IFZhbGlkYXRvciB7XG4gIHJldHVybiAoeDogYW55KSA9PiB7XG4gICAgaWYgKCFjYW5JbnNwZWN0KHgpKSB7IHJldHVybiBWQUxJREFUSU9OX1NVQ0NFU1M7IH1cblxuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHgpKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBlbGVtZW50VmFsaWRhdG9yKHhba2V5XSk7XG4gICAgICBpZiAoIXJlc3VsdC5pc1N1Y2Nlc3MpIHsgcmV0dXJuIHJlc3VsdC5wcmVmaXgoYGVsZW1lbnQgJyR7a2V5fSdgKTsgfVxuICAgIH1cblxuICAgIHJldHVybiBWQUxJREFUSU9OX1NVQ0NFU1M7XG4gIH07XG59XG5cbi8qKlxuICogRGVjb3JhdGUgYSB2YWxpZGF0b3Igd2l0aCBhIG1lc3NhZ2UgY2xhcmlmeWluZyB0aGUgcHJvcGVydHkgdGhlIGZhaWx1cmUgaXMgZm9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvcGVydHlWYWxpZGF0b3IocHJvcE5hbWU6IHN0cmluZywgdmFsaWRhdG9yOiBWYWxpZGF0b3IpOiBWYWxpZGF0b3Ige1xuICByZXR1cm4gKHg6IGFueSkgPT4ge1xuICAgIHJldHVybiB2YWxpZGF0b3IoeCkucHJlZml4KHByb3BOYW1lKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSB2YWxpZGF0b3IgdGhhdCB3aWxsIGZhaWwgaWYgdGhlIHBhc3NlZCBwcm9wZXJ0eSBpcyBub3QgcHJlc2VudFxuICpcbiAqIERvZXMgbm90IGRpc3Rpbmd1aXNoIGJldHdlZW4gdGhlIHByb3BlcnR5IGFjdHVhbGx5IG5vdCBiZWluZyBwcmVzZW50LCB2cyBiZWluZyBwcmVzZW50IGJ1dCAnbnVsbCdcbiAqIG9yICd1bmRlZmluZWQnIChjb3VydGVzeSBvZiBKYXZhU2NyaXB0KSwgd2hpY2ggaXMgZ2VuZXJhbGx5IHRoZSBiZWhhdmlvciB0aGF0IHdlIHdhbnQuXG4gKlxuICogRW1wdHkgc3RyaW5ncyBhcmUgY29uc2lkZXJlZCBcInByZXNlbnRcIi0tZG9uJ3Qga25vdyBpZiB0aGlzIGFncmVlcyB3aXRoIGhvdyBDbG91ZEZvcm1hdGlvbiBsb29rc1xuICogYXQgdGhlIHdvcmxkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVxdWlyZWRWYWxpZGF0b3IoeDogYW55KSB7XG4gIGlmICh4ID09IG51bGwpIHtcbiAgICByZXR1cm4gbmV3IFZhbGlkYXRpb25SZXN1bHQoJ3JlcXVpcmVkIGJ1dCBtaXNzaW5nJyk7XG4gIH1cbiAgcmV0dXJuIFZBTElEQVRJT05fU1VDQ0VTUztcbn1cblxuLyoqXG4gKiBSZXF1aXJlIGEgcHJvcGVydHkgZnJvbSBhIHByb3BlcnR5IGJhZy5cbiAqXG4gKiBAcGFyYW0gcHJvcHMgIHRoZSBwcm9wZXJ0eSBiYWcgZnJvbSB3aGljaCBhIHByb3BlcnR5IGlzIHJlcXVpcmVkLlxuICogQHBhcmFtIG5hbWUgICB0aGUgbmFtZSBvZiB0aGUgcmVxdWlyZWQgcHJvcGVydHkuXG4gKiBAcGFyYW0gdHlwZU5hbWUgdGhlIG5hbWUgb2YgdGhlIGNvbnN0cnVjdCB0eXBlIHRoYXQgcmVxdWlyZXMgdGhlIHByb3BlcnR5XG4gKlxuICogQHJldHVybnMgdGhlIHZhbHVlIG9mIGBgcHJvcHNbbmFtZV1gYFxuICpcbiAqIEB0aHJvd3MgaWYgdGhlIHByb3BlcnR5IGBgbmFtZWBgIGlzIG5vdCBwcmVzZW50IGluIGBgcHJvcHNgYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVQcm9wZXJ0eShwcm9wczogeyBbbmFtZTogc3RyaW5nXTogYW55IH0sIG5hbWU6IHN0cmluZywgY29udGV4dDogQ29uc3RydWN0KTogYW55IHtcbiAgY29uc3QgdmFsdWUgPSBwcm9wc1tuYW1lXTtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7Y29udGV4dC50b1N0cmluZygpfSBpcyBtaXNzaW5nIHJlcXVpcmVkIHByb3BlcnR5OiAke25hbWV9YCk7XG4gIH1cbiAgLy8gUG9zc2libHkgYWRkIHR5cGUtY2hlY2tpbmcgaGVyZS4uLlxuICByZXR1cm4gdmFsdWU7XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIGlmIGFueSBvZiB0aGUgZ2l2ZW4gdmFsaWRhdG9ycyBtYXRjaGVzXG4gKlxuICogV2UgYWRkIGVpdGhlci9vciB3b3JkcyB0byB0aGUgZnJvbnQgb2YgdGhlIGVycm9yIG1lc3NhZ2VzIHNvIHRoYXQgdGhleSByZWFkXG4gKiBtb3JlIG5pY2VseS4gRXhhbXBsZTpcbiAqXG4gKiAgIFByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yICdGdW5jdGlvblByb3BzJ1xuICogICAgIGNvZGVVcmk6IG5vdCBvbmUgb2YgdGhlIHBvc3NpYmxlIHR5cGVzXG4gKiAgICAgICBlaXRoZXI6IHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yICdTM0xvY2F0aW9uUHJvcGVydHknXG4gKiAgICAgICAgIGJ1Y2tldDogcmVxdWlyZWQgYnV0IG1pc3NpbmdcbiAqICAgICAgICAga2V5OiByZXF1aXJlZCBidXQgbWlzc2luZ1xuICogICAgICAgICB2ZXJzaW9uOiByZXF1aXJlZCBidXQgbWlzc2luZ1xuICogICAgICAgb3I6ICczJyBzaG91bGQgYmUgYSAnc3RyaW5nJ1xuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaW9uVmFsaWRhdG9yKC4uLnZhbGlkYXRvcnM6IFZhbGlkYXRvcltdKTogVmFsaWRhdG9yIHtcbiAgcmV0dXJuICh4OiBhbnkpID0+IHtcbiAgICBjb25zdCByZXN1bHRzID0gbmV3IFZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgbGV0IGVpdGhlck9yID0gJ2VpdGhlcic7XG5cbiAgICBmb3IgKGNvbnN0IHZhbGlkYXRvciBvZiB2YWxpZGF0b3JzKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB2YWxpZGF0b3IoeCk7XG4gICAgICBpZiAocmVzdWx0LmlzU3VjY2VzcykgeyByZXR1cm4gcmVzdWx0OyB9XG4gICAgICByZXN1bHRzLmNvbGxlY3QocmVzdWx0LnByZWZpeChlaXRoZXJPcikpO1xuICAgICAgZWl0aGVyT3IgPSAnb3InO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cy53cmFwKCdub3Qgb25lIG9mIHRoZSBwb3NzaWJsZSB0eXBlcycpO1xuICB9O1xufVxuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIHRoZSBpbmRpY2F0ZWQgdmFsdWUgcmVwcmVzZW50cyBhIENsb3VkRm9ybWF0aW9uIGludHJpbnNpYy5cbiAqXG4gKiBDbG91ZEZvcm1hdGlvbiBpbnRyaW5zaWNzIGFyZSBtb2RlbGVkIGFzIG9iamVjdHMgd2l0aCBhIHNpbmdsZSBrZXksIHdoaWNoXG4gKiBsb29rIGxpa2U6IHsgXCJGbjo6R2V0QXR0XCI6IFsuLi5dIH0gb3Igc2ltaWxhci5cbiAqL1xuZnVuY3Rpb24gaXNDbG91ZEZvcm1hdGlvbkludHJpbnNpYyh4OiBhbnkpIHtcbiAgaWYgKCEodHlwZW9mIHggPT09ICdvYmplY3QnKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHgpO1xuICBpZiAoa2V5cy5sZW5ndGggIT09IDEpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgcmV0dXJuIGtleXNbMF0gPT09ICdSZWYnIHx8IGtleXNbMF0uc2xpY2UoMCwgNCkgPT09ICdGbjo6Jztcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBpbmRpY2F0ZWQgdmFsdWUgaXMgYSBDbG91ZEZvcm1hdGlvbiBkeW5hbWljIHJlZmVyZW5jZS5cbiAqXG4gKiBDbG91ZEZvcm1hdGlvbiBkeW5hbWljIHJlZmVyZW5jZXMgdGFrZSB0aGUgZm9ybWF0OiAne3tyZXNvbHZlOnNlcnZpY2UtbmFtZTpyZWZlcmVuY2Uta2V5fX0nXG4gKi9cbmZ1bmN0aW9uIGlzQ2xvdWRGb3JtYXRpb25EeW5hbWljUmVmZXJlbmNlKHg6IGFueSkge1xuICByZXR1cm4gKHR5cGVvZiB4ID09PSAnc3RyaW5nJyAmJiB4LnN0YXJ0c1dpdGgoJ3t7cmVzb2x2ZTonKSAmJiB4LmVuZHNXaXRoKCd9fScpKTtcbn1cblxuLy8gQ2Fubm90IGJlIHB1YmxpYyBiZWNhdXNlIEpTSUkgZ2V0cyBjb25mdXNlZCBhYm91dCBlczUuZC50c1xuY2xhc3MgQ2ZuU3ludGhlc2lzRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIHB1YmxpYyByZWFkb25seSB0eXBlID0gJ0NmblN5bnRoZXNpc0Vycm9yJztcbn1cbiJdfQ==