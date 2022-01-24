import { Token, IResolvable } from '@aws-cdk/core';
import { findReferencedPaths, jsonPathString, JsonPathToken, renderObject, renderInExpression, jsonPathFromAny } from './private/json-path';

/**
 * Extract a field from the State Machine data or context
 * that gets passed around between states
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-paths.html
 */
export class JsonPath {
  /**
   * Special string value to discard state input, output or result
   */
  public static readonly DISCARD = 'DISCARD';

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
  if (path !== '$'
    && !path.startsWith('$.')
    && path !== '$$'
    && !path.startsWith('$$.')
    && !path.startsWith('$[')
    && ['Format', 'StringToJson', 'JsonToString', 'Array'].every(fn => !path.startsWith(`States.${fn}`))
  ) {
    throw new Error(`JSON path values must be exactly '$', '$$', start with '$.', start with '$$.', start with '$[', or start with an intrinsic function: States.Format, States.StringToJson, States.JsonToString, or States.Array. Received: ${path}`);
  }
}

function validateDataPath(path: string) {
  if (path !== '$' && !path.startsWith('$.')) {
    throw new Error("Data JSON path values must either be exactly equal to '$' or start with '$.'");
  }
}

function validateContextPath(path: string) {
  if (path !== '$$' && !path.startsWith('$$.')) {
    throw new Error("Context JSON path values must either be exactly equal to '$$' or start with '$$.'");
  }
}
