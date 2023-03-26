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
                    if ((0, token_1.isResolvableObject)(mapped)) {
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
_a = JSII_RTTI_SYMBOL_1;
TokenizedStringFragments[_a] = { fqn: "@aws-cdk/core.TokenizedStringFragments", version: "0.0.0" };
exports.TokenizedStringFragments = TokenizedStringFragments;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLWZyYWdtZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0cmluZy1mcmFnbWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsbUNBQW9EO0FBWXBEOztHQUVHO0FBQ0gsTUFBYSx3QkFBd0I7SUFBckM7UUFDbUIsY0FBUyxHQUFHLElBQUksS0FBSyxFQUFZLENBQUM7S0F5RnBEO0lBdkZDLElBQVcsVUFBVTtRQUNuQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7WUFBRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7U0FBRTtRQUNuRCxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELElBQVcsVUFBVTtRQUNuQixPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDekM7SUFFRCxJQUFXLE1BQU07UUFDZixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0tBQzlCO0lBRU0sVUFBVSxDQUFDLEdBQVE7UUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDL0M7SUFFTSxRQUFRLENBQUMsS0FBa0I7Ozs7Ozs7Ozs7UUFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDL0M7SUFFTSxZQUFZLENBQUMsS0FBVTtRQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUNuRDtJQUVEOztPQUVHO0lBQ0gsSUFBVyxNQUFNO1FBQ2YsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQWUsQ0FBQztRQUNyQyxLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDOUIsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtnQkFDdEIsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDbkI7U0FDRjtRQUNELE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFRDs7T0FFRztJQUNJLFNBQVMsQ0FBQyxNQUFvQjs7Ozs7Ozs7OztRQUNuQyxNQUFNLEdBQUcsR0FBRyxJQUFJLHdCQUF3QixFQUFFLENBQUM7UUFFM0MsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzlCLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRTtnQkFDZCxLQUFLLFNBQVM7b0JBQ1osR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLE1BQU07Z0JBQ1IsS0FBSyxPQUFPO29CQUNWLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN4QyxJQUFJLElBQUEsMEJBQWtCLEVBQUMsTUFBTSxDQUFDLEVBQUU7d0JBQzlCLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7cUJBQ3RCO3lCQUFNLElBQUksYUFBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTt3QkFDckMsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDMUI7eUJBQU07d0JBQ0wsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDeEI7b0JBQ0QsTUFBTTtnQkFDUixLQUFLLFdBQVc7b0JBQ2QsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzFCLE1BQU07YUFDVDtTQUNGO1FBRUQsT0FBTyxHQUFHLENBQUM7S0FDWjtJQUVEOzs7O09BSUc7SUFDSSxJQUFJLENBQUMsTUFBNkI7Ozs7Ozs7Ozs7UUFDdkMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFBRSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQUU7UUFDOUUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7U0FBRTtRQUU1RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVqRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hEO1FBRUQsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7Ozs7QUF6RlUsNERBQXdCO0FBd0dyQzs7OztHQUlHO0FBQ0gsU0FBUyxhQUFhLENBQUMsUUFBa0I7SUFDdkMsUUFBUSxRQUFRLENBQUMsSUFBSSxFQUFFO1FBQ3JCLEtBQUssU0FBUyxDQUFDLENBQUMsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQ3BDLEtBQUssT0FBTyxDQUFDLENBQUMsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQy9DLEtBQUssV0FBVyxDQUFDLENBQUMsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDO0tBQ3pDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElGcmFnbWVudENvbmNhdGVuYXRvciwgSVJlc29sdmFibGUgfSBmcm9tICcuL3Jlc29sdmFibGUnO1xuaW1wb3J0IHsgaXNSZXNvbHZhYmxlT2JqZWN0LCBUb2tlbiB9IGZyb20gJy4vdG9rZW4nO1xuXG4vKipcbiAqIFJlc3VsdCBvZiB0aGUgc3BsaXQgb2YgYSBzdHJpbmcgd2l0aCBUb2tlbnNcbiAqXG4gKiBFaXRoZXIgYSBsaXRlcmFsIHBhcnQgb2YgdGhlIHN0cmluZywgb3IgYW4gdW5yZXNvbHZlZCBUb2tlbi5cbiAqL1xudHlwZSBMaXRlcmFsRnJhZ21lbnQgPSB7IHR5cGU6ICdsaXRlcmFsJzsgbGl0OiBhbnk7IH07XG50eXBlIFRva2VuRnJhZ21lbnQgPSB7IHR5cGU6ICd0b2tlbic7IHRva2VuOiBJUmVzb2x2YWJsZTsgfTtcbnR5cGUgSW50cmluc2ljRnJhZ21lbnQgPSB7IHR5cGU6ICdpbnRyaW5zaWMnOyB2YWx1ZTogYW55OyB9O1xudHlwZSBGcmFnbWVudCA9IExpdGVyYWxGcmFnbWVudCB8IFRva2VuRnJhZ21lbnQgfCBJbnRyaW5zaWNGcmFnbWVudDtcblxuLyoqXG4gKiBGcmFnbWVudHMgb2YgYSBjb25jYXRlbmF0ZWQgc3RyaW5nIGNvbnRhaW5pbmcgc3RyaW5naWZpZWQgVG9rZW5zXG4gKi9cbmV4cG9ydCBjbGFzcyBUb2tlbml6ZWRTdHJpbmdGcmFnbWVudHMge1xuICBwcml2YXRlIHJlYWRvbmx5IGZyYWdtZW50cyA9IG5ldyBBcnJheTxGcmFnbWVudD4oKTtcblxuICBwdWJsaWMgZ2V0IGZpcnN0VG9rZW4oKTogSVJlc29sdmFibGUgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGZpcnN0ID0gdGhpcy5mcmFnbWVudHNbMF07XG4gICAgaWYgKGZpcnN0LnR5cGUgPT09ICd0b2tlbicpIHsgcmV0dXJuIGZpcnN0LnRva2VuOyB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgZmlyc3RWYWx1ZSgpOiBhbnkge1xuICAgIHJldHVybiBmcmFnbWVudFZhbHVlKHRoaXMuZnJhZ21lbnRzWzBdKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLmZyYWdtZW50cy5sZW5ndGg7XG4gIH1cblxuICBwdWJsaWMgYWRkTGl0ZXJhbChsaXQ6IGFueSkge1xuICAgIHRoaXMuZnJhZ21lbnRzLnB1c2goeyB0eXBlOiAnbGl0ZXJhbCcsIGxpdCB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb2tlbih0b2tlbjogSVJlc29sdmFibGUpIHtcbiAgICB0aGlzLmZyYWdtZW50cy5wdXNoKHsgdHlwZTogJ3Rva2VuJywgdG9rZW4gfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkSW50cmluc2ljKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLmZyYWdtZW50cy5wdXNoKHsgdHlwZTogJ2ludHJpbnNpYycsIHZhbHVlIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbGwgVG9rZW5zIGZyb20gdGhpcyBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBnZXQgdG9rZW5zKCk6IElSZXNvbHZhYmxlW10ge1xuICAgIGNvbnN0IHJldCA9IG5ldyBBcnJheTxJUmVzb2x2YWJsZT4oKTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgdGhpcy5mcmFnbWVudHMpIHtcbiAgICAgIGlmIChmLnR5cGUgPT09ICd0b2tlbicpIHtcbiAgICAgICAgcmV0LnB1c2goZi50b2tlbik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgYSB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbiB0byBhbGwgdG9rZW5zIGluIHRoZSBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyBtYXBUb2tlbnMobWFwcGVyOiBJVG9rZW5NYXBwZXIpOiBUb2tlbml6ZWRTdHJpbmdGcmFnbWVudHMge1xuICAgIGNvbnN0IHJldCA9IG5ldyBUb2tlbml6ZWRTdHJpbmdGcmFnbWVudHMoKTtcblxuICAgIGZvciAoY29uc3QgZiBvZiB0aGlzLmZyYWdtZW50cykge1xuICAgICAgc3dpdGNoIChmLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbGl0ZXJhbCc6XG4gICAgICAgICAgcmV0LmFkZExpdGVyYWwoZi5saXQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0b2tlbic6XG4gICAgICAgICAgY29uc3QgbWFwcGVkID0gbWFwcGVyLm1hcFRva2VuKGYudG9rZW4pO1xuICAgICAgICAgIGlmIChpc1Jlc29sdmFibGVPYmplY3QobWFwcGVkKSkge1xuICAgICAgICAgICAgcmV0LmFkZFRva2VuKG1hcHBlZCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQobWFwcGVkKSkge1xuICAgICAgICAgICAgcmV0LmFkZEludHJpbnNpYyhtYXBwZWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXQuYWRkTGl0ZXJhbChtYXBwZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnaW50cmluc2ljJzpcbiAgICAgICAgICByZXQuYWRkSW50cmluc2ljKGYudmFsdWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogQ29tYmluZSB0aGUgc3RyaW5nIGZyYWdtZW50cyB1c2luZyB0aGUgZ2l2ZW4gam9pbmVyLlxuICAgKlxuICAgKiBJZiB0aGVyZSBhcmUgYW55XG4gICAqL1xuICBwdWJsaWMgam9pbihjb25jYXQ6IElGcmFnbWVudENvbmNhdGVuYXRvcik6IGFueSB7XG4gICAgaWYgKHRoaXMuZnJhZ21lbnRzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gY29uY2F0LmpvaW4odW5kZWZpbmVkLCB1bmRlZmluZWQpOyB9XG4gICAgaWYgKHRoaXMuZnJhZ21lbnRzLmxlbmd0aCA9PT0gMSkgeyByZXR1cm4gdGhpcy5maXJzdFZhbHVlOyB9XG5cbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmZyYWdtZW50cy5tYXAoZnJhZ21lbnRWYWx1ZSk7XG5cbiAgICB3aGlsZSAodmFsdWVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IHByZWZpeCA9IHZhbHVlcy5zcGxpY2UoMCwgMik7XG4gICAgICB2YWx1ZXMuc3BsaWNlKDAsIDAsIGNvbmNhdC5qb2luKHByZWZpeFswXSwgcHJlZml4WzFdKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlc1swXTtcbiAgfVxufVxuXG4vKipcbiAqIEludGVyZmFjZSB0byBhcHBseSBvcGVyYXRpb24gdG8gdG9rZW5zIGluIGEgc3RyaW5nXG4gKlxuICogSW50ZXJmYWNlIHNvIGl0IGNhbiBiZSBleHBvcnRlZCB2aWEganNpaS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJVG9rZW5NYXBwZXIge1xuICAvKipcbiAgICogUmVwbGFjZSBhIHNpbmdsZSB0b2tlblxuICAgKi9cbiAgbWFwVG9rZW4odDogSVJlc29sdmFibGUpOiBhbnk7XG59XG5cbi8qKlxuICogUmVzb2x2ZSB0aGUgdmFsdWUgZnJvbSBhIHNpbmdsZSBmcmFnbWVudFxuICpcbiAqIElmIHRoZSBmcmFnbWVudCBpcyBhIFRva2VuLCByZXR1cm4gdGhlIHN0cmluZyBlbmNvZGluZyBvZiB0aGUgVG9rZW4uXG4gKi9cbmZ1bmN0aW9uIGZyYWdtZW50VmFsdWUoZnJhZ21lbnQ6IEZyYWdtZW50KTogYW55IHtcbiAgc3dpdGNoIChmcmFnbWVudC50eXBlKSB7XG4gICAgY2FzZSAnbGl0ZXJhbCc6IHJldHVybiBmcmFnbWVudC5saXQ7XG4gICAgY2FzZSAndG9rZW4nOiByZXR1cm4gZnJhZ21lbnQudG9rZW4udG9TdHJpbmcoKTtcbiAgICBjYXNlICdpbnRyaW5zaWMnOiByZXR1cm4gZnJhZ21lbnQudmFsdWU7XG4gIH1cbn1cbiJdfQ==