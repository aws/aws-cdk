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
        // Adding nested stack assets may have added CfnParameters to the top-level
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS1hcHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcmVwYXJlLWFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBb0U7QUFDcEUsaUNBQTJDO0FBQzNDLGtEQUE4QztBQUM5QyxvQ0FBaUM7QUFDakMsb0NBQWlDO0FBRWpDOzs7Ozs7Ozs7R0FTRztBQUNILFNBQWdCLFVBQVUsQ0FBQyxJQUFnQjtJQUN6Qyw2REFBNkQ7SUFDN0QsS0FBSyxNQUFNLFVBQVUsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNqRCxNQUFNLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRCxNQUFNLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUvRCxLQUFLLE1BQU0sTUFBTSxJQUFJLGtCQUFrQixFQUFFO1lBQ3ZDLEtBQUssTUFBTSxNQUFNLElBQUksa0JBQWtCLEVBQUU7Z0JBQ3ZDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDOUI7U0FDRjtLQUNGO0lBRUQsSUFBQSx3QkFBaUIsRUFBQyxJQUFJLENBQUMsQ0FBQztJQUV4QiwyRUFBMkU7SUFDM0UsNkRBQTZEO0lBQzdELEVBQUU7SUFDRiw0RUFBNEU7SUFDNUUsb0VBQW9FO0lBQ3BFLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXhDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN2QixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFHLENBQUM7WUFDOUIsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDaEM7UUFFRCwrRUFBK0U7UUFDL0UsRUFBRTtRQUNGLDJFQUEyRTtRQUMzRSwwRUFBMEU7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ZSwgSUNvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgcmVzb2x2ZVJlZmVyZW5jZXMgfSBmcm9tICcuL3JlZnMnO1xuaW1wb3J0IHsgQ2ZuUmVzb3VyY2UgfSBmcm9tICcuLi9jZm4tcmVzb3VyY2UnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuLi9zdGFjayc7XG5pbXBvcnQgeyBTdGFnZSB9IGZyb20gJy4uL3N0YWdlJztcblxuLyoqXG4gKiBQcmVwYXJlcyB0aGUgYXBwIGZvciBzeW50aGVzaXMuIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGJ5IHRoZSByb290IGBwcmVwYXJlYFxuICogKG5vcm1hbGx5IHRoaXMgdGhlIEFwcCwgYnV0IGlmIGEgU3RhY2sgaXMgYSByb290LCBpdCBpcyBjYWxsZWQgYnkgdGhlIHN0YWNrKSxcbiAqIHdoaWNoIG1lYW5zIGl0J3MgdGhlIGxhc3QgJ3ByZXBhcmUnIHRoYXQgZXhlY3V0ZXMuXG4gKlxuICogSXQgdGFrZXMgY2FyZSBvZiByZWlmeWluZyBjcm9zcy1yZWZlcmVuY2VzIGJldHdlZW4gc3RhY2tzIChvciBuZXN0ZWQgc3RhY2tzKSxcbiAqIGFuZCBvZiBjcmVhdGluZyBhc3NldHMgZm9yIG5lc3RlZCBzdGFjayB0ZW1wbGF0ZXMuXG4gKlxuICogQHBhcmFtIHJvb3QgVGhlIHJvb3Qgb2YgdGhlIGNvbnN0cnVjdCB0cmVlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZUFwcChyb290OiBJQ29uc3RydWN0KSB7XG4gIC8vIGFwcGx5IGRlcGVuZGVuY2llcyBiZXR3ZWVuIHJlc291cmNlcyBpbiBkZXBlbmRpbmcgc3VidHJlZXNcbiAgZm9yIChjb25zdCBkZXBlbmRlbmN5IG9mIGZpbmRUcmFuc2l0aXZlRGVwcyhyb290KSkge1xuICAgIGNvbnN0IHRhcmdldENmblJlc291cmNlcyA9IGZpbmRDZm5SZXNvdXJjZXMoZGVwZW5kZW5jeS50YXJnZXQpO1xuICAgIGNvbnN0IHNvdXJjZUNmblJlc291cmNlcyA9IGZpbmRDZm5SZXNvdXJjZXMoZGVwZW5kZW5jeS5zb3VyY2UpO1xuXG4gICAgZm9yIChjb25zdCB0YXJnZXQgb2YgdGFyZ2V0Q2ZuUmVzb3VyY2VzKSB7XG4gICAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBzb3VyY2VDZm5SZXNvdXJjZXMpIHtcbiAgICAgICAgc291cmNlLmFkZERlcGVuZGVuY3kodGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXNvbHZlUmVmZXJlbmNlcyhyb290KTtcblxuICAvLyBkZXB0aC1maXJzdCAoY2hpbGRyZW4gZmlyc3QpIHF1ZXVlIG9mIG5lc3RlZCBzdGFja3MuIFdlIHdpbGwgcG9wIGEgc3RhY2tcbiAgLy8gZnJvbSB0aGUgaGVhZCBvZiB0aGlzIHF1ZXVlIHRvIHByZXBhcmUgaXRzIHRlbXBsYXRlIGFzc2V0LlxuICAvL1xuICAvLyBEZXB0aC1maXJzdCBzaW5jZSB0aGUgYSBuZXN0ZWQgc3RhY2sncyB0ZW1wbGF0ZSBoYXNoIHdpbGwgYmUgcmVmbGVjdGVkIGluXG4gIC8vIGl0cyBwYXJlbnQncyB0ZW1wbGF0ZSwgd2hpY2ggdGhlbiBjaGFuZ2VzIHRoZSBwYXJlbnQncyBoYXNoLCBldGMuXG4gIGNvbnN0IHF1ZXVlID0gZmluZEFsbE5lc3RlZFN0YWNrcyhyb290KTtcblxuICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgIHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBuZXN0ZWQgPSBxdWV1ZS5zaGlmdCgpITtcbiAgICAgIGRlZmluZU5lc3RlZFN0YWNrQXNzZXQobmVzdGVkKTtcbiAgICB9XG5cbiAgICAvLyDilrdbIEdpdmVuIHRoZSBsZWdhY3kgc3ludGhlc2l6ZXIgYW5kIGEgMy1vci1kZWVwZXIgbmVzdGluZyBvZiBuZXN0ZWQgc3RhY2tzIF1cbiAgICAvL1xuICAgIC8vIEFkZGluZyBuZXN0ZWQgc3RhY2sgYXNzZXRzIG1heSBoYXZlIGFkZGVkIENmblBhcmFtZXRlcnMgdG8gdGhlIHRvcC1sZXZlbFxuICAgIC8vIHN0YWNrIHdoaWNoIGFyZSByZWZlcmVuY2VkIGluIGEgZGVlcGVyLWxldmVsIHN0YWNrLiBUaGUgdmFsdWVzIG9mIHRoZXNlXG4gICAgLy8gcGFyYW1ldGVycyBuZWVkIHRvIGJlIGNhcnJpZWQgdGhyb3VnaCB0byB0aGUgcmlnaHQgbG9jYXRpb24gdmlhIE5lc3RlZFxuICAgIC8vIFN0YWNrIHBhcmFtZXRlcnMsIHdoaWNoIGByZXNvbHZlUmVmZXJlbmNlcygpYCB3aWxsIGRvLlxuICAgIC8vXG4gICAgLy8gWWVzLCB0aGlzIG1heSBhZGQgYFBhcmFtZXRlcmAgZWxlbWVudHMgdG8gYSB0ZW1wbGF0ZSB3aG9zZSBoYXNoIGhhc1xuICAgIC8vIGFscmVhZHkgYmVlbiBjYWxjdWxhdGVkLCBidXQgdGhlIGludmFyaWFudCB0aGF0IGlmIHRoZSBmdW5jdGlvbmFsIHBhcnRcbiAgICAvLyBvZiB0aGUgdGVtcGxhdGUgY2hhbmdlcyBpdHMgaGFzaCB3aWxsIGNoYW5nZSBpcyBzdGlsbCB1cGhlbGQuXG4gICAgcmVzb2x2ZVJlZmVyZW5jZXMocm9vdCk7XG4gIH1cbn1cblxuLyoqXG4gKiBQcmVwYXJlcyB0aGUgYXNzZXRzIGZvciBuZXN0ZWQgc3RhY2tzIGluIHRoaXMgYXBwLlxuICogQHJldHVybnMgYHRydWVgIGlmIGFzc2V0cyB3ZXJlIGFkZGVkIHRvIHRoZSBwYXJlbnQgb2YgYSBuZXN0ZWQgc3RhY2ssIHdoaWNoXG4gKiBpbXBsaWVzIHRoYXQgYW5vdGhlciByb3VuZCBvZiByZWZlcmVuY2UgcmVzb2x1dGlvbiBpcyBpbiBvcmRlci4gSWYgdGhpc1xuICogZnVuY3Rpb24gcmV0dXJucyBgZmFsc2VgLCB3ZSBrbm93IHdlIGFyZSBkb25lLlxuICovXG5mdW5jdGlvbiBkZWZpbmVOZXN0ZWRTdGFja0Fzc2V0KG5lc3RlZFN0YWNrOiBTdGFjaykge1xuICAvLyB0aGlzIGlzIG5lZWRlZCB0ZW1wb3JhcmlseSB1bnRpbCB3ZSBtb3ZlIE5lc3RlZFN0YWNrIHRvICdAYXdzLWNkay9jb3JlJy5cbiAgY29uc3QgbmVzdGVkOiBJTmVzdGVkU3RhY2tQcml2YXRlQXBpID0gbmVzdGVkU3RhY2sgYXMgYW55O1xuICBuZXN0ZWQuX3ByZXBhcmVUZW1wbGF0ZUFzc2V0KCk7XG59XG5cbmZ1bmN0aW9uIGZpbmRBbGxOZXN0ZWRTdGFja3Mocm9vdDogSUNvbnN0cnVjdCkge1xuICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8U3RhY2s+KCk7XG5cbiAgY29uc3QgaW5jbHVkZVN0YWNrID0gKHN0YWNrOiBJQ29uc3RydWN0KTogc3RhY2sgaXMgU3RhY2sgPT4ge1xuICAgIGlmICghU3RhY2suaXNTdGFjayhzdGFjaykpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKCFzdGFjay5uZXN0ZWQpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAvLyB0ZXN0OiBpZiB3ZSBhcmUgbm90IHdpdGhpbiBhIHN0YWdlLCB0aGVuIGluY2x1ZGUgaXQuXG4gICAgaWYgKCFTdGFnZS5vZihzdGFjaykpIHsgcmV0dXJuIHRydWU7IH1cblxuICAgIHJldHVybiBTdGFnZS5vZihzdGFjaykgPT09IHJvb3Q7XG4gIH07XG5cbiAgLy8gY3JlYXRlIGEgbGlzdCBvZiBhbGwgbmVzdGVkIHN0YWNrcyBpbiBkZXB0aC1maXJzdCBwb3N0IG9yZGVyIHRoaXMgbWVhbnNcbiAgLy8gdGhhdCB3ZSBmaXJzdCBwcmVwYXJlIHRoZSBsZWF2ZXMgYW5kIHRoZW4gd29yayBvdXIgd2F5IHVwLlxuICBmb3IgKGNvbnN0IHN0YWNrIG9mIHJvb3Qubm9kZS5maW5kQWxsKENvbnN0cnVjdE9yZGVyLlBPU1RPUkRFUiAvKiA8PT0gaW1wb3J0YW50ICovKSkge1xuICAgIGlmIChpbmNsdWRlU3RhY2soc3RhY2spKSB7XG4gICAgICByZXN1bHQucHVzaChzdGFjayk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBGaW5kIGFsbCByZXNvdXJjZXMgaW4gYSBzZXQgb2YgY29uc3RydWN0c1xuICovXG5mdW5jdGlvbiBmaW5kQ2ZuUmVzb3VyY2VzKHJvb3Q6IElDb25zdHJ1Y3QpOiBDZm5SZXNvdXJjZVtdIHtcbiAgcmV0dXJuIHJvb3Qubm9kZS5maW5kQWxsKCkuZmlsdGVyKENmblJlc291cmNlLmlzQ2ZuUmVzb3VyY2UpO1xufVxuXG5pbnRlcmZhY2UgSU5lc3RlZFN0YWNrUHJpdmF0ZUFwaSB7XG4gIF9wcmVwYXJlVGVtcGxhdGVBc3NldCgpOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFJldHVybiBhbGwgZGVwZW5kZW5jaWVzIHJlZ2lzdGVyZWQgb24gdGhpcyBub2RlIG9yIGFueSBvZiBpdHMgY2hpbGRyZW5cbiAqL1xuZnVuY3Rpb24gZmluZFRyYW5zaXRpdmVEZXBzKHJvb3Q6IElDb25zdHJ1Y3QpOiBEZXBlbmRlbmN5W10ge1xuICBjb25zdCBmb3VuZCA9IG5ldyBNYXA8SUNvbnN0cnVjdCwgU2V0PElDb25zdHJ1Y3Q+PigpOyAvLyBEZWR1cGxpY2F0aW9uIG1hcFxuICBjb25zdCByZXQgPSBuZXcgQXJyYXk8RGVwZW5kZW5jeT4oKTtcblxuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiByb290Lm5vZGUuZmluZEFsbCgpKSB7XG4gICAgZm9yIChjb25zdCBkZXBlbmRhYmxlIG9mIHNvdXJjZS5ub2RlLmRlcGVuZGVuY2llcykge1xuICAgICAgZm9yIChjb25zdCB0YXJnZXQgb2YgRGVwZW5kYWJsZS5vZihkZXBlbmRhYmxlKS5kZXBlbmRlbmN5Um9vdHMpIHtcbiAgICAgICAgbGV0IGZvdW5kVGFyZ2V0cyA9IGZvdW5kLmdldChzb3VyY2UpO1xuICAgICAgICBpZiAoIWZvdW5kVGFyZ2V0cykgeyBmb3VuZC5zZXQoc291cmNlLCBmb3VuZFRhcmdldHMgPSBuZXcgU2V0KCkpOyB9XG5cbiAgICAgICAgaWYgKCFmb3VuZFRhcmdldHMuaGFzKHRhcmdldCkpIHtcbiAgICAgICAgICByZXQucHVzaCh7IHNvdXJjZSwgdGFyZ2V0IH0pO1xuICAgICAgICAgIGZvdW5kVGFyZ2V0cy5hZGQodGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cblxuaW50ZXJmYWNlIERlcGVuZGVuY3kge1xuICByZWFkb25seSBzb3VyY2U6IElDb25zdHJ1Y3Q7XG4gIHJlYWRvbmx5IHRhcmdldDogSUNvbnN0cnVjdDtcbn1cbiJdfQ==