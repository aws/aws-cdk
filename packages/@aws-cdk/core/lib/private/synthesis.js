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
    (0, prepare_app_1.prepareApp)(root);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGhlc2lzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3ludGhlc2lzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQUF5QztBQUV6QywyREFBdUQ7QUFDdkQsK0NBQTJDO0FBQzNDLG1EQUErQztBQUMvQyxnREFBNkM7QUFDN0MsZ0NBQTZCO0FBQzdCLHNDQUE2QztBQUM3QyxvQ0FBaUM7QUFFakMsb0NBQXdEO0FBYXhELFNBQWdCLFVBQVUsQ0FBQyxJQUFnQixFQUFFLFVBQTRCLEVBQUc7SUFDMUUsaURBQWlEO0lBQ2pELGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pCLG9HQUFvRztJQUNwRyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFckMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXBCLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTlCLHFCQUFxQjtJQUNyQixJQUFBLHdCQUFVLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFFakIsK0VBQStFO0lBQy9FLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFO1FBQzNCLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNwQjtJQUVELDRFQUE0RTtJQUM1RSx5QkFBeUI7SUFDekIsTUFBTSxPQUFPLEdBQUcsYUFBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDakMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0I7UUFDdkIsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVuRCx5RUFBeUU7SUFDekUsOERBQThEO0lBQzlELGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBRTNELE9BQU8sT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ2pDLENBQUM7QUE3QkQsZ0NBNkJDO0FBRUQsTUFB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SUFDakYsSUFBSSxLQUFLLEtBQUssS0FBSyxFQUFFO1FBQ25CLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNWO0lBRUQsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUN0QyxJQUFJLGFBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFBRSxTQUFTO1NBQUU7UUFDdkMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDekI7SUFFRCxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUU7UUFDcEIsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ1Y7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IE1ldGFkYXRhUmVzb3VyY2UgfSBmcm9tICcuL21ldGFkYXRhLXJlc291cmNlJztcbmltcG9ydCB7IHByZXBhcmVBcHAgfSBmcm9tICcuL3ByZXBhcmUtYXBwJztcbmltcG9ydCB7IFRyZWVNZXRhZGF0YSB9IGZyb20gJy4vdHJlZS1tZXRhZGF0YSc7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucyB9IGZyb20gJy4uL2Fubm90YXRpb25zJztcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4uL2FwcCc7XG5pbXBvcnQgeyBBc3BlY3RzLCBJQXNwZWN0IH0gZnJvbSAnLi4vYXNwZWN0JztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi4vc3RhY2snO1xuaW1wb3J0IHsgSVN5bnRoZXNpc1Nlc3Npb24gfSBmcm9tICcuLi9zdGFjay1zeW50aGVzaXplcnMvdHlwZXMnO1xuaW1wb3J0IHsgU3RhZ2UsIFN0YWdlU3ludGhlc2lzT3B0aW9ucyB9IGZyb20gJy4uL3N0YWdlJztcblxuLyoqXG4gKiBPcHRpb25zIGZvciBgc3ludGhlc2l6ZSgpYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN5bnRoZXNpc09wdGlvbnMgZXh0ZW5kcyBTdGFnZVN5bnRoZXNpc09wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG91dHB1dCBkaXJlY3RvcnkgaW50byB3aGljaCB0byBzeW50aGVzaXplIHRoZSBjbG91ZCBhc3NlbWJseS5cbiAgICogQGRlZmF1bHQgLSBjcmVhdGVzIGEgdGVtcG9yYXJ5IGRpcmVjdG9yeVxuICAgKi9cbiAgcmVhZG9ubHkgb3V0ZGlyPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3ludGhlc2l6ZShyb290OiBJQ29uc3RydWN0LCBvcHRpb25zOiBTeW50aGVzaXNPcHRpb25zID0geyB9KTogY3hhcGkuQ2xvdWRBc3NlbWJseSB7XG4gIC8vIGFkZCB0aGUgVHJlZU1ldGFkYXRhIHJlc291cmNlIHRvIHRoZSBBcHAgZmlyc3RcbiAgaW5qZWN0VHJlZU1ldGFkYXRhKHJvb3QpO1xuICAvLyB3ZSBzdGFydCBieSBjYWxsaW5nIFwic3ludGhcIiBvbiBhbGwgbmVzdGVkIGFzc2VtYmxpZXMgKHdoaWNoIHdpbGwgdGFrZSBjYXJlIG9mIGFsbCB0aGVpciBjaGlsZHJlbilcbiAgc3ludGhOZXN0ZWRBc3NlbWJsaWVzKHJvb3QsIG9wdGlvbnMpO1xuXG4gIGludm9rZUFzcGVjdHMocm9vdCk7XG5cbiAgaW5qZWN0TWV0YWRhdGFSZXNvdXJjZXMocm9vdCk7XG5cbiAgLy8gcmVzb2x2ZSByZWZlcmVuY2VzXG4gIHByZXBhcmVBcHAocm9vdCk7XG5cbiAgLy8gZ2l2ZSBhbGwgY2hpbGRyZW4gYW4gb3Bwb3J0dW5pdHkgdG8gdmFsaWRhdGUgbm93IHRoYXQgd2UndmUgZmluaXNoZWQgcHJlcGFyZVxuICBpZiAoIW9wdGlvbnMuc2tpcFZhbGlkYXRpb24pIHtcbiAgICB2YWxpZGF0ZVRyZWUocm9vdCk7XG4gIH1cblxuICAvLyBpbiB1bml0IHRlc3RzLCB3ZSBzdXBwb3J0IGNyZWF0aW5nIGZyZWUtc3RhbmRpbmcgc3RhY2tzLCBzbyB3ZSBjcmVhdGUgdGhlXG4gIC8vIGFzc2VtYmx5IGJ1aWxkZXIgaGVyZS5cbiAgY29uc3QgYnVpbGRlciA9IFN0YWdlLmlzU3RhZ2Uocm9vdClcbiAgICA/IHJvb3QuX2Fzc2VtYmx5QnVpbGRlclxuICAgIDogbmV3IGN4YXBpLkNsb3VkQXNzZW1ibHlCdWlsZGVyKG9wdGlvbnMub3V0ZGlyKTtcblxuICAvLyBuZXh0LCB3ZSBpbnZva2UgXCJvblN5bnRoZXNpemVcIiBvbiBhbGwgb2Ygb3VyIGNoaWxkcmVuLiB0aGlzIHdpbGwgYWxsb3dcbiAgLy8gc3RhY2tzIHRvIGFkZCB0aGVtc2VsdmVzIHRvIHRoZSBzeW50aGVzaXplZCBjbG91ZCBhc3NlbWJseS5cbiAgc3ludGhlc2l6ZVRyZWUocm9vdCwgYnVpbGRlciwgb3B0aW9ucy52YWxpZGF0ZU9uU3ludGhlc2lzKTtcblxuICByZXR1cm4gYnVpbGRlci5idWlsZEFzc2VtYmx5KCk7XG59XG5cbmNvbnN0IENVU1RPTV9TWU5USEVTSVNfU1lNID0gU3ltYm9sLmZvcignQGF3cy1jZGsvY29yZTpjdXN0b21TeW50aGVzaXMnKTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGNvbnN0cnVjdHMgdGhhdCB3YW50IHRvIGRvIHNvbWV0aGluZyBjdXN0b20gZHVyaW5nIHN5bnRoZXNpc1xuICpcbiAqIFRoaXMgZmVhdHVyZSBpcyBpbnRlbmRlZCBmb3IgdXNlIGJ5IG9mZmljaWFsIEFXUyBDREsgbGlicmFyaWVzIG9ubHk7IDNyZCBwYXJ0eVxuICogbGlicmFyeSBhdXRob3JzIGFuZCBDREsgdXNlcnMgc2hvdWxkIG5vdCB1c2UgdGhpcyBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQ3VzdG9tU3ludGhlc2lzIHtcbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjb25zdHJ1Y3QgaXMgc3ludGhlc2l6ZWRcbiAgICovXG4gIG9uU3ludGhlc2l6ZShzZXNzaW9uOiBJU3ludGhlc2lzU2Vzc2lvbik6IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRDdXN0b21TeW50aGVzaXMoY29uc3RydWN0OiBJQ29uc3RydWN0LCBzeW50aGVzaXM6IElDdXN0b21TeW50aGVzaXMpOiB2b2lkIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdCwgQ1VTVE9NX1NZTlRIRVNJU19TWU0sIHtcbiAgICB2YWx1ZTogc3ludGhlc2lzLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q3VzdG9tU3ludGhlc2lzKGNvbnN0cnVjdDogSUNvbnN0cnVjdCk6IElDdXN0b21TeW50aGVzaXMgfCB1bmRlZmluZWQge1xuICByZXR1cm4gKGNvbnN0cnVjdCBhcyBhbnkpW0NVU1RPTV9TWU5USEVTSVNfU1lNXTtcbn1cblxuLyoqXG4gKiBGaW5kIEFzc2VtYmxpZXMgaW5zaWRlIHRoZSBjb25zdHJ1Y3QgYW5kIGNhbGwgJ3N5bnRoJyBvbiB0aGVtXG4gKlxuICogKFRoZXkgd2lsbCBpbiB0dXJuIHJlY3Vyc2UgYWdhaW4pXG4gKi9cbmZ1bmN0aW9uIHN5bnRoTmVzdGVkQXNzZW1ibGllcyhyb290OiBJQ29uc3RydWN0LCBvcHRpb25zOiBTdGFnZVN5bnRoZXNpc09wdGlvbnMpIHtcbiAgZm9yIChjb25zdCBjaGlsZCBvZiByb290Lm5vZGUuY2hpbGRyZW4pIHtcbiAgICBpZiAoU3RhZ2UuaXNTdGFnZShjaGlsZCkpIHtcbiAgICAgIGNoaWxkLnN5bnRoKG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzeW50aE5lc3RlZEFzc2VtYmxpZXMoY2hpbGQsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEludm9rZSBhc3BlY3RzIG9uIHRoZSBnaXZlbiBjb25zdHJ1Y3QgdHJlZS5cbiAqXG4gKiBBc3BlY3RzIGFyZSBub3QgcHJvcGFnYXRlZCBhY3Jvc3MgQXNzZW1ibHkgYm91bmRhcmllcy4gVGhlIHNhbWUgQXNwZWN0IHdpbGwgbm90IGJlIGludm9rZWRcbiAqIHR3aWNlIGZvciB0aGUgc2FtZSBjb25zdHJ1Y3QuXG4gKi9cbmZ1bmN0aW9uIGludm9rZUFzcGVjdHMocm9vdDogSUNvbnN0cnVjdCkge1xuICBjb25zdCBpbnZva2VkQnlQYXRoOiB7IFtub2RlUGF0aDogc3RyaW5nXTogSUFzcGVjdFtdIH0gPSB7IH07XG5cbiAgbGV0IG5lc3RlZEFzcGVjdFdhcm5pbmcgPSBmYWxzZTtcbiAgcmVjdXJzZShyb290LCBbXSk7XG5cbiAgZnVuY3Rpb24gcmVjdXJzZShjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QsIGluaGVyaXRlZEFzcGVjdHM6IElBc3BlY3RbXSkge1xuICAgIGNvbnN0IG5vZGUgPSBjb25zdHJ1Y3Qubm9kZTtcbiAgICBjb25zdCBhc3BlY3RzID0gQXNwZWN0cy5vZihjb25zdHJ1Y3QpO1xuICAgIGNvbnN0IGFsbEFzcGVjdHNIZXJlID0gWy4uLmluaGVyaXRlZEFzcGVjdHMgPz8gW10sIC4uLmFzcGVjdHMuYWxsXTtcbiAgICBjb25zdCBub2RlQXNwZWN0c0NvdW50ID0gYXNwZWN0cy5hbGwubGVuZ3RoO1xuICAgIGZvciAoY29uc3QgYXNwZWN0IG9mIGFsbEFzcGVjdHNIZXJlKSB7XG4gICAgICBsZXQgaW52b2tlZCA9IGludm9rZWRCeVBhdGhbbm9kZS5wYXRoXTtcbiAgICAgIGlmICghaW52b2tlZCkge1xuICAgICAgICBpbnZva2VkID0gaW52b2tlZEJ5UGF0aFtub2RlLnBhdGhdID0gW107XG4gICAgICB9XG5cbiAgICAgIGlmIChpbnZva2VkLmluY2x1ZGVzKGFzcGVjdCkpIHsgY29udGludWU7IH1cblxuICAgICAgYXNwZWN0LnZpc2l0KGNvbnN0cnVjdCk7XG5cbiAgICAgIC8vIGlmIGFuIGFzcGVjdCB3YXMgYWRkZWQgdG8gdGhlIG5vZGUgd2hpbGUgaW52b2tpbmcgYW5vdGhlciBhc3BlY3QgaXQgd2lsbCBub3QgYmUgaW52b2tlZCwgZW1pdCBhIHdhcm5pbmdcbiAgICAgIC8vIHRoZSBgbmVzdGVkQXNwZWN0V2FybmluZ2AgZmxhZyBpcyB1c2VkIHRvIHByZXZlbnQgdGhlIHdhcm5pbmcgZnJvbSBiZWluZyBlbWl0dGVkIGZvciBldmVyeSBjaGlsZFxuICAgICAgaWYgKCFuZXN0ZWRBc3BlY3RXYXJuaW5nICYmIG5vZGVBc3BlY3RzQ291bnQgIT09IGFzcGVjdHMuYWxsLmxlbmd0aCkge1xuICAgICAgICBBbm5vdGF0aW9ucy5vZihjb25zdHJ1Y3QpLmFkZFdhcm5pbmcoJ1dlIGRldGVjdGVkIGFuIEFzcGVjdCB3YXMgYWRkZWQgdmlhIGFub3RoZXIgQXNwZWN0LCBhbmQgd2lsbCBub3QgYmUgYXBwbGllZCcpO1xuICAgICAgICBuZXN0ZWRBc3BlY3RXYXJuaW5nID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gbWFyayBhcyBpbnZva2VkIGZvciB0aGlzIG5vZGVcbiAgICAgIGludm9rZWQucHVzaChhc3BlY3QpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY29uc3RydWN0Lm5vZGUuY2hpbGRyZW4pIHtcbiAgICAgIGlmICghU3RhZ2UuaXNTdGFnZShjaGlsZCkpIHtcbiAgICAgICAgcmVjdXJzZShjaGlsZCwgYWxsQXNwZWN0c0hlcmUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEZpbmQgYWxsIHN0YWNrcyBhbmQgYWRkIE1ldGFkYXRhIFJlc291cmNlcyB0byBhbGwgb2YgdGhlbVxuICpcbiAqIFRoZXJlIGlzIG5vIGdvb2QgZ2VuZXJpYyBwbGFjZSB0byBkbyB0aGlzLiBDYW4ndCBkbyBpdCBpbiB0aGUgY29uc3RydWN0b3JcbiAqIChiZWNhdXNlIGFkZGluZyBhIGNoaWxkIGNvbnN0cnVjdCBtYWtlcyBpdCBpbXBvc3NpYmxlIHRvIHNldCBjb250ZXh0IG9uIHRoZVxuICogbm9kZSksIGFuZCB0aGUgZ2VuZXJpYyBwcmVwYXJlIHBoYXNlIGlzIGRlcHJlY2F0ZWQuXG4gKlxuICogT25seSBkbyB0aGlzIG9uIFtwYXJlbnRdIHN0YWNrcyAobm90IG5lc3RlZCBzdGFja3MpLCBkb24ndCBkbyB0aGlzIHdoZW5cbiAqIGRpc2FibGVkIGJ5IHRoZSB1c2VyLlxuICpcbiAqIEFsc28sIG9ubHkgd2hlbiBydW5uaW5nIHZpYSB0aGUgQ0xJLiBJZiB3ZSBkbyBpdCB1bmNvbmRpdGlvbmFsbHksXG4gKiBhbGwgdW5pdCB0ZXN0cyBldmVyeXdoZXJlIGFyZSBnb2luZyB0byBicmVhayBtYXNzaXZlbHkuIEkndmUgc3BlbnQgYSBkYXlcbiAqIGZpeGluZyBvdXIgb3duLCBidXQgZG93bnN0cmVhbSB1c2VycyB3b3VsZCBiZSBhZmZlY3RlZCBqdXN0IGFzIGJhZGx5LlxuICpcbiAqIFN0b3AgYXQgQXNzZW1ibHkgYm91bmRhcmllcy5cbiAqL1xuZnVuY3Rpb24gaW5qZWN0TWV0YWRhdGFSZXNvdXJjZXMocm9vdDogSUNvbnN0cnVjdCkge1xuICB2aXNpdChyb290LCAncG9zdCcsIGNvbnN0cnVjdCA9PiB7XG4gICAgaWYgKCFTdGFjay5pc1N0YWNrKGNvbnN0cnVjdCkgfHwgIWNvbnN0cnVjdC5fdmVyc2lvblJlcG9ydGluZ0VuYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBCZWNhdXNlIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9ibG9iL21haW4vcGFja2FnZXMvYXNzZXJ0LWludGVybmFsL2xpYi9zeW50aC11dGlscy50cyNMNzRcbiAgICAvLyBzeW50aGVzaXplKCkgbWF5IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSBvbiBhIHN0YWNrIGluIHVuaXQgdGVzdHMsIGFuZCB0aGUgYmVsb3cgd291bGQgYnJlYWtcbiAgICAvLyBpZiB3ZSBleGVjdXRlIGl0IGEgc2Vjb25kIHRpbWUuIEd1YXJkIGFnYWluc3QgdGhlIGNvbnN0cnVjdHMgYWxyZWFkeSBleGlzdGluZy5cbiAgICBjb25zdCBDREtNZXRhZGF0YSA9ICdDREtNZXRhZGF0YSc7XG4gICAgaWYgKGNvbnN0cnVjdC5ub2RlLnRyeUZpbmRDaGlsZChDREtNZXRhZGF0YSkpIHsgcmV0dXJuOyB9XG5cbiAgICBuZXcgTWV0YWRhdGFSZXNvdXJjZShjb25zdHJ1Y3QsIENES01ldGFkYXRhKTtcbiAgfSk7XG59XG5cbi8qKlxuICogRmluZCB0aGUgcm9vdCBBcHAgYW5kIGFkZCB0aGUgVHJlZU1ldGFkYXRhIHJlc291cmNlIChpZiBlbmFibGVkKS5cbiAqXG4gKiBUaGVyZSBpcyBubyBnb29kIGdlbmVyaWMgcGxhY2UgdG8gZG8gdGhpcy4gQ2FuJ3QgZG8gaXQgaW4gdGhlIGNvbnN0cnVjdG9yXG4gKiAoYmVjYXVzZSBhZGRpbmcgYSBjaGlsZCBjb25zdHJ1Y3QgbWFrZXMgaXQgaW1wb3NzaWJsZSB0byBzZXQgY29udGV4dCBvbiB0aGVcbiAqIG5vZGUpLCBhbmQgdGhlIGdlbmVyaWMgcHJlcGFyZSBwaGFzZSBpcyBkZXByZWNhdGVkLlxuICovXG5mdW5jdGlvbiBpbmplY3RUcmVlTWV0YWRhdGEocm9vdDogSUNvbnN0cnVjdCkge1xuICB2aXNpdChyb290LCAncG9zdCcsIGNvbnN0cnVjdCA9PiB7XG4gICAgaWYgKCFBcHAuaXNBcHAoY29uc3RydWN0KSB8fCAhY29uc3RydWN0Ll90cmVlTWV0YWRhdGEpIHJldHVybjtcbiAgICBjb25zdCBDREtUcmVlTWV0YWRhdGEgPSAnVHJlZSc7XG4gICAgaWYgKGNvbnN0cnVjdC5ub2RlLnRyeUZpbmRDaGlsZChDREtUcmVlTWV0YWRhdGEpKSByZXR1cm47XG4gICAgbmV3IFRyZWVNZXRhZGF0YShjb25zdHJ1Y3QpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBTeW50aGVzaXplIGNoaWxkcmVuIGluIHBvc3Qtb3JkZXIgaW50byB0aGUgZ2l2ZW4gYnVpbGRlclxuICpcbiAqIFN0b3AgYXQgQXNzZW1ibHkgYm91bmRhcmllcy5cbiAqL1xuZnVuY3Rpb24gc3ludGhlc2l6ZVRyZWUocm9vdDogSUNvbnN0cnVjdCwgYnVpbGRlcjogY3hhcGkuQ2xvdWRBc3NlbWJseUJ1aWxkZXIsIHZhbGlkYXRlT25TeW50aDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gIHZpc2l0KHJvb3QsICdwb3N0JywgY29uc3RydWN0ID0+IHtcbiAgICBjb25zdCBzZXNzaW9uID0ge1xuICAgICAgb3V0ZGlyOiBidWlsZGVyLm91dGRpcixcbiAgICAgIGFzc2VtYmx5OiBidWlsZGVyLFxuICAgICAgdmFsaWRhdGVPblN5bnRoLFxuICAgIH07XG5cbiAgICBpZiAoU3RhY2suaXNTdGFjayhjb25zdHJ1Y3QpKSB7XG4gICAgICBjb25zdHJ1Y3Quc3ludGhlc2l6ZXIuc3ludGhlc2l6ZShzZXNzaW9uKTtcbiAgICB9IGVsc2UgaWYgKGNvbnN0cnVjdCBpbnN0YW5jZW9mIFRyZWVNZXRhZGF0YSkge1xuICAgICAgY29uc3RydWN0Ll9zeW50aGVzaXplVHJlZShzZXNzaW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY3VzdG9tID0gZ2V0Q3VzdG9tU3ludGhlc2lzKGNvbnN0cnVjdCk7XG4gICAgICBjdXN0b20/Lm9uU3ludGhlc2l6ZShzZXNzaW9uKTtcbiAgICB9XG4gIH0pO1xufVxuXG5pbnRlcmZhY2UgVmFsaWRhdGlvbkVycm9yIHtcbiAgcmVhZG9ubHkgbWVzc2FnZTogc3RyaW5nO1xuICByZWFkb25seSBzb3VyY2U6IElDb25zdHJ1Y3Q7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgYWxsIGNvbnN0cnVjdHMgaW4gdGhlIGdpdmVuIGNvbnN0cnVjdCB0cmVlXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlVHJlZShyb290OiBJQ29uc3RydWN0KSB7XG4gIGNvbnN0IGVycm9ycyA9IG5ldyBBcnJheTxWYWxpZGF0aW9uRXJyb3I+KCk7XG5cbiAgdmlzaXQocm9vdCwgJ3ByZScsIGNvbnN0cnVjdCA9PiB7XG4gICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIGNvbnN0cnVjdC5ub2RlLnZhbGlkYXRlKCkpIHtcbiAgICAgIGVycm9ycy5wdXNoKHsgbWVzc2FnZSwgc291cmNlOiBjb25zdHJ1Y3QgfSk7XG4gICAgfVxuICB9KTtcblxuICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBlcnJvckxpc3QgPSBlcnJvcnMubWFwKGUgPT4gYFske2Uuc291cmNlLm5vZGUucGF0aH1dICR7ZS5tZXNzYWdlfWApLmpvaW4oJ1xcbiAgJyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBWYWxpZGF0aW9uIGZhaWxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgZXJyb3JzOlxcbiAgJHtlcnJvckxpc3R9YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBWaXNpdCB0aGUgZ2l2ZW4gY29uc3RydWN0IHRyZWUgaW4gZWl0aGVyIHByZSBvciBwb3N0IG9yZGVyLCBzdG9wcGluZyBhdCBBc3NlbWJsaWVzXG4gKi9cbmZ1bmN0aW9uIHZpc2l0KHJvb3Q6IElDb25zdHJ1Y3QsIG9yZGVyOiAncHJlJyB8ICdwb3N0JywgY2I6ICh4OiBJQ29uc3RydWN0KSA9PiB2b2lkKSB7XG4gIGlmIChvcmRlciA9PT0gJ3ByZScpIHtcbiAgICBjYihyb290KTtcbiAgfVxuXG4gIGZvciAoY29uc3QgY2hpbGQgb2Ygcm9vdC5ub2RlLmNoaWxkcmVuKSB7XG4gICAgaWYgKFN0YWdlLmlzU3RhZ2UoY2hpbGQpKSB7IGNvbnRpbnVlOyB9XG4gICAgdmlzaXQoY2hpbGQsIG9yZGVyLCBjYik7XG4gIH1cblxuICBpZiAob3JkZXIgPT09ICdwb3N0Jykge1xuICAgIGNiKHJvb3QpO1xuICB9XG59XG4iXX0=