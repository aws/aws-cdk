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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGEtcmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZXRhZGF0YS1yZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0Isc0RBQWtEO0FBQ2xELDJDQUF1QztBQUN2QyxpREFBdUU7QUFDdkUsb0RBQWdEO0FBQ2hELHNDQUErQjtBQUMvQiw4Q0FBb0M7QUFDcEMsa0RBQThDO0FBQzlDLGtDQUErQjtBQUUvQixvQ0FBaUM7QUFFakM7O0dBRUc7QUFDSCxNQUFhLGdCQUFpQixTQUFRLHNCQUFTO0lBQzdDLFlBQVksS0FBWSxFQUFFLEVBQVU7UUFDbEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLHFCQUFxQixHQUFHLGFBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLHdCQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQztRQUM1SCxJQUFJLHFCQUFxQixFQUFFO1lBQ3pCLE1BQU0sUUFBUSxHQUFHLElBQUksMEJBQVcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO2dCQUNoRCxJQUFJLEVBQUUsb0JBQW9CO2dCQUMxQixVQUFVLEVBQUU7b0JBQ1YsU0FBUyxFQUFFLFdBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUEscUNBQXNCLEVBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO2lCQUMxRjthQUNGLENBQUMsQ0FBQztZQUVILDRGQUE0RjtZQUM1RixJQUFJLGFBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNwQyxNQUFNLFNBQVMsR0FBRyxJQUFJLDRCQUFZLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtvQkFDcEQsVUFBVSxFQUFFLGlDQUFpQyxFQUFFO2lC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TCxhQUFhLElBQUksZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sYUFBYSxDQUFDO0FBQ3ZCLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtDRztBQUNILFNBQVMsK0JBQStCLENBQUMsVUFBa0I7SUFDekQsaUdBQWlHO0lBQ2pHLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3BELE1BQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztLQUNyRTtJQUVELFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDdEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHpsaWIgZnJvbSAnemxpYic7XG5pbXBvcnQgeyBSZWdpb25JbmZvIH0gZnJvbSAnQGF3cy1jZGsvcmVnaW9uLWluZm8nO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3RJbmZvLCBjb25zdHJ1Y3RJbmZvRnJvbVN0YWNrIH0gZnJvbSAnLi9ydW50aW1lLWluZm8nO1xuaW1wb3J0IHsgQ2ZuQ29uZGl0aW9uIH0gZnJvbSAnLi4vY2ZuLWNvbmRpdGlvbic7XG5pbXBvcnQgeyBGbiB9IGZyb20gJy4uL2Nmbi1mbic7XG5pbXBvcnQgeyBBd3MgfSBmcm9tICcuLi9jZm4tcHNldWRvJztcbmltcG9ydCB7IENmblJlc291cmNlIH0gZnJvbSAnLi4vY2ZuLXJlc291cmNlJztcbmltcG9ydCB7IExhenkgfSBmcm9tICcuLi9sYXp5JztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi4vc3RhY2snO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICcuLi90b2tlbic7XG5cbi8qKlxuICogQ29uc3RydWN0IHRoYXQgd2lsbCByZW5kZXIgdGhlIG1ldGFkYXRhIHJlc291cmNlXG4gKi9cbmV4cG9ydCBjbGFzcyBNZXRhZGF0YVJlc291cmNlIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IFN0YWNrLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IG1ldGFkYXRhU2VydmljZUV4aXN0cyA9IFRva2VuLmlzVW5yZXNvbHZlZChzY29wZS5yZWdpb24pIHx8IFJlZ2lvbkluZm8uZ2V0KHNjb3BlLnJlZ2lvbikuY2RrTWV0YWRhdGFSZXNvdXJjZUF2YWlsYWJsZTtcbiAgICBpZiAobWV0YWRhdGFTZXJ2aWNlRXhpc3RzKSB7XG4gICAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZSh0aGlzLCAnRGVmYXVsdCcsIHtcbiAgICAgICAgdHlwZTogJ0FXUzo6Q0RLOjpNZXRhZGF0YScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBBbmFseXRpY3M6IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gZm9ybWF0QW5hbHl0aWNzKGNvbnN0cnVjdEluZm9Gcm9tU3RhY2soc2NvcGUpKSB9KSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBJbiBjYXNlIHdlIGRvbid0IGFjdHVhbGx5IGtub3cgdGhlIHJlZ2lvbiwgYWRkIGEgY29uZGl0aW9uIHRvIGRldGVybWluZSBpdCBhdCBkZXBsb3kgdGltZVxuICAgICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChzY29wZS5yZWdpb24pKSB7XG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IG5ldyBDZm5Db25kaXRpb24odGhpcywgJ0NvbmRpdGlvbicsIHtcbiAgICAgICAgICBleHByZXNzaW9uOiBtYWtlQ2RrTWV0YWRhdGFBdmFpbGFibGVDb25kaXRpb24oKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVG8gbm90IGNhdXNlIHVuZHVlIHRlbXBsYXRlIGNoYW5nZXNcbiAgICAgICAgY29uZGl0aW9uLm92ZXJyaWRlTG9naWNhbElkKCdDREtNZXRhZGF0YUF2YWlsYWJsZScpO1xuXG4gICAgICAgIHJlc291cmNlLmNmbk9wdGlvbnMuY29uZGl0aW9uID0gY29uZGl0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtYWtlQ2RrTWV0YWRhdGFBdmFpbGFibGVDb25kaXRpb24oKSB7XG4gIHJldHVybiBGbi5jb25kaXRpb25PciguLi5SZWdpb25JbmZvLnJlZ2lvbnNcbiAgICAuZmlsdGVyKHJpID0+IHJpLmNka01ldGFkYXRhUmVzb3VyY2VBdmFpbGFibGUpXG4gICAgLm1hcChyaSA9PiBGbi5jb25kaXRpb25FcXVhbHMoQXdzLlJFR0lPTiwgcmkubmFtZSkpKTtcbn1cblxuLyoqIENvbnZlbmllbmNlIHR5cGUgZm9yIGFyYml0cmFyaWx5LW5lc3RlZCBtYXAgKi9cbmNsYXNzIFRyaWUgZXh0ZW5kcyBNYXA8c3RyaW5nLCBUcmllPiB7IH1cblxuLyoqXG4gKiBGb3JtYXRzIGEgbGlzdCBvZiBjb25zdHJ1Y3QgZnVsbHktcXVhbGlmaWVkIG5hbWVzIChGUU5zKSBhbmQgdmVyc2lvbnMgaW50byBhIChwb3NzaWJseSBjb21wcmVzc2VkKSBwcmVmaXgtZW5jb2RlZCBzdHJpbmcuXG4gKlxuICogVGhlIGxpc3Qgb2YgQ29uc3RydWN0SW5mb3MgaXMgbG9naWNhbGx5IGZvcm1hdHRlZCBpbnRvOlxuICogJHt2ZXJzaW9ufSEke2Zxbn0gKGUuZy4sIFwiMS45MC4wIWF3cy1jZGstbGliLlN0YWNrXCIpXG4gKiBhbmQgdGhlbiBhbGwgb2YgdGhlIGNvbnN0cnVjdC12ZXJzaW9ucyBhcmUgZ3JvdXBlZCB3aXRoIGNvbW1vbiBwcmVmaXhlcyB0b2dldGhlciwgZ3JvdXBpbmcgY29tbW9uIHBhcnRzIGluICd7fScgYW5kIHNlcGFyYXRpbmcgaXRlbXMgd2l0aCAnLCcuXG4gKlxuICogRXhhbXBsZTpcbiAqIFsxLjkwLjAhYXdzLWNkay1saWIuU3RhY2ssIDEuOTAuMCFhd3MtY2RrLWxpYi5Db25zdHJ1Y3QsIDEuOTAuMCFhd3MtY2RrLWxpYi5zZXJ2aWNlLlJlc291cmNlLCAwLjQyLjEhYXdzLWNkay1saWItZXhwZXJpbWVudHMuTmV3U3R1ZmZdXG4gKiBCZWNvbWVzOlxuICogMS45MC4wIWF3cy1jZGstbGliLntTdGFjayxDb25zdHJ1Y3Qsc2VydmljZS5SZXNvdXJjZX0sMC40Mi4xIWF3cy1jZGstbGliLWV4cGVyaW1lbnRzLk5ld1N0dWZmXG4gKlxuICogVGhlIHdob2xlIHRoaW5nIGlzIHRoZW4gZWl0aGVyIGluY2x1ZGVkIGRpcmVjdGx5IGFzIHBsYWludGV4dCBhczpcbiAqIHYyOnBsYWludGV4dDp7cHJlZml4RW5jb2RlZExpc3R9XG4gKiBPciBpcyBjb21wcmVzc2VkIGFuZCBiYXNlNjQtZW5jb2RlZCwgYW5kIHRoZW4gZm9ybWF0dGVkIGFzOlxuICogdjI6ZGVmbGF0ZTY0OntwcmVmaXhFbmNvZGVkTGlzdENvbXByZXNzZWRBbmRFbmNvZGVkfVxuICpcbiAqIEV4cG9ydGVkL3Zpc2libGUgZm9yIGVhc2Ugb2YgdGVzdGluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEFuYWx5dGljcyhpbmZvczogQ29uc3RydWN0SW5mb1tdKSB7XG4gIGNvbnN0IHRyaWUgPSBuZXcgVHJpZSgpO1xuICBpbmZvcy5mb3JFYWNoKGluZm8gPT4gaW5zZXJ0RnFuSW5UcmllKGAke2luZm8udmVyc2lvbn0hJHtpbmZvLmZxbn1gLCB0cmllKSk7XG5cbiAgY29uc3QgcGxhaW50ZXh0RW5jb2RlZENvbnN0cnVjdHMgPSBwcmVmaXhFbmNvZGVUcmllKHRyaWUpO1xuICBjb25zdCBjb21wcmVzc2VkQ29uc3RydWN0c0J1ZmZlciA9IHpsaWIuZ3ppcFN5bmMoQnVmZmVyLmZyb20ocGxhaW50ZXh0RW5jb2RlZENvbnN0cnVjdHMpKTtcblxuICAvLyBzZXQgT1MgZmxhZyB0byBcInVua25vd25cIiBpbiBvcmRlciB0byBlbnN1cmUgd2UgZ2V0IGNvbnNpc3RlbnQgcmVzdWx0cyBhY3Jvc3Mgb3BlcmF0aW5nIHN5c3RlbXNcbiAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9pc3N1ZXMvMTUzMjJcbiAgc2V0R3ppcE9wZXJhdGluZ1N5c3RlbVRvVW5rbm93bihjb21wcmVzc2VkQ29uc3RydWN0c0J1ZmZlcik7XG5cbiAgY29uc3QgY29tcHJlc3NlZENvbnN0cnVjdHMgPSBjb21wcmVzc2VkQ29uc3RydWN0c0J1ZmZlci50b1N0cmluZygnYmFzZTY0Jyk7XG4gIHJldHVybiBgdjI6ZGVmbGF0ZTY0OiR7Y29tcHJlc3NlZENvbnN0cnVjdHN9YDtcbn1cblxuLyoqXG4gKiBTcGxpdHMgYWZ0ZXIgbm9uLWFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIChlLmcuLCAnLicsICcvJykgaW4gdGhlIEZRTlxuICogYW5kIGluc2VydCBlYWNoIHBpZWNlIG9mIHRoZSBGUU4gaW4gbmVzdGVkIG1hcCAoaS5lLiwgc2ltcGxlIHRyaWUpLlxuICovXG5mdW5jdGlvbiBpbnNlcnRGcW5JblRyaWUoZnFuOiBzdHJpbmcsIHRyaWU6IFRyaWUpIHtcbiAgZm9yIChjb25zdCBmcW5QYXJ0IG9mIGZxbi5yZXBsYWNlKC9bXmEtejAtOV0vZ2ksICckJiAnKS5zcGxpdCgnICcpKSB7XG4gICAgY29uc3QgbmV4dExldmVsVHJlZVJlZiA9IHRyaWUuZ2V0KGZxblBhcnQpID8/IG5ldyBUcmllKCk7XG4gICAgdHJpZS5zZXQoZnFuUGFydCwgbmV4dExldmVsVHJlZVJlZik7XG4gICAgdHJpZSA9IG5leHRMZXZlbFRyZWVSZWY7XG4gIH1cbiAgcmV0dXJuIHRyaWU7XG59XG5cbi8qKlxuICogUHJlZml4LWVuY29kZXMgYSBcInRyaWUtaXNoXCIgc3RydWN0dXJlLCB1c2luZyAne30nIHRvIGdyb3VwIGFuZCAnLCcgdG8gc2VwYXJhdGUgc2libGluZ3MuXG4gKlxuICogRXhhbXBsZSBpbnB1dDpcbiAqIEFCQyxBQkQsQUVGXG4gKlxuICogRXhhbXBsZSB0cmllOlxuICogQSAtLT4gQiAtLT4gQ1xuICogIHwgICAgIFxcLS0+IERcbiAqICBcXC0tPiBFIC0tPiBGXG4gKlxuICogQmVjb21lczpcbiAqIEF7QntDLER9LEVGfVxuICovXG5mdW5jdGlvbiBwcmVmaXhFbmNvZGVUcmllKHRyaWU6IFRyaWUpIHtcbiAgbGV0IHByZWZpeEVuY29kZWQgPSAnJztcbiAgbGV0IGlzRmlyc3RFbnRyeUF0TGV2ZWwgPSB0cnVlO1xuICBbLi4udHJpZS5lbnRyaWVzKCldLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgIGlmICghaXNGaXJzdEVudHJ5QXRMZXZlbCkge1xuICAgICAgcHJlZml4RW5jb2RlZCArPSAnLCc7XG4gICAgfVxuICAgIGlzRmlyc3RFbnRyeUF0TGV2ZWwgPSBmYWxzZTtcbiAgICBwcmVmaXhFbmNvZGVkICs9IGtleTtcbiAgICBpZiAodmFsdWUuc2l6ZSA+IDEpIHtcbiAgICAgIHByZWZpeEVuY29kZWQgKz0gJ3snO1xuICAgICAgcHJlZml4RW5jb2RlZCArPSBwcmVmaXhFbmNvZGVUcmllKHZhbHVlKTtcbiAgICAgIHByZWZpeEVuY29kZWQgKz0gJ30nO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmVmaXhFbmNvZGVkICs9IHByZWZpeEVuY29kZVRyaWUodmFsdWUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBwcmVmaXhFbmNvZGVkO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIE9TIGZsYWcgdG8gXCJ1bmtub3duXCIgaW4gb3JkZXIgdG8gZW5zdXJlIHdlIGdldCBjb25zaXN0ZW50IHJlc3VsdHMgYWNyb3NzIG9wZXJhdGluZyBzeXN0ZW1zLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kYXRhdHJhY2tlci5pZXRmLm9yZy9kb2MvaHRtbC9yZmMxOTUyI3BhZ2UtNVxuICpcbiAqICAgKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tKy0tLStcbiAqICAgfElEMXxJRDJ8Q00gfEZMR3wgICAgIE1USU1FICAgICB8WEZMfE9TIHxcbiAqICAgKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tKy0tLStcbiAqICAgfCAwIHwgMSB8IDIgfCAzIHwgNCB8IDUgfCA2IHwgNyB8IDggfCA5IHxcbiAqICAgKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tKy0tLSstLS0rLS0tKy0tLStcbiAqXG4gKiBPUyAoT3BlcmF0aW5nIFN5c3RlbSlcbiAqID09PT09PT09PT09PT09PT09PT09PVxuICogVGhpcyBpZGVudGlmaWVzIHRoZSB0eXBlIG9mIGZpbGUgc3lzdGVtIG9uIHdoaWNoIGNvbXByZXNzaW9uXG4gKiB0b29rIHBsYWNlLiAgVGhpcyBtYXkgYmUgdXNlZnVsIGluIGRldGVybWluaW5nIGVuZC1vZi1saW5lXG4gKiBjb252ZW50aW9uIGZvciB0ZXh0IGZpbGVzLiAgVGhlIGN1cnJlbnRseSBkZWZpbmVkIHZhbHVlcyBhcmVcbiAqIGFzIGZvbGxvd3M6XG4gKiAgICAgIDAgLSBGQVQgZmlsZXN5c3RlbSAoTVMtRE9TLCBPUy8yLCBOVC9XaW4zMilcbiAqICAgICAgMSAtIEFtaWdhXG4gKiAgICAgIDIgLSBWTVMgKG9yIE9wZW5WTVMpXG4gKiAgICAgIDMgLSBVbml4XG4gKiAgICAgIDQgLSBWTS9DTVNcbiAqICAgICAgNSAtIEF0YXJpIFRPU1xuICogICAgICA2IC0gSFBGUyBmaWxlc3lzdGVtIChPUy8yLCBOVClcbiAqICAgICAgNyAtIE1hY2ludG9zaFxuICogICAgICA4IC0gWi1TeXN0ZW1cbiAqICAgICAgOSAtIENQL01cbiAqICAgICAxMCAtIFRPUFMtMjBcbiAqICAgICAxMSAtIE5URlMgZmlsZXN5c3RlbSAoTlQpXG4gKiAgICAgMTIgLSBRRE9TXG4gKiAgICAgMTMgLSBBY29ybiBSSVNDT1NcbiAqICAgIDI1NSAtIHVua25vd25cbiAqXG4gKiBAcGFyYW0gZ3ppcEJ1ZmZlciBBIGd6aXAgYnVmZmVyXG4gKi9cbmZ1bmN0aW9uIHNldEd6aXBPcGVyYXRpbmdTeXN0ZW1Ub1Vua25vd24oZ3ppcEJ1ZmZlcjogQnVmZmVyKSB7XG4gIC8vIGNoZWNrIHRoYXQgdGhpcyBpcyBpbmRlZWQgYSBnemlwIGJ1ZmZlciAoaHR0cHM6Ly9kYXRhdHJhY2tlci5pZXRmLm9yZy9kb2MvaHRtbC9yZmMxOTUyI3BhZ2UtNilcbiAgaWYgKGd6aXBCdWZmZXJbMF0gIT09IDB4MWYgfHwgZ3ppcEJ1ZmZlclsxXSAhPT0gMHg4Yikge1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0aW5nIGEgZ3ppcCBidWZmZXIgKG11c3Qgc3RhcnQgd2l0aCAweDFmOGIpJyk7XG4gIH1cblxuICBnemlwQnVmZmVyWzldID0gMjU1O1xufSJdfQ==