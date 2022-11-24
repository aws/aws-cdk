"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumMapping = exports.definedOrElse = exports.ifDefinedAny = exports.ifDefined = exports.renderDuration = exports.UNDEFINED = exports.FALSE = exports.TRUE = exports.literalValue = exports.javascriptValue = void 0;
const well_known_types_1 = require("./well-known-types");
const cm2_1 = require("./cm2");
function javascriptValue(x) {
    const type = (() => {
        switch (typeof x) {
            case 'boolean': return well_known_types_1.BOOLEAN;
            case 'string': return well_known_types_1.STRING;
            case 'number': return well_known_types_1.NUMBER;
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
exports.javascriptValue = javascriptValue;
function literalValue(x, type = well_known_types_1.ANY) {
    return {
        type,
        render(code) {
            code.add(x);
        },
        toString: () => x,
    };
}
exports.literalValue = literalValue;
exports.TRUE = javascriptValue(true);
exports.FALSE = javascriptValue(false);
exports.UNDEFINED = literalValue('undefined');
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
function enumMapping(mapping) {
    if (mapping.length === 0) {
        throw new Error('Mapping is empty');
    }
    const enumType = mapping[0][0].type;
    if (!mapping.every(([v, _]) => v.type === enumType)) {
        throw new Error('All enums in mapping must be from the same type');
    }
    const functionName = `${enumType.typeRefName}ToCloudFormation`;
    // FIXME: Exhaustiveness check?
    const renderFn = new cm2_1.HelperFunction(functionName, code => {
        code.openBlock('function ', functionName, '(x: ', enumType, '): string');
        code.openBlock('switch (x)');
        for (const [enumMember, str] of mapping) {
            code.line('case ', enumMember, ': return ', JSON.stringify(str), ';');
        }
        code.closeBlock(); // switch
        code.closeBlock();
    });
    return (value) => ({
        type: well_known_types_1.STRING,
        toString: () => `${functionName}(${value})`,
        render(code) {
            code.addHelper(renderFn);
            code.add(functionName, '(', value, ')');
        },
    });
}
exports.enumMapping = enumMapping;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VsbC1rbm93bi12YWx1ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3ZWxsLWtub3duLXZhbHVlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx5REFBNEU7QUFDNUUsK0JBQTRDO0FBRzVDLFNBQWdCLGVBQWUsQ0FBQyxDQUFNO0lBQ3BDLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBVSxFQUFFO1FBQ3hCLFFBQVEsT0FBTyxDQUFDLEVBQUU7WUFDaEIsS0FBSyxTQUFTLENBQUMsQ0FBQyxPQUFPLDBCQUFPLENBQUM7WUFDL0IsS0FBSyxRQUFRLENBQUMsQ0FBQyxPQUFPLHlCQUFNLENBQUM7WUFDN0IsS0FBSyxRQUFRLENBQUMsQ0FBQyxPQUFPLHlCQUFNLENBQUM7WUFDN0IsT0FBTyxDQUFDLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3BFO0lBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUVMLE9BQU87UUFDTCxJQUFJO1FBQ0osTUFBTSxDQUFDLElBQUk7WUFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBQ0QsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0tBQ2xDLENBQUM7QUFDSixDQUFDO0FBakJELDBDQWlCQztBQUVELFNBQWdCLFlBQVksQ0FBQyxDQUFTLEVBQUUsT0FBYyxzQkFBRztJQUN2RCxPQUFPO1FBQ0wsSUFBSTtRQUNKLE1BQU0sQ0FBQyxJQUFJO1lBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUM7UUFDRCxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztLQUNsQixDQUFDO0FBQ0osQ0FBQztBQVJELG9DQVFDO0FBRVksUUFBQSxJQUFJLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLFFBQUEsS0FBSyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQixRQUFBLFNBQVMsR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFbkQsU0FBZ0IsY0FBYyxDQUFDLENBQVMsRUFBRSxLQUFnQztJQUN4RSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssMkJBQVEsRUFBRTtRQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUN4RDtJQUNELE9BQU87UUFDTCxJQUFJLEVBQUUsMkJBQVE7UUFDZCxRQUFRLEtBQUssT0FBTyxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQSxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLElBQVM7WUFDZCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDN0IsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBWEQsd0NBV0M7QUFFRCxTQUFnQixTQUFTLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxZQUFvQixpQkFBUztJQUMzRSxPQUFPO1FBQ0wsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJO1FBQ1osUUFBUSxLQUFLLE9BQU8sZUFBZSxDQUFDLEVBQUUsQ0FBQSxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLElBQVM7WUFDZCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxtQkFBbUIsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQVJELDhCQVFDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLEVBQVksRUFBRSxDQUFTLEVBQUUsWUFBb0IsaUJBQVM7SUFDakYsT0FBTztRQUNMLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSTtRQUNaLFFBQVEsS0FBSyxPQUFPLGVBQWUsQ0FBQyxFQUFFLENBQUEsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxJQUFTO1lBQ2QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNsQixJQUFJLENBQUMsS0FBSyxFQUFFO29CQUNWLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ2xCO2dCQUNELEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzthQUMvQjtZQUNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkMsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBaEJELG9DQWdCQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxDQUFTLEVBQUUsU0FBaUI7SUFDeEQsT0FBTztRQUNMLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSTtRQUNaLFFBQVEsS0FBSyxPQUFPLGVBQWUsQ0FBQyxFQUFFLENBQUEsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxJQUFTO1lBQ2QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQVJELHNDQVFDO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLE9BQWdDO0lBQzFELElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FBRTtJQUNsRSxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLEVBQUU7UUFDbkQsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO0tBQ3BFO0lBQ0QsTUFBTSxZQUFZLEdBQUcsR0FBRyxRQUFRLENBQUMsV0FBVyxrQkFBa0IsQ0FBQztJQUUvRCwrQkFBK0I7SUFFL0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxvQkFBYyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsRUFBRTtRQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN6RSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTdCLEtBQUssTUFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsSUFBSSxPQUFPLEVBQUU7WUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZFO1FBRUQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsU0FBUztRQUM1QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLENBQUMsS0FBYSxFQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLElBQUksRUFBRSx5QkFBTTtRQUNaLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLFlBQVksSUFBSSxLQUFLLEdBQUc7UUFDM0MsTUFBTSxDQUFDLElBQVM7WUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUMsQ0FBQztLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUE5QkQsa0NBOEJDIn0=