"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardTypeRender = exports.ambientType = exports.existingType = void 0;
const cm2_1 = require("./cm2");
function existingType(typeRefName, definingModule) {
    return new Type(typeRefName, definingModule);
}
exports.existingType = existingType;
function ambientType(typeRefName) {
    return new Type(typeRefName, undefined);
}
exports.ambientType = ambientType;
class Type {
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
/**
 * FIXME: Needs to be factored differently, me no likey
 */
function standardTypeRender(type, code) {
    if (type.definingModule && !type.definingModule.equals(code.currentModule)) {
        code.addHelper(new cm2_1.SymbolImport(type.typeRefName, type.definingModule));
    }
    code.write(type.typeRefName);
}
exports.standardTypeRender = standardTypeRender;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0JBQXVEO0FBUXZELFNBQWdCLFlBQVksQ0FBQyxXQUFtQixFQUFFLGNBQTZCO0lBQzdFLE9BQU8sSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFGRCxvQ0FFQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxXQUFtQjtJQUM3QyxPQUFPLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRkQsa0NBRUM7QUFFRCxNQUFNLElBQUk7SUFDUixZQUNrQixXQUFtQixFQUNuQixjQUF5QztRQUR6QyxnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNuQixtQkFBYyxHQUFkLGNBQWMsQ0FBMkI7SUFBSSxDQUFDO0lBRXpELE1BQU0sQ0FBQyxJQUFTO1FBQ3JCLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSxRQUFRO1FBQ2IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7Q0FDRjtBQUVEOztHQUVHO0FBQ0gsU0FBZ0Isa0JBQWtCLENBQUMsSUFBVyxFQUFFLElBQVM7SUFDdkQsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1FBQzFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxrQkFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7S0FDekU7SUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBTkQsZ0RBTUMifQ==