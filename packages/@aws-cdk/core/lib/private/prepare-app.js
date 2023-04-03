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
    refs_1.resolveReferences(root);
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
        refs_1.resolveReferences(root);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS1hcHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcmVwYXJlLWFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBb0U7QUFDcEUsaUNBQTJDO0FBQzNDLGtEQUE4QztBQUM5QyxvQ0FBaUM7QUFDakMsb0NBQWlDO0FBRWpDOzs7Ozs7Ozs7R0FTRztBQUNILFNBQWdCLFVBQVUsQ0FBQyxJQUFnQjtJQUN6Qyw2REFBNkQ7SUFDN0QsS0FBSyxNQUFNLFVBQVUsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNqRCxNQUFNLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRCxNQUFNLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUvRCxLQUFLLE1BQU0sTUFBTSxJQUFJLGtCQUFrQixFQUFFO1lBQ3ZDLEtBQUssTUFBTSxNQUFNLElBQUksa0JBQWtCLEVBQUU7Z0JBQ3ZDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDOUI7U0FDRjtLQUNGO0lBRUQsd0JBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFeEIsMkVBQTJFO0lBQzNFLDZEQUE2RDtJQUM3RCxFQUFFO0lBQ0YsNEVBQTRFO0lBQzVFLG9FQUFvRTtJQUNwRSxNQUFNLEtBQUssR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV4QyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdkIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRyxDQUFDO1lBQzlCLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2hDO1FBRUQsK0VBQStFO1FBQy9FLEVBQUU7UUFDRiw0RUFBNEU7UUFDNUUsMEVBQTBFO1FBQzFF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dWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyByZXNvbHZlUmVmZXJlbmNlcyB9IGZyb20gJy4vcmVmcyc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSB9IGZyb20gJy4uL2Nmbi1yZXNvdXJjZSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7IFN0YWdlIH0gZnJvbSAnLi4vc3RhZ2UnO1xuXG4vKipcbiAqIFByZXBhcmVzIHRoZSBhcHAgZm9yIHN5bnRoZXNpcy4gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgYnkgdGhlIHJvb3QgYHByZXBhcmVgXG4gKiAobm9ybWFsbHkgdGhpcyB0aGUgQXBwLCBidXQgaWYgYSBTdGFjayBpcyBhIHJvb3QsIGl0IGlzIGNhbGxlZCBieSB0aGUgc3RhY2spLFxuICogd2hpY2ggbWVhbnMgaXQncyB0aGUgbGFzdCAncHJlcGFyZScgdGhhdCBleGVjdXRlcy5cbiAqXG4gKiBJdCB0YWtlcyBjYXJlIG9mIHJlaWZ5aW5nIGNyb3NzLXJlZmVyZW5jZXMgYmV0d2VlbiBzdGFja3MgKG9yIG5lc3RlZCBzdGFja3MpLFxuICogYW5kIG9mIGNyZWF0aW5nIGFzc2V0cyBmb3IgbmVzdGVkIHN0YWNrIHRlbXBsYXRlcy5cbiAqXG4gKiBAcGFyYW0gcm9vdCBUaGUgcm9vdCBvZiB0aGUgY29uc3RydWN0IHRyZWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlQXBwKHJvb3Q6IElDb25zdHJ1Y3QpIHtcbiAgLy8gYXBwbHkgZGVwZW5kZW5jaWVzIGJldHdlZW4gcmVzb3VyY2VzIGluIGRlcGVuZGluZyBzdWJ0cmVlc1xuICBmb3IgKGNvbnN0IGRlcGVuZGVuY3kgb2YgZmluZFRyYW5zaXRpdmVEZXBzKHJvb3QpKSB7XG4gICAgY29uc3QgdGFyZ2V0Q2ZuUmVzb3VyY2VzID0gZmluZENmblJlc291cmNlcyhkZXBlbmRlbmN5LnRhcmdldCk7XG4gICAgY29uc3Qgc291cmNlQ2ZuUmVzb3VyY2VzID0gZmluZENmblJlc291cmNlcyhkZXBlbmRlbmN5LnNvdXJjZSk7XG5cbiAgICBmb3IgKGNvbnN0IHRhcmdldCBvZiB0YXJnZXRDZm5SZXNvdXJjZXMpIHtcbiAgICAgIGZvciAoY29uc3Qgc291cmNlIG9mIHNvdXJjZUNmblJlc291cmNlcykge1xuICAgICAgICBzb3VyY2UuYWRkRGVwZW5kZW5jeSh0YXJnZXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc29sdmVSZWZlcmVuY2VzKHJvb3QpO1xuXG4gIC8vIGRlcHRoLWZpcnN0IChjaGlsZHJlbiBmaXJzdCkgcXVldWUgb2YgbmVzdGVkIHN0YWNrcy4gV2Ugd2lsbCBwb3AgYSBzdGFja1xuICAvLyBmcm9tIHRoZSBoZWFkIG9mIHRoaXMgcXVldWUgdG8gcHJlcGFyZSBpdHMgdGVtcGxhdGUgYXNzZXQuXG4gIC8vXG4gIC8vIERlcHRoLWZpcnN0IHNpbmNlIHRoZSBhIG5lc3RlZCBzdGFjaydzIHRlbXBsYXRlIGhhc2ggd2lsbCBiZSByZWZsZWN0ZWQgaW5cbiAgLy8gaXRzIHBhcmVudCdzIHRlbXBsYXRlLCB3aGljaCB0aGVuIGNoYW5nZXMgdGhlIHBhcmVudCdzIGhhc2gsIGV0Yy5cbiAgY29uc3QgcXVldWUgPSBmaW5kQWxsTmVzdGVkU3RhY2tzKHJvb3QpO1xuXG4gIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgd2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IG5lc3RlZCA9IHF1ZXVlLnNoaWZ0KCkhO1xuICAgICAgZGVmaW5lTmVzdGVkU3RhY2tBc3NldChuZXN0ZWQpO1xuICAgIH1cblxuICAgIC8vIOKWt1sgR2l2ZW4gdGhlIGxlZ2FjeSBzeW50aGVzaXplciBhbmQgYSAzLW9yLWRlZXBlciBuZXN0aW5nIG9mIG5lc3RlZCBzdGFja3MgXVxuICAgIC8vXG4gICAgLy8gQWRkaW5nIG5lc3RlZCBzdGFjayBhc3NldHMgbWF5IGhhdmVkIGFkZGVkIENmblBhcmFtZXRlcnMgdG8gdGhlIHRvcC1sZXZlbFxuICAgIC8vIHN0YWNrIHdoaWNoIGFyZSByZWZlcmVuY2VkIGluIGEgZGVlcGVyLWxldmVsIHN0YWNrLiBUaGUgdmFsdWVzIG9mIHRoZXNlXG4gICAgLy8gcGFyYW1ldGVycyBuZWVkIHRvIGJlIGNhcnJpZWQgdGhyb3VnaCB0byB0aGUgcmlnaHQgbG9jYXRpb24gdmlhIE5lc3RlZFxuICAgIC8vIFN0YWNrIHBhcmFtZXRlcnMsIHdoaWNoIGByZXNvbHZlUmVmZXJlbmNlcygpYCB3aWxsIGRvLlxuICAgIC8vXG4gICAgLy8gWWVzLCB0aGlzIG1heSBhZGQgYFBhcmFtZXRlcmAgZWxlbWVudHMgdG8gYSB0ZW1wbGF0ZSB3aG9zZSBoYXNoIGhhc1xuICAgIC8vIGFscmVhZHkgYmVlbiBjYWxjdWxhdGVkLCBidXQgdGhlIGludmFyaWFudCB0aGF0IGlmIHRoZSBmdW5jdGlvbmFsIHBhcnRcbiAgICAvLyBvZiB0aGUgdGVtcGxhdGUgY2hhbmdlcyBpdHMgaGFzaCB3aWxsIGNoYW5nZSBpcyBzdGlsbCB1cGhlbGQuXG4gICAgcmVzb2x2ZVJlZmVyZW5jZXMocm9vdCk7XG4gIH1cbn1cblxuLyoqXG4gKiBQcmVwYXJlcyB0aGUgYXNzZXRzIGZvciBuZXN0ZWQgc3RhY2tzIGluIHRoaXMgYXBwLlxuICogQHJldHVybnMgYHRydWVgIGlmIGFzc2V0cyB3ZXJlIGFkZGVkIHRvIHRoZSBwYXJlbnQgb2YgYSBuZXN0ZWQgc3RhY2ssIHdoaWNoXG4gKiBpbXBsaWVzIHRoYXQgYW5vdGhlciByb3VuZCBvZiByZWZlcmVuY2UgcmVzb2x1dGlvbiBpcyBpbiBvcmRlci4gSWYgdGhpc1xuICogZnVuY3Rpb24gcmV0dXJucyBgZmFsc2VgLCB3ZSBrbm93IHdlIGFyZSBkb25lLlxuICovXG5mdW5jdGlvbiBkZWZpbmVOZXN0ZWRTdGFja0Fzc2V0KG5lc3RlZFN0YWNrOiBTdGFjaykge1xuICAvLyB0aGlzIGlzIG5lZWRlZCB0ZW1wb3JhcmlseSB1bnRpbCB3ZSBtb3ZlIE5lc3RlZFN0YWNrIHRvICdAYXdzLWNkay9jb3JlJy5cbiAgY29uc3QgbmVzdGVkOiBJTmVzdGVkU3RhY2tQcml2YXRlQXBpID0gbmVzdGVkU3RhY2sgYXMgYW55O1xuICBuZXN0ZWQuX3ByZXBhcmVUZW1wbGF0ZUFzc2V0KCk7XG59XG5cbmZ1bmN0aW9uIGZpbmRBbGxOZXN0ZWRTdGFja3Mocm9vdDogSUNvbnN0cnVjdCkge1xuICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8U3RhY2s+KCk7XG5cbiAgY29uc3QgaW5jbHVkZVN0YWNrID0gKHN0YWNrOiBJQ29uc3RydWN0KTogc3RhY2sgaXMgU3RhY2sgPT4ge1xuICAgIGlmICghU3RhY2suaXNTdGFjayhzdGFjaykpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKCFzdGFjay5uZXN0ZWQpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAvLyB0ZXN0OiBpZiB3ZSBhcmUgbm90IHdpdGhpbiBhIHN0YWdlLCB0aGVuIGluY2x1ZGUgaXQuXG4gICAgaWYgKCFTdGFnZS5vZihzdGFjaykpIHsgcmV0dXJuIHRydWU7IH1cblxuICAgIHJldHVybiBTdGFnZS5vZihzdGFjaykgPT09IHJvb3Q7XG4gIH07XG5cbiAgLy8gY3JlYXRlIGEgbGlzdCBvZiBhbGwgbmVzdGVkIHN0YWNrcyBpbiBkZXB0aC1maXJzdCBwb3N0IG9yZGVyIHRoaXMgbWVhbnNcbiAgLy8gdGhhdCB3ZSBmaXJzdCBwcmVwYXJlIHRoZSBsZWF2ZXMgYW5kIHRoZW4gd29yayBvdXIgd2F5IHVwLlxuICBmb3IgKGNvbnN0IHN0YWNrIG9mIHJvb3Qubm9kZS5maW5kQWxsKENvbnN0cnVjdE9yZGVyLlBPU1RPUkRFUiAvKiA8PT0gaW1wb3J0YW50ICovKSkge1xuICAgIGlmIChpbmNsdWRlU3RhY2soc3RhY2spKSB7XG4gICAgICByZXN1bHQucHVzaChzdGFjayk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBGaW5kIGFsbCByZXNvdXJjZXMgaW4gYSBzZXQgb2YgY29uc3RydWN0c1xuICovXG5mdW5jdGlvbiBmaW5kQ2ZuUmVzb3VyY2VzKHJvb3Q6IElDb25zdHJ1Y3QpOiBDZm5SZXNvdXJjZVtdIHtcbiAgcmV0dXJuIHJvb3Qubm9kZS5maW5kQWxsKCkuZmlsdGVyKENmblJlc291cmNlLmlzQ2ZuUmVzb3VyY2UpO1xufVxuXG5pbnRlcmZhY2UgSU5lc3RlZFN0YWNrUHJpdmF0ZUFwaSB7XG4gIF9wcmVwYXJlVGVtcGxhdGVBc3NldCgpOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFJldHVybiBhbGwgZGVwZW5kZW5jaWVzIHJlZ2lzdGVyZWQgb24gdGhpcyBub2RlIG9yIGFueSBvZiBpdHMgY2hpbGRyZW5cbiAqL1xuZnVuY3Rpb24gZmluZFRyYW5zaXRpdmVEZXBzKHJvb3Q6IElDb25zdHJ1Y3QpOiBEZXBlbmRlbmN5W10ge1xuICBjb25zdCBmb3VuZCA9IG5ldyBNYXA8SUNvbnN0cnVjdCwgU2V0PElDb25zdHJ1Y3Q+PigpOyAvLyBEZWR1cGxpY2F0aW9uIG1hcFxuICBjb25zdCByZXQgPSBuZXcgQXJyYXk8RGVwZW5kZW5jeT4oKTtcblxuICBmb3IgKGNvbnN0IHNvdXJjZSBvZiByb290Lm5vZGUuZmluZEFsbCgpKSB7XG4gICAgZm9yIChjb25zdCBkZXBlbmRhYmxlIG9mIHNvdXJjZS5ub2RlLmRlcGVuZGVuY2llcykge1xuICAgICAgZm9yIChjb25zdCB0YXJnZXQgb2YgRGVwZW5kYWJsZS5vZihkZXBlbmRhYmxlKS5kZXBlbmRlbmN5Um9vdHMpIHtcbiAgICAgICAgbGV0IGZvdW5kVGFyZ2V0cyA9IGZvdW5kLmdldChzb3VyY2UpO1xuICAgICAgICBpZiAoIWZvdW5kVGFyZ2V0cykgeyBmb3VuZC5zZXQoc291cmNlLCBmb3VuZFRhcmdldHMgPSBuZXcgU2V0KCkpOyB9XG5cbiAgICAgICAgaWYgKCFmb3VuZFRhcmdldHMuaGFzKHRhcmdldCkpIHtcbiAgICAgICAgICByZXQucHVzaCh7IHNvdXJjZSwgdGFyZ2V0IH0pO1xuICAgICAgICAgIGZvdW5kVGFyZ2V0cy5hZGQodGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cblxuaW50ZXJmYWNlIERlcGVuZGVuY3kge1xuICByZWFkb25seSBzb3VyY2U6IElDb25zdHJ1Y3Q7XG4gIHJlYWRvbmx5IHRhcmdldDogSUNvbnN0cnVjdDtcbn1cbiJdfQ==