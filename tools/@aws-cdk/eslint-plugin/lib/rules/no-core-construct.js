"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const import_cache_1 = require("../private/import-cache");
let importCache;
let importsFixed;
const BANNED_TYPES = ['IConstruct', 'Construct'];
function create(context) {
    return {
        // `node` is a type from @typescript-eslint/typescript-estree, but using 'any' for now
        // since it's incompatible with eslint.Rule namespace. Waiting for better compatibility in
        // https://github.com/typescript-eslint/typescript-eslint/tree/1765a178e456b152bd48192eb5db7e8541e2adf2/packages/experimental-utils#note
        // Meanwhile, use a debugger to explore the AST node.
        Program(_node) {
            if (!isTestFile(context.getFilename())) {
                return;
            }
            importCache = new import_cache_1.ImportCache();
            importsFixed = false;
        },
        ImportDeclaration(node) {
            if (!isTestFile(context.getFilename())) {
                return;
            }
            if (node.source.value === '@aws-cdk/core') {
                node.specifiers.forEach((s) => {
                    if (s.type === 'ImportSpecifier' && BANNED_TYPES.includes(s.imported.name)) {
                        // named import
                        importCache.record({
                            fileName: context.getFilename(),
                            typeName: s.imported.name,
                            importNode: node,
                            localName: s.local.name
                        });
                    }
                    else if (s.type === 'ImportNamespaceSpecifier') {
                        // barrel import
                        BANNED_TYPES.forEach(typeName => {
                            importCache.record({
                                fileName: context.getFilename(),
                                typeName,
                                importNode: node,
                                localName: `${s.local.name}.${typeName}`
                            });
                        });
                    }
                });
            }
        },
        Identifier(node) {
            if (!isTestFile(context.getFilename())) {
                return;
            }
            // Only apply rule to bindings (variables and function parameters)
            const typeAnnotation = node.typeAnnotation?.typeAnnotation;
            if (!typeAnnotation) {
                return;
            }
            const type = typeAnnotation.typeName;
            if (!type) {
                return;
            }
            const message = 'Use Construct and IConstruct from the "constructs" module in variable declarations (not "@aws-cdk/core")';
            if (type.type === 'TSQualifiedName') {
                // barrel import
                const qualifier = type.left.name;
                const typename = type.right.name;
                const importNode = findImportNode(`${qualifier}.${typename}`);
                if (!importNode) {
                    return;
                }
                context.report({
                    node,
                    message,
                    fix: (fixer) => {
                        const fixes = [];
                        if (!importsFixed) {
                            fixes.push(fixer.insertTextAfter(importNode, "\nimport * as constructs from 'constructs';"));
                            importsFixed = true;
                        }
                        fixes.push(fixer.replaceTextRange(typeAnnotation.range, `constructs.${typename}`));
                        return fixes;
                    }
                });
            }
            else if (type.type === 'Identifier') {
                // named imports
                const importNode = findImportNode(type.name);
                if (!importNode) {
                    return;
                }
                context.report({
                    node,
                    message,
                    fix: (fixer) => {
                        const fixes = [];
                        if (!importsFixed) {
                            const typesToImport = BANNED_TYPES.map(typeName => {
                                const val = importCache.find({ fileName: context.getFilename(), typeName });
                                if (!val) {
                                    return undefined;
                                }
                                if (typeName === val.localName) {
                                    return typeName;
                                }
                                return `${typeName} as ${val.localName}`;
                            }).filter(x => x !== undefined);
                            fixes.push(fixer.insertTextAfter(importNode, `\nimport { ${typesToImport.join(', ')} } from 'constructs';`));
                            const specifiers = importNode.specifiers;
                            if (specifiers.length === typesToImport.length) {
                                fixes.push(fixer.removeRange(importNode.range));
                            }
                            else {
                                for (let i = 0; i < specifiers.length; i++) {
                                    const s = specifiers[i];
                                    if (typesToImport.includes(s.imported.name)) {
                                        if (i === specifiers.length - 1) {
                                            fixes.push(fixer.removeRange([s.range[0] - 2, s.range[1]])); // include the leading comma
                                        }
                                        else {
                                            fixes.push(fixer.removeRange([s.range[0], s.range[1] + 2])); // include the trailing comma
                                        }
                                    }
                                }
                            }
                            importsFixed = true;
                        }
                        return fixes;
                    }
                });
            }
            else {
                return;
            }
            function findImportNode(locaName) {
                return BANNED_TYPES.map(typeName => {
                    const val = importCache.find({ fileName: context.getFilename(), typeName });
                    if (val && val.localName === locaName) {
                        return val.importNode;
                    }
                    return undefined;
                }).find(x => x !== undefined);
            }
        },
    };
}
exports.create = create;
function isTestFile(filename) {
    return new RegExp(/\/test\//).test(filename);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tY29yZS1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuby1jb3JlLWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwwREFBNEQ7QUFFNUQsSUFBSSxXQUF3QixDQUFDO0FBQzdCLElBQUksWUFBcUIsQ0FBQztBQUUxQixNQUFNLFlBQVksR0FBRyxDQUFFLFlBQVksRUFBRSxXQUFXLENBQUUsQ0FBQztBQUVuRCxTQUFnQixNQUFNLENBQUMsT0FBeUI7SUFDOUMsT0FBTztRQUVMLHNGQUFzRjtRQUN0RiwwRkFBMEY7UUFDMUYsd0lBQXdJO1FBQ3hJLHFEQUFxRDtRQUVyRCxPQUFPLENBQUMsS0FBVTtZQUNoQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3ZDLE9BQU87WUFDVCxDQUFDO1lBQ0QsV0FBVyxHQUFHLElBQUksMEJBQVcsRUFBRSxDQUFDO1lBQ2hDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQztRQUVELGlCQUFpQixDQUFDLElBQVM7WUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUN2QyxPQUFPO1lBQ1QsQ0FBQztZQUNELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssZUFBZSxFQUFFLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUU7b0JBQ2pDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxpQkFBaUIsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzt3QkFDM0UsZUFBZTt3QkFDZixXQUFXLENBQUMsTUFBTSxDQUFDOzRCQUNqQixRQUFRLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRTs0QkFDL0IsUUFB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Q0FBQzt3QkFDdEMsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDO29CQUN4QixDQUFDO29CQUNELE9BQU8sU0FBUyxDQUFDO2dCQUNuQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUM7WUFDaEMsQ0FBQztRQUNILENBQUM7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQXZJRCx3QkF1SUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxRQUFnQjtJQUNsQyxPQUFPLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUnVsZSB9IGZyb20gJ2VzbGludCc7XG5pbXBvcnQgeyBJbXBvcnRDYWNoZSwgTm9kZSB9IGZyb20gJy4uL3ByaXZhdGUvaW1wb3J0LWNhY2hlJztcblxubGV0IGltcG9ydENhY2hlOiBJbXBvcnRDYWNoZTtcbmxldCBpbXBvcnRzRml4ZWQ6IGJvb2xlYW47XG5cbmNvbnN0IEJBTk5FRF9UWVBFUyA9IFsgJ0lDb25zdHJ1Y3QnLCAnQ29uc3RydWN0JyBdO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKGNvbnRleHQ6IFJ1bGUuUnVsZUNvbnRleHQpOiBSdWxlLk5vZGVMaXN0ZW5lciB7XG4gIHJldHVybiB7XG5cbiAgICAvLyBgbm9kZWAgaXMgYSB0eXBlIGZyb20gQHR5cGVzY3JpcHQtZXNsaW50L3R5cGVzY3JpcHQtZXN0cmVlLCBidXQgdXNpbmcgJ2FueScgZm9yIG5vd1xuICAgIC8vIHNpbmNlIGl0J3MgaW5jb21wYXRpYmxlIHdpdGggZXNsaW50LlJ1bGUgbmFtZXNwYWNlLiBXYWl0aW5nIGZvciBiZXR0ZXIgY29tcGF0aWJpbGl0eSBpblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90eXBlc2NyaXB0LWVzbGludC90eXBlc2NyaXB0LWVzbGludC90cmVlLzE3NjVhMTc4ZTQ1NmIxNTJiZDQ4MTkyZWI1ZGI3ZTg1NDFlMmFkZjIvcGFja2FnZXMvZXhwZXJpbWVudGFsLXV0aWxzI25vdGVcbiAgICAvLyBNZWFud2hpbGUsIHVzZSBhIGRlYnVnZ2VyIHRvIGV4cGxvcmUgdGhlIEFTVCBub2RlLlxuXG4gICAgUHJvZ3JhbShfbm9kZTogYW55KSB7XG4gICAgICBpZiAoIWlzVGVzdEZpbGUoY29udGV4dC5nZXRGaWxlbmFtZSgpKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpbXBvcnRDYWNoZSA9IG5ldyBJbXBvcnRDYWNoZSgpO1xuICAgICAgaW1wb3J0c0ZpeGVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIEltcG9ydERlY2xhcmF0aW9uKG5vZGU6IGFueSkge1xuICAgICAgaWYgKCFpc1Rlc3RGaWxlKGNvbnRleHQuZ2V0RmlsZW5hbWUoKSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUuc291cmNlLnZhbHVlID09PSAnQGF3cy1jZGsvY29yZScpIHtcbiAgICAgICAgbm9kZS5zcGVjaWZpZXJzLmZvckVhY2goKHM6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChzLnR5cGUgPT09ICdJbXBvcnRTcGVjaWZpZXInICYmIEJBTk5FRF9UWVBFUy5pbmNsdWRlcyhzLmltcG9ydGVkLm5hbWUpKSB7XG4gICAgICAgICAgICAvLyBuYW1lZCBpbXBvcnRcbiAgICAgICAgICAgIGltcG9ydENhY2hlLnJlY29yZCh7XG4gICAgICAgICAgICAgIGZpbGVOYW1lOiBjb250ZXh0LmdldEZpbGVuYW1lKCksXG4gICAgICAgICAgICAgIHR5cGVOYW1lOiBzLmltcG9ydGVkLm5hbWUsXG4gICAgICAgICAgICAgIGltcG9ydE5vZGU6IG5vZGUsXG4gICAgICAgICAgICAgIGxvY2FsTmFtZTogcy5sb2NhbC5uYW1lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHMudHlwZSA9PT0gJ0ltcG9ydE5hbWVzcGFjZVNwZWNpZmllcicpIHtcbiAgICAgICAgICAgIC8vIGJhcnJlbCBpbXBvcnRcbiAgICAgICAgICAgIEJBTk5FRF9UWVBFUy5mb3JFYWNoKHR5cGVOYW1lID0+IHtcbiAgICAgICAgICAgICAgaW1wb3J0Q2FjaGUucmVjb3JkKHtcbiAgICAgICAgICAgICAgICBmaWxlTmFtZTogY29udGV4dC5nZXRGaWxlbmFtZSgpLFxuICAgICAgICAgICAgICAgIHR5cGVOYW1lLFxuICAgICAgICAgICAgICAgIGltcG9ydE5vZGU6IG5vZGUsXG4gICAgICAgICAgICAgICAgbG9jYWxOYW1lOiBgJHtzLmxvY2FsLm5hbWV9LiR7dHlwZU5hbWV9YFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIElkZW50aWZpZXIobm9kZTogYW55KSB7XG4gICAgICBpZiAoIWlzVGVzdEZpbGUoY29udGV4dC5nZXRGaWxlbmFtZSgpKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBPbmx5IGFwcGx5IHJ1bGUgdG8gYmluZGluZ3MgKHZhcmlhYmxlcyBhbmQgZnVuY3Rpb24gcGFyYW1ldGVycylcbiAgICAgIGNvbnN0IHR5cGVBbm5vdGF0aW9uID0gbm9kZS50eXBlQW5ub3RhdGlvbj8udHlwZUFubm90YXRpb25cbiAgICAgIGlmICghdHlwZUFubm90YXRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgdHlwZSA9IHR5cGVBbm5vdGF0aW9uLnR5cGVOYW1lO1xuICAgICAgaWYgKCF0eXBlKSB7IHJldHVybjsgfVxuXG4gICAgICBjb25zdCBtZXNzYWdlID0gJ1VzZSBDb25zdHJ1Y3QgYW5kIElDb25zdHJ1Y3QgZnJvbSB0aGUgXCJjb25zdHJ1Y3RzXCIgbW9kdWxlIGluIHZhcmlhYmxlIGRlY2xhcmF0aW9ucyAobm90IFwiQGF3cy1jZGsvY29yZVwiKSc7XG5cbiAgICAgIGlmICh0eXBlLnR5cGUgPT09ICdUU1F1YWxpZmllZE5hbWUnKSB7XG4gICAgICAgIC8vIGJhcnJlbCBpbXBvcnRcbiAgICAgICAgY29uc3QgcXVhbGlmaWVyID0gdHlwZS5sZWZ0Lm5hbWU7XG4gICAgICAgIGNvbnN0IHR5cGVuYW1lID0gdHlwZS5yaWdodC5uYW1lO1xuICAgICAgICBjb25zdCBpbXBvcnROb2RlID0gZmluZEltcG9ydE5vZGUoYCR7cXVhbGlmaWVyfS4ke3R5cGVuYW1lfWApO1xuICAgICAgICBpZiAoIWltcG9ydE5vZGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICBmaXg6IChmaXhlcjogUnVsZS5SdWxlRml4ZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZpeGVzOiBSdWxlLkZpeFtdID0gW107XG4gICAgICAgICAgICBpZiAoIWltcG9ydHNGaXhlZCkge1xuICAgICAgICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLmluc2VydFRleHRBZnRlcihpbXBvcnROb2RlLCBcIlxcbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XCIpKTtcbiAgICAgICAgICAgICAgaW1wb3J0c0ZpeGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpeGVzLnB1c2goZml4ZXIucmVwbGFjZVRleHRSYW5nZSh0eXBlQW5ub3RhdGlvbi5yYW5nZSwgYGNvbnN0cnVjdHMuJHt0eXBlbmFtZX1gKSk7XG4gICAgICAgICAgICByZXR1cm4gZml4ZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZS50eXBlID09PSAnSWRlbnRpZmllcicpIHtcbiAgICAgICAgLy8gbmFtZWQgaW1wb3J0c1xuICAgICAgICBjb25zdCBpbXBvcnROb2RlID0gZmluZEltcG9ydE5vZGUodHlwZS5uYW1lKTtcbiAgICAgICAgaWYgKCFpbXBvcnROb2RlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgZml4OiAoZml4ZXI6IFJ1bGUuUnVsZUZpeGVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmaXhlczogUnVsZS5GaXhbXSA9IFtdO1xuICAgICAgICAgICAgaWYgKCFpbXBvcnRzRml4ZWQpIHtcbiAgICAgICAgICAgICAgY29uc3QgdHlwZXNUb0ltcG9ydCA9IEJBTk5FRF9UWVBFUy5tYXAodHlwZU5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbCA9IGltcG9ydENhY2hlLmZpbmQoeyBmaWxlTmFtZTogY29udGV4dC5nZXRGaWxlbmFtZSgpLCB0eXBlTmFtZSB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVOYW1lID09PSB2YWwubG9jYWxOYW1lKSB7IHJldHVybiB0eXBlTmFtZTsgfVxuICAgICAgICAgICAgICAgIHJldHVybiBgJHt0eXBlTmFtZX0gYXMgJHt2YWwubG9jYWxOYW1lfWA7XG4gICAgICAgICAgICAgIH0pLmZpbHRlcih4ID0+IHggIT09IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgIGZpeGVzLnB1c2goZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKGltcG9ydE5vZGUsIGBcXG5pbXBvcnQgeyAke3R5cGVzVG9JbXBvcnQuam9pbignLCAnKX0gfSBmcm9tICdjb25zdHJ1Y3RzJztgKSk7XG5cbiAgICAgICAgICAgICAgY29uc3Qgc3BlY2lmaWVycyA9IGltcG9ydE5vZGUuc3BlY2lmaWVycztcbiAgICAgICAgICAgICAgaWYgKHNwZWNpZmllcnMubGVuZ3RoID09PSB0eXBlc1RvSW1wb3J0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZpeGVzLnB1c2goZml4ZXIucmVtb3ZlUmFuZ2UoaW1wb3J0Tm9kZS5yYW5nZSkpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BlY2lmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgY29uc3QgcyA9IHNwZWNpZmllcnNbaV07XG4gICAgICAgICAgICAgICAgICBpZiAodHlwZXNUb0ltcG9ydC5pbmNsdWRlcyhzLmltcG9ydGVkLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09PSBzcGVjaWZpZXJzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLnJlbW92ZVJhbmdlKFtzLnJhbmdlWzBdIC0gMiwgcy5yYW5nZVsxXV0pKTsgLy8gaW5jbHVkZSB0aGUgbGVhZGluZyBjb21tYVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIGZpeGVzLnB1c2goZml4ZXIucmVtb3ZlUmFuZ2UoW3MucmFuZ2VbMF0sIHMucmFuZ2VbMV0gKyAyXSkpOyAvLyBpbmNsdWRlIHRoZSB0cmFpbGluZyBjb21tYVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGltcG9ydHNGaXhlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZml4ZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZmluZEltcG9ydE5vZGUobG9jYU5hbWU6IHN0cmluZyk6IE5vZGUgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gQkFOTkVEX1RZUEVTLm1hcCh0eXBlTmFtZSA9PiB7XG4gICAgICAgICAgY29uc3QgdmFsID0gaW1wb3J0Q2FjaGUuZmluZCh7IGZpbGVOYW1lOiBjb250ZXh0LmdldEZpbGVuYW1lKCksIHR5cGVOYW1lIH0pO1xuICAgICAgICAgIGlmICh2YWwgJiYgdmFsLmxvY2FsTmFtZSA9PT0gbG9jYU5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWwuaW1wb3J0Tm9kZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSkuZmluZCh4ID0+IHggIT09IHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfSxcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1Rlc3RGaWxlKGZpbGVuYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoL1xcL3Rlc3RcXC8vKS50ZXN0KGZpbGVuYW1lKTtcbn0iXX0=