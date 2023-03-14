import { Token, IResolvable, JsonNull } from '@aws-cdk/core';
import { findReferencedPaths, jsonPathString, JsonPathToken, renderObject, renderInExpression, jsonPathFromAny } from './private/json-path';

/**
 * Extract a field from the State Machine data or context
 * that gets passed around between states
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-paths.html
 */
export class JsonPath {
  /**
   * Special string value to discard state input, output or result.
   */
  public static readonly DISCARD = Token.asString(JsonNull.INSTANCE, { displayHint: 'DISCARD (JSON `null`)' });

  /**
   * Instead of using a literal string, get the value from a JSON path
   */
  public static stringAt(path: string): string {
    validateJsonPath(path);
    return new JsonPathToken(path).toString();
  }

  /**
   * Instead of using a literal string list, get the value from a JSON path
   */
  public static listAt(path: string): string[] {
    // does not apply to task context
    validateDataPath(path);
    return Token.asList(new JsonPathToken(path));
  }

  /**
   * Instead of using a literal number, get the value from a JSON path
   */
  public static numberAt(path: string): number {
    validateJsonPath(path);
    return Token.asNumber(new JsonPathToken(path));
  }

  /**
   * Reference a complete (complex) object in a JSON path location
   */
  public static objectAt(path: string): IResolvable {
    validateJsonPath(path);
    return new JsonPathToken(path);
  }

  /**
   * Use the entire data structure
   *
   * Will be an object at invocation time, but is represented in the CDK
   * application as a string.
   */
  public static get entirePayload(): string {
    return new JsonPathToken('$').toString();
  }

  /**
   * Determines if the indicated string is an encoded JSON path
   *
   * @param value string to be evaluated
   */
  public static isEncodedJsonPath(value: string): boolean {
    return !!jsonPathString(value);
  }

  /**
   * Return the Task Token field
   *
   * External actions will need this token to report step completion
   * back to StepFunctions using the `SendTaskSuccess` or `SendTaskFailure`
   * calls.
   */
  public static get taskToken(): string {
    return new JsonPathToken('$$.Task.Token').toString();
  }

  /**
   * Use the entire context data structure
   *
   * Will be an object at invocation time, but is represented in the CDK
   * application as a string.
   */
  public static get entireContext(): string {
    return new JsonPathToken('$$').toString();
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
  public static array(...values: string[]): string {
    return new JsonPathToken(`States.Array(${values.map(renderInExpression).join(', ')})`).toString();
  }

  /**
   * Make an intrinsic States.ArrayPartition expression
   *
   * Use this function to partition a large array. You can also use this intrinsic to slice the data and then send the payload in smaller chunks.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static arrayPartition(array: any, chunkSize: number): string {
    return new JsonPathToken(`States.ArrayPartition(${[array, chunkSize].map(renderInExpression).join(', ')})`).toString();
  }

  /**
   * Make an intrinsic States.ArrayContains expression
   *
   * Use this function to determine if a specific value is present in an array. For example, you can use this function to detect if there was an error in a Map state iteration.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static arrayContains(array: any, value: any): string {
    return new JsonPathToken(`States.ArrayContains(${[array, value].map(renderInExpression).join(', ')})`).toString();
  }

  /**
   * Make an intrinsic States.ArrayRange expression
   *
   * Use this function to create a new array containing a specific range of elements. The new array can contain up to 1000 elements.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static arrayRange(start: number, end: number, step: number): string {
    return new JsonPathToken(`States.ArrayRange(${[start, end, step].map(renderInExpression).join(', ')})`).toString();
  }

  /**
   * Make an intrinsic States.ArrayGetItem expression
   *
   * Use this function to get a specified index's value in an array.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static arrayGetItem(array: any, index: number): string {
    return new JsonPathToken(`States.ArrayGetItem(${[array, index].map(renderInExpression).join(', ')})`).toString();
  }

  /**
   * Make an intrinsic States.ArrayLength expression
   *
   * Use this function to get the length of an array.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static arrayLength(array: any): string {
    return new JsonPathToken(`States.ArrayLength(${renderInExpression(array)})`).toString();
  }

  /**
   * Make an intrinsic States.ArrayUnique expression
   *
   * Use this function to get the length of an array.
   * Use this function to remove duplicate values from an array and returns an array containing only unique elements. This function takes an array, which can be unsorted, as its sole argument.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static arrayUnique(array: any): string {
    return new JsonPathToken(`States.ArrayUnique(${renderInExpression(array)})`).toString();
  }

  /**
   * Make an intrinsic States.Base64Encode expression
   *
   * Use this function to encode data based on MIME Base64 encoding scheme. You can use this function to pass data to other AWS services without using an AWS Lambda function.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static base64Encode(input: string): string {
    return new JsonPathToken(`States.Base64Encode(${renderInExpression(input)})`).toString();
  }

  /**
   * Make an intrinsic States.Base64Decode expression
   *
   * Use this function to decode data based on MIME Base64 decoding scheme. You can use this function to pass data to other AWS services without using a Lambda function.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static base64Decode(base64: string): string {
    return new JsonPathToken(`States.Base64Decode(${renderInExpression(base64)})`).toString();
  }

  /**
   * Make an intrinsic States.Hash expression
   *
   * Use this function to calculate the hash value of a given input. You can use this function to pass data to other AWS services without using a Lambda function.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static hash(data: any, algorithm: string): string {
    return new JsonPathToken(`States.Hash(${[data, algorithm].map(renderInExpression).join(', ')})`).toString();
  }

  /**
   * Make an intrinsic States.JsonMerge expression
   *
   * Use this function to merge two JSON objects into a single object.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static jsonMerge(value1: any, value2: any): string {
    return new JsonPathToken(`States.JsonMerge(${[value1, value2].map(renderInExpression).join(', ')}, false)`).toString();
  }

  /**
   * Make an intrinsic States.MathRandom expression
   *
   * Use this function to return a random number between the specified start and end number. For example, you can use this function to distribute a specific task between two or more resources.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static mathRandom(start: number, end: number): string {
    return new JsonPathToken(`States.MathRandom(${[start, end].map(renderInExpression).join(', ')})`).toString();
  }

  /**
   * Make an intrinsic States.MathAdd expression
   *
   * Use this function to return the sum of two numbers. For example, you can use this function to increment values inside a loop without invoking a Lambda function.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static mathAdd(num1: number, num2: number): string {
    return new JsonPathToken(`States.MathAdd(${[num1, num2].map(renderInExpression).join(', ')})`).toString();
  }

  /**
   * Make an intrinsic States.StringSplit expression
   *
   * Use this function to split a string into an array of values. This function takes two arguments.The first argument is a string and the second argument is the delimiting character that the function will use to divide the string.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static stringSplit(inputString: string, splitter: string): string {
    return new JsonPathToken(`States.StringSplit(${[inputString, splitter].map(renderInExpression).join(', ')})`).toString();
  }

  /**
   * Make an intrinsic States.UUID expression
   *
   * Use this function to return a version 4 universally unique identifier (v4 UUID) generated using random numbers. For example, you can use this function to call other AWS services or resources that need a UUID parameter or insert items in a DynamoDB table.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-intrinsic-functions.html
   */
  public static uuid(): string {
    return new JsonPathToken('States.UUID()').toString();
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
  public static format(formatString: string, ...values: string[]): string {
    const allArgs = [formatString, ...values];
    return new JsonPathToken(`States.Format(${allArgs.map(renderInExpression).join(', ')})`).toString();
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
  public static stringToJson(jsonString: string): IResolvable {
    return new JsonPathToken(`States.StringToJson(${renderInExpression(jsonString)})`);
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
  public static jsonToString(value: any): string {
    const path = jsonPathFromAny(value);
    if (!path) {
      throw new Error('Argument to JsonPath.jsonToString() must be a JsonPath object');
    }

    return new JsonPathToken(`States.JsonToString(${path})`).toString();
  }

  private constructor() {}
}

/**
 * Extract a field from the State Machine data that gets passed around between states
 *
 * @deprecated replaced by `JsonPath`
 */
export class Data {
  /**
   * Instead of using a literal string, get the value from a JSON path
   */
  public static stringAt(path: string): string {
    validateDataPath(path);
    return new JsonPathToken(path).toString();
  }

  /**
   * Instead of using a literal string list, get the value from a JSON path
   */
  public static listAt(path: string): string[] {
    validateDataPath(path);
    return Token.asList(new JsonPathToken(path));
  }

  /**
   * Instead of using a literal number, get the value from a JSON path
   */
  public static numberAt(path: string): number {
    validateDataPath(path);
    return Token.asNumber(new JsonPathToken(path));
  }

  /**
   * Use the entire data structure
   *
   * Will be an object at invocation time, but is represented in the CDK
   * application as a string.
   */
  public static get entirePayload(): string {
    return new JsonPathToken('$').toString();
  }

  /**
   * Determines if the indicated string is an encoded JSON path
   *
   * @param value string to be evaluated
   */
  public static isJsonPathString(value: string): boolean {
    return !!jsonPathString(value);
  }

  private constructor() {}
}

/**
 * Extract a field from the State Machine Context data
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#wait-token-contextobject
 *
 * @deprecated replaced by `JsonPath`
 */
export class Context {
  /**
   * Instead of using a literal string, get the value from a JSON path
   */
  public static stringAt(path: string): string {
    validateContextPath(path);
    return new JsonPathToken(path).toString();
  }

  /**
   * Instead of using a literal number, get the value from a JSON path
   */
  public static numberAt(path: string): number {
    validateContextPath(path);
    return Token.asNumber(new JsonPathToken(path));
  }

  /**
   * Return the Task Token field
   *
   * External actions will need this token to report step completion
   * back to StepFunctions using the `SendTaskSuccess` or `SendTaskFailure`
   * calls.
   */
  public static get taskToken(): string {
    return new JsonPathToken('$$.Task.Token').toString();
  }

  /**
   * Use the entire context data structure
   *
   * Will be an object at invocation time, but is represented in the CDK
   * application as a string.
   */
  public static get entireContext(): string {
    return new JsonPathToken('$$').toString();
  }

  private constructor() {}
}

/**
 * Helper functions to work with structures containing fields
 */
export class FieldUtils {
  /**
   * Render a JSON structure containing fields to the right StepFunctions structure
   */
  public static renderObject(obj?: { [key: string]: any }): { [key: string]: any } | undefined {
    return renderObject(obj);
  }

  /**
   * Return all JSON paths used in the given structure
   */
  public static findReferencedPaths(obj?: { [key: string]: any }): string[] {
    return Array.from(findReferencedPaths(obj)).sort();
  }

  /**
   * Returns whether the given task structure contains the TaskToken field anywhere
   *
   * The field is considered included if the field itself or one of its containing
   * fields occurs anywhere in the payload.
   */
  public static containsTaskToken(obj?: { [key: string]: any }): boolean {
    const paths = findReferencedPaths(obj);
    return paths.has('$$.Task.Token') || paths.has('$$.Task') || paths.has('$$');
  }

  private constructor() {}
}

function validateJsonPath(path: string) {
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
    && intrinsicFunctionFullNames.every(fn => !path.startsWith(fn))
  ) {
    const lastItem = intrinsicFunctionFullNames.pop();
    const intrinsicFunctionsStr = intrinsicFunctionFullNames.join(', ') + ', or ' + lastItem;
    throw new Error(`JSON path values must be exactly '$', '$$', start with '$.', start with '$$.', start with '$[', or start with an intrinsic function: ${intrinsicFunctionsStr}. Received: ${path}`);
  }
}

function validateDataPath(path: string) {
  if (path !== '$'
    && !path.startsWith('$[')
    && !path.startsWith('$.')) {
    throw new Error("Data JSON path values must either be exactly equal to '$', start with '$[' or start with '$.'");
  }
}

function validateContextPath(path: string) {
  if (path !== '$$' && !path.startsWith('$$.')) {
    throw new Error("Context JSON path values must either be exactly equal to '$$' or start with '$$.'");
  }
}
