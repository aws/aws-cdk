import { Token, TokenMap } from '@aws-cdk/cdk';
import { NumberValue } from './number-value';

/**
 * Class to create special parameters for state machine states
 */
export class JsonPath {
  /**
   * Instead of using a literal string, get the value from a JSON path
   */
  public static stringFromPath(path: string): string {
    if (!path.startsWith('$.')) {
      throw new Error("JSONPath values must start with '$.'");
    }
    return new JsonPathToken(path).toString();
  }

  /**
   * Instead of using a literal string list, get the value from a JSON path
   */
  public static listFromPath(path: string): string[] {
    if (!path.startsWith('$.')) {
      throw new Error("JSONPath values must start with '$.'");
    }
    return new JsonPathToken(path).toList();
  }

  /**
   * Get a number from a JSON path
   */
  public static numberFromPath(path: string): NumberValue {
    return NumberValue.fromJsonPath(path);
  }

  private constructor() {
  }
}

const JSON_PATH_TOKEN_SYMBOL = Symbol.for('@aws-cdk/aws-step-functions-tasks.JsonPathToken');

class JsonPathToken extends Token {
  public static isJsonPathToken(x: any): x is JsonPathToken {
    return JSON_PATH_TOKEN_SYMBOL in x;
  }

  constructor(public readonly path: string) {
    super(() => path); // Make function to prevent eager evaluation in superclass
    Object.defineProperty(this, JSON_PATH_TOKEN_SYMBOL, { value: true });
  }
}

/**
 * Render a parameter string
 *
 * If the string value starts with '$.', render it as a path string, otherwise as a direct string.
 */
export function renderString(key: string, value: string | undefined): {[key: string]: string} {
  if (value === undefined) { return {}; }

  const path = jsonPathString(value);
  if (path !== undefined) {
    return { [key + '.$']: path };
  } else {
    return { [key]: value };
  }
}

/**
 * Render a parameter string
 *
 * If the string value starts with '$.', render it as a path string, otherwise as a direct string.
 */
export function renderStringList(key: string, value: string[] | undefined): {[key: string]: string[] | string} {
  if (value === undefined) { return {}; }

  const path = jsonPathStringList(value);
  if (path !== undefined) {
    return { [key + '.$']: path };
  } else {
    return { [key]: value };
  }
}

/**
 * Render a parameter string
 *
 * If the string value starts with '$.', render it as a path string, otherwise as a direct string.
 */
export function renderNumber(key: string, value: NumberValue | undefined): {[key: string]: number | string} {
  if (value === undefined) { return {}; }

  if (!value.isLiteralNumber) {
    return { [key + '.$']: value.jsonPath };
  } else {
    return { [key]: value.numberValue };
  }
}

/**
 * If the indicated string is an encoded JSON path, return the path
 *
 * Otherwise return undefined.
 */
function jsonPathString(x: string): string | undefined {
  return pathFromToken(TokenMap.instance().lookupString(x));
}

/**
 * If the indicated string list is an encoded JSON path, return the path
 *
 * Otherwise return undefined.
 */
function jsonPathStringList(x: string[]): string | undefined {
  return pathFromToken(TokenMap.instance().lookupList(x));
}

function pathFromToken(token: Token | undefined) {
  return token && (JsonPathToken.isJsonPathToken(token) ? token.path : undefined);
}