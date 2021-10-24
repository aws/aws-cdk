"use strict";
//
// This rule ensures that the `@aws-cdk/core.Construct` class is always
// imported at the end, and in a separate section. In the `v2-main` branch,
// this class is removed and so is the import. Keeping it in a separate line
// and section ensures that any other adjustments to the import do not cause
// conflicts on forward merges.
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
let importOrderViolation;
let coreConstructImportLine;
let lastImport;
function create(context) {
    return {
        Program: _ => {
            // reset for every file
            importOrderViolation = undefined;
            coreConstructImportLine = undefined;
            lastImport = undefined;
        },
        // collect all "import" statements. we will later use them to determine
        // exactly how to import `core.Construct`.
        ImportDeclaration: node => {
            lastImport = node;
            if (coreConstructImportLine && coreConstructImportLine.range) {
                // If CoreConstruct import was previously seen, this import line should not succeed it.
                importOrderViolation = {
                    node: coreConstructImportLine,
                    range: coreConstructImportLine.range,
                    localName: coreConstructImportLine.specifiers[0].local.name,
                };
            }
            for (const [i, s] of node.specifiers.entries()) {
                const isConstruct = (s.local.name === 'CoreConstruct' || s.local.name === 'Construct') && node.source.value === '@aws-cdk/core';
                if (isConstruct && s.range) {
                    if (node.specifiers.length > 1) {
                        // if there is more than one specifier on the line that also imports CoreConstruct, i.e.,
                        // `import { Resource, Construct as CoreConstruct, Token } from '@aws-cdk/core'`
                        // If this is the last specifier, delete just that. If not, delete until the beginning of the next specifier.
                        const range = (i === node.specifiers.length - 1) ? s.range : [s.range[0], node.specifiers[i + 1].range[0]];
                        importOrderViolation = { node, range, localName: s.local.name };
                    }
                    else {
                        // This means that CoreConstruct is the only import within this line,
                        // so record the node so the whole line can be removed if there are imports that follow
                        coreConstructImportLine = node;
                    }
                }
            }
        },
        Identifier: node => {
            if (node.parent.type !== 'ImportSpecifier' &&
                (node.name === 'CoreConstruct' || node.name === 'Construct') &&
                importOrderViolation) {
                reportImportOrderViolations(context);
            }
        },
    };
}
exports.create = create;
function reportImportOrderViolations(context) {
    if (importOrderViolation && lastImport) {
        const violation = importOrderViolation;
        const _lastImport = lastImport;
        context.report({
            message: 'To avoid merge conflicts with the v2 branch, import of "@aws-cdk/core.Construct" must be in its own line, '
                + 'and as the very last import.',
            node: violation.node,
            fix: fixer => {
                const fixes = [];
                fixes.push(fixer.removeRange(violation.range));
                const sym = violation.localName === 'Construct' ? 'Construct' : 'Construct as CoreConstruct';
                const addImport = `import { ${sym} } from '@aws-cdk/core';`;
                fixes.push(fixer.insertTextAfter(_lastImport, [
                    "",
                    "",
                    "// keep this import separate from other imports to reduce chance for merge conflicts with v2-main",
                    "// eslint-disable-next-line no-duplicate-imports, import/order",
                    addImport,
                ].join('\n')));
                return fixes;
            }
        });
        // reset, so that this is reported only once
        importOrderViolation = undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0LWltcG9ydC1vcmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnN0cnVjdC1pbXBvcnQtb3JkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLEVBQUU7QUFDRix1RUFBdUU7QUFDdkUsMkVBQTJFO0FBQzNFLDRFQUE0RTtBQUM1RSw0RUFBNEU7QUFDNUUsK0JBQStCO0FBQy9CLEVBQUU7OztBQVdGLElBQUksb0JBQXNELENBQUM7QUFDM0QsSUFBSSx1QkFBc0QsQ0FBQztBQUMzRCxJQUFJLFVBQWlDLENBQUM7QUFFdEMsU0FBZ0IsTUFBTSxDQUFDLE9BQXlCO0lBQzlDLE9BQU87UUFDTCxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDWCx1QkFBdUI7WUFDdkIsb0JBQW9CLEdBQUcsU0FBUyxDQUFDO1lBQ2pDLHVCQUF1QixHQUFHLFNBQVMsQ0FBQztZQUNwQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQ3pCLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsMENBQTBDO1FBQzFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ3hCLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFFbEIsSUFBSSx1QkFBdUIsSUFBSSx1QkFBdUIsQ0FBQyxLQUFLLEVBQUU7Z0JBQzVELHVGQUF1RjtnQkFFdkYsb0JBQW9CLEdBQUc7b0JBQ3JCLElBQUksRUFBRSx1QkFBdUI7b0JBQzdCLEtBQUssRUFBRSx1QkFBdUIsQ0FBQyxLQUFLO29CQUNwQyxTQUFTLEVBQUUsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJO2lCQUM1RCxDQUFDO2FBQ0g7WUFFRCxLQUFLLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDOUMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxlQUFlLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssZUFBZSxDQUFDO2dCQUNoSSxJQUFJLFdBQVcsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFO29CQUMxQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDOUIseUZBQXlGO3dCQUN6RixnRkFBZ0Y7d0JBRWhGLDZHQUE2Rzt3QkFDN0csTUFBTSxLQUFLLEdBQXFCLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzlILG9CQUFvQixHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztxQkFDakU7eUJBQU07d0JBQ0wscUVBQXFFO3dCQUNyRSx1RkFBdUY7d0JBRXZGLHVCQUF1QixHQUFHLElBQUksQ0FBQztxQkFDaEM7aUJBQ0Y7YUFDRjtRQUNILENBQUM7UUFFRCxVQUFVLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDakIsSUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxpQkFBaUI7Z0JBQ3RDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxlQUFlLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxXQUFXLENBQUM7Z0JBQzVELG9CQUFvQixFQUNwQjtnQkFDQSwyQkFBMkIsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN0QztRQUNILENBQUM7S0FDRixDQUFBO0FBQ0gsQ0FBQztBQXRERCx3QkFzREM7QUFFRCxTQUFTLDJCQUEyQixDQUFDLE9BQXlCO0lBQzVELElBQUksb0JBQW9CLElBQUksVUFBVSxFQUFFO1FBQ3RDLE1BQU0sU0FBUyxHQUFHLG9CQUFvQixDQUFDO1FBQ3ZDLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUMvQixPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ2IsT0FBTyxFQUFFLDRHQUE0RztrQkFDakgsOEJBQThCO1lBQ2xDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTtZQUNwQixHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ1gsTUFBTSxLQUFLLEdBQWUsRUFBRSxDQUFDO2dCQUM3QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxTQUFTLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLDRCQUE0QixDQUFBO2dCQUM1RixNQUFNLFNBQVMsR0FBRyxZQUFZLEdBQUcsMEJBQTBCLENBQUM7Z0JBQzVELEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUU7b0JBQzVDLEVBQUU7b0JBQ0YsRUFBRTtvQkFDRixtR0FBbUc7b0JBQ25HLGdFQUFnRTtvQkFDaEUsU0FBUztpQkFDVixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsT0FBTyxLQUFLLENBQUM7WUFDZixDQUFDO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsNENBQTRDO1FBQzVDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQztLQUNsQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvL1xuLy8gVGhpcyBydWxlIGVuc3VyZXMgdGhhdCB0aGUgYEBhd3MtY2RrL2NvcmUuQ29uc3RydWN0YCBjbGFzcyBpcyBhbHdheXNcbi8vIGltcG9ydGVkIGF0IHRoZSBlbmQsIGFuZCBpbiBhIHNlcGFyYXRlIHNlY3Rpb24uIEluIHRoZSBgdjItbWFpbmAgYnJhbmNoLFxuLy8gdGhpcyBjbGFzcyBpcyByZW1vdmVkIGFuZCBzbyBpcyB0aGUgaW1wb3J0LiBLZWVwaW5nIGl0IGluIGEgc2VwYXJhdGUgbGluZVxuLy8gYW5kIHNlY3Rpb24gZW5zdXJlcyB0aGF0IGFueSBvdGhlciBhZGp1c3RtZW50cyB0byB0aGUgaW1wb3J0IGRvIG5vdCBjYXVzZVxuLy8gY29uZmxpY3RzIG9uIGZvcndhcmQgbWVyZ2VzLlxuLy9cblxuaW1wb3J0IHsgSW1wb3J0RGVjbGFyYXRpb24gfSBmcm9tICdlc3RyZWUnO1xuaW1wb3J0IHsgUnVsZSB9IGZyb20gJ2VzbGludCc7XG5cbmludGVyZmFjZSBJbXBvcnRPcmRlclZpb2xhdGlvbiB7XG4gIG5vZGU6IEltcG9ydERlY2xhcmF0aW9uO1xuICBsb2NhbE5hbWU6IHN0cmluZztcbiAgcmFuZ2U6IFtudW1iZXIsIG51bWJlcl07XG59XG5cbmxldCBpbXBvcnRPcmRlclZpb2xhdGlvbjogSW1wb3J0T3JkZXJWaW9sYXRpb24gfCB1bmRlZmluZWQ7XG5sZXQgY29yZUNvbnN0cnVjdEltcG9ydExpbmU6IEltcG9ydERlY2xhcmF0aW9uIHwgdW5kZWZpbmVkO1xubGV0IGxhc3RJbXBvcnQ6IFJ1bGUuTm9kZSB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShjb250ZXh0OiBSdWxlLlJ1bGVDb250ZXh0KTogUnVsZS5Ob2RlTGlzdGVuZXIge1xuICByZXR1cm4ge1xuICAgIFByb2dyYW06IF8gPT4ge1xuICAgICAgLy8gcmVzZXQgZm9yIGV2ZXJ5IGZpbGVcbiAgICAgIGltcG9ydE9yZGVyVmlvbGF0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgY29yZUNvbnN0cnVjdEltcG9ydExpbmUgPSB1bmRlZmluZWQ7XG4gICAgICBsYXN0SW1wb3J0ID0gdW5kZWZpbmVkO1xuICAgIH0sXG5cbiAgICAvLyBjb2xsZWN0IGFsbCBcImltcG9ydFwiIHN0YXRlbWVudHMuIHdlIHdpbGwgbGF0ZXIgdXNlIHRoZW0gdG8gZGV0ZXJtaW5lXG4gICAgLy8gZXhhY3RseSBob3cgdG8gaW1wb3J0IGBjb3JlLkNvbnN0cnVjdGAuXG4gICAgSW1wb3J0RGVjbGFyYXRpb246IG5vZGUgPT4ge1xuICAgICAgbGFzdEltcG9ydCA9IG5vZGU7XG5cbiAgICAgIGlmIChjb3JlQ29uc3RydWN0SW1wb3J0TGluZSAmJiBjb3JlQ29uc3RydWN0SW1wb3J0TGluZS5yYW5nZSkge1xuICAgICAgICAvLyBJZiBDb3JlQ29uc3RydWN0IGltcG9ydCB3YXMgcHJldmlvdXNseSBzZWVuLCB0aGlzIGltcG9ydCBsaW5lIHNob3VsZCBub3Qgc3VjY2VlZCBpdC5cblxuICAgICAgICBpbXBvcnRPcmRlclZpb2xhdGlvbiA9IHtcbiAgICAgICAgICBub2RlOiBjb3JlQ29uc3RydWN0SW1wb3J0TGluZSxcbiAgICAgICAgICByYW5nZTogY29yZUNvbnN0cnVjdEltcG9ydExpbmUucmFuZ2UsXG4gICAgICAgICAgbG9jYWxOYW1lOiBjb3JlQ29uc3RydWN0SW1wb3J0TGluZS5zcGVjaWZpZXJzWzBdLmxvY2FsLm5hbWUsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3QgW2ksIHNdIG9mIG5vZGUuc3BlY2lmaWVycy5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgaXNDb25zdHJ1Y3QgPSAocy5sb2NhbC5uYW1lID09PSAnQ29yZUNvbnN0cnVjdCcgfHwgcy5sb2NhbC5uYW1lID09PSAnQ29uc3RydWN0JykgJiYgbm9kZS5zb3VyY2UudmFsdWUgPT09ICdAYXdzLWNkay9jb3JlJztcbiAgICAgICAgaWYgKGlzQ29uc3RydWN0ICYmIHMucmFuZ2UpIHtcbiAgICAgICAgICBpZiAobm9kZS5zcGVjaWZpZXJzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG1vcmUgdGhhbiBvbmUgc3BlY2lmaWVyIG9uIHRoZSBsaW5lIHRoYXQgYWxzbyBpbXBvcnRzIENvcmVDb25zdHJ1Y3QsIGkuZS4sXG4gICAgICAgICAgICAvLyBgaW1wb3J0IHsgUmVzb3VyY2UsIENvbnN0cnVjdCBhcyBDb3JlQ29uc3RydWN0LCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnYFxuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBsYXN0IHNwZWNpZmllciwgZGVsZXRlIGp1c3QgdGhhdC4gSWYgbm90LCBkZWxldGUgdW50aWwgdGhlIGJlZ2lubmluZyBvZiB0aGUgbmV4dCBzcGVjaWZpZXIuXG4gICAgICAgICAgICBjb25zdCByYW5nZTogW251bWJlciwgbnVtYmVyXSA9IChpID09PSBub2RlLnNwZWNpZmllcnMubGVuZ3RoIC0gMSkgPyBzLnJhbmdlIDogW3MucmFuZ2VbMF0sIG5vZGUuc3BlY2lmaWVyc1tpICsgMV0ucmFuZ2UhWzBdXTtcbiAgICAgICAgICAgIGltcG9ydE9yZGVyVmlvbGF0aW9uID0geyBub2RlLCByYW5nZSwgbG9jYWxOYW1lOiBzLmxvY2FsLm5hbWUgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhpcyBtZWFucyB0aGF0IENvcmVDb25zdHJ1Y3QgaXMgdGhlIG9ubHkgaW1wb3J0IHdpdGhpbiB0aGlzIGxpbmUsXG4gICAgICAgICAgICAvLyBzbyByZWNvcmQgdGhlIG5vZGUgc28gdGhlIHdob2xlIGxpbmUgY2FuIGJlIHJlbW92ZWQgaWYgdGhlcmUgYXJlIGltcG9ydHMgdGhhdCBmb2xsb3dcblxuICAgICAgICAgICAgY29yZUNvbnN0cnVjdEltcG9ydExpbmUgPSBub2RlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBJZGVudGlmaWVyOiBub2RlID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgbm9kZS5wYXJlbnQudHlwZSAhPT0gJ0ltcG9ydFNwZWNpZmllcicgJiYgXG4gICAgICAgIChub2RlLm5hbWUgPT09ICdDb3JlQ29uc3RydWN0JyB8fCBub2RlLm5hbWUgPT09ICdDb25zdHJ1Y3QnKSAmJlxuICAgICAgICBpbXBvcnRPcmRlclZpb2xhdGlvblxuICAgICAgKSB7XG4gICAgICAgIHJlcG9ydEltcG9ydE9yZGVyVmlvbGF0aW9ucyhjb250ZXh0KTtcbiAgICAgIH1cbiAgICB9LFxuICB9XG59XG5cbmZ1bmN0aW9uIHJlcG9ydEltcG9ydE9yZGVyVmlvbGF0aW9ucyhjb250ZXh0OiBSdWxlLlJ1bGVDb250ZXh0KSB7XG4gIGlmIChpbXBvcnRPcmRlclZpb2xhdGlvbiAmJiBsYXN0SW1wb3J0KSB7XG4gICAgY29uc3QgdmlvbGF0aW9uID0gaW1wb3J0T3JkZXJWaW9sYXRpb247XG4gICAgY29uc3QgX2xhc3RJbXBvcnQgPSBsYXN0SW1wb3J0O1xuICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgIG1lc3NhZ2U6ICdUbyBhdm9pZCBtZXJnZSBjb25mbGljdHMgd2l0aCB0aGUgdjIgYnJhbmNoLCBpbXBvcnQgb2YgXCJAYXdzLWNkay9jb3JlLkNvbnN0cnVjdFwiIG11c3QgYmUgaW4gaXRzIG93biBsaW5lLCAnXG4gICAgICAgICsgJ2FuZCBhcyB0aGUgdmVyeSBsYXN0IGltcG9ydC4nLFxuICAgICAgbm9kZTogdmlvbGF0aW9uLm5vZGUsXG4gICAgICBmaXg6IGZpeGVyID0+IHtcbiAgICAgICAgY29uc3QgZml4ZXM6IFJ1bGUuRml4W10gPSBbXTtcbiAgICAgICAgZml4ZXMucHVzaChmaXhlci5yZW1vdmVSYW5nZSh2aW9sYXRpb24ucmFuZ2UpKTtcbiAgICAgICAgY29uc3Qgc3ltID0gdmlvbGF0aW9uLmxvY2FsTmFtZSA9PT0gJ0NvbnN0cnVjdCcgPyAnQ29uc3RydWN0JyA6ICdDb25zdHJ1Y3QgYXMgQ29yZUNvbnN0cnVjdCdcbiAgICAgICAgY29uc3QgYWRkSW1wb3J0ID0gYGltcG9ydCB7ICR7c3ltfSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO2A7XG4gICAgICAgIGZpeGVzLnB1c2goZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKF9sYXN0SW1wb3J0LCBbXG4gICAgICAgICAgXCJcIixcbiAgICAgICAgICBcIlwiLFxuICAgICAgICAgIFwiLy8ga2VlcCB0aGlzIGltcG9ydCBzZXBhcmF0ZSBmcm9tIG90aGVyIGltcG9ydHMgdG8gcmVkdWNlIGNoYW5jZSBmb3IgbWVyZ2UgY29uZmxpY3RzIHdpdGggdjItbWFpblwiLFxuICAgICAgICAgIFwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWR1cGxpY2F0ZS1pbXBvcnRzLCBpbXBvcnQvb3JkZXJcIixcbiAgICAgICAgICBhZGRJbXBvcnQsXG4gICAgICAgIF0uam9pbignXFxuJykpKTtcbiAgICAgICAgcmV0dXJuIGZpeGVzO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIHJlc2V0LCBzbyB0aGF0IHRoaXMgaXMgcmVwb3J0ZWQgb25seSBvbmNlXG4gICAgaW1wb3J0T3JkZXJWaW9sYXRpb24gPSB1bmRlZmluZWQ7XG4gIH1cbn0iXX0=