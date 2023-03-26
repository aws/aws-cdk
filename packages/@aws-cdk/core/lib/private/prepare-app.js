"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareApp = void 0;
const constructs_1 = require("constructs");
const refs_1 = require("./refs");
const cfn_resource_1 = require("../cfn-resource");
const stack_1 = require("../stack");
const stage_1 = require("../stage");
/**
 * Prepares the app for synthesis. This function is called by the root `prepare`
 * (normally this the App, but if a Stack is a root, it is called by the stack),
 * which means it's the last 'prepare' that executes.
 *
 * It takes care of reifying cross-references between stacks (or nested stacks),
 * and of creating assets for nested stack templates.
 *
 * @param root The root of the construct tree.
 */
function prepareApp(root) {
    // apply dependencies between resources in depending subtrees
    for (const dependency of findTransitiveDeps(root)) {
        const targetCfnResources = findCfnResources(dependency.target);
        const sourceCfnResources = findCfnResources(dependency.source);
        for (const target of targetCfnResources) {
            for (const source of sourceCfnResources) {
                source.addDependency(target);
            }
        }
    }
    (0, refs_1.resolveReferences)(root);
    // depth-first (children first) queue of nested stacks. We will pop a stack
    // from the head of this queue to prepare its template asset.
    //
    // Depth-first since the a nested stack's template hash will be reflected in
    // its parent's template, which then changes the parent's hash, etc.
    const queue = findAllNestedStacks(root);
    if (queue.length > 0) {
        while (queue.length > 0) {
            const nested = queue.shift();
            defineNestedStackAsset(nested);
        }
        // ▷[ Given the legacy synthesizer and a 3-or-deeper nesting of nested stacks ]
        //
        // Adding nested stack assets may haved added CfnParameters to the top-level
        // stack which are referenced in a deeper-level stack. The values of these
        // parameters need to be carried through to the right location via Nested
        // Stack parameters, which `resolveReferences()` will do.
        //
        // Yes, this may add `Parameter` elements to a template whose hash has
        // already been calculated, but the invariant that if the functional part
        // of the template changes its hash will change is still upheld.
        (0, refs_1.resolveReferences)(root);
    }
}
exports.prepareApp = prepareApp;
/**
 * Prepares the assets for nested stacks in this app.
 * @returns `true` if assets were added to the parent of a nested stack, which
 * implies that another round of reference resolution is in order. If this
 * function returns `false`, we know we are done.
 */
function defineNestedStackAsset(nestedStack) {
    // this is needed temporarily until we move NestedStack to '@aws-cdk/core'.
    const nested = nestedStack;
    nested._prepareTemplateAsset();
}
function findAllNestedStacks(root) {
    const result = new Array();
    const includeStack = (stack) => {
        if (!stack_1.Stack.isStack(stack)) {
            return false;
        }
        if (!stack.nested) {
            return false;
        }
        // test: if we are not within a stage, then include it.
        if (!stage_1.Stage.of(stack)) {
            return true;
        }
        return stage_1.Stage.of(stack) === root;
    };
    // create a list of all nested stacks in depth-first post order this means
    // that we first prepare the leaves and then work our way up.
    for (const stack of root.node.findAll(constructs_1.ConstructOrder.POSTORDER /* <== important */)) {
        if (includeStack(stack)) {
            result.push(stack);
        }
    }
    return result;
}
/**
 * Find all resources in a set of constructs
 */
function findCfnResources(root) {
    return root.node.findAll().filter(cfn_resource_1.CfnResource.isCfnResource);
}
/**
 * Return all dependencies registered on this node or any of its children
 */
function findTransitiveDeps(root) {
    const found = new Map(); // Deduplication map
    const ret = new Array();
    for (const source of root.node.findAll()) {
        for (const dependable of source.node.dependencies) {
            for (const target of constructs_1.Dependable.of(dependable).dependencyRoots) {
                let foundTargets = found.get(source);
                if (!foundTargets) {
                    found.set(source, foundTargets = new Set());
                }
                if (!foundTargets.has(target)) {
                    ret.push({ source, target });
                    foundTargets.add(target);
                }
            }
        }
    }
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS1hcHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcmVwYXJlLWFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBb0U7QUFDcEUsaUNBQTJDO0FBQzNDLGtEQUE4QztBQUM5QyxvQ0FBaUM7QUFDakMsb0NBQWlDO0FBRWpDOzs7Ozs7Ozs7R0FTRztBQUNILFNBQWdCLFVBQVUsQ0FBQyxJQUFnQjtJQUN6Qyw2REFBNkQ7SUFDN0QsS0FBSyxNQUFNLFVBQVUsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNqRCxNQUFNLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRCxNQUFNLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUvRCxLQUFLLE1BQU0sTUFBTSxJQUFJLGtCQUFrQixFQUFFO1lBQ3ZDLEtBQUssTUFBTSxNQUFNLElBQUksa0JBQWtCLEVBQUU7Z0JBQ3ZDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDOUI7U0FDRjtLQUNGO0lBRUQsSUFBQSx3QkFBaUIsRUFBQyxJQUFJLENBQUMsQ0FBQztJQUV4QiwyRUFBMkU7SUFDM0UsNkRBQTZEO0lBQzdELEVBQUU7SUFDRiw0RUFBNEU7SUFDNUUsb0VBQW9FO0lBQ3BFLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXhDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN2QixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFHLENBQUM7WUFDOUIsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDaEM7UUFFRCwrRUFBK0U7UUFDL0UsRUFBRTtRQUNGLDRFQUE0RTtRQUM1RSwwRUFBMEU7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ZSwgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgcmVzb2x2ZVJlZmVyZW5jZXMgfSBmcm9tICcuL3JlZnMnO1xuaW1wb3J0IHsgQ2ZuUmVzb3VyY2UgfSBmcm9tICcuLi9jZm4tcmVzb3VyY2UnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuLi9zdGFjayc7XG5pbXBvcnQgeyBTdGFnZSB9IGZyb20gJy4uL3N0YWdlJztcblxuLyoqXG4gKiBQcmVwYXJlcyB0aGUgYXBwIGZvciBzeW50aGVzaXMuIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGJ5IHRoZSByb290IGBwcmVwYXJlYFxuICogKG5vcm1hbGx5IHRoaXMgdGhlIEFwcCwgYnV0IGlmIGEgU3RhY2sgaXMgYSByb290LCBpdCBpcyBjYWxsZWQgYnkgdGhlIHN0YWNrKSxcbiAqIHdoaWNoIG1lYW5zIGl0J3MgdGhlIGxhc3QgJ3ByZXBhcmUnIHRoYXQgZXhlY3V0ZXMuXG4gKlxuICogSXQgdGFrZXMgY2FyZSBvZiByZWlmeWluZyBjcm9zcy1yZWZlcmVuY2VzIGJldHdlZW4gc3RhY2tzIChvciBuZXN0ZWQgc3RhY2tzKSxcbiAqIGFuZCBvZiBjcmVhdGluZyBhc3NldHMgZm9yIG5lc3RlZCBzdGFjayB0ZW1wbGF0ZXMuXG4gKlxuICogQHBhcmFtIHJvb3QgVGhlIHJvb3Qgb2YgdGhlIGNvbnN0cnVjdCB0cmVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZUFwcChyb290OiBJQ29uc3RydWN0KSB7XG4gIC8vIGFwcGx5IGRlcGVuZGVuY2llcyBiZXR3ZWVuIHJlc291cmNlcyBpbiBkZXBlbmRpbmcgc3VidHJlZXNcbiAgZm9yIChjb25zdCBkZXBlbmRlbmN5IG9mIGZpbmRUcmFuc2l0aXZlRGVwcyhyb290KSkge1xuICAgIGNvbnN0IHRhcmdldENmblJlc291cmNlcyA9IGZpbmRDZm5SZXNvdXJjZXMoZGVwZW5kZW5jeS50YXJnZXQpO1xuICAgIGNvbnN0IHNvdXJjZUNmblJlc291cmNlcyA9IGZpbmRDZm5SZXNvdXJjZXMoZGVwZW5kZW5jeS5zb3VyY2UpO1xuXG4gICAgZm9yIChjb25zdCB0YXJnZXQgb2YgdGFyZ2V0Q2ZuUmVzb3VyY2VzKSB7XG4gICAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VDZm5SZXNvdXJjZXMpIHtcbiAgICAgICAgc291cmNlLmFkZERlcGVuZGVuY3kodGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXNvbHZlUmVmZXJlbmNlcyhyb290KTtcblxuICAvLyBkZXB0aC1maXJzdCAoY2hpbGRyZW4gZmlyc3QpIHF1ZXVlIG9mIG5lc3RlZCBzdGFja3MuIFdlIHdpbGwgcG9wIGEgc3RhY2tcbiAgLy8gZnJvbSB0aGUgaGVhZCBvZiB0aGlzIHF1ZXVlIHRvIHByZXBhcmUgaXRzIHRlbXBsYXRlIGFzc2V0LlxuICAvL1xuICAvLyBEZXB0aC1maXJzdCBzaW5jZSB0aGUgYSBuZXN0ZWQgc3RhY2sncyB0ZW1wbGF0ZSBoYXNoIHdpbGwgYmUgcmVmbGVjdGVkIGluXG4gIC8vIGl0cyBwYXJlbnQncyB0ZW1wbGF0ZSwgd2hpY2ggdGhlbiBjaGFuZ2VzIHRoZSBwYXJlbnQncyBoYXNoLCBldGMuXG4gIGNvbnN0IHF1ZXVlID0gZmluZEFsbE5lc3RlZFN0YWNrcyhyb290KTtcblxuICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgIHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBuZXN0ZWQgPSBxdWV1ZS5zaGlmdCgpITtcbiAgICAgIGRlZmluZU5lc3RlZFN0YWNrQXNzZXQobmVzdGVkKTtcbiAgICB9XG5cbiAgICAvLyDilrdbIEdpdmVuIHRoZSBsZWdhY3kgc3ludGhlc2l6ZXIgYW5kIGEgMy1vci1kZWVwZXIgbmVzdGluZyBvZiBuZXN0ZWQgc3RhY2tzIF1cbiAgICAvL1xuICAgIC8vIEFkZGluZyBuZXN0ZWQgc3RhY2sgYXNzZXRzIG1heSBoYXZlZCBhZGRlZCBDZm5QYXJhbWV0ZXJzIHRvIHRoZSB0b3AtbGV2ZWxcbiAgICAvLyBzdGFjayB3aGljaCBhcmUgcmVmZXJlbmNlZCBpbiBhIGRlZXBlci1sZXZlbCBzdGFjay4gVGhlIHZhbHVlcyBvZiB0aGVzZVxuICAgIC8vIHBhcmFtZXRlcnMgbmVlZCB0byBiZSBjYXJyaWVkIHRocm91Z2ggdG8gdGhlIHJpZ2h0IGxvY2F0aW9uIHZpYSBOZXN0ZWRcbiAgICAvLyBTdGFjayBwYXJhbWV0ZXJzLCB3aGljaCBgcmVzb2x2ZVJlZmVyZW5jZXMoKWAgd2lsbCBkby5cbiAgICAvL1xuICAgIC8vIFllcywgdGhpcyBtYXkgYWRkIGBQYXJhbWV0ZXJgIGVsZW1lbnRzIHRvIGEgdGVtcGxhdGUgd2hvc2UgaGFzaCBoYXNcbiAgICAvLyBhbHJlYWR5IGJlZW4gY2FsY3VsYXRlZCwgYnV0IHRoZSBpbnZhcmlhbnQgdGhhdCBpZiB0aGUgZnVuY3Rpb25hbCBwYXJ0XG4gICAgLy8gb2YgdGhlIHRlbXBsYXRlIGNoYW5nZXMgaXRzIGhhc2ggd2lsbCBjaGFuZ2UgaXMgc3RpbGwgdXBoZWxkLlxuICAgIHJlc29sdmVSZWZlcmVuY2VzKHJvb3QpO1xuICB9XG59XG5cbi8qKlxuICogUHJlcGFyZXMgdGhlIGFzc2V0cyBmb3IgbmVzdGVkIHN0YWNrcyBpbiB0aGlzIGFwcC5cbiAqIEByZXR1cm5zIGB0cnVlYCBpZiBhc3NldHMgd2VyZSBhZGRlZCB0byB0aGUgcGFyZW50IG9mIGEgbmVzdGVkIHN0YWNrLCB3aGljaFxuICogaW1wbGllcyB0aGF0IGFub3RoZXIgcm91bmQgb2YgcmVmZXJlbmNlIHJlc29sdXRpb24gaXMgaW4gb3JkZXIuIElmIHRoaXNcbiAqIGZ1bmN0aW9uIHJldHVybnMgYGZhbHNlYCwgd2Uga25vdyB3ZSBhcmUgZG9uZS5cbiAqL1xuZnVuY3Rpb24gZGVmaW5lTmVzdGVkU3RhY2tBc3NldChuZXN0ZWRTdGFjazogU3RhY2spIHtcbiAgLy8gdGhpcyBpcyBuZWVkZWQgdGVtcG9yYXJpbHkgdW50aWwgd2UgbW92ZSBOZXN0ZWRTdGFjayB0byAnQGF3cy1jZGsvY29yZScuXG4gIGNvbnN0IG5lc3RlZDogSU5lc3RlZFN0YWNrUHJpdmF0ZUFwaSA9IG5lc3RlZFN0YWNrIGFzIGFueTtcbiAgbmVzdGVkLl9wcmVwYXJlVGVtcGxhdGVBc3NldCgpO1xufVxuXG5mdW5jdGlvbiBmaW5kQWxsTmVzdGVkU3RhY2tzKHJvb3Q6IElDb25zdHJ1Y3QpIHtcbiAgY29uc3QgcmVzdWx0ID0gbmV3IEFycmF5PFN0YWNrPigpO1xuXG4gIGNvbnN0IGluY2x1ZGVTdGFjayA9IChzdGFjazogSUNvbnN0cnVjdCk6IHN0YWNrIGlzIFN0YWNrID0+IHtcbiAgICBpZiAoIVN0YWNrLmlzU3RhY2soc3RhY2spKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGlmICghc3RhY2submVzdGVkKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgLy8gdGVzdDogaWYgd2UgYXJlIG5vdCB3aXRoaW4gYSBzdGFnZSwgdGhlbiBpbmNsdWRlIGl0LlxuICAgIGlmICghU3RhZ2Uub2Yoc3RhY2spKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICByZXR1cm4gU3RhZ2Uub2Yoc3RhY2spID09PSByb290O1xuICB9O1xuXG4gIC8vIGNyZWF0ZSBhIGxpc3Qgb2YgYWxsIG5lc3RlZCBzdGFja3MgaW4gZGVwdGgtZmlyc3QgcG9zdCBvcmRlciB0aGlzIG1lYW5zXG4gIC8vIHRoYXQgd2UgZmlyc3QgcHJlcGFyZSB0aGUgbGVhdmVzIGFuZCB0aGVuIHdvcmsgb3VyIHdheSB1cC5cbiAgZm9yIChjb25zdCBzdGFjayBvZiByb290Lm5vZGUuZmluZEFsbChDb25zdHJ1Y3RPcmRlci5QT1NUT1JERVIgLyogPD09IGltcG9ydGFudCAqLykpIHtcbiAgICBpZiAoaW5jbHVkZVN0YWNrKHN0YWNrKSkge1xuICAgICAgcmVzdWx0LnB1c2goc3RhY2spO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRmluZCBhbGwgcmVzb3VyY2VzIGluIGEgc2V0IG9mIGNvbnN0cnVjdHNcbiAqL1xuZnVuY3Rpb24gZmluZENmblJlc291cmNlcyhyb290OiBJQ29uc3RydWN0KTogQ2ZuUmVzb3VyY2VbXSB7XG4gIHJldHVybiByb290Lm5vZGUuZmluZEFsbCgpLmZpbHRlcihDZm5SZXNvdXJjZS5pc0NmblJlc291cmNlKTtcbn1cblxuaW50ZXJmYWNlIElOZXN0ZWRTdGFja1ByaXZhdGVBcGkge1xuICBfcHJlcGFyZVRlbXBsYXRlQXNzZXQoKTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYWxsIGRlcGVuZGVuY2llcyByZWdpc3RlcmVkIG9uIHRoaXMgbm9kZSBvciBhbnkgb2YgaXRzIGNoaWxkcmVuXG4gKi9cbmZ1bmN0aW9uIGZpbmRUcmFuc2l0aXZlRGVwcyhyb290OiBJQ29uc3RydWN0KTogRGVwZW5kZW5jeVtdIHtcbiAgY29uc3QgZm91bmQgPSBuZXcgTWFwPElDb25zdHJ1Y3QsIFNldDxJQ29uc3RydWN0Pj4oKTsgLy8gRGVkdXBsaWNhdGlvbiBtYXBcbiAgY29uc3QgcmV0ID0gbmV3IEFycmF5PERlcGVuZGVuY3k+KCk7XG5cbiAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygcm9vdC5ub2RlLmZpbmRBbGwoKSkge1xuICAgIGZvciAoY29uc3QgZGVwZW5kYWJsZSBvZiBzb3VyY2Uubm9kZS5kZXBlbmRlbmNpZXMpIHtcbiAgICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIERlcGVuZGFibGUub2YoZGVwZW5kYWJsZSkuZGVwZW5kZW5jeVJvb3RzKSB7XG4gICAgICAgIGxldCBmb3VuZFRhcmdldHMgPSBmb3VuZC5nZXQoc291cmNlKTtcbiAgICAgICAgaWYgKCFmb3VuZFRhcmdldHMpIHsgZm91bmQuc2V0KHNvdXJjZSwgZm91bmRUYXJnZXRzID0gbmV3IFNldCgpKTsgfVxuXG4gICAgICAgIGlmICghZm91bmRUYXJnZXRzLmhhcyh0YXJnZXQpKSB7XG4gICAgICAgICAgcmV0LnB1c2goeyBzb3VyY2UsIHRhcmdldCB9KTtcbiAgICAgICAgICBmb3VuZFRhcmdldHMuYWRkKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0O1xufVxuXG5cbmludGVyZmFjZSBEZXBlbmRlbmN5IHtcbiAgcmVhZG9ubHkgc291cmNlOiBJQ29uc3RydWN0O1xuICByZWFkb25seSB0YXJnZXQ6IElDb25zdHJ1Y3Q7XG59XG4iXX0=