"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAll = void 0;
const path = require("path");
const cfnSpec = require("@aws-cdk/cfnspec");
const pkglint = require("@aws-cdk/pkglint");
const fs = require("fs-extra");
const augmentation_generator_1 = require("./augmentation-generator");
const canned_metrics_generator_1 = require("./canned-metrics-generator");
const codegen_1 = require("./codegen");
const genspec_1 = require("./genspec");
async function generate(scopes, outPath, options = {}) {
    const result = {
        outputFiles: [],
        resources: {},
    };
    if (outPath !== '.') {
        await fs.mkdirp(outPath);
    }
    if (scopes === '*') {
        scopes = cfnSpec.namespaces();
    }
    else if (typeof scopes === 'string') {
        scopes = [scopes];
    }
    for (const scope of scopes) {
        const spec = cfnSpec.filteredSpecification(s => s.startsWith(`${scope}::`));
        if (Object.keys(spec.ResourceTypes).length === 0) {
            throw new Error(`No resource was found for scope ${scope}`);
        }
        const name = (0, genspec_1.packageName)(scope);
        const affix = computeAffix(scope, scopes);
        const generator = new codegen_1.default(name, spec, affix, options);
        generator.emitCode();
        await generator.save(outPath);
        result.outputFiles.push(generator.outputFile);
        result.resources = {
            ...result.resources,
            ...generator.resources,
        };
        const augs = new augmentation_generator_1.AugmentationGenerator(name, spec, affix, options);
        if (augs.emitCode()) {
            await augs.save(outPath);
            result.outputFiles.push(augs.outputFile);
        }
        const canned = new canned_metrics_generator_1.CannedMetricsGenerator(name, scope);
        if (canned.generate()) {
            await canned.save(outPath);
            result.outputFiles.push(canned.outputFile);
        }
    }
    return result;
}
exports.default = generate;
/**
 * Generates L1s for all submodules of a monomodule. Modules to generate are
 * chosen based on the contents of the `scopeMapPath` file. This is intended for
 * use in generated L1s in aws-cdk-lib.
 * @param outPath The root directory to generate L1s in
 * @param param1  Options
 * @returns       A ModuleMap containing the ModuleDefinition and CFN scopes for each generated module.
 */
async function generateAll(outPath, { scopeMapPath, ...options }) {
    const cfnScopes = cfnSpec.namespaces();
    const moduleMap = await readScopeMap(scopeMapPath);
    // Make sure all scopes have their own dedicated package/namespace.
    // Adds new submodules for new namespaces.
    for (const scope of cfnScopes) {
        const moduleDefinition = pkglint.createModuleDefinitionFromCfnNamespace(scope);
        const currentScopes = moduleMap[moduleDefinition.moduleName]?.scopes ?? [];
        // remove dupes
        const newScopes = [...new Set([...currentScopes, scope])];
        // Add new modules to module map and return to caller
        moduleMap[moduleDefinition.moduleName] = {
            name: moduleDefinition.moduleName,
            definition: moduleDefinition,
            scopes: newScopes,
            resources: {},
            files: [],
        };
    }
    await Promise.all(Object.entries(moduleMap).map(async ([name, { scopes }]) => {
        const packagePath = path.join(outPath, name);
        const sourcePath = path.join(packagePath, 'lib');
        const isCore = name === 'core';
        const { outputFiles, resources } = await generate(scopes, sourcePath, {
            ...options,
            coreImport: isCore ? '.' : options.coreImport,
        });
        // Add generated resources and files to module in map
        moduleMap[name].resources = resources;
        moduleMap[name].files = outputFiles;
    }));
    return moduleMap;
}
exports.generateAll = generateAll;
/**
 * Finds an affix for class names generated for a scope, given all the scopes that share the same package.
 * @param scope     the scope for which an affix is needed (e.g: AWS::ApiGatewayV2)
 * @param allScopes all the scopes hosted in the package (e.g: ["AWS::ApiGateway", "AWS::ApiGatewayV2"])
 * @returns the affix (e.g: "V2"), if any, or an empty string.
 */
function computeAffix(scope, allScopes) {
    if (allScopes.length === 1) {
        return '';
    }
    const parts = scope.match(/^(.+)(V\d+)$/);
    if (!parts) {
        return '';
    }
    const [, root, version] = parts;
    if (allScopes.indexOf(root) !== -1) {
        return version;
    }
    return '';
}
/**
 * Reads the scope map from a file and transforms it into the type we need.
 */
async function readScopeMap(filepath) {
    const scopeMap = await fs.readJson(filepath);
    return Object.entries(scopeMap)
        .reduce((accum, [name, moduleScopes]) => {
        return {
            ...accum,
            [name]: {
                name,
                scopes: moduleScopes,
                resources: {},
                files: [],
            },
        };
    }, {});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0IsNENBQTRDO0FBQzVDLDRDQUE0QztBQUM1QywrQkFBK0I7QUFDL0IscUVBQWdHO0FBQ2hHLHlFQUFvRTtBQUNwRSx1Q0FBZ0U7QUFDaEUsdUNBQXdDO0FBT3pCLEtBQUssVUFBVSxRQUFRLENBQ3BDLE1BQXlCLEVBQ3pCLE9BQWUsRUFDZixVQUFnRSxFQUFHO0lBRW5FLE1BQU0sTUFBTSxHQUFtQjtRQUM3QixXQUFXLEVBQUUsRUFBRTtRQUNmLFNBQVMsRUFBRSxFQUFFO0tBQ2QsQ0FBQztJQUVGLElBQUksT0FBTyxLQUFLLEdBQUcsRUFBRTtRQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUFFO0lBRWxELElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRTtRQUNsQixNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQy9CO1NBQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7UUFDckMsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDbkI7SUFFRCxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtRQUMxQixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzVFLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNoRCxNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQzdEO1FBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBQSxxQkFBVyxFQUFDLEtBQUssQ0FBQyxDQUFD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T0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztTQUM1QixNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxPQUFPO1lBQ0wsR0FBRyxLQUFLO1lBQ1IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDTixJQUFJO2dCQUNKLE1BQU0sRUFBRSxZQUFZO2dCQUNwQixTQUFTLEVBQUUsRUFBRTtnQkFDYixLQUFLLEVBQUUsRUFBRTthQUNWO1NBQ0YsQ0FBQztJQUNKLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNYLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgY2ZuU3BlYyBmcm9tICdAYXdzLWNkay9jZm5zcGVjJztcbmltcG9ydCAqIGFzIHBrZ2xpbnQgZnJvbSAnQGF3cy1jZGsvcGtnbGludCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBBdWdtZW50YXRpb25HZW5lcmF0b3IsIEF1Z21lbnRhdGlvbnNHZW5lcmF0b3JPcHRpb25zIH0gZnJvbSAnLi9hdWdtZW50YXRpb24tZ2VuZXJhdG9yJztcbmltcG9ydCB7IENhbm5lZE1ldHJpY3NHZW5lcmF0b3IgfSBmcm9tICcuL2Nhbm5lZC1tZXRyaWNzLWdlbmVyYXRvcic7XG5pbXBvcnQgQ29kZUdlbmVyYXRvciwgeyBDb2RlR2VuZXJhdG9yT3B0aW9ucyB9IGZyb20gJy4vY29kZWdlbic7XG5pbXBvcnQgeyBwYWNrYWdlTmFtZSB9IGZyb20gJy4vZ2Vuc3BlYyc7XG5cbmludGVyZmFjZSBHZW5lcmF0ZU91dHB1dCB7XG4gIG91dHB1dEZpbGVzOiBzdHJpbmdbXTtcbiAgcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZShcbiAgc2NvcGVzOiBzdHJpbmcgfCBzdHJpbmdbXSxcbiAgb3V0UGF0aDogc3RyaW5nLFxuICBvcHRpb25zOiBDb2RlR2VuZXJhdG9yT3B0aW9ucyAmIEF1Z21lbnRhdGlvbnNHZW5lcmF0b3JPcHRpb25zID0geyB9LFxuKTogUHJvbWlzZTxHZW5lcmF0ZU91dHB1dD4ge1xuICBjb25zdCByZXN1bHQ6IEdlbmVyYXRlT3V0cHV0ID0ge1xuICAgIG91dHB1dEZpbGVzOiBbXSxcbiAgICByZXNvdXJjZXM6IHt9LFxuICB9O1xuXG4gIGlmIChvdXRQYXRoICE9PSAnLicpIHsgYXdhaXQgZnMubWtkaXJwKG91dFBhdGgpOyB9XG5cbiAgaWYgKHNjb3BlcyA9PT0gJyonKSB7XG4gICAgc2NvcGVzID0gY2ZuU3BlYy5uYW1lc3BhY2VzKCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHNjb3BlcyA9PT0gJ3N0cmluZycpIHtcbiAgICBzY29wZXMgPSBbc2NvcGVzXTtcbiAgfVxuXG4gIGZvciAoY29uc3Qgc2NvcGUgb2Ygc2NvcGVzKSB7XG4gICAgY29uc3Qgc3BlYyA9IGNmblNwZWMuZmlsdGVyZWRTcGVjaWZpY2F0aW9uKHMgPT4gcy5zdGFydHNXaXRoKGAke3Njb3BlfTo6YCkpO1xuICAgIGlmIChPYmplY3Qua2V5cyhzcGVjLlJlc291cmNlVHlwZXMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyByZXNvdXJjZSB3YXMgZm91bmQgZm9yIHNjb3BlICR7c2NvcGV9YCk7XG4gICAgfVxuICAgIGNvbnN0IG5hbWUgPSBwYWNrYWdlTmFtZShzY29wZSk7XG4gICAgY29uc3QgYWZmaXggPSBjb21wdXRlQWZmaXgoc2NvcGUsIHNjb3Blcyk7XG5cbiAgICBjb25zdCBnZW5lcmF0b3IgPSBuZXcgQ29kZUdlbmVyYXRvcihuYW1lLCBzcGVjLCBhZmZpeCwgb3B0aW9ucyk7XG4gICAgZ2VuZXJhdG9yLmVtaXRDb2RlKCk7XG4gICAgYXdhaXQgZ2VuZXJhdG9yLnNhdmUob3V0UGF0aCk7XG4gICAgcmVzdWx0Lm91dHB1dEZpbGVzLnB1c2goZ2VuZXJhdG9yLm91dHB1dEZpbGUpO1xuICAgIHJlc3VsdC5yZXNvdXJjZXMgPSB7XG4gICAgICAuLi5yZXN1bHQucmVzb3VyY2VzLFxuICAgICAgLi4uZ2VuZXJhdG9yLnJlc291cmNlcyxcbiAgICB9O1xuXG4gICAgY29uc3QgYXVncyA9IG5ldyBBdWdtZW50YXRpb25HZW5lcmF0b3IobmFtZSwgc3BlYywgYWZmaXgsIG9wdGlvbnMpO1xuICAgIGlmIChhdWdzLmVtaXRDb2RlKCkpIHtcbiAgICAgIGF3YWl0IGF1Z3Muc2F2ZShvdXRQYXRoKTtcbiAgICAgIHJlc3VsdC5vdXRwdXRGaWxlcy5wdXNoKGF1Z3Mub3V0cHV0RmlsZSk7XG4gICAgfVxuXG4gICAgY29uc3QgY2FubmVkID0gbmV3IENhbm5lZE1ldHJpY3NHZW5lcmF0b3IobmFtZSwgc2NvcGUpO1xuICAgIGlmIChjYW5uZWQuZ2VuZXJhdGUoKSkge1xuICAgICAgYXdhaXQgY2FubmVkLnNhdmUob3V0UGF0aCk7XG4gICAgICByZXN1bHQub3V0cHV0RmlsZXMucHVzaChjYW5uZWQub3V0cHV0RmlsZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIHRoZSBnZW5lcmF0ZUFsbCBmdW5jdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyYXRlQWxsT3B0aW9ucyBleHRlbmRzIENvZGVHZW5lcmF0b3JPcHRpb25zLCBBdWdtZW50YXRpb25zR2VuZXJhdG9yT3B0aW9ucyB7XG4gIC8qKlxuICAgICogUGF0aCBvZiB0aGUgZmlsZSBjb250YWluaW5nIHRoZSBtYXAgb2YgbW9kdWxlIG5hbWVzIHRvIHRoZWlyIENGTiBTY29wZXNcbiAgICAqL1xuICBzY29wZU1hcFBhdGg6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGRhdGEgc3RydWN0dXJlIGhvbGRpbmcgaW5mb3JtYXRpb24gYWJvdXQgYSBnZW5lcmF0ZWQgbW9kdWxlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1vZHVsZU1hcEVudHJ5IHtcbiAgbmFtZTogc3RyaW5nO1xuICBkZWZpbml0aW9uPzogcGtnbGludC5Nb2R1bGVEZWZpbml0aW9uO1xuICBzY29wZXM6IHN0cmluZ1tdO1xuICByZXNvdXJjZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIGZpbGVzOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBBIGRhdGEgc3RydWN0dXJlIGhvbGRpbmcgaW5mb3JtYXRpb24gYWJvdXQgZ2VuZXJhdGVkIG1vZHVsZXMuXG4gKiBJdCBtYXBzIG1vZHVsZSBuYW1lcyB0byB0aGVpciBmdWxsIG1vZHVsZSBkZWZpbml0aW9uLCBDRk4gc2NvcGVzLCByZXNvdXJjZXMgYW5kIGdlbmVyYXRlZCBmaWxlcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNb2R1bGVNYXAge1xuICBbbW9kdWxlTmFtZTogc3RyaW5nXTogTW9kdWxlTWFwRW50cnlcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgTDFzIGZvciBhbGwgc3VibW9kdWxlcyBvZiBhIG1vbm9tb2R1bGUuIE1vZHVsZXMgdG8gZ2VuZXJhdGUgYXJlXG4gKiBjaG9zZW4gYmFzZWQgb24gdGhlIGNvbnRlbnRzIG9mIHRoZSBgc2NvcGVNYXBQYXRoYCBmaWxlLiBUaGlzIGlzIGludGVuZGVkIGZvclxuICogdXNlIGluIGdlbmVyYXRlZCBMMXMgaW4gYXdzLWNkay1saWIuXG4gKiBAcGFyYW0gb3V0UGF0aCBUaGUgcm9vdCBkaXJlY3RvcnkgdG8gZ2VuZXJhdGUgTDFzIGluXG4gKiBAcGFyYW0gcGFyYW0xICBPcHRpb25zXG4gKiBAcmV0dXJucyAgICAgICBBIE1vZHVsZU1hcCBjb250YWluaW5nIHRoZSBNb2R1bGVEZWZpbml0aW9uIGFuZCBDRk4gc2NvcGVzIGZvciBlYWNoIGdlbmVyYXRlZCBtb2R1bGUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZUFsbChcbiAgb3V0UGF0aDogc3RyaW5nLFxuICB7IHNjb3BlTWFwUGF0aCwgLi4ub3B0aW9ucyB9OiBHZW5lcmF0ZUFsbE9wdGlvbnMsXG4pOiBQcm9taXNlPE1vZHVsZU1hcD4ge1xuICBjb25zdCBjZm5TY29wZXMgPSBjZm5TcGVjLm5hbWVzcGFjZXMoKTtcbiAgY29uc3QgbW9kdWxlTWFwID0gYXdhaXQgcmVhZFNjb3BlTWFwKHNjb3BlTWFwUGF0aCk7XG5cbiAgLy8gTWFrZSBzdXJlIGFsbCBzY29wZXMgaGF2ZSB0aGVpciBvd24gZGVkaWNhdGVkIHBhY2thZ2UvbmFtZXNwYWNlLlxuICAvLyBBZGRzIG5ldyBzdWJtb2R1bGVzIGZvciBuZXcgbmFtZXNwYWNlcy5cbiAgZm9yIChjb25zdCBzY29wZSBvZiBjZm5TY29wZXMpIHtcbiAgICBjb25zdCBtb2R1bGVEZWZpbml0aW9uID0gcGtnbGludC5jcmVhdGVNb2R1bGVEZWZpbml0aW9uRnJvbUNmbk5hbWVzcGFjZShzY29wZSk7XG4gICAgY29uc3QgY3VycmVudFNjb3BlcyA9IG1vZHVsZU1hcFttb2R1bGVEZWZpbml0aW9uLm1vZHVsZU5hbWVdPy5zY29wZXMgPz8gW107XG4gICAgLy8gcmVtb3ZlIGR1cGVzXG4gICAgY29uc3QgbmV3U2NvcGVzID0gWy4uLm5ldyBTZXQoWy4uLmN1cnJlbnRTY29wZXMsIHNjb3BlXSldO1xuXG4gICAgLy8gQWRkIG5ldyBtb2R1bGVzIHRvIG1vZHVsZSBtYXAgYW5kIHJldHVybiB0byBjYWxsZXJcbiAgICBtb2R1bGVNYXBbbW9kdWxlRGVmaW5pdGlvbi5tb2R1bGVOYW1lXSA9IHtcbiAgICAgIG5hbWU6IG1vZHVsZURlZmluaXRpb24ubW9kdWxlTmFtZSxcbiAgICAgIGRlZmluaXRpb246IG1vZHVsZURlZmluaXRpb24sXG4gICAgICBzY29wZXM6IG5ld1Njb3BlcyxcbiAgICAgIHJlc291cmNlczoge30sXG4gICAgICBmaWxlczogW10sXG4gICAgfTtcbiAgfVxuXG4gIGF3YWl0IFByb21pc2UuYWxsKE9iamVjdC5lbnRyaWVzKG1vZHVsZU1hcCkubWFwKFxuICAgIGFzeW5jIChbbmFtZSwgeyBzY29wZXMgfV0pID0+IHtcbiAgICAgIGNvbnN0IHBhY2thZ2VQYXRoID0gcGF0aC5qb2luKG91dFBhdGgsIG5hbWUpO1xuICAgICAgY29uc3Qgc291cmNlUGF0aCA9IHBhdGguam9pbihwYWNrYWdlUGF0aCwgJ2xpYicpO1xuXG4gICAgICBjb25zdCBpc0NvcmUgPSBuYW1lID09PSAnY29yZSc7XG4gICAgICBjb25zdCB7IG91dHB1dEZpbGVzLCByZXNvdXJjZXMgfSA9IGF3YWl0IGdlbmVyYXRlKHNjb3Blcywgc291cmNlUGF0aCwge1xuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICBjb3JlSW1wb3J0OiBpc0NvcmUgPyAnLicgOiBvcHRpb25zLmNvcmVJbXBvcnQsXG4gICAgICB9KTtcblxuICAgICAgLy8gQWRkIGdlbmVyYXRlZCByZXNvdXJjZXMgYW5kIGZpbGVzIHRvIG1vZHVsZSBpbiBtYXBcbiAgICAgIG1vZHVsZU1hcFtuYW1lXS5yZXNvdXJjZXMgPSByZXNvdXJjZXM7XG4gICAgICBtb2R1bGVNYXBbbmFtZV0uZmlsZXMgPSBvdXRwdXRGaWxlcztcbiAgICB9KSk7XG5cbiAgcmV0dXJuIG1vZHVsZU1hcDtcbn1cblxuLyoqXG4gKiBGaW5kcyBhbiBhZmZpeCBmb3IgY2xhc3MgbmFtZXMgZ2VuZXJhdGVkIGZvciBhIHNjb3BlLCBnaXZlbiBhbGwgdGhlIHNjb3BlcyB0aGF0IHNoYXJlIHRoZSBzYW1lIHBhY2thZ2UuXG4gKiBAcGFyYW0gc2NvcGUgICAgIHRoZSBzY29wZSBmb3Igd2hpY2ggYW4gYWZmaXggaXMgbmVlZGVkIChlLmc6IEFXUzo6QXBpR2F0ZXdheVYyKVxuICogQHBhcmFtIGFsbFNjb3BlcyBhbGwgdGhlIHNjb3BlcyBob3N0ZWQgaW4gdGhlIHBhY2thZ2UgKGUuZzogW1wiQVdTOjpBcGlHYXRld2F5XCIsIFwiQVdTOjpBcGlHYXRld2F5VjJcIl0pXG4gKiBAcmV0dXJucyB0aGUgYWZmaXggKGUuZzogXCJWMlwiKSwgaWYgYW55LCBvciBhbiBlbXB0eSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVBZmZpeChzY29wZTogc3RyaW5nLCBhbGxTY29wZXM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgaWYgKGFsbFNjb3Blcy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgY29uc3QgcGFydHMgPSBzY29wZS5tYXRjaCgvXiguKykoVlxcZCspJC8pO1xuICBpZiAoIXBhcnRzKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGNvbnN0IFssIHJvb3QsIHZlcnNpb25dID0gcGFydHM7XG4gIGlmIChhbGxTY29wZXMuaW5kZXhPZihyb290KSAhPT0gLTEpIHtcbiAgICByZXR1cm4gdmVyc2lvbjtcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogUmVhZHMgdGhlIHNjb3BlIG1hcCBmcm9tIGEgZmlsZSBhbmQgdHJhbnNmb3JtcyBpdCBpbnRvIHRoZSB0eXBlIHdlIG5lZWQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlYWRTY29wZU1hcChmaWxlcGF0aDogc3RyaW5nKSA6IFByb21pc2U8TW9kdWxlTWFwPiB7XG4gIGNvbnN0IHNjb3BlTWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSBhd2FpdCBmcy5yZWFkSnNvbihmaWxlcGF0aCk7XG4gIHJldHVybiBPYmplY3QuZW50cmllcyhzY29wZU1hcClcbiAgICAucmVkdWNlKChhY2N1bSwgW25hbWUsIG1vZHVsZVNjb3Blc10pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmFjY3VtLFxuICAgICAgICBbbmFtZV06IHtcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIHNjb3BlczogbW9kdWxlU2NvcGVzLFxuICAgICAgICAgIHJlc291cmNlczoge30sXG4gICAgICAgICAgZmlsZXM6IFtdLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9LCB7fSk7XG59XG4iXX0=