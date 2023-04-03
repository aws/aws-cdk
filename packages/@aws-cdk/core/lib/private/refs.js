"use strict";
// ----------------------------------------------------
// CROSS REFERENCES
// ----------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceNestedStackValueInParent = exports.getExportable = exports.resolveReferences = void 0;
const cxapi = require("@aws-cdk/cx-api");
const cfn_reference_1 = require("./cfn-reference");
const resolve_1 = require("./resolve");
const uniqueid_1 = require("./uniqueid");
const cfn_element_1 = require("../cfn-element");
const cfn_output_1 = require("../cfn-output");
const cfn_parameter_1 = require("../cfn-parameter");
const export_writer_provider_1 = require("../custom-resource-provider/cross-region-export-providers/export-writer-provider");
const names_1 = require("../names");
const stack_1 = require("../stack");
const token_1 = require("../token");
const type_hints_1 = require("../type-hints");
/**
 * This is called from the App level to resolve all references defined. Each
 * reference is resolved based on it's consumption context.
 */
function resolveReferences(scope) {
    const edges = findAllReferences(scope);
    for (const { source, value } of edges) {
        const consumer = stack_1.Stack.of(source);
        // resolve the value in the context of the consumer
        if (!value.hasValueForStack(consumer)) {
            const resolved = resolveValue(consumer, value);
            value.assignValueForStack(consumer, resolved);
        }
    }
}
exports.resolveReferences = resolveReferences;
/**
 * Resolves the value for `reference` in the context of `consumer`.
 */
function resolveValue(consumer, reference) {
    const producer = stack_1.Stack.of(reference.target);
    const producerAccount = !token_1.Token.isUnresolved(producer.account) ? producer.account : cxapi.UNKNOWN_ACCOUNT;
    const producerRegion = !token_1.Token.isUnresolved(producer.region) ? producer.region : cxapi.UNKNOWN_REGION;
    const consumerAccount = !token_1.Token.isUnresolved(consumer.account) ? consumer.account : cxapi.UNKNOWN_ACCOUNT;
    const consumerRegion = !token_1.Token.isUnresolved(consumer.region) ? consumer.region : cxapi.UNKNOWN_REGION;
    // produce and consumer stacks are the same, we can just return the value itself.
    if (producer === consumer) {
        return reference;
    }
    // unsupported: stacks from different apps
    if (producer.node.root !== consumer.node.root) {
        throw new Error('Cannot reference across apps. Consuming and producing stacks must be defined within the same CDK app.');
    }
    // unsupported: stacks are not in the same account
    if (producerAccount !== consumerAccount) {
        throw new Error(`Stack "${consumer.node.path}" cannot reference ${renderReference(reference)} in stack "${producer.node.path}". ` +
            'Cross stack references are only supported for stacks deployed to the same account or between nested stacks and their parent stack');
    }
    // Stacks are in the same account, but different regions
    if (producerRegion !== consumerRegion && !consumer._crossRegionReferences) {
        throw new Error(`Stack "${consumer.node.path}" cannot reference ${renderReference(reference)} in stack "${producer.node.path}". ` +
            'Cross stack references are only supported for stacks deployed to the same environment or between nested stacks and their parent stack. ' +
            'Set crossRegionReferences=true to enable cross region references');
    }
    // ----------------------------------------------------------------------
    // consumer is nested in the producer (directly or indirectly)
    // ----------------------------------------------------------------------
    // if the consumer is nested within the producer (directly or indirectly),
    // wire through a CloudFormation parameter and then resolve the reference with
    // the parent stack as the consumer.
    if (consumer.nestedStackParent && isNested(consumer, producer)) {
        const parameterValue = resolveValue(consumer.nestedStackParent, reference);
        return createNestedStackParameter(consumer, reference, parameterValue);
    }
    // ----------------------------------------------------------------------
    // producer is a nested stack
    // ----------------------------------------------------------------------
    // if the producer is nested, always publish the value through a
    // cloudformation output and resolve recursively with the Fn::GetAtt
    // of the output in the parent stack.
    // one might ask, if the consumer is not a parent of the producer,
    // why not just use export/import? the reason is that we cannot
    // generate an "export name" from a nested stack because the export
    // name must contain the stack name to ensure uniqueness, and we
    // don't know the stack name of a nested stack before we deploy it.
    // therefore, we can only export from a top-level stack.
    if (producer.nested) {
        const outputValue = createNestedStackOutput(producer, reference);
        return resolveValue(consumer, outputValue);
    }
    // ----------------------------------------------------------------------
    // export/import
    // ----------------------------------------------------------------------
    // Stacks are in the same account, but different regions
    if (producerRegion !== consumerRegion && consumer._crossRegionReferences) {
        if (producerRegion === cxapi.UNKNOWN_REGION || consumerRegion === cxapi.UNKNOWN_REGION) {
            throw new Error(`Stack "${consumer.node.path}" cannot reference ${renderReference(reference)} in stack "${producer.node.path}". ` +
                'Cross stack/region references are only supported for stacks with an explicit region defined. ');
        }
        consumer.addDependency(producer, `${consumer.node.path} -> ${reference.target.node.path}.${reference.displayName}`);
        return createCrossRegionImportValue(reference, consumer);
    }
    // export the value through a cloudformation "export name" and use an
    // Fn::ImportValue in the consumption site.
    // add a dependency between the producer and the consumer. dependency logic
    // will take care of applying the dependency at the right level (e.g. the
    // top-level stacks).
    consumer.addDependency(producer, `${consumer.node.path} -> ${reference.target.node.path}.${reference.displayName}`);
    return createImportValue(reference);
}
/**
 * Return a human readable version of this reference
 */
function renderReference(ref) {
    return `{${ref.target.node.path}[${ref.displayName}]}`;
}
/**
 * Finds all the CloudFormation references in a construct tree.
 */
function findAllReferences(root) {
    const result = new Array();
    for (const consumer of root.node.findAll()) {
        // include only CfnElements (i.e. resources)
        if (!cfn_element_1.CfnElement.isCfnElement(consumer)) {
            continue;
        }
        try {
            const tokens = resolve_1.findTokens(consumer, () => consumer._toCloudFormation());
            // iterate over all the tokens (e.g. intrinsic functions, lazies, etc) that
            // were found in the cloudformation representation of this resource.
            for (const token of tokens) {
                // include only CfnReferences (i.e. "Ref" and "Fn::GetAtt")
                if (!cfn_reference_1.CfnReference.isCfnReference(token)) {
                    continue;
                }
                result.push({
                    source: consumer,
                    value: token,
                });
            }
        }
        catch (e) {
            // Note: it might be that the properties of the CFN object aren't valid.
            // This will usually be preventatively caught in a construct's validate()
            // and turned into a nicely descriptive error, but we're running prepare()
            // before validate(). Swallow errors that occur because the CFN layer
            // doesn't validate completely.
            //
            // This does make the assumption that the error will not be rectified,
            // but the error will be thrown later on anyway. If the error doesn't
            // get thrown down the line, we may miss references.
            if (e.type === 'CfnSynthesisError') {
                continue;
            }
            throw e;
        }
    }
    return result;
}
// ------------------------------------------------------------------------------------------------
// export/import
// ------------------------------------------------------------------------------------------------
/**
 * Imports a value from another stack by creating an "Output" with an "ExportName"
 * and returning an "Fn::ImportValue" token.
 */
function createImportValue(reference) {
    const exportingStack = stack_1.Stack.of(reference.target);
    let importExpr;
    if (reference.typeHint === type_hints_1.ResolutionTypeHint.STRING_LIST) {
        importExpr = exportingStack.exportStringListValue(reference);
        // I happen to know this returns a Fn.split() which implements Intrinsic.
        return token_1.Tokenization.reverseList(importExpr);
    }
    importExpr = exportingStack.exportValue(reference);
    // I happen to know this returns a Fn.importValue() which implements Intrinsic.
    return token_1.Tokenization.reverseCompleteString(importExpr);
}
/**
 * Imports a value from another stack in a different region by creating an "Output" with an "ExportName"
 * in the producing stack, and a "ExportsReader" custom resource in the consumer stack
 *
 * Returns a reference to the ExportsReader attribute which contains the exported value
 */
function createCrossRegionImportValue(reference, importStack) {
    const referenceStack = stack_1.Stack.of(reference.target);
    const exportingStack = referenceStack.nestedStackParent ?? referenceStack;
    // generate an export name
    const exportable = getExportable(exportingStack, reference);
    const id = JSON.stringify(exportingStack.resolve(exportable));
    const exportName = generateExportName(importStack, reference, id);
    if (token_1.Token.isUnresolved(exportName)) {
        throw new Error(`unresolved token in generated export name: ${JSON.stringify(exportingStack.resolve(exportName))}`);
    }
    // get or create the export writer
    const writerConstructName = uniqueid_1.makeUniqueId(['ExportsWriter', importStack.region]);
    const exportReader = export_writer_provider_1.ExportWriter.getOrCreate(exportingStack, writerConstructName, {
        region: importStack.region,
    });
    const exported = exportReader.exportValue(exportName, reference, importStack);
    if (importStack.nestedStackParent) {
        return createNestedStackParameter(importStack, exported, exported);
    }
    return exported;
}
/**
 * Generate a unique physical name for the export
 */
function generateExportName(importStack, reference, id) {
    const referenceStack = stack_1.Stack.of(reference.target);
    const components = [
        referenceStack.stackName ?? '',
        referenceStack.region,
        id,
    ];
    const prefix = `${importStack.nestedStackParent?.stackName ?? importStack.stackName}/`;
    const localPart = uniqueid_1.makeUniqueId(components);
    // max name length for a system manager parameter is 1011 characters
    // including the arn, i.e.
    // arn:aws:ssm:us-east-2:111122223333:parameter/cdk/exports/${stackName}/${name}
    const maxLength = 900;
    return prefix + localPart.slice(Math.max(0, localPart.length - maxLength + prefix.length));
}
function getExportable(stack, reference) {
    // could potentially be changed by a call to overrideLogicalId. This would cause our Export/Import
    // to have an incorrect id. For a better user experience, lock the logicalId and throw an error
    // if the user tries to override the id _after_ calling exportValue
    if (cfn_element_1.CfnElement.isCfnElement(reference.target)) {
        reference.target._lockLogicalId();
    }
    // "teleport" the value here, in case it comes from a nested stack. This will also
    // ensure the value is from our own scope.
    return referenceNestedStackValueInParent(reference, stack);
}
exports.getExportable = getExportable;
// ------------------------------------------------------------------------------------------------
// nested stacks
// ------------------------------------------------------------------------------------------------
/**
 * Adds a CloudFormation parameter to a nested stack and assigns it with the
 * value of the reference.
 */
function createNestedStackParameter(nested, reference, value) {
    const paramId = generateUniqueId(nested, reference, 'reference-to-');
    let param = nested.node.tryFindChild(paramId);
    if (!param) {
        param = new cfn_parameter_1.CfnParameter(nested, paramId, { type: 'String' });
        // Ugly little hack until we move NestedStack to this module.
        if (!('setParameter' in nested)) {
            throw new Error('assertion failed: nested stack should have a "setParameter" method');
        }
        nested.setParameter(param.logicalId, token_1.Token.asString(value));
    }
    return param.value;
}
/**
 * Adds a CloudFormation output to a nested stack and returns an "Fn::GetAtt"
 * intrinsic that can be used to reference this output in the parent stack.
 */
function createNestedStackOutput(producer, reference) {
    const outputId = generateUniqueId(producer, reference);
    let output = producer.node.tryFindChild(outputId);
    if (!output) {
        output = new cfn_output_1.CfnOutput(producer, outputId, { value: token_1.Token.asString(reference) });
    }
    if (!producer.nestedStackResource) {
        throw new Error('assertion failed');
    }
    return producer.nestedStackResource.getAtt(`Outputs.${output.logicalId}`);
}
/**
 * Translate a Reference into a nested stack into a value in the parent stack
 *
 * Will create Outputs along the chain of Nested Stacks, and return the final `{ Fn::GetAtt }`.
 */
function referenceNestedStackValueInParent(reference, targetStack) {
    let currentStack = stack_1.Stack.of(reference.target);
    if (currentStack !== targetStack && !isNested(currentStack, targetStack)) {
        throw new Error(`Referenced resource must be in stack '${targetStack.node.path}', got '${reference.target.node.path}'`);
    }
    while (currentStack !== targetStack) {
        reference = createNestedStackOutput(stack_1.Stack.of(reference.target), reference);
        currentStack = stack_1.Stack.of(reference.target);
    }
    return reference;
}
exports.referenceNestedStackValueInParent = referenceNestedStackValueInParent;
/**
 * @returns true if this stack is a direct or indirect parent of the nested
 * stack `nested`.
 *
 * If `child` is not a nested stack, always returns `false` because it can't
 * have a parent, dah.
 */
function isNested(nested, parent) {
    // if the parent is a direct parent
    if (nested.nestedStackParent === parent) {
        return true;
    }
    // we reached a top-level (non-nested) stack without finding the parent
    if (!nested.nestedStackParent) {
        return false;
    }
    // recurse with the child's direct parent
    return isNested(nested.nestedStackParent, parent);
}
/**
 * Generates a unique id for a `Reference`
 * @param stack A stack used to resolve tokens
 * @param ref The reference
 * @param prefix Optional prefix for the id
 * @returns A unique id
 */
function generateUniqueId(stack, ref, prefix = '') {
    // we call "resolve()" to ensure that tokens do not creep in (for example, if the reference display name includes tokens)
    return stack.resolve(`${prefix}${names_1.Names.nodeUniqueId(ref.target.node)}${ref.displayName}`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlZnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVEQUF1RDtBQUN2RCxtQkFBbUI7QUFDbkIsdURBQXVEOzs7QUFFdkQseUNBQXlDO0FBRXpDLG1EQUErQztBQUUvQyx1Q0FBdUM7QUFDdkMseUNBQTBDO0FBQzFDLGdEQUE0QztBQUM1Qyw4Q0FBMEM7QUFDMUMsb0RBQWdEO0FBQ2hELDZIQUFnSDtBQUNoSCxvQ0FBaUM7QUFHakMsb0NBQWlDO0FBQ2pDLG9DQUErQztBQUMvQyw4Q0FBbUQ7QUFFbkQ7OztHQUdHO0FBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsS0FBaUI7SUFDakQsTUFBTSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFdkMsS0FBSyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEtBQUssRUFBRTtRQUNyQyxNQUFNLFFBQVEsR0FBRyxhQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWxDLG1EQUFtRDtRQUNuRCxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3JDLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDL0MsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUMvQztLQUNGO0FBQ0gsQ0FBQztBQVpELDhDQVlDO0FBR0Q7O0dBRUc7QUFDSCxTQUFTLFlBQVksQ0FBQyxRQUFlLEVBQUUsU0FBdUI7SUFDNUQsTUFBTSxRQUFRLEdBQUcsYUFBSyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxhQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFD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O0FBWkQsOEVBWUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFTLFFBQVEsQ0FBQyxNQUFhLEVBQUUsTUFBYTtJQUM1QyxtQ0FBbUM7SUFDbkMsSUFBSSxNQUFNLENBQUMsaUJBQWlCLEtBQUssTUFBTSxFQUFFO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCx1RUFBdUU7SUFDdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtRQUM3QixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQseUNBQXlDO0lBQ3pDLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFZLEVBQUUsR0FBYyxFQUFFLE1BQU0sR0FBRyxFQUFFO0lBQ2pFLHlIQUF5SDtJQUN6SCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxNQUFNLEdBQUcsYUFBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQzVGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBDUk9TUyBSRUZFUkVOQ0VTXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5SZWZlcmVuY2UgfSBmcm9tICcuL2Nmbi1yZWZlcmVuY2UnO1xuaW1wb3J0IHsgSW50cmluc2ljIH0gZnJvbSAnLi9pbnRyaW5zaWMnO1xuaW1wb3J0IHsgZmluZFRva2VucyB9IGZyb20gJy4vcmVzb2x2ZSc7XG5pbXBvcnQgeyBtYWtlVW5pcXVlSWQgfSBmcm9tICcuL3VuaXF1ZWlkJztcbmltcG9ydCB7IENmbkVsZW1lbnQgfSBmcm9tICcuLi9jZm4tZWxlbWVudCc7XG5pbXBvcnQgeyBDZm5PdXRwdXQgfSBmcm9tICcuLi9jZm4tb3V0cHV0JztcbmltcG9ydCB7IENmblBhcmFtZXRlciB9IGZyb20gJy4uL2Nmbi1wYXJhbWV0ZXInO1xuaW1wb3J0IHsgRXhwb3J0V3JpdGVyIH0gZnJvbSAnLi4vY3VzdG9tLXJlc291cmNlLXByb3ZpZGVyL2Nyb3NzLXJlZ2lvbi1leHBvcnQtcHJvdmlkZXJzL2V4cG9ydC13cml0ZXItcHJvdmlkZXInO1xuaW1wb3J0IHsgTmFtZXMgfSBmcm9tICcuLi9uYW1lcyc7XG5pbXBvcnQgeyBSZWZlcmVuY2UgfSBmcm9tICcuLi9yZWZlcmVuY2UnO1xuaW1wb3J0IHsgSVJlc29sdmFibGUgfSBmcm9tICcuLi9yZXNvbHZhYmxlJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi4vc3RhY2snO1xuaW1wb3J0IHsgVG9rZW4sIFRva2VuaXphdGlvbiB9IGZyb20gJy4uL3Rva2VuJztcbmltcG9ydCB7IFJlc29sdXRpb25UeXBlSGludCB9IGZyb20gJy4uL3R5cGUtaGludHMnO1xuXG4vKipcbiAqIFRoaXMgaXMgY2FsbGVkIGZyb20gdGhlIEFwcCBsZXZlbCB0byByZXNvbHZlIGFsbCByZWZlcmVuY2VzIGRlZmluZWQuIEVhY2hcbiAqIHJlZmVyZW5jZSBpcyByZXNvbHZlZCBiYXNlZCBvbiBpdCdzIGNvbnN1bXB0aW9uIGNvbnRleHQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlUmVmZXJlbmNlcyhzY29wZTogSUNvbnN0cnVjdCk6IHZvaWQge1xuICBjb25zdCBlZGdlcyA9IGZpbmRBbGxSZWZlcmVuY2VzKHNjb3BlKTtcblxuICBmb3IgKGNvbnN0IHsgc291cmNlLCB2YWx1ZSB9IG9mIGVkZ2VzKSB7XG4gICAgY29uc3QgY29uc3VtZXIgPSBTdGFjay5vZihzb3VyY2UpO1xuXG4gICAgLy8gcmVzb2x2ZSB0aGUgdmFsdWUgaW4gdGhlIGNvbnRleHQgb2YgdGhlIGNvbnN1bWVyXG4gICAgaWYgKCF2YWx1ZS5oYXNWYWx1ZUZvclN0YWNrKGNvbnN1bWVyKSkge1xuICAgICAgY29uc3QgcmVzb2x2ZWQgPSByZXNvbHZlVmFsdWUoY29uc3VtZXIsIHZhbHVlKTtcbiAgICAgIHZhbHVlLmFzc2lnblZhbHVlRm9yU3RhY2soY29uc3VtZXIsIHJlc29sdmVkKTtcbiAgICB9XG4gIH1cbn1cblxuXG4vKipcbiAqIFJlc29sdmVzIHRoZSB2YWx1ZSBmb3IgYHJlZmVyZW5jZWAgaW4gdGhlIGNvbnRleHQgb2YgYGNvbnN1bWVyYC5cbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZVZhbHVlKGNvbnN1bWVyOiBTdGFjaywgcmVmZXJlbmNlOiBDZm5SZWZlcmVuY2UpOiBJUmVzb2x2YWJsZSB7XG4gIGNvbnN0IHByb2R1Y2VyID0gU3RhY2sub2YocmVmZXJlbmNlLnRhcmdldCk7XG4gIGNvbnN0IHByb2R1Y2VyQWNjb3VudCA9ICFUb2tlbi5pc1VucmVzb2x2ZWQocHJvZHVjZXIuYWNjb3VudCkgPyBwcm9kdWNlci5hY2NvdW50IDogY3hhcGkuVU5LTk9XTl9BQ0NPVU5UO1xuICBjb25zdCBwcm9kdWNlclJlZ2lvbiA9ICFUb2tlbi5pc1VucmVzb2x2ZWQocHJvZHVjZXIucmVnaW9uKSA/IHByb2R1Y2VyLnJlZ2lvbiA6IGN4YXBpLlVOS05PV05fUkVHSU9OO1xuICBjb25zdCBjb25zdW1lckFjY291bnQgPSAhVG9rZW4uaXNVbnJlc29sdmVkKGNvbnN1bWVyLmFjY291bnQpID8gY29uc3VtZXIuYWNjb3VudCA6IGN4YXBpLlVOS05PV05fQUNDT1VOVDtcbiAgY29uc3QgY29uc3VtZXJSZWdpb24gPSAhVG9rZW4uaXNVbnJlc29sdmVkKGNvbnN1bWVyLnJlZ2lvbikgPyBjb25zdW1lci5yZWdpb24gOiBjeGFwaS5VTktOT1dOX1JFR0lPTjtcblxuICAvLyBwcm9kdWNlIGFuZCBjb25zdW1lciBzdGFja3MgYXJlIHRoZSBzYW1lLCB3ZSBjYW4ganVzdCByZXR1cm4gdGhlIHZhbHVlIGl0c2VsZi5cbiAgaWYgKHByb2R1Y2VyID09PSBjb25zdW1lcikge1xuICAgIHJldHVybiByZWZlcmVuY2U7XG4gIH1cblxuICAvLyB1bnN1cHBvcnRlZDogc3RhY2tzIGZyb20gZGlmZmVyZW50IGFwcHNcbiAgaWYgKHByb2R1Y2VyLm5vZGUucm9vdCAhPT0gY29uc3VtZXIubm9kZS5yb290KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcmVmZXJlbmNlIGFjcm9zcyBhcHBzLiBDb25zdW1pbmcgYW5kIHByb2R1Y2luZyBzdGFja3MgbXVzdCBiZSBkZWZpbmVkIHdpdGhpbiB0aGUgc2FtZSBDREsgYXBwLicpO1xuICB9XG5cbiAgLy8gdW5zdXBwb3J0ZWQ6IHN0YWNrcyBhcmUgbm90IGluIHRoZSBzYW1lIGFjY291bnRcbiAgaWYgKHByb2R1Y2VyQWNjb3VudCAhPT0gY29uc3VtZXJBY2NvdW50KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYFN0YWNrIFwiJHtjb25zdW1lci5ub2RlLnBhdGh9XCIgY2Fubm90IHJlZmVyZW5jZSAke3JlbmRlclJlZmVyZW5jZShyZWZlcmVuY2UpfSBpbiBzdGFjayBcIiR7cHJvZHVjZXIubm9kZS5wYXRofVwiLiBgICtcbiAgICAgICdDcm9zcyBzdGFjayByZWZlcmVuY2VzIGFyZSBvbmx5IHN1cHBvcnRlZCBmb3Igc3RhY2tzIGRlcGxveWVkIHRvIHRoZSBzYW1lIGFjY291bnQgb3IgYmV0d2VlbiBuZXN0ZWQgc3RhY2tzIGFuZCB0aGVpciBwYXJlbnQgc3RhY2snKTtcbiAgfVxuXG5cbiAgLy8gU3RhY2tzIGFyZSBpbiB0aGUgc2FtZSBhY2NvdW50LCBidXQgZGlmZmVyZW50IHJlZ2lvbnNcbiAgaWYgKHByb2R1Y2VyUmVnaW9uICE9PSBjb25zdW1lclJlZ2lvbiAmJiAhY29uc3VtZXIuX2Nyb3NzUmVnaW9uUmVmZXJlbmNlcykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBTdGFjayBcIiR7Y29uc3VtZXIubm9kZS5wYXRofVwiIGNhbm5vdCByZWZlcmVuY2UgJHtyZW5kZXJSZWZlcmVuY2UocmVmZXJlbmNlKX0gaW4gc3RhY2sgXCIke3Byb2R1Y2VyLm5vZGUucGF0aH1cIi4gYCArXG4gICAgICAnQ3Jvc3Mgc3RhY2sgcmVmZXJlbmNlcyBhcmUgb25seSBzdXBwb3J0ZWQgZm9yIHN0YWNrcyBkZXBsb3llZCB0byB0aGUgc2FtZSBlbnZpcm9ubWVudCBvciBiZXR3ZWVuIG5lc3RlZCBzdGFja3MgYW5kIHRoZWlyIHBhcmVudCBzdGFjay4gJyArXG4gICAgICAnU2V0IGNyb3NzUmVnaW9uUmVmZXJlbmNlcz10cnVlIHRvIGVuYWJsZSBjcm9zcyByZWdpb24gcmVmZXJlbmNlcycpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBjb25zdW1lciBpcyBuZXN0ZWQgaW4gdGhlIHByb2R1Y2VyIChkaXJlY3RseSBvciBpbmRpcmVjdGx5KVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gaWYgdGhlIGNvbnN1bWVyIGlzIG5lc3RlZCB3aXRoaW4gdGhlIHByb2R1Y2VyIChkaXJlY3RseSBvciBpbmRpcmVjdGx5KSxcbiAgLy8gd2lyZSB0aHJvdWdoIGEgQ2xvdWRGb3JtYXRpb24gcGFyYW1ldGVyIGFuZCB0aGVuIHJlc29sdmUgdGhlIHJlZmVyZW5jZSB3aXRoXG4gIC8vIHRoZSBwYXJlbnQgc3RhY2sgYXMgdGhlIGNvbnN1bWVyLlxuICBpZiAoY29uc3VtZXIubmVzdGVkU3RhY2tQYXJlbnQgJiYgaXNOZXN0ZWQoY29uc3VtZXIsIHByb2R1Y2VyKSkge1xuICAgIGNvbnN0IHBhcmFtZXRlclZhbHVlID0gcmVzb2x2ZVZhbHVlKGNvbnN1bWVyLm5lc3RlZFN0YWNrUGFyZW50LCByZWZlcmVuY2UpO1xuICAgIHJldHVybiBjcmVhdGVOZXN0ZWRTdGFja1BhcmFtZXRlcihjb25zdW1lciwgcmVmZXJlbmNlLCBwYXJhbWV0ZXJWYWx1ZSk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHByb2R1Y2VyIGlzIGEgbmVzdGVkIHN0YWNrXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBpZiB0aGUgcHJvZHVjZXIgaXMgbmVzdGVkLCBhbHdheXMgcHVibGlzaCB0aGUgdmFsdWUgdGhyb3VnaCBhXG4gIC8vIGNsb3VkZm9ybWF0aW9uIG91dHB1dCBhbmQgcmVzb2x2ZSByZWN1cnNpdmVseSB3aXRoIHRoZSBGbjo6R2V0QXR0XG4gIC8vIG9mIHRoZSBvdXRwdXQgaW4gdGhlIHBhcmVudCBzdGFjay5cblxuICAvLyBvbmUgbWlnaHQgYXNrLCBpZiB0aGUgY29uc3VtZXIgaXMgbm90IGEgcGFyZW50IG9mIHRoZSBwcm9kdWNlcixcbiAgLy8gd2h5IG5vdCBqdXN0IHVzZSBleHBvcnQvaW1wb3J0PyB0aGUgcmVhc29uIGlzIHRoYXQgd2UgY2Fubm90XG4gIC8vIGdlbmVyYXRlIGFuIFwiZXhwb3J0IG5hbWVcIiBmcm9tIGEgbmVzdGVkIHN0YWNrIGJlY2F1c2UgdGhlIGV4cG9ydFxuICAvLyBuYW1lIG11c3QgY29udGFpbiB0aGUgc3RhY2sgbmFtZSB0byBlbnN1cmUgdW5pcXVlbmVzcywgYW5kIHdlXG4gIC8vIGRvbid0IGtub3cgdGhlIHN0YWNrIG5hbWUgb2YgYSBuZXN0ZWQgc3RhY2sgYmVmb3JlIHdlIGRlcGxveSBpdC5cbiAgLy8gdGhlcmVmb3JlLCB3ZSBjYW4gb25seSBleHBvcnQgZnJvbSBhIHRvcC1sZXZlbCBzdGFjay5cbiAgaWYgKHByb2R1Y2VyLm5lc3RlZCkge1xuICAgIGNvbnN0IG91dHB1dFZhbHVlID0gY3JlYXRlTmVzdGVkU3RhY2tPdXRwdXQocHJvZHVjZXIsIHJlZmVyZW5jZSk7XG4gICAgcmV0dXJuIHJlc29sdmVWYWx1ZShjb25zdW1lciwgb3V0cHV0VmFsdWUpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBleHBvcnQvaW1wb3J0XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBTdGFja3MgYXJlIGluIHRoZSBzYW1lIGFjY291bnQsIGJ1dCBkaWZmZXJlbnQgcmVnaW9uc1xuICBpZiAocHJvZHVjZXJSZWdpb24gIT09IGNvbnN1bWVyUmVnaW9uICYmIGNvbnN1bWVyLl9jcm9zc1JlZ2lvblJlZmVyZW5jZXMpIHtcbiAgICBpZiAocHJvZHVjZXJSZWdpb24gPT09IGN4YXBpLlVOS05PV05fUkVHSU9OIHx8IGNvbnN1bWVyUmVnaW9uID09PSBjeGFwaS5VTktOT1dOX1JFR0lPTikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgU3RhY2sgXCIke2NvbnN1bWVyLm5vZGUucGF0aH1cIiBjYW5ub3QgcmVmZXJlbmNlICR7cmVuZGVyUmVmZXJlbmNlKHJlZmVyZW5jZSl9IGluIHN0YWNrIFwiJHtwcm9kdWNlci5ub2RlLnBhdGh9XCIuIGAgK1xuICAgICAgICAnQ3Jvc3Mgc3RhY2svcmVnaW9uIHJlZmVyZW5jZXMgYXJlIG9ubHkgc3VwcG9ydGVkIGZvciBzdGFja3Mgd2l0aCBhbiBleHBsaWNpdCByZWdpb24gZGVmaW5lZC4gJyk7XG4gICAgfVxuICAgIGNvbnN1bWVyLmFkZERlcGVuZGVuY3kocHJvZHVjZXIsXG4gICAgICBgJHtjb25zdW1lci5ub2RlLnBhdGh9IC0+ICR7cmVmZXJlbmNlLnRhcmdldC5ub2RlLnBhdGh9LiR7cmVmZXJlbmNlLmRpc3BsYXlOYW1lfWApO1xuICAgIHJldHVybiBjcmVhdGVDcm9zc1JlZ2lvbkltcG9ydFZhbHVlKHJlZmVyZW5jZSwgY29uc3VtZXIpO1xuICB9XG5cbiAgLy8gZXhwb3J0IHRoZSB2YWx1ZSB0aHJvdWdoIGEgY2xvdWRmb3JtYXRpb24gXCJleHBvcnQgbmFtZVwiIGFuZCB1c2UgYW5cbiAgLy8gRm46OkltcG9ydFZhbHVlIGluIHRoZSBjb25zdW1wdGlvbiBzaXRlLlxuXG4gIC8vIGFkZCBhIGRlcGVuZGVuY3kgYmV0d2VlbiB0aGUgcHJvZHVjZXIgYW5kIHRoZSBjb25zdW1lci4gZGVwZW5kZW5jeSBsb2dpY1xuICAvLyB3aWxsIHRha2UgY2FyZSBvZiBhcHBseWluZyB0aGUgZGVwZW5kZW5jeSBhdCB0aGUgcmlnaHQgbGV2ZWwgKGUuZy4gdGhlXG4gIC8vIHRvcC1sZXZlbCBzdGFja3MpLlxuICBjb25zdW1lci5hZGREZXBlbmRlbmN5KHByb2R1Y2VyLFxuICAgIGAke2NvbnN1bWVyLm5vZGUucGF0aH0gLT4gJHtyZWZlcmVuY2UudGFyZ2V0Lm5vZGUucGF0aH0uJHtyZWZlcmVuY2UuZGlzcGxheU5hbWV9YCk7XG5cbiAgcmV0dXJuIGNyZWF0ZUltcG9ydFZhbHVlKHJlZmVyZW5jZSk7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgdmVyc2lvbiBvZiB0aGlzIHJlZmVyZW5jZVxuICovXG5mdW5jdGlvbiByZW5kZXJSZWZlcmVuY2UocmVmOiBDZm5SZWZlcmVuY2UpIHtcbiAgcmV0dXJuIGB7JHtyZWYudGFyZ2V0Lm5vZGUucGF0aH1bJHtyZWYuZGlzcGxheU5hbWV9XX1gO1xufVxuXG4vKipcbiAqIEZpbmRzIGFsbCB0aGUgQ2xvdWRGb3JtYXRpb24gcmVmZXJlbmNlcyBpbiBhIGNvbnN0cnVjdCB0cmVlLlxuICovXG5mdW5jdGlvbiBmaW5kQWxsUmVmZXJlbmNlcyhyb290OiBJQ29uc3RydWN0KSB7XG4gIGNvbnN0IHJlc3VsdCA9IG5ldyBBcnJheTx7IHNvdXJjZTogQ2ZuRWxlbWVudCwgdmFsdWU6IENmblJlZmVyZW5jZSB9PigpO1xuICBmb3IgKGNvbnN0IGNvbnN1bWVyIG9mIHJvb3Qubm9kZS5maW5kQWxsKCkpIHtcblxuICAgIC8vIGluY2x1ZGUgb25seSBDZm5FbGVtZW50cyAoaS5lLiByZXNvdXJjZXMpXG4gICAgaWYgKCFDZm5FbGVtZW50LmlzQ2ZuRWxlbWVudChjb25zdW1lcikpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCB0b2tlbnMgPSBmaW5kVG9rZW5zKGNvbnN1bWVyLCAoKSA9PiBjb25zdW1lci5fdG9DbG91ZEZvcm1hdGlvbigpKTtcblxuICAgICAgLy8gaXRlcmF0ZSBvdmVyIGFsbCB0aGUgdG9rZW5zIChlLmcuIGludHJpbnNpYyBmdW5jdGlvbnMsIGxhemllcywgZXRjKSB0aGF0XG4gICAgICAvLyB3ZXJlIGZvdW5kIGluIHRoZSBjbG91ZGZvcm1hdGlvbiByZXByZXNlbnRhdGlvbiBvZiB0aGlzIHJlc291cmNlLlxuICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiB0b2tlbnMpIHtcblxuICAgICAgICAvLyBpbmNsdWRlIG9ubHkgQ2ZuUmVmZXJlbmNlcyAoaS5lLiBcIlJlZlwiIGFuZCBcIkZuOjpHZXRBdHRcIilcbiAgICAgICAgaWYgKCFDZm5SZWZlcmVuY2UuaXNDZm5SZWZlcmVuY2UodG9rZW4pKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgc291cmNlOiBjb25zdW1lcixcbiAgICAgICAgICB2YWx1ZTogdG9rZW4sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIE5vdGU6IGl0IG1pZ2h0IGJlIHRoYXQgdGhlIHByb3BlcnRpZXMgb2YgdGhlIENGTiBvYmplY3QgYXJlbid0IHZhbGlkLlxuICAgICAgLy8gVGhpcyB3aWxsIHVzdWFsbHkgYmUgcHJldmVudGF0aXZlbHkgY2F1Z2h0IGluIGEgY29uc3RydWN0J3MgdmFsaWRhdGUoKVxuICAgICAgLy8gYW5kIHR1cm5lZCBpbnRvIGEgbmljZWx5IGRlc2NyaXB0aXZlIGVycm9yLCBidXQgd2UncmUgcnVubmluZyBwcmVwYXJlKClcbiAgICAgIC8vIGJlZm9yZSB2YWxpZGF0ZSgpLiBTd2FsbG93IGVycm9ycyB0aGF0IG9jY3VyIGJlY2F1c2UgdGhlIENGTiBsYXllclxuICAgICAgLy8gZG9lc24ndCB2YWxpZGF0ZSBjb21wbGV0ZWx5LlxuICAgICAgLy9cbiAgICAgIC8vIFRoaXMgZG9lcyBtYWtlIHRoZSBhc3N1bXB0aW9uIHRoYXQgdGhlIGVycm9yIHdpbGwgbm90IGJlIHJlY3RpZmllZCxcbiAgICAgIC8vIGJ1dCB0aGUgZXJyb3Igd2lsbCBiZSB0aHJvd24gbGF0ZXIgb24gYW55d2F5LiBJZiB0aGUgZXJyb3IgZG9lc24ndFxuICAgICAgLy8gZ2V0IHRocm93biBkb3duIHRoZSBsaW5lLCB3ZSBtYXkgbWlzcyByZWZlcmVuY2VzLlxuICAgICAgaWYgKGUudHlwZSA9PT0gJ0NmblN5bnRoZXNpc0Vycm9yJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIGV4cG9ydC9pbXBvcnRcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIEltcG9ydHMgYSB2YWx1ZSBmcm9tIGFub3RoZXIgc3RhY2sgYnkgY3JlYXRpbmcgYW4gXCJPdXRwdXRcIiB3aXRoIGFuIFwiRXhwb3J0TmFtZVwiXG4gKiBhbmQgcmV0dXJuaW5nIGFuIFwiRm46OkltcG9ydFZhbHVlXCIgdG9rZW4uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUltcG9ydFZhbHVlKHJlZmVyZW5jZTogUmVmZXJlbmNlKTogSW50cmluc2ljIHtcbiAgY29uc3QgZXhwb3J0aW5nU3RhY2sgPSBTdGFjay5vZihyZWZlcmVuY2UudGFyZ2V0KTtcbiAgbGV0IGltcG9ydEV4cHI7XG5cbiAgaWYgKHJlZmVyZW5jZS50eXBlSGludCA9PT0gUmVzb2x1dGlvblR5cGVIaW50LlNUUklOR19MSVNUKSB7XG4gICAgaW1wb3J0RXhwciA9IGV4cG9ydGluZ1N0YWNrLmV4cG9ydFN0cmluZ0xpc3RWYWx1ZShyZWZlcmVuY2UpO1xuICAgIC8vIEkgaGFwcGVuIHRvIGtub3cgdGhpcyByZXR1cm5zIGEgRm4uc3BsaXQoKSB3aGljaCBpbXBsZW1lbnRzIEludHJpbnNpYy5cbiAgICByZXR1cm4gVG9rZW5pemF0aW9uLnJldmVyc2VMaXN0KGltcG9ydEV4cHIpIGFzIEludHJpbnNpYztcbiAgfVxuXG4gIGltcG9ydEV4cHIgPSBleHBvcnRpbmdTdGFjay5leHBvcnRWYWx1ZShyZWZlcmVuY2UpO1xuICAvLyBJIGhhcHBlbiB0byBrbm93IHRoaXMgcmV0dXJucyBhIEZuLmltcG9ydFZhbHVlKCkgd2hpY2ggaW1wbGVtZW50cyBJbnRyaW5zaWMuXG4gIHJldHVybiBUb2tlbml6YXRpb24ucmV2ZXJzZUNvbXBsZXRlU3RyaW5nKGltcG9ydEV4cHIpIGFzIEludHJpbnNpYztcbn1cblxuLyoqXG4gKiBJbXBvcnRzIGEgdmFsdWUgZnJvbSBhbm90aGVyIHN0YWNrIGluIGEgZGlmZmVyZW50IHJlZ2lvbiBieSBjcmVhdGluZyBhbiBcIk91dHB1dFwiIHdpdGggYW4gXCJFeHBvcnROYW1lXCJcbiAqIGluIHRoZSBwcm9kdWNpbmcgc3RhY2ssIGFuZCBhIFwiRXhwb3J0c1JlYWRlclwiIGN1c3RvbSByZXNvdXJjZSBpbiB0aGUgY29uc3VtZXIgc3RhY2tcbiAqXG4gKiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBFeHBvcnRzUmVhZGVyIGF0dHJpYnV0ZSB3aGljaCBjb250YWlucyB0aGUgZXhwb3J0ZWQgdmFsdWVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ3Jvc3NSZWdpb25JbXBvcnRWYWx1ZShyZWZlcmVuY2U6IFJlZmVyZW5jZSwgaW1wb3J0U3RhY2s6IFN0YWNrKTogSW50cmluc2ljIHtcbiAgY29uc3QgcmVmZXJlbmNlU3RhY2sgPSBTdGFjay5vZihyZWZlcmVuY2UudGFyZ2V0KTtcbiAgY29uc3QgZXhwb3J0aW5nU3RhY2sgPSByZWZlcmVuY2VTdGFjay5uZXN0ZWRTdGFja1BhcmVudCA/PyByZWZlcmVuY2VTdGFjaztcblxuICAvLyBnZW5lcmF0ZSBhbiBleHBvcnQgbmFtZVxuICBjb25zdCBleHBvcnRhYmxlID0gZ2V0RXhwb3J0YWJsZShleHBvcnRpbmdTdGFjaywgcmVmZXJlbmNlKTtcbiAgY29uc3QgaWQgPSBKU09OLnN0cmluZ2lmeShleHBvcnRpbmdTdGFjay5yZXNvbHZlKGV4cG9ydGFibGUpKTtcbiAgY29uc3QgZXhwb3J0TmFtZSA9IGdlbmVyYXRlRXhwb3J0TmFtZShpbXBvcnRTdGFjaywgcmVmZXJlbmNlLCBpZCk7XG4gIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQoZXhwb3J0TmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHVucmVzb2x2ZWQgdG9rZW4gaW4gZ2VuZXJhdGVkIGV4cG9ydCBuYW1lOiAke0pTT04uc3RyaW5naWZ5KGV4cG9ydGluZ1N0YWNrLnJlc29sdmUoZXhwb3J0TmFtZSkpfWApO1xuICB9XG5cbiAgLy8gZ2V0IG9yIGNyZWF0ZSB0aGUgZXhwb3J0IHdyaXRlclxuICBjb25zdCB3cml0ZXJDb25zdHJ1Y3ROYW1lID0gbWFrZVVuaXF1ZUlkKFsnRXhwb3J0c1dyaXRlcicsIGltcG9ydFN0YWNrLnJlZ2lvbl0pO1xuICBjb25zdCBleHBvcnRSZWFkZXIgPSBFeHBvcnRXcml0ZXIuZ2V0T3JDcmVhdGUoZXhwb3J0aW5nU3RhY2ssIHdyaXRlckNvbnN0cnVjdE5hbWUsIHtcbiAgICByZWdpb246IGltcG9ydFN0YWNrLnJlZ2lvbixcbiAgfSk7XG5cbiAgY29uc3QgZXhwb3J0ZWQgPSBleHBvcnRSZWFkZXIuZXhwb3J0VmFsdWUoZXhwb3J0TmFtZSwgcmVmZXJlbmNlLCBpbXBvcnRTdGFjayk7XG4gIGlmIChpbXBvcnRTdGFjay5uZXN0ZWRTdGFja1BhcmVudCkge1xuICAgIHJldHVybiBjcmVhdGVOZXN0ZWRTdGFja1BhcmFtZXRlcihpbXBvcnRTdGFjaywgKGV4cG9ydGVkIGFzIENmblJlZmVyZW5jZSksIGV4cG9ydGVkKTtcbiAgfVxuICByZXR1cm4gZXhwb3J0ZWQ7XG59XG5cbi8qKlxuICogR2VuZXJhdGUgYSB1bmlxdWUgcGh5c2ljYWwgbmFtZSBmb3IgdGhlIGV4cG9ydFxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZUV4cG9ydE5hbWUoaW1wb3J0U3RhY2s6IFN0YWNrLCByZWZlcmVuY2U6IFJlZmVyZW5jZSwgaWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHJlZmVyZW5jZVN0YWNrID0gU3RhY2sub2YocmVmZXJlbmNlLnRhcmdldCk7XG5cbiAgY29uc3QgY29tcG9uZW50cyA9IFtcbiAgICByZWZlcmVuY2VTdGFjay5zdGFja05hbWUgPz8gJycsXG4gICAgcmVmZXJlbmNlU3RhY2sucmVnaW9uLFxuICAgIGlkLFxuICBdO1xuICBjb25zdCBwcmVmaXggPSBgJHtpbXBvcnRTdGFjay5uZXN0ZWRTdGFja1BhcmVudD8uc3RhY2tOYW1lID8/IGltcG9ydFN0YWNrLnN0YWNrTmFtZX0vYDtcbiAgY29uc3QgbG9jYWxQYXJ0ID0gbWFrZVVuaXF1ZUlkKGNvbXBvbmVudHMpO1xuICAvLyBtYXggbmFtZSBsZW5ndGggZm9yIGEgc3lzdGVtIG1hbmFnZXIgcGFyYW1ldGVyIGlzIDEwMTEgY2hhcmFjdGVyc1xuICAvLyBpbmNsdWRpbmcgdGhlIGFybiwgaS5lLlxuICAvLyBhcm46YXdzOnNzbTp1cy1lYXN0LTI6MTExMTIyMjIzMzMzOnBhcmFtZXRlci9jZGsvZXhwb3J0cy8ke3N0YWNrTmFtZX0vJHtuYW1lfVxuICBjb25zdCBtYXhMZW5ndGggPSA5MDA7XG4gIHJldHVybiBwcmVmaXggKyBsb2NhbFBhcnQuc2xpY2UoTWF0aC5tYXgoMCwgbG9jYWxQYXJ0Lmxlbmd0aCAtIG1heExlbmd0aCArIHByZWZpeC5sZW5ndGgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEV4cG9ydGFibGUoc3RhY2s6IFN0YWNrLCByZWZlcmVuY2U6IFJlZmVyZW5jZSk6IFJlZmVyZW5jZSB7XG4gIC8vIGNvdWxkIHBvdGVudGlhbGx5IGJlIGNoYW5nZWQgYnkgYSBjYWxsIHRvIG92ZXJyaWRlTG9naWNhbElkLiBUaGlzIHdvdWxkIGNhdXNlIG91ciBFeHBvcnQvSW1wb3J0XG4gIC8vIHRvIGhhdmUgYW4gaW5jb3JyZWN0IGlkLiBGb3IgYSBiZXR0ZXIgdXNlciBleHBlcmllbmNlLCBsb2NrIHRoZSBsb2dpY2FsSWQgYW5kIHRocm93IGFuIGVycm9yXG4gIC8vIGlmIHRoZSB1c2VyIHRyaWVzIHRvIG92ZXJyaWRlIHRoZSBpZCBfYWZ0ZXJfIGNhbGxpbmcgZXhwb3J0VmFsdWVcbiAgaWYgKENmbkVsZW1lbnQuaXNDZm5FbGVtZW50KHJlZmVyZW5jZS50YXJnZXQpKSB7XG4gICAgcmVmZXJlbmNlLnRhcmdldC5fbG9ja0xvZ2ljYWxJZCgpO1xuICB9XG5cbiAgLy8gXCJ0ZWxlcG9ydFwiIHRoZSB2YWx1ZSBoZXJlLCBpbiBjYXNlIGl0IGNvbWVzIGZyb20gYSBuZXN0ZWQgc3RhY2suIFRoaXMgd2lsbCBhbHNvXG4gIC8vIGVuc3VyZSB0aGUgdmFsdWUgaXMgZnJvbSBvdXIgb3duIHNjb3BlLlxuICByZXR1cm4gcmVmZXJlbmNlTmVzdGVkU3RhY2tWYWx1ZUluUGFyZW50KHJlZmVyZW5jZSwgc3RhY2spO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIG5lc3RlZCBzdGFja3Ncbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIEFkZHMgYSBDbG91ZEZvcm1hdGlvbiBwYXJhbWV0ZXIgdG8gYSBuZXN0ZWQgc3RhY2sgYW5kIGFzc2lnbnMgaXQgd2l0aCB0aGVcbiAqIHZhbHVlIG9mIHRoZSByZWZlcmVuY2UuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZU5lc3RlZFN0YWNrUGFyYW1ldGVyKG5lc3RlZDogU3RhY2ssIHJlZmVyZW5jZTogQ2ZuUmVmZXJlbmNlLCB2YWx1ZTogSVJlc29sdmFibGUpIHtcbiAgY29uc3QgcGFyYW1JZCA9IGdlbmVyYXRlVW5pcXVlSWQobmVzdGVkLCByZWZlcmVuY2UsICdyZWZlcmVuY2UtdG8tJyk7XG4gIGxldCBwYXJhbSA9IG5lc3RlZC5ub2RlLnRyeUZpbmRDaGlsZChwYXJhbUlkKSBhcyBDZm5QYXJhbWV0ZXI7XG4gIGlmICghcGFyYW0pIHtcbiAgICBwYXJhbSA9IG5ldyBDZm5QYXJhbWV0ZXIobmVzdGVkLCBwYXJhbUlkLCB7IHR5cGU6ICdTdHJpbmcnIH0pO1xuXG4gICAgLy8gVWdseSBsaXR0bGUgaGFjayB1bnRpbCB3ZSBtb3ZlIE5lc3RlZFN0YWNrIHRvIHRoaXMgbW9kdWxlLlxuICAgIGlmICghKCdzZXRQYXJhbWV0ZXInIGluIG5lc3RlZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYXNzZXJ0aW9uIGZhaWxlZDogbmVzdGVkIHN0YWNrIHNob3VsZCBoYXZlIGEgXCJzZXRQYXJhbWV0ZXJcIiBtZXRob2QnKTtcbiAgICB9XG5cbiAgICAobmVzdGVkIGFzIGFueSkuc2V0UGFyYW1ldGVyKHBhcmFtLmxvZ2ljYWxJZCwgVG9rZW4uYXNTdHJpbmcodmFsdWUpKTtcbiAgfVxuXG4gIHJldHVybiBwYXJhbS52YWx1ZSBhcyBDZm5SZWZlcmVuY2U7XG59XG5cbi8qKlxuICogQWRkcyBhIENsb3VkRm9ybWF0aW9uIG91dHB1dCB0byBhIG5lc3RlZCBzdGFjayBhbmQgcmV0dXJucyBhbiBcIkZuOjpHZXRBdHRcIlxuICogaW50cmluc2ljIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIHRoaXMgb3V0cHV0IGluIHRoZSBwYXJlbnQgc3RhY2suXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZU5lc3RlZFN0YWNrT3V0cHV0KHByb2R1Y2VyOiBTdGFjaywgcmVmZXJlbmNlOiBSZWZlcmVuY2UpOiBDZm5SZWZlcmVuY2Uge1xuICBjb25zdCBvdXRwdXRJZCA9IGdlbmVyYXRlVW5pcXVlSWQocHJvZHVjZXIsIHJlZmVyZW5jZSk7XG4gIGxldCBvdXRwdXQgPSBwcm9kdWNlci5ub2RlLnRyeUZpbmRDaGlsZChvdXRwdXRJZCkgYXMgQ2ZuT3V0cHV0O1xuICBpZiAoIW91dHB1dCkge1xuICAgIG91dHB1dCA9IG5ldyBDZm5PdXRwdXQocHJvZHVjZXIsIG91dHB1dElkLCB7IHZhbHVlOiBUb2tlbi5hc1N0cmluZyhyZWZlcmVuY2UpIH0pO1xuICB9XG5cbiAgaWYgKCFwcm9kdWNlci5uZXN0ZWRTdGFja1Jlc291cmNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhc3NlcnRpb24gZmFpbGVkJyk7XG4gIH1cblxuICByZXR1cm4gcHJvZHVjZXIubmVzdGVkU3RhY2tSZXNvdXJjZS5nZXRBdHQoYE91dHB1dHMuJHtvdXRwdXQubG9naWNhbElkfWApIGFzIENmblJlZmVyZW5jZTtcbn1cblxuLyoqXG4gKiBUcmFuc2xhdGUgYSBSZWZlcmVuY2UgaW50byBhIG5lc3RlZCBzdGFjayBpbnRvIGEgdmFsdWUgaW4gdGhlIHBhcmVudCBzdGFja1xuICpcbiAqIFdpbGwgY3JlYXRlIE91dHB1dHMgYWxvbmcgdGhlIGNoYWluIG9mIE5lc3RlZCBTdGFja3MsIGFuZCByZXR1cm4gdGhlIGZpbmFsIGB7IEZuOjpHZXRBdHQgfWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWZlcmVuY2VOZXN0ZWRTdGFja1ZhbHVlSW5QYXJlbnQocmVmZXJlbmNlOiBSZWZlcmVuY2UsIHRhcmdldFN0YWNrOiBTdGFjaykge1xuICBsZXQgY3VycmVudFN0YWNrID0gU3RhY2sub2YocmVmZXJlbmNlLnRhcmdldCk7XG4gIGlmIChjdXJyZW50U3RhY2sgIT09IHRhcmdldFN0YWNrICYmICFpc05lc3RlZChjdXJyZW50U3RhY2ssIHRhcmdldFN0YWNrKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgUmVmZXJlbmNlZCByZXNvdXJjZSBtdXN0IGJlIGluIHN0YWNrICcke3RhcmdldFN0YWNrLm5vZGUucGF0aH0nLCBnb3QgJyR7cmVmZXJlbmNlLnRhcmdldC5ub2RlLnBhdGh9J2ApO1xuICB9XG5cbiAgd2hpbGUgKGN1cnJlbnRTdGFjayAhPT0gdGFyZ2V0U3RhY2spIHtcbiAgICByZWZlcmVuY2UgPSBjcmVhdGVOZXN0ZWRTdGFja091dHB1dChTdGFjay5vZihyZWZlcmVuY2UudGFyZ2V0KSwgcmVmZXJlbmNlKTtcbiAgICBjdXJyZW50U3RhY2sgPSBTdGFjay5vZihyZWZlcmVuY2UudGFyZ2V0KTtcbiAgfVxuXG4gIHJldHVybiByZWZlcmVuY2U7XG59XG5cbi8qKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGlzIHN0YWNrIGlzIGEgZGlyZWN0IG9yIGluZGlyZWN0IHBhcmVudCBvZiB0aGUgbmVzdGVkXG4gKiBzdGFjayBgbmVzdGVkYC5cbiAqXG4gKiBJZiBgY2hpbGRgIGlzIG5vdCBhIG5lc3RlZCBzdGFjaywgYWx3YXlzIHJldHVybnMgYGZhbHNlYCBiZWNhdXNlIGl0IGNhbid0XG4gKiBoYXZlIGEgcGFyZW50LCBkYWguXG4gKi9cbmZ1bmN0aW9uIGlzTmVzdGVkKG5lc3RlZDogU3RhY2ssIHBhcmVudDogU3RhY2spOiBib29sZWFuIHtcbiAgLy8gaWYgdGhlIHBhcmVudCBpcyBhIGRpcmVjdCBwYXJlbnRcbiAgaWYgKG5lc3RlZC5uZXN0ZWRTdGFja1BhcmVudCA9PT0gcGFyZW50KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyB3ZSByZWFjaGVkIGEgdG9wLWxldmVsIChub24tbmVzdGVkKSBzdGFjayB3aXRob3V0IGZpbmRpbmcgdGhlIHBhcmVudFxuICBpZiAoIW5lc3RlZC5uZXN0ZWRTdGFja1BhcmVudCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIHJlY3Vyc2Ugd2l0aCB0aGUgY2hpbGQncyBkaXJlY3QgcGFyZW50XG4gIHJldHVybiBpc05lc3RlZChuZXN0ZWQubmVzdGVkU3RhY2tQYXJlbnQsIHBhcmVudCk7XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgdW5pcXVlIGlkIGZvciBhIGBSZWZlcmVuY2VgXG4gKiBAcGFyYW0gc3RhY2sgQSBzdGFjayB1c2VkIHRvIHJlc29sdmUgdG9rZW5zXG4gKiBAcGFyYW0gcmVmIFRoZSByZWZlcmVuY2VcbiAqIEBwYXJhbSBwcmVmaXggT3B0aW9uYWwgcHJlZml4IGZvciB0aGUgaWRcbiAqIEByZXR1cm5zIEEgdW5pcXVlIGlkXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlVW5pcXVlSWQoc3RhY2s6IFN0YWNrLCByZWY6IFJlZmVyZW5jZSwgcHJlZml4ID0gJycpIHtcbiAgLy8gd2UgY2FsbCBcInJlc29sdmUoKVwiIHRvIGVuc3VyZSB0aGF0IHRva2VucyBkbyBub3QgY3JlZXAgaW4gKGZvciBleGFtcGxlLCBpZiB0aGUgcmVmZXJlbmNlIGRpc3BsYXkgbmFtZSBpbmNsdWRlcyB0b2tlbnMpXG4gIHJldHVybiBzdGFjay5yZXNvbHZlKGAke3ByZWZpeH0ke05hbWVzLm5vZGVVbmlxdWVJZChyZWYudGFyZ2V0Lm5vZGUpfSR7cmVmLmRpc3BsYXlOYW1lfWApO1xufVxuIl19