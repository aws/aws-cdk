"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextProvider = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const annotations_1 = require("./annotations");
const stack_1 = require("./stack");
const token_1 = require("./token");
/**
 * Base class for the model side of context providers
 *
 * Instances of this class communicate with context provider plugins in the 'cdk
 * toolkit' via context variables (input), outputting specialized queries for
 * more context variables (output).
 *
 * ContextProvider needs access to a Construct to hook into the context mechanism.
 *
 */
class ContextProvider {
    /**
     * @returns the context key or undefined if a key cannot be rendered (due to tokens used in any of the props)
     */
    static getKey(scope, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_GetContextKeyOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getKey);
            }
            throw error;
        }
        const stack = stack_1.Stack.of(scope);
        const props = options.includeEnvironment ?? true
            ? { account: stack.account, region: stack.region, ...options.props }
            : (options.props ?? {});
        if (Object.values(props).find(x => token_1.Token.isUnresolved(x))) {
            throw new Error(`Cannot determine scope for context provider ${options.provider}.\n` +
                'This usually happens when one or more of the provider props have unresolved tokens');
        }
        const propStrings = propsToArray(props);
        return {
            key: `${options.provider}:${propStrings.join(':')}`,
            props,
        };
    }
    static getValue(scope, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_GetContextValueOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getValue);
            }
            throw error;
        }
        const stack = stack_1.Stack.of(scope);
        if (token_1.Token.isUnresolved(stack.account) || token_1.Token.isUnresolved(stack.region)) {
            throw new Error(`Cannot retrieve value from context provider ${options.provider} since account/region ` +
                'are not specified at the stack level. Configure "env" with an account and region when ' +
                'you define your stack.' +
                'See https://docs.aws.amazon.com/cdk/latest/guide/environments.html for more details.');
        }
        const { key, props } = this.getKey(scope, options);
        const value = constructs_1.Node.of(scope).tryGetContext(key);
        const providerError = extractProviderError(value);
        // if context is missing or an error occurred during context retrieval,
        // report and return a dummy value.
        if (value === undefined || providerError !== undefined) {
            stack.reportMissingContextKey({
                key,
                provider: options.provider,
                props: props,
            });
            if (providerError !== undefined) {
                annotations_1.Annotations.of(scope).addError(providerError);
            }
            return { value: options.dummyValue };
        }
        return { value };
    }
    constructor() { }
}
_a = JSII_RTTI_SYMBOL_1;
ContextProvider[_a] = { fqn: "@aws-cdk/core.ContextProvider", version: "0.0.0" };
exports.ContextProvider = ContextProvider;
/**
 * If the context value represents an error, return the error message
 */
function extractProviderError(value) {
    if (typeof value === 'object' && value !== null) {
        return value[cxapi.PROVIDER_ERROR_KEY];
    }
    return undefined;
}
/**
 * Quote colons in all strings so that we can undo the quoting at a later point
 *
 * We'll use $ as a quoting character, for no particularly good reason other
 * than that \ is going to lead to quoting hell when the keys are stored in JSON.
 */
function colonQuote(xs) {
    return xs.replace('$', '$$').replace(':', '$:');
}
function propsToArray(props, keyPrefix = '') {
    const ret = [];
    for (const key of Object.keys(props)) {
        // skip undefined values
        if (props[key] === undefined) {
            continue;
        }
        switch (typeof props[key]) {
            case 'object': {
                ret.push(...propsToArray(props[key], `${keyPrefix}${key}.`));
                break;
            }
            case 'string': {
                ret.push(`${keyPrefix}${key}=${colonQuote(props[key])}`);
                break;
            }
            default: {
                ret.push(`${keyPrefix}${key}=${JSON.stringify(props[key])}`);
                break;
            }
        }
    }
    ret.sort();
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRleHQtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EseUNBQXlDO0FBQ3pDLDJDQUE2QztBQUM3QywrQ0FBNEM7QUFDNUMsbUNBQWdDO0FBQ2hDLG1DQUFnQztBQStDaEM7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxlQUFlO0lBQzFCOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFnQixFQUFFLE9BQTZCOzs7Ozs7Ozs7O1FBQ2xFLE1BQU0sS0FBSyxHQUFHLGFBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFOUIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixJQUFJLElBQUk7WUFDOUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ3BFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUM7UUFFMUIsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6RCxNQUFNLElBQUksS0FBSyxDQUNiLCtDQUErQyxPQUFPLENBQUMsUUFBUSxLQUFLO2dCQUNwRSxvRkFBb0YsQ0FBQyxDQUFDO1NBQ3pGO1FBRUQsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLE9BQU87WUFDTCxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbkQsS0FBSztTQUNOLENBQUM7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QztnQkFDekQsTUFBTTthQUNQO1lBQ0QsT0FBTyxDQUFDLENBQUM7Z0JBQ1AsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzdELE1BQU07YUFDUDtTQUNGO0tBQ0Y7SUFFRCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDWCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCwgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMgfSBmcm9tICcuL2Fubm90YXRpb25zJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gJy4vdG9rZW4nO1xuXG4vKipcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHZXRDb250ZXh0S2V5T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgY29udGV4dCBwcm92aWRlciB0byBxdWVyeS5cbiAgICovXG4gIHJlYWRvbmx5IHByb3ZpZGVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVyLXNwZWNpZmljIHByb3BlcnRpZXMuXG4gICAqL1xuICByZWFkb25seSBwcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH07XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gaW5jbHVkZSB0aGUgc3RhY2sncyBhY2NvdW50IGFuZCByZWdpb24gYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5jbHVkZUVudmlyb25tZW50PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR2V0Q29udGV4dFZhbHVlT3B0aW9ucyBleHRlbmRzIEdldENvbnRleHRLZXlPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSB0byByZXR1cm4gaWYgdGhlIGNvbnRleHQgdmFsdWUgd2FzIG5vdCBmb3VuZCBhbmQgYSBtaXNzaW5nXG4gICAqIGNvbnRleHQgaXMgcmVwb3J0ZWQuIFRoaXMgc2hvdWxkIGJlIGEgZHVtbXkgdmFsdWUgdGhhdCBzaG91bGQgcHJlZmVyYWJseVxuICAgKiBmYWlsIGR1cmluZyBkZXBsb3ltZW50IHNpbmNlIGl0IHJlcHJlc2VudHMgYW4gaW52YWxpZCBzdGF0ZS5cbiAgICovXG4gIHJlYWRvbmx5IGR1bW15VmFsdWU6IGFueTtcbn1cblxuLyoqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR2V0Q29udGV4dEtleVJlc3VsdCB7XG4gIHJlYWRvbmx5IGtleTogc3RyaW5nO1xuICByZWFkb25seSBwcm9wczogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcbn1cblxuLyoqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR2V0Q29udGV4dFZhbHVlUmVzdWx0IHtcbiAgcmVhZG9ubHkgdmFsdWU/OiBhbnk7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgdGhlIG1vZGVsIHNpZGUgb2YgY29udGV4dCBwcm92aWRlcnNcbiAqXG4gKiBJbnN0YW5jZXMgb2YgdGhpcyBjbGFzcyBjb21tdW5pY2F0ZSB3aXRoIGNvbnRleHQgcHJvdmlkZXIgcGx1Z2lucyBpbiB0aGUgJ2Nka1xuICogdG9vbGtpdCcgdmlhIGNvbnRleHQgdmFyaWFibGVzIChpbnB1dCksIG91dHB1dHRpbmcgc3BlY2lhbGl6ZWQgcXVlcmllcyBmb3JcbiAqIG1vcmUgY29udGV4dCB2YXJpYWJsZXMgKG91dHB1dCkuXG4gKlxuICogQ29udGV4dFByb3ZpZGVyIG5lZWRzIGFjY2VzcyB0byBhIENvbnN0cnVjdCB0byBob29rIGludG8gdGhlIGNvbnRleHQgbWVjaGFuaXNtLlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIENvbnRleHRQcm92aWRlciB7XG4gIC8qKlxuICAgKiBAcmV0dXJucyB0aGUgY29udGV4dCBrZXkgb3IgdW5kZWZpbmVkIGlmIGEga2V5IGNhbm5vdCBiZSByZW5kZXJlZCAoZHVlIHRvIHRva2VucyB1c2VkIGluIGFueSBvZiB0aGUgcHJvcHMpXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldEtleShzY29wZTogQ29uc3RydWN0LCBvcHRpb25zOiBHZXRDb250ZXh0S2V5T3B0aW9ucyk6IEdldENvbnRleHRLZXlSZXN1bHQge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuXG4gICAgY29uc3QgcHJvcHMgPSBvcHRpb25zLmluY2x1ZGVFbnZpcm9ubWVudCA/PyB0cnVlXG4gICAgICA/IHsgYWNjb3VudDogc3RhY2suYWNjb3VudCwgcmVnaW9uOiBzdGFjay5yZWdpb24sIC4uLm9wdGlvbnMucHJvcHMgfVxuICAgICAgOiAob3B0aW9ucy5wcm9wcyA/PyB7fSk7XG5cbiAgICBpZiAoT2JqZWN0LnZhbHVlcyhwcm9wcykuZmluZCh4ID0+IFRva2VuLmlzVW5yZXNvbHZlZCh4KSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYENhbm5vdCBkZXRlcm1pbmUgc2NvcGUgZm9yIGNvbnRleHQgcHJvdmlkZXIgJHtvcHRpb25zLnByb3ZpZGVyfS5cXG5gICtcbiAgICAgICAgJ1RoaXMgdXN1YWxseSBoYXBwZW5zIHdoZW4gb25lIG9yIG1vcmUgb2YgdGhlIHByb3ZpZGVyIHByb3BzIGhhdmUgdW5yZXNvbHZlZCB0b2tlbnMnKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9wU3RyaW5ncyA9IHByb3BzVG9BcnJheShwcm9wcyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGtleTogYCR7b3B0aW9ucy5wcm92aWRlcn06JHtwcm9wU3RyaW5ncy5qb2luKCc6Jyl9YCxcbiAgICAgIHByb3BzLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldFZhbHVlKHNjb3BlOiBDb25zdHJ1Y3QsIG9wdGlvbnM6IEdldENvbnRleHRWYWx1ZU9wdGlvbnMpOiBHZXRDb250ZXh0VmFsdWVSZXN1bHQge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuXG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChzdGFjay5hY2NvdW50KSB8fCBUb2tlbi5pc1VucmVzb2x2ZWQoc3RhY2sucmVnaW9uKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcmV0cmlldmUgdmFsdWUgZnJvbSBjb250ZXh0IHByb3ZpZGVyICR7b3B0aW9ucy5wcm92aWRlcn0gc2luY2UgYWNjb3VudC9yZWdpb24gYCArXG4gICAgICAgICAgICAgICAgICAgICAgJ2FyZSBub3Qgc3BlY2lmaWVkIGF0IHRoZSBzdGFjayBsZXZlbC4gQ29uZmlndXJlIFwiZW52XCIgd2l0aCBhbiBhY2NvdW50IGFuZCByZWdpb24gd2hlbiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAneW91IGRlZmluZSB5b3VyIHN0YWNrLicgK1xuICAgICAgICAgICAgICAgICAgICAgICdTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9sYXRlc3QvZ3VpZGUvZW52aXJvbm1lbnRzLmh0bWwgZm9yIG1vcmUgZGV0YWlscy4nKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IGtleSwgcHJvcHMgfSA9IHRoaXMuZ2V0S2V5KHNjb3BlLCBvcHRpb25zKTtcbiAgICBjb25zdCB2YWx1ZSA9IE5vZGUub2Yoc2NvcGUpLnRyeUdldENvbnRleHQoa2V5KTtcbiAgICBjb25zdCBwcm92aWRlckVycm9yID0gZXh0cmFjdFByb3ZpZGVyRXJyb3IodmFsdWUpO1xuXG4gICAgLy8gaWYgY29udGV4dCBpcyBtaXNzaW5nIG9yIGFuIGVycm9yIG9jY3VycmVkIGR1cmluZyBjb250ZXh0IHJldHJpZXZhbCxcbiAgICAvLyByZXBvcnQgYW5kIHJldHVybiBhIGR1bW15IHZhbHVlLlxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHByb3ZpZGVyRXJyb3IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc3RhY2sucmVwb3J0TWlzc2luZ0NvbnRleHRLZXkoe1xuICAgICAgICBrZXksXG4gICAgICAgIHByb3ZpZGVyOiBvcHRpb25zLnByb3ZpZGVyIGFzIGN4c2NoZW1hLkNvbnRleHRQcm92aWRlcixcbiAgICAgICAgcHJvcHM6IHByb3BzIGFzIGN4c2NoZW1hLkNvbnRleHRRdWVyeVByb3BlcnRpZXMsXG4gICAgICB9KTtcblxuICAgICAgaWYgKHByb3ZpZGVyRXJyb3IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBBbm5vdGF0aW9ucy5vZihzY29wZSkuYWRkRXJyb3IocHJvdmlkZXJFcnJvcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7IHZhbHVlOiBvcHRpb25zLmR1bW15VmFsdWUgfTtcbiAgICB9XG5cbiAgICByZXR1cm4geyB2YWx1ZSB9O1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHsgfVxufVxuXG4vKipcbiAqIElmIHRoZSBjb250ZXh0IHZhbHVlIHJlcHJlc2VudHMgYW4gZXJyb3IsIHJldHVybiB0aGUgZXJyb3IgbWVzc2FnZVxuICovXG5mdW5jdGlvbiBleHRyYWN0UHJvdmlkZXJFcnJvcih2YWx1ZTogYW55KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWVbY3hhcGkuUFJPVklERVJfRVJST1JfS0VZXTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFF1b3RlIGNvbG9ucyBpbiBhbGwgc3RyaW5ncyBzbyB0aGF0IHdlIGNhbiB1bmRvIHRoZSBxdW90aW5nIGF0IGEgbGF0ZXIgcG9pbnRcbiAqXG4gKiBXZSdsbCB1c2UgJCBhcyBhIHF1b3RpbmcgY2hhcmFjdGVyLCBmb3Igbm8gcGFydGljdWxhcmx5IGdvb2QgcmVhc29uIG90aGVyXG4gKiB0aGFuIHRoYXQgXFwgaXMgZ29pbmcgdG8gbGVhZCB0byBxdW90aW5nIGhlbGwgd2hlbiB0aGUga2V5cyBhcmUgc3RvcmVkIGluIEpTT04uXG4gKi9cbmZ1bmN0aW9uIGNvbG9uUXVvdGUoeHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB4cy5yZXBsYWNlKCckJywgJyQkJykucmVwbGFjZSgnOicsICckOicpO1xufVxuXG5mdW5jdGlvbiBwcm9wc1RvQXJyYXkocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9LCBrZXlQcmVmaXggPSAnJyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgcmV0OiBzdHJpbmdbXSA9IFtdO1xuXG4gIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHByb3BzKSkge1xuICAgIC8vIHNraXAgdW5kZWZpbmVkIHZhbHVlc1xuICAgIGlmIChwcm9wc1trZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHN3aXRjaCAodHlwZW9mIHByb3BzW2tleV0pIHtcbiAgICAgIGNhc2UgJ29iamVjdCc6IHtcbiAgICAgICAgcmV0LnB1c2goLi4ucHJvcHNUb0FycmF5KHByb3BzW2tleV0sIGAke2tleVByZWZpeH0ke2tleX0uYCkpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3N0cmluZyc6IHtcbiAgICAgICAgcmV0LnB1c2goYCR7a2V5UHJlZml4fSR7a2V5fT0ke2NvbG9uUXVvdGUocHJvcHNba2V5XSl9YCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZXQucHVzaChgJHtrZXlQcmVmaXh9JHtrZXl9PSR7SlNPTi5zdHJpbmdpZnkocHJvcHNba2V5XSl9YCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldC5zb3J0KCk7XG4gIHJldHVybiByZXQ7XG59XG4iXX0=