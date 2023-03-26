export declare type IntrinsicExpression = StringLiteralExpression | PathExpression | FnCallExpression;
export declare type TopLevelIntrinsic = PathExpression | FnCallExpression;
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
export declare class IntrinsicParser {
    private readonly expression;
    private i;
    constructor(expression: string);
    parseTopLevelIntrinsic(): TopLevelIntrinsic;
    private parseIntrinsic;
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
    private parsePath;
    /**
     * Parse a fncall
     *
     * Cursor should be on call identifier. Afterwards, cursor will be on closing
     * quote.
     */
    private parseFnCall;
    /**
     * Parse a string literal
     *
     * Cursor is expected to be on the first opening quote. Afterwards,
     * cursor will be after the closing quote.
     */
    private parseStringLiteral;
    /**
     * Parse a bracketed expression
     *
     * Cursor is expected to be on the opening brace. Afterwards,
     * the cursor will be after the closing brace.
     */
    private consumeBracketedExpression;
    /**
     * Parse a string literal
     *
     * Cursor is expected to be on the first opening quote. Afterwards,
     * cursor will be after the closing quote.
     */
    private consumeQuotedString;
    /**
     * Consume whitespace if it exists
     *
     * Move the cursor to the next non-whitespace character.
     */
    private ws;
    private get eof();
    private char;
    private next;
    private consume;
    private raiseError;
}
