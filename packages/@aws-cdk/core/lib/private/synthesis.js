"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCustomSynthesis = exports.synthesize = void 0;
const crypto_1 = require("crypto");
const fs = require("fs");
const path = require("path");
const cxapi = require("@aws-cdk/cx-api");
const metadata_resource_1 = require("./metadata-resource");
const prepare_app_1 = require("./prepare-app");
const tree_metadata_1 = require("./tree-metadata");
const annotations_1 = require("../annotations");
const app_1 = require("../app");
const aspect_1 = require("../aspect");
const stack_1 = require("../stack");
const stage_1 = require("../stage");
const construct_tree_1 = require("../validation/private/construct-tree");
const report_1 = require("../validation/private/report");
const POLICY_VALIDATION_FILE_PATH = 'policy-validation-report.json';
const VALIDATION_REPORT_JSON_CONTEXT = '@aws-cdk/core:validationReportJson';
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
    const assembly = builder.buildAssembly();
    invokeValidationPlugins(root, builder.outdir, assembly);
    return assembly;
}
exports.synthesize = synthesize;
/**
 * Find all the assemblies in the app, including all levels of nested assemblies
 * and return a map where the assemblyId is the key
 */
function getAssemblies(root, rootAssembly) {
    const assemblies = new Map();
    assemblies.set(root.artifactId, rootAssembly);
    visitAssemblies(root, 'pre', construct => {
        const stage = construct;
        if (stage.parentStage && assemblies.has(stage.parentStage.artifactId)) {
            assemblies.set(stage.artifactId, assemblies.get(stage.parentStage.artifactId).getNestedAssembly(stage.artifactId));
        }
    });
    return assemblies;
}
/**
 * Invoke validation plugins for all stages in an App.
 */
function invokeValidationPlugins(root, outdir, assembly) {
    if (!app_1.App.isApp(root))
        return;
    const hash = computeChecksumOfFolder(outdir);
    const assemblies = getAssemblies(root, assembly);
    const templatePathsByPlugin = new Map();
    visitAssemblies(root, 'post', construct => {
        if (stage_1.Stage.isStage(construct)) {
            for (const plugin of construct.policyValidationBeta1) {
                if (!templatePathsByPlugin.has(plugin)) {
                    templatePathsByPlugin.set(plugin, []);
                }
                let assemblyToUse = assemblies.get(construct.artifactId);
                if (!assemblyToUse)
                    throw new Error(`Validation failed, cannot find cloud assembly for stage ${construct.stageName}`);
                templatePathsByPlugin.get(plugin).push(...assemblyToUse.stacksRecursively.map(stack => stack.templateFullPath));
            }
        }
    });
    const reports = [];
    if (templatePathsByPlugin.size > 0) {
        // eslint-disable-next-line no-console
        console.log('Performing Policy Validations\n');
    }
    for (const [plugin, paths] of templatePathsByPlugin.entries()) {
        try {
            const report = plugin.validate({ templatePaths: paths });
            reports.push({ ...report, pluginName: plugin.name });
        }
        catch (e) {
            reports.push({
                success: false,
                pluginName: plugin.name,
                pluginVersion: plugin.version,
                violations: [],
                metadata: {
                    error: `Validation plugin '${plugin.name}' failed: ${e.message}`,
                },
            });
        }
        if (computeChecksumOfFolder(outdir) !== hash) {
            throw new Error(`Illegal operation: validation plugin '${plugin.name}' modified the cloud assembly`);
        }
    }
    if (reports.length > 0) {
        const tree = new construct_tree_1.ConstructTree(root);
        const formatter = new report_1.PolicyValidationReportFormatter(tree);
        const formatJson = root.node.tryGetContext(VALIDATION_REPORT_JSON_CONTEXT) ?? false;
        const output = formatJson
            ? formatter.formatJson(reports)
            : formatter.formatPrettyPrinted(reports);
        if (formatJson) {
            fs.writeFileSync(path.join(assembly.directory, POLICY_VALIDATION_FILE_PATH), JSON.stringify(output, undefined, 2));
        }
        else {
            // eslint-disable-next-line no-console
            console.error(output);
        }
        const failed = reports.some(r => !r.success);
        if (failed) {
            throw new Error('Validation failed. See the validation report above for details');
        }
        else {
            // eslint-disable-next-line no-console
            console.log('Policy Validation Successful!');
        }
    }
}
function computeChecksumOfFolder(folder) {
    const hash = (0, crypto_1.createHash)('sha256');
    const files = fs.readdirSync(folder, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(folder, file.name);
        if (file.isDirectory()) {
            hash.update(computeChecksumOfFolder(fullPath));
        }
        else if (file.isFile()) {
            hash.update(fs.readFileSync(fullPath));
        }
    }
    return hash.digest().toString('hex');
}
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
 * Visit the given construct tree in either pre or post order, only looking at Assemblies
 */
function visitAssemblies(root, order, cb) {
    if (order === 'pre') {
        cb(root);
    }
    for (const child of root.node.children) {
        if (!stage_1.Stage.isStage(child)) {
            continue;
        }
        visitAssemblies(child, order, cb);
    }
    if (order === 'post') {
        cb(root);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGhlc2lzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3ludGhlc2lzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFvQztBQUNwQyx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLHlDQUF5QztBQUd6QywyREFBdUQ7QUFDdkQsK0NBQTJDO0FBQzNDLG1EQUErQztBQUMvQyxnREFBNkM7QUFDN0MsZ0NBQTZCO0FBQzdCLHNDQUE2QztBQUM3QyxvQ0FBaUM7QUFFakMsb0NBQXdEO0FBRXhELHlFQUFxRTtBQUNyRSx5REFBNEc7QUFFNUcsTUFBTSwyQkFBMkIsR0FBRywrQkFBK0IsQ0FBQztBQUNwRSxNQUFNLDhCQUE4QixHQUFHLG9DQUFvQyxDQUFDO0FBYTVFLFNBQWdCLFVBQVUsQ0FBQyxJQUFnQixFQUFFLFVBQTRCLEVBQUc7SUFDMUUsaURBQWlEO0lBQ2pELGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pCLG9HQUFvRztJQUNwRyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFckMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXBCLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTlCLHFCQUFxQjtJQUNyQixJQUFBLHdCQUFVLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFFakIsK0VBQStFO0lBQy9FLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFO1FBQzNCLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNwQjtJQUVELDRFQUE0RTtJQUM1RSx5QkFBeUI7SUFDekIsTUFBTSxPQUFPLEdBQUcsYUFBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDakMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0I7UUFDdkIsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVuRCx5RUFBeUU7SUFDekUsOERB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aW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDbG91ZEFzc2VtYmx5IH0gZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IE1ldGFkYXRhUmVzb3VyY2UgfSBmcm9tICcuL21ldGFkYXRhLXJlc291cmNlJztcbmltcG9ydCB7IHByZXBhcmVBcHAgfSBmcm9tICcuL3ByZXBhcmUtYXBwJztcbmltcG9ydCB7IFRyZWVNZXRhZGF0YSB9IGZyb20gJy4vdHJlZS1tZXRhZGF0YSc7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucyB9IGZyb20gJy4uL2Fubm90YXRpb25zJztcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4uL2FwcCc7XG5pbXBvcnQgeyBBc3BlY3RzLCBJQXNwZWN0IH0gZnJvbSAnLi4vYXNwZWN0JztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi4vc3RhY2snO1xuaW1wb3J0IHsgSVN5bnRoZXNpc1Nlc3Npb24gfSBmcm9tICcuLi9zdGFjay1zeW50aGVzaXplcnMvdHlwZXMnO1xuaW1wb3J0IHsgU3RhZ2UsIFN0YWdlU3ludGhlc2lzT3B0aW9ucyB9IGZyb20gJy4uL3N0YWdlJztcbmltcG9ydCB7IElQb2xpY3lWYWxpZGF0aW9uUGx1Z2luQmV0YTEgfSBmcm9tICcuLi92YWxpZGF0aW9uJztcbmltcG9ydCB7IENvbnN0cnVjdFRyZWUgfSBmcm9tICcuLi92YWxpZGF0aW9uL3ByaXZhdGUvY29uc3RydWN0LXRyZWUnO1xuaW1wb3J0IHsgUG9saWN5VmFsaWRhdGlvblJlcG9ydEZvcm1hdHRlciwgTmFtZWRWYWxpZGF0aW9uUGx1Z2luUmVwb3J0IH0gZnJvbSAnLi4vdmFsaWRhdGlvbi9wcml2YXRlL3JlcG9ydCc7XG5cbmNvbnN0IFBPTElDWV9WQUxJREFUSU9OX0ZJTEVfUEFUSCA9ICdwb2xpY3ktdmFsaWRhdGlvbi1yZXBvcnQuanNvbic7XG5jb25zdCBWQUxJREFUSU9OX1JFUE9SVF9KU09OX0NPTlRFWFQgPSAnQGF3cy1jZGsvY29yZTp2YWxpZGF0aW9uUmVwb3J0SnNvbic7XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYHN5bnRoZXNpemUoKWBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTeW50aGVzaXNPcHRpb25zIGV4dGVuZHMgU3RhZ2VTeW50aGVzaXNPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBvdXRwdXQgZGlyZWN0b3J5IGludG8gd2hpY2ggdG8gc3ludGhlc2l6ZSB0aGUgY2xvdWQgYXNzZW1ibHkuXG4gICAqIEBkZWZhdWx0IC0gY3JlYXRlcyBhIHRlbXBvcmFyeSBkaXJlY3RvcnlcbiAgICovXG4gIHJlYWRvbmx5IG91dGRpcj86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN5bnRoZXNpemUocm9vdDogSUNvbnN0cnVjdCwgb3B0aW9uczogU3ludGhlc2lzT3B0aW9ucyA9IHsgfSk6IGN4YXBpLkNsb3VkQXNzZW1ibHkge1xuICAvLyBhZGQgdGhlIFRyZWVNZXRhZGF0YSByZXNvdXJjZSB0byB0aGUgQXBwIGZpcnN0XG4gIGluamVjdFRyZWVNZXRhZGF0YShyb290KTtcbiAgLy8gd2Ugc3RhcnQgYnkgY2FsbGluZyBcInN5bnRoXCIgb24gYWxsIG5lc3RlZCBhc3NlbWJsaWVzICh3aGljaCB3aWxsIHRha2UgY2FyZSBvZiBhbGwgdGhlaXIgY2hpbGRyZW4pXG4gIHN5bnRoTmVzdGVkQXNzZW1ibGllcyhyb290LCBvcHRpb25zKTtcblxuICBpbnZva2VBc3BlY3RzKHJvb3QpO1xuXG4gIGluamVjdE1ldGFkYXRhUmVzb3VyY2VzKHJvb3QpO1xuXG4gIC8vIHJlc29sdmUgcmVmZXJlbmNlc1xuICBwcmVwYXJlQXBwKHJvb3QpO1xuXG4gIC8vIGdpdmUgYWxsIGNoaWxkcmVuIGFuIG9wcG9ydHVuaXR5IHRvIHZhbGlkYXRlIG5vdyB0aGF0IHdlJ3ZlIGZpbmlzaGVkIHByZXBhcmVcbiAgaWYgKCFvcHRpb25zLnNraXBWYWxpZGF0aW9uKSB7XG4gICAgdmFsaWRhdGVUcmVlKHJvb3QpO1xuICB9XG5cbiAgLy8gaW4gdW5pdCB0ZXN0cywgd2Ugc3VwcG9ydCBjcmVhdGluZyBmcmVlLXN0YW5kaW5nIHN0YWNrcywgc28gd2UgY3JlYXRlIHRoZVxuICAvLyBhc3NlbWJseSBidWlsZGVyIGhlcmUuXG4gIGNvbnN0IGJ1aWxkZXIgPSBTdGFnZS5pc1N0YWdlKHJvb3QpXG4gICAgPyByb290Ll9hc3NlbWJseUJ1aWxkZXJcbiAgICA6IG5ldyBjeGFwaS5DbG91ZEFzc2VtYmx5QnVpbGRlcihvcHRpb25zLm91dGRpcik7XG5cbiAgLy8gbmV4dCwgd2UgaW52b2tlIFwib25TeW50aGVzaXplXCIgb24gYWxsIG9mIG91ciBjaGlsZHJlbi4gdGhpcyB3aWxsIGFsbG93XG4gIC8vIHN0YWNrcyB0byBhZGQgdGhlbXNlbHZlcyB0byB0aGUgc3ludGhlc2l6ZWQgY2xvdWQgYXNzZW1ibHkuXG4gIHN5bnRoZXNpemVUcmVlKHJvb3QsIGJ1aWxkZXIsIG9wdGlvbnMudmFsaWRhdGVPblN5bnRoZXNpcyk7XG5cbiAgY29uc3QgYXNzZW1ibHkgPSBidWlsZGVyLmJ1aWxkQXNzZW1ibHkoKTtcblxuICBpbnZva2VWYWxpZGF0aW9uUGx1Z2lucyhyb290LCBidWlsZGVyLm91dGRpciwgYXNzZW1ibHkpO1xuXG4gIHJldHVybiBhc3NlbWJseTtcbn1cblxuLyoqXG4gKiBGaW5kIGFsbCB0aGUgYXNzZW1ibGllcyBpbiB0aGUgYXBwLCBpbmNsdWRpbmcgYWxsIGxldmVscyBvZiBuZXN0ZWQgYXNzZW1ibGllc1xuICogYW5kIHJldHVybiBhIG1hcCB3aGVyZSB0aGUgYXNzZW1ibHlJZCBpcyB0aGUga2V5XG4gKi9cbmZ1bmN0aW9uIGdldEFzc2VtYmxpZXMocm9vdDogQXBwLCByb290QXNzZW1ibHk6IENsb3VkQXNzZW1ibHkpOiBNYXA8c3RyaW5nLCBDbG91ZEFzc2VtYmx5PiB7XG4gIGNvbnN0IGFzc2VtYmxpZXMgPSBuZXcgTWFwPHN0cmluZywgQ2xvdWRBc3NlbWJseT4oKTtcbiAgYXNzZW1ibGllcy5zZXQocm9vdC5hcnRpZmFjdElkLCByb290QXNzZW1ibHkpO1xuICB2aXNpdEFzc2VtYmxpZXMocm9vdCwgJ3ByZScsIGNvbnN0cnVjdCA9PiB7XG4gICAgY29uc3Qgc3RhZ2UgPSBjb25zdHJ1Y3QgYXMgU3RhZ2U7XG4gICAgaWYgKHN0YWdlLnBhcmVudFN0YWdlICYmIGFzc2VtYmxpZXMuaGFzKHN0YWdlLnBhcmVudFN0YWdlLmFydGlmYWN0SWQpKSB7XG4gICAgICBhc3NlbWJsaWVzLnNldChcbiAgICAgICAgc3RhZ2UuYXJ0aWZhY3RJZCxcbiAgICAgICAgYXNzZW1ibGllcy5nZXQoc3RhZ2UucGFyZW50U3RhZ2UuYXJ0aWZhY3RJZCkhLmdldE5lc3RlZEFzc2VtYmx5KHN0YWdlLmFydGlmYWN0SWQpLFxuICAgICAgKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYXNzZW1ibGllcztcbn1cblxuLyoqXG4gKiBJbnZva2UgdmFsaWRhdGlvbiBwbHVnaW5zIGZvciBhbGwgc3RhZ2VzIGluIGFuIEFwcC5cbiAqL1xuZnVuY3Rpb24gaW52b2tlVmFsaWRhdGlvblBsdWdpbnMocm9vdDogSUNvbnN0cnVjdCwgb3V0ZGlyOiBzdHJpbmcsIGFzc2VtYmx5OiBDbG91ZEFzc2VtYmx5KSB7XG4gIGlmICghQXBwLmlzQXBwKHJvb3QpKSByZXR1cm47XG4gIGNvbnN0IGhhc2ggPSBjb21wdXRlQ2hlY2tzdW1PZkZvbGRlcihvdXRkaXIpO1xuICBjb25zdCBhc3NlbWJsaWVzID0gZ2V0QXNzZW1ibGllcyhyb290LCBhc3NlbWJseSk7XG4gIGNvbnN0IHRlbXBsYXRlUGF0aHNCeVBsdWdpbjogTWFwPElQb2xpY3lWYWxpZGF0aW9uUGx1Z2luQmV0YTEsIHN0cmluZ1tdPiA9IG5ldyBNYXAoKTtcbiAgdmlzaXRBc3NlbWJsaWVzKHJvb3QsICdwb3N0JywgY29uc3RydWN0ID0+IHtcbiAgICBpZiAoU3RhZ2UuaXNTdGFnZShjb25zdHJ1Y3QpKSB7XG4gICAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiBjb25zdHJ1Y3QucG9saWN5VmFsaWRhdGlvbkJldGExKSB7XG4gICAgICAgIGlmICghdGVtcGxhdGVQYXRoc0J5UGx1Z2luLmhhcyhwbHVnaW4pKSB7XG4gICAgICAgICAgdGVtcGxhdGVQYXRoc0J5UGx1Z2luLnNldChwbHVnaW4sIFtdKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXNzZW1ibHlUb1VzZSA9IGFzc2VtYmxpZXMuZ2V0KGNvbnN0cnVjdC5hcnRpZmFjdElkKTtcbiAgICAgICAgaWYgKCFhc3NlbWJseVRvVXNlKSB0aHJvdyBuZXcgRXJyb3IoYFZhbGlkYXRpb24gZmFpbGVkLCBjYW5ub3QgZmluZCBjbG91ZCBhc3NlbWJseSBmb3Igc3RhZ2UgJHtjb25zdHJ1Y3Quc3RhZ2VOYW1lfWApO1xuICAgICAgICB0ZW1wbGF0ZVBhdGhzQnlQbHVnaW4uZ2V0KHBsdWdpbikhLnB1c2goLi4uYXNzZW1ibHlUb1VzZS5zdGFja3NSZWN1cnNpdmVseS5tYXAoc3RhY2sgPT4gc3RhY2sudGVtcGxhdGVGdWxsUGF0aCkpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgcmVwb3J0czogTmFtZWRWYWxpZGF0aW9uUGx1Z2luUmVwb3J0W10gPSBbXTtcbiAgaWYgKHRlbXBsYXRlUGF0aHNCeVBsdWdpbi5zaXplID4gMCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2coJ1BlcmZvcm1pbmcgUG9saWN5IFZhbGlkYXRpb25zXFxuJyk7XG4gIH1cbiAgZm9yIChjb25zdCBbcGx1Z2luLCBwYXRoc10gb2YgdGVtcGxhdGVQYXRoc0J5UGx1Z2luLmVudHJpZXMoKSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXBvcnQgPSBwbHVnaW4udmFsaWRhdGUoeyB0ZW1wbGF0ZVBhdGhzOiBwYXRocyB9KTtcbiAgICAgIHJlcG9ydHMucHVzaCh7IC4uLnJlcG9ydCwgcGx1Z2luTmFtZTogcGx1Z2luLm5hbWUgfSk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICByZXBvcnRzLnB1c2goe1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgcGx1Z2luTmFtZTogcGx1Z2luLm5hbWUsXG4gICAgICAgIHBsdWdpblZlcnNpb246IHBsdWdpbi52ZXJzaW9uLFxuICAgICAgICB2aW9sYXRpb25zOiBbXSxcbiAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICBlcnJvcjogYFZhbGlkYXRpb24gcGx1Z2luICcke3BsdWdpbi5uYW1lfScgZmFpbGVkOiAke2UubWVzc2FnZX1gLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChjb21wdXRlQ2hlY2tzdW1PZkZvbGRlcihvdXRkaXIpICE9PSBoYXNoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYElsbGVnYWwgb3BlcmF0aW9uOiB2YWxpZGF0aW9uIHBsdWdpbiAnJHtwbHVnaW4ubmFtZX0nIG1vZGlmaWVkIHRoZSBjbG91ZCBhc3NlbWJseWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChyZXBvcnRzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCB0cmVlID0gbmV3IENvbnN0cnVjdFRyZWUocm9vdCk7XG4gICAgY29uc3QgZm9ybWF0dGVyID0gbmV3IFBvbGljeVZhbGlkYXRpb25SZXBvcnRGb3JtYXR0ZXIodHJlZSk7XG4gICAgY29uc3QgZm9ybWF0SnNvbiA9IHJvb3Qubm9kZS50cnlHZXRDb250ZXh0KFZBTElEQVRJT05fUkVQT1JUX0pTT05fQ09OVEVYVCkgPz8gZmFsc2U7XG4gICAgY29uc3Qgb3V0cHV0ID0gZm9ybWF0SnNvblxuICAgICAgPyBmb3JtYXR0ZXIuZm9ybWF0SnNvbihyZXBvcnRzKVxuICAgICAgOiBmb3JtYXR0ZXIuZm9ybWF0UHJldHR5UHJpbnRlZChyZXBvcnRzKTtcblxuICAgIGlmIChmb3JtYXRKc29uKSB7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksIFBPTElDWV9WQUxJREFUSU9OX0ZJTEVfUEFUSCksIEpTT04uc3RyaW5naWZ5KG91dHB1dCwgdW5kZWZpbmVkLCAyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmVycm9yKG91dHB1dCk7XG4gICAgfVxuICAgIGNvbnN0IGZhaWxlZCA9IHJlcG9ydHMuc29tZShyID0+ICFyLnN1Y2Nlc3MpO1xuICAgIGlmIChmYWlsZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVmFsaWRhdGlvbiBmYWlsZWQuIFNlZSB0aGUgdmFsaWRhdGlvbiByZXBvcnQgYWJvdmUgZm9yIGRldGFpbHMnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUubG9nKCdQb2xpY3kgVmFsaWRhdGlvbiBTdWNjZXNzZnVsIScpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjb21wdXRlQ2hlY2tzdW1PZkZvbGRlcihmb2xkZXI6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGhhc2ggPSBjcmVhdGVIYXNoKCdzaGEyNTYnKTtcbiAgY29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhmb2xkZXIsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcblxuICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihmb2xkZXIsIGZpbGUubmFtZSk7XG4gICAgaWYgKGZpbGUuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgaGFzaC51cGRhdGUoY29tcHV0ZUNoZWNrc3VtT2ZGb2xkZXIoZnVsbFBhdGgpKTtcbiAgICB9IGVsc2UgaWYgKGZpbGUuaXNGaWxlKCkpIHtcbiAgICAgIGhhc2gudXBkYXRlKGZzLnJlYWRGaWxlU3luYyhmdWxsUGF0aCkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaGFzaC5kaWdlc3QoKS50b1N0cmluZygnaGV4Jyk7XG59XG5cbmNvbnN0IENVU1RPTV9TWU5USEVTSVNfU1lNID0gU3ltYm9sLmZvcignQGF3cy1jZGsvY29yZTpjdXN0b21TeW50aGVzaXMnKTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGNvbnN0cnVjdHMgdGhhdCB3YW50IHRvIGRvIHNvbWV0aGluZyBjdXN0b20gZHVyaW5nIHN5bnRoZXNpc1xuICpcbiAqIFRoaXMgZmVhdHVyZSBpcyBpbnRlbmRlZCBmb3IgdXNlIGJ5IG9mZmljaWFsIEFXUyBDREsgbGlicmFyaWVzIG9ubHk7IDNyZCBwYXJ0eVxuICogbGlicmFyeSBhdXRob3JzIGFuZCBDREsgdXNlcnMgc2hvdWxkIG5vdCB1c2UgdGhpcyBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQ3VzdG9tU3ludGhlc2lzIHtcbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjb25zdHJ1Y3QgaXMgc3ludGhlc2l6ZWRcbiAgICovXG4gIG9uU3ludGhlc2l6ZShzZXNzaW9uOiBJU3ludGhlc2lzU2Vzc2lvbik6IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRDdXN0b21TeW50aGVzaXMoY29uc3RydWN0OiBJQ29uc3RydWN0LCBzeW50aGVzaXM6IElDdXN0b21TeW50aGVzaXMpOiB2b2lkIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdCwgQ1VTVE9NX1NZTlRIRVNJU19TWU0sIHtcbiAgICB2YWx1ZTogc3ludGhlc2lzLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q3VzdG9tU3ludGhlc2lzKGNvbnN0cnVjdDogSUNvbnN0cnVjdCk6IElDdXN0b21TeW50aGVzaXMgfCB1bmRlZmluZWQge1xuICByZXR1cm4gKGNvbnN0cnVjdCBhcyBhbnkpW0NVU1RPTV9TWU5USEVTSVNfU1lNXTtcbn1cblxuLyoqXG4gKiBGaW5kIEFzc2VtYmxpZXMgaW5zaWRlIHRoZSBjb25zdHJ1Y3QgYW5kIGNhbGwgJ3N5bnRoJyBvbiB0aGVtXG4gKlxuICogKFRoZXkgd2lsbCBpbiB0dXJuIHJlY3Vyc2UgYWdhaW4pXG4gKi9cbmZ1bmN0aW9uIHN5bnRoTmVzdGVkQXNzZW1ibGllcyhyb290OiBJQ29uc3RydWN0LCBvcHRpb25zOiBTdGFnZVN5bnRoZXNpc09wdGlvbnMpIHtcbiAgZm9yIChjb25zdCBjaGlsZCBvZiByb290Lm5vZGUuY2hpbGRyZW4pIHtcbiAgICBpZiAoU3RhZ2UuaXNTdGFnZShjaGlsZCkpIHtcbiAgICAgIGNoaWxkLnN5bnRoKG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzeW50aE5lc3RlZEFzc2VtYmxpZXMoY2hpbGQsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEludm9rZSBhc3BlY3RzIG9uIHRoZSBnaXZlbiBjb25zdHJ1Y3QgdHJlZS5cbiAqXG4gKiBBc3BlY3RzIGFyZSBub3QgcHJvcGFnYXRlZCBhY3Jvc3MgQXNzZW1ibHkgYm91bmRhcmllcy4gVGhlIHNhbWUgQXNwZWN0IHdpbGwgbm90IGJlIGludm9rZWRcbiAqIHR3aWNlIGZvciB0aGUgc2FtZSBjb25zdHJ1Y3QuXG4gKi9cbmZ1bmN0aW9uIGludm9rZUFzcGVjdHMocm9vdDogSUNvbnN0cnVjdCkge1xuICBjb25zdCBpbnZva2VkQnlQYXRoOiB7IFtub2RlUGF0aDogc3RyaW5nXTogSUFzcGVjdFtdIH0gPSB7IH07XG5cbiAgbGV0IG5lc3RlZEFzcGVjdFdhcm5pbmcgPSBmYWxzZTtcbiAgcmVjdXJzZShyb290LCBbXSk7XG5cbiAgZnVuY3Rpb24gcmVjdXJzZShjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QsIGluaGVyaXRlZEFzcGVjdHM6IElBc3BlY3RbXSkge1xuICAgIGNvbnN0IG5vZGUgPSBjb25zdHJ1Y3Qubm9kZTtcbiAgICBjb25zdCBhc3BlY3RzID0gQXNwZWN0cy5vZihjb25zdHJ1Y3QpO1xuICAgIGNvbnN0IGFsbEFzcGVjdHNIZXJlID0gWy4uLmluaGVyaXRlZEFzcGVjdHMgPz8gW10sIC4uLmFzcGVjdHMuYWxsXTtcbiAgICBjb25zdCBub2RlQXNwZWN0c0NvdW50ID0gYXNwZWN0cy5hbGwubGVuZ3RoO1xuICAgIGZvciAoY29uc3QgYXNwZWN0IG9mIGFsbEFzcGVjdHNIZXJlKSB7XG4gICAgICBsZXQgaW52b2tlZCA9IGludm9rZWRCeVBhdGhbbm9kZS5wYXRoXTtcbiAgICAgIGlmICghaW52b2tlZCkge1xuICAgICAgICBpbnZva2VkID0gaW52b2tlZEJ5UGF0aFtub2RlLnBhdGhdID0gW107XG4gICAgICB9XG5cbiAgICAgIGlmIChpbnZva2VkLmluY2x1ZGVzKGFzcGVjdCkpIHsgY29udGludWU7IH1cblxuICAgICAgYXNwZWN0LnZpc2l0KGNvbnN0cnVjdCk7XG5cbiAgICAgIC8vIGlmIGFuIGFzcGVjdCB3YXMgYWRkZWQgdG8gdGhlIG5vZGUgd2hpbGUgaW52b2tpbmcgYW5vdGhlciBhc3BlY3QgaXQgd2lsbCBub3QgYmUgaW52b2tlZCwgZW1pdCBhIHdhcm5pbmdcbiAgICAgIC8vIHRoZSBgbmVzdGVkQXNwZWN0V2FybmluZ2AgZmxhZyBpcyB1c2VkIHRvIHByZXZlbnQgdGhlIHdhcm5pbmcgZnJvbSBiZWluZyBlbWl0dGVkIGZvciBldmVyeSBjaGlsZFxuICAgICAgaWYgKCFuZXN0ZWRBc3BlY3RXYXJuaW5nICYmIG5vZGVBc3BlY3RzQ291bnQgIT09IGFzcGVjdHMuYWxsLmxlbmd0aCkge1xuICAgICAgICBBbm5vdGF0aW9ucy5vZihjb25zdHJ1Y3QpLmFkZFdhcm5pbmcoJ1dlIGRldGVjdGVkIGFuIEFzcGVjdCB3YXMgYWRkZWQgdmlhIGFub3RoZXIgQXNwZWN0LCBhbmQgd2lsbCBub3QgYmUgYXBwbGllZCcpO1xuICAgICAgICBuZXN0ZWRBc3BlY3RXYXJuaW5nID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gbWFyayBhcyBpbnZva2VkIGZvciB0aGlzIG5vZGVcbiAgICAgIGludm9rZWQucHVzaChhc3BlY3QpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY29uc3RydWN0Lm5vZGUuY2hpbGRyZW4pIHtcbiAgICAgIGlmICghU3RhZ2UuaXNTdGFnZShjaGlsZCkpIHtcbiAgICAgICAgcmVjdXJzZShjaGlsZCwgYWxsQXNwZWN0c0hlcmUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEZpbmQgYWxsIHN0YWNrcyBhbmQgYWRkIE1ldGFkYXRhIFJlc291cmNlcyB0byBhbGwgb2YgdGhlbVxuICpcbiAqIFRoZXJlIGlzIG5vIGdvb2QgZ2VuZXJpYyBwbGFjZSB0byBkbyB0aGlzLiBDYW4ndCBkbyBpdCBpbiB0aGUgY29uc3RydWN0b3JcbiAqIChiZWNhdXNlIGFkZGluZyBhIGNoaWxkIGNvbnN0cnVjdCBtYWtlcyBpdCBpbXBvc3NpYmxlIHRvIHNldCBjb250ZXh0IG9uIHRoZVxuICogbm9kZSksIGFuZCB0aGUgZ2VuZXJpYyBwcmVwYXJlIHBoYXNlIGlzIGRlcHJlY2F0ZWQuXG4gKlxuICogT25seSBkbyB0aGlzIG9uIFtwYXJlbnRdIHN0YWNrcyAobm90IG5lc3RlZCBzdGFja3MpLCBkb24ndCBkbyB0aGlzIHdoZW5cbiAqIGRpc2FibGVkIGJ5IHRoZSB1c2VyLlxuICpcbiAqIEFsc28sIG9ubHkgd2hlbiBydW5uaW5nIHZpYSB0aGUgQ0xJLiBJZiB3ZSBkbyBpdCB1bmNvbmRpdGlvbmFsbHksXG4gKiBhbGwgdW5pdCB0ZXN0cyBldmVyeXdoZXJlIGFyZSBnb2luZyB0byBicmVhayBtYXNzaXZlbHkuIEkndmUgc3BlbnQgYSBkYXlcbiAqIGZpeGluZyBvdXIgb3duLCBidXQgZG93bnN0cmVhbSB1c2VycyB3b3VsZCBiZSBhZmZlY3RlZCBqdXN0IGFzIGJhZGx5LlxuICpcbiAqIFN0b3AgYXQgQXNzZW1ibHkgYm91bmRhcmllcy5cbiAqL1xuZnVuY3Rpb24gaW5qZWN0TWV0YWRhdGFSZXNvdXJjZXMocm9vdDogSUNvbnN0cnVjdCkge1xuICB2aXNpdChyb290LCAncG9zdCcsIGNvbnN0cnVjdCA9PiB7XG4gICAgaWYgKCFTdGFjay5pc1N0YWNrKGNvbnN0cnVjdCkgfHwgIWNvbnN0cnVjdC5fdmVyc2lvblJlcG9ydGluZ0VuYWJsZWQpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBCZWNhdXNlIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9ibG9iL21haW4vcGFja2FnZXMvYXNzZXJ0LWludGVybmFsL2xpYi9zeW50aC11dGlscy50cyNMNzRcbiAgICAvLyBzeW50aGVzaXplKCkgbWF5IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSBvbiBhIHN0YWNrIGluIHVuaXQgdGVzdHMsIGFuZCB0aGUgYmVsb3cgd291bGQgYnJlYWtcbiAgICAvLyBpZiB3ZSBleGVjdXRlIGl0IGEgc2Vjb25kIHRpbWUuIEd1YXJkIGFnYWluc3QgdGhlIGNvbnN0cnVjdHMgYWxyZWFkeSBleGlzdGluZy5cbiAgICBjb25zdCBDREtNZXRhZGF0YSA9ICdDREtNZXRhZGF0YSc7XG4gICAgaWYgKGNvbnN0cnVjdC5ub2RlLnRyeUZpbmRDaGlsZChDREtNZXRhZGF0YSkpIHsgcmV0dXJuOyB9XG5cbiAgICBuZXcgTWV0YWRhdGFSZXNvdXJjZShjb25zdHJ1Y3QsIENES01ldGFkYXRhKTtcbiAgfSk7XG59XG5cbi8qKlxuICogRmluZCB0aGUgcm9vdCBBcHAgYW5kIGFkZCB0aGUgVHJlZU1ldGFkYXRhIHJlc291cmNlIChpZiBlbmFibGVkKS5cbiAqXG4gKiBUaGVyZSBpcyBubyBnb29kIGdlbmVyaWMgcGxhY2UgdG8gZG8gdGhpcy4gQ2FuJ3QgZG8gaXQgaW4gdGhlIGNvbnN0cnVjdG9yXG4gKiAoYmVjYXVzZSBhZGRpbmcgYSBjaGlsZCBjb25zdHJ1Y3QgbWFrZXMgaXQgaW1wb3NzaWJsZSB0byBzZXQgY29udGV4dCBvbiB0aGVcbiAqIG5vZGUpLCBhbmQgdGhlIGdlbmVyaWMgcHJlcGFyZSBwaGFzZSBpcyBkZXByZWNhdGVkLlxuICovXG5mdW5jdGlvbiBpbmplY3RUcmVlTWV0YWRhdGEocm9vdDogSUNvbnN0cnVjdCkge1xuICB2aXNpdChyb290LCAncG9zdCcsIGNvbnN0cnVjdCA9PiB7XG4gICAgaWYgKCFBcHAuaXNBcHAoY29uc3RydWN0KSB8fCAhY29uc3RydWN0Ll90cmVlTWV0YWRhdGEpIHJldHVybjtcbiAgICBjb25zdCBDREtUcmVlTWV0YWRhdGEgPSAnVHJlZSc7XG4gICAgaWYgKGNvbnN0cnVjdC5ub2RlLnRyeUZpbmRDaGlsZChDREtUcmVlTWV0YWRhdGEpKSByZXR1cm47XG4gICAgbmV3IFRyZWVNZXRhZGF0YShjb25zdHJ1Y3QpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBTeW50aGVzaXplIGNoaWxkcmVuIGluIHBvc3Qtb3JkZXIgaW50byB0aGUgZ2l2ZW4gYnVpbGRlclxuICpcbiAqIFN0b3AgYXQgQXNzZW1ibHkgYm91bmRhcmllcy5cbiAqL1xuZnVuY3Rpb24gc3ludGhlc2l6ZVRyZWUocm9vdDogSUNvbnN0cnVjdCwgYnVpbGRlcjogY3hhcGkuQ2xvdWRBc3NlbWJseUJ1aWxkZXIsIHZhbGlkYXRlT25TeW50aDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gIHZpc2l0KHJvb3QsICdwb3N0JywgY29uc3RydWN0ID0+IHtcbiAgICBjb25zdCBzZXNzaW9uID0ge1xuICAgICAgb3V0ZGlyOiBidWlsZGVyLm91dGRpcixcbiAgICAgIGFzc2VtYmx5OiBidWlsZGVyLFxuICAgICAgdmFsaWRhdGVPblN5bnRoLFxuICAgIH07XG5cbiAgICBpZiAoU3RhY2suaXNTdGFjayhjb25zdHJ1Y3QpKSB7XG4gICAgICBjb25zdHJ1Y3Quc3ludGhlc2l6ZXIuc3ludGhlc2l6ZShzZXNzaW9uKTtcbiAgICB9IGVsc2UgaWYgKGNvbnN0cnVjdCBpbnN0YW5jZW9mIFRyZWVNZXRhZGF0YSkge1xuICAgICAgY29uc3RydWN0Ll9zeW50aGVzaXplVHJlZShzZXNzaW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY3VzdG9tID0gZ2V0Q3VzdG9tU3ludGhlc2lzKGNvbnN0cnVjdCk7XG4gICAgICBjdXN0b20/Lm9uU3ludGhlc2l6ZShzZXNzaW9uKTtcbiAgICB9XG4gIH0pO1xufVxuXG5pbnRlcmZhY2UgVmFsaWRhdGlvbkVycm9yIHtcbiAgcmVhZG9ubHkgbWVzc2FnZTogc3RyaW5nO1xuICByZWFkb25seSBzb3VyY2U6IElDb25zdHJ1Y3Q7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgYWxsIGNvbnN0cnVjdHMgaW4gdGhlIGdpdmVuIGNvbnN0cnVjdCB0cmVlXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlVHJlZShyb290OiBJQ29uc3RydWN0KSB7XG4gIGNvbnN0IGVycm9ycyA9IG5ldyBBcnJheTxWYWxpZGF0aW9uRXJyb3I+KCk7XG5cbiAgdmlzaXQocm9vdCwgJ3ByZScsIGNvbnN0cnVjdCA9PiB7XG4gICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIGNvbnN0cnVjdC5ub2RlLnZhbGlkYXRlKCkpIHtcbiAgICAgIGVycm9ycy5wdXNoKHsgbWVzc2FnZSwgc291cmNlOiBjb25zdHJ1Y3QgfSk7XG4gICAgfVxuICB9KTtcblxuICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBlcnJvckxpc3QgPSBlcnJvcnMubWFwKGUgPT4gYFske2Uuc291cmNlLm5vZGUucGF0aH1dICR7ZS5tZXNzYWdlfWApLmpvaW4oJ1xcbiAgJyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBWYWxpZGF0aW9uIGZhaWxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgZXJyb3JzOlxcbiAgJHtlcnJvckxpc3R9YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBWaXNpdCB0aGUgZ2l2ZW4gY29uc3RydWN0IHRyZWUgaW4gZWl0aGVyIHByZSBvciBwb3N0IG9yZGVyLCBvbmx5IGxvb2tpbmcgYXQgQXNzZW1ibGllc1xuICovXG5mdW5jdGlvbiB2aXNpdEFzc2VtYmxpZXMocm9vdDogSUNvbnN0cnVjdCwgb3JkZXI6ICdwcmUnIHwgJ3Bvc3QnLCBjYjogKHg6IElDb25zdHJ1Y3QpID0+IHZvaWQpIHtcbiAgaWYgKG9yZGVyID09PSAncHJlJykge1xuICAgIGNiKHJvb3QpO1xuICB9XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiByb290Lm5vZGUuY2hpbGRyZW4pIHtcbiAgICBpZiAoIVN0YWdlLmlzU3RhZ2UoY2hpbGQpKSB7IGNvbnRpbnVlOyB9XG4gICAgdmlzaXRBc3NlbWJsaWVzKGNoaWxkLCBvcmRlciwgY2IpO1xuICB9XG5cbiAgaWYgKG9yZGVyID09PSAncG9zdCcpIHtcbiAgICBjYihyb290KTtcbiAgfVxufVxuXG4vKipcbiAqIFZpc2l0IHRoZSBnaXZlbiBjb25zdHJ1Y3QgdHJlZSBpbiBlaXRoZXIgcHJlIG9yIHBvc3Qgb3JkZXIsIHN0b3BwaW5nIGF0IEFzc2VtYmxpZXNcbiAqL1xuZnVuY3Rpb24gdmlzaXQocm9vdDogSUNvbnN0cnVjdCwgb3JkZXI6ICdwcmUnIHwgJ3Bvc3QnLCBjYjogKHg6IElDb25zdHJ1Y3QpID0+IHZvaWQpIHtcbiAgaWYgKG9yZGVyID09PSAncHJlJykge1xuICAgIGNiKHJvb3QpO1xuICB9XG5cbiAgZm9yIChjb25zdCBjaGlsZCBvZiByb290Lm5vZGUuY2hpbGRyZW4pIHtcbiAgICBpZiAoU3RhZ2UuaXNTdGFnZShjaGlsZCkpIHsgY29udGludWU7IH1cbiAgICB2aXNpdChjaGlsZCwgb3JkZXIsIGNiKTtcbiAgfVxuXG4gIGlmIChvcmRlciA9PT0gJ3Bvc3QnKSB7XG4gICAgY2Iocm9vdCk7XG4gIH1cbn1cbiJdfQ==