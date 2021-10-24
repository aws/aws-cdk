"use strict";
//
// This rule ensures that the `@aws-cdk/core.Construct` class is always
// referenced without a namespace qualifier (`Construct` instead of
// `xxx.Construct`). The fixer will automatically add an `import` statement
// separated from the main import group to reduce the chance for merge conflicts
// with v2-main. 
//
// If there is already an import of `constructs.Construct` under the name
// `Construct`, we will import `core.Construct` as the alias `CoreConstruct`
// instead.
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const import_cache_1 = require("../private/import-cache");
const importCache = new import_cache_1.ImportCache();
function create(context) {
    // skip core
    if (context.getFilename().includes('@aws-cdk/core')) {
        return {};
    }
    return {
        // collect all "import" statements. we will later use them to determine
        // exactly how to import `core.Construct`.
        ImportDeclaration: node => {
            for (const s of node.specifiers) {
                const typeName = () => {
                    switch (s.type) {
                        case 'ImportSpecifier': return s.imported.name;
                        case 'ImportDefaultSpecifier': return s.local.name;
                        case 'ImportNamespaceSpecifier': return s.local.name;
                    }
                };
                importCache.record({
                    fileName: context.getFilename(),
                    typeName: typeName(),
                    importNode: node,
                    localName: `${node.source.value}.${s.local.name}`
                });
            }
        },
        // this captures `class X extends xxx.Construct`
        ClassDeclaration: node => {
            var _a;
            if (((_a = node.superClass) === null || _a === void 0 ? void 0 : _a.type) === 'MemberExpression') {
                const sc = node.superClass;
                // const qualifier = sc.object.type === 'Identifier' ? sc.object.name : undefined;
                const baseClass = sc.property.type === 'Identifier' ? sc.property.name : undefined;
                if (baseClass === 'Construct' && sc.range) {
                    report(context, node, sc.range);
                }
            }
        },
        // this captures using `xxx.Construct` as an identifier
        Identifier: node => {
            var _a;
            const typeAnnotation = (_a = node.typeAnnotation) === null || _a === void 0 ? void 0 : _a.typeAnnotation;
            const type = typeAnnotation === null || typeAnnotation === void 0 ? void 0 : typeAnnotation.typeName;
            if ((type === null || type === void 0 ? void 0 : type.type) === 'TSQualifiedName' && (type === null || type === void 0 ? void 0 : type.right.name) === 'Construct' && (type === null || type === void 0 ? void 0 : type.left.name) !== 'constructs') {
                report(context, node, typeAnnotation.range);
            }
        },
    };
}
exports.create = create;
/**
 * Reports an error indicating that we found `xxx.Construct` usage, and apply
 * the appropriate fix.
 * @param context Rule context
 * @param node Rule node (for the report)
 * @param replaceRange Text range to replace
 */
function report(context, node, replaceRange) {
    context.report({
        message: 'To avoid merge conflicts with the v2-main branch, the "Construct" type must be referenced without a qualifier (e.g. "Construct" instead of "CoreConstruct")',
        node,
        fix: fixer => {
            const imports = importCache.imports.filter(x => x.fileName === context.getFilename());
            const findImport = (x) => imports.find(i => i.localName === x);
            const coreConstruct = findImport('@aws-cdk/core.Construct');
            const coreCoreConstruct = findImport('@aws-cdk/core.CoreConstruct');
            const constructsConstruct = findImport('constructs.Construct');
            // determines whether we will replace with `Construct` or `CoreConstruct`
            // based on whether this file already imported `constructs.Construct`.
            let replaceBy;
            // determines whether an "import" statement should be added and it's
            // contents.
            let addImport;
            if (coreConstruct) {
                // we already import `core.Construct` as `Construct`
                replaceBy = 'Construct';
            }
            else if (coreCoreConstruct) {
                // we already import `core.Construct` as `CoreConstruct`
                replaceBy = 'CoreConstruct';
            }
            else if (constructsConstruct) {
                // we import `constructs.Construct`, so import and replace
                // `core.Construct` with `CoreConstruct`
                replaceBy = 'CoreConstruct';
                addImport = `import { Construct as ${replaceBy} } from '@aws-cdk/core';`;
            }
            else {
                // import `core.Construct` as `Construct` and replace
                replaceBy = 'Construct';
                addImport = `import { ${replaceBy} } from '@aws-cdk/core';`;
            }
            const fixes = [
                fixer.replaceTextRange(replaceRange, replaceBy)
            ];
            if (addImport) {
                // find the last import statement in the file and add our import immediately after
                const lastImport = imports[imports.length - 1];
                if (lastImport) {
                    fixes.push(fixer.insertTextAfter(lastImport.importNode, [
                        "",
                        "",
                        "// keep this import separate from other imports to reduce chance for merge conflicts with v2-main",
                        "// eslint-disable-next-line no-duplicate-imports, import/order",
                        addImport,
                    ].join('\n')));
                }
            }
            return fixes;
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tcXVhbGlmaWVkLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vLXF1YWxpZmllZC1jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLEVBQUU7QUFDRix1RUFBdUU7QUFDdkUsbUVBQW1FO0FBQ25FLDJFQUEyRTtBQUMzRSxnRkFBZ0Y7QUFDaEYsaUJBQWlCO0FBQ2pCLEVBQUU7QUFDRix5RUFBeUU7QUFDekUsNEVBQTRFO0FBQzVFLFdBQVc7QUFDWCxFQUFFOzs7QUFHRiwwREFBc0Q7QUFFdEQsTUFBTSxXQUFXLEdBQUcsSUFBSSwwQkFBVyxFQUFFLENBQUM7QUFFdEMsU0FBZ0IsTUFBTSxDQUFDLE9BQXlCO0lBQzlDLFlBQVk7SUFDWixJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUU7UUFDbkQsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELE9BQU87UUFDTCx1RUFBdUU7UUFDdkUsMENBQTBDO1FBQzFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ3hCLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDL0IsTUFBTSxRQUFRLEdBQUcsR0FBRyxFQUFFO29CQUNwQixRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUU7d0JBQ2QsS0FBSyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7d0JBQy9DLEtBQUssd0JBQXdCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO3dCQUNuRCxLQUFLLDBCQUEwQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztxQkFDdEQ7Z0JBQ0gsQ0FBQyxDQUFDO2dCQUVGLFdBQVcsQ0FBQyxNQUFNLENBQUM7b0JBQ2pCLFFBQVEsRUFBRSxPQUFPLENBQUMsV0FBVyxFQUFFO29CQUMv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RyxlQUFlLENBQUE7YUFDNUI7aUJBQU0sSUFBSSxtQkFBbUIsRUFBRTtnQkFDOUIsMERBQTBEO2dCQUMxRCx3Q0FBd0M7Z0JBQ3hDLFNBQVMsR0FBRyxlQUFlLENBQUM7Z0JBQzVCLFNBQVMsR0FBRyx5QkFBeUIsU0FBUywwQkFBMEIsQ0FBQzthQUMxRTtpQkFBTTtnQkFDTCxxREFBcUQ7Z0JBQ3JELFNBQVMsR0FBRyxXQUFXLENBQUM7Z0JBQ3hCLFNBQVMsR0FBRyxZQUFZLFNBQVMsMEJBQTBCLENBQUM7YUFDN0Q7WUFFRCxNQUFNLEtBQUssR0FBZTtnQkFDeEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxTQUFTLENBQUM7YUFDaEQsQ0FBQztZQUVGLElBQUksU0FBUyxFQUFFO2dCQUNiLGtGQUFrRjtnQkFDbEYsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLElBQUksVUFBVSxFQUFFO29CQUNkLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFO3dCQUN0RCxFQUFFO3dCQUNGLEVBQUU7d0JBQ0YsbUdBQW1HO3dCQUNuRyxnRUFBZ0U7d0JBQ2hFLFNBQVM7cUJBQ1YsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNoQjthQUNGO1lBRUQsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vXG4vLyBUaGlzIHJ1bGUgZW5zdXJlcyB0aGF0IHRoZSBgQGF3cy1jZGsvY29yZS5Db25zdHJ1Y3RgIGNsYXNzIGlzIGFsd2F5c1xuLy8gcmVmZXJlbmNlZCB3aXRob3V0IGEgbmFtZXNwYWNlIHF1YWxpZmllciAoYENvbnN0cnVjdGAgaW5zdGVhZCBvZlxuLy8gYHh4eC5Db25zdHJ1Y3RgKS4gVGhlIGZpeGVyIHdpbGwgYXV0b21hdGljYWxseSBhZGQgYW4gYGltcG9ydGAgc3RhdGVtZW50XG4vLyBzZXBhcmF0ZWQgZnJvbSB0aGUgbWFpbiBpbXBvcnQgZ3JvdXAgdG8gcmVkdWNlIHRoZSBjaGFuY2UgZm9yIG1lcmdlIGNvbmZsaWN0c1xuLy8gd2l0aCB2Mi1tYWluLiBcbi8vXG4vLyBJZiB0aGVyZSBpcyBhbHJlYWR5IGFuIGltcG9ydCBvZiBgY29uc3RydWN0cy5Db25zdHJ1Y3RgIHVuZGVyIHRoZSBuYW1lXG4vLyBgQ29uc3RydWN0YCwgd2Ugd2lsbCBpbXBvcnQgYGNvcmUuQ29uc3RydWN0YCBhcyB0aGUgYWxpYXMgYENvcmVDb25zdHJ1Y3RgXG4vLyBpbnN0ZWFkLlxuLy9cblxuaW1wb3J0IHsgQVNULCBSdWxlIH0gZnJvbSAnZXNsaW50JztcbmltcG9ydCB7IEltcG9ydENhY2hlIH0gZnJvbSAnLi4vcHJpdmF0ZS9pbXBvcnQtY2FjaGUnO1xuXG5jb25zdCBpbXBvcnRDYWNoZSA9IG5ldyBJbXBvcnRDYWNoZSgpO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKGNvbnRleHQ6IFJ1bGUuUnVsZUNvbnRleHQpOiBSdWxlLk5vZGVMaXN0ZW5lciB7XG4gIC8vIHNraXAgY29yZVxuICBpZiAoY29udGV4dC5nZXRGaWxlbmFtZSgpLmluY2x1ZGVzKCdAYXdzLWNkay9jb3JlJykpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC8vIGNvbGxlY3QgYWxsIFwiaW1wb3J0XCIgc3RhdGVtZW50cy4gd2Ugd2lsbCBsYXRlciB1c2UgdGhlbSB0byBkZXRlcm1pbmVcbiAgICAvLyBleGFjdGx5IGhvdyB0byBpbXBvcnQgYGNvcmUuQ29uc3RydWN0YC5cbiAgICBJbXBvcnREZWNsYXJhdGlvbjogbm9kZSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHMgb2Ygbm9kZS5zcGVjaWZpZXJzKSB7XG4gICAgICAgIGNvbnN0IHR5cGVOYW1lID0gKCkgPT4ge1xuICAgICAgICAgIHN3aXRjaCAocy50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdJbXBvcnRTcGVjaWZpZXInOiByZXR1cm4gcy5pbXBvcnRlZC5uYW1lO1xuICAgICAgICAgICAgY2FzZSAnSW1wb3J0RGVmYXVsdFNwZWNpZmllcic6IHJldHVybiBzLmxvY2FsLm5hbWU7XG4gICAgICAgICAgICBjYXNlICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInOiByZXR1cm4gcy5sb2NhbC5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpbXBvcnRDYWNoZS5yZWNvcmQoe1xuICAgICAgICAgIGZpbGVOYW1lOiBjb250ZXh0LmdldEZpbGVuYW1lKCksXG4gICAgICAgICAgdHlwZU5hbWU6IHR5cGVOYW1lKCksXG4gICAgICAgICAgaW1wb3J0Tm9kZTogbm9kZSxcbiAgICAgICAgICBsb2NhbE5hbWU6IGAke25vZGUuc291cmNlLnZhbHVlfS4ke3MubG9jYWwubmFtZX1gXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB0aGlzIGNhcHR1cmVzIGBjbGFzcyBYIGV4dGVuZHMgeHh4LkNvbnN0cnVjdGBcbiAgICBDbGFzc0RlY2xhcmF0aW9uOiBub2RlID0+IHtcbiAgICAgIGlmIChub2RlLnN1cGVyQ2xhc3M/LnR5cGUgPT09ICdNZW1iZXJFeHByZXNzaW9uJykge1xuICAgICAgICBjb25zdCBzYyA9IG5vZGUuc3VwZXJDbGFzcztcbiAgICAgICAgLy8gY29uc3QgcXVhbGlmaWVyID0gc2Mub2JqZWN0LnR5cGUgPT09ICdJZGVudGlmaWVyJyA/IHNjLm9iamVjdC5uYW1lIDogdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBiYXNlQ2xhc3MgPSBzYy5wcm9wZXJ0eS50eXBlID09PSAnSWRlbnRpZmllcicgPyBzYy5wcm9wZXJ0eS5uYW1lIDogdW5kZWZpbmVkO1xuICAgICAgICBpZiAoYmFzZUNsYXNzID09PSAnQ29uc3RydWN0JyAmJiBzYy5yYW5nZSkge1xuICAgICAgICAgIHJlcG9ydChjb250ZXh0LCBub2RlLCBzYy5yYW5nZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdGhpcyBjYXB0dXJlcyB1c2luZyBgeHh4LkNvbnN0cnVjdGAgYXMgYW4gaWRlbnRpZmllclxuICAgIElkZW50aWZpZXI6IG5vZGUgPT4ge1xuICAgICAgY29uc3QgdHlwZUFubm90YXRpb24gPSAobm9kZSBhcyBhbnkpLnR5cGVBbm5vdGF0aW9uPy50eXBlQW5ub3RhdGlvbjtcbiAgICAgIGNvbnN0IHR5cGUgPSB0eXBlQW5ub3RhdGlvbj8udHlwZU5hbWU7XG4gICAgICBpZiAodHlwZT8udHlwZSA9PT0gJ1RTUXVhbGlmaWVkTmFtZScgJiYgdHlwZT8ucmlnaHQubmFtZSA9PT0gJ0NvbnN0cnVjdCcgJiYgdHlwZT8ubGVmdC5uYW1lICE9PSAnY29uc3RydWN0cycpIHtcbiAgICAgICAgcmVwb3J0KGNvbnRleHQsIG5vZGUsIHR5cGVBbm5vdGF0aW9uLnJhbmdlKTtcbiAgICAgIH1cbiAgICB9LFxuICB9XG59XG5cbi8qKlxuICogUmVwb3J0cyBhbiBlcnJvciBpbmRpY2F0aW5nIHRoYXQgd2UgZm91bmQgYHh4eC5Db25zdHJ1Y3RgIHVzYWdlLCBhbmQgYXBwbHlcbiAqIHRoZSBhcHByb3ByaWF0ZSBmaXguXG4gKiBAcGFyYW0gY29udGV4dCBSdWxlIGNvbnRleHRcbiAqIEBwYXJhbSBub2RlIFJ1bGUgbm9kZSAoZm9yIHRoZSByZXBvcnQpXG4gKiBAcGFyYW0gcmVwbGFjZVJhbmdlIFRleHQgcmFuZ2UgdG8gcmVwbGFjZVxuICovXG5mdW5jdGlvbiByZXBvcnQoY29udGV4dDogUnVsZS5SdWxlQ29udGV4dCwgbm9kZTogUnVsZS5Ob2RlLCByZXBsYWNlUmFuZ2U6IEFTVC5SYW5nZSkge1xuICBjb250ZXh0LnJlcG9ydCh7XG4gICAgbWVzc2FnZTogJ1RvIGF2b2lkIG1lcmdlIGNvbmZsaWN0cyB3aXRoIHRoZSB2Mi1tYWluIGJyYW5jaCwgdGhlIFwiQ29uc3RydWN0XCIgdHlwZSBtdXN0IGJlIHJlZmVyZW5jZWQgd2l0aG91dCBhIHF1YWxpZmllciAoZS5nLiBcIkNvbnN0cnVjdFwiIGluc3RlYWQgb2YgXCJDb3JlQ29uc3RydWN0XCIpJyxcbiAgICBub2RlLFxuICAgIGZpeDogZml4ZXIgPT4ge1xuICAgICAgY29uc3QgaW1wb3J0cyA9IGltcG9ydENhY2hlLmltcG9ydHMuZmlsdGVyKHggPT4geC5maWxlTmFtZSA9PT0gY29udGV4dC5nZXRGaWxlbmFtZSgpKTtcbiAgICAgIGNvbnN0IGZpbmRJbXBvcnQgPSAoeDogc3RyaW5nKSA9PiBpbXBvcnRzLmZpbmQoaSA9PiBpLmxvY2FsTmFtZSA9PT0geCk7XG5cbiAgICAgIGNvbnN0IGNvcmVDb25zdHJ1Y3QgPSBmaW5kSW1wb3J0KCdAYXdzLWNkay9jb3JlLkNvbnN0cnVjdCcpXG4gICAgICBjb25zdCBjb3JlQ29yZUNvbnN0cnVjdCA9IGZpbmRJbXBvcnQoJ0Bhd3MtY2RrL2NvcmUuQ29yZUNvbnN0cnVjdCcpO1xuICAgICAgY29uc3QgY29uc3RydWN0c0NvbnN0cnVjdCA9IGZpbmRJbXBvcnQoJ2NvbnN0cnVjdHMuQ29uc3RydWN0Jyk7XG5cbiAgICAgIC8vIGRldGVybWluZXMgd2hldGhlciB3ZSB3aWxsIHJlcGxhY2Ugd2l0aCBgQ29uc3RydWN0YCBvciBgQ29yZUNvbnN0cnVjdGBcbiAgICAgIC8vIGJhc2VkIG9uIHdoZXRoZXIgdGhpcyBmaWxlIGFscmVhZHkgaW1wb3J0ZWQgYGNvbnN0cnVjdHMuQ29uc3RydWN0YC5cbiAgICAgIGxldCByZXBsYWNlQnk6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgICAgLy8gZGV0ZXJtaW5lcyB3aGV0aGVyIGFuIFwiaW1wb3J0XCIgc3RhdGVtZW50IHNob3VsZCBiZSBhZGRlZCBhbmQgaXQnc1xuICAgICAgLy8gY29udGVudHMuXG4gICAgICBsZXQgYWRkSW1wb3J0OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChjb3JlQ29uc3RydWN0KSB7XG4gICAgICAgIC8vIHdlIGFscmVhZHkgaW1wb3J0IGBjb3JlLkNvbnN0cnVjdGAgYXMgYENvbnN0cnVjdGBcbiAgICAgICAgcmVwbGFjZUJ5ID0gJ0NvbnN0cnVjdCc7XG4gICAgICB9IGVsc2UgaWYgKGNvcmVDb3JlQ29uc3RydWN0KSB7XG4gICAgICAgIC8vIHdlIGFscmVhZHkgaW1wb3J0IGBjb3JlLkNvbnN0cnVjdGAgYXMgYENvcmVDb25zdHJ1Y3RgXG4gICAgICAgIHJlcGxhY2VCeSA9ICdDb3JlQ29uc3RydWN0J1xuICAgICAgfSBlbHNlIGlmIChjb25zdHJ1Y3RzQ29uc3RydWN0KSB7XG4gICAgICAgIC8vIHdlIGltcG9ydCBgY29uc3RydWN0cy5Db25zdHJ1Y3RgLCBzbyBpbXBvcnQgYW5kIHJlcGxhY2VcbiAgICAgICAgLy8gYGNvcmUuQ29uc3RydWN0YCB3aXRoIGBDb3JlQ29uc3RydWN0YFxuICAgICAgICByZXBsYWNlQnkgPSAnQ29yZUNvbnN0cnVjdCc7XG4gICAgICAgIGFkZEltcG9ydCA9IGBpbXBvcnQgeyBDb25zdHJ1Y3QgYXMgJHtyZXBsYWNlQnl9IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGltcG9ydCBgY29yZS5Db25zdHJ1Y3RgIGFzIGBDb25zdHJ1Y3RgIGFuZCByZXBsYWNlXG4gICAgICAgIHJlcGxhY2VCeSA9ICdDb25zdHJ1Y3QnO1xuICAgICAgICBhZGRJbXBvcnQgPSBgaW1wb3J0IHsgJHtyZXBsYWNlQnl9IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7YDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZml4ZXM6IFJ1bGUuRml4W10gPSBbXG4gICAgICAgIGZpeGVyLnJlcGxhY2VUZXh0UmFuZ2UocmVwbGFjZVJhbmdlLCByZXBsYWNlQnkpXG4gICAgICBdO1xuXG4gICAgICBpZiAoYWRkSW1wb3J0KSB7XG4gICAgICAgIC8vIGZpbmQgdGhlIGxhc3QgaW1wb3J0IHN0YXRlbWVudCBpbiB0aGUgZmlsZSBhbmQgYWRkIG91ciBpbXBvcnQgaW1tZWRpYXRlbHkgYWZ0ZXJcbiAgICAgICAgY29uc3QgbGFzdEltcG9ydCA9IGltcG9ydHNbaW1wb3J0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKGxhc3RJbXBvcnQpIHtcbiAgICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLmluc2VydFRleHRBZnRlcihsYXN0SW1wb3J0LmltcG9ydE5vZGUsIFtcbiAgICAgICAgICAgIFwiXCIsXG4gICAgICAgICAgICBcIlwiLFxuICAgICAgICAgICAgXCIvLyBrZWVwIHRoaXMgaW1wb3J0IHNlcGFyYXRlIGZyb20gb3RoZXIgaW1wb3J0cyB0byByZWR1Y2UgY2hhbmNlIGZvciBtZXJnZSBjb25mbGljdHMgd2l0aCB2Mi1tYWluXCIsXG4gICAgICAgICAgICBcIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1kdXBsaWNhdGUtaW1wb3J0cywgaW1wb3J0L29yZGVyXCIsXG4gICAgICAgICAgICBhZGRJbXBvcnQsXG4gICAgICAgICAgXS5qb2luKCdcXG4nKSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmaXhlcztcbiAgICB9LFxuICB9KTtcbn0iXX0=