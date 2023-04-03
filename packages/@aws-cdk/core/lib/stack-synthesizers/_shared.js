"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvedOr = exports.StringSpecializer = exports.assertBound = exports.contentHash = exports.addStackArtifactToAssembly = void 0;
const crypto = require("crypto");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const stack_1 = require("../stack");
const token_1 = require("../token");
/**
 * Shared logic of writing stack artifact to the Cloud Assembly
 *
 * This logic is shared between StackSyntheses.
 *
 * It could have been a protected method on a base class, but it
 * uses `Partial<cxapi.AwsCloudFormationStackProperties>` in the
 * parameters (which is convenient so I can remain typesafe without
 * copy/pasting), and jsii will choke on this type.
 */
function addStackArtifactToAssembly(session, stack, stackProps, additionalStackDependencies) {
    // nested stack tags are applied at the AWS::CloudFormation::Stack resource
    // level and are not needed in the cloud assembly.
    if (stack.tags.hasTags()) {
        stack.node.addMetadata(cxschema.ArtifactMetadataEntryType.STACK_TAGS, stack.tags.renderTags());
    }
    const deps = [
        ...stack.dependencies.map(s => s.artifactId),
        ...additionalStackDependencies,
    ];
    const meta = collectStackMetadata(stack);
    // backwards compatibility since originally artifact ID was always equal to
    // stack name the stackName attribute is optional and if it is not specified
    // the CLI will use the artifact ID as the stack name. we *could have*
    // always put the stack name here but wanted to minimize the risk around
    // changes to the assembly manifest. so this means that as long as stack
    // name and artifact ID are the same, the cloud assembly manifest will not
    // change.
    const stackNameProperty = stack.stackName === stack.artifactId
        ? {}
        : { stackName: stack.stackName };
    const properties = {
        templateFile: stack.templateFile,
        terminationProtection: stack.terminationProtection,
        tags: nonEmptyDict(stack.tags.tagValues()),
        validateOnSynth: session.validateOnSynth,
        ...stackProps,
        ...stackNameProperty,
    };
    // add an artifact that represents this stack
    session.assembly.addArtifact(stack.artifactId, {
        type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
        environment: stack.environment,
        properties,
        dependencies: deps.length > 0 ? deps : undefined,
        metadata: Object.keys(meta).length > 0 ? meta : undefined,
        displayName: stack.node.path,
    });
}
exports.addStackArtifactToAssembly = addStackArtifactToAssembly;
/**
 * Collect the metadata from a stack
 */
function collectStackMetadata(stack) {
    const output = {};
    visit(stack);
    return output;
    function visit(node) {
        // break off if we reached a node that is not a child of this stack
        const parent = findParentStack(node);
        if (parent !== stack) {
            return;
        }
        if (node.node.metadata.length > 0) {
            // Make the path absolute
            output[constructs_1.Node.PATH_SEP + node.node.path] = node.node.metadata.map(md => stack.resolve(md));
        }
        for (const child of node.node.children) {
            visit(child);
        }
    }
    function findParentStack(node) {
        if (stack_1.Stack.isStack(node) && node.nestedStackParent === undefined) {
            return node;
        }
        if (!node.node.scope) {
            return undefined;
        }
        return findParentStack(node.node.scope);
    }
}
/**
 * Hash a string
 */
function contentHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}
exports.contentHash = contentHash;
/**
 * Throw an error message about binding() if we don't have a value for x.
 *
 * This replaces the ! assertions we would need everywhere otherwise.
 */
function assertBound(x) {
    if (x === null && x === undefined) {
        throw new Error('You must call bindStack() first');
    }
}
exports.assertBound = assertBound;
function nonEmptyDict(xs) {
    return Object.keys(xs).length > 0 ? xs : undefined;
}
/**
 * A "replace-all" function that doesn't require us escaping a literal string to a regex
 */
function replaceAll(s, search, replace) {
    return s.split(search).join(replace);
}
class StringSpecializer {
    constructor(stack, qualifier) {
        this.stack = stack;
        this.qualifier = qualifier;
    }
    /**
     * Function to replace placeholders in the input string as much as possible
     *
     * We replace:
     * - ${Qualifier}: always
     * - ${AWS::AccountId}, ${AWS::Region}: only if we have the actual values available
     * - ${AWS::Partition}: never, since we never have the actual partition value.
     */
    specialize(s) {
        s = replaceAll(s, '${Qualifier}', this.qualifier);
        return cxapi.EnvironmentPlaceholders.replace(s, {
            region: resolvedOr(this.stack.region, cxapi.EnvironmentPlaceholders.CURRENT_REGION),
            accountId: resolvedOr(this.stack.account, cxapi.EnvironmentPlaceholders.CURRENT_ACCOUNT),
            partition: cxapi.EnvironmentPlaceholders.CURRENT_PARTITION,
        });
    }
    /**
     * Specialize only the qualifier
     */
    qualifierOnly(s) {
        return replaceAll(s, '${Qualifier}', this.qualifier);
    }
}
exports.StringSpecializer = StringSpecializer;
/**
 * Return the given value if resolved or fall back to a default
 */
function resolvedOr(x, def) {
    return token_1.Token.isUnresolved(x) ? def : x;
}
exports.resolvedOr = resolvedOr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3NoYXJlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIl9zaGFyZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWlDO0FBQ2pDLDJEQUEyRDtBQUMzRCx5Q0FBeUM7QUFDekMsMkNBQThDO0FBRTlDLG9DQUFpQztBQUNqQyxvQ0FBaUM7QUFFakM7Ozs7Ozs7OztHQVNHO0FBQ0gsU0FBZ0IsMEJBQTBCLENBQ3hDLE9BQTBCLEVBQzFCLEtBQVksRUFDWixVQUE4RCxFQUM5RCwyQkFBcUM7SUFFckMsMkVBQTJFO0lBQzNFLGtEQUFrRDtJQUNsRCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDeEIsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7S0FDaEc7SUFFRCxNQUFNLElBQUksR0FBRztRQUNYLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQzVDLEdBQUcsMkJBQTJCO0tBQy9CLENBQUM7SUFDRixNQUFNLElBQUksR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV6QywyRUFBMkU7SUFDM0UsNEVBQTRFO0lBQzVFLHNFQUFzRTtJQUN0RSx3RUFBd0U7SUFDeEUsd0VBQXdFO0lBQ3hFLDBFQUEwRTtJQUMxRSxVQUFVO0lBQ1YsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxVQUFVO1FBQzVELENBQUMsQ0FBQyxFQUFHO1FBQ0wsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUVuQyxNQUFNLFVBQVUsR0FBOEM7UUFDNUQsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1FB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M0JELDhDQTJCQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFJLENBQVMsRUFBRSxHQUFNO0lBQzdDLE9BQU8sYUFBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUZELGdDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IE5vZGUsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElTeW50aGVzaXNTZXNzaW9uIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi4vdG9rZW4nO1xuXG4vKipcbiAqIFNoYXJlZCBsb2dpYyBvZiB3cml0aW5nIHN0YWNrIGFydGlmYWN0IHRvIHRoZSBDbG91ZCBBc3NlbWJseVxuICpcbiAqIFRoaXMgbG9naWMgaXMgc2hhcmVkIGJldHdlZW4gU3RhY2tTeW50aGVzZXMuXG4gKlxuICogSXQgY291bGQgaGF2ZSBiZWVuIGEgcHJvdGVjdGVkIG1ldGhvZCBvbiBhIGJhc2UgY2xhc3MsIGJ1dCBpdFxuICogdXNlcyBgUGFydGlhbDxjeGFwaS5Bd3NDbG91ZEZvcm1hdGlvblN0YWNrUHJvcGVydGllcz5gIGluIHRoZVxuICogcGFyYW1ldGVycyAod2hpY2ggaXMgY29udmVuaWVudCBzbyBJIGNhbiByZW1haW4gdHlwZXNhZmUgd2l0aG91dFxuICogY29weS9wYXN0aW5nKSwgYW5kIGpzaWkgd2lsbCBjaG9rZSBvbiB0aGlzIHR5cGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRTdGFja0FydGlmYWN0VG9Bc3NlbWJseShcbiAgc2Vzc2lvbjogSVN5bnRoZXNpc1Nlc3Npb24sXG4gIHN0YWNrOiBTdGFjayxcbiAgc3RhY2tQcm9wczogUGFydGlhbDxjeHNjaGVtYS5Bd3NDbG91ZEZvcm1hdGlvblN0YWNrUHJvcGVydGllcz4sXG4gIGFkZGl0aW9uYWxTdGFja0RlcGVuZGVuY2llczogc3RyaW5nW10pIHtcblxuICAvLyBuZXN0ZWQgc3RhY2sgdGFncyBhcmUgYXBwbGllZCBhdCB0aGUgQVdTOjpDbG91ZEZvcm1hdGlvbjo6U3RhY2sgcmVzb3VyY2VcbiAgLy8gbGV2ZWwgYW5kIGFyZSBub3QgbmVlZGVkIGluIHRoZSBjbG91ZCBhc3NlbWJseS5cbiAgaWYgKHN0YWNrLnRhZ3MuaGFzVGFncygpKSB7XG4gICAgc3RhY2subm9kZS5hZGRNZXRhZGF0YShjeHNjaGVtYS5BcnRpZmFjdE1ldGFkYXRhRW50cnlUeXBlLlNUQUNLX1RBR1MsIHN0YWNrLnRhZ3MucmVuZGVyVGFncygpKTtcbiAgfVxuXG4gIGNvbnN0IGRlcHMgPSBbXG4gICAgLi4uc3RhY2suZGVwZW5kZW5jaWVzLm1hcChzID0+IHMuYXJ0aWZhY3RJZCksXG4gICAgLi4uYWRkaXRpb25hbFN0YWNrRGVwZW5kZW5jaWVzLFxuICBdO1xuICBjb25zdCBtZXRhID0gY29sbGVjdFN0YWNrTWV0YWRhdGEoc3RhY2spO1xuXG4gIC8vIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHNpbmNlIG9yaWdpbmFsbHkgYXJ0aWZhY3QgSUQgd2FzIGFsd2F5cyBlcXVhbCB0b1xuICAvLyBzdGFjayBuYW1lIHRoZSBzdGFja05hbWUgYXR0cmlidXRlIGlzIG9wdGlvbmFsIGFuZCBpZiBpdCBpcyBub3Qgc3BlY2lmaWVkXG4gIC8vIHRoZSBDTEkgd2lsbCB1c2UgdGhlIGFydGlmYWN0IElEIGFzIHRoZSBzdGFjayBuYW1lLiB3ZSAqY291bGQgaGF2ZSpcbiAgLy8gYWx3YXlzIHB1dCB0aGUgc3RhY2sgbmFtZSBoZXJlIGJ1dCB3YW50ZWQgdG8gbWluaW1pemUgdGhlIHJpc2sgYXJvdW5kXG4gIC8vIGNoYW5nZXMgdG8gdGhlIGFzc2VtYmx5IG1hbmlmZXN0LiBzbyB0aGlzIG1lYW5zIHRoYXQgYXMgbG9uZyBhcyBzdGFja1xuICAvLyBuYW1lIGFuZCBhcnRpZmFjdCBJRCBhcmUgdGhlIHNhbWUsIHRoZSBjbG91ZCBhc3NlbWJseSBtYW5pZmVzdCB3aWxsIG5vdFxuICAvLyBjaGFuZ2UuXG4gIGNvbnN0IHN0YWNrTmFtZVByb3BlcnR5ID0gc3RhY2suc3RhY2tOYW1lID09PSBzdGFjay5hcnRpZmFjdElkXG4gICAgPyB7IH1cbiAgICA6IHsgc3RhY2tOYW1lOiBzdGFjay5zdGFja05hbWUgfTtcblxuICBjb25zdCBwcm9wZXJ0aWVzOiBjeHNjaGVtYS5Bd3NDbG91ZEZvcm1hdGlvblN0YWNrUHJvcGVydGllcyA9IHtcbiAgICB0ZW1wbGF0ZUZpbGU6IHN0YWNrLnRlbXBsYXRlRmlsZSxcbiAgICB0ZXJtaW5hdGlvblByb3RlY3Rpb246IHN0YWNrLnRlcm1pbmF0aW9uUHJvdGVjdGlvbixcbiAgICB0YWdzOiBub25FbXB0eURpY3Qoc3RhY2sudGFncy50YWdWYWx1ZXMoKSksXG4gICAgdmFsaWRhdGVPblN5bnRoOiBzZXNzaW9uLnZhbGlkYXRlT25TeW50aCxcbiAgICAuLi5zdGFja1Byb3BzLFxuICAgIC4uLnN0YWNrTmFtZVByb3BlcnR5LFxuICB9O1xuXG4gIC8vIGFkZCBhbiBhcnRpZmFjdCB0aGF0IHJlcHJlc2VudHMgdGhpcyBzdGFja1xuICBzZXNzaW9uLmFzc2VtYmx5LmFkZEFydGlmYWN0KHN0YWNrLmFydGlmYWN0SWQsIHtcbiAgICB0eXBlOiBjeHNjaGVtYS5BcnRpZmFjdFR5cGUuQVdTX0NMT1VERk9STUFUSU9OX1NUQUNLLFxuICAgIGVudmlyb25tZW50OiBzdGFjay5lbnZpcm9ubWVudCxcbiAgICBwcm9wZXJ0aWVzLFxuICAgIGRlcGVuZGVuY2llczogZGVwcy5sZW5ndGggPiAwID8gZGVwcyA6IHVuZGVmaW5lZCxcbiAgICBtZXRhZGF0YTogT2JqZWN0LmtleXMobWV0YSkubGVuZ3RoID4gMCA/IG1ldGEgOiB1bmRlZmluZWQsXG4gICAgZGlzcGxheU5hbWU6IHN0YWNrLm5vZGUucGF0aCxcbiAgfSk7XG59XG5cbi8qKlxuICogQ29sbGVjdCB0aGUgbWV0YWRhdGEgZnJvbSBhIHN0YWNrXG4gKi9cbmZ1bmN0aW9uIGNvbGxlY3RTdGFja01ldGFkYXRhKHN0YWNrOiBTdGFjaykge1xuICBjb25zdCBvdXRwdXQ6IHsgW2lkOiBzdHJpbmddOiBjeHNjaGVtYS5NZXRhZGF0YUVudHJ5W10gfSA9IHsgfTtcblxuICB2aXNpdChzdGFjayk7XG5cbiAgcmV0dXJuIG91dHB1dDtcblxuICBmdW5jdGlvbiB2aXNpdChub2RlOiBJQ29uc3RydWN0KSB7XG4gICAgLy8gYnJlYWsgb2ZmIGlmIHdlIHJlYWNoZWQgYSBub2RlIHRoYXQgaXMgbm90IGEgY2hpbGQgb2YgdGhpcyBzdGFja1xuICAgIGNvbnN0IHBhcmVudCA9IGZpbmRQYXJlbnRTdGFjayhub2RlKTtcbiAgICBpZiAocGFyZW50ICE9PSBzdGFjaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlLm5vZGUubWV0YWRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgLy8gTWFrZSB0aGUgcGF0aCBhYnNvbHV0ZVxuICAgICAgb3V0cHV0W05vZGUuUEFUSF9TRVAgKyBub2RlLm5vZGUucGF0aF0gPSBub2RlLm5vZGUubWV0YWRhdGEubWFwKG1kID0+IHN0YWNrLnJlc29sdmUobWQpIGFzIGN4c2NoZW1hLk1ldGFkYXRhRW50cnkpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5ub2RlLmNoaWxkcmVuKSB7XG4gICAgICB2aXNpdChjaGlsZCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZmluZFBhcmVudFN0YWNrKG5vZGU6IElDb25zdHJ1Y3QpOiBTdGFjayB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKFN0YWNrLmlzU3RhY2sobm9kZSkgJiYgbm9kZS5uZXN0ZWRTdGFja1BhcmVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBpZiAoIW5vZGUubm9kZS5zY29wZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmluZFBhcmVudFN0YWNrKG5vZGUubm9kZS5zY29wZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBIYXNoIGEgc3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb250ZW50SGFzaChjb250ZW50OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGNyeXB0by5jcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoY29udGVudCkuZGlnZXN0KCdoZXgnKTtcbn1cblxuLyoqXG4gKiBUaHJvdyBhbiBlcnJvciBtZXNzYWdlIGFib3V0IGJpbmRpbmcoKSBpZiB3ZSBkb24ndCBoYXZlIGEgdmFsdWUgZm9yIHguXG4gKlxuICogVGhpcyByZXBsYWNlcyB0aGUgISBhc3NlcnRpb25zIHdlIHdvdWxkIG5lZWQgZXZlcnl3aGVyZSBvdGhlcndpc2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRCb3VuZDxBPih4OiBBIHwgdW5kZWZpbmVkKTogYXNzZXJ0cyB4IGlzIE5vbk51bGxhYmxlPEE+IHtcbiAgaWYgKHggPT09IG51bGwgJiYgeCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBjYWxsIGJpbmRTdGFjaygpIGZpcnN0Jyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbm9uRW1wdHlEaWN0PEE+KHhzOiBSZWNvcmQ8c3RyaW5nLCBBPikge1xuICByZXR1cm4gT2JqZWN0LmtleXMoeHMpLmxlbmd0aCA+IDAgPyB4cyA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBBIFwicmVwbGFjZS1hbGxcIiBmdW5jdGlvbiB0aGF0IGRvZXNuJ3QgcmVxdWlyZSB1cyBlc2NhcGluZyBhIGxpdGVyYWwgc3RyaW5nIHRvIGEgcmVnZXhcbiAqL1xuZnVuY3Rpb24gcmVwbGFjZUFsbChzOiBzdHJpbmcsIHNlYXJjaDogc3RyaW5nLCByZXBsYWNlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHMuc3BsaXQoc2VhcmNoKS5qb2luKHJlcGxhY2UpO1xufVxuXG5leHBvcnQgY2xhc3MgU3RyaW5nU3BlY2lhbGl6ZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHN0YWNrOiBTdGFjaywgcHJpdmF0ZSByZWFkb25seSBxdWFsaWZpZXI6IHN0cmluZykge1xuICB9XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRvIHJlcGxhY2UgcGxhY2Vob2xkZXJzIGluIHRoZSBpbnB1dCBzdHJpbmcgYXMgbXVjaCBhcyBwb3NzaWJsZVxuICAgKlxuICAgKiBXZSByZXBsYWNlOlxuICAgKiAtICR7UXVhbGlmaWVyfTogYWx3YXlzXG4gICAqIC0gJHtBV1M6OkFjY291bnRJZH0sICR7QVdTOjpSZWdpb259OiBvbmx5IGlmIHdlIGhhdmUgdGhlIGFjdHVhbCB2YWx1ZXMgYXZhaWxhYmxlXG4gICAqIC0gJHtBV1M6OlBhcnRpdGlvbn06IG5ldmVyLCBzaW5jZSB3ZSBuZXZlciBoYXZlIHRoZSBhY3R1YWwgcGFydGl0aW9uIHZhbHVlLlxuICAgKi9cbiAgcHVibGljIHNwZWNpYWxpemUoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBzID0gcmVwbGFjZUFsbChzLCAnJHtRdWFsaWZpZXJ9JywgdGhpcy5xdWFsaWZpZXIpO1xuICAgIHJldHVybiBjeGFwaS5FbnZpcm9ubWVudFBsYWNlaG9sZGVycy5yZXBsYWNlKHMsIHtcbiAgICAgIHJlZ2lvbjogcmVzb2x2ZWRPcih0aGlzLnN0YWNrLnJlZ2lvbiwgY3hhcGkuRW52aXJvbm1lbnRQbGFjZWhvbGRlcnMuQ1VSUkVOVF9SRUdJT04pLFxuICAgICAgYWNjb3VudElkOiByZXNvbHZlZE9yKHRoaXMuc3RhY2suYWNjb3VudCwgY3hhcGkuRW52aXJvbm1lbnRQbGFjZWhvbGRlcnMuQ1VSUkVOVF9BQ0NPVU5UKSxcbiAgICAgIHBhcnRpdGlvbjogY3hhcGkuRW52aXJvbm1lbnRQbGFjZWhvbGRlcnMuQ1VSUkVOVF9QQVJUSVRJT04sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU3BlY2lhbGl6ZSBvbmx5IHRoZSBxdWFsaWZpZXJcbiAgICovXG4gIHB1YmxpYyBxdWFsaWZpZXJPbmx5KHM6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHJlcGxhY2VBbGwocywgJyR7UXVhbGlmaWVyfScsIHRoaXMucXVhbGlmaWVyKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybiB0aGUgZ2l2ZW4gdmFsdWUgaWYgcmVzb2x2ZWQgb3IgZmFsbCBiYWNrIHRvIGEgZGVmYXVsdFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZWRPcjxBPih4OiBzdHJpbmcsIGRlZjogQSk6IHN0cmluZyB8IEEge1xuICByZXR1cm4gVG9rZW4uaXNVbnJlc29sdmVkKHgpID8gZGVmIDogeDtcbn1cbiJdfQ==