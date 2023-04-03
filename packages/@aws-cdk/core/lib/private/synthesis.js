"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCustomSynthesis = exports.synthesize = void 0;
const cxapi = require("@aws-cdk/cx-api");
const metadata_resource_1 = require("./metadata-resource");
const prepare_app_1 = require("./prepare-app");
const tree_metadata_1 = require("./tree-metadata");
const annotations_1 = require("../annotations");
const app_1 = require("../app");
const aspect_1 = require("../aspect");
const stack_1 = require("../stack");
const stage_1 = require("../stage");
function synthesize(root, options = {}) {
    // add the TreeMetadata resource to the App first
    injectTreeMetadata(root);
    // we start by calling "synth" on all nested assemblies (which will take care of all their children)
    synthNestedAssemblies(root, options);
    invokeAspects(root);
    injectMetadataResources(root);
    // resolve references
    prepare_app_1.prepareApp(root);
    // give all children an opportunity to validate now that we've finished prepare
    if (!options.skipValidation) {
        validateTree(root);
    }
    // in unit tests, we support creating free-standing stacks, so we create the
    // assembly builder here.
    const builder = stage_1.Stage.isStage(root)
        ? root._assemblyBuilder
        : new cxapi.CloudAssemblyBuilder(options.outdir);
    // next, we invoke "onSynthesize" on all of our children. this will allow
    // stacks to add themselves to the synthesized cloud assembly.
    synthesizeTree(root, builder, options.validateOnSynthesis);
    return builder.buildAssembly();
}
exports.synthesize = synthesize;
const CUSTOM_SYNTHESIS_SYM = Symbol.for('@aws-cdk/core:customSynthesis');
function addCustomSynthesis(construct, synthesis) {
    Object.defineProperty(construct, CUSTOM_SYNTHESIS_SYM, {
        value: synthesis,
        enumerable: false,
    });
}
exports.addCustomSynthesis = addCustomSynthesis;
function getCustomSynthesis(construct) {
    return construct[CUSTOM_SYNTHESIS_SYM];
}
/**
 * Find Assemblies inside the construct and call 'synth' on them
 *
 * (They will in turn recurse again)
 */
function synthNestedAssemblies(root, options) {
    for (const child of root.node.children) {
        if (stage_1.Stage.isStage(child)) {
            child.synth(options);
        }
        else {
            synthNestedAssemblies(child, options);
        }
    }
}
/**
 * Invoke aspects on the given construct tree.
 *
 * Aspects are not propagated across Assembly boundaries. The same Aspect will not be invoked
 * twice for the same construct.
 */
function invokeAspects(root) {
    const invokedByPath = {};
    let nestedAspectWarning = false;
    recurse(root, []);
    function recurse(construct, inheritedAspects) {
        const node = construct.node;
        const aspects = aspect_1.Aspects.of(construct);
        const allAspectsHere = [...inheritedAspects ?? [], ...aspects.all];
        const nodeAspectsCount = aspects.all.length;
        for (const aspect of allAspectsHere) {
            let invoked = invokedByPath[node.path];
            if (!invoked) {
                invoked = invokedByPath[node.path] = [];
            }
            if (invoked.includes(aspect)) {
                continue;
            }
            aspect.visit(construct);
            // if an aspect was added to the node while invoking another aspect it will not be invoked, emit a warning
            // the `nestedAspectWarning` flag is used to prevent the warning from being emitted for every child
            if (!nestedAspectWarning && nodeAspectsCount !== aspects.all.length) {
                annotations_1.Annotations.of(construct).addWarning('We detected an Aspect was added via another Aspect, and will not be applied');
                nestedAspectWarning = true;
            }
            // mark as invoked for this node
            invoked.push(aspect);
        }
        for (const child of construct.node.children) {
            if (!stage_1.Stage.isStage(child)) {
                recurse(child, allAspectsHere);
            }
        }
    }
}
/**
 * Find all stacks and add Metadata Resources to all of them
 *
 * There is no good generic place to do this. Can't do it in the constructor
 * (because adding a child construct makes it impossible to set context on the
 * node), and the generic prepare phase is deprecated.
 *
 * Only do this on [parent] stacks (not nested stacks), don't do this when
 * disabled by the user.
 *
 * Also, only when running via the CLI. If we do it unconditionally,
 * all unit tests everywhere are going to break massively. I've spent a day
 * fixing our own, but downstream users would be affected just as badly.
 *
 * Stop at Assembly boundaries.
 */
function injectMetadataResources(root) {
    visit(root, 'post', construct => {
        if (!stack_1.Stack.isStack(construct) || !construct._versionReportingEnabled) {
            return;
        }
        // Because of https://github.com/aws/aws-cdk/blob/main/packages/assert-internal/lib/synth-utils.ts#L74
        // synthesize() may be called more than once on a stack in unit tests, and the below would break
        // if we execute it a second time. Guard against the constructs already existing.
        const CDKMetadata = 'CDKMetadata';
        if (construct.node.tryFindChild(CDKMetadata)) {
            return;
        }
        new metadata_resource_1.MetadataResource(construct, CDKMetadata);
    });
}
/**
 * Find the root App and add the TreeMetadata resource (if enabled).
 *
 * There is no good generic place to do this. Can't do it in the constructor
 * (because adding a child construct makes it impossible to set context on the
 * node), and the generic prepare phase is deprecated.
 */
function injectTreeMetadata(root) {
    visit(root, 'post', construct => {
        if (!app_1.App.isApp(construct) || !construct._treeMetadata)
            return;
        const CDKTreeMetadata = 'Tree';
        if (construct.node.tryFindChild(CDKTreeMetadata))
            return;
        new tree_metadata_1.TreeMetadata(construct);
    });
}
/**
 * Synthesize children in post-order into the given builder
 *
 * Stop at Assembly boundaries.
 */
function synthesizeTree(root, builder, validateOnSynth = false) {
    visit(root, 'post', construct => {
        const session = {
            outdir: builder.outdir,
            assembly: builder,
            validateOnSynth,
        };
        if (stack_1.Stack.isStack(construct)) {
            construct.synthesizer.synthesize(session);
        }
        else if (construct instanceof tree_metadata_1.TreeMetadata) {
            construct._synthesizeTree(session);
        }
        else {
            const custom = getCustomSynthesis(construct);
            custom?.onSynthesize(session);
        }
    });
}
/**
 * Validate all constructs in the given construct tree
 */
function validateTree(root) {
    const errors = new Array();
    visit(root, 'pre', construct => {
        for (const message of construct.node.validate()) {
            errors.push({ message, source: construct });
        }
    });
    if (errors.length > 0) {
        const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
        throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
    }
}
/**
 * Visit the given construct tree in either pre or post order, stopping at Assemblies
 */
function visit(root, order, cb) {
    if (order === 'pre') {
        cb(root);
    }
    for (const child of root.node.children) {
        if (stage_1.Stage.isStage(child)) {
            continue;
        }
        visit(child, order, cb);
    }
    if (order === 'post') {
        cb(root);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGhlc2lzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3ludGhlc2lzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQUF5QztBQUV6QywyREFBdUQ7QUFDdkQsK0NBQTJDO0FBQzNDLG1EQUErQztBQUMvQyxnREFBNkM7QUFDN0MsZ0NBQTZCO0FBQzdCLHNDQUE2QztBQUM3QyxvQ0FBaUM7QUFFakMsb0NBQXdEO0FBYXhELFNBQWdCLFVBQVUsQ0FBQyxJQUFnQixFQUFFLFVBQTRCLEVBQUc7SUFDMUUsaURBQWlEO0lBQ2pELGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pCLG9HQUFvRztJQUNwRyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFckMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXBCLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTlCLHFCQUFxQjtJQUNyQix3QkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWpCLCtFQUErRTtJQUMvRSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRTtRQUMzQixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDcEI7SUFFRCw0RUFBNEU7SUFDNUUseUJBQXlCO0lBQ3pCLE1BQU0sT0FBTyxHQUFHLGFBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCO1FBQ3ZCLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFbkQseUVBQXlFO0lBQ3pFLDhEQUE4RDtJQUM5RCxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUUzRCxPQUFPLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUNqQyxDQUFDO0FBN0JELGdDQTZCQztBQUVELE1BQU0sb0JB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LElBQUksS0FBSyxLQUFLLEtBQUssRUFBRTtRQUNuQixFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDVjtJQUVELEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDdEMsSUFBSSxhQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQUUsU0FBUztTQUFFO1FBQ3ZDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3pCO0lBRUQsSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNWO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBNZXRhZGF0YVJlc291cmNlIH0gZnJvbSAnLi9tZXRhZGF0YS1yZXNvdXJjZSc7XG5pbXBvcnQgeyBwcmVwYXJlQXBwIH0gZnJvbSAnLi9wcmVwYXJlLWFwcCc7XG5pbXBvcnQgeyBUcmVlTWV0YWRhdGEgfSBmcm9tICcuL3RyZWUtbWV0YWRhdGEnO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMgfSBmcm9tICcuLi9hbm5vdGF0aW9ucyc7XG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuLi9hcHAnO1xuaW1wb3J0IHsgQXNwZWN0cywgSUFzcGVjdCB9IGZyb20gJy4uL2FzcGVjdCc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7IElTeW50aGVzaXNTZXNzaW9uIH0gZnJvbSAnLi4vc3RhY2stc3ludGhlc2l6ZXJzL3R5cGVzJztcbmltcG9ydCB7IFN0YWdlLCBTdGFnZVN5bnRoZXNpc09wdGlvbnMgfSBmcm9tICcuLi9zdGFnZSc7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYHN5bnRoZXNpemUoKWBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTeW50aGVzaXNPcHRpb25zIGV4dGVuZHMgU3RhZ2VTeW50aGVzaXNPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBvdXRwdXQgZGlyZWN0b3J5IGludG8gd2hpY2ggdG8gc3ludGhlc2l6ZSB0aGUgY2xvdWQgYXNzZW1ibHkuXG4gICAqIEBkZWZhdWx0IC0gY3JlYXRlcyBhIHRlbXBvcmFyeSBkaXJlY3RvcnlcbiAgICovXG4gIHJlYWRvbmx5IG91dGRpcj86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN5bnRoZXNpemUocm9vdDogSUNvbnN0cnVjdCwgb3B0aW9uczogU3ludGhlc2lzT3B0aW9ucyA9IHsgfSk6IGN4YXBpLkNsb3VkQXNzZW1ibHkge1xuICAvLyBhZGQgdGhlIFRyZWVNZXRhZGF0YSByZXNvdXJjZSB0byB0aGUgQXBwIGZpcnN0XG4gIGluamVjdFRyZWVNZXRhZGF0YShyb290KTtcbiAgLy8gd2Ugc3RhcnQgYnkgY2FsbGluZyBcInN5bnRoXCIgb24gYWxsIG5lc3RlZCBhc3NlbWJsaWVzICh3aGljaCB3aWxsIHRha2UgY2FyZSBvZiBhbGwgdGhlaXIgY2hpbGRyZW4pXG4gIHN5bnRoTmVzdGVkQXNzZW1ibGllcyhyb290LCBvcHRpb25zKTtcblxuICBpbnZva2VBc3BlY3RzKHJvb3QpO1xuXG4gIGluamVjdE1ldGFkYXRhUmVzb3VyY2VzKHJvb3QpO1xuXG4gIC8vIHJlc29sdmUgcmVmZXJlbmNlc1xuICBwcmVwYXJlQXBwKHJvb3QpO1xuXG4gIC8vIGdpdmUgYWxsIGNoaWxkcmVuIGFuIG9wcG9ydHVuaXR5IHRvIHZhbGlkYXRlIG5vdyB0aGF0IHdlJ3ZlIGZpbmlzaGVkIHByZXBhcmVcbiAgaWYgKCFvcHRpb25zLnNraXBWYWxpZGF0aW9uKSB7XG4gICAgdmFsaWRhdGVUcmVlKHJvb3QpO1xuICB9XG5cbiAgLy8gaW4gdW5pdCB0ZXN0cywgd2Ugc3VwcG9ydCBjcmVhdGluZyBmcmVlLXN0YW5kaW5nIHN0YWNrcywgc28gd2UgY3JlYXRlIHRoZVxuICAvLyBhc3NlbWJseSBidWlsZGVyIGhlcmUuXG4gIGNvbnN0IGJ1aWxkZXIgPSBTdGFnZS5pc1N0YWdlKHJvb3QpXG4gICAgPyByb290Ll9hc3NlbWJseUJ1aWxkZXJcbiAgICA6IG5ldyBjeGFwaS5DbG91ZEFzc2VtYmx5QnVpbGRlcihvcHRpb25zLm91dGRpcik7XG5cbiAgLy8gbmV4dCwgd2UgaW52b2tlIFwib25TeW50aGVzaXplXCIgb24gYWxsIG9mIG91ciBjaGlsZHJlbi4gdGhpcyB3aWxsIGFsbG93XG4gIC8vIHN0YWNrcyB0byBhZGQgdGhlbXNlbHZlcyB0byB0aGUgc3ludGhlc2l6ZWQgY2xvdWQgYXNzZW1ibHkuXG4gIHN5bnRoZXNpemVUcmVlKHJvb3QsIGJ1aWxkZXIsIG9wdGlvbnMudmFsaWRhdGVPblN5bnRoZXNpcyk7XG5cbiAgcmV0dXJuIGJ1aWxkZXIuYnVpbGRBc3NlbWJseSgpO1xufVxuXG5jb25zdCBDVVNUT01fU1lOVEhFU0lTX1NZTSA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2NvcmU6Y3VzdG9tU3ludGhlc2lzJyk7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjb25zdHJ1Y3RzIHRoYXQgd2FudCB0byBkbyBzb21ldGhpbmcgY3VzdG9tIGR1cmluZyBzeW50aGVzaXNcbiAqXG4gKiBUaGlzIGZlYXR1cmUgaXMgaW50ZW5kZWQgZm9yIHVzZSBieSBvZmZpY2lhbCBBV1MgQ0RLIGxpYnJhcmllcyBvbmx5OyAzcmQgcGFydHlcbiAqIGxpYnJhcnkgYXV0aG9ycyBhbmQgQ0RLIHVzZXJzIHNob3VsZCBub3QgdXNlIHRoaXMgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUN1c3RvbVN5bnRoZXNpcyB7XG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY29uc3RydWN0IGlzIHN5bnRoZXNpemVkXG4gICAqL1xuICBvblN5bnRoZXNpemUoc2Vzc2lvbjogSVN5bnRoZXNpc1Nlc3Npb24pOiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQ3VzdG9tU3ludGhlc2lzKGNvbnN0cnVjdDogSUNvbnN0cnVjdCwgc3ludGhlc2lzOiBJQ3VzdG9tU3ludGhlc2lzKTogdm9pZCB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb25zdHJ1Y3QsIENVU1RPTV9TWU5USEVTSVNfU1lNLCB7XG4gICAgdmFsdWU6IHN5bnRoZXNpcyxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEN1c3RvbVN5bnRoZXNpcyhjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QpOiBJQ3VzdG9tU3ludGhlc2lzIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIChjb25zdHJ1Y3QgYXMgYW55KVtDVVNUT01fU1lOVEhFU0lTX1NZTV07XG59XG5cbi8qKlxuICogRmluZCBBc3NlbWJsaWVzIGluc2lkZSB0aGUgY29uc3RydWN0IGFuZCBjYWxsICdzeW50aCcgb24gdGhlbVxuICpcbiAqIChUaGV5IHdpbGwgaW4gdHVybiByZWN1cnNlIGFnYWluKVxuICovXG5mdW5jdGlvbiBzeW50aE5lc3RlZEFzc2VtYmxpZXMocm9vdDogSUNvbnN0cnVjdCwgb3B0aW9uczogU3RhZ2VTeW50aGVzaXNPcHRpb25zKSB7XG4gIGZvciAoY29uc3QgY2hpbGQgb2Ygcm9vdC5ub2RlLmNoaWxkcmVuKSB7XG4gICAgaWYgKFN0YWdlLmlzU3RhZ2UoY2hpbGQpKSB7XG4gICAgICBjaGlsZC5zeW50aChvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3ludGhOZXN0ZWRBc3NlbWJsaWVzKGNoaWxkLCBvcHRpb25zKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBJbnZva2UgYXNwZWN0cyBvbiB0aGUgZ2l2ZW4gY29uc3RydWN0IHRyZWUuXG4gKlxuICogQXNwZWN0cyBhcmUgbm90IHByb3BhZ2F0ZWQgYWNyb3NzIEFzc2VtYmx5IGJvdW5kYXJpZXMuIFRoZSBzYW1lIEFzcGVjdCB3aWxsIG5vdCBiZSBpbnZva2VkXG4gKiB0d2ljZSBmb3IgdGhlIHNhbWUgY29uc3RydWN0LlxuICovXG5mdW5jdGlvbiBpbnZva2VBc3BlY3RzKHJvb3Q6IElDb25zdHJ1Y3QpIHtcbiAgY29uc3QgaW52b2tlZEJ5UGF0aDogeyBbbm9kZVBhdGg6IHN0cmluZ106IElBc3BlY3RbXSB9ID0geyB9O1xuXG4gIGxldCBuZXN0ZWRBc3BlY3RXYXJuaW5nID0gZmFsc2U7XG4gIHJlY3Vyc2Uocm9vdCwgW10pO1xuXG4gIGZ1bmN0aW9uIHJlY3Vyc2UoY29uc3RydWN0OiBJQ29uc3RydWN0LCBpbmhlcml0ZWRBc3BlY3RzOiBJQXNwZWN0W10pIHtcbiAgICBjb25zdCBub2RlID0gY29uc3RydWN0Lm5vZGU7XG4gICAgY29uc3QgYXNwZWN0cyA9IEFzcGVjdHMub2YoY29uc3RydWN0KTtcbiAgICBjb25zdCBhbGxBc3BlY3RzSGVyZSA9IFsuLi5pbmhlcml0ZWRBc3BlY3RzID8/IFtdLCAuLi5hc3BlY3RzLmFsbF07XG4gICAgY29uc3Qgbm9kZUFzcGVjdHNDb3VudCA9IGFzcGVjdHMuYWxsLmxlbmd0aDtcbiAgICBmb3IgKGNvbnN0IGFzcGVjdCBvZiBhbGxBc3BlY3RzSGVyZSkge1xuICAgICAgbGV0IGludm9rZWQgPSBpbnZva2VkQnlQYXRoW25vZGUucGF0aF07XG4gICAgICBpZiAoIWludm9rZWQpIHtcbiAgICAgICAgaW52b2tlZCA9IGludm9rZWRCeVBhdGhbbm9kZS5wYXRoXSA9IFtdO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW52b2tlZC5pbmNsdWRlcyhhc3BlY3QpKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGFzcGVjdC52aXNpdChjb25zdHJ1Y3QpO1xuXG4gICAgICAvLyBpZiBhbiBhc3BlY3Qgd2FzIGFkZGVkIHRvIHRoZSBub2RlIHdoaWxlIGludm9raW5nIGFub3RoZXIgYXNwZWN0IGl0IHdpbGwgbm90IGJlIGludm9rZWQsIGVtaXQgYSB3YXJuaW5nXG4gICAgICAvLyB0aGUgYG5lc3RlZEFzcGVjdFdhcm5pbmdgIGZsYWcgaXMgdXNlZCB0byBwcmV2ZW50IHRoZSB3YXJuaW5nIGZyb20gYmVpbmcgZW1pdHRlZCBmb3IgZXZlcnkgY2hpbGRcbiAgICAgIGlmICghbmVzdGVkQXNwZWN0V2FybmluZyAmJiBub2RlQXNwZWN0c0NvdW50ICE9PSBhc3BlY3RzLmFsbC5sZW5ndGgpIHtcbiAgICAgICAgQW5ub3RhdGlvbnMub2YoY29uc3RydWN0KS5hZGRXYXJuaW5nKCdXZSBkZXRlY3RlZCBhbiBBc3BlY3Qgd2FzIGFkZGVkIHZpYSBhbm90aGVyIEFzcGVjdCwgYW5kIHdpbGwgbm90IGJlIGFwcGxpZWQnKTtcbiAgICAgICAgbmVzdGVkQXNwZWN0V2FybmluZyA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIG1hcmsgYXMgaW52b2tlZCBmb3IgdGhpcyBub2RlXG4gICAgICBpbnZva2VkLnB1c2goYXNwZWN0KTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGNvbnN0cnVjdC5ub2RlLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoIVN0YWdlLmlzU3RhZ2UoY2hpbGQpKSB7XG4gICAgICAgIHJlY3Vyc2UoY2hpbGQsIGFsbEFzcGVjdHNIZXJlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBGaW5kIGFsbCBzdGFja3MgYW5kIGFkZCBNZXRhZGF0YSBSZXNvdXJjZXMgdG8gYWxsIG9mIHRoZW1cbiAqXG4gKiBUaGVyZSBpcyBubyBnb29kIGdlbmVyaWMgcGxhY2UgdG8gZG8gdGhpcy4gQ2FuJ3QgZG8gaXQgaW4gdGhlIGNvbnN0cnVjdG9yXG4gKiAoYmVjYXVzZSBhZGRpbmcgYSBjaGlsZCBjb25zdHJ1Y3QgbWFrZXMgaXQgaW1wb3NzaWJsZSB0byBzZXQgY29udGV4dCBvbiB0aGVcbiAqIG5vZGUpLCBhbmQgdGhlIGdlbmVyaWMgcHJlcGFyZSBwaGFzZSBpcyBkZXByZWNhdGVkLlxuICpcbiAqIE9ubHkgZG8gdGhpcyBvbiBbcGFyZW50XSBzdGFja3MgKG5vdCBuZXN0ZWQgc3RhY2tzKSwgZG9uJ3QgZG8gdGhpcyB3aGVuXG4gKiBkaXNhYmxlZCBieSB0aGUgdXNlci5cbiAqXG4gKiBBbHNvLCBvbmx5IHdoZW4gcnVubmluZyB2aWEgdGhlIENMSS4gSWYgd2UgZG8gaXQgdW5jb25kaXRpb25hbGx5LFxuICogYWxsIHVuaXQgdGVzdHMgZXZlcnl3aGVyZSBhcmUgZ29pbmcgdG8gYnJlYWsgbWFzc2l2ZWx5LiBJJ3ZlIHNwZW50IGEgZGF5XG4gKiBmaXhpbmcgb3VyIG93biwgYnV0IGRvd25zdHJlYW0gdXNlcnMgd291bGQgYmUgYWZmZWN0ZWQganVzdCBhcyBiYWRseS5cbiAqXG4gKiBTdG9wIGF0IEFzc2VtYmx5IGJvdW5kYXJpZXMuXG4gKi9cbmZ1bmN0aW9uIGluamVjdE1ldGFkYXRhUmVzb3VyY2VzKHJvb3Q6IElDb25zdHJ1Y3QpIHtcbiAgdmlzaXQocm9vdCwgJ3Bvc3QnLCBjb25zdHJ1Y3QgPT4ge1xuICAgIGlmICghU3RhY2suaXNTdGFjayhjb25zdHJ1Y3QpIHx8ICFjb25zdHJ1Y3QuX3ZlcnNpb25SZXBvcnRpbmdFbmFibGVkKSB7IHJldHVybjsgfVxuXG4gICAgLy8gQmVjYXVzZSBvZiBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvYmxvYi9tYWluL3BhY2thZ2VzL2Fzc2VydC1pbnRlcm5hbC9saWIvc3ludGgtdXRpbHMudHMjTDc0XG4gICAgLy8gc3ludGhlc2l6ZSgpIG1heSBiZSBjYWxsZWQgbW9yZSB0aGFuIG9uY2Ugb24gYSBzdGFjayBpbiB1bml0IHRlc3RzLCBhbmQgdGhlIGJlbG93IHdvdWxkIGJyZWFrXG4gICAgLy8gaWYgd2UgZXhlY3V0ZSBpdCBhIHNlY29uZCB0aW1lLiBHdWFyZCBhZ2FpbnN0IHRoZSBjb25zdHJ1Y3RzIGFscmVhZHkgZXhpc3RpbmcuXG4gICAgY29uc3QgQ0RLTWV0YWRhdGEgPSAnQ0RLTWV0YWRhdGEnO1xuICAgIGlmIChjb25zdHJ1Y3Qubm9kZS50cnlGaW5kQ2hpbGQoQ0RLTWV0YWRhdGEpKSB7IHJldHVybjsgfVxuXG4gICAgbmV3IE1ldGFkYXRhUmVzb3VyY2UoY29uc3RydWN0LCBDREtNZXRhZGF0YSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEZpbmQgdGhlIHJvb3QgQXBwIGFuZCBhZGQgdGhlIFRyZWVNZXRhZGF0YSByZXNvdXJjZSAoaWYgZW5hYmxlZCkuXG4gKlxuICogVGhlcmUgaXMgbm8gZ29vZCBnZW5lcmljIHBsYWNlIHRvIGRvIHRoaXMuIENhbid0IGRvIGl0IGluIHRoZSBjb25zdHJ1Y3RvclxuICogKGJlY2F1c2UgYWRkaW5nIGEgY2hpbGQgY29uc3RydWN0IG1ha2VzIGl0IGltcG9zc2libGUgdG8gc2V0IGNvbnRleHQgb24gdGhlXG4gKiBub2RlKSwgYW5kIHRoZSBnZW5lcmljIHByZXBhcmUgcGhhc2UgaXMgZGVwcmVjYXRlZC5cbiAqL1xuZnVuY3Rpb24gaW5qZWN0VHJlZU1ldGFkYXRhKHJvb3Q6IElDb25zdHJ1Y3QpIHtcbiAgdmlzaXQocm9vdCwgJ3Bvc3QnLCBjb25zdHJ1Y3QgPT4ge1xuICAgIGlmICghQXBwLmlzQXBwKGNvbnN0cnVjdCkgfHwgIWNvbnN0cnVjdC5fdHJlZU1ldGFkYXRhKSByZXR1cm47XG4gICAgY29uc3QgQ0RLVHJlZU1ldGFkYXRhID0gJ1RyZWUnO1xuICAgIGlmIChjb25zdHJ1Y3Qubm9kZS50cnlGaW5kQ2hpbGQoQ0RLVHJlZU1ldGFkYXRhKSkgcmV0dXJuO1xuICAgIG5ldyBUcmVlTWV0YWRhdGEoY29uc3RydWN0KTtcbiAgfSk7XG59XG5cbi8qKlxuICogU3ludGhlc2l6ZSBjaGlsZHJlbiBpbiBwb3N0LW9yZGVyIGludG8gdGhlIGdpdmVuIGJ1aWxkZXJcbiAqXG4gKiBTdG9wIGF0IEFzc2VtYmx5IGJvdW5kYXJpZXMuXG4gKi9cbmZ1bmN0aW9uIHN5bnRoZXNpemVUcmVlKHJvb3Q6IElDb25zdHJ1Y3QsIGJ1aWxkZXI6IGN4YXBpLkNsb3VkQXNzZW1ibHlCdWlsZGVyLCB2YWxpZGF0ZU9uU3ludGg6IGJvb2xlYW4gPSBmYWxzZSkge1xuICB2aXNpdChyb290LCAncG9zdCcsIGNvbnN0cnVjdCA9PiB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IHtcbiAgICAgIG91dGRpcjogYnVpbGRlci5vdXRkaXIsXG4gICAgICBhc3NlbWJseTogYnVpbGRlcixcbiAgICAgIHZhbGlkYXRlT25TeW50aCxcbiAgICB9O1xuXG4gICAgaWYgKFN0YWNrLmlzU3RhY2soY29uc3RydWN0KSkge1xuICAgICAgY29uc3RydWN0LnN5bnRoZXNpemVyLnN5bnRoZXNpemUoc2Vzc2lvbik7XG4gICAgfSBlbHNlIGlmIChjb25zdHJ1Y3QgaW5zdGFuY2VvZiBUcmVlTWV0YWRhdGEpIHtcbiAgICAgIGNvbnN0cnVjdC5fc3ludGhlc2l6ZVRyZWUoc2Vzc2lvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGN1c3RvbSA9IGdldEN1c3RvbVN5bnRoZXNpcyhjb25zdHJ1Y3QpO1xuICAgICAgY3VzdG9tPy5vblN5bnRoZXNpemUoc2Vzc2lvbik7XG4gICAgfVxuICB9KTtcbn1cblxuaW50ZXJmYWNlIFZhbGlkYXRpb25FcnJvciB7XG4gIHJlYWRvbmx5IG1lc3NhZ2U6IHN0cmluZztcbiAgcmVhZG9ubHkgc291cmNlOiBJQ29uc3RydWN0O1xufVxuXG4vKipcbiAqIFZhbGlkYXRlIGFsbCBjb25zdHJ1Y3RzIGluIHRoZSBnaXZlbiBjb25zdHJ1Y3QgdHJlZVxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZVRyZWUocm9vdDogSUNvbnN0cnVjdCkge1xuICBjb25zdCBlcnJvcnMgPSBuZXcgQXJyYXk8VmFsaWRhdGlvbkVycm9yPigpO1xuXG4gIHZpc2l0KHJvb3QsICdwcmUnLCBjb25zdHJ1Y3QgPT4ge1xuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBjb25zdHJ1Y3Qubm9kZS52YWxpZGF0ZSgpKSB7XG4gICAgICBlcnJvcnMucHVzaCh7IG1lc3NhZ2UsIHNvdXJjZTogY29uc3RydWN0IH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgZXJyb3JMaXN0ID0gZXJyb3JzLm1hcChlID0+IGBbJHtlLnNvdXJjZS5ub2RlLnBhdGh9XSAke2UubWVzc2FnZX1gKS5qb2luKCdcXG4gICcpO1xuICAgIHRocm93IG5ldyBFcnJvcihgVmFsaWRhdGlvbiBmYWlsZWQgd2l0aCB0aGUgZm9sbG93aW5nIGVycm9yczpcXG4gICR7ZXJyb3JMaXN0fWApO1xuICB9XG59XG5cbi8qKlxuICogVmlzaXQgdGhlIGdpdmVuIGNvbnN0cnVjdCB0cmVlIGluIGVpdGhlciBwcmUgb3IgcG9zdCBvcmRlciwgc3RvcHBpbmcgYXQgQXNzZW1ibGllc1xuICovXG5mdW5jdGlvbiB2aXNpdChyb290OiBJQ29uc3RydWN0LCBvcmRlcjogJ3ByZScgfCAncG9zdCcsIGNiOiAoeDogSUNvbnN0cnVjdCkgPT4gdm9pZCkge1xuICBpZiAob3JkZXIgPT09ICdwcmUnKSB7XG4gICAgY2Iocm9vdCk7XG4gIH1cblxuICBmb3IgKGNvbnN0IGNoaWxkIG9mIHJvb3Qubm9kZS5jaGlsZHJlbikge1xuICAgIGlmIChTdGFnZS5pc1N0YWdlKGNoaWxkKSkgeyBjb250aW51ZTsgfVxuICAgIHZpc2l0KGNoaWxkLCBvcmRlciwgY2IpO1xuICB9XG5cbiAgaWYgKG9yZGVyID09PSAncG9zdCcpIHtcbiAgICBjYihyb290KTtcbiAgfVxufVxuIl19