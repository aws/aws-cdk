"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const fs = require("fs-extra");
const path = require("path");
let namespaceImports = {};
function create(context) {
    // The format of Cfn imports only matters for alpha packages, so that they can be
    // formatted correctly when released separately for V2. The linter rule should only be
    // applied if the file is in an alpha package, or it is a test file.
    const filename = context.getFilename();
    if (!currentFileIsInAlphaPackage(filename) && !filename.match('test/rules/fixtures')) {
        return {};
    }
    return {
        ImportDeclaration: node => {
            const location = node.source.value;
            // Store all of the 'import * as name from location' imports, so that we can check the location when
            // we find name.CfnXXX references.
            node.specifiers.forEach(e => {
                if (e.type === 'ImportNamespaceSpecifier') {
                    namespaceImports[e.local.name] = location;
                }
            });
            if (location.endsWith('generated') || location === '@aws-cdk/core') {
                // If importing directly from a generated file, this is fine. Also we know that aws-cdk/core is not experimental, so that is fine as well. 
                return;
            }
            const cfnImports = [];
            const otherImports = [];
            node.specifiers.forEach(e => {
                if (e.type === 'ImportSpecifier') {
                    if (e.imported.name.startsWith('Cfn')) {
                        cfnImports.push(e);
                    }
                    else {
                        otherImports.push(e);
                    }
                }
            });
            if (cfnImports.length > 0 && otherImports.length > 0 && location.startsWith('.')) {
                // import { CfnXXX, SomethingElse, AnotherThing } from './some/relative/path/not/ending/in/generated';
                context.report({
                    message: 'To allow rewriting imports when generating v2 experimental packages, import of `' + cfnImports.map(e => e.imported.name).join(', ') + '` must be separate from import of `' + otherImports.map(e => e.imported.name).join(', ') + '`, and imported from its specific .generated location.',
                    node: node,
                });
            }
            else if (cfnImports.length > 0 && location.startsWith('.')) {
                // import { CfnXXX } from './some/relative/path/not/ending/in/generated';
                context.report({
                    message: 'To allow rewriting imports when generating v2 experimental packages, import of `' + cfnImports.map(e => e.imported.name).join(', ') + '` must be imported from its specific .generated location.',
                    node: node,
                });
            }
            else if (cfnImports.length > 0 && otherImports.length > 0 && checkIfImportedLocationIsAnAlphaPackage(location, context.getFilename())) {
                // import { CfnXXX, SomethingElse, AnotherThing } from '@aws-cdk/another-alpha-package';
                context.report({
                    message: 'To allow rewriting imports when generating v2 experimental packages, import of `' + cfnImports.map(e => e.imported.name).join(', ') + '` must be separate from import of `' + otherImports.map(e => e.imported.name).join(', ') + '`',
                    node: node,
                });
            }
        },
        // This captures using `xxx.CfnConstruct` as an identifier
        Identifier: node => {
            const typeAnnotation = node.typeAnnotation?.typeAnnotation;
            const type = typeAnnotation?.typeName;
            if (type?.type === 'TSQualifiedName') {
                const result = checkLeftAndRightForCfn(type);
                if (result) {
                    reportErrorIfImportedLocationIsNotValid(context, node, result.name, result.location);
                }
            }
            if (node.name.startsWith('Cfn') && node.parent.type === 'MemberExpression' && node.parent.object.type === 'Identifier') {
                // new xxx.CfnConstruct();
                reportErrorIfImportedLocationIsNotValid(context, node, node.name, node.parent.object.name);
            }
        },
    };
}
exports.create = create;
function reportErrorIfImportedLocationIsNotValid(context, node, name, barrelImportName) {
    const location = namespaceImports[barrelImportName];
    if (!location) {
        // This scenario should not happen, but if it does, we don't want users to run into weird runtime errors from the linter.
        return;
    }
    if (location.endsWith('generated') || location === '@aws-cdk/core') {
        return;
    }
    if (location.startsWith('.')) {
        // import * as name from './some/relative/path/not/ending/in/generated'; name.CfnConstruct();
        context.report({
            message: 'To allow rewriting imports when generating v2 experimental packages, `' + name + '` must be imported by name from its specific .generated location.',
            node: node,
        });
    }
    else if (checkIfImportedLocationIsAnAlphaPackage(location, context.getFilename())) {
        // import * as name from '@aws-cdk/another-alpha-package'; name.CfnConstruct();
        context.report({
            message: 'To allow rewriting imports when generating v2 experimental packages, `' + name + '` must be imported by name and separate from non-L1 imports, since it is being imported from an experimental package: ' + location,
            node: node,
        });
    }
}
function currentFileIsInAlphaPackage(filename) {
    const filePathSplit = filename.split(path.sep);
    const awsCdkNamespaceIndex = filePathSplit.findIndex(e => e.match('@aws-cdk'));
    if (awsCdkNamespaceIndex !== -1) {
        const packageDir = filePathSplit.slice(0, awsCdkNamespaceIndex + 2).join(path.sep);
        return isAlphaPackage(packageDir);
    }
    return false;
}
function checkIfImportedLocationIsAnAlphaPackage(location, currentFilename) {
    const rootDir = getCdkRootDir(currentFilename);
    if (rootDir) {
        const packageDir = rootDir + `/packages/${location}`;
        return isAlphaPackage(packageDir);
    }
    return false;
}
function getCdkRootDir(filename) {
    const filenameSplit = filename.split(path.sep);
    // for test files
    let rootDirIndex = filenameSplit.findIndex(e => e.match('tools'));
    // for package files
    if (rootDirIndex === -1) {
        rootDirIndex = filenameSplit.findIndex(e => e.match('packages'));
    }
    if (rootDirIndex !== -1) {
        return filenameSplit.slice(0, rootDirIndex).join(path.sep);
    }
    return undefined;
}
function isAlphaPackage(packageDir) {
    if (packageDir.endsWith('aws-cdk-lib/core')) {
        return false; // special case for core because it does not have a package.json  
    }
    const pkg = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), { encoding: 'utf-8' }));
    const separateModule = pkg['separate-module'];
    if (separateModule !== undefined) {
        return separateModule;
    }
    const maturity = pkg.maturity;
    if (maturity !== 'experimental' && maturity !== 'developer-preview') {
        return false;
    }
    // we're only interested in '@aws-cdk/' packages,
    // and those that are JSII-enabled
    return pkg.name.startsWith('@aws-cdk/') && !!pkg['jsii'];
}
function checkLeftAndRightForCfn(node) {
    // Checking the left and right allows capturing the CfnConstruct name even if the TSQualifiedName references a subtype like:
    //    xxx.CfnConstruct.subtype
    //    xxx.CfnConstruct.subtype.anothersubtype
    if (!node) {
        return undefined;
    }
    if (node.name?.startsWith('Cfn')) {
        if (node.name === node.parent.left.name) {
            // This is the scenario for a reference to CfnConstruct.subtype
            // In this case, it is not qualified with a barrel import, so we don't need to do anything. 
            return undefined;
        }
        return {
            name: node.name,
            location: node.parent.left.name,
        };
    }
    const right = checkLeftAndRightForCfn(node.right);
    const left = checkLeftAndRightForCfn(node.left);
    return right ?? left ?? undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52YWxpZC1jZm4taW1wb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludmFsaWQtY2ZuLWltcG9ydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsK0JBQStCO0FBQy9CLDZCQUE2QjtBQUU3QixJQUFJLGdCQUFnQixHQUVoQixFQUFFLENBQUM7QUFFUCxTQUFnQixNQUFNLENBQUMsT0FBeUI7SUFDOUMsaUZBQWlGO0lBQ2pGLHNGQUFzRjtJQUN0RixvRUFBb0U7SUFDcEUsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDO1FBQ3JGLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELE9BQU87UUFDTCxpQkFBaUIsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUN4QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQWUsQ0FBQztZQUM3QyxvR0FBb0c7WUFDcEcsa0NBQWtDO1lBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUMxQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssMEJBQTBCLEVBQUUsQ0FBQztvQkFDMUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7Z0JBQzVDLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxRQUFRLEtBQUssZUFBZSxFQUFFLENBQUM7Z0JBQ25FLDJJQUEySTtnQkFDM0ksT0FBTztZQUNULENBQUM7WUFFRCxNQUFNLFVBQVUsR0FBc0IsRUFBRSxDQUFDO1lBQ3pDLE1BQU0sWUFBWSxHQUFzQixFQUFFLENBQUM7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eyBJZGVudGlmaWVyLCBJbXBvcnRTcGVjaWZpZXIgfSBmcm9tICdlc3RyZWUnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxubGV0IG5hbWVzcGFjZUltcG9ydHM6IHtcbiAgW2tleTogc3RyaW5nXTogc3RyaW5nXG59ID0ge307XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoY29udGV4dDogUnVsZS5SdWxlQ29udGV4dCk6IFJ1bGUuTm9kZUxpc3RlbmVyIHtcbiAgLy8gVGhlIGZvcm1hdCBvZiBDZm4gaW1wb3J0cyBvbmx5IG1hdHRlcnMgZm9yIGFscGhhIHBhY2thZ2VzLCBzbyB0aGF0IHRoZXkgY2FuIGJlXG4gIC8vIGZvcm1hdHRlZCBjb3JyZWN0bHkgd2hlbiByZWxlYXNlZCBzZXBhcmF0ZWx5IGZvciBWMi4gVGhlIGxpbnRlciBydWxlIHNob3VsZCBvbmx5IGJlXG4gIC8vIGFwcGxpZWQgaWYgdGhlIGZpbGUgaXMgaW4gYW4gYWxwaGEgcGFja2FnZSwgb3IgaXQgaXMgYSB0ZXN0IGZpbGUuXG4gIGNvbnN0IGZpbGVuYW1lID0gY29udGV4dC5nZXRGaWxlbmFtZSgpO1xuICBpZiAoIWN1cnJlbnRGaWxlSXNJbkFscGhhUGFja2FnZShmaWxlbmFtZSkgJiYgIWZpbGVuYW1lLm1hdGNoKCd0ZXN0L3J1bGVzL2ZpeHR1cmVzJykpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICByZXR1cm4ge1xuICAgIEltcG9ydERlY2xhcmF0aW9uOiBub2RlID0+IHtcbiAgICAgIGNvbnN0IGxvY2F0aW9uID0gbm9kZS5zb3VyY2UudmFsdWUgYXMgc3RyaW5nO1xuICAgICAgLy8gU3RvcmUgYWxsIG9mIHRoZSAnaW1wb3J0ICogYXMgbmFtZSBmcm9tIGxvY2F0aW9uJyBpbXBvcnRzLCBzbyB0aGF0IHdlIGNhbiBjaGVjayB0aGUgbG9jYXRpb24gd2hlblxuICAgICAgLy8gd2UgZmluZCBuYW1lLkNmblhYWCByZWZlcmVuY2VzLlxuICAgICAgbm9kZS5zcGVjaWZpZXJzLmZvckVhY2goZSA9PiB7XG4gICAgICAgIGlmIChlLnR5cGUgPT09ICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInKSB7XG4gICAgICAgICAgbmFtZXNwYWNlSW1wb3J0c1tlLmxvY2FsLm5hbWVdID0gbG9jYXRpb247XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAobG9jYXRpb24uZW5kc1dpdGgoJ2dlbmVyYXRlZCcpIHx8IGxvY2F0aW9uID09PSAnQGF3cy1jZGsvY29yZScpIHtcbiAgICAgICAgLy8gSWYgaW1wb3J0aW5nIGRpcmVjdGx5IGZyb20gYSBnZW5lcmF0ZWQgZmlsZSwgdGhpcyBpcyBmaW5lLiBBbHNvIHdlIGtub3cgdGhhdCBhd3MtY2RrL2NvcmUgaXMgbm90IGV4cGVyaW1lbnRhbCwgc28gdGhhdCBpcyBmaW5lIGFzIHdlbGwuIFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNmbkltcG9ydHM6IEltcG9ydFNwZWNpZmllcltdID0gW107XG4gICAgICBjb25zdCBvdGhlckltcG9ydHM6IEltcG9ydFNwZWNpZmllcltdID0gW107XG4gICAgICBub2RlLnNwZWNpZmllcnMuZm9yRWFjaChlID0+IHtcbiAgICAgICAgaWYgKGUudHlwZSA9PT0gJ0ltcG9ydFNwZWNpZmllcicpIHtcbiAgICAgICAgICBpZiAoZS5pbXBvcnRlZC5uYW1lLnN0YXJ0c1dpdGgoJ0NmbicpKSB7XG4gICAgICAgICAgICBjZm5JbXBvcnRzLnB1c2goZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG90aGVySW1wb3J0cy5wdXNoKGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChjZm5JbXBvcnRzLmxlbmd0aCA+IDAgJiYgb3RoZXJJbXBvcnRzLmxlbmd0aCA+IDAgJiYgbG9jYXRpb24uc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgICAgIC8vIGltcG9ydCB7IENmblhYWCwgU29tZXRoaW5nRWxzZSwgQW5vdGhlclRoaW5nIH0gZnJvbSAnLi9zb21lL3JlbGF0aXZlL3BhdGgvbm90L2VuZGluZy9pbi9nZW5lcmF0ZWQnO1xuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbWVzc2FnZTogJ1RvIGFsbG93IHJld3JpdGluZyBpbXBvcnRzIHdoZW4gZ2VuZXJhdGluZyB2MiBleHBlcmltZW50YWwgcGFja2FnZXMsIGltcG9ydCBvZiBgJyArIGNmbkltcG9ydHMubWFwKGUgPT4gZS5pbXBvcnRlZC5uYW1lKS5qb2luKCcsICcpICsgJ2AgbXVzdCBiZSBzZXBhcmF0ZSBmcm9tIGltcG9ydCBvZiBgJyArIG90aGVySW1wb3J0cy5tYXAoZSA9PiBlLmltcG9ydGVkLm5hbWUpLmpvaW4oJywgJykgKyAnYCwgYW5kIGltcG9ydGVkIGZyb20gaXRzIHNwZWNpZmljIC5nZW5lcmF0ZWQgbG9jYXRpb24uJyxcbiAgICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY2ZuSW1wb3J0cy5sZW5ndGggPiAwICYmIGxvY2F0aW9uLnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgICAgICAvLyBpbXBvcnQgeyBDZm5YWFggfSBmcm9tICcuL3NvbWUvcmVsYXRpdmUvcGF0aC9ub3QvZW5kaW5nL2luL2dlbmVyYXRlZCc7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBtZXNzYWdlOiAnVG8gYWxsb3cgcmV3cml0aW5nIGltcG9ydHMgd2hlbiBnZW5lcmF0aW5nIHYyIGV4cGVyaW1lbnRhbCBwYWNrYWdlcywgaW1wb3J0IG9mIGAnICsgY2ZuSW1wb3J0cy5tYXAoZSA9PiBlLmltcG9ydGVkLm5hbWUpLmpvaW4oJywgJykgKyAnYCBtdXN0IGJlIGltcG9ydGVkIGZyb20gaXRzIHNwZWNpZmljIC5nZW5lcmF0ZWQgbG9jYXRpb24uJyxcbiAgICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY2ZuSW1wb3J0cy5sZW5ndGggPiAwICYmIG90aGVySW1wb3J0cy5sZW5ndGggPiAwICYmIGNoZWNrSWZJbXBvcnRlZExvY2F0aW9uSXNBbkFscGhhUGFja2FnZShsb2NhdGlvbiwgY29udGV4dC5nZXRGaWxlbmFtZSgpKSkge1xuICAgICAgICAvLyBpbXBvcnQgeyBDZm5YWFgsIFNvbWV0aGluZ0Vsc2UsIEFub3RoZXJUaGluZyB9IGZyb20gJ0Bhd3MtY2RrL2Fub3RoZXItYWxwaGEtcGFja2FnZSc7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBtZXNzYWdlOiAnVG8gYWxsb3cgcmV3cml0aW5nIGltcG9ydHMgd2hlbiBnZW5lcmF0aW5nIHYyIGV4cGVyaW1lbnRhbCBwYWNrYWdlcywgaW1wb3J0IG9mIGAnICsgY2ZuSW1wb3J0cy5tYXAoZSA9PiBlLmltcG9ydGVkLm5hbWUpLmpvaW4oJywgJykgKyAnYCBtdXN0IGJlIHNlcGFyYXRlIGZyb20gaW1wb3J0IG9mIGAnICsgb3RoZXJJbXBvcnRzLm1hcChlID0+IGUuaW1wb3J0ZWQubmFtZSkuam9pbignLCAnKSArICdgJyxcbiAgICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gVGhpcyBjYXB0dXJlcyB1c2luZyBgeHh4LkNmbkNvbnN0cnVjdGAgYXMgYW4gaWRlbnRpZmllclxuICAgIElkZW50aWZpZXI6IG5vZGUgPT4ge1xuICAgICAgY29uc3QgdHlwZUFubm90YXRpb24gPSAobm9kZSBhcyBhbnkpLnR5cGVBbm5vdGF0aW9uPy50eXBlQW5ub3RhdGlvbjtcbiAgICAgIGNvbnN0IHR5cGUgPSB0eXBlQW5ub3RhdGlvbj8udHlwZU5hbWU7XG4gICAgICBpZiAodHlwZT8udHlwZSA9PT0gJ1RTUXVhbGlmaWVkTmFtZScpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hlY2tMZWZ0QW5kUmlnaHRGb3JDZm4odHlwZSk7XG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICByZXBvcnRFcnJvcklmSW1wb3J0ZWRMb2NhdGlvbklzTm90VmFsaWQoY29udGV4dCwgbm9kZSwgcmVzdWx0Lm5hbWUsIHJlc3VsdC5sb2NhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChub2RlLm5hbWUuc3RhcnRzV2l0aCgnQ2ZuJykgJiYgbm9kZS5wYXJlbnQudHlwZSA9PT0gJ01lbWJlckV4cHJlc3Npb24nICYmIG5vZGUucGFyZW50Lm9iamVjdC50eXBlID09PSAnSWRlbnRpZmllcicpIHtcbiAgICAgICAgLy8gbmV3IHh4eC5DZm5Db25zdHJ1Y3QoKTtcbiAgICAgICAgcmVwb3J0RXJyb3JJZkltcG9ydGVkTG9jYXRpb25Jc05vdFZhbGlkKGNvbnRleHQsIG5vZGUsIG5vZGUubmFtZSwgbm9kZS5wYXJlbnQub2JqZWN0Lm5hbWUpO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlcG9ydEVycm9ySWZJbXBvcnRlZExvY2F0aW9uSXNOb3RWYWxpZChjb250ZXh0OiBSdWxlLlJ1bGVDb250ZXh0LCBub2RlOiBJZGVudGlmaWVyLCBuYW1lOiBzdHJpbmcsIGJhcnJlbEltcG9ydE5hbWU6IHN0cmluZykge1xuICBjb25zdCBsb2NhdGlvbiA9IG5hbWVzcGFjZUltcG9ydHNbYmFycmVsSW1wb3J0TmFtZV07XG4gIGlmICghbG9jYXRpb24pIHtcbiAgICAvLyBUaGlzIHNjZW5hcmlvIHNob3VsZCBub3QgaGFwcGVuLCBidXQgaWYgaXQgZG9lcywgd2UgZG9uJ3Qgd2FudCB1c2VycyB0byBydW4gaW50byB3ZWlyZCBydW50aW1lIGVycm9ycyBmcm9tIHRoZSBsaW50ZXIuXG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChsb2NhdGlvbi5lbmRzV2l0aCgnZ2VuZXJhdGVkJykgfHwgbG9jYXRpb24gPT09ICdAYXdzLWNkay9jb3JlJykge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAobG9jYXRpb24uc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgLy8gaW1wb3J0ICogYXMgbmFtZSBmcm9tICcuL3NvbWUvcmVsYXRpdmUvcGF0aC9ub3QvZW5kaW5nL2luL2dlbmVyYXRlZCc7IG5hbWUuQ2ZuQ29uc3RydWN0KCk7XG4gICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgbWVzc2FnZTogJ1RvIGFsbG93IHJld3JpdGluZyBpbXBvcnRzIHdoZW4gZ2VuZXJhdGluZyB2MiBleHBlcmltZW50YWwgcGFja2FnZXMsIGAnICsgbmFtZSArICdgIG11c3QgYmUgaW1wb3J0ZWQgYnkgbmFtZSBmcm9tIGl0cyBzcGVjaWZpYyAuZ2VuZXJhdGVkIGxvY2F0aW9uLicsXG4gICAgICBub2RlOiBub2RlLFxuICAgIH0pO1xuICB9IGVsc2UgaWYgKGNoZWNrSWZJbXBvcnRlZExvY2F0aW9uSXNBbkFscGhhUGFja2FnZShsb2NhdGlvbiwgY29udGV4dC5nZXRGaWxlbmFtZSgpKSkge1xuICAgIC8vIGltcG9ydCAqIGFzIG5hbWUgZnJvbSAnQGF3cy1jZGsvYW5vdGhlci1hbHBoYS1wYWNrYWdlJzsgbmFtZS5DZm5Db25zdHJ1Y3QoKTtcbiAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICBtZXNzYWdlOiAnVG8gYWxsb3cgcmV3cml0aW5nIGltcG9ydHMgd2hlbiBnZW5lcmF0aW5nIHYyIGV4cGVyaW1lbnRhbCBwYWNrYWdlcywgYCcgKyBuYW1lICsgJ2AgbXVzdCBiZSBpbXBvcnRlZCBieSBuYW1lIGFuZCBzZXBhcmF0ZSBmcm9tIG5vbi1MMSBpbXBvcnRzLCBzaW5jZSBpdCBpcyBiZWluZyBpbXBvcnRlZCBmcm9tIGFuIGV4cGVyaW1lbnRhbCBwYWNrYWdlOiAnICsgbG9jYXRpb24sXG4gICAgICBub2RlOiBub2RlLFxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGN1cnJlbnRGaWxlSXNJbkFscGhhUGFja2FnZShmaWxlbmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGZpbGVQYXRoU3BsaXQgPSBmaWxlbmFtZS5zcGxpdChwYXRoLnNlcCk7XG4gIGNvbnN0IGF3c0Nka05hbWVzcGFjZUluZGV4ID0gZmlsZVBhdGhTcGxpdC5maW5kSW5kZXgoZSA9PiBlLm1hdGNoKCdAYXdzLWNkaycpKVxuICBpZiAoYXdzQ2RrTmFtZXNwYWNlSW5kZXggIT09IC0xKSB7XG4gICAgY29uc3QgcGFja2FnZURpciA9IGZpbGVQYXRoU3BsaXQuc2xpY2UoMCwgYXdzQ2RrTmFtZXNwYWNlSW5kZXggKyAyKS5qb2luKHBhdGguc2VwKTtcbiAgICByZXR1cm4gaXNBbHBoYVBhY2thZ2UocGFja2FnZURpcik7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjaGVja0lmSW1wb3J0ZWRMb2NhdGlvbklzQW5BbHBoYVBhY2thZ2UobG9jYXRpb246IHN0cmluZywgY3VycmVudEZpbGVuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3Qgcm9vdERpciA9IGdldENka1Jvb3REaXIoY3VycmVudEZpbGVuYW1lKTtcbiAgaWYgKHJvb3REaXIpIHtcbiAgICBjb25zdCBwYWNrYWdlRGlyID0gcm9vdERpciArIGAvcGFja2FnZXMvJHtsb2NhdGlvbn1gO1xuICAgIHJldHVybiBpc0FscGhhUGFja2FnZShwYWNrYWdlRGlyKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldENka1Jvb3REaXIoZmlsZW5hbWU6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGZpbGVuYW1lU3BsaXQgPSBmaWxlbmFtZS5zcGxpdChwYXRoLnNlcCk7XG4gIC8vIGZvciB0ZXN0IGZpbGVzXG4gIGxldCByb290RGlySW5kZXggPSBmaWxlbmFtZVNwbGl0LmZpbmRJbmRleChlID0+IGUubWF0Y2goJ3Rvb2xzJykpO1xuXG4gIC8vIGZvciBwYWNrYWdlIGZpbGVzXG4gIGlmIChyb290RGlySW5kZXggPT09IC0xKSB7XG4gICAgcm9vdERpckluZGV4ID0gZmlsZW5hbWVTcGxpdC5maW5kSW5kZXgoZSA9PiBlLm1hdGNoKCdwYWNrYWdlcycpKTtcbiAgfVxuXG4gIGlmIChyb290RGlySW5kZXggIT09IC0xKSB7XG4gICAgcmV0dXJuIGZpbGVuYW1lU3BsaXQuc2xpY2UoMCwgcm9vdERpckluZGV4KS5qb2luKHBhdGguc2VwKTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBpc0FscGhhUGFja2FnZShwYWNrYWdlRGlyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKHBhY2thZ2VEaXIuZW5kc1dpdGgoJ2F3cy1jZGstbGliL2NvcmUnKSkge1xuICAgIHJldHVybiBmYWxzZTsgLy8gc3BlY2lhbCBjYXNlIGZvciBjb3JlIGJlY2F1c2UgaXQgZG9lcyBub3QgaGF2ZSBhIHBhY2thZ2UuanNvbiAgXG4gIH1cblxuICBjb25zdCBwa2cgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4ocGFja2FnZURpciwgJ3BhY2thZ2UuanNvbicpLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKTtcblxuICBjb25zdCBzZXBhcmF0ZU1vZHVsZSA9IHBrZ1snc2VwYXJhdGUtbW9kdWxlJ107XG4gIGlmIChzZXBhcmF0ZU1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHNlcGFyYXRlTW9kdWxlO1xuICB9XG5cbiAgY29uc3QgbWF0dXJpdHkgPSBwa2cubWF0dXJpdHk7XG4gIGlmIChtYXR1cml0eSAhPT0gJ2V4cGVyaW1lbnRhbCcgJiYgbWF0dXJpdHkgIT09ICdkZXZlbG9wZXItcHJldmlldycpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gd2UncmUgb25seSBpbnRlcmVzdGVkIGluICdAYXdzLWNkay8nIHBhY2thZ2VzLFxuICAvLyBhbmQgdGhvc2UgdGhhdCBhcmUgSlNJSS1lbmFibGVkXG4gIHJldHVybiBwa2cubmFtZS5zdGFydHNXaXRoKCdAYXdzLWNkay8nKSAmJiAhIXBrZ1snanNpaSddO1xufVxuXG5mdW5jdGlvbiBjaGVja0xlZnRBbmRSaWdodEZvckNmbihub2RlOiBhbnkpOiB7IG5hbWU6IHN0cmluZywgbG9jYXRpb246IHN0cmluZyB9IHwgdW5kZWZpbmVkIHtcbiAgLy8gQ2hlY2tpbmcgdGhlIGxlZnQgYW5kIHJpZ2h0IGFsbG93cyBjYXB0dXJpbmcgdGhlIENmbkNvbnN0cnVjdCBuYW1lIGV2ZW4gaWYgdGhlIFRTUXVhbGlmaWVkTmFtZSByZWZlcmVuY2VzIGEgc3VidHlwZSBsaWtlOlxuICAvLyAgICB4eHguQ2ZuQ29uc3RydWN0LnN1YnR5cGVcbiAgLy8gICAgeHh4LkNmbkNvbnN0cnVjdC5zdWJ0eXBlLmFub3RoZXJzdWJ0eXBlXG4gIGlmICghbm9kZSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKG5vZGUubmFtZT8uc3RhcnRzV2l0aCgnQ2ZuJykpIHtcbiAgICBpZiAobm9kZS5uYW1lID09PSBub2RlLnBhcmVudC5sZWZ0Lm5hbWUpIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIHNjZW5hcmlvIGZvciBhIHJlZmVyZW5jZSB0byBDZm5Db25zdHJ1Y3Quc3VidHlwZVxuICAgICAgLy8gSW4gdGhpcyBjYXNlLCBpdCBpcyBub3QgcXVhbGlmaWVkIHdpdGggYSBiYXJyZWwgaW1wb3J0LCBzbyB3ZSBkb24ndCBuZWVkIHRvIGRvIGFueXRoaW5nLiBcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBub2RlLm5hbWUsXG4gICAgICBsb2NhdGlvbjogbm9kZS5wYXJlbnQubGVmdC5uYW1lLFxuICAgIH07XG4gIH1cblxuICBjb25zdCByaWdodCA9IGNoZWNrTGVmdEFuZFJpZ2h0Rm9yQ2ZuKG5vZGUucmlnaHQpO1xuICBjb25zdCBsZWZ0ID0gY2hlY2tMZWZ0QW5kUmlnaHRGb3JDZm4obm9kZS5sZWZ0KTtcblxuICByZXR1cm4gcmlnaHQgPz8gbGVmdCA/PyB1bmRlZmluZWQ7XG59XG4iXX0=