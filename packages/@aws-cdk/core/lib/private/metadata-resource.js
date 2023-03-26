"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAnalytics = exports.MetadataResource = void 0;
const zlib = require("zlib");
const region_info_1 = require("@aws-cdk/region-info");
const constructs_1 = require("constructs");
const runtime_info_1 = require("./runtime-info");
const cfn_condition_1 = require("../cfn-condition");
const cfn_fn_1 = require("../cfn-fn");
const cfn_pseudo_1 = require("../cfn-pseudo");
const cfn_resource_1 = require("../cfn-resource");
const lazy_1 = require("../lazy");
const token_1 = require("../token");
/**
 * Construct that will render the metadata resource
 */
class MetadataResource extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        const metadataServiceExists = token_1.Token.isUnresolved(scope.region) || region_info_1.RegionInfo.get(scope.region).cdkMetadataResourceAvailable;
        if (metadataServiceExists) {
            const resource = new cfn_resource_1.CfnResource(this, 'Default', {
                type: 'AWS::CDK::Metadata',
                properties: {
                    Analytics: lazy_1.Lazy.string({ produce: () => formatAnalytics((0, runtime_info_1.constructInfoFromStack)(scope)) }),
                },
            });
            // In case we don't actually know the region, add a condition to determine it at deploy time
            if (token_1.Token.isUnresolved(scope.region)) {
                const condition = new cfn_condition_1.CfnCondition(this, 'Condition', {
                    expression: makeCdkMetadataAvailableCondition(),
                });
                // To not cause undue template changes
                condition.overrideLogicalId('CDKMetadataAvailable');
                resource.cfnOptions.condition = condition;
            }
        }
    }
}
exports.MetadataResource = MetadataResource;
function makeCdkMetadataAvailableCondition() {
    return cfn_fn_1.Fn.conditionOr(...region_info_1.RegionInfo.regions
        .filter(ri => ri.cdkMetadataResourceAvailable)
        .map(ri => cfn_fn_1.Fn.conditionEquals(cfn_pseudo_1.Aws.REGION, ri.name)));
}
/** Convenience type for arbitrarily-nested map */
class Trie extends Map {
}
/**
 * Formats a list of construct fully-qualified names (FQNs) and versions into a (possibly compressed) prefix-encoded string.
 *
 * The list of ConstructInfos is logically formatted into:
 * ${version}!${fqn} (e.g., "1.90.0!aws-cdk-lib.Stack")
 * and then all of the construct-versions are grouped with common prefixes together, grouping common parts in '{}' and separating items with ','.
 *
 * Example:
 * [1.90.0!aws-cdk-lib.Stack, 1.90.0!aws-cdk-lib.Construct, 1.90.0!aws-cdk-lib.service.Resource, 0.42.1!aws-cdk-lib-experiments.NewStuff]
 * Becomes:
 * 1.90.0!aws-cdk-lib.{Stack,Construct,service.Resource},0.42.1!aws-cdk-lib-experiments.NewStuff
 *
 * The whole thing is then either included directly as plaintext as:
 * v2:plaintext:{prefixEncodedList}
 * Or is compressed and base64-encoded, and then formatted as:
 * v2:deflate64:{prefixEncodedListCompressedAndEncoded}
 *
 * Exported/visible for ease of testing.
 */
function formatAnalytics(infos) {
    const trie = new Trie();
    infos.forEach(info => insertFqnInTrie(`${info.version}!${info.fqn}`, trie));
    const plaintextEncodedConstructs = prefixEncodeTrie(trie);
    const compressedConstructsBuffer = zlib.gzipSync(Buffer.from(plaintextEncodedConstructs));
    // set OS flag to "unknown" in order to ensure we get consistent results across operating systems
    // see https://github.com/aws/aws-cdk/issues/15322
    setGzipOperatingSystemToUnknown(compressedConstructsBuffer);
    const compressedConstructs = compressedConstructsBuffer.toString('base64');
    return `v2:deflate64:${compressedConstructs}`;
}
exports.formatAnalytics = formatAnalytics;
/**
 * Splits after non-alphanumeric characters (e.g., '.', '/') in the FQN
 * and insert each piece of the FQN in nested map (i.e., simple trie).
 */
function insertFqnInTrie(fqn, trie) {
    for (const fqnPart of fqn.replace(/[^a-z0-9]/gi, '$& ').split(' ')) {
        const nextLevelTreeRef = trie.get(fqnPart) ?? new Trie();
        trie.set(fqnPart, nextLevelTreeRef);
        trie = nextLevelTreeRef;
    }
    return trie;
}
/**
 * Prefix-encodes a "trie-ish" structure, using '{}' to group and ',' to separate siblings.
 *
 * Example input:
 * ABC,ABD,AEF
 *
 * Example trie:
 * A --> B --> C
 *  |     \--> D
 *  \--> E --> F
 *
 * Becomes:
 * A{B{C,D},EF}
 */
function prefixEncodeTrie(trie) {
    let prefixEncoded = '';
    let isFirstEntryAtLevel = true;
    [...trie.entries()].forEach(([key, value]) => {
        if (!isFirstEntryAtLevel) {
            prefixEncoded += ',';
        }
        isFirstEntryAtLevel = false;
        prefixEncoded += key;
        if (value.size > 1) {
            prefixEncoded += '{';
            prefixEncoded += prefixEncodeTrie(value);
            prefixEncoded += '}';
        }
        else {
            prefixEncoded += prefixEncodeTrie(value);
        }
    });
    return prefixEncoded;
}
/**
 * Sets the OS flag to "unknown" in order to ensure we get consistent results across operating systems.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc1952#page-5
 *
 *   +---+---+---+---+---+---+---+---+---+---+
 *   |ID1|ID2|CM |FLG|     MTIME     |XFL|OS |
 *   +---+---+---+---+---+---+---+---+---+---+
 *   | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
 *   +---+---+---+---+---+---+---+---+---+---+
 *
 * OS (Operating System)
 * =====================
 * This identifies the type of file system on which compression
 * took place.  This may be useful in determining end-of-line
 * convention for text files.  The currently defined values are
 * as follows:
 *      0 - FAT filesystem (MS-DOS, OS/2, NT/Win32)
 *      1 - Amiga
 *      2 - VMS (or OpenVMS)
 *      3 - Unix
 *      4 - VM/CMS
 *      5 - Atari TOS
 *      6 - HPFS filesystem (OS/2, NT)
 *      7 - Macintosh
 *      8 - Z-System
 *      9 - CP/M
 *     10 - TOPS-20
 *     11 - NTFS filesystem (NT)
 *     12 - QDOS
 *     13 - Acorn RISCOS
 *    255 - unknown
 *
 * @param gzipBuffer A gzip buffer
 */
function setGzipOperatingSystemToUnknown(gzipBuffer) {
    // check that this is indeed a gzip buffer (https://datatracker.ietf.org/doc/html/rfc1952#page-6)
    if (gzipBuffer[0] !== 0x1f || gzipBuffer[1] !== 0x8b) {
        throw new Error('Expecting a gzip buffer (must start with 0x1f8b)');
    }
    gzipBuffer[9] = 255;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGEtcmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZXRhZGF0YS1yZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQWtEO0FBQ2xELDJDQUF1QztBQUN2QyxpREFBdUU7QUFDdkUsb0RBQWdEO0FBQ2hELHNDQUErQjtBQUMvQiw4Q0FBb0M7QUFDcEMsa0RBQThDO0FBQzlDLGtDQUErQjtBQUUvQixvQ0FBaUM7QUFFakM7O0dBRUc7QUFDSCxNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBQzdDLFlBQVksS0FBWSxFQUFFLEVBQVU7UUFDbEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLHFCQUFxQixHQUFHLGFBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLHdCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQztRQUM1SCxJQUFJLHFCQUFxQixFQUFFO1lBQ3pCLE1BQU0sUUFBUSxHQUFHLElBQUksMEJBQVcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO2dCQUNoRCxJQUFJLEVBQUUsb0JBQW9CO2dCQUMxQixVQUFVLEVBQUU7b0JBQ1YsU0FBUyxFQUFFLFdBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUEscUNBQXNCLEVBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO2lCQUMxRjthQUNGLENBQUMsQ0FBQztZQUVILDRGQUE0RjtZQUM1RixJQUFJLGFBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNwQyxNQUFNLFNBQVMsR0FBRyxJQUFJLDRCQUFZLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtvQkFDcEQsVUFBVSxFQUFFLGlDQUFpQyxFQUFFO2lC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YSxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQ0c7QUFDSCxTQUFTLCtCQUErQixDQUFDLFVBQWtCO0lBQ3pELGlHQUFpRztJQUNqRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNwRCxNQUFNLElBQUksS0FBSyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7S0FDckU7SUFFRCxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3RCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB6bGliIGZyb20gJ3psaWInO1xuaW1wb3J0IHsgUmVnaW9uSW5mbyB9IGZyb20gJ0Bhd3MtY2RrL3JlZ2lvbi1pbmZvJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ29uc3RydWN0SW5mbywgY29uc3RydWN0SW5mb0Zyb21TdGFjayB9IGZyb20gJy4vcnVudGltZS1pbmZvJztcbmltcG9ydCB7IENmbkNvbmRpdGlvbiB9IGZyb20gJy4uL2Nmbi1jb25kaXRpb24nO1xuaW1wb3J0IHsgRm4gfSBmcm9tICcuLi9jZm4tZm4nO1xuaW1wb3J0IHsgQXdzIH0gZnJvbSAnLi4vY2ZuLXBzZXVkbyc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSB9IGZyb20gJy4uL2Nmbi1yZXNvdXJjZSc7XG5pbXBvcnQgeyBMYXp5IH0gZnJvbSAnLi4vbGF6eSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi4vdG9rZW4nO1xuXG4vKipcbiAqIENvbnN0cnVjdCB0aGF0IHdpbGwgcmVuZGVyIHRoZSBtZXRhZGF0YSByZXNvdXJjZVxuICovXG5leHBvcnQgY2xhc3MgTWV0YWRhdGFSZXNvdXJjZSBleHRlbmRzIENvbnN0cnVjdCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBTdGFjaywgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBtZXRhZGF0YVNlcnZpY2VFeGlzdHMgPSBUb2tlbi5pc1VucmVzb2x2ZWQoc2NvcGUucmVnaW9uKSB8fCBSZWdpb25JbmZvLmdldChzY29wZS5yZWdpb24pLmNka01ldGFkYXRhUmVzb3VyY2VBdmFpbGFibGU7XG4gICAgaWYgKG1ldGFkYXRhU2VydmljZUV4aXN0cykge1xuICAgICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2UodGhpcywgJ0RlZmF1bHQnLCB7XG4gICAgICAgIHR5cGU6ICdBV1M6OkNESzo6TWV0YWRhdGEnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgQW5hbHl0aWNzOiBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IGZvcm1hdEFuYWx5dGljcyhjb25zdHJ1Y3RJbmZvRnJvbVN0YWNrKHNjb3BlKSkgfSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gSW4gY2FzZSB3ZSBkb24ndCBhY3R1YWxseSBrbm93IHRoZSByZWdpb24sIGFkZCBhIGNvbmRpdGlvbiB0byBkZXRlcm1pbmUgaXQgYXQgZGVwbG95IHRpbWVcbiAgICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQoc2NvcGUucmVnaW9uKSkge1xuICAgICAgICBjb25zdCBjb25kaXRpb24gPSBuZXcgQ2ZuQ29uZGl0aW9uKHRoaXMsICdDb25kaXRpb24nLCB7XG4gICAgICAgICAgZXhwcmVzc2lvbjogbWFrZUNka01ldGFkYXRhQXZhaWxhYmxlQ29uZGl0aW9uKCksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRvIG5vdCBjYXVzZSB1bmR1ZSB0ZW1wbGF0ZSBjaGFuZ2VzXG4gICAgICAgIGNvbmRpdGlvbi5vdmVycmlkZUxvZ2ljYWxJZCgnQ0RLTWV0YWRhdGFBdmFpbGFibGUnKTtcblxuICAgICAgICByZXNvdXJjZS5jZm5PcHRpb25zLmNvbmRpdGlvbiA9IGNvbmRpdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFrZUNka01ldGFkYXRhQXZhaWxhYmxlQ29uZGl0aW9uKCkge1xuICByZXR1cm4gRm4uY29uZGl0aW9uT3IoLi4uUmVnaW9uSW5mby5yZWdpb25zXG4gICAgLmZpbHRlcihyaSA9PiByaS5jZGtNZXRhZGF0YVJlc291cmNlQXZhaWxhYmxlKVxuICAgIC5tYXAocmkgPT4gRm4uY29uZGl0aW9uRXF1YWxzKEF3cy5SRUdJT04sIHJpLm5hbWUpKSk7XG59XG5cbi8qKiBDb252ZW5pZW5jZSB0eXBlIGZvciBhcmJpdHJhcmlseS1uZXN0ZWQgbWFwICovXG5jbGFzcyBUcmllIGV4dGVuZHMgTWFwPHN0cmluZywgVHJpZT4geyB9XG5cbi8qKlxuICogRm9ybWF0cyBhIGxpc3Qgb2YgY29uc3RydWN0IGZ1bGx5LXF1YWxpZmllZCBuYW1lcyAoRlFOcykgYW5kIHZlcnNpb25zIGludG8gYSAocG9zc2libHkgY29tcHJlc3NlZCkgcHJlZml4LWVuY29kZWQgc3RyaW5nLlxuICpcbiAqIFRoZSBsaXN0IG9mIENvbnN0cnVjdEluZm9zIGlzIGxvZ2ljYWxseSBmb3JtYXR0ZWQgaW50bzpcbiAqICR7dmVyc2lvbn0hJHtmcW59IChlLmcuLCBcIjEuOTAuMCFhd3MtY2RrLWxpYi5TdGFja1wiKVxuICogYW5kIHRoZW4gYWxsIG9mIHRoZSBjb25zdHJ1Y3QtdmVyc2lvbnMgYXJlIGdyb3VwZWQgd2l0aCBjb21tb24gcHJlZml4ZXMgdG9nZXRoZXIsIGdyb3VwaW5nIGNvbW1vbiBwYXJ0cyBpbiAne30nIGFuZCBzZXBhcmF0aW5nIGl0ZW1zIHdpdGggJywnLlxuICpcbiAqIEV4YW1wbGU6XG4gKiBbMS45MC4wIWF3cy1jZGstbGliLlN0YWNrLCAxLjkwLjAhYXdzLWNkay1saWIuQ29uc3RydWN0LCAxLjkwLjAhYXdzLWNkay1saWIuc2VydmljZS5SZXNvdXJjZSwgMC40Mi4xIWF3cy1jZGstbGliLWV4cGVyaW1lbnRzLk5ld1N0dWZmXVxuICogQmVjb21lczpcbiAqIDEuOTAuMCFhd3MtY2RrLWxpYi57U3RhY2ssQ29uc3RydWN0LHNlcnZpY2UuUmVzb3VyY2V9LDAuNDIuMSFhd3MtY2RrLWxpYi1leHBlcmltZW50cy5OZXdTdHVmZlxuICpcbiAqIFRoZSB3aG9sZSB0aGluZyBpcyB0aGVuIGVpdGhlciBpbmNsdWRlZCBkaXJlY3RseSBhcyBwbGFpbnRleHQgYXM6XG4gKiB2MjpwbGFpbnRleHQ6e3ByZWZpeEVuY29kZWRMaXN0fVxuICogT3IgaXMgY29tcHJlc3NlZCBhbmQgYmFzZTY0LWVuY29kZWQsIGFuZCB0aGVuIGZvcm1hdHRlZCBhczpcbiAqIHYyOmRlZmxhdGU2NDp7cHJlZml4RW5jb2RlZExpc3RDb21wcmVzc2VkQW5kRW5jb2RlZH1cbiAqXG4gKiBFeHBvcnRlZC92aXNpYmxlIGZvciBlYXNlIG9mIHRlc3RpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRBbmFseXRpY3MoaW5mb3M6IENvbnN0cnVjdEluZm9bXSkge1xuICBjb25zdCB0cmllID0gbmV3IFRyaWUoKTtcbiAgaW5mb3MuZm9yRWFjaChpbmZvID0+IGluc2VydEZxbkluVHJpZShgJHtpbmZvLnZlcnNpb259ISR7aW5mby5mcW59YCwgdHJpZSkpO1xuXG4gIGNvbnN0IHBsYWludGV4dEVuY29kZWRDb25zdHJ1Y3RzID0gcHJlZml4RW5jb2RlVHJpZSh0cmllKTtcbiAgY29uc3QgY29tcHJlc3NlZENvbnN0cnVjdHNCdWZmZXIgPSB6bGliLmd6aXBTeW5jKEJ1ZmZlci5mcm9tKHBsYWludGV4dEVuY29kZWRDb25zdHJ1Y3RzKSk7XG5cbiAgLy8gc2V0IE9TIGZsYWcgdG8gXCJ1bmtub3duXCIgaW4gb3JkZXIgdG8gZW5zdXJlIHdlIGdldCBjb25zaXN0ZW50IHJlc3VsdHMgYWNyb3NzIG9wZXJhdGluZyBzeXN0ZW1zXG4gIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvaXNzdWVzLzE1MzIyXG4gIHNldEd6aXBPcGVyYXRpbmdTeXN0ZW1Ub1Vua25vd24oY29tcHJlc3NlZENvbnN0cnVjdHNCdWZmZXIpO1xuXG4gIGNvbnN0IGNvbXByZXNzZWRDb25zdHJ1Y3RzID0gY29tcHJlc3NlZENvbnN0cnVjdHNCdWZmZXIudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICByZXR1cm4gYHYyOmRlZmxhdGU2NDoke2NvbXByZXNzZWRDb25zdHJ1Y3RzfWA7XG59XG5cbi8qKlxuICogU3BsaXRzIGFmdGVyIG5vbi1hbHBoYW51bWVyaWMgY2hhcmFjdGVycyAoZS5nLiwgJy4nLCAnLycpIGluIHRoZSBGUU5cbiAqIGFuZCBpbnNlcnQgZWFjaCBwaWVjZSBvZiB0aGUgRlFOIGluIG5lc3RlZCBtYXAgKGkuZS4sIHNpbXBsZSB0cmllKS5cbiAqL1xuZnVuY3Rpb24gaW5zZXJ0RnFuSW5UcmllKGZxbjogc3RyaW5nLCB0cmllOiBUcmllKSB7XG4gIGZvciAoY29uc3QgZnFuUGFydCBvZiBmcW4ucmVwbGFjZSgvW15hLXowLTldL2dpLCAnJCYgJykuc3BsaXQoJyAnKSkge1xuICAgIGNvbnN0IG5leHRMZXZlbFRyZWVSZWYgPSB0cmllLmdldChmcW5QYXJ0KSA/PyBuZXcgVHJpZSgpO1xuICAgIHRyaWUuc2V0KGZxblBhcnQsIG5leHRMZXZlbFRyZWVSZWYpO1xuICAgIHRyaWUgPSBuZXh0TGV2ZWxUcmVlUmVmO1xuICB9XG4gIHJldHVybiB0cmllO1xufVxuXG4vKipcbiAqIFByZWZpeC1lbmNvZGVzIGEgXCJ0cmllLWlzaFwiIHN0cnVjdHVyZSwgdXNpbmcgJ3t9JyB0byBncm91cCBhbmQgJywnIHRvIHNlcGFyYXRlIHNpYmxpbmdzLlxuICpcbiAqIEV4YW1wbGUgaW5wdXQ6XG4gKiBBQkMsQUJELEFFRlxuICpcbiAqIEV4YW1wbGUgdHJpZTpcbiAqIEEgLS0+IEIgLS0+IENcbiAqICB8ICAgICBcXC0tPiBEXG4gKiAgXFwtLT4gRSAtLT4gRlxuICpcbiAqIEJlY29tZXM6XG4gKiBBe0J7QyxEfSxFRn1cbiAqL1xuZnVuY3Rpb24gcHJlZml4RW5jb2RlVHJpZSh0cmllOiBUcmllKSB7XG4gIGxldCBwcmVmaXhFbmNvZGVkID0gJyc7XG4gIGxldCBpc0ZpcnN0RW50cnlBdExldmVsID0gdHJ1ZTtcbiAgWy4uLnRyaWUuZW50cmllcygpXS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICBpZiAoIWlzRmlyc3RFbnRyeUF0TGV2ZWwpIHtcbiAgICAgIHByZWZpeEVuY29kZWQgKz0gJywnO1xuICAgIH1cbiAgICBpc0ZpcnN0RW50cnlBdExldmVsID0gZmFsc2U7XG4gICAgcHJlZml4RW5jb2RlZCArPSBrZXk7XG4gICAgaWYgKHZhbHVlLnNpemUgPiAxKSB7XG4gICAgICBwcmVmaXhFbmNvZGVkICs9ICd7JztcbiAgICAgIHByZWZpeEVuY29kZWQgKz0gcHJlZml4RW5jb2RlVHJpZSh2YWx1ZSk7XG4gICAgICBwcmVmaXhFbmNvZGVkICs9ICd9JztcbiAgICB9IGVsc2Uge1xuICAgICAgcHJlZml4RW5jb2RlZCArPSBwcmVmaXhFbmNvZGVUcmllKHZhbHVlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcHJlZml4RW5jb2RlZDtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBPUyBmbGFnIHRvIFwidW5rbm93blwiIGluIG9yZGVyIHRvIGVuc3VyZSB3ZSBnZXQgY29uc2lzdGVudCByZXN1bHRzIGFjcm9zcyBvcGVyYXRpbmcgc3lzdGVtcy5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZGF0YXRyYWNrZXIuaWV0Zi5vcmcvZG9jL2h0bWwvcmZjMTk1MiNwYWdlLTVcbiAqXG4gKiAgICstLS0rLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rXG4gKiAgIHxJRDF8SUQyfENNIHxGTEd8ICAgICBNVElNRSAgICAgfFhGTHxPUyB8XG4gKiAgICstLS0rLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rXG4gKiAgIHwgMCB8IDEgfCAyIHwgMyB8IDQgfCA1IHwgNiB8IDcgfCA4IHwgOSB8XG4gKiAgICstLS0rLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rXG4gKlxuICogT1MgKE9wZXJhdGluZyBTeXN0ZW0pXG4gKiA9PT09PT09PT09PT09PT09PT09PT1cbiAqIFRoaXMgaWRlbnRpZmllcyB0aGUgdHlwZSBvZiBmaWxlIHN5c3RlbSBvbiB3aGljaCBjb21wcmVzc2lvblxuICogdG9vayBwbGFjZS4gIFRoaXMgbWF5IGJlIHVzZWZ1bCBpbiBkZXRlcm1pbmluZyBlbmQtb2YtbGluZVxuICogY29udmVudGlvbiBmb3IgdGV4dCBmaWxlcy4gIFRoZSBjdXJyZW50bHkgZGVmaW5lZCB2YWx1ZXMgYXJlXG4gKiBhcyBmb2xsb3dzOlxuICogICAgICAwIC0gRkFUIGZpbGVzeXN0ZW0gKE1TLURPUywgT1MvMiwgTlQvV2luMzIpXG4gKiAgICAgIDEgLSBBbWlnYVxuICogICAgICAyIC0gVk1TIChvciBPcGVuVk1TKVxuICogICAgICAzIC0gVW5peFxuICogICAgICA0IC0gVk0vQ01TXG4gKiAgICAgIDUgLSBBdGFyaSBUT1NcbiAqICAgICAgNiAtIEhQRlMgZmlsZXN5c3RlbSAoT1MvMiwgTlQpXG4gKiAgICAgIDcgLSBNYWNpbnRvc2hcbiAqICAgICAgOCAtIFotU3lzdGVtXG4gKiAgICAgIDkgLSBDUC9NXG4gKiAgICAgMTAgLSBUT1BTLTIwXG4gKiAgICAgMTEgLSBOVEZTIGZpbGVzeXN0ZW0gKE5UKVxuICogICAgIDEyIC0gUURPU1xuICogICAgIDEzIC0gQWNvcm4gUklTQ09TXG4gKiAgICAyNTUgLSB1bmtub3duXG4gKlxuICogQHBhcmFtIGd6aXBCdWZmZXIgQSBnemlwIGJ1ZmZlclxuICovXG5mdW5jdGlvbiBzZXRHemlwT3BlcmF0aW5nU3lzdGVtVG9Vbmtub3duKGd6aXBCdWZmZXI6IEJ1ZmZlcikge1xuICAvLyBjaGVjayB0aGF0IHRoaXMgaXMgaW5kZWVkIGEgZ3ppcCBidWZmZXIgKGh0dHBzOi8vZGF0YXRyYWNrZXIuaWV0Zi5vcmcvZG9jL2h0bWwvcmZjMTk1MiNwYWdlLTYpXG4gIGlmIChnemlwQnVmZmVyWzBdICE9PSAweDFmIHx8IGd6aXBCdWZmZXJbMV0gIT09IDB4OGIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGluZyBhIGd6aXAgYnVmZmVyIChtdXN0IHN0YXJ0IHdpdGggMHgxZjhiKScpO1xuICB9XG5cbiAgZ3ppcEJ1ZmZlcls5XSA9IDI1NTtcbn0iXX0=