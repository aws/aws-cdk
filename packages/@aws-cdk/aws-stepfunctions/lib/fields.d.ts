import { IResolvable } from '@aws-cdk/core';
/**
 * Extract a field from the State Machine data or context
 * that gets passed around between states
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-paths.html
 */
export declare class JsonPath {
    /**
     * Special string value to discard state input, output or result
     */
    static readonly DISCARD = "DISCARD";
    /**
     * Instead of using a literal string, get the value from a JSON path
     */
    static stringAt(path: string): string;
    /**
     * Instead of using a literal string list, get the value from a JSON path
     */
    static listAt(path: string): string[];
    /**
     * Instead of using a literal number, get the value from a JSON path
     */
    static numberAt(path: string): number;
    /**
     * Reference a complete (complex) object in a JSON path location
     */
    static objectAt(path: string): IResolvable;
    /**
     * Use the entire data structure
     *
     * Will be an object at invocation time, but is represented in the CDK
     * application as a string.
     */
    static get entirePayload(): string;
    /**
     * Determines if the indicated string is an encoded JSON path
     *
     * @param value string to be evaluated
     */
    static isEncodedJsonPath(value: string): boolean;
    /**
     * Return the Task Token field
     *
     * External actions will need this token to report step completion
     * back to StepFunctions using the `SendTaskSuccess` or `SendTaskFailure`
     * calls.
     */
    static get taskToken(): string;
    /**
     * Use the entire context data structure
     *
     * Will be an object at invocation time, but is represented in the CDK
     * application as a string.
     */
    static get entireContext(): string;
    /**
     * Make an intrinsic States.Array expression
     *
     * Combine any number of string literals or JsonPath expressions into an array.
     *
     * Use this function if the value of an array element directly has to come
     * from a JSON Path expression (either the State object or the Context object).
     *
     * If the array contains object literals whose values come from a JSON path
     * expression, you do not need to use this function.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static array(...values: string[]): string;
    /**
     * Make an intrinsic States.ArrayPartition expression
     *
     * Use this function to partition a large array. You can also use this intrinsic to slice the data and then send the payload in smaller chunks.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static arrayPartition(array: any, chunkSize: number): string;
    /**
     * Make an intrinsic States.ArrayContains expression
     *
     * Use this function to determine if a specific value is present in an array. For example, you can use this function to detect if there was an error in a Map state iteration.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static arrayContains(array: any, value: any): string;
    /**
     * Make an intrinsic States.ArrayRange expression
     *
     * Use this function to create a new array containing a specific range of elements. The new array can contain up to 1000 elements.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static arrayRange(start: number, end: number, step: number): string;
    /**
     * Make an intrinsic States.ArrayGetItem expression
     *
     * Use this function to get a specified index's value in an array.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static arrayGetItem(array: any, index: number): string;
    /**
     * Make an intrinsic States.ArrayLength expression
     *
     * Use this function to get the length of an array.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static arrayLength(array: any): string;
    /**
     * Make an intrinsic States.ArrayUnique expression
     *
     * Use this function to get the length of an array.
     * Use this function to remove duplicate values from an array and returns an array containing only unique elements. This function takes an array, which can be unsorted, as its sole argument.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static arrayUnique(array: any): string;
    /**
     * Make an intrinsic States.Base64Encode expression
     *
     * Use this function to encode data based on MIME Base64 encoding scheme. You can use this function to pass data to other AWS services without using an AWS Lambda function.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static base64Encode(input: string): string;
    /**
     * Make an intrinsic States.Base64Decode expression
     *
     * Use this function to decode data based on MIME Base64 decoding scheme. You can use this function to pass data to other AWS services without using a Lambda function.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static base64Decode(base64: string): string;
    /**
     * Make an intrinsic States.Hash expression
     *
     * Use this function to calculate the hash value of a given input. You can use this function to pass data to other AWS services without using a Lambda function.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static hash(data: any, algorithm: string): string;
    /**
     * Make an intrinsic States.JsonMerge expression
     *
     * Use this function to merge two JSON objects into a single object.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static jsonMerge(value1: any, value2: any): string;
    /**
     * Make an intrinsic States.MathRandom expression
     *
     * Use this function to return a random number between the specified start and end number. For example, you can use this function to distribute a specific task between two or more resources.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static mathRandom(start: number, end: number): string;
    /**
     * Make an intrinsic States.MathAdd expression
     *
     * Use this function to return the sum of two numbers. For example, you can use this function to increment values inside a loop without invoking a Lambda function.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static mathAdd(num1: number, num2: number): string;
    /**
     * Make an intrinsic States.StringSplit expression
     *
     * Use this function to split a string into an array of values. This function takes two arguments.The first argument is a string and the second argument is the delimiting character that the function will use to divide the string.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static stringSplit(inputString: string, splitter: string): string;
    /**
     * Make an intrinsic States.UUID expression
     *
     * Use this function to return a version 4 universally unique identifier (v4 UUID) generated using random numbers. For example, you can use this function to call other AWS services or resources that need a UUID parameter or insert items in a DynamoDB table.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static uuid(): string;
    /**
     * Make an intrinsic States.Format expression
     *
     * This can be used to embed JSON Path variables inside a format string.
     *
     * For example:
     *
     * ```ts
     * sfn.JsonPath.format('Hello, my name is {}.', sfn.JsonPath.stringAt('$.name'))
     * ```
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static format(formatString: string, ...values: string[]): string;
    /**
     * Make an intrinsic States.StringToJson expression
     *
     * During the execution of the Step Functions state machine, parse the given
     * argument as JSON into its object form.
     *
     * For example:
     *
     * ```ts
     * sfn.JsonPath.stringToJson(sfn.JsonPath.stringAt('$.someJsonBody'))
     * ```
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static stringToJson(jsonString: string): IResolvable;
    /**
     * Make an intrinsic States.JsonToString expression
     *
     * During the execution of the Step Functions state machine, encode the
     * given object into a JSON string.
     *
     * For example:
     *
     * ```ts
     * sfn.JsonPath.jsonToString(sfn.JsonPath.objectAt('$.someObject'))
     * ```
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static jsonToString(value: any): string;
    private constructor();
}
/**
 * Extract a field from the State Machine data that gets passed around between states
 *
 * @deprecated replaced by `JsonPath`
 */
export declare class Data {
    /**
     * Instead of using a literal string, get the value from a JSON path
     */
    static stringAt(path: string): string;
    /**
     * Instead of using a literal string list, get the value from a JSON path
     */
    static listAt(path: string): string[];
    /**
     * Instead of using a literal number, get the value from a JSON path
     */
    static numberAt(path: string): number;
    /**
     * Use the entire data structure
     *
     * Will be an object at invocation time, but is represented in the CDK
     * application as a string.
     */
    static get entirePayload(): string;
    /**
     * Determines if the indicated string is an encoded JSON path
     *
     * @param value string to be evaluated
     */
    static isJsonPathString(value: string): boolean;
    private constructor();
}
/**
 * Extract a field from the State Machine Context data
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#wait-token-contextobject
 *
 * @deprecated replaced by `JsonPath`
 */
export declare class Context {
    /**
     * Instead of using a literal string, get the value from a JSON path
     */
    static stringAt(path: string): string;
    /**
     * Instead of using a literal number, get the value from a JSON path
     */
    static numberAt(path: string): number;
    /**
     * Return the Task Token field
     *
     * External actions will need this token to report step completion
     * back to StepFunctions using the `SendTaskSuccess` or `SendTaskFailure`
     * calls.
     */
    static get taskToken(): string;
    /**
     * Use the entire context data structure
     *
     * Will be an object at invocation time, but is represented in the CDK
     * application as a string.
     */
    static get entireContext(): string;
    private constructor();
}
/**
 * Helper functions to work with structures containing fields
 */
export declare class FieldUtils {
    /**
     * Render a JSON structure containing fields to the right StepFunctions structure
     */
    static renderObject(obj?: {
        [key: string]: any;
    }): {
        [key: string]: any;
    } | undefined;
    /**
     * Return all JSON paths used in the given structure
     */
    static findReferencedPaths(obj?: {
        [key: string]: any;
    }): string[];
    /**
     * Returns whether the given task structure contains the TaskToken field anywhere
     *
     * The field is considered included if the field itself or one of its containing
     * fields occurs anywhere in the payload.
     */
    static containsTaskToken(obj?: {
        [key: string]: any;
    }): boolean;
    private constructor();
}
