"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntrinsicParser = void 0;
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
class IntrinsicParser {
    constructor(expression) {
        this.expression = expression;
        this.i = 0;
    }
    parseTopLevelIntrinsic() {
        this.ws();
        let ret;
        if (this.char() === '$') {
            ret = this.parsePath();
        }
        else if (isAlphaNum(this.char())) {
            ret = this.parseFnCall();
        }
        else {
            this.raiseError("expected '$' or a function call");
        }
        this.ws();
        if (!this.eof) {
            this.raiseError('unexpected trailing characters');
        }
        return ret;
    }
    parseIntrinsic() {
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
    parsePath() {
        const pathString = new Array();
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
    parseFnCall() {
        const name = new Array();
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
            }
            else if (this.char() === ')') {
                continue;
            }
            else {
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
    parseStringLiteral() {
        const { unquoted } = this.consumeQuotedString();
        return { type: 'string-literal', literal: unquoted };
    }
    /**
     * Parse a bracketed expression
     *
     * Cursor is expected to be on the opening brace. Afterwards,
     * the cursor will be after the closing brace.
     */
    consumeBracketedExpression(closingBrace) {
        const ret = new Array();
        ret.push(this.consume());
        while (this.char() !== closingBrace) {
            if (this.char() === '[') {
                ret.push(this.consumeBracketedExpression(']'));
            }
            else if (this.char() === '{') {
                ret.push(this.consumeBracketedExpression('}'));
            }
            else {
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
    consumeQuotedString() {
        const quoted = new Array();
        const unquoted = new Array();
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
    ws() {
        while (!this.eof && [' ', '\t', '\n'].includes(this.char())) {
            this.next();
        }
    }
    get eof() {
        return this.i >= this.expression.length;
    }
    char() {
        if (this.eof) {
            this.raiseError('unexpected end of string');
        }
        return this.expression[this.i];
    }
    next() {
        this.i++;
    }
    consume() {
        const ret = this.char();
        this.next();
        return ret;
    }
    raiseError(message) {
        throw new Error(`Invalid JSONPath expression: ${message} at index ${this.i} in ${JSON.stringify(this.expression)}`);
    }
}
exports.IntrinsicParser = IntrinsicParser;
function isAlphaNum(x) {
    return x.match(/^[a-zA-Z0-9]$/);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50cmluc3RpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRyaW5zdGljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFvQkE7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQWEsZUFBZTtJQUcxQixZQUE2QixVQUFrQjtRQUFsQixlQUFVLEdBQVYsVUFBVSxDQUFRO1FBRnZDLE1BQUMsR0FBVyxDQUFDLENBQUM7S0FHckI7SUFFTSxzQkFBc0I7UUFDM0IsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBRVYsSUFBSSxHQUFHLENBQUM7UUFDUixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLEVBQUU7WUFDdkIsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUN4QjthQUFNLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO1lBQ2xDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDMUI7YUFBTTtZQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsaUNBQWlDLENBQUMsQ0FBQztTQUNwRDtRQUVELElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUVWLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1NBQ25EO1FBRUQsT0FBTyxHQUFHLENBQUM7S0FDWjtJQUVPLGNBQWM7UUFDcEIsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBRVYsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxFQUFFO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3pCO1FBRUQsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDM0I7UUFFRCxJQUFJLElBQUksQ0FB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QU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEM7SUFFTyxJQUFJO1FBQ1YsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQ1Y7SUFFTyxPQUFPO1FBQ2IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNaLE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFTyxVQUFVLENBQUMsT0FBZTtRQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxPQUFPLGFBQWEsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDckg7Q0FDRjtBQWxPRCwwQ0FrT0M7QUFFRCxTQUFTLFVBQVUsQ0FBQyxDQUFTO0lBQzNCLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNsQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHR5cGUgSW50cmluc2ljRXhwcmVzc2lvbiA9IFN0cmluZ0xpdGVyYWxFeHByZXNzaW9uIHwgUGF0aEV4cHJlc3Npb24gfCBGbkNhbGxFeHByZXNzaW9uO1xuZXhwb3J0IHR5cGUgVG9wTGV2ZWxJbnRyaW5zaWMgPSBQYXRoRXhwcmVzc2lvbiB8IEZuQ2FsbEV4cHJlc3Npb247XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RyaW5nTGl0ZXJhbEV4cHJlc3Npb24ge1xuICByZWFkb25seSB0eXBlOiAnc3RyaW5nLWxpdGVyYWwnO1xuICByZWFkb25seSBsaXRlcmFsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGF0aEV4cHJlc3Npb24ge1xuICByZWFkb25seSB0eXBlOiAncGF0aCc7XG4gIHJlYWRvbmx5IHBhdGg6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGbkNhbGxFeHByZXNzaW9uIHtcbiAgcmVhZG9ubHkgdHlwZTogJ2ZuY2FsbCc7XG4gIHJlYWRvbmx5IGZ1bmN0aW9uTmFtZTogc3RyaW5nO1xuICByZWFkb25seSBhcmd1bWVudHM6IEludHJpbnNpY0V4cHJlc3Npb25bXTtcbn1cblxuXG4vKipcbiAqIExMKDEpIHBhcnNlciBmb3IgU3RlcEZ1bmN0aW9ucyBpbnRyaW5zaWNzXG4gKlxuICogVGhlIHBhcnNlciBpbXBsZW1lbnRzIGEgc3RhdGUgbWFjaGluZSBvdmVyIGEgY3Vyc29yIGludG8gYW4gZXhwcmVzc2lvblxuICogc3RyaW5nLiBUaGUgY3Vzb3IgZ2V0cyBtb3ZlZCwgdGhlIGNoYXJhY3RlciBhdCB0aGUgY3Vyc29yIGdldHMgaW5zcGVjdGVkXG4gKiBhbmQgYmFzZWQgb24gdGhlIGNoYXJhY3RlciB3ZSBhY2N1bXVsYXRlIHNvbWUgdmFsdWUgYW5kIHBvdGVudGlhbGx5IG1vdmVcbiAqIHRvIGEgZGlmZmVyZW50IHN0YXRlLlxuICpcbiAqIExpdGVyYWwgc3RyaW5ncyBhcmUgbm90IGFsbG93ZWQgYXQgdGhlIHRvcCBsZXZlbCwgYnV0IGFyZSBhbGxvd2VkIGluc2lkZVxuICogZnVuY3Rpb24gY2FsbHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnRyaW5zaWNQYXJzZXIge1xuICBwcml2YXRlIGk6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBleHByZXNzaW9uOiBzdHJpbmcpIHtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZVRvcExldmVsSW50cmluc2ljKCk6IFRvcExldmVsSW50cmluc2ljIHtcbiAgICB0aGlzLndzKCk7XG5cbiAgICBsZXQgcmV0O1xuICAgIGlmICh0aGlzLmNoYXIoKSA9PT0gJyQnKSB7XG4gICAgICByZXQgPSB0aGlzLnBhcnNlUGF0aCgpO1xuICAgIH0gZWxzZSBpZiAoaXNBbHBoYU51bSh0aGlzLmNoYXIoKSkpIHtcbiAgICAgIHJldCA9IHRoaXMucGFyc2VGbkNhbGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yYWlzZUVycm9yKFwiZXhwZWN0ZWQgJyQnIG9yIGEgZnVuY3Rpb24gY2FsbFwiKTtcbiAgICB9XG5cbiAgICB0aGlzLndzKCk7XG5cbiAgICBpZiAoIXRoaXMuZW9mKSB7XG4gICAgICB0aGlzLnJhaXNlRXJyb3IoJ3VuZXhwZWN0ZWQgdHJhaWxpbmcgY2hhcmFjdGVycycpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlSW50cmluc2ljKCk6IEludHJpbnNpY0V4cHJlc3Npb24ge1xuICAgIHRoaXMud3MoKTtcblxuICAgIGlmICh0aGlzLmNoYXIoKSA9PT0gJyQnKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZVBhdGgoKTtcbiAgICB9XG5cbiAgICBpZiAoaXNBbHBoYU51bSh0aGlzLmNoYXIoKSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlRm5DYWxsKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2hhcigpID09PSBcIidcIikge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VTdHJpbmdMaXRlcmFsKCk7XG4gICAgfVxuXG4gICAgdGhpcy5yYWlzZUVycm9yKCdleHBlY3RlZCAkLCBmdW5jdGlvbiBvciBzaW5nbGUtcXVvdGVkIHN0cmluZycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNpbXBsaWZpZWQgcGF0aCBwYXJzaW5nXG4gICAqXG4gICAqIEpTT04gcGF0aCBjYW4gYWN0dWFsbHkgYmUgcXVpdGUgY29tcGxpY2F0ZWQsIGJ1dCB3ZSBkb24ndCBuZWVkIHRvIHZhbGlkYXRlXG4gICAqIGl0IHByZWNpc2VseS4gV2UganVzdCBuZWVkIHRvIGtub3cgaG93IGZhciBpdCBleHRlbmRzLlxuICAgKlxuICAgKiBUaGVyZWZvcmUsIHdlIG9ubHkgY2FyZSBhYm91dDpcbiAgICpcbiAgICogLSBTdGFydHMgd2l0aCBhICRcbiAgICogLSBBY2NlcHQgLiwgJCBhbmQgYWxwaGFudW1zXG4gICAqIC0gQWNjZXB0IHNpbmdsZS1xdW90ZWQgc3RyaW5ncyAoJy4uLicpXG4gICAqIC0gQWNjZXB0IGFueXRoaW5nIGJldHdlZW4gbWF0Y2hlZCBzcXVhcmUgYnJhY2tldHMgKFsuLi5dKVxuICAgKi9cbiAgcHJpdmF0ZSBwYXJzZVBhdGgoKTogUGF0aEV4cHJlc3Npb24ge1xuICAgIGNvbnN0IHBhdGhTdHJpbmcgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICAgIGlmICh0aGlzLmNoYXIoKSAhPT0gJyQnKSB7XG4gICAgICB0aGlzLnJhaXNlRXJyb3IoJ2V4cGVjdGVkIFxcJyRcXCcnKTtcbiAgICB9XG4gICAgcGF0aFN0cmluZy5wdXNoKHRoaXMuY29uc3VtZSgpKTtcblxuICAgIGxldCBkb25lID0gZmFsc2U7XG4gICAgd2hpbGUgKCFkb25lICYmICF0aGlzLmVvZikge1xuICAgICAgc3dpdGNoICh0aGlzLmNoYXIoKSkge1xuICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgY2FzZSAnJCc6XG4gICAgICAgICAgcGF0aFN0cmluZy5wdXNoKHRoaXMuY29uc3VtZSgpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIidcIjpcbiAgICAgICAgICBjb25zdCB7IHF1b3RlZCB9ID0gdGhpcy5jb25zdW1lUXVvdGVkU3RyaW5nKCk7XG4gICAgICAgICAgcGF0aFN0cmluZy5wdXNoKHF1b3RlZCk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnWyc6XG4gICAgICAgICAgcGF0aFN0cmluZy5wdXNoKHRoaXMuY29uc3VtZUJyYWNrZXRlZEV4cHJlc3Npb24oJ10nKSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoaXNBbHBoYU51bSh0aGlzLmNoYXIoKSkpIHtcbiAgICAgICAgICAgIHBhdGhTdHJpbmcucHVzaCh0aGlzLmNvbnN1bWUoKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOb3QgYWxwaGFudW0sIGVuZCBvZiBwYXRoIGV4cHJlc3Npb25cbiAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB0eXBlOiAncGF0aCcsIHBhdGg6IHBhdGhTdHJpbmcuam9pbignJykgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJzZSBhIGZuY2FsbFxuICAgKlxuICAgKiBDdXJzb3Igc2hvdWxkIGJlIG9uIGNhbGwgaWRlbnRpZmllci4gQWZ0ZXJ3YXJkcywgY3Vyc29yIHdpbGwgYmUgb24gY2xvc2luZ1xuICAgKiBxdW90ZS5cbiAgICovXG4gIHByaXZhdGUgcGFyc2VGbkNhbGwoKTogRm5DYWxsRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgbmFtZSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgd2hpbGUgKHRoaXMuY2hhcigpICE9PSAnKCcpIHtcbiAgICAgIG5hbWUucHVzaCh0aGlzLmNvbnN1bWUoKSk7XG4gICAgfVxuXG4gICAgdGhpcy5uZXh0KCk7IC8vIENvbnN1bWUgdGhlICcoJ1xuICAgIHRoaXMud3MoKTtcblxuICAgIGNvbnN0IGFyZ3MgPSBbXTtcbiAgICB3aGlsZSAodGhpcy5jaGFyKCkgIT09ICcpJykge1xuICAgICAgYXJncy5wdXNoKHRoaXMucGFyc2VJbnRyaW5zaWMoKSk7XG4gICAgICB0aGlzLndzKCk7XG5cbiAgICAgIGlmICh0aGlzLmNoYXIoKSA9PT0gJywnKSB7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGFyKCkgPT09ICcpJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmFpc2VFcnJvcignZXhwZWN0ZWQgLCBvciApJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubmV4dCgpOyAvLyBDb25zdW1lICcpJ1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdmbmNhbGwnLFxuICAgICAgYXJndW1lbnRzOiBhcmdzLFxuICAgICAgZnVuY3Rpb25OYW1lOiBuYW1lLmpvaW4oJycpLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgYSBzdHJpbmcgbGl0ZXJhbFxuICAgKlxuICAgKiBDdXJzb3IgaXMgZXhwZWN0ZWQgdG8gYmUgb24gdGhlIGZpcnN0IG9wZW5pbmcgcXVvdGUuIEFmdGVyd2FyZHMsXG4gICAqIGN1cnNvciB3aWxsIGJlIGFmdGVyIHRoZSBjbG9zaW5nIHF1b3RlLlxuICAgKi9cbiAgcHJpdmF0ZSBwYXJzZVN0cmluZ0xpdGVyYWwoKTogU3RyaW5nTGl0ZXJhbEV4cHJlc3Npb24ge1xuICAgIGNvbnN0IHsgdW5xdW90ZWQgfSA9IHRoaXMuY29uc3VtZVF1b3RlZFN0cmluZygpO1xuICAgIHJldHVybiB7IHR5cGU6ICdzdHJpbmctbGl0ZXJhbCcsIGxpdGVyYWw6IHVucXVvdGVkIH07XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgYSBicmFja2V0ZWQgZXhwcmVzc2lvblxuICAgKlxuICAgKiBDdXJzb3IgaXMgZXhwZWN0ZWQgdG8gYmUgb24gdGhlIG9wZW5pbmcgYnJhY2UuIEFmdGVyd2FyZHMsXG4gICAqIHRoZSBjdXJzb3Igd2lsbCBiZSBhZnRlciB0aGUgY2xvc2luZyBicmFjZS5cbiAgICovXG4gIHByaXZhdGUgY29uc3VtZUJyYWNrZXRlZEV4cHJlc3Npb24oY2xvc2luZ0JyYWNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJldCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgcmV0LnB1c2godGhpcy5jb25zdW1lKCkpO1xuICAgIHdoaWxlICh0aGlzLmNoYXIoKSAhPT0gY2xvc2luZ0JyYWNlKSB7XG4gICAgICBpZiAodGhpcy5jaGFyKCkgPT09ICdbJykge1xuICAgICAgICByZXQucHVzaCh0aGlzLmNvbnN1bWVCcmFja2V0ZWRFeHByZXNzaW9uKCddJykpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoYXIoKSA9PT0gJ3snKSB7XG4gICAgICAgIHJldC5wdXNoKHRoaXMuY29uc3VtZUJyYWNrZXRlZEV4cHJlc3Npb24oJ30nKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXQucHVzaCh0aGlzLmNvbnN1bWUoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldC5wdXNoKHRoaXMuY29uc3VtZSgpKTtcbiAgICByZXR1cm4gcmV0LmpvaW4oJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIGEgc3RyaW5nIGxpdGVyYWxcbiAgICpcbiAgICogQ3Vyc29yIGlzIGV4cGVjdGVkIHRvIGJlIG9uIHRoZSBmaXJzdCBvcGVuaW5nIHF1b3RlLiBBZnRlcndhcmRzLFxuICAgKiBjdXJzb3Igd2lsbCBiZSBhZnRlciB0aGUgY2xvc2luZyBxdW90ZS5cbiAgICovXG4gIHByaXZhdGUgY29uc3VtZVF1b3RlZFN0cmluZygpOiB7IHJlYWRvbmx5IHF1b3RlZDogc3RyaW5nOyB1bnF1b3RlZDogc3RyaW5nIH0ge1xuICAgIGNvbnN0IHF1b3RlZCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgY29uc3QgdW5xdW90ZWQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gICAgcXVvdGVkLnB1c2godGhpcy5jb25zdW1lKCkpO1xuICAgIHdoaWxlICh0aGlzLmNoYXIoKSAhPT0gXCInXCIpIHtcbiAgICAgIGlmICh0aGlzLmNoYXIoKSA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIC8vIEFkdmFuY2UgYW5kIGFkZCBuZXh0IGNoYXJhY3RlciBsaXRlcmFsbHksIHdoYXRldmVyIGl0IGlzXG4gICAgICAgIHF1b3RlZC5wdXNoKHRoaXMuY29uc3VtZSgpKTtcbiAgICAgIH1cbiAgICAgIHF1b3RlZC5wdXNoKHRoaXMuY2hhcigpKTtcbiAgICAgIHVucXVvdGVkLnB1c2godGhpcy5jaGFyKCkpO1xuICAgICAgdGhpcy5uZXh0KCk7XG4gICAgfVxuICAgIHF1b3RlZC5wdXNoKHRoaXMuY29uc3VtZSgpKTtcbiAgICByZXR1cm4geyBxdW90ZWQ6IHF1b3RlZC5qb2luKCcnKSwgdW5xdW90ZWQ6IHVucXVvdGVkLmpvaW4oJycpIH07XG4gIH1cblxuICAvKipcbiAgICogQ29uc3VtZSB3aGl0ZXNwYWNlIGlmIGl0IGV4aXN0c1xuICAgKlxuICAgKiBNb3ZlIHRoZSBjdXJzb3IgdG8gdGhlIG5leHQgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVyLlxuICAgKi9cbiAgcHJpdmF0ZSB3cygpIHtcbiAgICB3aGlsZSAoIXRoaXMuZW9mICYmIFsnICcsICdcXHQnLCAnXFxuJ10uaW5jbHVkZXModGhpcy5jaGFyKCkpKSB7XG4gICAgICB0aGlzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldCBlb2YoKSB7XG4gICAgcmV0dXJuIHRoaXMuaSA+PSB0aGlzLmV4cHJlc3Npb24ubGVuZ3RoO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGFyKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuZW9mKSB7XG4gICAgICB0aGlzLnJhaXNlRXJyb3IoJ3VuZXhwZWN0ZWQgZW5kIG9mIHN0cmluZycpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmV4cHJlc3Npb25bdGhpcy5pXTtcbiAgfVxuXG4gIHByaXZhdGUgbmV4dCgpIHtcbiAgICB0aGlzLmkrKztcbiAgfVxuXG4gIHByaXZhdGUgY29uc3VtZSgpIHtcbiAgICBjb25zdCByZXQgPSB0aGlzLmNoYXIoKTtcbiAgICB0aGlzLm5leHQoKTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgcHJpdmF0ZSByYWlzZUVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IG5ldmVyIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSlNPTlBhdGggZXhwcmVzc2lvbjogJHttZXNzYWdlfSBhdCBpbmRleCAke3RoaXMuaX0gaW4gJHtKU09OLnN0cmluZ2lmeSh0aGlzLmV4cHJlc3Npb24pfWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzQWxwaGFOdW0oeDogc3RyaW5nKSB7XG4gIHJldHVybiB4Lm1hdGNoKC9eW2EtekEtWjAtOV0kLyk7XG59XG4iXX0=