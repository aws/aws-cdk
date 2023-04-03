"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructInfoFromStack = exports.constructInfoFromConstruct = void 0;
const app_1 = require("../app");
const stack_1 = require("../stack");
const stage_1 = require("../stage");
const ALLOWED_FQN_PREFIXES = [
    // SCOPES
    '@aws-cdk/', '@aws-cdk-containers/', '@aws-solutions-konstruk/', '@aws-solutions-constructs/', '@amzn/', '@cdklabs/',
    // PACKAGES
    'aws-rfdk.', 'aws-cdk-lib.',
];
/**
 * Symbol for accessing jsii runtime information
 *
 * Introduced in jsii 1.19.0, cdk 1.90.0.
 */
const JSII_RUNTIME_SYMBOL = Symbol.for('jsii.rtti');
function constructInfoFromConstruct(construct) {
    const jsiiRuntimeInfo = Object.getPrototypeOf(construct).constructor[JSII_RUNTIME_SYMBOL];
    if (typeof jsiiRuntimeInfo === 'object'
        && jsiiRuntimeInfo !== null
        && typeof jsiiRuntimeInfo.fqn === 'string'
        && typeof jsiiRuntimeInfo.version === 'string') {
        return { fqn: jsiiRuntimeInfo.fqn, version: jsiiRuntimeInfo.version };
    }
    else if (jsiiRuntimeInfo) {
        // There is something defined, but doesn't match our expectations. Fail fast and hard.
        throw new Error(`malformed jsii runtime info for construct: '${construct.node.path}'`);
    }
    return undefined;
}
exports.constructInfoFromConstruct = constructInfoFromConstruct;
/**
 * Add analytics data for any validation plugins that are used.
 * Since validation plugins are not constructs we have to handle them
 * as a special case
 */
function addValidationPluginInfo(stack, allConstructInfos) {
    let stage = stage_1.Stage.of(stack);
    let done = false;
    do {
        if (app_1.App.isApp(stage)) {
            done = true;
        }
        if (stage) {
            allConstructInfos.push(...stage.policyValidationBeta1.map(plugin => {
                return {
                    // the fqn can be in the format of `package.module.construct`
                    // those get pulled out into separate fields
                    fqn: `policyValidation.${plugin.name}`,
                    version: plugin.version ?? '0.0.0',
                };
            }));
            stage = stage_1.Stage.of(stage);
        }
    } while (!done && stage);
}
/**
 * For a given stack, walks the tree and finds the runtime info for all constructs within the tree.
 * Returns the unique list of construct info present in the stack,
 * as long as the construct fully-qualified names match the defined allow list.
 */
function constructInfoFromStack(stack) {
    const isDefined = (value) => value !== undefined;
    const allConstructInfos = constructsInStack(stack)
        .map(construct => constructInfoFromConstruct(construct))
        .filter(isDefined)
        .filter(info => ALLOWED_FQN_PREFIXES.find(prefix => info.fqn.startsWith(prefix)));
    // Adds the jsii runtime as a psuedo construct for reporting purposes.
    allConstructInfos.push({
        fqn: 'jsii-runtime.Runtime',
        version: getJsiiAgentVersion(),
    });
    addValidationPluginInfo(stack, allConstructInfos);
    // Filter out duplicate values
    const uniqKeys = new Set();
    return allConstructInfos.filter(construct => {
        const constructKey = `${construct.fqn}@${construct.version}`;
        const isDuplicate = uniqKeys.has(constructKey);
        uniqKeys.add(constructKey);
        return !isDuplicate;
    });
}
exports.constructInfoFromStack = constructInfoFromStack;
/**
 * Returns all constructs under the parent construct (including the parent),
 * stopping when it reaches a boundary of another stack (e.g., Stack, Stage, NestedStack).
 */
function constructsInStack(construct) {
    const constructs = [construct];
    construct.node.children
        .filter(child => !stage_1.Stage.isStage(child) && !stack_1.Stack.isStack(child))
        .forEach(child => constructs.push(...constructsInStack(child)));
    return constructs;
}
function getJsiiAgentVersion() {
    let jsiiAgent = process.env.JSII_AGENT;
    // if JSII_AGENT is not specified, we will assume this is a node.js runtime
    // and plug in our node.js version
    if (!jsiiAgent) {
        jsiiAgent = `node.js/${process.version}`;
    }
    // Sanitize the agent to remove characters which might mess with the downstream
    // prefix encoding & decoding. In particular the .NET jsii agent takes a form like:
    // DotNet/5.0.3/.NETCoreApp,Version=v3.1/1.0.0.0
    // The `,` in the above messes with the prefix decoding when reporting the analytics.
    jsiiAgent = jsiiAgent.replace(/[^a-z0-9.-/=_]/gi, '-');
    return jsiiAgent;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnVudGltZS1pbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGdDQUE2QjtBQUM3QixvQ0FBaUM7QUFDakMsb0NBQWlDO0FBRWpDLE1BQU0sb0JBQW9CLEdBQUc7SUFDM0IsU0FBUztJQUNULFdBQVcsRUFBRSxzQkFBc0IsRUFBRSwwQkFBMEIsRUFBRSw0QkFBNEIsRUFBRSxRQUFRLEVBQUUsV0FBVztJQUNwSCxXQUFXO0lBQ1gsV0FBVyxFQUFFLGNBQWM7Q0FDNUIsQ0FBQztBQUVGOzs7O0dBSUc7QUFDSCxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFVcEQsU0FBZ0IsMEJBQTBCLENBQUMsU0FBcUI7SUFDOUQsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUMxRixJQUFJLE9BQU8sZUFBZSxLQUFLLFFBQVE7V0FDbEMsZUFBZSxLQUFLLElBQUk7V0FDeEIsT0FBTyxlQUFlLENBQUMsR0FBRyxLQUFLLFFBQVE7V0FDdkMsT0FBTyxlQUFlLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtRQUNoRCxPQUFPLEVBQUUsR0FBRyxFQUFFLGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN2RTtTQUFNLElBQUksZUFBZSxFQUFFO1FBQzFCLHNGQUFzRjtRQUN0RixNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7S0FDeEY7SUFDRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBWkQsZ0VBWUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyx1QkFBdUIsQ0FBQyxLQUFZLEVBQUUsaUJBQWtDO0lBQy9F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LENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztJQUV2QywyRUFBMkU7SUFDM0Usa0NBQWtDO0lBQ2xDLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxTQUFTLEdBQUcsV0FBVyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDMUM7SUFFRCwrRUFBK0U7SUFDL0UsbUZBQW1GO0lBQ25GLGdEQUFnRDtJQUNoRCxxRkFBcUY7SUFDckYsU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFdkQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4uL2FwcCc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7IFN0YWdlIH0gZnJvbSAnLi4vc3RhZ2UnO1xuXG5jb25zdCBBTExPV0VEX0ZRTl9QUkVGSVhFUyA9IFtcbiAgLy8gU0NPUEVTXG4gICdAYXdzLWNkay8nLCAnQGF3cy1jZGstY29udGFpbmVycy8nLCAnQGF3cy1zb2x1dGlvbnMta29uc3RydWsvJywgJ0Bhd3Mtc29sdXRpb25zLWNvbnN0cnVjdHMvJywgJ0BhbXpuLycsICdAY2RrbGFicy8nLFxuICAvLyBQQUNLQUdFU1xuICAnYXdzLXJmZGsuJywgJ2F3cy1jZGstbGliLicsXG5dO1xuXG4vKipcbiAqIFN5bWJvbCBmb3IgYWNjZXNzaW5nIGpzaWkgcnVudGltZSBpbmZvcm1hdGlvblxuICpcbiAqIEludHJvZHVjZWQgaW4ganNpaSAxLjE5LjAsIGNkayAxLjkwLjAuXG4gKi9cbmNvbnN0IEpTSUlfUlVOVElNRV9TWU1CT0wgPSBTeW1ib2wuZm9yKCdqc2lpLnJ0dGknKTtcblxuLyoqXG4gKiBTb3VyY2UgaW5mb3JtYXRpb24gb24gYSBjb25zdHJ1Y3QgKGNsYXNzIGZxbiBhbmQgdmVyc2lvbilcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb25zdHJ1Y3RJbmZvIHtcbiAgcmVhZG9ubHkgZnFuOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHZlcnNpb246IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnN0cnVjdEluZm9Gcm9tQ29uc3RydWN0KGNvbnN0cnVjdDogSUNvbnN0cnVjdCk6IENvbnN0cnVjdEluZm8gfCB1bmRlZmluZWQge1xuICBjb25zdCBqc2lpUnVudGltZUluZm8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29uc3RydWN0KS5jb25zdHJ1Y3RvcltKU0lJX1JVTlRJTUVfU1lNQk9MXTtcbiAgaWYgKHR5cGVvZiBqc2lpUnVudGltZUluZm8gPT09ICdvYmplY3QnXG4gICAgJiYganNpaVJ1bnRpbWVJbmZvICE9PSBudWxsXG4gICAgJiYgdHlwZW9mIGpzaWlSdW50aW1lSW5mby5mcW4gPT09ICdzdHJpbmcnXG4gICAgJiYgdHlwZW9mIGpzaWlSdW50aW1lSW5mby52ZXJzaW9uID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB7IGZxbjoganNpaVJ1bnRpbWVJbmZvLmZxbiwgdmVyc2lvbjoganNpaVJ1bnRpbWVJbmZvLnZlcnNpb24gfTtcbiAgfSBlbHNlIGlmIChqc2lpUnVudGltZUluZm8pIHtcbiAgICAvLyBUaGVyZSBpcyBzb21ldGhpbmcgZGVmaW5lZCwgYnV0IGRvZXNuJ3QgbWF0Y2ggb3VyIGV4cGVjdGF0aW9ucy4gRmFpbCBmYXN0IGFuZCBoYXJkLlxuICAgIHRocm93IG5ldyBFcnJvcihgbWFsZm9ybWVkIGpzaWkgcnVudGltZSBpbmZvIGZvciBjb25zdHJ1Y3Q6ICcke2NvbnN0cnVjdC5ub2RlLnBhdGh9J2ApO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQWRkIGFuYWx5dGljcyBkYXRhIGZvciBhbnkgdmFsaWRhdGlvbiBwbHVnaW5zIHRoYXQgYXJlIHVzZWQuXG4gKiBTaW5jZSB2YWxpZGF0aW9uIHBsdWdpbnMgYXJlIG5vdCBjb25zdHJ1Y3RzIHdlIGhhdmUgdG8gaGFuZGxlIHRoZW1cbiAqIGFzIGEgc3BlY2lhbCBjYXNlXG4gKi9cbmZ1bmN0aW9uIGFkZFZhbGlkYXRpb25QbHVnaW5JbmZvKHN0YWNrOiBTdGFjaywgYWxsQ29uc3RydWN0SW5mb3M6IENvbnN0cnVjdEluZm9bXSk6IHZvaWQge1xuICBsZXQgc3RhZ2UgPSBTdGFnZS5vZihzdGFjayk7XG4gIGxldCBkb25lID0gZmFsc2U7XG4gIGRvIHtcbiAgICBpZiAoQXBwLmlzQXBwKHN0YWdlKSkge1xuICAgICAgZG9uZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzdGFnZSkge1xuICAgICAgYWxsQ29uc3RydWN0SW5mb3MucHVzaCguLi5zdGFnZS5wb2xpY3lWYWxpZGF0aW9uQmV0YTEubWFwKFxuICAgICAgICBwbHVnaW4gPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvLyB0aGUgZnFuIGNhbiBiZSBpbiB0aGUgZm9ybWF0IG9mIGBwYWNrYWdlLm1vZHVsZS5jb25zdHJ1Y3RgXG4gICAgICAgICAgICAvLyB0aG9zZSBnZXQgcHVsbGVkIG91dCBpbnRvIHNlcGFyYXRlIGZpZWxkc1xuICAgICAgICAgICAgZnFuOiBgcG9saWN5VmFsaWRhdGlvbi4ke3BsdWdpbi5uYW1lfWAsXG4gICAgICAgICAgICB2ZXJzaW9uOiBwbHVnaW4udmVyc2lvbiA/PyAnMC4wLjAnLFxuICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICApKTtcbiAgICAgIHN0YWdlID0gU3RhZ2Uub2Yoc3RhZ2UpO1xuICAgIH1cbiAgfSB3aGlsZSAoIWRvbmUgJiYgc3RhZ2UpO1xufVxuXG4vKipcbiAqIEZvciBhIGdpdmVuIHN0YWNrLCB3YWxrcyB0aGUgdHJlZSBhbmQgZmluZHMgdGhlIHJ1bnRpbWUgaW5mbyBmb3IgYWxsIGNvbnN0cnVjdHMgd2l0aGluIHRoZSB0cmVlLlxuICogUmV0dXJucyB0aGUgdW5pcXVlIGxpc3Qgb2YgY29uc3RydWN0IGluZm8gcHJlc2VudCBpbiB0aGUgc3RhY2ssXG4gKiBhcyBsb25nIGFzIHRoZSBjb25zdHJ1Y3QgZnVsbHktcXVhbGlmaWVkIG5hbWVzIG1hdGNoIHRoZSBkZWZpbmVkIGFsbG93IGxpc3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb25zdHJ1Y3RJbmZvRnJvbVN0YWNrKHN0YWNrOiBTdGFjayk6IENvbnN0cnVjdEluZm9bXSB7XG4gIGNvbnN0IGlzRGVmaW5lZCA9ICh2YWx1ZTogQ29uc3RydWN0SW5mbyB8IHVuZGVmaW5lZCk6IHZhbHVlIGlzIENvbnN0cnVjdEluZm8gPT4gdmFsdWUgIT09IHVuZGVmaW5lZDtcblxuICBjb25zdCBhbGxDb25zdHJ1Y3RJbmZvcyA9IGNvbnN0cnVjdHNJblN0YWNrKHN0YWNrKVxuICAgIC5tYXAoY29uc3RydWN0ID0+IGNvbnN0cnVjdEluZm9Gcm9tQ29uc3RydWN0KGNvbnN0cnVjdCkpXG4gICAgLmZpbHRlcihpc0RlZmluZWQpXG4gICAgLmZpbHRlcihpbmZvID0+IEFMTE9XRURfRlFOX1BSRUZJWEVTLmZpbmQocHJlZml4ID0+IGluZm8uZnFuLnN0YXJ0c1dpdGgocHJlZml4KSkpO1xuXG4gIC8vIEFkZHMgdGhlIGpzaWkgcnVudGltZSBhcyBhIHBzdWVkbyBjb25zdHJ1Y3QgZm9yIHJlcG9ydGluZyBwdXJwb3Nlcy5cbiAgYWxsQ29uc3RydWN0SW5mb3MucHVzaCh7XG4gICAgZnFuOiAnanNpaS1ydW50aW1lLlJ1bnRpbWUnLFxuICAgIHZlcnNpb246IGdldEpzaWlBZ2VudFZlcnNpb24oKSxcbiAgfSk7XG5cbiAgYWRkVmFsaWRhdGlvblBsdWdpbkluZm8oc3RhY2ssIGFsbENvbnN0cnVjdEluZm9zKTtcblxuICAvLyBGaWx0ZXIgb3V0IGR1cGxpY2F0ZSB2YWx1ZXNcbiAgY29uc3QgdW5pcUtleXMgPSBuZXcgU2V0KCk7XG4gIHJldHVybiBhbGxDb25zdHJ1Y3RJbmZvcy5maWx0ZXIoY29uc3RydWN0ID0+IHtcbiAgICBjb25zdCBjb25zdHJ1Y3RLZXkgPSBgJHtjb25zdHJ1Y3QuZnFufUAke2NvbnN0cnVjdC52ZXJzaW9ufWA7XG4gICAgY29uc3QgaXNEdXBsaWNhdGUgPSB1bmlxS2V5cy5oYXMoY29uc3RydWN0S2V5KTtcbiAgICB1bmlxS2V5cy5hZGQoY29uc3RydWN0S2V5KTtcbiAgICByZXR1cm4gIWlzRHVwbGljYXRlO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBjb25zdHJ1Y3RzIHVuZGVyIHRoZSBwYXJlbnQgY29uc3RydWN0IChpbmNsdWRpbmcgdGhlIHBhcmVudCksXG4gKiBzdG9wcGluZyB3aGVuIGl0IHJlYWNoZXMgYSBib3VuZGFyeSBvZiBhbm90aGVyIHN0YWNrIChlLmcuLCBTdGFjaywgU3RhZ2UsIE5lc3RlZFN0YWNrKS5cbiAqL1xuZnVuY3Rpb24gY29uc3RydWN0c0luU3RhY2soY29uc3RydWN0OiBJQ29uc3RydWN0KTogSUNvbnN0cnVjdFtdIHtcbiAgY29uc3QgY29uc3RydWN0cyA9IFtjb25zdHJ1Y3RdO1xuICBjb25zdHJ1Y3Qubm9kZS5jaGlsZHJlblxuICAgIC5maWx0ZXIoY2hpbGQgPT4gIVN0YWdlLmlzU3RhZ2UoY2hpbGQpICYmICFTdGFjay5pc1N0YWNrKGNoaWxkKSlcbiAgICAuZm9yRWFjaChjaGlsZCA9PiBjb25zdHJ1Y3RzLnB1c2goLi4uY29uc3RydWN0c0luU3RhY2soY2hpbGQpKSk7XG4gIHJldHVybiBjb25zdHJ1Y3RzO1xufVxuXG5mdW5jdGlvbiBnZXRKc2lpQWdlbnRWZXJzaW9uKCkge1xuICBsZXQganNpaUFnZW50ID0gcHJvY2Vzcy5lbnYuSlNJSV9BR0VOVDtcblxuICAvLyBpZiBKU0lJX0FHRU5UIGlzIG5vdCBzcGVjaWZpZWQsIHdlIHdpbGwgYXNzdW1lIHRoaXMgaXMgYSBub2RlLmpzIHJ1bnRpbWVcbiAgLy8gYW5kIHBsdWcgaW4gb3VyIG5vZGUuanMgdmVyc2lvblxuICBpZiAoIWpzaWlBZ2VudCkge1xuICAgIGpzaWlBZ2VudCA9IGBub2RlLmpzLyR7cHJvY2Vzcy52ZXJzaW9ufWA7XG4gIH1cblxuICAvLyBTYW5pdGl6ZSB0aGUgYWdlbnQgdG8gcmVtb3ZlIGNoYXJhY3RlcnMgd2hpY2ggbWlnaHQgbWVzcyB3aXRoIHRoZSBkb3duc3RyZWFtXG4gIC8vIHByZWZpeCBlbmNvZGluZyAmIGRlY29kaW5nLiBJbiBwYXJ0aWN1bGFyIHRoZSAuTkVUIGpzaWkgYWdlbnQgdGFrZXMgYSBmb3JtIGxpa2U6XG4gIC8vIERvdE5ldC81LjAuMy8uTkVUQ29yZUFwcCxWZXJzaW9uPXYzLjEvMS4wLjAuMFxuICAvLyBUaGUgYCxgIGluIHRoZSBhYm92ZSBtZXNzZXMgd2l0aCB0aGUgcHJlZml4IGRlY29kaW5nIHdoZW4gcmVwb3J0aW5nIHRoZSBhbmFseXRpY3MuXG4gIGpzaWlBZ2VudCA9IGpzaWlBZ2VudC5yZXBsYWNlKC9bXmEtejAtOS4tLz1fXS9naSwgJy0nKTtcblxuICByZXR1cm4ganNpaUFnZW50O1xufVxuIl19