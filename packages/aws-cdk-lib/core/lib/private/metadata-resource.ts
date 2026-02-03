import * as zlib from 'zlib';
import { Construct } from 'constructs';
import * as cxapi from '../../../cx-api';
import { RegionInfo } from '../../../region-info';
import { CfnCondition } from '../cfn-condition';
import { Fn } from '../cfn-fn';
import { Aws } from '../cfn-pseudo';
import { CfnResource } from '../cfn-resource';
import { AssumptionError } from '../errors';
import { FeatureFlags } from '../feature-flags';
import { Lazy } from '../lazy';
import type { Stack } from '../stack';
import { Token } from '../token';
import type { ConstructInfo } from './runtime-info';
import type { ConstructAnalytics } from './stack-metadata';
import { constructAnalyticsFromScope } from './stack-metadata';

/**
 * Construct that will render the metadata resource
 */
export class MetadataResource extends Construct {
  constructor(scope: Stack, id: string) {
    super(scope, id);
    const metadataServiceExists = Token.isUnresolved(scope.region) || RegionInfo.get(scope.region).cdkMetadataResourceAvailable;
    if (metadataServiceExists) {
      const constructAnalytics = filteredConstructAnalyticsFromStack(scope);
      const resource = new CfnResource(this, 'Default', {
        type: 'AWS::CDK::Metadata',
        properties: {
          Analytics: Lazy.string({ produce: () => formatAnalytics(constructAnalytics) }),
        },
      });

      // In case we don't actually know the region, add a condition to determine it at deploy time
      if (Token.isUnresolved(scope.region)) {
        const condition = new CfnCondition(this, 'Condition', {
          expression: makeCdkMetadataAvailableCondition(),
        });

        // To not cause undue template changes
        condition.overrideLogicalId('CDKMetadataAvailable');

        resource.cfnOptions.condition = condition;
      }
    }
  }
}

/**
 * For a given stack, walks the tree and finds the runtime info for all constructs within the tree.
 * Will remove certain telemetry data based on the ENABLE_ADDITIONAL_METADATA_COLLECTION feature flag.
 */
function filteredConstructAnalyticsFromStack(scope: Stack ) {
  const includeAdditionalTelemetry = FeatureFlags.of(scope).isEnabled(cxapi.ENABLE_ADDITIONAL_METADATA_COLLECTION) ?? false;
  const constructAnalytics = constructAnalyticsFromScope(scope);

  // only include additional telemetry information if feature flag is enabled
  // this is a safety net, the data should have never been collected before reaching this point
  if (includeAdditionalTelemetry) {
    return constructAnalytics;
  }

  // otherwise we filter it out now
  return constructAnalytics.map(retainAlwaysReportedAnalytics);

  function retainAlwaysReportedAnalytics(analytics: ConstructAnalytics): ConstructAnalytics {
    return {
      fqn: analytics.fqn,
      version: analytics.version,
      metadata: analytics.metadata,
    };
  }
}

function makeCdkMetadataAvailableCondition() {
  return Fn.conditionOr(...RegionInfo.regions
    .filter(ri => ri.cdkMetadataResourceAvailable)
    .map(ri => Fn.conditionEquals(Aws.REGION, ri.name)));
}

/** Convenience type for arbitrarily-nested map */
class Trie extends Map<string, Trie> { }

/**
 * Formats the analytics string which has 3 or 4 sections separated by colons (:)
 *
 * version:encoding:constructinfo OR version:encoding:constructinfo:appinfo
 *
 * The constructinfo section is a list of construct fully-qualified names (FQNs)
 * and versions into a (possibly compressed) prefix-encoded string.
 *
 * The list of ConstructInfos is logically formatted into: ${version}!${fqn}
 * (e.g., "1.90.0!aws-cdk-lib.Stack") and then all of the construct-versions are
 * grouped with common prefixes together, grouping common parts in '{}' and
 * separating items with ','.
 *
 * Example:
 * [1.90.0!aws-cdk-lib.Stack, 1.90.0!aws-cdk-lib.Construct, 1.90.0!aws-cdk-lib.service.Resource, 0.42.1!aws-cdk-lib-experiments.NewStuff]
 * Becomes:
 * 1.90.0!aws-cdk-lib.{Stack,Construct,service.Resource},0.42.1!aws-cdk-lib-experiments.NewStuff
 *
 * The whole thing is then compressed and base64-encoded, and then formatted as:
 * v2:deflate64:{prefixEncodedListCompressedAndEncoded}
 *
 * The appinfo section is optional, and currently only added if the app was generated using `cdk migrate`
 * It is also compressed and base64-encoded. In this case, the string will be formatted as:
 * v2:deflate64:{prefixEncodedListCompressedAndEncoded}:{'cdk-migrate'CompressedAndEncoded}
 *
 * Exported/visible for ease of testing.
 */
export function formatAnalytics(infos: ConstructAnalytics[]) {
  const trie = new Trie();

  infos.forEach(info => insertFqnInTrie(`${info.version}!${info.fqn}`, trie, [info.metadata, info.additionalTelemetry].flatMap(a => a ?? [])));

  const plaintextEncodedConstructs = prefixEncodeTrie(trie);
  const compressedConstructsBuffer = zlib.gzipSync(Buffer.from(plaintextEncodedConstructs));

  // set OS flag to "unknown" in order to ensure we get consistent results across operating systems
  // see https://github.com/aws/aws-cdk/issues/15322
  setGzipOperatingSystemToUnknown(compressedConstructsBuffer);

  const compressedConstructs = compressedConstructsBuffer.toString('base64');
  const analyticsString = `v2:deflate64:${compressedConstructs}`;

  if (process.env.CDK_CONTEXT_JSON && JSON.parse(process.env.CDK_CONTEXT_JSON)['cdk-migrate']) {
    const compressedAppInfoBuffer = zlib.gzipSync(Buffer.from('cdk-migrate'));
    const compressedAppInfo = compressedAppInfoBuffer.toString('base64');
    analyticsString.concat(':', compressedAppInfo);
  }

  return analyticsString;
}

/**
 * Takes an analytics string and converts it back into a readable format.
 * Useful for debugging.
 *
 * @internal
 */
export function parseAnalytics(analyticsString: string): ConstructInfo[] {
  const analyticsData = analyticsString.split(':');
  if (analyticsData.length >= 3 && analyticsData[0] === 'v2' && analyticsData[1] === 'deflate64') {
    const buffer = Buffer.from(analyticsData[2], 'base64');
    const decompressedBuffer = zlib.gunzipSync(buffer);
    const prefixEncodedList = decompressedBuffer.toString('utf8');
    const trie = parsePrefixEncodedList(prefixEncodedList);
    return trieToConstructInfos(trie);
  } else {
    throw new AssumptionError(`Invalid analytics string: ${analyticsString}`);
  }
}

/**
 * Converts a Trie back to a list of ConstructInfo objects.
 */
function trieToConstructInfos(trie: Trie): ConstructInfo[] {
  const infos: ConstructInfo[] = [];
  function traverse(node: Trie, path: string) {
    if (node.size === 0) {
      const [version, fqn] = path.split('!');
      infos.push({ version, fqn });
    }
    for (const [key, value] of node.entries()) {
      traverse(value, path + key);
    }
  }
  traverse(trie, '');
  return infos;
}

/**
 * Splits after non-alphanumeric characters (e.g., '.', '/') in the FQN
 * and insert each piece of the FQN in nested map (i.e., simple trie).
 */
function insertFqnInTrie(fqn: string, trie: Trie, metadata?: unknown[]) {
  for (const fqnPart of fqn.replace(/[^a-z0-9]/gi, '$& ').split(' ')) {
    const nextLevelTreeRef = trie.get(fqnPart) ?? new Trie();
    trie.set(fqnPart, nextLevelTreeRef);
    trie = nextLevelTreeRef;
  }

  // if 'metadata' is defined and not empty, add it to end of Trie
  if (metadata?.length) {
    trie.set(JSON.stringify(metadata), new Trie());
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
function prefixEncodeTrie(trie: Trie) {
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
    } else {
      prefixEncoded += prefixEncodeTrie(value);
    }
  });
  return prefixEncoded;
}

/**
 * Parses a prefix-encoded "trie-ish" structure.
 * This is the inverse of `prefixEncodeTrie`.
 *
 * Example input:
 * A{B{C,D},EF}
 *
 * Becomes:
 * ABC,ABD,AEF
 *
 * Example trie:
 * A --> B --> C
 *  |     \--> D
 *  \--> E --> F
 */
function parsePrefixEncodedList(data: string): Trie {
  const trie = new Trie();
  let i = 0;

  function parse(currentTrie: Trie, prefix: string) {
    let token = '';
    while (i < data.length) {
      const char = data[i];
      if (char === '{') {
        i++;
        parse(currentTrie, prefix + token);
        token = '';
      } else if (char === '}' || char === ',') {
        if (token) {
          insertFqnInTrie(prefix + token, trie);
        }
        i++;
        if (char === '}') return;
        token = '';
      } else {
        token += char;
        i++;
      }
    }
    if (token) {
      insertFqnInTrie(prefix + token, trie);
    }
  }

  parse(trie, '');
  return trie;
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
function setGzipOperatingSystemToUnknown(gzipBuffer: Buffer) {
  // check that this is indeed a gzip buffer (https://datatracker.ietf.org/doc/html/rfc1952#page-6)
  if (gzipBuffer[0] !== 0x1f || gzipBuffer[1] !== 0x8b) {
    throw new AssumptionError('Expecting a gzip buffer (must start with 0x1f8b)');
  }

  gzipBuffer[9] = 255;
}
