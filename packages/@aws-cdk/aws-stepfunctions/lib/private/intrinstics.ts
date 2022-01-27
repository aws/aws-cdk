export type IntrinsicExpression = StringLiteralExpression | PathExpression | FnCallExpression;
export type TopLevelIntrinsic = PathExpression | FnCallExpression;

export interface StringLiteralExpression {
  readonly type: 'string-literal';
  readonly literal: string;
}

export interface PathExpression {
  readonly type: 'path';
  readonly path: string;
}

export interface FnCallExpression {
  readonly type: 'fncall';
  readonly functionName: string;
  readonly arguments: IntrinsicExpression[];
}


/**
 * LL(1) parser for StepFunctions intrinsics
 *
 * The parser implements a state machine over a cursor into an expression
 * string. The cusor gets moved, the character at the cursor gets inspected
 * and based on the character we accumulate some value and potentially move
 * to a different state.
 *
 * Literal strings are not allowed at the top level, but are allowed inside
 * function calls.
 */
export class IntrinsicParser {
  private i: number = 0;

  constructor(private readonly expression: string) {
  }

  public parseTopLevelIntrinsic(): TopLevelIntrinsic {
    this.ws();

    let ret;
    if (this.char() === '$') {
      ret = this.parsePath();
    } else if (isAlphaNum(this.char())) {
      ret = this.parseFnCall();
    } else {
      this.raiseError("expected '$' or a function call");
    }

    this.ws();

    if (!this.eof) {
      this.raiseError('unexpected trailing characters');
    }

    return ret;
  }

  private parseIntrinsic(): IntrinsicExpression {
    this.ws();

    if (this.char() === '$') {
      return this.parsePath();
    }

    if (isAlphaNum(this.char())) {
      return this.parseFnCall();
    }

    if (this.char() === "'") {
      return this.parseStringLiteral();
    }

    this.raiseError('expected $, function or single-quoted string');
  }

  /**
   * Simplified path parsing
   *
   * JSON path can actually be quite complicated, but we don't need to validate
   * it precisely. We just need to know how far it extends.
   *
   * Therefore, we only care about:
   *
   * - Starts with a $
   * - Accept ., $ and alphanums
   * - Accept single-quoted strings ('...')
   * - Accept anything between matched square brackets ([...])
   */
  private parsePath(): PathExpression {
    const pathString = new Array<string>();
    if (this.char() !== '$') {
      this.raiseError('expected \'$\'');
    }
    pathString.push(this.consume());

    let done = false;
    while (!done && !this.eof) {
      switch (this.char()) {
        case '.':
        case '$':
          pathString.push(this.consume());
          break;
        case "'":
          const { quoted } = this.consumeQuotedString();
          pathString.push(quoted);
          break;

        case '[':
          pathString.push(this.consumeBracketedExpression(']'));
          break;

        default:
          if (isAlphaNum(this.char())) {
            pathString.push(this.consume());
            break;
          }

          // Not alphanum, end of path expression
          done = true;
      }
    }

    return { type: 'path', path: pathString.join('') };
  }

  /**
   * Parse a fncall
   *
   * Cursor should be on call identifier. Afterwards, cursor will be on closing
   * quote.
   */
  private parseFnCall(): FnCallExpression {
    const name = new Array<string>();
    while (this.char() !== '(') {
      name.push(this.consume());
    }

    this.next(); // Consume the '('
    this.ws();

    const args = [];
    while (this.char() !== ')') {
      args.push(this.parseIntrinsic());
      this.ws();

      if (this.char() === ',') {
        this.next();
        continue;
      } else if (this.char() === ')') {
        continue;
      } else {
        this.raiseError('expected , or )');
      }
    }
    this.next(); // Consume ')'

    return {
      type: 'fncall',
      arguments: args,
      functionName: name.join(''),
    };
  }

  /**
   * Parse a string literal
   *
   * Cursor is expected to be on the first opening quote. Afterwards,
   * cursor will be after the closing quote.
   */
  private parseStringLiteral(): StringLiteralExpression {
    const { unquoted } = this.consumeQuotedString();
    return { type: 'string-literal', literal: unquoted };
  }

  /**
   * Parse a bracketed expression
   *
   * Cursor is expected to be on the opening brace. Afterwards,
   * the cursor will be after the closing brace.
   */
  private consumeBracketedExpression(closingBrace: string): string {
    const ret = new Array<string>();
    ret.push(this.consume());
    while (this.char() !== closingBrace) {
      if (this.char() === '[') {
        ret.push(this.consumeBracketedExpression(']'));
      } else if (this.char() === '{') {
        ret.push(this.consumeBracketedExpression('}'));
      } else {
        ret.push(this.consume());
      }
    }
    ret.push(this.consume());
    return ret.join('');
  }

  /**
   * Parse a string literal
   *
   * Cursor is expected to be on the first opening quote. Afterwards,
   * cursor will be after the closing quote.
   */
  private consumeQuotedString(): { readonly quoted: string; unquoted: string } {
    const quoted = new Array<string>();
    const unquoted = new Array<string>();

    quoted.push(this.consume());
    while (this.char() !== "'") {
      if (this.char() === '\\') {
        // Advance and add next character literally, whatever it is
        quoted.push(this.consume());
      }
      quoted.push(this.char());
      unquoted.push(this.char());
      this.next();
    }
    quoted.push(this.consume());
    return { quoted: quoted.join(''), unquoted: unquoted.join('') };
  }

  /**
   * Consume whitespace if it exists
   *
   * Move the cursor to the next non-whitespace character.
   */
  private ws() {
    while (!this.eof && [' ', '\t', '\n'].includes(this.char())) {
      this.next();
    }
  }

  private get eof() {
    return this.i >= this.expression.length;
  }

  private char(): string {
    if (this.eof) {
      this.raiseError('unexpected end of string');
    }

    return this.expression[this.i];
  }

  private next() {
    this.i++;
  }

  private consume() {
    const ret = this.char();
    this.next();
    return ret;
  }

  private raiseError(message: string): never {
    throw new Error(`Invalid JSONPath expression: ${message} at index ${this.i} in ${JSON.stringify(this.expression)}`);
  }
}

function isAlphaNum(x: string) {
  return x.match(/^[a-zA-Z0-9]$/);
}
