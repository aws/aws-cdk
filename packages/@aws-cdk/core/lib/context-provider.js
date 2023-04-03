"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextProvider = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRleHQtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EseUNBQXlDO0FBQ3pDLDJDQUE2QztBQUM3QywrQ0FBNEM7QUFDNUMsbUNBQWdDO0FBQ2hDLG1DQUFnQztBQStDaEM7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxlQUFlO0lBQzFCOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFnQixFQUFFLE9BQTZCO1FBQ2xFLE1BQU0sS0FBSyxHQUFHLGFBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFOUIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixJQUFJLElBQUk7WUFDOUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ3BFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUM7UUFFMUIsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGFBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6RCxNQUFNLElBQUksS0FBSyxDQUNiLCtDQUErQyxPQUFPLENBQUMsUUFBUSxLQUFLO2dCQUNwRSxvRkFBb0YsQ0FBQyxDQUFDO1NBQ3pGO1FBRUQsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLE9BQU87WUFDTCxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbkQsS0FBSztTQUNOLENBQUM7SUFDSixDQUFDO0lB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QUN6RCxNQUFNO2FBQ1A7WUFDRCxPQUFPLENBQUMsQ0FBQztnQkFDUCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0QsTUFBTTthQUNQO1NBQ0Y7S0FDRjtJQUVELEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNYLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucyB9IGZyb20gJy4vYW5ub3RhdGlvbnMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi90b2tlbic7XG5cbi8qKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdldENvbnRleHRLZXlPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBjb250ZXh0IHByb3ZpZGVyIHRvIHF1ZXJ5LlxuICAgKi9cbiAgcmVhZG9ubHkgcHJvdmlkZXI6IHN0cmluZztcblxuICAvKipcbiAgICogUHJvdmlkZXItc3BlY2lmaWMgcHJvcGVydGllcy5cbiAgICovXG4gIHJlYWRvbmx5IHByb3BzPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcblxuICAvKipcbiAgICogV2hldGhlciB0byBpbmNsdWRlIHRoZSBzdGFjaydzIGFjY291bnQgYW5kIHJlZ2lvbiBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBpbmNsdWRlRW52aXJvbm1lbnQ/OiBib29sZWFuO1xufVxuXG4vKipcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHZXRDb250ZXh0VmFsdWVPcHRpb25zIGV4dGVuZHMgR2V0Q29udGV4dEtleU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHZhbHVlIHRvIHJldHVybiBpZiB0aGUgY29udGV4dCB2YWx1ZSB3YXMgbm90IGZvdW5kIGFuZCBhIG1pc3NpbmdcbiAgICogY29udGV4dCBpcyByZXBvcnRlZC4gVGhpcyBzaG91bGQgYmUgYSBkdW1teSB2YWx1ZSB0aGF0IHNob3VsZCBwcmVmZXJhYmx5XG4gICAqIGZhaWwgZHVyaW5nIGRlcGxveW1lbnQgc2luY2UgaXQgcmVwcmVzZW50cyBhbiBpbnZhbGlkIHN0YXRlLlxuICAgKi9cbiAgcmVhZG9ubHkgZHVtbXlWYWx1ZTogYW55O1xufVxuXG4vKipcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHZXRDb250ZXh0S2V5UmVzdWx0IHtcbiAgcmVhZG9ubHkga2V5OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHByb3BzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xufVxuXG4vKipcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHZXRDb250ZXh0VmFsdWVSZXN1bHQge1xuICByZWFkb25seSB2YWx1ZT86IGFueTtcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciB0aGUgbW9kZWwgc2lkZSBvZiBjb250ZXh0IHByb3ZpZGVyc1xuICpcbiAqIEluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIGNvbW11bmljYXRlIHdpdGggY29udGV4dCBwcm92aWRlciBwbHVnaW5zIGluIHRoZSAnY2RrXG4gKiB0b29sa2l0JyB2aWEgY29udGV4dCB2YXJpYWJsZXMgKGlucHV0KSwgb3V0cHV0dGluZyBzcGVjaWFsaXplZCBxdWVyaWVzIGZvclxuICogbW9yZSBjb250ZXh0IHZhcmlhYmxlcyAob3V0cHV0KS5cbiAqXG4gKiBDb250ZXh0UHJvdmlkZXIgbmVlZHMgYWNjZXNzIHRvIGEgQ29uc3RydWN0IHRvIGhvb2sgaW50byB0aGUgY29udGV4dCBtZWNoYW5pc20uXG4gKlxuICovXG5leHBvcnQgY2xhc3MgQ29udGV4dFByb3ZpZGVyIHtcbiAgLyoqXG4gICAqIEByZXR1cm5zIHRoZSBjb250ZXh0IGtleSBvciB1bmRlZmluZWQgaWYgYSBrZXkgY2Fubm90IGJlIHJlbmRlcmVkIChkdWUgdG8gdG9rZW5zIHVzZWQgaW4gYW55IG9mIHRoZSBwcm9wcylcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0S2V5KHNjb3BlOiBDb25zdHJ1Y3QsIG9wdGlvbnM6IEdldENvbnRleHRLZXlPcHRpb25zKTogR2V0Q29udGV4dEtleVJlc3VsdCB7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihzY29wZSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IG9wdGlvbnMuaW5jbHVkZUVudmlyb25tZW50ID8/IHRydWVcbiAgICAgID8geyBhY2NvdW50OiBzdGFjay5hY2NvdW50LCByZWdpb246IHN0YWNrLnJlZ2lvbiwgLi4ub3B0aW9ucy5wcm9wcyB9XG4gICAgICA6IChvcHRpb25zLnByb3BzID8/IHt9KTtcblxuICAgIGlmIChPYmplY3QudmFsdWVzKHByb3BzKS5maW5kKHggPT4gVG9rZW4uaXNVbnJlc29sdmVkKHgpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgQ2Fubm90IGRldGVybWluZSBzY29wZSBmb3IgY29udGV4dCBwcm92aWRlciAke29wdGlvbnMucHJvdmlkZXJ9LlxcbmAgK1xuICAgICAgICAnVGhpcyB1c3VhbGx5IGhhcHBlbnMgd2hlbiBvbmUgb3IgbW9yZSBvZiB0aGUgcHJvdmlkZXIgcHJvcHMgaGF2ZSB1bnJlc29sdmVkIHRva2VucycpO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3BTdHJpbmdzID0gcHJvcHNUb0FycmF5KHByb3BzKTtcbiAgICByZXR1cm4ge1xuICAgICAga2V5OiBgJHtvcHRpb25zLnByb3ZpZGVyfToke3Byb3BTdHJpbmdzLmpvaW4oJzonKX1gLFxuICAgICAgcHJvcHMsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0VmFsdWUoc2NvcGU6IENvbnN0cnVjdCwgb3B0aW9uczogR2V0Q29udGV4dFZhbHVlT3B0aW9ucyk6IEdldENvbnRleHRWYWx1ZVJlc3VsdCB7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihzY29wZSk7XG5cbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHN0YWNrLmFjY291bnQpIHx8IFRva2VuLmlzVW5yZXNvbHZlZChzdGFjay5yZWdpb24pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZXRyaWV2ZSB2YWx1ZSBmcm9tIGNvbnRleHQgcHJvdmlkZXIgJHtvcHRpb25zLnByb3ZpZGVyfSBzaW5jZSBhY2NvdW50L3JlZ2lvbiBgICtcbiAgICAgICAgICAgICAgICAgICAgICAnYXJlIG5vdCBzcGVjaWZpZWQgYXQgdGhlIHN0YWNrIGxldmVsLiBDb25maWd1cmUgXCJlbnZcIiB3aXRoIGFuIGFjY291bnQgYW5kIHJlZ2lvbiB3aGVuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICd5b3UgZGVmaW5lIHlvdXIgc3RhY2suJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ1NlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2xhdGVzdC9ndWlkZS9lbnZpcm9ubWVudHMuaHRtbCBmb3IgbW9yZSBkZXRhaWxzLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHsga2V5LCBwcm9wcyB9ID0gdGhpcy5nZXRLZXkoc2NvcGUsIG9wdGlvbnMpO1xuICAgIGNvbnN0IHZhbHVlID0gTm9kZS5vZihzY29wZSkudHJ5R2V0Q29udGV4dChrZXkpO1xuICAgIGNvbnN0IHByb3ZpZGVyRXJyb3IgPSBleHRyYWN0UHJvdmlkZXJFcnJvcih2YWx1ZSk7XG5cbiAgICAvLyBpZiBjb250ZXh0IGlzIG1pc3Npbmcgb3IgYW4gZXJyb3Igb2NjdXJyZWQgZHVyaW5nIGNvbnRleHQgcmV0cmlldmFsLFxuICAgIC8vIHJlcG9ydCBhbmQgcmV0dXJuIGEgZHVtbXkgdmFsdWUuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgcHJvdmlkZXJFcnJvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdGFjay5yZXBvcnRNaXNzaW5nQ29udGV4dEtleSh7XG4gICAgICAgIGtleSxcbiAgICAgICAgcHJvdmlkZXI6IG9wdGlvbnMucHJvdmlkZXIgYXMgY3hzY2hlbWEuQ29udGV4dFByb3ZpZGVyLFxuICAgICAgICBwcm9wczogcHJvcHMgYXMgY3hzY2hlbWEuQ29udGV4dFF1ZXJ5UHJvcGVydGllcyxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocHJvdmlkZXJFcnJvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIEFubm90YXRpb25zLm9mKHNjb3BlKS5hZGRFcnJvcihwcm92aWRlckVycm9yKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgdmFsdWU6IG9wdGlvbnMuZHVtbXlWYWx1ZSB9O1xuICAgIH1cblxuICAgIHJldHVybiB7IHZhbHVlIH07XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkgeyB9XG59XG5cbi8qKlxuICogSWYgdGhlIGNvbnRleHQgdmFsdWUgcmVwcmVzZW50cyBhbiBlcnJvciwgcmV0dXJuIHRoZSBlcnJvciBtZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RQcm92aWRlckVycm9yKHZhbHVlOiBhbnkpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZVtjeGFwaS5QUk9WSURFUl9FUlJPUl9LRVldO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogUXVvdGUgY29sb25zIGluIGFsbCBzdHJpbmdzIHNvIHRoYXQgd2UgY2FuIHVuZG8gdGhlIHF1b3RpbmcgYXQgYSBsYXRlciBwb2ludFxuICpcbiAqIFdlJ2xsIHVzZSAkIGFzIGEgcXVvdGluZyBjaGFyYWN0ZXIsIGZvciBubyBwYXJ0aWN1bGFybHkgZ29vZCByZWFzb24gb3RoZXJcbiAqIHRoYW4gdGhhdCBcXCBpcyBnb2luZyB0byBsZWFkIHRvIHF1b3RpbmcgaGVsbCB3aGVuIHRoZSBrZXlzIGFyZSBzdG9yZWQgaW4gSlNPTi5cbiAqL1xuZnVuY3Rpb24gY29sb25RdW90ZSh4czogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHhzLnJlcGxhY2UoJyQnLCAnJCQnKS5yZXBsYWNlKCc6JywgJyQ6Jyk7XG59XG5cbmZ1bmN0aW9uIHByb3BzVG9BcnJheShwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0sIGtleVByZWZpeCA9ICcnKTogc3RyaW5nW10ge1xuICBjb25zdCByZXQ6IHN0cmluZ1tdID0gW107XG5cbiAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMocHJvcHMpKSB7XG4gICAgLy8gc2tpcCB1bmRlZmluZWQgdmFsdWVzXG4gICAgaWYgKHByb3BzW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgc3dpdGNoICh0eXBlb2YgcHJvcHNba2V5XSkge1xuICAgICAgY2FzZSAnb2JqZWN0Jzoge1xuICAgICAgICByZXQucHVzaCguLi5wcm9wc1RvQXJyYXkocHJvcHNba2V5XSwgYCR7a2V5UHJlZml4fSR7a2V5fS5gKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnc3RyaW5nJzoge1xuICAgICAgICByZXQucHVzaChgJHtrZXlQcmVmaXh9JHtrZXl9PSR7Y29sb25RdW90ZShwcm9wc1trZXldKX1gKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldC5wdXNoKGAke2tleVByZWZpeH0ke2tleX09JHtKU09OLnN0cmluZ2lmeShwcm9wc1trZXldKX1gKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0LnNvcnQoKTtcbiAgcmV0dXJuIHJldDtcbn1cbiJdfQ==