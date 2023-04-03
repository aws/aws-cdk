import { Construct } from 'constructs';
export declare type Mapper = (x: any) => any;
export declare const stringToCloudFormation: Mapper;
export declare const booleanToCloudFormation: Mapper;
export declare const objectToCloudFormation: Mapper;
export declare const numberToCloudFormation: Mapper;
/**
 * The date needs to be formatted as an ISO date in UTC
 *
 * Some usage sites require a date, some require a timestamp. We'll
 * always output a timestamp and hope the parser on the other end
 * is smart enough to ignore the time part... (?)
 */
export declare function dateToCloudFormation(x?: Date): any;
/**
 * Turn a tag object into the proper CloudFormation representation
 */
export declare function cfnTagToCloudFormation(x: any): any;
export declare function listMapper(elementMapper: Mapper): Mapper;
export declare function hashMapper(elementMapper: Mapper): Mapper;
/**
 * Return a union mapper
 *
 * Takes a list of validators and a list of mappers, which should correspond pairwise.
 *
 * The mapper of the first successful validator will be called.
 */
export declare function unionMapper(validators: Validator[], mappers: Mapper[]): Mapper;
/**
 * Representation of validation results
 *
 * Models a tree of validation errors so that we have as much information as possible
 * about the failure that occurred.
 */
export declare class ValidationResult {
    readonly errorMessage: string;
    readonly results: ValidationResults;
    constructor(errorMessage?: string, results?: ValidationResults);
    get isSuccess(): boolean;
    /**
     * Turn a failed validation into an exception
     */
    assertSuccess(): void;
    /**
     * Return a string rendering of the tree of validation failures
     */
    errorTree(): string;
    /**
     * Wrap this result with an error message, if it concerns an error
     */
    prefix(message: string): ValidationResult;
}
/**
 * A collection of validation results
 */
export declare class ValidationResults {
    results: ValidationResult[];
    constructor(results?: ValidationResult[]);
    collect(result: ValidationResult): void;
    get isSuccess(): boolean;
    errorTreeList(): string;
    /**
     * Wrap up all validation results into a single tree node
     *
     * If there are failures in the collection, add a message, otherwise
     * return a success.
     */
    wrap(message: string): ValidationResult;
}
export declare const VALIDATION_SUCCESS: ValidationResult;
export declare type Validator = (x: any) => ValidationResult;
/**
 * Return whether this object can be validated at all
 *
 * True unless it's undefined or a CloudFormation intrinsic
 */
export declare function canInspect(x: any): boolean;
export declare function validateString(x: any): ValidationResult;
export declare function validateNumber(x: any): ValidationResult;
export declare function validateBoolean(x: any): ValidationResult;
export declare function validateDate(x: any): ValidationResult;
export declare function validateObject(x: any): ValidationResult;
export declare function validateCfnTag(x: any): ValidationResult;
/**
 * Return a list validator based on the given element validator
 */
export declare function listValidator(elementValidator: Validator): Validator;
/**
 * Return a hash validator based on the given element validator
 */
export declare function hashValidator(elementValidator: Validator): Validator;
/**
 * Decorate a validator with a message clarifying the property the failure is for.
 */
export declare function propertyValidator(propName: string, validator: Validator): Validator;
/**
 * Return a validator that will fail if the passed property is not present
 *
 * Does not distinguish between the property actually not being present, vs being present but 'null'
 * or 'undefined' (courtesy of JavaScript), which is generally the behavior that we want.
 *
 * Empty strings are considered "present"--don't know if this agrees with how CloudFormation looks
 * at the world.
 */
export declare function requiredValidator(x: any): ValidationResult;
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
export declare function requireProperty(props: {
    [name: string]: any;
}, name: string, context: Construct): any;
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
export declare function unionValidator(...validators: Validator[]): Validator;
