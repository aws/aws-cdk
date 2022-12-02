"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFor = void 0;
function fileFor(typeName, visibility) {
    return `lib/gen/${visibility === 'private' ? 'private/' : ''}${typeName.toLowerCase()}.generated.ts`;
}
exports.fileFor = fileFor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnZW5lcmF0YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRQSxTQUFnQixPQUFPLENBQUMsUUFBZ0IsRUFBRSxVQUFnQztJQUN4RSxPQUFPLFdBQVcsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUM7QUFDdkcsQ0FBQztBQUZELDBCQUVDIn0=