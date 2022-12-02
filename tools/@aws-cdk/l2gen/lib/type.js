"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VOID = exports.ANY = exports.BOOLEAN = exports.NUMBER = exports.STRING = exports.standardTypeRender = exports.StandardType = exports.arrayOf = exports.builtinType = exports.existingType = void 0;
const cm2_1 = require("./cm2");
function existingType(typeRefName, definingModule) {
    return new StandardType(typeRefName, definingModule);
}
exports.existingType = existingType;
function builtinType(typeRefName) {
    return new StandardType(typeRefName, undefined);
}
exports.builtinType = builtinType;
function arrayOf(type) {
    return {
        definingModule: type.definingModule,
        typeRefName: `Array<${type.typeRefName}>`,
        render(code) {
            code.add('Array<', type, '>');
        },
        toString() {
            return this.typeRefName;
        },
    };
}
exports.arrayOf = arrayOf;
class StandardType {
    constructor(typeRefName, definingModule) {
        this.typeRefName = typeRefName;
        this.definingModule = definingModule;
    }
    render(code) {
        return standardTypeRender(this, code);
    }
    toString() {
        return this.typeRefName;
    }
}
exports.StandardType = StandardType;
/**
 * FIXME: Needs to be factored differently, me no likey
 */
function standardTypeRender(type, code) {
    if (type.definingModule && !type.definingModule.equals(code.currentModule)) {
        // If the referenced type is a compound type, only import the top level
        const parts = type.typeRefName.split('.');
        code.addHelper(new cm2_1.SymbolImport(parts[0], type.definingModule));
    }
    code.write(type.typeRefName);
}
exports.standardTypeRender = standardTypeRender;
exports.STRING = builtinType('string');
exports.NUMBER = builtinType('number');
exports.BOOLEAN = builtinType('boolean');
exports.ANY = builtinType('any');
exports.VOID = builtinType('void');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0JBQXVEO0FBUXZELFNBQWdCLFlBQVksQ0FBQyxXQUFtQixFQUFFLGNBQTZCO0lBQzdFLE9BQU8sSUFBSSxZQUFZLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFGRCxvQ0FFQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxXQUFtQjtJQUM3QyxPQUFPLElBQUksWUFBWSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNsRCxDQUFDO0FBRkQsa0NBRUM7QUFFRCxTQUFnQixPQUFPLENBQUMsSUFBVztJQUNqQyxPQUFPO1FBQ0wsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO1FBQ25DLFdBQVcsRUFBRSxTQUFTLElBQUksQ0FBQyxXQUFXLEdBQUc7UUFDekMsTUFBTSxDQUFDLElBQVM7WUFDZCxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUNELFFBQVE7WUFDTixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDMUIsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBWEQsMEJBV0M7QUFFRCxNQUFhLFlBQVk7SUFDdkIsWUFDa0IsV0FBbUIsRUFDbkIsY0FBeUM7UUFEekMsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFDbkIsbUJBQWMsR0FBZCxjQUFjLENBQTJCO0lBQUksQ0FBQztJQUV6RCxNQUFNLENBQUMsSUFBUztRQUNyQixPQUFPLGtCQUFrQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU0sUUFBUTtRQUNiLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0NBQ0Y7QUFaRCxvQ0FZQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0Isa0JBQWtCLENBQUMsSUFBVyxFQUFFLElBQVM7SUFDdkQsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1FBQzFFLHVFQUF1RTtRQUN2RSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUxQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksa0JBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7S0FDakU7SUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBVEQsZ0RBU0M7QUFFWSxRQUFBLE1BQU0sR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsUUFBQSxNQUFNLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLFFBQUEsT0FBTyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxRQUFBLEdBQUcsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsUUFBQSxJQUFJLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDIn0=