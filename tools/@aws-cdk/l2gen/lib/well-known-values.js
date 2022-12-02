"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stackToJsonString = exports.splitSelect = exports.definedOrElse = exports.invoke = exports.ifDefinedAny = exports.ifDefined = exports.renderDuration = exports.UNDEFINED = exports.FALSE = exports.TRUE = exports.arrayVal = exports.jsVal = void 0;
const value_1 = require("./value");
const well_known_types_1 = require("./well-known-types");
const cm2_1 = require("./cm2");
const type_1 = require("./type");
function jsVal(x) {
    const type = (() => {
        switch (typeof x) {
            case 'boolean': return type_1.BOOLEAN;
            case 'string': return type_1.STRING;
            case 'number': return type_1.NUMBER;
            default: throw new Error(`Don't have type object for ${typeof x}`);
        }
    })();
    return {
        type,
        render(code) {
            code.add(JSON.stringify(x));
        },
        toString: () => JSON.stringify(x),
    };
}
exports.jsVal = jsVal;
function arrayVal(xs) {
    return {
        type: type_1.ANY,
        render(code) {
            code.add('[', ...cm2_1.interleave(', ', xs), ']');
        },
        toString: () => JSON.stringify(xs),
    };
}
exports.arrayVal = arrayVal;
exports.TRUE = jsVal(true);
exports.FALSE = jsVal(false);
exports.UNDEFINED = value_1.litVal('undefined');
function renderDuration(v, style) {
    if (v.type !== well_known_types_1.DURATION) {
        throw new Error(`Expecting a Duration, got ${v.type}`);
    }
    return {
        type: well_known_types_1.DURATION,
        toString() { return `${v}.${style}()`; },
        render(code) {
            code.add(v, `.${style}()`);
        },
    };
}
exports.renderDuration = renderDuration;
function ifDefined(c, v, otherwise = exports.UNDEFINED) {
    return {
        type: v.type,
        toString() { return `conditional ${v}`; },
        render(code) {
            code.add(c, ' !== undefined ? ', v, ' : ', otherwise);
        },
    };
}
exports.ifDefined = ifDefined;
function ifDefinedAny(cs, v, otherwise = exports.UNDEFINED) {
    return {
        type: v.type,
        toString() { return `conditional ${v}`; },
        render(code) {
            let first = true;
            for (const c of cs) {
                if (!first) {
                    code.add(' || ');
                }
                first = false;
                code.add(c, ' !== undefined');
            }
            code.add(' ? ', v, ' : ', otherwise);
        },
    };
}
exports.ifDefinedAny = ifDefinedAny;
function invoke(fn) {
    return {
        type: type_1.ANY,
        toString() { return `${fn}()`; },
        render(code) {
            code.add(fn, '()');
        },
    };
}
exports.invoke = invoke;
function definedOrElse(v, otherwise) {
    return {
        type: v.type,
        toString() { return `conditional ${v}`; },
        render(code) {
            code.add(v, ' ?? ', otherwise);
        },
    };
}
exports.definedOrElse = definedOrElse;
function splitSelect(sep, fieldNr, value) {
    if (fieldNr === undefined) {
        return value;
    }
    return well_known_types_1.FN.callExp('select')(jsVal(fieldNr), well_known_types_1.FN.callExp('split')(jsVal(sep), value));
}
exports.splitSelect = splitSelect;
function stackToJsonString(x) {
    return well_known_types_1.TOKENIZATION.callExp('toJsonString')(x);
}
exports.stackToJsonString = stackToJsonString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VsbC1rbm93bi12YWx1ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3ZWxsLWtub3duLXZhbHVlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBeUM7QUFDekMseURBQWdFO0FBQ2hFLCtCQUErRDtBQUMvRCxpQ0FBNkQ7QUFFN0QsU0FBZ0IsS0FBSyxDQUFDLENBQU07SUFDMUIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFVLEVBQUU7UUFDeEIsUUFBUSxPQUFPLENBQUMsRUFBRTtZQUNoQixLQUFLLFNBQVMsQ0FBQyxDQUFDLE9BQU8sY0FBTyxDQUFDO1lBQy9CLEtBQUssUUFBUSxDQUFDLENBQUMsT0FBTyxhQUFNLENBQUM7WUFDN0IsS0FBSyxRQUFRLENBQUMsQ0FBQyxPQUFPLGFBQU0sQ0FBQztZQUM3QixPQUFPLENBQUMsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDcEU7SUFDSCxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRUwsT0FBTztRQUNMLElBQUk7UUFDSixNQUFNLENBQUMsSUFBSTtZQUNULElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFDRCxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7S0FDbEMsQ0FBQztBQUNKLENBQUM7QUFqQkQsc0JBaUJDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLEVBQWM7SUFDckMsT0FBTztRQUNMLElBQUksRUFBRSxVQUFHO1FBQ1QsTUFBTSxDQUFDLElBQUk7WUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLGdCQUFVLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDRCxRQUFRLEVBQUUsR0FBRyxFQUFF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