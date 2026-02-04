import type { IResolvable, IResolveContext } from '../../../core';
import { captureStackTrace, Token, UnscopedValidationError } from '../../../core';

export const isValidJsonataExpression = (expression: string) => /^{%(.*)%}$/s.test(expression);

export const findJsonataExpressions = (value: any): Set<string> => {
  const recursive = (v: any): string[] => {
    if (typeof v === 'string' && isValidJsonataExpression(v)) {
      return [v];
    } else if (v === null) {
      return [];
    } else if (Array.isArray(v)) {
      return v.flatMap(recursive);
    } else if (typeof v === 'object') {
      return Object.values(v).flatMap(recursive);
    } else {
      return [];
    }
  };
  return new Set(recursive(value));
};

const JSONATA_TOKEN_SYMBOL = Symbol.for('@aws-cdk/aws-stepfunctions.JsonataToken');

/**
 * A Token that represents a JSONata expression.
 *
 * When resolved, the expression is wrapped in `{% ... %}` delimiters.
 */
export class JsonataToken implements IResolvable {
  /**
   * Check if a value is a JsonataToken
   */
  public static isJsonataToken(x: IResolvable): x is JsonataToken {
    return (x as any)[JSONATA_TOKEN_SYMBOL] === true;
  }

  public readonly creationStack: string[];
  public displayHint: string;

  constructor(public readonly expression: string) {
    this.creationStack = captureStackTrace();
    this.displayHint = expression.replace(/^[^a-zA-Z]+/, '');
    Object.defineProperty(this, JSONATA_TOKEN_SYMBOL, { value: true });
  }

  public resolve(_ctx: IResolveContext): string {
    // Wrap the expression in JSONata delimiters
    return `{% ${this.expression} %}`;
  }

  public toString(): string {
    return Token.asString(this, { displayHint: this.displayHint });
  }

  public toJSON(): string {
    return `<jsonata:${this.expression}>`;
  }
}

/**
 * Validates that the expression is a valid JSONata expression.
 * The expression should NOT include the {% %} delimiters.
 */
export function validateJsonataExpression(expression: string): void {
  if (!expression || expression.trim() === '') {
    throw new UnscopedValidationError('JSONata expression cannot be empty');
  }

  // Check if user accidentally included the delimiters
  if (expression.startsWith('{%') || expression.endsWith('%}')) {
    throw new UnscopedValidationError(
      'JSONata expression should not include {% %} delimiters. ' +
      `Received: ${expression}. Use just the expression, e.g., '$states.input.value'`,
    );
  }
}
