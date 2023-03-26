"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateCFN = void 0;
/**
 * Simple function to evaluate CloudFormation intrinsics.
 *
 * Note that this function is not production quality, it exists to support tests.
 */
const cloudformation_lang_1 = require("../lib/private/cloudformation-lang");
function evaluateCFN(object, context = {}) {
    const intrinsicFns = {
        'Fn::Join'(separator, args) {
            if (typeof separator !== 'string') {
                // CFN does not support expressions here!
                throw new Error('\'separator\' argument of { Fn::Join } must be a string literal');
            }
            return evaluate(args).map(evaluate).join(separator);
        },
        'Fn::Split'(separator, args) {
            if (typeof separator !== 'string') {
                // CFN does not support expressions here!
                throw new Error('\'separator\' argument of { Fn::Split } must be a string literal');
            }
            return evaluate(args).split(separator);
        },
        'Fn::Select'(index, args) {
            return evaluate(args).map(evaluate)[index];
        },
        'Ref'(logicalId) {
            if (!(logicalId in context)) {
                throw new Error(`Trying to evaluate Ref of '${logicalId}' but not in context!`);
            }
            return context[logicalId];
        },
        'Fn::GetAtt'(logicalId, attributeName) {
            const key = `${logicalId}.${attributeName}`;
            if (!(key in context)) {
                throw new Error(`Trying to evaluate Fn::GetAtt of '${logicalId}.${attributeName}' but not in context!`);
            }
            return context[key];
        },
        'Fn::Sub'(template, explicitPlaceholders) {
            const placeholders = explicitPlaceholders ? evaluate(explicitPlaceholders) : context;
            if (typeof template !== 'string') {
                throw new Error('The first argument to {Fn::Sub} must be a string literal (cannot be the result of an expression)');
            }
            return template.replace(/\$\{([a-zA-Z0-9.:-]*)\}/g, (_, key) => {
                if (key in placeholders) {
                    return placeholders[key];
                }
                throw new Error(`Unknown placeholder in Fn::Sub: ${key}`);
            });
        },
    };
    return evaluate(object);
    function evaluate(obj) {
        if (Array.isArray(obj)) {
            return obj.map(evaluate);
        }
        if (typeof obj === 'object') {
            const intrinsic = parseIntrinsic(obj);
            if (intrinsic) {
                return evaluateIntrinsic(intrinsic);
            }
            const ret = {};
            for (const key of Object.keys(obj)) {
                ret[key] = evaluate(obj[key]);
            }
            return ret;
        }
        return obj;
    }
    function evaluateIntrinsic(intrinsic) {
        if (!(intrinsic.name in intrinsicFns)) {
            throw new Error(`Intrinsic ${intrinsic.name} not supported here`);
        }
        const argsAsArray = Array.isArray(intrinsic.args) ? intrinsic.args : [intrinsic.args];
        return intrinsicFns[intrinsic.name].apply(intrinsicFns, argsAsArray);
    }
}
exports.evaluateCFN = evaluateCFN;
function parseIntrinsic(x) {
    if (typeof x !== 'object' || x === null) {
        return undefined;
    }
    const keys = Object.keys(x);
    if (keys.length === 1 && ((0, cloudformation_lang_1.isNameOfCloudFormationIntrinsic)(keys[0]) || keys[0] === 'Ref')) {
        return {
            name: keys[0],
            args: x[keys[0]],
        };
    }
    return undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZhbHVhdGUtY2ZuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXZhbHVhdGUtY2ZuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7O0dBSUc7QUFDSCw0RUFBcUY7QUFFckYsU0FBZ0IsV0FBVyxDQUFDLE1BQVcsRUFBRSxVQUFtQyxFQUFFO0lBQzVFLE1BQU0sWUFBWSxHQUFRO1FBQ3hCLFVBQVUsQ0FBQyxTQUFpQixFQUFFLElBQWM7WUFDMUMsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLEVBQUU7Z0JBQ2pDLHlDQUF5QztnQkFDekMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO2FBQ3BGO1lBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNyRDtRQUVELFdBQVcsQ0FBQyxTQUFpQixFQUFFLElBQVM7WUFDdEMsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLEVBQUU7Z0JBQ2pDLHlDQUF5QztnQkFDekMsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO2FBQ3JGO1lBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsWUFBWSxDQUFDLEtBQWEsRUFBRSxJQUFTO1lBQ25DLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1QztRQUVELEtBQUssQ0FBQyxTQUFpQjtZQUNyQixJQUFJLENBQUMsQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLEVBQUU7Z0JBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLFNBQVMsdUJBQXVCLENBQUMsQ0FBQzthQUNqRjtZQUNELE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzNC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QUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFBLHFEQUErQixFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtRQUN4RixPQUFPO1lBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQixDQUFDO0tBQ0g7SUFDRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTaW1wbGUgZnVuY3Rpb24gdG8gZXZhbHVhdGUgQ2xvdWRGb3JtYXRpb24gaW50cmluc2ljcy5cbiAqXG4gKiBOb3RlIHRoYXQgdGhpcyBmdW5jdGlvbiBpcyBub3QgcHJvZHVjdGlvbiBxdWFsaXR5LCBpdCBleGlzdHMgdG8gc3VwcG9ydCB0ZXN0cy5cbiAqL1xuaW1wb3J0IHsgaXNOYW1lT2ZDbG91ZEZvcm1hdGlvbkludHJpbnNpYyB9IGZyb20gJy4uL2xpYi9wcml2YXRlL2Nsb3VkZm9ybWF0aW9uLWxhbmcnO1xuXG5leHBvcnQgZnVuY3Rpb24gZXZhbHVhdGVDRk4ob2JqZWN0OiBhbnksIGNvbnRleHQ6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge30pOiBhbnkge1xuICBjb25zdCBpbnRyaW5zaWNGbnM6IGFueSA9IHtcbiAgICAnRm46OkpvaW4nKHNlcGFyYXRvcjogc3RyaW5nLCBhcmdzOiBzdHJpbmdbXSkge1xuICAgICAgaWYgKHR5cGVvZiBzZXBhcmF0b3IgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIENGTiBkb2VzIG5vdCBzdXBwb3J0IGV4cHJlc3Npb25zIGhlcmUhXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXFwnc2VwYXJhdG9yXFwnIGFyZ3VtZW50IG9mIHsgRm46OkpvaW4gfSBtdXN0IGJlIGEgc3RyaW5nIGxpdGVyYWwnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBldmFsdWF0ZShhcmdzKS5tYXAoZXZhbHVhdGUpLmpvaW4oc2VwYXJhdG9yKTtcbiAgICB9LFxuXG4gICAgJ0ZuOjpTcGxpdCcoc2VwYXJhdG9yOiBzdHJpbmcsIGFyZ3M6IGFueSkge1xuICAgICAgaWYgKHR5cGVvZiBzZXBhcmF0b3IgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIENGTiBkb2VzIG5vdCBzdXBwb3J0IGV4cHJlc3Npb25zIGhlcmUhXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXFwnc2VwYXJhdG9yXFwnIGFyZ3VtZW50IG9mIHsgRm46OlNwbGl0IH0gbXVzdCBiZSBhIHN0cmluZyBsaXRlcmFsJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXZhbHVhdGUoYXJncykuc3BsaXQoc2VwYXJhdG9yKTtcbiAgICB9LFxuXG4gICAgJ0ZuOjpTZWxlY3QnKGluZGV4OiBudW1iZXIsIGFyZ3M6IGFueSkge1xuICAgICAgcmV0dXJuIGV2YWx1YXRlKGFyZ3MpLm1hcChldmFsdWF0ZSlbaW5kZXhdO1xuICAgIH0sXG5cbiAgICAnUmVmJyhsb2dpY2FsSWQ6IHN0cmluZykge1xuICAgICAgaWYgKCEobG9naWNhbElkIGluIGNvbnRleHQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVHJ5aW5nIHRvIGV2YWx1YXRlIFJlZiBvZiAnJHtsb2dpY2FsSWR9JyBidXQgbm90IGluIGNvbnRleHQhYCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGV4dFtsb2dpY2FsSWRdO1xuICAgIH0sXG5cbiAgICAnRm46OkdldEF0dCcobG9naWNhbElkOiBzdHJpbmcsIGF0dHJpYnV0ZU5hbWU6IHN0cmluZykge1xuICAgICAgY29uc3Qga2V5ID0gYCR7bG9naWNhbElkfS4ke2F0dHJpYnV0ZU5hbWV9YDtcbiAgICAgIGlmICghKGtleSBpbiBjb250ZXh0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRyeWluZyB0byBldmFsdWF0ZSBGbjo6R2V0QXR0IG9mICcke2xvZ2ljYWxJZH0uJHthdHRyaWJ1dGVOYW1lfScgYnV0IG5vdCBpbiBjb250ZXh0IWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRleHRba2V5XTtcbiAgICB9LFxuXG4gICAgJ0ZuOjpTdWInKHRlbXBsYXRlOiBzdHJpbmcsIGV4cGxpY2l0UGxhY2Vob2xkZXJzPzogUmVjb3JkPHN0cmluZywgc3RyaW5nPikge1xuICAgICAgY29uc3QgcGxhY2Vob2xkZXJzID0gZXhwbGljaXRQbGFjZWhvbGRlcnMgPyBldmFsdWF0ZShleHBsaWNpdFBsYWNlaG9sZGVycykgOiBjb250ZXh0O1xuXG4gICAgICBpZiAodHlwZW9mIHRlbXBsYXRlICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBmaXJzdCBhcmd1bWVudCB0byB7Rm46OlN1Yn0gbXVzdCBiZSBhIHN0cmluZyBsaXRlcmFsIChjYW5ub3QgYmUgdGhlIHJlc3VsdCBvZiBhbiBleHByZXNzaW9uKScpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZSgvXFwkXFx7KFthLXpBLVowLTkuOi1dKilcXH0vZywgKF86IHN0cmluZywga2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKGtleSBpbiBwbGFjZWhvbGRlcnMpIHsgcmV0dXJuIHBsYWNlaG9sZGVyc1trZXldOyB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBwbGFjZWhvbGRlciBpbiBGbjo6U3ViOiAke2tleX1gKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIGV2YWx1YXRlKG9iamVjdCk7XG5cbiAgZnVuY3Rpb24gZXZhbHVhdGUob2JqOiBhbnkpOiBhbnkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgIHJldHVybiBvYmoubWFwKGV2YWx1YXRlKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnN0IGludHJpbnNpYyA9IHBhcnNlSW50cmluc2ljKG9iaik7XG4gICAgICBpZiAoaW50cmluc2ljKSB7XG4gICAgICAgIHJldHVybiBldmFsdWF0ZUludHJpbnNpYyhpbnRyaW5zaWMpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXQ6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge307XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG4gICAgICAgIHJldFtrZXldID0gZXZhbHVhdGUob2JqW2tleV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgZnVuY3Rpb24gZXZhbHVhdGVJbnRyaW5zaWMoaW50cmluc2ljOiBJbnRyaW5zaWMpIHtcbiAgICBpZiAoIShpbnRyaW5zaWMubmFtZSBpbiBpbnRyaW5zaWNGbnMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludHJpbnNpYyAke2ludHJpbnNpYy5uYW1lfSBub3Qgc3VwcG9ydGVkIGhlcmVgKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcmdzQXNBcnJheSA9IEFycmF5LmlzQXJyYXkoaW50cmluc2ljLmFyZ3MpID8gaW50cmluc2ljLmFyZ3MgOiBbaW50cmluc2ljLmFyZ3NdO1xuXG4gICAgcmV0dXJuIGludHJpbnNpY0Zuc1tpbnRyaW5zaWMubmFtZV0uYXBwbHkoaW50cmluc2ljRm5zLCBhcmdzQXNBcnJheSk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIEludHJpbnNpYyB7XG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgYXJnczogYW55O1xufVxuXG5mdW5jdGlvbiBwYXJzZUludHJpbnNpYyh4OiBhbnkpOiBJbnRyaW5zaWMgfCB1bmRlZmluZWQge1xuICBpZiAodHlwZW9mIHggIT09ICdvYmplY3QnIHx8IHggPT09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoeCk7XG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMSAmJiAoaXNOYW1lT2ZDbG91ZEZvcm1hdGlvbkludHJpbnNpYyhrZXlzWzBdKSB8fCBrZXlzWzBdID09PSAnUmVmJykpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZToga2V5c1swXSxcbiAgICAgIGFyZ3M6IHhba2V5c1swXV0sXG4gICAgfTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufSJdfQ==