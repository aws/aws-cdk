import * as zlib from 'zlib';
import { RegionInfo } from '@aws-cdk/region-info';
import { CfnCondition } from '../cfn-condition';
import { Fn } from '../cfn-fn';
import { Aws } from '../cfn-pseudo';
import { CfnResource } from '../cfn-resource';
import { Construct } from '../construct-compat';
import { Lazy } from '../lazy';
import { Stack } from '../stack';
import { Token } from '../token';
import { ConstructInfo, constructInfoFromStack } from './runtime-info';

/**
 * Construct that will render the metadata resource
 */
export class MetadataResource extends Construct {
  constructor(scope: Stack, id: string) {
    super(scope, id);

    const metadataServiceExists = Token.isUnresolved(scope.region) || RegionInfo.get(scope.region).cdkMetadataResourceAvailable;
    if (metadataServiceExists) {
      const resource = new CfnResource(this, 'Default', {
        type: 'AWS::CDK::Metadata',
        properties: {
          Analytics: Lazy.string({ produce: () => formatAnalytics(constructInfoFromStack(scope)) }),
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

function makeCdkMetadataAvailableCondition() {
  return Fn.conditionOr(...RegionInfo.regions
    .filter(ri => ri.cdkMetadataResourceAvailable)
    .map(ri => Fn.conditionEquals(Aws.REGION, ri.name)));
}

/** Convenience type for arbitrarily-nested map */
class Trie extends Map<string, Trie> { }

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
export function formatAnalytics(infos: ConstructInfo[]) {
  const trie = new Trie();
  infos.forEach(info => insertFqnInTrie(`${info.version}!${info.fqn}`, trie));

  const plaintextEncodedConstructs = prefixEncodeTrie(trie);
  const compressedConstructs = zlib.gzipSync(Buffer.from(plaintextEncodedConstructs)).toString('base64');

  return `v2:deflate64:${compressedConstructs}`;
}

/**
 * Splits after non-alphanumeric characters (e.g., '.', '/') in the FQN
 * and insert each piece of the FQN in nested map (i.e., simple trie).
 */
function insertFqnInTrie(fqn: string, trie: Trie) {
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
