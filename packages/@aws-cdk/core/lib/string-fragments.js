"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenizedStringFragments = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const token_1 = require("./token");
/**
 * Fragments of a concatenated string containing stringified Tokens
 */
class TokenizedStringFragments {
    constructor() {
        this.fragments = new Array();
    }
    get firstToken() {
        const first = this.fragments[0];
        if (first.type === 'token') {
            return first.token;
        }
        return undefined;
    }
    get firstValue() {
        return fragmentValue(this.fragments[0]);
    }
    get length() {
        return this.fragments.length;
    }
    addLiteral(lit) {
        this.fragments.push({ type: 'literal', lit });
    }
    addToken(token) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IResolvable(token);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addToken);
            }
            throw error;
        }
        this.fragments.push({ type: 'token', token });
    }
    addIntrinsic(value) {
        this.fragments.push({ type: 'intrinsic', value });
    }
    /**
     * Return all Tokens from this string
     */
    get tokens() {
        const ret = new Array();
        for (const f of this.fragments) {
            if (f.type === 'token') {
                ret.push(f.token);
            }
        }
        return ret;
    }
    /**
     * Apply a transformation function to all tokens in the string
     */
    mapTokens(mapper) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ITokenMapper(mapper);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.mapTokens);
            }
            throw error;
        }
        const ret = new TokenizedStringFragments();
        for (const f of this.fragments) {
            switch (f.type) {
                case 'literal':
                    ret.addLiteral(f.lit);
                    break;
                case 'token':
                    const mapped = mapper.mapToken(f.token);
                    if (token_1.isResolvableObject(mapped)) {
                        ret.addToken(mapped);
                    }
                    else if (token_1.Token.isUnresolved(mapped)) {
                        ret.addIntrinsic(mapped);
                    }
                    else {
                        ret.addLiteral(mapped);
                    }
                    break;
                case 'intrinsic':
                    ret.addIntrinsic(f.value);
                    break;
            }
        }
        return ret;
    }
    /**
     * Combine the string fragments using the given joiner.
     *
     * If there are any
     */
    join(concat) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IFragmentConcatenator(concat);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.join);
            }
            throw error;
        }
        if (this.fragments.length === 0) {
            return concat.join(undefined, undefined);
        }
        if (this.fragments.length === 1) {
            return this.firstValue;
        }
        const values = this.fragments.map(fragmentValue);
        while (values.length > 1) {
            const prefix = values.splice(0, 2);
            values.splice(0, 0, concat.join(prefix[0], prefix[1]));
        }
        return values[0];
    }
}
exports.TokenizedStringFragments = TokenizedStringFragments;
_a = JSII_RTTI_SYMBOL_1;
TokenizedStringFragments[_a] = { fqn: "@aws-cdk/core.TokenizedStringFragments", version: "0.0.0" };
/**
 * Resolve the value from a single fragment
 *
 * If the fragment is a Token, return the string encoding of the Token.
 */
function fragmentValue(fragment) {
    switch (fragment.type) {
        case 'literal': return fragment.lit;
        case 'token': return fragment.token.toString();
        case 'intrinsic': return fragment.value;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLWZyYWdtZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0cmluZy1mcmFnbWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsbUNBQW9EO0FBWXBEOztHQUVHO0FBQ0gsTUFBYSx3QkFBd0I7SUFBckM7UUFDbUIsY0FBUyxHQUFHLElBQUksS0FBSyxFQUFZLENBQUM7S0F5RnBEO0lBdkZDLElBQVcsVUFBVTtRQUNuQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7U0FBRTtRQUNuRCxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELElBQVcsVUFBVTtRQUNuQixPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDekM7SUFFRCxJQUFXLE1BQU07UUFDZixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0tBQzlCO0lBRU0sVUFBVSxDQUFDLEdBQVE7UUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDL0M7SUFFTSxRQUFRLENBQUMsS0FBa0I7Ozs7Ozs7Ozs7UUFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDL0M7SUFFTSxZQUFZLENBQUMsS0FBVTtRQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUNuRDtJQUVEOztPQUVHO0lBQ0gsSUFBVyxNQUFNO1FBQ2YsTUFBTSxHQUFH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YWJsZSB9IGZyb20gJy4vcmVzb2x2YWJsZSc7XG5pbXBvcnQgeyBpc1Jlc29sdmFibGVPYmplY3QsIFRva2VuIH0gZnJvbSAnLi90b2tlbic7XG5cbi8qKlxuICogUmVzdWx0IG9mIHRoZSBzcGxpdCBvZiBhIHN0cmluZyB3aXRoIFRva2Vuc1xuICpcbiAqIEVpdGhlciBhIGxpdGVyYWwgcGFydCBvZiB0aGUgc3RyaW5nLCBvciBhbiB1bnJlc29sdmVkIFRva2VuLlxuICovXG50eXBlIExpdGVyYWxGcmFnbWVudCA9IHsgdHlwZTogJ2xpdGVyYWwnOyBsaXQ6IGFueTsgfTtcbnR5cGUgVG9rZW5GcmFnbWVudCA9IHsgdHlwZTogJ3Rva2VuJzsgdG9rZW46IElSZXNvbHZhYmxlOyB9O1xudHlwZSBJbnRyaW5zaWNGcmFnbWVudCA9IHsgdHlwZTogJ2ludHJpbnNpYyc7IHZhbHVlOiBhbnk7IH07XG50eXBlIEZyYWdtZW50ID0gTGl0ZXJhbEZyYWdtZW50IHwgVG9rZW5GcmFnbWVudCB8IEludHJpbnNpY0ZyYWdtZW50O1xuXG4vKipcbiAqIEZyYWdtZW50cyBvZiBhIGNvbmNhdGVuYXRlZCBzdHJpbmcgY29udGFpbmluZyBzdHJpbmdpZmllZCBUb2tlbnNcbiAqL1xuZXhwb3J0IGNsYXNzIFRva2VuaXplZFN0cmluZ0ZyYWdtZW50cyB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZnJhZ21lbnRzID0gbmV3IEFycmF5PEZyYWdtZW50PigpO1xuXG4gIHB1YmxpYyBnZXQgZmlyc3RUb2tlbigpOiBJUmVzb2x2YWJsZSB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgZmlyc3QgPSB0aGlzLmZyYWdtZW50c1swXTtcbiAgICBpZiAoZmlyc3QudHlwZSA9PT0gJ3Rva2VuJykgeyByZXR1cm4gZmlyc3QudG9rZW47IH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGdldCBmaXJzdFZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIGZyYWdtZW50VmFsdWUodGhpcy5mcmFnbWVudHNbMF0pO1xuICB9XG5cbiAgcHVibGljIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJhZ21lbnRzLmxlbmd0aDtcbiAgfVxuXG4gIHB1YmxpYyBhZGRMaXRlcmFsKGxpdDogYW55KSB7XG4gICAgdGhpcy5mcmFnbWVudHMucHVzaCh7IHR5cGU6ICdsaXRlcmFsJywgbGl0IH0pO1xuICB9XG5cbiAgcHVibGljIGFkZFRva2VuKHRva2VuOiBJUmVzb2x2YWJsZSkge1xuICAgIHRoaXMuZnJhZ21lbnRzLnB1c2goeyB0eXBlOiAndG9rZW4nLCB0b2tlbiB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRJbnRyaW5zaWModmFsdWU6IGFueSkge1xuICAgIHRoaXMuZnJhZ21lbnRzLnB1c2goeyB0eXBlOiAnaW50cmluc2ljJywgdmFsdWUgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFsbCBUb2tlbnMgZnJvbSB0aGlzIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIGdldCB0b2tlbnMoKTogSVJlc29sdmFibGVbXSB7XG4gICAgY29uc3QgcmV0ID0gbmV3IEFycmF5PElSZXNvbHZhYmxlPigpO1xuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmZyYWdtZW50cykge1xuICAgICAgaWYgKGYudHlwZSA9PT0gJ3Rva2VuJykge1xuICAgICAgICByZXQucHVzaChmLnRva2VuKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBhIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uIHRvIGFsbCB0b2tlbnMgaW4gdGhlIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIG1hcFRva2VucyhtYXBwZXI6IElUb2tlbk1hcHBlcik6IFRva2VuaXplZFN0cmluZ0ZyYWdtZW50cyB7XG4gICAgY29uc3QgcmV0ID0gbmV3IFRva2VuaXplZFN0cmluZ0ZyYWdtZW50cygpO1xuXG4gICAgZm9yIChjb25zdCBmIG9mIHRoaXMuZnJhZ21lbnRzKSB7XG4gICAgICBzd2l0Y2ggKGYudHlwZSkge1xuICAgICAgICBjYXNlICdsaXRlcmFsJzpcbiAgICAgICAgICByZXQuYWRkTGl0ZXJhbChmLmxpdCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3Rva2VuJzpcbiAgICAgICAgICBjb25zdCBtYXBwZWQgPSBtYXBwZXIubWFwVG9rZW4oZi50b2tlbik7XG4gICAgICAgICAgaWYgKGlzUmVzb2x2YWJsZU9iamVjdChtYXBwZWQpKSB7XG4gICAgICAgICAgICByZXQuYWRkVG9rZW4obWFwcGVkKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChtYXBwZWQpKSB7XG4gICAgICAgICAgICByZXQuYWRkSW50cmluc2ljKG1hcHBlZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldC5hZGRMaXRlcmFsKG1hcHBlZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdpbnRyaW5zaWMnOlxuICAgICAgICAgIHJldC5hZGRJbnRyaW5zaWMoZi52YWx1ZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21iaW5lIHRoZSBzdHJpbmcgZnJhZ21lbnRzIHVzaW5nIHRoZSBnaXZlbiBqb2luZXIuXG4gICAqXG4gICAqIElmIHRoZXJlIGFyZSBhbnlcbiAgICovXG4gIHB1YmxpYyBqb2luKGNvbmNhdDogSUZyYWdtZW50Q29uY2F0ZW5hdG9yKTogYW55IHtcbiAgICBpZiAodGhpcy5mcmFnbWVudHMubGVuZ3RoID09PSAwKSB7IHJldHVybiBjb25jYXQuam9pbih1bmRlZmluZWQsIHVuZGVmaW5lZCk7IH1cbiAgICBpZiAodGhpcy5mcmFnbWVudHMubGVuZ3RoID09PSAxKSB7IHJldHVybiB0aGlzLmZpcnN0VmFsdWU7IH1cblxuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZnJhZ21lbnRzLm1hcChmcmFnbWVudFZhbHVlKTtcblxuICAgIHdoaWxlICh2YWx1ZXMubGVuZ3RoID4gMSkge1xuICAgICAgY29uc3QgcHJlZml4ID0gdmFsdWVzLnNwbGljZSgwLCAyKTtcbiAgICAgIHZhbHVlcy5zcGxpY2UoMCwgMCwgY29uY2F0LmpvaW4ocHJlZml4WzBdLCBwcmVmaXhbMV0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVzWzBdO1xuICB9XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIHRvIGFwcGx5IG9wZXJhdGlvbiB0byB0b2tlbnMgaW4gYSBzdHJpbmdcbiAqXG4gKiBJbnRlcmZhY2Ugc28gaXQgY2FuIGJlIGV4cG9ydGVkIHZpYSBqc2lpLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElUb2tlbk1hcHBlciB7XG4gIC8qKlxuICAgKiBSZXBsYWNlIGEgc2luZ2xlIHRva2VuXG4gICAqL1xuICBtYXBUb2tlbih0OiBJUmVzb2x2YWJsZSk6IGFueTtcbn1cblxuLyoqXG4gKiBSZXNvbHZlIHRoZSB2YWx1ZSBmcm9tIGEgc2luZ2xlIGZyYWdtZW50XG4gKlxuICogSWYgdGhlIGZyYWdtZW50IGlzIGEgVG9rZW4sIHJldHVybiB0aGUgc3RyaW5nIGVuY29kaW5nIG9mIHRoZSBUb2tlbi5cbiAqL1xuZnVuY3Rpb24gZnJhZ21lbnRWYWx1ZShmcmFnbWVudDogRnJhZ21lbnQpOiBhbnkge1xuICBzd2l0Y2ggKGZyYWdtZW50LnR5cGUpIHtcbiAgICBjYXNlICdsaXRlcmFsJzogcmV0dXJuIGZyYWdtZW50LmxpdDtcbiAgICBjYXNlICd0b2tlbic6IHJldHVybiBmcmFnbWVudC50b2tlbi50b1N0cmluZygpO1xuICAgIGNhc2UgJ2ludHJpbnNpYyc6IHJldHVybiBmcmFnbWVudC52YWx1ZTtcbiAgfVxufVxuIl19