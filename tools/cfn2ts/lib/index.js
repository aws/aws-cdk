"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cfnSpec = require("@aws-cdk/cfnspec");
const fs = require("fs-extra");
const augmentation_generator_1 = require("./augmentation-generator");
const canned_metrics_generator_1 = require("./canned-metrics-generator");
const codegen_1 = require("./codegen");
const genspec_1 = require("./genspec");
async function default_1(scopes, outPath, options = {}) {
    if (outPath !== '.') {
        await fs.mkdirp(outPath);
    }
    if (typeof scopes === 'string') {
        scopes = [scopes];
    }
    for (const scope of scopes) {
        const spec = cfnSpec.filteredSpecification(s => s.startsWith(`${scope}::`));
        if (Object.keys(spec.ResourceTypes).length === 0) {
            throw new Error(`No resource was found for scope ${scope}`);
        }
        const name = genspec_1.packageName(scope);
        const affix = computeAffix(scope, scopes);
        const generator = new codegen_1.default(name, spec, affix, options);
        generator.emitCode();
        await generator.save(outPath);
        const augs = new augmentation_generator_1.AugmentationGenerator(name, spec, affix);
        if (augs.emitCode()) {
            await augs.save(outPath);
        }
        const canned = new canned_metrics_generator_1.CannedMetricsGenerator(name, scope);
        if (canned.generate()) {
            await canned.save(outPath);
        }
    }
}
exports.default = default_1;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUE0QztBQUM1QywrQkFBK0I7QUFDL0IscUVBQWlFO0FBQ2pFLHlFQUFvRTtBQUNwRSx1Q0FBZ0U7QUFDaEUsdUNBQXdDO0FBRXpCLEtBQUssb0JBQVUsTUFBeUIsRUFBRSxPQUFlLEVBQUUsVUFBZ0MsRUFBRztJQUMzRyxJQUFJLE9BQU8sS0FBSyxHQUFHLEVBQUU7UUFBRSxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7S0FBRTtJQUVsRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtRQUFFLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQUU7SUFFdEQsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7UUFDMUIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM1RSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDaEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUM3RDtRQUNELE1BQU0sSUFBSSxHQUFHLHFCQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUUxQyxNQUFNLFNBQVMsR0FBRyxJQUFJLGlCQUFhLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDaEUsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3JCLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU5QixNQUFNLElBQUksR0FBRyxJQUFJLDhDQUFxQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDbkIsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFCO1FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxpREFBc0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkQsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDckIsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzVCO0tBQ0Y7QUFDSCxDQUFDO0FBM0JELDRCQTJCQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBUyxZQUFZLENBQUMsS0FBYSxFQUFFLFNBQW1CO0lBQ3RELElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDMUMsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNWLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ2hDLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUNsQyxPQUFPLE9BQU8sQ0FBQztLQUNoQjtJQUNELE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNmblNwZWMgZnJvbSAnQGF3cy1jZGsvY2Zuc3BlYyc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBBdWdtZW50YXRpb25HZW5lcmF0b3IgfSBmcm9tICcuL2F1Z21lbnRhdGlvbi1nZW5lcmF0b3InO1xuaW1wb3J0IHsgQ2FubmVkTWV0cmljc0dlbmVyYXRvciB9IGZyb20gJy4vY2FubmVkLW1ldHJpY3MtZ2VuZXJhdG9yJztcbmltcG9ydCBDb2RlR2VuZXJhdG9yLCB7IENvZGVHZW5lcmF0b3JPcHRpb25zIH0gZnJvbSAnLi9jb2RlZ2VuJztcbmltcG9ydCB7IHBhY2thZ2VOYW1lIH0gZnJvbSAnLi9nZW5zcGVjJztcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24oc2NvcGVzOiBzdHJpbmcgfCBzdHJpbmdbXSwgb3V0UGF0aDogc3RyaW5nLCBvcHRpb25zOiBDb2RlR2VuZXJhdG9yT3B0aW9ucyA9IHsgfSk6IFByb21pc2U8dm9pZD4ge1xuICBpZiAob3V0UGF0aCAhPT0gJy4nKSB7IGF3YWl0IGZzLm1rZGlycChvdXRQYXRoKTsgfVxuXG4gIGlmICh0eXBlb2Ygc2NvcGVzID09PSAnc3RyaW5nJykgeyBzY29wZXMgPSBbc2NvcGVzXTsgfVxuXG4gIGZvciAoY29uc3Qgc2NvcGUgb2Ygc2NvcGVzKSB7XG4gICAgY29uc3Qgc3BlYyA9IGNmblNwZWMuZmlsdGVyZWRTcGVjaWZpY2F0aW9uKHMgPT4gcy5zdGFydHNXaXRoKGAke3Njb3BlfTo6YCkpO1xuICAgIGlmIChPYmplY3Qua2V5cyhzcGVjLlJlc291cmNlVHlwZXMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyByZXNvdXJjZSB3YXMgZm91bmQgZm9yIHNjb3BlICR7c2NvcGV9YCk7XG4gICAgfVxuICAgIGNvbnN0IG5hbWUgPSBwYWNrYWdlTmFtZShzY29wZSk7XG4gICAgY29uc3QgYWZmaXggPSBjb21wdXRlQWZmaXgoc2NvcGUsIHNjb3Blcyk7XG5cbiAgICBjb25zdCBnZW5lcmF0b3IgPSBuZXcgQ29kZUdlbmVyYXRvcihuYW1lLCBzcGVjLCBhZmZpeCwgb3B0aW9ucyk7XG4gICAgZ2VuZXJhdG9yLmVtaXRDb2RlKCk7XG4gICAgYXdhaXQgZ2VuZXJhdG9yLnNhdmUob3V0UGF0aCk7XG5cbiAgICBjb25zdCBhdWdzID0gbmV3IEF1Z21lbnRhdGlvbkdlbmVyYXRvcihuYW1lLCBzcGVjLCBhZmZpeCk7XG4gICAgaWYgKGF1Z3MuZW1pdENvZGUoKSkge1xuICAgICAgYXdhaXQgYXVncy5zYXZlKG91dFBhdGgpO1xuICAgIH1cblxuICAgIGNvbnN0IGNhbm5lZCA9IG5ldyBDYW5uZWRNZXRyaWNzR2VuZXJhdG9yKG5hbWUsIHNjb3BlKTtcbiAgICBpZiAoY2FubmVkLmdlbmVyYXRlKCkpIHtcbiAgICAgIGF3YWl0IGNhbm5lZC5zYXZlKG91dFBhdGgpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEZpbmRzIGFuIGFmZml4IGZvciBjbGFzcyBuYW1lcyBnZW5lcmF0ZWQgZm9yIGEgc2NvcGUsIGdpdmVuIGFsbCB0aGUgc2NvcGVzIHRoYXQgc2hhcmUgdGhlIHNhbWUgcGFja2FnZS5cbiAqIEBwYXJhbSBzY29wZSAgICAgdGhlIHNjb3BlIGZvciB3aGljaCBhbiBhZmZpeCBpcyBuZWVkZWQgKGUuZzogQVdTOjpBcGlHYXRld2F5VjIpXG4gKiBAcGFyYW0gYWxsU2NvcGVzIGFsbCB0aGUgc2NvcGVzIGhvc3RlZCBpbiB0aGUgcGFja2FnZSAoZS5nOiBbXCJBV1M6OkFwaUdhdGV3YXlcIiwgXCJBV1M6OkFwaUdhdGV3YXlWMlwiXSlcbiAqIEByZXR1cm5zIHRoZSBhZmZpeCAoZS5nOiBcIlYyXCIpLCBpZiBhbnksIG9yIGFuIGVtcHR5IHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gY29tcHV0ZUFmZml4KHNjb3BlOiBzdHJpbmcsIGFsbFNjb3Blczogc3RyaW5nW10pOiBzdHJpbmcge1xuICBpZiAoYWxsU2NvcGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBjb25zdCBwYXJ0cyA9IHNjb3BlLm1hdGNoKC9eKC4rKShWXFxkKykkLyk7XG4gIGlmICghcGFydHMpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgY29uc3QgWywgcm9vdCwgdmVyc2lvbl0gPSBwYXJ0cztcbiAgaWYgKGFsbFNjb3Blcy5pbmRleE9mKHJvb3QpICE9PSAtMSkge1xuICAgIHJldHVybiB2ZXJzaW9uO1xuICB9XG4gIHJldHVybiAnJztcbn1cbiJdfQ==