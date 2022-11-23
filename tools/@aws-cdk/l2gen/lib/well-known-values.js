"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumMapping = exports.ifDefined = exports.renderDuration = void 0;
const well_known_types_1 = require("./well-known-types");
const cm2_1 = require("./cm2");
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
function ifDefined(c, v) {
    return {
        type: v.type,
        toString() { return `conditional ${v}`; },
        render(code) {
            code.add(c, ' !== undefined ? ', v, ' : undefined');
        },
    };
}
exports.ifDefined = ifDefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VsbC1rbm93bi12YWx1ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3ZWxsLWtub3duLXZhbHVlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx5REFBc0Q7QUFDdEQsK0JBQTRDO0FBRTVDLFNBQWdCLGNBQWMsQ0FBQyxDQUFTLEVBQUUsS0FBZ0M7SUFDeEUsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLDJCQUFRLEVBQUU7UUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7S0FDeEQ7SUFDRCxPQUFPO1FBQ0wsSUFBSSxFQUFFLDJCQUFRO1FBQ2QsUUFBUSxLQUFLLE9BQU8sR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUEsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxJQUFTO1lBQ2QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO1FBQzdCLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQVhELHdDQVdDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTO0lBQzVDLE9BQU87UUFDTCxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUk7UUFDWixRQUFRLEtBQUssT0FBTyxlQUFlLENBQUMsRUFBRSxDQUFBLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsSUFBUztZQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLG1CQUFtQixFQUFFLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUN0RCxDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFSRCw4QkFRQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxPQUFnQztJQUMxRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0tBQUU7SUFDbEUsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxFQUFFO1FBQ25ELE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztLQUNwRTtJQUNELE1BQU0sWUFBWSxHQUFHLEdBQUcsUUFBUSxDQUFDLFdBQVcsa0JBQWtCLENBQUM7SUFFL0QsK0JBQStCO0lBRS9CLE1BQU0sUUFBUSxHQUFHLElBQUksb0JBQWMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEVBQUU7UUFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUU3QixLQUFLLE1BQU0sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLElBQUksT0FBTyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUN2RTtRQUVELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLFNBQVM7UUFDNUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxDQUFDLEtBQWEsRUFBVSxFQUFFLENBQUMsQ0FBQztRQUNqQyxJQUFJLEVBQUUseUJBQU07UUFDWixRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxZQUFZLElBQUksS0FBSyxHQUFHO1FBQzNDLE1BQU0sQ0FBQyxJQUFTO1lBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBOUJELGtDQThCQyJ9