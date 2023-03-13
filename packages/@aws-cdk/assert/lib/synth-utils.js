"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynthUtils = void 0;
const fs = require("fs");
const path = require("path");
const core = require("aws-cdk-lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGgtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzeW50aC11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLG9DQUFvQztBQUdwQyxNQUFhLFVBQVU7SUFDckI7O09BRUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQWlCLEVBQUUsVUFBc0MsRUFBRztRQUNuRixrR0FBa0c7UUFDbEcsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMvQyxPQUFPLDZCQUE2QixDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBaUIsRUFBRSxVQUFzQyxFQUFHO1FBQ3pGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekQsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDMUIsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDO1NBQ3ZCO2FBQU07WUFDTCxPQUFPLEtBQUssQ0FBQztTQUNkO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFpQixFQUFFLE9BQXNCO1FBQzVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNoRSxJQUFJLE9BQU8sQ0FBQyxhQUFhLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBRSxRQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNwRixPQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2hDO2FBQ0Y7U0FDRjtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMscUJBQXFCLENBQUMsS0FBaUIsRUFBRSxVQUFzQyxFQUFHO1FBQzlGLGtHQUFrRztRQUNsRyxNQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRS9DLHVGQUF1RjtRQUN2RixJQUFJLEtBQUssQ0FBQyxpQkFBaUIsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDekc7UUFFRCxPQUFPLDZCQUE2QixDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNwRixDQUFDO0NBQ0Y7QUF4REQsZ0NBd0RDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGFBQWEsQ0FBQyxLQUFpQixFQUFFLE9BQW1DO0lBQzNFLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7S0FDN0U7SUFFRCxxSUFBcUk7SUFDckksTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBRW5CLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNoQixLQUFLO1FBQ0wsR0FBRyxPQUFPO0tBQ1gsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQVMsNkJBQTZCLENBQUMsYUFBZ0Q7SUFDckYsTUFBTSxtQkFBbUIsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBRW5ELDZIQUE2SDtJQUM3SCxrRkFBa0Y7SUFDbEYsT0FBTyxtQkFBbUIsRUFBRSxLQUFLLEVBQUUscUJBQXFCLENBQUM7SUFDekQsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzlELE9BQU8sbUJBQW1CLEVBQUUsS0FBSyxDQUFDO0tBQ25DO0lBQ0QsT0FBTyxtQkFBbUIsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLENBQUM7SUFDekQsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ25FLE9BQU8sbUJBQW1CLEVBQUUsVUFBVSxDQUFDO0tBQ3hDO0lBRUQsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQztBQVNELFNBQVMsZUFBZSxDQUFDLENBQVM7SUFDaEMsT0FBTyxVQUFVLElBQUksQ0FBQyxDQUFDO0FBQ3pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgY29yZSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdhd3MtY2RrLWxpYi9jeC1hcGknO1xuXG5leHBvcnQgY2xhc3MgU3ludGhVdGlscyB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjbG91ZCBhc3NlbWJseSB0ZW1wbGF0ZSBhcnRpZmFjdCBmb3IgYSBzdGFjay5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3ludGhlc2l6ZShzdGFjazogY29yZS5TdGFjaywgb3B0aW9uczogY29yZS5TdGFnZVN5bnRoZXNpc09wdGlvbnMgPSB7IH0pOiBjeGFwaS5DbG91ZEZvcm1hdGlvblN0YWNrQXJ0aWZhY3Qge1xuICAgIC8vIGFsd2F5cyBzeW50aGVzaXplIGFnYWluc3QgdGhlIHJvb3QgKGJlIGl0IGFuIEFwcCBvciB3aGF0ZXZlcikgc28gYWxsIGFydGlmYWN0cyB3aWxsIGJlIGluY2x1ZGVkXG4gICAgY29uc3QgYXNzZW1ibHkgPSBzeW50aGVzaXplQXBwKHN0YWNrLCBvcHRpb25zKTtcbiAgICByZXR1cm4gc3RyaXBOZXdTdHlsZVN5bnRoQ2ZuRWxlbWVudHMoYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChzdGFjay5hcnRpZmFjdElkKSk7XG4gIH1cblxuICAvKipcbiAgICogU3ludGhlc2l6ZXMgdGhlIHN0YWNrIGFuZCByZXR1cm5zIHRoZSByZXN1bHRpbmcgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRvQ2xvdWRGb3JtYXRpb24oc3RhY2s6IGNvcmUuU3RhY2ssIG9wdGlvbnM6IGNvcmUuU3RhZ2VTeW50aGVzaXNPcHRpb25zID0geyB9KTogYW55IHtcbiAgICBjb25zdCBzeW50aCA9IHRoaXMuX3N5bnRoZXNpemVXaXRoTmVzdGVkKHN0YWNrLCBvcHRpb25zKTtcbiAgICBpZiAoaXNTdGFja0FydGlmYWN0KHN5bnRoKSkge1xuICAgICAgcmV0dXJuIHN5bnRoLnRlbXBsYXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3ludGg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBzdWJzZXQgb2YgdGhlIHN5bnRoZXNpemVkIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIChvbmx5IHNwZWNpZmljIHJlc291cmNlIHR5cGVzKS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc3Vic2V0KHN0YWNrOiBjb3JlLlN0YWNrLCBvcHRpb25zOiBTdWJzZXRPcHRpb25zKTogYW55IHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudG9DbG91ZEZvcm1hdGlvbihzdGFjayk7XG4gICAgaWYgKHRlbXBsYXRlLlJlc291cmNlcykge1xuICAgICAgZm9yIChjb25zdCBba2V5LCByZXNvdXJjZV0gb2YgT2JqZWN0LmVudHJpZXModGVtcGxhdGUuUmVzb3VyY2VzKSkge1xuICAgICAgICBpZiAob3B0aW9ucy5yZXNvdXJjZVR5cGVzICYmICFvcHRpb25zLnJlc291cmNlVHlwZXMuaW5jbHVkZXMoKHJlc291cmNlIGFzIGFueSkuVHlwZSkpIHtcbiAgICAgICAgICBkZWxldGUgdGVtcGxhdGUuUmVzb3VyY2VzW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH1cblxuICAvKipcbiAgICogU3ludGhlc2l6ZXMgdGhlIHN0YWNrIGFuZCByZXR1cm5zIGEgYENsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdGAgd2hpY2ggY2FuIGJlIGluc3BlY3RlZC5cbiAgICogU3VwcG9ydHMgbmVzdGVkIHN0YWNrcyBhcyB3ZWxsIGFzIG5vcm1hbCBzdGFja3MuXG4gICAqXG4gICAqIEByZXR1cm4gQ2xvdWRGb3JtYXRpb25TdGFja0FydGlmYWN0IGZvciBub3JtYWwgc3RhY2tzIG9yIHRoZSBhY3R1YWwgdGVtcGxhdGUgZm9yIG5lc3RlZCBzdGFja3NcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIF9zeW50aGVzaXplV2l0aE5lc3RlZChzdGFjazogY29yZS5TdGFjaywgb3B0aW9uczogY29yZS5TdGFnZVN5bnRoZXNpc09wdGlvbnMgPSB7IH0pOiBjeGFwaS5DbG91ZEZvcm1hdGlvblN0YWNrQXJ0aWZhY3QgfCBvYmplY3Qge1xuICAgIC8vIGFsd2F5cyBzeW50aGVzaXplIGFnYWluc3QgdGhlIHJvb3QgKGJlIGl0IGFuIEFwcCBvciB3aGF0ZXZlcikgc28gYWxsIGFydGlmYWN0cyB3aWxsIGJlIGluY2x1ZGVkXG4gICAgY29uc3QgYXNzZW1ibHkgPSBzeW50aGVzaXplQXBwKHN0YWNrLCBvcHRpb25zKTtcblxuICAgIC8vIGlmIHRoaXMgaXMgYSBuZXN0ZWQgc3RhY2sgKGl0IGhhcyBhIHBhcmVudCksIHRoZW4ganVzdCByZWFkIHRoZSB0ZW1wbGF0ZSBhcyBhIHN0cmluZ1xuICAgIGlmIChzdGFjay5uZXN0ZWRTdGFja1BhcmVudCkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksIHN0YWNrLnRlbXBsYXRlRmlsZSkpLnRvU3RyaW5nKCd1dGYtOCcpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyaXBOZXdTdHlsZVN5bnRoQ2ZuRWxlbWVudHMoYXNzZW1ibHkuZ2V0U3RhY2tBcnRpZmFjdChzdGFjay5hcnRpZmFjdElkKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTeW50aGVzaXplcyB0aGUgYXBwIGluIHdoaWNoIGEgc3RhY2sgcmVzaWRlcyBhbmQgcmV0dXJucyB0aGUgY2xvdWQgYXNzZW1ibHkgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBzeW50aGVzaXplQXBwKHN0YWNrOiBjb3JlLlN0YWNrLCBvcHRpb25zOiBjb3JlLlN0YWdlU3ludGhlc2lzT3B0aW9ucyk6IGN4YXBpLkNsb3VkQXNzZW1ibHkge1xuICBjb25zdCByb290ID0gc3RhY2subm9kZS5yb290O1xuICBpZiAoIWNvcmUuU3RhZ2UuaXNTdGFnZShyb290KSkge1xuICAgIHRocm93IG5ldyBFcnJvcigndW5leHBlY3RlZDogYWxsIHN0YWNrcyBtdXN0IGJlIHBhcnQgb2YgYSBTdGFnZSBvciBhbiBBcHAnKTtcbiAgfVxuXG4gIC8vIHRvIHN1cHBvcnQgaW5jcmVtZW50YWwgYXNzZXJ0aW9ucyAoaS5lLiBcImV4cGVjdChzdGFjaykudG9Ob3RDb250YWluU29tZXRoaW5nKCk7IGRvU29tZXRoaW5nKCk7IGV4cGVjdChzdGFjaykudG9Db250YWluU29tdGhpbmcoKVwiKVxuICBjb25zdCBmb3JjZSA9IHRydWU7XG5cbiAgcmV0dXJuIHJvb3Quc3ludGgoe1xuICAgIGZvcmNlLFxuICAgIC4uLm9wdGlvbnMsXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzdHJpcE5ld1N0eWxlU3ludGhDZm5FbGVtZW50cyhzdGFja0FydGlmYWN0OiBjeGFwaS5DbG91ZEZvcm1hdGlvblN0YWNrQXJ0aWZhY3QpOiBjeGFwaS5DbG91ZEZvcm1hdGlvblN0YWNrQXJ0aWZhY3Qge1xuICBjb25zdCBzeW50aGVzaXplZFRlbXBsYXRlID0gc3RhY2tBcnRpZmFjdC50ZW1wbGF0ZTtcblxuICAvLyBpZiBuZXctc3R5bGUgc3ludGhlc2lzIGlzIG5vdCBleHBsaWNpdGx5IHNldCwgcmVtb3ZlIHRoZSBleHRyYSBnZW5lcmF0ZWQgUnVsZSBhbmQgUGFyYW1ldGVyIGZyb20gdGhlIHN5bnRoZXNpemVkIHRlbXBsYXRlLFxuICAvLyB0byBhdm9pZCBjaGFuZ2luZyBtYW55IHRlc3RzIHRoYXQgcmVseSBvbiB0aGUgdGVtcGxhdGUgYmVpbmcgZXhhY3RseSB3aGF0IGl0IGlzXG4gIGRlbGV0ZSBzeW50aGVzaXplZFRlbXBsYXRlPy5SdWxlcz8uQ2hlY2tCb290c3RyYXBWZXJzaW9uO1xuICBpZiAoT2JqZWN0LmtleXMoc3ludGhlc2l6ZWRUZW1wbGF0ZT8uUnVsZXMgPz8ge30pLmxlbmd0aCA9PT0gMCkge1xuICAgIGRlbGV0ZSBzeW50aGVzaXplZFRlbXBsYXRlPy5SdWxlcztcbiAgfVxuICBkZWxldGUgc3ludGhlc2l6ZWRUZW1wbGF0ZT8uUGFyYW1ldGVycz8uQm9vdHN0cmFwVmVyc2lvbjtcbiAgaWYgKE9iamVjdC5rZXlzKHN5bnRoZXNpemVkVGVtcGxhdGU/LlBhcmFtZXRlcnMgPz8ge30pLmxlbmd0aCA9PT0gMCkge1xuICAgIGRlbGV0ZSBzeW50aGVzaXplZFRlbXBsYXRlPy5QYXJhbWV0ZXJzO1xuICB9XG5cbiAgcmV0dXJuIHN0YWNrQXJ0aWZhY3Q7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3Vic2V0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBNYXRjaCBhbGwgcmVzb3VyY2VzIG9mIHRoZSBnaXZlbiB0eXBlXG4gICAqL1xuICByZXNvdXJjZVR5cGVzPzogc3RyaW5nW107XG59XG5cbmZ1bmN0aW9uIGlzU3RhY2tBcnRpZmFjdCh4OiBvYmplY3QpOiB4IGlzIGN4YXBpLkNsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdCB7XG4gIHJldHVybiAndGVtcGxhdGUnIGluIHg7XG59Il19