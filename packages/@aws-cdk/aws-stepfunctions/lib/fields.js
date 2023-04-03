"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldUtils = exports.Context = exports.Data = exports.JsonPath = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const json_path_1 = require("./private/json-path");
/**
 * Extract a field from the State Machine data or context
 * that gets passed around between states
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-paths.html
 */
class JsonPath {
    constructor() { }
    /**
     * Instead of using a literal string, get the value from a JSON path
     */
    static stringAt(path) {
        validateJsonPath(path);
        return new json_path_1.JsonPathToken(path).toString();
    }
    /**
     * Instead of using a literal string list, get the value from a JSON path
     */
    static listAt(path) {
        // does not apply to task context
        validateDataPath(path);
        return core_1.Token.asList(new json_path_1.JsonPathToken(path));
    }
    /**
     * Instead of using a literal number, get the value from a JSON path
     */
    static numberAt(path) {
        validateJsonPath(path);
        return core_1.Token.asNumber(new json_path_1.JsonPathToken(path));
    }
    /**
     * Reference a complete (complex) object in a JSON path location
     */
    static objectAt(path) {
        validateJsonPath(path);
        return new json_path_1.JsonPathToken(path);
    }
    /**
     * Use the entire data structure
     *
     * Will be an object at invocation time, but is represented in the CDK
     * application as a string.
     */
    static get entirePayload() {
        return new json_path_1.JsonPathToken('$').toString();
    }
    /**
     * Determines if the indicated string is an encoded JSON path
     *
     * @param value string to be evaluated
     */
    static isEncodedJsonPath(value) {
        return !!json_path_1.jsonPathString(value);
    }
    /**
     * Return the Task Token field
     *
     * External actions will need this token to report step completion
     * back to StepFunctions using the `SendTaskSuccess` or `SendTaskFailure`
     * calls.
     */
    static get taskToken() {
        return new json_path_1.JsonPathToken('$$.Task.Token').toString();
    }
    /**
     * Use the entire context data structure
     *
     * Will be an object at invocation time, but is represented in the CDK
     * application as a string.
     */
    static get entireContext() {
        return new json_path_1.JsonPathToken('$$').toString();
    }
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
    static array(...values) {
        return new json_path_1.JsonPathToken(`States.Array(${values.map(json_path_1.renderInExpression).join(', ')})`).toString();
    }
    /**
     * Make an intrinsic States.ArrayPartition expression
     *
     * Use this function to partition a large array. You can also use this intrinsic to slice the data and then send the payload in smaller chunks.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static arrayPartition(array, chunkSize) {
        return new json_path_1.JsonPathToken(`States.ArrayPartition(${[array, chunkSize].map(json_path_1.renderInExpression).join(', ')})`).toString();
    }
    /**
     * Make an intrinsic States.ArrayContains expression
     *
     * Use this function to determine if a specific value is present in an array. For example, you can use this function to detect if there was an error in a Map state iteration.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static arrayContains(array, value) {
        return new json_path_1.JsonPathToken(`States.ArrayContains(${[array, value].map(json_path_1.renderInExpression).join(', ')})`).toString();
    }
    /**
     * Make an intrinsic States.ArrayRange expression
     *
     * Use this function to create a new array containing a specific range of elements. The new array can contain up to 1000 elements.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static arrayRange(start, end, step) {
        return new json_path_1.JsonPathToken(`States.ArrayRange(${[start, end, step].map(json_path_1.renderInExpression).join(', ')})`).toString();
    }
    /**
     * Make an intrinsic States.ArrayGetItem expression
     *
     * Use this function to get a specified index's value in an array.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static arrayGetItem(array, index) {
        return new json_path_1.JsonPathToken(`States.ArrayGetItem(${[array, index].map(json_path_1.renderInExpression).join(', ')})`).toString();
    }
    /**
     * Make an intrinsic States.ArrayLength expression
     *
     * Use this function to get the length of an array.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static arrayLength(array) {
        return new json_path_1.JsonPathToken(`States.ArrayLength(${json_path_1.renderInExpression(array)})`).toString();
    }
    /**
     * Make an intrinsic States.ArrayUnique expression
     *
     * Use this function to get the length of an array.
     * Use this function to remove duplicate values from an array and returns an array containing only unique elements. This function takes an array, which can be unsorted, as its sole argument.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static arrayUnique(array) {
        return new json_path_1.JsonPathToken(`States.ArrayUnique(${json_path_1.renderInExpression(array)})`).toString();
    }
    /**
     * Make an intrinsic States.Base64Encode expression
     *
     * Use this function to encode data based on MIME Base64 encoding scheme. You can use this function to pass data to other AWS services without using an AWS Lambda function.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static base64Encode(input) {
        return new json_path_1.JsonPathToken(`States.Base64Encode(${json_path_1.renderInExpression(input)})`).toString();
    }
    /**
     * Make an intrinsic States.Base64Decode expression
     *
     * Use this function to decode data based on MIME Base64 decoding scheme. You can use this function to pass data to other AWS services without using a Lambda function.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static base64Decode(base64) {
        return new json_path_1.JsonPathToken(`States.Base64Decode(${json_path_1.renderInExpression(base64)})`).toString();
    }
    /**
     * Make an intrinsic States.Hash expression
     *
     * Use this function to calculate the hash value of a given input. You can use this function to pass data to other AWS services without using a Lambda function.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static hash(data, algorithm) {
        return new json_path_1.JsonPathToken(`States.Hash(${[data, algorithm].map(json_path_1.renderInExpression).join(', ')})`).toString();
    }
    /**
     * Make an intrinsic States.JsonMerge expression
     *
     * Use this function to merge two JSON objects into a single object.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static jsonMerge(value1, value2) {
        return new json_path_1.JsonPathToken(`States.JsonMerge(${[value1, value2].map(json_path_1.renderInExpression).join(', ')}, false)`).toString();
    }
    /**
     * Make an intrinsic States.MathRandom expression
     *
     * Use this function to return a random number between the specified start and end number. For example, you can use this function to distribute a specific task between two or more resources.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static mathRandom(start, end) {
        return new json_path_1.JsonPathToken(`States.MathRandom(${[start, end].map(json_path_1.renderInExpression).join(', ')})`).toString();
    }
    /**
     * Make an intrinsic States.MathAdd expression
     *
     * Use this function to return the sum of two numbers. For example, you can use this function to increment values inside a loop without invoking a Lambda function.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static mathAdd(num1, num2) {
        return new json_path_1.JsonPathToken(`States.MathAdd(${[num1, num2].map(json_path_1.renderInExpression).join(', ')})`).toString();
    }
    /**
     * Make an intrinsic States.StringSplit expression
     *
     * Use this function to split a string into an array of values. This function takes two arguments.The first argument is a string and the second argument is the delimiting character that the function will use to divide the string.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static stringSplit(inputString, splitter) {
        return new json_path_1.JsonPathToken(`States.StringSplit(${[inputString, splitter].map(json_path_1.renderInExpression).join(', ')})`).toString();
    }
    /**
     * Make an intrinsic States.UUID expression
     *
     * Use this function to return a version 4 universally unique identifier (v4 UUID) generated using random numbers. For example, you can use this function to call other AWS services or resources that need a UUID parameter or insert items in a DynamoDB table.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
     */
    static uuid() {
        return new json_path_1.JsonPathToken('States.UUID()').toString();
    }
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
    static format(formatString, ...values) {
        const allArgs = [formatString, ...values];
        return new json_path_1.JsonPathToken(`States.Format(${allArgs.map(json_path_1.renderInExpression).join(', ')})`).toString();
    }
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
    static stringToJson(jsonString) {
        return new json_path_1.JsonPathToken(`States.StringToJson(${json_path_1.renderInExpression(jsonString)})`);
    }
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
    static jsonToString(value) {
        const path = json_path_1.jsonPathFromAny(value);
        if (!path) {
            throw new Error('Argument to JsonPath.jsonToString() must be a JsonPath object');
        }
        return new json_path_1.JsonPathToken(`States.JsonToString(${path})`).toString();
    }
}
exports.JsonPath = JsonPath;
_a = JSII_RTTI_SYMBOL_1;
JsonPath[_a] = { fqn: "@aws-cdk/aws-stepfunctions.JsonPath", version: "0.0.0" };
/**
 * Special string value to discard state input, output or result
 */
JsonPath.DISCARD = 'DISCARD';
/**
 * Extract a field from the State Machine data that gets passed around between states
 *
 * @deprecated replaced by `JsonPath`
 */
class Data {
    constructor() { }
    /**
     * Instead of using a literal string, get the value from a JSON path
     */
    static stringAt(path) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Data#stringAt", "replaced by `JsonPath`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.stringAt);
            }
            throw error;
        }
        validateDataPath(path);
        return new json_path_1.JsonPathToken(path).toString();
    }
    /**
     * Instead of using a literal string list, get the value from a JSON path
     */
    static listAt(path) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Data#listAt", "replaced by `JsonPath`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.listAt);
            }
            throw error;
        }
        validateDataPath(path);
        return core_1.Token.asList(new json_path_1.JsonPathToken(path));
    }
    /**
     * Instead of using a literal number, get the value from a JSON path
     */
    static numberAt(path) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Data#numberAt", "replaced by `JsonPath`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.numberAt);
            }
            throw error;
        }
        validateDataPath(path);
        return core_1.Token.asNumber(new json_path_1.JsonPathToken(path));
    }
    /**
     * Use the entire data structure
     *
     * Will be an object at invocation time, but is represented in the CDK
     * application as a string.
     */
    static get entirePayload() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Data#entirePayload", "replaced by `JsonPath`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "entirePayload").get);
            }
            throw error;
        }
        return new json_path_1.JsonPathToken('$').toString();
    }
    /**
     * Determines if the indicated string is an encoded JSON path
     *
     * @param value string to be evaluated
     */
    static isJsonPathString(value) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Data#isJsonPathString", "replaced by `JsonPath`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.isJsonPathString);
            }
            throw error;
        }
        return !!json_path_1.jsonPathString(value);
    }
}
exports.Data = Data;
_b = JSII_RTTI_SYMBOL_1;
Data[_b] = { fqn: "@aws-cdk/aws-stepfunctions.Data", version: "0.0.0" };
/**
 * Extract a field from the State Machine Context data
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#wait-token-contextobject
 *
 * @deprecated replaced by `JsonPath`
 */
class Context {
    constructor() { }
    /**
     * Instead of using a literal string, get the value from a JSON path
     */
    static stringAt(path) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Context#stringAt", "replaced by `JsonPath`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.stringAt);
            }
            throw error;
        }
        validateContextPath(path);
        return new json_path_1.JsonPathToken(path).toString();
    }
    /**
     * Instead of using a literal number, get the value from a JSON path
     */
    static numberAt(path) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Context#numberAt", "replaced by `JsonPath`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.numberAt);
            }
            throw error;
        }
        validateContextPath(path);
        return core_1.Token.asNumber(new json_path_1.JsonPathToken(path));
    }
    /**
     * Return the Task Token field
     *
     * External actions will need this token to report step completion
     * back to StepFunctions using the `SendTaskSuccess` or `SendTaskFailure`
     * calls.
     */
    static get taskToken() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Context#taskToken", "replaced by `JsonPath`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "taskToken").get);
            }
            throw error;
        }
        return new json_path_1.JsonPathToken('$$.Task.Token').toString();
    }
    /**
     * Use the entire context data structure
     *
     * Will be an object at invocation time, but is represented in the CDK
     * application as a string.
     */
    static get entireContext() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-stepfunctions.Context#entireContext", "replaced by `JsonPath`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "entireContext").get);
            }
            throw error;
        }
        return new json_path_1.JsonPathToken('$$').toString();
    }
}
exports.Context = Context;
_c = JSII_RTTI_SYMBOL_1;
Context[_c] = { fqn: "@aws-cdk/aws-stepfunctions.Context", version: "0.0.0" };
/**
 * Helper functions to work with structures containing fields
 */
class FieldUtils {
    constructor() { }
    /**
     * Render a JSON structure containing fields to the right StepFunctions structure
     */
    static renderObject(obj) {
        return json_path_1.renderObject(obj);
    }
    /**
     * Return all JSON paths used in the given structure
     */
    static findReferencedPaths(obj) {
        return Array.from(json_path_1.findReferencedPaths(obj)).sort();
    }
    /**
     * Returns whether the given task structure contains the TaskToken field anywhere
     *
     * The field is considered included if the field itself or one of its containing
     * fields occurs anywhere in the payload.
     */
    static containsTaskToken(obj) {
        const paths = json_path_1.findReferencedPaths(obj);
        return paths.has('$$.Task.Token') || paths.has('$$.Task') || paths.has('$$');
    }
}
exports.FieldUtils = FieldUtils;
_d = JSII_RTTI_SYMBOL_1;
FieldUtils[_d] = { fqn: "@aws-cdk/aws-stepfunctions.FieldUtils", version: "0.0.0" };
function validateJsonPath(path) {
    const intrinsicFunctionNames = [
        // Intrinsics for arrays
        'Array',
        'ArrayPartition',
        'ArrayContains',
        'ArrayRange',
        'ArrayGetItem',
        'ArrayLength',
        'ArrayUnique',
        // Intrinsics for data encoding and decoding
        'Base64Encode',
        'Base64Decode',
        // Intrinsic for hash calculation
        'Hash',
        // Intrinsics for JSON data manipulation
        'JsonMerge',
        'StringToJson',
        'JsonToString',
        // Intrinsics for Math operations
        'MathRandom',
        'MathAdd',
        // Intrinsic for String operation
        'StringSplit',
        // Intrinsic for unique identifier generation
        'UUID',
        // Intrinsic for generic operation
        'Format',
    ];
    const intrinsicFunctionFullNames = intrinsicFunctionNames.map((fn) => `States.${fn}`);
    if (path !== '$'
        && !path.startsWith('$.')
        && path !== '$$'
        && !path.startsWith('$$.')
        && !path.startsWith('$[')
        && intrinsicFunctionFullNames.every(fn => !path.startsWith(fn))) {
        const lastItem = intrinsicFunctionFullNames.pop();
        const intrinsicFunctionsStr = intrinsicFunctionFullNames.join(', ') + ', or ' + lastItem;
        throw new Error(`JSON path values must be exactly '$', '$$', start with '$.', start with '$$.', start with '$[', or start with an intrinsic function: ${intrinsicFunctionsStr}. Received: ${path}`);
    }
}
function validateDataPath(path) {
    if (path !== '$'
        && !path.startsWith('$[')
        && !path.startsWith('$.')) {
        throw new Error("Data JSON path values must either be exactly equal to '$', start with '$[' or start with '$.'");
    }
}
function validateContextPath(path) {
    if (path !== '$$' && !path.startsWith('$$.')) {
        throw new Error("Context JSON path values must either be exactly equal to '$$' or start with '$$.'");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmllbGRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUFtRDtBQUNuRCxtREFBNEk7QUFFNUk7Ozs7O0dBS0c7QUFDSCxNQUFhLFFBQVE7SUFzVG5CLGlCQUF3QjtJQWhUeEI7O09BRUc7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQVk7UUFDakMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsT0FBTyxJQUFJLHlCQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDM0M7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBWTtRQUMvQixpQ0FBaUM7UUFDakMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsT0FBTyxZQUFLLENBQUMsTUFBTSxDQUFDLElBQUkseUJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQzlDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQVk7UUFDakMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsT0FBTyxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUkseUJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ2hEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQVk7UUFDakMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsT0FBTyxJQUFJLHlCQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEM7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sS0FBSyxhQUFhO1FBQzdCLE9BQU8sSUFBSSx5QkFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQzFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFhO1FBQzNDLE9BQU8sQ0FBQyxDQUFD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LGdCQUFnQixDQUFDLElBQVk7SUFDcEMsSUFBSSxJQUFJLEtBQUssR0FBRztXQUNYLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7V0FDdEIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0ZBQStGLENBQUMsQ0FBQztLQUNsSDtBQUNILENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLElBQVk7SUFDdkMsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLG1GQUFtRixDQUFDLENBQUM7S0FDdEc7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVG9rZW4sIElSZXNvbHZhYmxlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBmaW5kUmVmZXJlbmNlZFBhdGhzLCBqc29uUGF0aFN0cmluZywgSnNvblBhdGhUb2tlbiwgcmVuZGVyT2JqZWN0LCByZW5kZXJJbkV4cHJlc3Npb24sIGpzb25QYXRoRnJvbUFueSB9IGZyb20gJy4vcHJpdmF0ZS9qc29uLXBhdGgnO1xuXG4vKipcbiAqIEV4dHJhY3QgYSBmaWVsZCBmcm9tIHRoZSBTdGF0ZSBNYWNoaW5lIGRhdGEgb3IgY29udGV4dFxuICogdGhhdCBnZXRzIHBhc3NlZCBhcm91bmQgYmV0d2VlbiBzdGF0ZXNcbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvYW1hem9uLXN0YXRlcy1sYW5ndWFnZS1wYXRocy5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBKc29uUGF0aCB7XG4gIC8qKlxuICAgKiBTcGVjaWFsIHN0cmluZyB2YWx1ZSB0byBkaXNjYXJkIHN0YXRlIGlucHV0LCBvdXRwdXQgb3IgcmVzdWx0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERJU0NBUkQgPSAnRElTQ0FSRCc7XG5cbiAgLyoqXG4gICAqIEluc3RlYWQgb2YgdXNpbmcgYSBsaXRlcmFsIHN0cmluZywgZ2V0IHRoZSB2YWx1ZSBmcm9tIGEgSlNPTiBwYXRoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHN0cmluZ0F0KHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgdmFsaWRhdGVKc29uUGF0aChwYXRoKTtcbiAgICByZXR1cm4gbmV3IEpzb25QYXRoVG9rZW4ocGF0aCkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0ZWFkIG9mIHVzaW5nIGEgbGl0ZXJhbCBzdHJpbmcgbGlzdCwgZ2V0IHRoZSB2YWx1ZSBmcm9tIGEgSlNPTiBwYXRoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGxpc3RBdChwYXRoOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgLy8gZG9lcyBub3QgYXBwbHkgdG8gdGFzayBjb250ZXh0XG4gICAgdmFsaWRhdGVEYXRhUGF0aChwYXRoKTtcbiAgICByZXR1cm4gVG9rZW4uYXNMaXN0KG5ldyBKc29uUGF0aFRva2VuKHBhdGgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0ZWFkIG9mIHVzaW5nIGEgbGl0ZXJhbCBudW1iZXIsIGdldCB0aGUgdmFsdWUgZnJvbSBhIEpTT04gcGF0aFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBudW1iZXJBdChwYXRoOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHZhbGlkYXRlSnNvblBhdGgocGF0aCk7XG4gICAgcmV0dXJuIFRva2VuLmFzTnVtYmVyKG5ldyBKc29uUGF0aFRva2VuKHBhdGgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgYSBjb21wbGV0ZSAoY29tcGxleCkgb2JqZWN0IGluIGEgSlNPTiBwYXRoIGxvY2F0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG9iamVjdEF0KHBhdGg6IHN0cmluZyk6IElSZXNvbHZhYmxlIHtcbiAgICB2YWxpZGF0ZUpzb25QYXRoKHBhdGgpO1xuICAgIHJldHVybiBuZXcgSnNvblBhdGhUb2tlbihwYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGVudGlyZSBkYXRhIHN0cnVjdHVyZVxuICAgKlxuICAgKiBXaWxsIGJlIGFuIG9iamVjdCBhdCBpbnZvY2F0aW9uIHRpbWUsIGJ1dCBpcyByZXByZXNlbnRlZCBpbiB0aGUgQ0RLXG4gICAqIGFwcGxpY2F0aW9uIGFzIGEgc3RyaW5nLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXQgZW50aXJlUGF5bG9hZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSnNvblBhdGhUb2tlbignJCcpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgaW5kaWNhdGVkIHN0cmluZyBpcyBhbiBlbmNvZGVkIEpTT04gcGF0aFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgc3RyaW5nIHRvIGJlIGV2YWx1YXRlZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc0VuY29kZWRKc29uUGF0aCh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhanNvblBhdGhTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgVGFzayBUb2tlbiBmaWVsZFxuICAgKlxuICAgKiBFeHRlcm5hbCBhY3Rpb25zIHdpbGwgbmVlZCB0aGlzIHRva2VuIHRvIHJlcG9ydCBzdGVwIGNvbXBsZXRpb25cbiAgICogYmFjayB0byBTdGVwRnVuY3Rpb25zIHVzaW5nIHRoZSBgU2VuZFRhc2tTdWNjZXNzYCBvciBgU2VuZFRhc2tGYWlsdXJlYFxuICAgKiBjYWxscy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IHRhc2tUb2tlbigpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSnNvblBhdGhUb2tlbignJCQuVGFzay5Ub2tlbicpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBlbnRpcmUgY29udGV4dCBkYXRhIHN0cnVjdHVyZVxuICAgKlxuICAgKiBXaWxsIGJlIGFuIG9iamVjdCBhdCBpbnZvY2F0aW9uIHRpbWUsIGJ1dCBpcyByZXByZXNlbnRlZCBpbiB0aGUgQ0RLXG4gICAqIGFwcGxpY2F0aW9uIGFzIGEgc3RyaW5nLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXQgZW50aXJlQ29udGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSnNvblBhdGhUb2tlbignJCQnKS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gaW50cmluc2ljIFN0YXRlcy5BcnJheSBleHByZXNzaW9uXG4gICAqXG4gICAqIENvbWJpbmUgYW55IG51bWJlciBvZiBzdHJpbmcgbGl0ZXJhbHMgb3IgSnNvblBhdGggZXhwcmVzc2lvbnMgaW50byBhbiBhcnJheS5cbiAgICpcbiAgICogVXNlIHRoaXMgZnVuY3Rpb24gaWYgdGhlIHZhbHVlIG9mIGFuIGFycmF5IGVsZW1lbnQgZGlyZWN0bHkgaGFzIHRvIGNvbWVcbiAgICogZnJvbSBhIEpTT04gUGF0aCBleHByZXNzaW9uIChlaXRoZXIgdGhlIFN0YXRlIG9iamVjdCBvciB0aGUgQ29udGV4dCBvYmplY3QpLlxuICAgKlxuICAgKiBJZiB0aGUgYXJyYXkgY29udGFpbnMgb2JqZWN0IGxpdGVyYWxzIHdob3NlIHZhbHVlcyBjb21lIGZyb20gYSBKU09OIHBhdGhcbiAgICogZXhwcmVzc2lvbiwgeW91IGRvIG5vdCBuZWVkIHRvIHVzZSB0aGlzIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvYW1hem9uLXN0YXRlcy1sYW5ndWFnZS1pbnRyaW5zaWMtZnVuY3Rpb25zLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXJyYXkoLi4udmFsdWVzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBKc29uUGF0aFRva2VuKGBTdGF0ZXMuQXJyYXkoJHt2YWx1ZXMubWFwKHJlbmRlckluRXhwcmVzc2lvbikuam9pbignLCAnKX0pYCkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGludHJpbnNpYyBTdGF0ZXMuQXJyYXlQYXJ0aXRpb24gZXhwcmVzc2lvblxuICAgKlxuICAgKiBVc2UgdGhpcyBmdW5jdGlvbiB0byBwYXJ0aXRpb24gYSBsYXJnZSBhcnJheS4gWW91IGNhbiBhbHNvIHVzZSB0aGlzIGludHJpbnNpYyB0byBzbGljZSB0aGUgZGF0YSBhbmQgdGhlbiBzZW5kIHRoZSBwYXlsb2FkIGluIHNtYWxsZXIgY2h1bmtzLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvYW1hem9uLXN0YXRlcy1sYW5ndWFnZS1pbnRyaW5zaWMtZnVuY3Rpb25zLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXJyYXlQYXJ0aXRpb24oYXJyYXk6IGFueSwgY2h1bmtTaXplOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSnNvblBhdGhUb2tlbihgU3RhdGVzLkFycmF5UGFydGl0aW9uKCR7W2FycmF5LCBjaHVua1NpemVdLm1hcChyZW5kZXJJbkV4cHJlc3Npb24pLmpvaW4oJywgJyl9KWApLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhbiBpbnRyaW5zaWMgU3RhdGVzLkFycmF5Q29udGFpbnMgZXhwcmVzc2lvblxuICAgKlxuICAgKiBVc2UgdGhpcyBmdW5jdGlvbiB0byBkZXRlcm1pbmUgaWYgYSBzcGVjaWZpYyB2YWx1ZSBpcyBwcmVzZW50IGluIGFuIGFycmF5LiBGb3IgZXhhbXBsZSwgeW91IGNhbiB1c2UgdGhpcyBmdW5jdGlvbiB0byBkZXRlY3QgaWYgdGhlcmUgd2FzIGFuIGVycm9yIGluIGEgTWFwIHN0YXRlIGl0ZXJhdGlvbi5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2FtYXpvbi1zdGF0ZXMtbGFuZ3VhZ2UtaW50cmluc2ljLWZ1bmN0aW9ucy5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFycmF5Q29udGFpbnMoYXJyYXk6IGFueSwgdmFsdWU6IGFueSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBKc29uUGF0aFRva2VuKGBTdGF0ZXMuQXJyYXlDb250YWlucygke1thcnJheSwgdmFsdWVdLm1hcChyZW5kZXJJbkV4cHJlc3Npb24pLmpvaW4oJywgJyl9KWApLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhbiBpbnRyaW5zaWMgU3RhdGVzLkFycmF5UmFuZ2UgZXhwcmVzc2lvblxuICAgKlxuICAgKiBVc2UgdGhpcyBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYXJyYXkgY29udGFpbmluZyBhIHNwZWNpZmljIHJhbmdlIG9mIGVsZW1lbnRzLiBUaGUgbmV3IGFycmF5IGNhbiBjb250YWluIHVwIHRvIDEwMDAgZWxlbWVudHMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9hbWF6b24tc3RhdGVzLWxhbmd1YWdlLWludHJpbnNpYy1mdW5jdGlvbnMuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhcnJheVJhbmdlKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBzdGVwOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSnNvblBhdGhUb2tlbihgU3RhdGVzLkFycmF5UmFuZ2UoJHtbc3RhcnQsIGVuZCwgc3RlcF0ubWFwKHJlbmRlckluRXhwcmVzc2lvbikuam9pbignLCAnKX0pYCkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGludHJpbnNpYyBTdGF0ZXMuQXJyYXlHZXRJdGVtIGV4cHJlc3Npb25cbiAgICpcbiAgICogVXNlIHRoaXMgZnVuY3Rpb24gdG8gZ2V0IGEgc3BlY2lmaWVkIGluZGV4J3MgdmFsdWUgaW4gYW4gYXJyYXkuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9hbWF6b24tc3RhdGVzLWxhbmd1YWdlLWludHJpbnNpYy1mdW5jdGlvbnMuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhcnJheUdldEl0ZW0oYXJyYXk6IGFueSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBKc29uUGF0aFRva2VuKGBTdGF0ZXMuQXJyYXlHZXRJdGVtKCR7W2FycmF5LCBpbmRleF0ubWFwKHJlbmRlckluRXhwcmVzc2lvbikuam9pbignLCAnKX0pYCkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGludHJpbnNpYyBTdGF0ZXMuQXJyYXlMZW5ndGggZXhwcmVzc2lvblxuICAgKlxuICAgKiBVc2UgdGhpcyBmdW5jdGlvbiB0byBnZXQgdGhlIGxlbmd0aCBvZiBhbiBhcnJheS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2FtYXpvbi1zdGF0ZXMtbGFuZ3VhZ2UtaW50cmluc2ljLWZ1bmN0aW9ucy5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFycmF5TGVuZ3RoKGFycmF5OiBhbnkpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSnNvblBhdGhUb2tlbihgU3RhdGVzLkFycmF5TGVuZ3RoKCR7cmVuZGVySW5FeHByZXNzaW9uKGFycmF5KX0pYCkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGludHJpbnNpYyBTdGF0ZXMuQXJyYXlVbmlxdWUgZXhwcmVzc2lvblxuICAgKlxuICAgKiBVc2UgdGhpcyBmdW5jdGlvbiB0byBnZXQgdGhlIGxlbmd0aCBvZiBhbiBhcnJheS5cbiAgICogVXNlIHRoaXMgZnVuY3Rpb24gdG8gcmVtb3ZlIGR1cGxpY2F0ZSB2YWx1ZXMgZnJvbSBhbiBhcnJheSBhbmQgcmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIG9ubHkgdW5pcXVlIGVsZW1lbnRzLiBUaGlzIGZ1bmN0aW9uIHRha2VzIGFuIGFycmF5LCB3aGljaCBjYW4gYmUgdW5zb3J0ZWQsIGFzIGl0cyBzb2xlIGFyZ3VtZW50LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvYW1hem9uLXN0YXRlcy1sYW5ndWFnZS1pbnRyaW5zaWMtZnVuY3Rpb25zLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXJyYXlVbmlxdWUoYXJyYXk6IGFueSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBKc29uUGF0aFRva2VuKGBTdGF0ZXMuQXJyYXlVbmlxdWUoJHtyZW5kZXJJbkV4cHJlc3Npb24oYXJyYXkpfSlgKS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gaW50cmluc2ljIFN0YXRlcy5CYXNlNjRFbmNvZGUgZXhwcmVzc2lvblxuICAgKlxuICAgKiBVc2UgdGhpcyBmdW5jdGlvbiB0byBlbmNvZGUgZGF0YSBiYXNlZCBvbiBNSU1FIEJhc2U2NCBlbmNvZGluZyBzY2hlbWUuIFlvdSBjYW4gdXNlIHRoaXMgZnVuY3Rpb24gdG8gcGFzcyBkYXRhIHRvIG90aGVyIEFXUyBzZXJ2aWNlcyB3aXRob3V0IHVzaW5nIGFuIEFXUyBMYW1iZGEgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9hbWF6b24tc3RhdGVzLWxhbmd1YWdlLWludHJpbnNpYy1mdW5jdGlvbnMuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBiYXNlNjRFbmNvZGUoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBKc29uUGF0aFRva2VuKGBTdGF0ZXMuQmFzZTY0RW5jb2RlKCR7cmVuZGVySW5FeHByZXNzaW9uKGlucHV0KX0pYCkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGludHJpbnNpYyBTdGF0ZXMuQmFzZTY0RGVjb2RlIGV4cHJlc3Npb25cbiAgICpcbiAgICogVXNlIHRoaXMgZnVuY3Rpb24gdG8gZGVjb2RlIGRhdGEgYmFzZWQgb24gTUlNRSBCYXNlNjQgZGVjb2Rpbmcgc2NoZW1lLiBZb3UgY2FuIHVzZSB0aGlzIGZ1bmN0aW9uIHRvIHBhc3MgZGF0YSB0byBvdGhlciBBV1Mgc2VydmljZXMgd2l0aG91dCB1c2luZyBhIExhbWJkYSBmdW5jdGlvbi5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2FtYXpvbi1zdGF0ZXMtbGFuZ3VhZ2UtaW50cmluc2ljLWZ1bmN0aW9ucy5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGJhc2U2NERlY29kZShiYXNlNjQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBKc29uUGF0aFRva2VuKGBTdGF0ZXMuQmFzZTY0RGVjb2RlKCR7cmVuZGVySW5FeHByZXNzaW9uKGJhc2U2NCl9KWApLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhbiBpbnRyaW5zaWMgU3RhdGVzLkhhc2ggZXhwcmVzc2lvblxuICAgKlxuICAgKiBVc2UgdGhpcyBmdW5jdGlvbiB0byBjYWxjdWxhdGUgdGhlIGhhc2ggdmFsdWUgb2YgYSBnaXZlbiBpbnB1dC4gWW91IGNhbiB1c2UgdGhpcyBmdW5jdGlvbiB0byBwYXNzIGRhdGEgdG8gb3RoZXIgQVdTIHNlcnZpY2VzIHdpdGhvdXQgdXNpbmcgYSBMYW1iZGEgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9hbWF6b24tc3RhdGVzLWxhbmd1YWdlLWludHJpbnNpYy1mdW5jdGlvbnMuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBoYXNoKGRhdGE6IGFueSwgYWxnb3JpdGhtOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSnNvblBhdGhUb2tlbihgU3RhdGVzLkhhc2goJHtbZGF0YSwgYWxnb3JpdGhtXS5tYXAocmVuZGVySW5FeHByZXNzaW9uKS5qb2luKCcsICcpfSlgKS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gaW50cmluc2ljIFN0YXRlcy5Kc29uTWVyZ2UgZXhwcmVzc2lvblxuICAgKlxuICAgKiBVc2UgdGhpcyBmdW5jdGlvbiB0byBtZXJnZSB0d28gSlNPTiBvYmplY3RzIGludG8gYSBzaW5nbGUgb2JqZWN0LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvYW1hem9uLXN0YXRlcy1sYW5ndWFnZS1pbnRyaW5zaWMtZnVuY3Rpb25zLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMganNvbk1lcmdlKHZhbHVlMTogYW55LCB2YWx1ZTI6IGFueSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBKc29uUGF0aFRva2VuKGBTdGF0ZXMuSnNvbk1lcmdlKCR7W3ZhbHVlMSwgdmFsdWUyXS5tYXAocmVuZGVySW5FeHByZXNzaW9uKS5qb2luKCcsICcpfSwgZmFsc2UpYCkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGludHJpbnNpYyBTdGF0ZXMuTWF0aFJhbmRvbSBleHByZXNzaW9uXG4gICAqXG4gICAqIFVzZSB0aGlzIGZ1bmN0aW9uIHRvIHJldHVybiBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiB0aGUgc3BlY2lmaWVkIHN0YXJ0IGFuZCBlbmQgbnVtYmVyLiBGb3IgZXhhbXBsZSwgeW91IGNhbiB1c2UgdGhpcyBmdW5jdGlvbiB0byBkaXN0cmlidXRlIGEgc3BlY2lmaWMgdGFzayBiZXR3ZWVuIHR3byBvciBtb3JlIHJlc291cmNlcy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2FtYXpvbi1zdGF0ZXMtbGFuZ3VhZ2UtaW50cmluc2ljLWZ1bmN0aW9ucy5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG1hdGhSYW5kb20oc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSnNvblBhdGhUb2tlbihgU3RhdGVzLk1hdGhSYW5kb20oJHtbc3RhcnQsIGVuZF0ubWFwKHJlbmRlckluRXhwcmVzc2lvbikuam9pbignLCAnKX0pYCkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGludHJpbnNpYyBTdGF0ZXMuTWF0aEFkZCBleHByZXNzaW9uXG4gICAqXG4gICAqIFVzZSB0aGlzIGZ1bmN0aW9uIHRvIHJldHVybiB0aGUgc3VtIG9mIHR3byBudW1iZXJzLiBGb3IgZXhhbXBsZSwgeW91IGNhbiB1c2UgdGhpcyBmdW5jdGlvbiB0byBpbmNyZW1lbnQgdmFsdWVzIGluc2lkZSBhIGxvb3Agd2l0aG91dCBpbnZva2luZyBhIExhbWJkYSBmdW5jdGlvbi5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2FtYXpvbi1zdGF0ZXMtbGFuZ3VhZ2UtaW50cmluc2ljLWZ1bmN0aW9ucy5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG1hdGhBZGQobnVtMTogbnVtYmVyLCBudW0yOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSnNvblBhdGhUb2tlbihgU3RhdGVzLk1hdGhBZGQoJHtbbnVtMSwgbnVtMl0ubWFwKHJlbmRlckluRXhwcmVzc2lvbikuam9pbignLCAnKX0pYCkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGludHJpbnNpYyBTdGF0ZXMuU3RyaW5nU3BsaXQgZXhwcmVzc2lvblxuICAgKlxuICAgKiBVc2UgdGhpcyBmdW5jdGlvbiB0byBzcGxpdCBhIHN0cmluZyBpbnRvIGFuIGFycmF5IG9mIHZhbHVlcy4gVGhpcyBmdW5jdGlvbiB0YWtlcyB0d28gYXJndW1lbnRzLlRoZSBmaXJzdCBhcmd1bWVudCBpcyBhIHN0cmluZyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCBpcyB0aGUgZGVsaW1pdGluZyBjaGFyYWN0ZXIgdGhhdCB0aGUgZnVuY3Rpb24gd2lsbCB1c2UgdG8gZGl2aWRlIHRoZSBzdHJpbmcuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9hbWF6b24tc3RhdGVzLWxhbmd1YWdlLWludHJpbnNpYy1mdW5jdGlvbnMuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdHJpbmdTcGxpdChpbnB1dFN0cmluZzogc3RyaW5nLCBzcGxpdHRlcjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbmV3IEpzb25QYXRoVG9rZW4oYFN0YXRlcy5TdHJpbmdTcGxpdCgke1tpbnB1dFN0cmluZywgc3BsaXR0ZXJdLm1hcChyZW5kZXJJbkV4cHJlc3Npb24pLmpvaW4oJywgJyl9KWApLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhbiBpbnRyaW5zaWMgU3RhdGVzLlVVSUQgZXhwcmVzc2lvblxuICAgKlxuICAgKiBVc2UgdGhpcyBmdW5jdGlvbiB0byByZXR1cm4gYSB2ZXJzaW9uIDQgdW5pdmVyc2FsbHkgdW5pcXVlIGlkZW50aWZpZXIgKHY0IFVVSUQpIGdlbmVyYXRlZCB1c2luZyByYW5kb20gbnVtYmVycy4gRm9yIGV4YW1wbGUsIHlvdSBjYW4gdXNlIHRoaXMgZnVuY3Rpb24gdG8gY2FsbCBvdGhlciBBV1Mgc2VydmljZXMgb3IgcmVzb3VyY2VzIHRoYXQgbmVlZCBhIFVVSUQgcGFyYW1ldGVyIG9yIGluc2VydCBpdGVtcyBpbiBhIER5bmFtb0RCIHRhYmxlLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvYW1hem9uLXN0YXRlcy1sYW5ndWFnZS1pbnRyaW5zaWMtZnVuY3Rpb25zLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdXVpZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgSnNvblBhdGhUb2tlbignU3RhdGVzLlVVSUQoKScpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhbiBpbnRyaW5zaWMgU3RhdGVzLkZvcm1hdCBleHByZXNzaW9uXG4gICAqXG4gICAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gZW1iZWQgSlNPTiBQYXRoIHZhcmlhYmxlcyBpbnNpZGUgYSBmb3JtYXQgc3RyaW5nLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgdHNcbiAgICogc2ZuLkpzb25QYXRoLmZvcm1hdCgnSGVsbG8sIG15IG5hbWUgaXMge30uJywgc2ZuLkpzb25QYXRoLnN0cmluZ0F0KCckLm5hbWUnKSlcbiAgICogYGBgXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3N0ZXAtZnVuY3Rpb25zL2xhdGVzdC9kZy9hbWF6b24tc3RhdGVzLWxhbmd1YWdlLWludHJpbnNpYy1mdW5jdGlvbnMuaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmb3JtYXQoZm9ybWF0U3RyaW5nOiBzdHJpbmcsIC4uLnZhbHVlczogc3RyaW5nW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IGFsbEFyZ3MgPSBbZm9ybWF0U3RyaW5nLCAuLi52YWx1ZXNdO1xuICAgIHJldHVybiBuZXcgSnNvblBhdGhUb2tlbihgU3RhdGVzLkZvcm1hdCgke2FsbEFyZ3MubWFwKHJlbmRlckluRXhwcmVzc2lvbikuam9pbignLCAnKX0pYCkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIGludHJpbnNpYyBTdGF0ZXMuU3RyaW5nVG9Kc29uIGV4cHJlc3Npb25cbiAgICpcbiAgICogRHVyaW5nIHRoZSBleGVjdXRpb24gb2YgdGhlIFN0ZXAgRnVuY3Rpb25zIHN0YXRlIG1hY2hpbmUsIHBhcnNlIHRoZSBnaXZlblxuICAgKiBhcmd1bWVudCBhcyBKU09OIGludG8gaXRzIG9iamVjdCBmb3JtLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgdHNcbiAgICogc2ZuLkpzb25QYXRoLnN0cmluZ1RvSnNvbihzZm4uSnNvblBhdGguc3RyaW5nQXQoJyQuc29tZUpzb25Cb2R5JykpXG4gICAqIGBgYFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvYW1hem9uLXN0YXRlcy1sYW5ndWFnZS1pbnRyaW5zaWMtZnVuY3Rpb25zLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3RyaW5nVG9Kc29uKGpzb25TdHJpbmc6IHN0cmluZyk6IElSZXNvbHZhYmxlIHtcbiAgICByZXR1cm4gbmV3IEpzb25QYXRoVG9rZW4oYFN0YXRlcy5TdHJpbmdUb0pzb24oJHtyZW5kZXJJbkV4cHJlc3Npb24oanNvblN0cmluZyl9KWApO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYW4gaW50cmluc2ljIFN0YXRlcy5Kc29uVG9TdHJpbmcgZXhwcmVzc2lvblxuICAgKlxuICAgKiBEdXJpbmcgdGhlIGV4ZWN1dGlvbiBvZiB0aGUgU3RlcCBGdW5jdGlvbnMgc3RhdGUgbWFjaGluZSwgZW5jb2RlIHRoZVxuICAgKiBnaXZlbiBvYmplY3QgaW50byBhIEpTT04gc3RyaW5nLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgdHNcbiAgICogc2ZuLkpzb25QYXRoLmpzb25Ub1N0cmluZyhzZm4uSnNvblBhdGgub2JqZWN0QXQoJyQuc29tZU9iamVjdCcpKVxuICAgKiBgYGBcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2FtYXpvbi1zdGF0ZXMtbGFuZ3VhZ2UtaW50cmluc2ljLWZ1bmN0aW9ucy5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGpzb25Ub1N0cmluZyh2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgICBjb25zdCBwYXRoID0ganNvblBhdGhGcm9tQW55KHZhbHVlKTtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgdG8gSnNvblBhdGguanNvblRvU3RyaW5nKCkgbXVzdCBiZSBhIEpzb25QYXRoIG9iamVjdCcpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSnNvblBhdGhUb2tlbihgU3RhdGVzLkpzb25Ub1N0cmluZygke3BhdGh9KWApLnRvU3RyaW5nKCk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cbn1cblxuLyoqXG4gKiBFeHRyYWN0IGEgZmllbGQgZnJvbSB0aGUgU3RhdGUgTWFjaGluZSBkYXRhIHRoYXQgZ2V0cyBwYXNzZWQgYXJvdW5kIGJldHdlZW4gc3RhdGVzXG4gKlxuICogQGRlcHJlY2F0ZWQgcmVwbGFjZWQgYnkgYEpzb25QYXRoYFxuICovXG5leHBvcnQgY2xhc3MgRGF0YSB7XG4gIC8qKlxuICAgKiBJbnN0ZWFkIG9mIHVzaW5nIGEgbGl0ZXJhbCBzdHJpbmcsIGdldCB0aGUgdmFsdWUgZnJvbSBhIEpTT04gcGF0aFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdHJpbmdBdChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHZhbGlkYXRlRGF0YVBhdGgocGF0aCk7XG4gICAgcmV0dXJuIG5ldyBKc29uUGF0aFRva2VuKHBhdGgpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogSW5zdGVhZCBvZiB1c2luZyBhIGxpdGVyYWwgc3RyaW5nIGxpc3QsIGdldCB0aGUgdmFsdWUgZnJvbSBhIEpTT04gcGF0aFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBsaXN0QXQocGF0aDogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHZhbGlkYXRlRGF0YVBhdGgocGF0aCk7XG4gICAgcmV0dXJuIFRva2VuLmFzTGlzdChuZXcgSnNvblBhdGhUb2tlbihwYXRoKSk7XG4gIH1cblxuICAvKipcbiAgICogSW5zdGVhZCBvZiB1c2luZyBhIGxpdGVyYWwgbnVtYmVyLCBnZXQgdGhlIHZhbHVlIGZyb20gYSBKU09OIHBhdGhcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbnVtYmVyQXQocGF0aDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICB2YWxpZGF0ZURhdGFQYXRoKHBhdGgpO1xuICAgIHJldHVybiBUb2tlbi5hc051bWJlcihuZXcgSnNvblBhdGhUb2tlbihwYXRoKSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBlbnRpcmUgZGF0YSBzdHJ1Y3R1cmVcbiAgICpcbiAgICogV2lsbCBiZSBhbiBvYmplY3QgYXQgaW52b2NhdGlvbiB0aW1lLCBidXQgaXMgcmVwcmVzZW50ZWQgaW4gdGhlIENES1xuICAgKiBhcHBsaWNhdGlvbiBhcyBhIHN0cmluZy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IGVudGlyZVBheWxvYWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbmV3IEpzb25QYXRoVG9rZW4oJyQnKS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgdGhlIGluZGljYXRlZCBzdHJpbmcgaXMgYW4gZW5jb2RlZCBKU09OIHBhdGhcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIHN0cmluZyB0byBiZSBldmFsdWF0ZWRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNKc29uUGF0aFN0cmluZyh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhanNvblBhdGhTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHt9XG59XG5cbi8qKlxuICogRXh0cmFjdCBhIGZpZWxkIGZyb20gdGhlIFN0YXRlIE1hY2hpbmUgQ29udGV4dCBkYXRhXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vc3RlcC1mdW5jdGlvbnMvbGF0ZXN0L2RnL2Nvbm5lY3QtdG8tcmVzb3VyY2UuaHRtbCN3YWl0LXRva2VuLWNvbnRleHRvYmplY3RcbiAqXG4gKiBAZGVwcmVjYXRlZCByZXBsYWNlZCBieSBgSnNvblBhdGhgXG4gKi9cbmV4cG9ydCBjbGFzcyBDb250ZXh0IHtcbiAgLyoqXG4gICAqIEluc3RlYWQgb2YgdXNpbmcgYSBsaXRlcmFsIHN0cmluZywgZ2V0IHRoZSB2YWx1ZSBmcm9tIGEgSlNPTiBwYXRoXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHN0cmluZ0F0KHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgdmFsaWRhdGVDb250ZXh0UGF0aChwYXRoKTtcbiAgICByZXR1cm4gbmV3IEpzb25QYXRoVG9rZW4ocGF0aCkudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0ZWFkIG9mIHVzaW5nIGEgbGl0ZXJhbCBudW1iZXIsIGdldCB0aGUgdmFsdWUgZnJvbSBhIEpTT04gcGF0aFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBudW1iZXJBdChwYXRoOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHZhbGlkYXRlQ29udGV4dFBhdGgocGF0aCk7XG4gICAgcmV0dXJuIFRva2VuLmFzTnVtYmVyKG5ldyBKc29uUGF0aFRva2VuKHBhdGgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIFRhc2sgVG9rZW4gZmllbGRcbiAgICpcbiAgICogRXh0ZXJuYWwgYWN0aW9ucyB3aWxsIG5lZWQgdGhpcyB0b2tlbiB0byByZXBvcnQgc3RlcCBjb21wbGV0aW9uXG4gICAqIGJhY2sgdG8gU3RlcEZ1bmN0aW9ucyB1c2luZyB0aGUgYFNlbmRUYXNrU3VjY2Vzc2Agb3IgYFNlbmRUYXNrRmFpbHVyZWBcbiAgICogY2FsbHMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldCB0YXNrVG9rZW4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbmV3IEpzb25QYXRoVG9rZW4oJyQkLlRhc2suVG9rZW4nKS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgZW50aXJlIGNvbnRleHQgZGF0YSBzdHJ1Y3R1cmVcbiAgICpcbiAgICogV2lsbCBiZSBhbiBvYmplY3QgYXQgaW52b2NhdGlvbiB0aW1lLCBidXQgaXMgcmVwcmVzZW50ZWQgaW4gdGhlIENES1xuICAgKiBhcHBsaWNhdGlvbiBhcyBhIHN0cmluZy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IGVudGlyZUNvbnRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbmV3IEpzb25QYXRoVG9rZW4oJyQkJykudG9TdHJpbmcoKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbnMgdG8gd29yayB3aXRoIHN0cnVjdHVyZXMgY29udGFpbmluZyBmaWVsZHNcbiAqL1xuZXhwb3J0IGNsYXNzIEZpZWxkVXRpbHMge1xuICAvKipcbiAgICogUmVuZGVyIGEgSlNPTiBzdHJ1Y3R1cmUgY29udGFpbmluZyBmaWVsZHMgdG8gdGhlIHJpZ2h0IFN0ZXBGdW5jdGlvbnMgc3RydWN0dXJlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlbmRlck9iamVjdChvYmo/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHJlbmRlck9iamVjdChvYmopO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbGwgSlNPTiBwYXRocyB1c2VkIGluIHRoZSBnaXZlbiBzdHJ1Y3R1cmVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZmluZFJlZmVyZW5jZWRQYXRocyhvYmo/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KTogc3RyaW5nW10ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGZpbmRSZWZlcmVuY2VkUGF0aHMob2JqKSkuc29ydCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gdGFzayBzdHJ1Y3R1cmUgY29udGFpbnMgdGhlIFRhc2tUb2tlbiBmaWVsZCBhbnl3aGVyZVxuICAgKlxuICAgKiBUaGUgZmllbGQgaXMgY29uc2lkZXJlZCBpbmNsdWRlZCBpZiB0aGUgZmllbGQgaXRzZWxmIG9yIG9uZSBvZiBpdHMgY29udGFpbmluZ1xuICAgKiBmaWVsZHMgb2NjdXJzIGFueXdoZXJlIGluIHRoZSBwYXlsb2FkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb250YWluc1Rhc2tUb2tlbihvYmo/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGF0aHMgPSBmaW5kUmVmZXJlbmNlZFBhdGhzKG9iaik7XG4gICAgcmV0dXJuIHBhdGhzLmhhcygnJCQuVGFzay5Ub2tlbicpIHx8IHBhdGhzLmhhcygnJCQuVGFzaycpIHx8IHBhdGhzLmhhcygnJCQnKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7fVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUpzb25QYXRoKHBhdGg6IHN0cmluZykge1xuICBjb25zdCBpbnRyaW5zaWNGdW5jdGlvbk5hbWVzID0gW1xuICAgIC8vIEludHJpbnNpY3MgZm9yIGFycmF5c1xuICAgICdBcnJheScsXG4gICAgJ0FycmF5UGFydGl0aW9uJyxcbiAgICAnQXJyYXlDb250YWlucycsXG4gICAgJ0FycmF5UmFuZ2UnLFxuICAgICdBcnJheUdldEl0ZW0nLFxuICAgICdBcnJheUxlbmd0aCcsXG4gICAgJ0FycmF5VW5pcXVlJyxcbiAgICAvLyBJbnRyaW5zaWNzIGZvciBkYXRhIGVuY29kaW5nIGFuZCBkZWNvZGluZ1xuICAgICdCYXNlNjRFbmNvZGUnLFxuICAgICdCYXNlNjREZWNvZGUnLFxuICAgIC8vIEludHJpbnNpYyBmb3IgaGFzaCBjYWxjdWxhdGlvblxuICAgICdIYXNoJyxcbiAgICAvLyBJbnRyaW5zaWNzIGZvciBKU09OIGRhdGEgbWFuaXB1bGF0aW9uXG4gICAgJ0pzb25NZXJnZScsXG4gICAgJ1N0cmluZ1RvSnNvbicsXG4gICAgJ0pzb25Ub1N0cmluZycsXG4gICAgLy8gSW50cmluc2ljcyBmb3IgTWF0aCBvcGVyYXRpb25zXG4gICAgJ01hdGhSYW5kb20nLFxuICAgICdNYXRoQWRkJyxcbiAgICAvLyBJbnRyaW5zaWMgZm9yIFN0cmluZyBvcGVyYXRpb25cbiAgICAnU3RyaW5nU3BsaXQnLFxuICAgIC8vIEludHJpbnNpYyBmb3IgdW5pcXVlIGlkZW50aWZpZXIgZ2VuZXJhdGlvblxuICAgICdVVUlEJyxcbiAgICAvLyBJbnRyaW5zaWMgZm9yIGdlbmVyaWMgb3BlcmF0aW9uXG4gICAgJ0Zvcm1hdCcsXG4gIF07XG4gIGNvbnN0IGludHJpbnNpY0Z1bmN0aW9uRnVsbE5hbWVzID0gaW50cmluc2ljRnVuY3Rpb25OYW1lcy5tYXAoKGZuKSA9PiBgU3RhdGVzLiR7Zm59YCk7XG4gIGlmIChwYXRoICE9PSAnJCdcbiAgICAmJiAhcGF0aC5zdGFydHNXaXRoKCckLicpXG4gICAgJiYgcGF0aCAhPT0gJyQkJ1xuICAgICYmICFwYXRoLnN0YXJ0c1dpdGgoJyQkLicpXG4gICAgJiYgIXBhdGguc3RhcnRzV2l0aCgnJFsnKVxuICAgICYmIGludHJpbnNpY0Z1bmN0aW9uRnVsbE5hbWVzLmV2ZXJ5KGZuID0+ICFwYXRoLnN0YXJ0c1dpdGgoZm4pKVxuICApIHtcbiAgICBjb25zdCBsYXN0SXRlbSA9IGludHJpbnNpY0Z1bmN0aW9uRnVsbE5hbWVzLnBvcCgpO1xuICAgIGNvbnN0IGludHJpbnNpY0Z1bmN0aW9uc1N0ciA9IGludHJpbnNpY0Z1bmN0aW9uRnVsbE5hbWVzLmpvaW4oJywgJykgKyAnLCBvciAnICsgbGFzdEl0ZW07XG4gICAgdGhyb3cgbmV3IEVycm9yKGBKU09OIHBhdGggdmFsdWVzIG11c3QgYmUgZXhhY3RseSAnJCcsICckJCcsIHN0YXJ0IHdpdGggJyQuJywgc3RhcnQgd2l0aCAnJCQuJywgc3RhcnQgd2l0aCAnJFsnLCBvciBzdGFydCB3aXRoIGFuIGludHJpbnNpYyBmdW5jdGlvbjogJHtpbnRyaW5zaWNGdW5jdGlvbnNTdHJ9LiBSZWNlaXZlZDogJHtwYXRofWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlRGF0YVBhdGgocGF0aDogc3RyaW5nKSB7XG4gIGlmIChwYXRoICE9PSAnJCdcbiAgICAmJiAhcGF0aC5zdGFydHNXaXRoKCckWycpXG4gICAgJiYgIXBhdGguc3RhcnRzV2l0aCgnJC4nKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGEgSlNPTiBwYXRoIHZhbHVlcyBtdXN0IGVpdGhlciBiZSBleGFjdGx5IGVxdWFsIHRvICckJywgc3RhcnQgd2l0aCAnJFsnIG9yIHN0YXJ0IHdpdGggJyQuJ1wiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUNvbnRleHRQYXRoKHBhdGg6IHN0cmluZykge1xuICBpZiAocGF0aCAhPT0gJyQkJyAmJiAhcGF0aC5zdGFydHNXaXRoKCckJC4nKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvbnRleHQgSlNPTiBwYXRoIHZhbHVlcyBtdXN0IGVpdGhlciBiZSBleGFjdGx5IGVxdWFsIHRvICckJCcgb3Igc3RhcnQgd2l0aCAnJCQuJ1wiKTtcbiAgfVxufVxuIl19