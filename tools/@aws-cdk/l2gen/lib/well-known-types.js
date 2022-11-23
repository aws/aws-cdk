"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANY = exports.BOOLEAN = exports.NUMBER = exports.STRING = exports.DURATION = exports.RESOURCE = exports.CONSTRUCT = void 0;
const type_1 = require("./type");
const source_module_1 = require("./source-module");
exports.CONSTRUCT = type_1.existingType('Construct', new source_module_1.InstalledModule('constructs'));
exports.RESOURCE = type_1.existingType('Resource', new source_module_1.InstalledModule('@aws-cdk/core'));
exports.DURATION = type_1.existingType('Duration', new source_module_1.InstalledModule('@aws-cdk/core'));
exports.STRING = type_1.ambientType('string');
exports.NUMBER = type_1.ambientType('number');
exports.BOOLEAN = type_1.ambientType('boolean');
exports.ANY = type_1.ambientType('any');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VsbC1rbm93bi10eXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlbGwta25vd24tdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQW1EO0FBQ25ELG1EQUFrRDtBQUVyQyxRQUFBLFNBQVMsR0FBRyxtQkFBWSxDQUFDLFdBQVcsRUFBRSxJQUFJLCtCQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUN6RSxRQUFBLFFBQVEsR0FBRyxtQkFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLCtCQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztBQUMxRSxRQUFBLFFBQVEsR0FBRyxtQkFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLCtCQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztBQUMxRSxRQUFBLE1BQU0sR0FBRyxrQkFBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLFFBQUEsTUFBTSxHQUFHLGtCQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsUUFBQSxPQUFPLEdBQUcsa0JBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxRQUFBLEdBQUcsR0FBRyxrQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDIn0=