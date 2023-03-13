"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynthUtils = void 0;
const fs = require("fs");
const path = require("path");
const core = require("@aws-cdk/core");
class SynthUtils {
    /**
     * Returns the cloud assembly template artifact for a stack.
     */
    static synthesize(stack, options = {}) {
        // always synthesize against the root (be it an App or whatever) so all artifacts will be included
        const assembly = synthesizeApp(stack, options);
        return stripNewStyleSynthCfnElements(assembly.getStackArtifact(stack.artifactId));
    }
    /**
     * Synthesizes the stack and returns the resulting CloudFormation template.
     */
    static toCloudFormation(stack, options = {}) {
        const synth = this._synthesizeWithNested(stack, options);
        if (isStackArtifact(synth)) {
            return synth.template;
        }
        else {
            return synth;
        }
    }
    /**
     * @returns Returns a subset of the synthesized CloudFormation template (only specific resource types).
     */
    static subset(stack, options) {
        const template = this.toCloudFormation(stack);
        if (template.Resources) {
            for (const [key, resource] of Object.entries(template.Resources)) {
                if (options.resourceTypes && !options.resourceTypes.includes(resource.Type)) {
                    delete template.Resources[key];
                }
            }
        }
        return template;
    }
    /**
     * Synthesizes the stack and returns a `CloudFormationStackArtifact` which can be inspected.
     * Supports nested stacks as well as normal stacks.
     *
     * @return CloudFormationStackArtifact for normal stacks or the actual template for nested stacks
     * @internal
     */
    static _synthesizeWithNested(stack, options = {}) {
        // always synthesize against the root (be it an App or whatever) so all artifacts will be included
        const assembly = synthesizeApp(stack, options);
        // if this is a nested stack (it has a parent), then just read the template as a string
        if (stack.nestedStackParent) {
            return JSON.parse(fs.readFileSync(path.join(assembly.directory, stack.templateFile)).toString('utf-8'));
        }
        return stripNewStyleSynthCfnElements(assembly.getStackArtifact(stack.artifactId));
    }
}
exports.SynthUtils = SynthUtils;
/**
 * Synthesizes the app in which a stack resides and returns the cloud assembly object.
 */
function synthesizeApp(stack, options) {
    const root = stack.node.root;
    if (!core.Stage.isStage(root)) {
        throw new Error('unexpected: all stacks must be part of a Stage or an App');
    }
    // to support incremental assertions (i.e. "expect(stack).toNotContainSomething(); doSomething(); expect(stack).toContainSomthing()")
    const force = true;
    return root.synth({
        force,
        ...options,
    });
}
function stripNewStyleSynthCfnElements(stackArtifact) {
    const synthesizedTemplate = stackArtifact.template;
    // if new-style synthesis is not explicitly set, remove the extra generated Rule and Parameter from the synthesized template,
    // to avoid changing many tests that rely on the template being exactly what it is
    delete synthesizedTemplate?.Rules?.CheckBootstrapVersion;
    if (Object.keys(synthesizedTemplate?.Rules ?? {}).length === 0) {
        delete synthesizedTemplate?.Rules;
    }
    delete synthesizedTemplate?.Parameters?.BootstrapVersion;
    if (Object.keys(synthesizedTemplate?.Parameters ?? {}).length === 0) {
        delete synthesizedTemplate?.Parameters;
    }
    return stackArtifact;
}
function isStackArtifact(x) {
    return 'template' in x;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGgtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzeW50aC11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLHNDQUFzQztBQUd0QyxNQUFhLFVBQVU7SUFDckI7O09BRUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQWlCLEVBQUUsVUFBc0MsRUFBRztRQUNuRixrR0FBa0c7UUFDbEcsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvQyxPQUFPLDZCQUE2QixDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBaUIsRUFBRSxVQUFzQyxFQUFHO1FBQ3pGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekQsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDMUIsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDO1NBQ3ZCO2FBQU07WUFDTCxPQUFPLEtBQUssQ0FBQztTQUNkO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFpQixFQUFFLE9BQXNCO1FBQzVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNoRSxJQUFJLE9BQU8sQ0FBQyxhQUFhLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBRSxRQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNwRixPQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2hDO2FBQ0Y7U0FDRjtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMscUJBQXFCLENBQUMsS0FBaUIsRUFBRSxVQUFzQyxFQUFHO1FBQzlGLGtHQUFrRztRQUNsRyxNQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRS9DLHVGQUF1RjtRQUN2RixJQUFJLEtBQUssQ0FBQyxpQkFBaUIsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDekc7UUFFRCxPQUFPLDZCQUE2QixDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNwRixDQUFDO0NBQ0Y7QUF4REQsZ0NBd0RDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGFBQWEsQ0FBQyxLQUFpQixFQUFFLE9BQW1DO0lBQzNFLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7S0FDN0U7SUFFRCxxSUFBcUk7SUFDckksTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBRW5CLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNoQixLQUFLO1FBQ0wsR0FBRyxPQUFPO0tBQ1gsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQVMsNkJBQTZCLENBQUMsYUFBZ0Q7SUFDckYsTUFBTSxtQkFBbUIsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBRW5ELDZIQUE2SDtJQUM3SCxrRkFBa0Y7SUFDbEYsT0FBTyxtQkFBbUIsRUFBRSxLQUFLLEVBQUUscUJBQXFCLENBQUM7SUFDekQsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzlELE9BQU8sbUJBQW1CLEVBQUUsS0FBSyxDQUFDO0tBQ25DO0lBQ0QsT0FBTyxtQkFBbUIsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLENBQUM7SUFDekQsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ25FLE9BQU8sbUJBQW1CLEVBQUUsVUFBVSxDQUFDO0tBQ3hDO0lBRUQsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQztBQVNELFNBQVMsZUFBZSxDQUFDLENBQVM7SUFDaEMsT0FBTyxVQUFVLElBQUksQ0FBQyxDQUFDO0FBQ3pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgY29yZSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5cbmV4cG9ydCBjbGFzcyBTeW50aFV0aWxzIHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGNsb3VkIGFzc2VtYmx5IHRlbXBsYXRlIGFydGlmYWN0IGZvciBhIHN0YWNrLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzeW50aGVzaXplKHN0YWNrOiBjb3JlLlN0YWNrLCBvcHRpb25zOiBjb3JlLlN0YWdlU3ludGhlc2lzT3B0aW9ucyA9IHsgfSk6IGN4YXBpLkNsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdCB7XG4gICAgLy8gYWx3YXlzIHN5bnRoZXNpemUgYWdhaW5zdCB0aGUgcm9vdCAoYmUgaXQgYW4gQXBwIG9yIHdoYXRldmVyKSBzbyBhbGwgYXJ0aWZhY3RzIHdpbGwgYmUgaW5jbHVkZWRcbiAgICBjb25zdCBhc3NlbWJseSA9IHN5bnRoZXNpemVBcHAoc3RhY2ssIG9wdGlvbnMpO1xuICAgIHJldHVybiBzdHJpcE5ld1N0eWxlU3ludGhDZm5FbGVtZW50cyhhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KHN0YWNrLmFydGlmYWN0SWQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW50aGVzaXplcyB0aGUgc3RhY2sgYW5kIHJldHVybnMgdGhlIHJlc3VsdGluZyBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdG9DbG91ZEZvcm1hdGlvbihzdGFjazogY29yZS5TdGFjaywgb3B0aW9uczogY29yZS5TdGFnZVN5bnRoZXNpc09wdGlvbnMgPSB7IH0pOiBhbnkge1xuICAgIGNvbnN0IHN5bnRoID0gdGhpcy5fc3ludGhlc2l6ZVdpdGhOZXN0ZWQoc3RhY2ssIG9wdGlvbnMpO1xuICAgIGlmIChpc1N0YWNrQXJ0aWZhY3Qoc3ludGgpKSB7XG4gICAgICByZXR1cm4gc3ludGgudGVtcGxhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzeW50aDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgUmV0dXJucyBhIHN1YnNldCBvZiB0aGUgc3ludGhlc2l6ZWQgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUgKG9ubHkgc3BlY2lmaWMgcmVzb3VyY2UgdHlwZXMpLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzdWJzZXQoc3RhY2s6IGNvcmUuU3RhY2ssIG9wdGlvbnM6IFN1YnNldE9wdGlvbnMpOiBhbnkge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy50b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKTtcbiAgICBpZiAodGVtcGxhdGUuUmVzb3VyY2VzKSB7XG4gICAgICBmb3IgKGNvbnN0IFtrZXksIHJlc291cmNlXSBvZiBPYmplY3QuZW50cmllcyh0ZW1wbGF0ZS5SZXNvdXJjZXMpKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnJlc291cmNlVHlwZXMgJiYgIW9wdGlvbnMucmVzb3VyY2VUeXBlcy5pbmNsdWRlcygocmVzb3VyY2UgYXMgYW55KS5UeXBlKSkge1xuICAgICAgICAgIGRlbGV0ZSB0ZW1wbGF0ZS5SZXNvdXJjZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW50aGVzaXplcyB0aGUgc3RhY2sgYW5kIHJldHVybnMgYSBgQ2xvdWRGb3JtYXRpb25TdGFja0FydGlmYWN0YCB3aGljaCBjYW4gYmUgaW5zcGVjdGVkLlxuICAgKiBTdXBwb3J0cyBuZXN0ZWQgc3RhY2tzIGFzIHdlbGwgYXMgbm9ybWFsIHN0YWNrcy5cbiAgICpcbiAgICogQHJldHVybiBDbG91ZEZvcm1hdGlvblN0YWNrQXJ0aWZhY3QgZm9yIG5vcm1hbCBzdGFja3Mgb3IgdGhlIGFjdHVhbCB0ZW1wbGF0ZSBmb3IgbmVzdGVkIHN0YWNrc1xuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgX3N5bnRoZXNpemVXaXRoTmVzdGVkKHN0YWNrOiBjb3JlLlN0YWNrLCBvcHRpb25zOiBjb3JlLlN0YWdlU3ludGhlc2lzT3B0aW9ucyA9IHsgfSk6IGN4YXBpLkNsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdCB8IG9iamVjdCB7XG4gICAgLy8gYWx3YXlzIHN5bnRoZXNpemUgYWdhaW5zdCB0aGUgcm9vdCAoYmUgaXQgYW4gQXBwIG9yIHdoYXRldmVyKSBzbyBhbGwgYXJ0aWZhY3RzIHdpbGwgYmUgaW5jbHVkZWRcbiAgICBjb25zdCBhc3NlbWJseSA9IHN5bnRoZXNpemVBcHAoc3RhY2ssIG9wdGlvbnMpO1xuXG4gICAgLy8gaWYgdGhpcyBpcyBhIG5lc3RlZCBzdGFjayAoaXQgaGFzIGEgcGFyZW50KSwgdGhlbiBqdXN0IHJlYWQgdGhlIHRlbXBsYXRlIGFzIGEgc3RyaW5nXG4gICAgaWYgKHN0YWNrLm5lc3RlZFN0YWNrUGFyZW50KSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKGFzc2VtYmx5LmRpcmVjdG9yeSwgc3RhY2sudGVtcGxhdGVGaWxlKSkudG9TdHJpbmcoJ3V0Zi04JykpO1xuICAgIH1cblxuICAgIHJldHVybiBzdHJpcE5ld1N0eWxlU3ludGhDZm5FbGVtZW50cyhhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KHN0YWNrLmFydGlmYWN0SWQpKTtcbiAgfVxufVxuXG4vKipcbiAqIFN5bnRoZXNpemVzIHRoZSBhcHAgaW4gd2hpY2ggYSBzdGFjayByZXNpZGVzIGFuZCByZXR1cm5zIHRoZSBjbG91ZCBhc3NlbWJseSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHN5bnRoZXNpemVBcHAoc3RhY2s6IGNvcmUuU3RhY2ssIG9wdGlvbnM6IGNvcmUuU3RhZ2VTeW50aGVzaXNPcHRpb25zKTogY3hhcGkuQ2xvdWRBc3NlbWJseSB7XG4gIGNvbnN0IHJvb3QgPSBzdGFjay5ub2RlLnJvb3Q7XG4gIGlmICghY29yZS5TdGFnZS5pc1N0YWdlKHJvb3QpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bmV4cGVjdGVkOiBhbGwgc3RhY2tzIG11c3QgYmUgcGFydCBvZiBhIFN0YWdlIG9yIGFuIEFwcCcpO1xuICB9XG5cbiAgLy8gdG8gc3VwcG9ydCBpbmNyZW1lbnRhbCBhc3NlcnRpb25zIChpLmUuIFwiZXhwZWN0KHN0YWNrKS50b05vdENvbnRhaW5Tb21ldGhpbmcoKTsgZG9Tb21ldGhpbmcoKTsgZXhwZWN0KHN0YWNrKS50b0NvbnRhaW5Tb210aGluZygpXCIpXG4gIGNvbnN0IGZvcmNlID0gdHJ1ZTtcblxuICByZXR1cm4gcm9vdC5zeW50aCh7XG4gICAgZm9yY2UsXG4gICAgLi4ub3B0aW9ucyxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHN0cmlwTmV3U3R5bGVTeW50aENmbkVsZW1lbnRzKHN0YWNrQXJ0aWZhY3Q6IGN4YXBpLkNsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdCk6IGN4YXBpLkNsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdCB7XG4gIGNvbnN0IHN5bnRoZXNpemVkVGVtcGxhdGUgPSBzdGFja0FydGlmYWN0LnRlbXBsYXRlO1xuXG4gIC8vIGlmIG5ldy1zdHlsZSBzeW50aGVzaXMgaXMgbm90IGV4cGxpY2l0bHkgc2V0LCByZW1vdmUgdGhlIGV4dHJhIGdlbmVyYXRlZCBSdWxlIGFuZCBQYXJhbWV0ZXIgZnJvbSB0aGUgc3ludGhlc2l6ZWQgdGVtcGxhdGUsXG4gIC8vIHRvIGF2b2lkIGNoYW5naW5nIG1hbnkgdGVzdHMgdGhhdCByZWx5IG9uIHRoZSB0ZW1wbGF0ZSBiZWluZyBleGFjdGx5IHdoYXQgaXQgaXNcbiAgZGVsZXRlIHN5bnRoZXNpemVkVGVtcGxhdGU/LlJ1bGVzPy5DaGVja0Jvb3RzdHJhcFZlcnNpb247XG4gIGlmIChPYmplY3Qua2V5cyhzeW50aGVzaXplZFRlbXBsYXRlPy5SdWxlcyA/PyB7fSkubGVuZ3RoID09PSAwKSB7XG4gICAgZGVsZXRlIHN5bnRoZXNpemVkVGVtcGxhdGU/LlJ1bGVzO1xuICB9XG4gIGRlbGV0ZSBzeW50aGVzaXplZFRlbXBsYXRlPy5QYXJhbWV0ZXJzPy5Cb290c3RyYXBWZXJzaW9uO1xuICBpZiAoT2JqZWN0LmtleXMoc3ludGhlc2l6ZWRUZW1wbGF0ZT8uUGFyYW1ldGVycyA/PyB7fSkubGVuZ3RoID09PSAwKSB7XG4gICAgZGVsZXRlIHN5bnRoZXNpemVkVGVtcGxhdGU/LlBhcmFtZXRlcnM7XG4gIH1cblxuICByZXR1cm4gc3RhY2tBcnRpZmFjdDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdWJzZXRPcHRpb25zIHtcbiAgLyoqXG4gICAqIE1hdGNoIGFsbCByZXNvdXJjZXMgb2YgdGhlIGdpdmVuIHR5cGVcbiAgICovXG4gIHJlc291cmNlVHlwZXM/OiBzdHJpbmdbXTtcbn1cblxuZnVuY3Rpb24gaXNTdGFja0FydGlmYWN0KHg6IG9iamVjdCk6IHggaXMgY3hhcGkuQ2xvdWRGb3JtYXRpb25TdGFja0FydGlmYWN0IHtcbiAgcmV0dXJuICd0ZW1wbGF0ZScgaW4geDtcbn0iXX0=