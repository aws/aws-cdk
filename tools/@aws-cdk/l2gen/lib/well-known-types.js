"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factoryFunction = exports.TOKENIZATION = exports.FN = exports.LAZY = exports.ARN_FORMAT = exports.ARN = exports.DURATION = exports.IRESOURCE = exports.STACK = exports.RESOURCE = exports.CONSTRUCT = exports.withMembers = exports.WithMembers = void 0;
const type_1 = require("./type");
const source_module_1 = require("./source-module");
const value_1 = require("./value");
const cm2_1 = require("./cm2");
class WithMembers {
    propExp(propName) {
        return value_1.litVal([this, '.', propName]);
    }
    callExp(fnName) {
        return (...args) => value_1.litVal([this, '.', fnName, '(', ...cm2_1.interleave(', ', args), ')']);
    }
}
exports.WithMembers = WithMembers;
function withMembers(x) {
    return Object.create(x, Object.getOwnPropertyDescriptors(WithMembers.prototype));
}
exports.withMembers = withMembers;
exports.CONSTRUCT = withMembers(type_1.existingType('Construct', new source_module_1.InstalledModule('constructs')));
exports.RESOURCE = withMembers(type_1.existingType('Resource', new source_module_1.InstalledModule('@aws-cdk/core')));
exports.STACK = withMembers(type_1.existingType('Stack', new source_module_1.InstalledModule('@aws-cdk/core')));
exports.IRESOURCE = type_1.existingType('IResource', new source_module_1.InstalledModule('@aws-cdk/core'));
exports.DURATION = withMembers(type_1.existingType('Duration', new source_module_1.InstalledModule('@aws-cdk/core')));
exports.ARN = withMembers(type_1.existingType('Arn', new source_module_1.InstalledModule('@aws-cdk/core')));
exports.ARN_FORMAT = withMembers(type_1.existingType('ArnFormat', new source_module_1.InstalledModule('@aws-cdk/core')));
exports.LAZY = withMembers(type_1.existingType('Lazy', new source_module_1.InstalledModule('@aws-cdk/core')));
exports.FN = withMembers(type_1.existingType('Fn', new source_module_1.InstalledModule('@aws-cdk/core')));
exports.TOKENIZATION = withMembers(type_1.existingType('Tokenization', new source_module_1.InstalledModule('@aws-cdk/core')));
function factoryFunction(type) {
    return {
        definingModule: type.definingModule,
        toString: () => `() => ${type}`,
        typeRefName: `() => ${type}`,
        render: (code) => {
            code.add('() => ', type);
        },
    };
}
exports.factoryFunction = factoryFunction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VsbC1rbm93bi10eXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlbGwta25vd24tdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQTZDO0FBQzdDLG1EQUFrRDtBQUNsRCxtQ0FBaUM7QUFDakMsK0JBQXFEO0FBRXJELE1BQXNCLFdBQVc7SUFDeEIsT0FBTyxDQUFDLFFBQWdCO1FBQzdCLE9BQU8sY0FBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxPQUFPLENBQUMsTUFBYztRQUMzQixPQUFPLENBQUMsR0FBRyxJQUFtQixFQUFlLEVBQUUsQ0FBQyxjQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxnQkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ25ILENBQUM7Q0FHRjtBQVZELGtDQVVDO0FBRUQsU0FBZ0IsV0FBVyxDQUF3QixDQUFJO0lBQ3JELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLHlCQUF5QixDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ25GLENBQUM7QUFGRCxrQ0FFQztBQUVZLFFBQUEsU0FBUyxHQUFHLFdBQVcsQ0FBQyxtQkFBWSxDQUFDLFdBQVcsRUFBRSxJQUFJLCtCQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RGLFFBQUEsUUFBUSxHQUFHLFdBQVcsQ0FBQyxtQkFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLCtCQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZGLFFBQUEsS0FBSyxHQUFHLFdBQVcsQ0FBQyxtQkFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLCtCQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pGLFFBQUEsU0FBUyxHQUFHLG1CQUFZLENBQUMsV0FBVyxFQUFFLElBQUksK0JBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0FBQzVFLFFBQUEsUUFBUSxHQUFHLFdBQVcsQ0FBQyxtQkFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLCtCQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZGLFFBQUEsR0FBRyxHQUFHLFdBQVcsQ0FBQyxtQkFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLCtCQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdFLFFBQUEsVUFBVSxHQUFHLFdBQVcsQ0FBQyxtQkFBWSxDQUFDLFdBQVcsRUFBRSxJQUFJLCtCQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFGLFFBQUEsSUFBSSxHQUFHLFdBQVcsQ0FBQyxtQkFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLCtCQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9FLFFBQUEsRUFBRSxHQUFHLFdBQVcsQ0FBQyxtQkFBWSxDQUFDLElBQUksRUFBRSxJQUFJLCtCQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNFLFFBQUEsWUFBWSxHQUFHLFdBQVcsQ0FBQyxtQkFBWSxDQUFDLGNBQWMsRUFBRSxJQUFJLCtCQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRTVHLFNBQWdCLGVBQWUsQ0FBQyxJQUFXO0lBQ3pDLE9BQU87UUFDTCxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7UUFDbkMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLFNBQVMsSUFBSSxFQUFFO1FBQy9CLFdBQVcsRUFBRSxTQUFTLElBQUksRUFBRTtRQUM1QixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNCLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQVRELDBDQVNDIn0=