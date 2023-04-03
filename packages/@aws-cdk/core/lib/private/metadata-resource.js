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
                    Analytics: lazy_1.Lazy.string({ produce: () => formatAnalytics(runtime_info_1.constructInfoFromStack(scope)) }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGEtcmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZXRhZGF0YS1yZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQWtEO0FBQ2xELDJDQUF1QztBQUN2QyxpREFBdUU7QUFDdkUsb0RBQWdEO0FBQ2hELHNDQUErQjtBQUMvQiw4Q0FBb0M7QUFDcEMsa0RBQThDO0FBQzlDLGtDQUErQjtBQUUvQixvQ0FBaUM7QUFFakM7O0dBRUc7QUFDSCxNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBQzdDLFlBQVksS0FBWSxFQUFFLEVBQVU7UUFDbEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLHFCQUFxQixHQUFHLGFBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLHdCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQztRQUM1SCxJQUFJLHFCQUFxQixFQUFFO1lBQ3pCLE1BQU0sUUFBUSxHQUFHLElBQUksMEJBQVcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO2dCQUNoRCxJQUFJLEVBQUUsb0JBQW9CO2dCQUMxQixVQUFVLEVBQUU7b0JBQ1YsU0FBUyxFQUFFLFdBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLHFDQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztpQkFDMUY7YUFDRixDQUFDLENBQUM7WUFFSCw0RkFBNEY7WUFDNUYsSUFBSSxhQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDcEMsTUFBTSxTQUFTLEdBQUcsSUFBSSw0QkFBWSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7b0JBQ3BELFVBQVUsRUFBRSxpQ0FBaUMsRUFBRTtpQkFDaEQs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SSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMxQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0NHO0FBQ0gsU0FBUywrQkFBK0IsQ0FBQyxVQUFrQjtJQUN6RCxpR0FBaUc7SUFDakcsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDcEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0tBQ3JFO0lBRUQsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUN0QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgemxpYiBmcm9tICd6bGliJztcbmltcG9ydCB7IFJlZ2lvbkluZm8gfSBmcm9tICdAYXdzLWNkay9yZWdpb24taW5mbyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENvbnN0cnVjdEluZm8sIGNvbnN0cnVjdEluZm9Gcm9tU3RhY2sgfSBmcm9tICcuL3J1bnRpbWUtaW5mbyc7XG5pbXBvcnQgeyBDZm5Db25kaXRpb24gfSBmcm9tICcuLi9jZm4tY29uZGl0aW9uJztcbmltcG9ydCB7IEZuIH0gZnJvbSAnLi4vY2ZuLWZuJztcbmltcG9ydCB7IEF3cyB9IGZyb20gJy4uL2Nmbi1wc2V1ZG8nO1xuaW1wb3J0IHsgQ2ZuUmVzb3VyY2UgfSBmcm9tICcuLi9jZm4tcmVzb3VyY2UnO1xuaW1wb3J0IHsgTGF6eSB9IGZyb20gJy4uL2xhenknO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuLi9zdGFjayc7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gJy4uL3Rva2VuJztcblxuLyoqXG4gKiBDb25zdHJ1Y3QgdGhhdCB3aWxsIHJlbmRlciB0aGUgbWV0YWRhdGEgcmVzb3VyY2VcbiAqL1xuZXhwb3J0IGNsYXNzIE1ldGFkYXRhUmVzb3VyY2UgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcihzY29wZTogU3RhY2ssIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgbWV0YWRhdGFTZXJ2aWNlRXhpc3RzID0gVG9rZW4uaXNVbnJlc29sdmVkKHNjb3BlLnJlZ2lvbikgfHwgUmVnaW9uSW5mby5nZXQoc2NvcGUucmVnaW9uKS5jZGtNZXRhZGF0YVJlc291cmNlQXZhaWxhYmxlO1xuICAgIGlmIChtZXRhZGF0YVNlcnZpY2VFeGlzdHMpIHtcbiAgICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblJlc291cmNlKHRoaXMsICdEZWZhdWx0Jywge1xuICAgICAgICB0eXBlOiAnQVdTOjpDREs6Ok1ldGFkYXRhJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIEFuYWx5dGljczogTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiBmb3JtYXRBbmFseXRpY3MoY29uc3RydWN0SW5mb0Zyb21TdGFjayhzY29wZSkpIH0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIEluIGNhc2Ugd2UgZG9uJ3QgYWN0dWFsbHkga25vdyB0aGUgcmVnaW9uLCBhZGQgYSBjb25kaXRpb24gdG8gZGV0ZXJtaW5lIGl0IGF0IGRlcGxveSB0aW1lXG4gICAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHNjb3BlLnJlZ2lvbikpIHtcbiAgICAgICAgY29uc3QgY29uZGl0aW9uID0gbmV3IENmbkNvbmRpdGlvbih0aGlzLCAnQ29uZGl0aW9uJywge1xuICAgICAgICAgIGV4cHJlc3Npb246IG1ha2VDZGtNZXRhZGF0YUF2YWlsYWJsZUNvbmRpdGlvbigpLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUbyBub3QgY2F1c2UgdW5kdWUgdGVtcGxhdGUgY2hhbmdlc1xuICAgICAgICBjb25kaXRpb24ub3ZlcnJpZGVMb2dpY2FsSWQoJ0NES01ldGFkYXRhQXZhaWxhYmxlJyk7XG5cbiAgICAgICAgcmVzb3VyY2UuY2ZuT3B0aW9ucy5jb25kaXRpb24gPSBjb25kaXRpb247XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1ha2VDZGtNZXRhZGF0YUF2YWlsYWJsZUNvbmRpdGlvbigpIHtcbiAgcmV0dXJuIEZuLmNvbmRpdGlvbk9yKC4uLlJlZ2lvbkluZm8ucmVnaW9uc1xuICAgIC5maWx0ZXIocmkgPT4gcmkuY2RrTWV0YWRhdGFSZXNvdXJjZUF2YWlsYWJsZSlcbiAgICAubWFwKHJpID0+IEZuLmNvbmRpdGlvbkVxdWFscyhBd3MuUkVHSU9OLCByaS5uYW1lKSkpO1xufVxuXG4vKiogQ29udmVuaWVuY2UgdHlwZSBmb3IgYXJiaXRyYXJpbHktbmVzdGVkIG1hcCAqL1xuY2xhc3MgVHJpZSBleHRlbmRzIE1hcDxzdHJpbmcsIFRyaWU+IHsgfVxuXG4vKipcbiAqIEZvcm1hdHMgYSBsaXN0IG9mIGNvbnN0cnVjdCBmdWxseS1xdWFsaWZpZWQgbmFtZXMgKEZRTnMpIGFuZCB2ZXJzaW9ucyBpbnRvIGEgKHBvc3NpYmx5IGNvbXByZXNzZWQpIHByZWZpeC1lbmNvZGVkIHN0cmluZy5cbiAqXG4gKiBUaGUgbGlzdCBvZiBDb25zdHJ1Y3RJbmZvcyBpcyBsb2dpY2FsbHkgZm9ybWF0dGVkIGludG86XG4gKiAke3ZlcnNpb259ISR7ZnFufSAoZS5nLiwgXCIxLjkwLjAhYXdzLWNkay1saWIuU3RhY2tcIilcbiAqIGFuZCB0aGVuIGFsbCBvZiB0aGUgY29uc3RydWN0LXZlcnNpb25zIGFyZSBncm91cGVkIHdpdGggY29tbW9uIHByZWZpeGVzIHRvZ2V0aGVyLCBncm91cGluZyBjb21tb24gcGFydHMgaW4gJ3t9JyBhbmQgc2VwYXJhdGluZyBpdGVtcyB3aXRoICcsJy5cbiAqXG4gKiBFeGFtcGxlOlxuICogWzEuOTAuMCFhd3MtY2RrLWxpYi5TdGFjaywgMS45MC4wIWF3cy1jZGstbGliLkNvbnN0cnVjdCwgMS45MC4wIWF3cy1jZGstbGliLnNlcnZpY2UuUmVzb3VyY2UsIDAuNDIuMSFhd3MtY2RrLWxpYi1leHBlcmltZW50cy5OZXdTdHVmZl1cbiAqIEJlY29tZXM6XG4gKiAxLjkwLjAhYXdzLWNkay1saWIue1N0YWNrLENvbnN0cnVjdCxzZXJ2aWNlLlJlc291cmNlfSwwLjQyLjEhYXdzLWNkay1saWItZXhwZXJpbWVudHMuTmV3U3R1ZmZcbiAqXG4gKiBUaGUgd2hvbGUgdGhpbmcgaXMgdGhlbiBlaXRoZXIgaW5jbHVkZWQgZGlyZWN0bHkgYXMgcGxhaW50ZXh0IGFzOlxuICogdjI6cGxhaW50ZXh0OntwcmVmaXhFbmNvZGVkTGlzdH1cbiAqIE9yIGlzIGNvbXByZXNzZWQgYW5kIGJhc2U2NC1lbmNvZGVkLCBhbmQgdGhlbiBmb3JtYXR0ZWQgYXM6XG4gKiB2MjpkZWZsYXRlNjQ6e3ByZWZpeEVuY29kZWRMaXN0Q29tcHJlc3NlZEFuZEVuY29kZWR9XG4gKlxuICogRXhwb3J0ZWQvdmlzaWJsZSBmb3IgZWFzZSBvZiB0ZXN0aW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0QW5hbHl0aWNzKGluZm9zOiBDb25zdHJ1Y3RJbmZvW10pIHtcbiAgY29uc3QgdHJpZSA9IG5ldyBUcmllKCk7XG4gIGluZm9zLmZvckVhY2goaW5mbyA9PiBpbnNlcnRGcW5JblRyaWUoYCR7aW5mby52ZXJzaW9ufSEke2luZm8uZnFufWAsIHRyaWUpKTtcblxuICBjb25zdCBwbGFpbnRleHRFbmNvZGVkQ29uc3RydWN0cyA9IHByZWZpeEVuY29kZVRyaWUodHJpZSk7XG4gIGNvbnN0IGNvbXByZXNzZWRDb25zdHJ1Y3RzQnVmZmVyID0gemxpYi5nemlwU3luYyhCdWZmZXIuZnJvbShwbGFpbnRleHRFbmNvZGVkQ29uc3RydWN0cykpO1xuXG4gIC8vIHNldCBPUyBmbGFnIHRvIFwidW5rbm93blwiIGluIG9yZGVyIHRvIGVuc3VyZSB3ZSBnZXQgY29uc2lzdGVudCByZXN1bHRzIGFjcm9zcyBvcGVyYXRpbmcgc3lzdGVtc1xuICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy8xNTMyMlxuICBzZXRHemlwT3BlcmF0aW5nU3lzdGVtVG9Vbmtub3duKGNvbXByZXNzZWRDb25zdHJ1Y3RzQnVmZmVyKTtcblxuICBjb25zdCBjb21wcmVzc2VkQ29uc3RydWN0cyA9IGNvbXByZXNzZWRDb25zdHJ1Y3RzQnVmZmVyLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgcmV0dXJuIGB2MjpkZWZsYXRlNjQ6JHtjb21wcmVzc2VkQ29uc3RydWN0c31gO1xufVxuXG4vKipcbiAqIFNwbGl0cyBhZnRlciBub24tYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgKGUuZy4sICcuJywgJy8nKSBpbiB0aGUgRlFOXG4gKiBhbmQgaW5zZXJ0IGVhY2ggcGllY2Ugb2YgdGhlIEZRTiBpbiBuZXN0ZWQgbWFwIChpLmUuLCBzaW1wbGUgdHJpZSkuXG4gKi9cbmZ1bmN0aW9uIGluc2VydEZxbkluVHJpZShmcW46IHN0cmluZywgdHJpZTogVHJpZSkge1xuICBmb3IgKGNvbnN0IGZxblBhcnQgb2YgZnFuLnJlcGxhY2UoL1teYS16MC05XS9naSwgJyQmICcpLnNwbGl0KCcgJykpIHtcbiAgICBjb25zdCBuZXh0TGV2ZWxUcmVlUmVmID0gdHJpZS5nZXQoZnFuUGFydCkgPz8gbmV3IFRyaWUoKTtcbiAgICB0cmllLnNldChmcW5QYXJ0LCBuZXh0TGV2ZWxUcmVlUmVmKTtcbiAgICB0cmllID0gbmV4dExldmVsVHJlZVJlZjtcbiAgfVxuICByZXR1cm4gdHJpZTtcbn1cblxuLyoqXG4gKiBQcmVmaXgtZW5jb2RlcyBhIFwidHJpZS1pc2hcIiBzdHJ1Y3R1cmUsIHVzaW5nICd7fScgdG8gZ3JvdXAgYW5kICcsJyB0byBzZXBhcmF0ZSBzaWJsaW5ncy5cbiAqXG4gKiBFeGFtcGxlIGlucHV0OlxuICogQUJDLEFCRCxBRUZcbiAqXG4gKiBFeGFtcGxlIHRyaWU6XG4gKiBBIC0tPiBCIC0tPiBDXG4gKiAgfCAgICAgXFwtLT4gRFxuICogIFxcLS0+IEUgLS0+IEZcbiAqXG4gKiBCZWNvbWVzOlxuICogQXtCe0MsRH0sRUZ9XG4gKi9cbmZ1bmN0aW9uIHByZWZpeEVuY29kZVRyaWUodHJpZTogVHJpZSkge1xuICBsZXQgcHJlZml4RW5jb2RlZCA9ICcnO1xuICBsZXQgaXNGaXJzdEVudHJ5QXRMZXZlbCA9IHRydWU7XG4gIFsuLi50cmllLmVudHJpZXMoKV0uZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgaWYgKCFpc0ZpcnN0RW50cnlBdExldmVsKSB7XG4gICAgICBwcmVmaXhFbmNvZGVkICs9ICcsJztcbiAgICB9XG4gICAgaXNGaXJzdEVudHJ5QXRMZXZlbCA9IGZhbHNlO1xuICAgIHByZWZpeEVuY29kZWQgKz0ga2V5O1xuICAgIGlmICh2YWx1ZS5zaXplID4gMSkge1xuICAgICAgcHJlZml4RW5jb2RlZCArPSAneyc7XG4gICAgICBwcmVmaXhFbmNvZGVkICs9IHByZWZpeEVuY29kZVRyaWUodmFsdWUpO1xuICAgICAgcHJlZml4RW5jb2RlZCArPSAnfSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZWZpeEVuY29kZWQgKz0gcHJlZml4RW5jb2RlVHJpZSh2YWx1ZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHByZWZpeEVuY29kZWQ7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgT1MgZmxhZyB0byBcInVua25vd25cIiBpbiBvcmRlciB0byBlbnN1cmUgd2UgZ2V0IGNvbnNpc3RlbnQgcmVzdWx0cyBhY3Jvc3Mgb3BlcmF0aW5nIHN5c3RlbXMuXG4gKlxuICogQHNlZSBodHRwczovL2RhdGF0cmFja2VyLmlldGYub3JnL2RvYy9odG1sL3JmYzE5NTIjcGFnZS01XG4gKlxuICogICArLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tK1xuICogICB8SUQxfElEMnxDTSB8RkxHfCAgICAgTVRJTUUgICAgIHxYRkx8T1MgfFxuICogICArLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tK1xuICogICB8IDAgfCAxIHwgMiB8IDMgfCA0IHwgNSB8IDYgfCA3IHwgOCB8IDkgfFxuICogICArLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tK1xuICpcbiAqIE9TIChPcGVyYXRpbmcgU3lzdGVtKVxuICogPT09PT09PT09PT09PT09PT09PT09XG4gKiBUaGlzIGlkZW50aWZpZXMgdGhlIHR5cGUgb2YgZmlsZSBzeXN0ZW0gb24gd2hpY2ggY29tcHJlc3Npb25cbiAqIHRvb2sgcGxhY2UuICBUaGlzIG1heSBiZSB1c2VmdWwgaW4gZGV0ZXJtaW5pbmcgZW5kLW9mLWxpbmVcbiAqIGNvbnZlbnRpb24gZm9yIHRleHQgZmlsZXMuICBUaGUgY3VycmVudGx5IGRlZmluZWQgdmFsdWVzIGFyZVxuICogYXMgZm9sbG93czpcbiAqICAgICAgMCAtIEZBVCBmaWxlc3lzdGVtIChNUy1ET1MsIE9TLzIsIE5UL1dpbjMyKVxuICogICAgICAxIC0gQW1pZ2FcbiAqICAgICAgMiAtIFZNUyAob3IgT3BlblZNUylcbiAqICAgICAgMyAtIFVuaXhcbiAqICAgICAgNCAtIFZNL0NNU1xuICogICAgICA1IC0gQXRhcmkgVE9TXG4gKiAgICAgIDYgLSBIUEZTIGZpbGVzeXN0ZW0gKE9TLzIsIE5UKVxuICogICAgICA3IC0gTWFjaW50b3NoXG4gKiAgICAgIDggLSBaLVN5c3RlbVxuICogICAgICA5IC0gQ1AvTVxuICogICAgIDEwIC0gVE9QUy0yMFxuICogICAgIDExIC0gTlRGUyBmaWxlc3lzdGVtIChOVClcbiAqICAgICAxMiAtIFFET1NcbiAqICAgICAxMyAtIEFjb3JuIFJJU0NPU1xuICogICAgMjU1IC0gdW5rbm93blxuICpcbiAqIEBwYXJhbSBnemlwQnVmZmVyIEEgZ3ppcCBidWZmZXJcbiAqL1xuZnVuY3Rpb24gc2V0R3ppcE9wZXJhdGluZ1N5c3RlbVRvVW5rbm93bihnemlwQnVmZmVyOiBCdWZmZXIpIHtcbiAgLy8gY2hlY2sgdGhhdCB0aGlzIGlzIGluZGVlZCBhIGd6aXAgYnVmZmVyIChodHRwczovL2RhdGF0cmFja2VyLmlldGYub3JnL2RvYy9odG1sL3JmYzE5NTIjcGFnZS02KVxuICBpZiAoZ3ppcEJ1ZmZlclswXSAhPT0gMHgxZiB8fCBnemlwQnVmZmVyWzFdICE9PSAweDhiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RpbmcgYSBnemlwIGJ1ZmZlciAobXVzdCBzdGFydCB3aXRoIDB4MWY4YiknKTtcbiAgfVxuXG4gIGd6aXBCdWZmZXJbOV0gPSAyNTU7XG59Il19