import { createHash } from 'crypto';
import { type CreateStackRefactorCommandInput, ResourceMapping } from '@aws-sdk/client-cloudformation';
import { ICloudFormationClient, Template } from './api';
import { info } from './logging';

/**
 * The Resources section of a CFN template
 */
export type ResourceMap = Map<string, any>

/**
 * Map of resource hashes to sets of logical IDs
 */
export type ResourceIndex = Map<string, Set<string>>

/**
 * A pair of sets of logical IDs that are equivalent,
 * that is, that refer to the same resource.
 */
export type RenamingPair = [Set<string>, Set<string>]

export class ResourceCorrespondence {
  constructor(
    public readonly pairs: RenamingPair[],
    private readonly oldResources: Record<string, any>,
    private readonly newResources: Record<string, any>,
  ) {
  }

  toString(): string {
    function toMetadataUsing(set: Set<string>, resources: Record<string, any>): Set<string> {
      return new Set([...set].map(s => resources[s].Metadata?.['aws:cdk:path'] as string ?? s));
    }

    let text = this.pairs
      .map(([before, after]) => ([
        toMetadataUsing(before, this.oldResources),
        toMetadataUsing(after, this.newResources),
      ]))
      .map(([before, after]) => {
        if (before.size === 1 && after.size === 1) {
          return `${[...before][0]} -> ${[...after][0]}`;
        } else {
          return `{${[...before].join(', ')}} -> {${[...after].join(', ')}}`;
        }
      })
      .map(x => `  - ${x}`)
      .join('\n');

    return `\n${text}\n`;
  }

  isEmpty(): boolean {
    return this.pairs.length === 0;
  }

  /**
   * A subset of this correspondence containing only ambiguous pairs
   */
  ambiguous(): ResourceCorrespondence {
    const ambiguousPairs = this.pairs.filter(pair =>
      pair[0].size > 1 || pair[1].size > 1,
    );

    return new ResourceCorrespondence(ambiguousPairs, this.oldResources, this.newResources);
  }

  /**
   * A subset of this correspondence containing only unambiguous pairs
   */
  unambiguous(): ResourceCorrespondence {
    const ambiguousPairs = this.pairs.filter(pair =>
      !(pair[0].size > 1 || pair[1].size > 1),
    );

    return new ResourceCorrespondence(ambiguousPairs, this.oldResources, this.newResources);
  }

  invert(): ResourceCorrespondence {
    return new ResourceCorrespondence(
      this.pairs.map(p => [p[1], p[0]]),
      this.newResources,
      this.oldResources,
    );
  }
}

/**
 * Given two records of (logical ID -> object), finds a list of objects that
 * are present in both records but have different logical IDs. For each of
 * these objects, this function returns a pair of sets of logical IDs. The
 * first set coming from the first record, and the second set, from the
 * second object. For example:
 *
 *     const corr = findResourceCorrespondence({a: {x: 0}}, {b: {x: 0}});
 *
 * `corr` should be `[new Set('a'), new Set('b')]`
 *
 */
export function findResourceCorrespondence(m1: Record<string, any>, m2: Record<string, any>): ResourceCorrespondence {
  const pairs = renamingPairs(
    index(new Map(Object.entries(m1))),
    index(new Map(Object.entries(m2))),
  );

  return new ResourceCorrespondence(pairs, m1, m2);
}

// TODO Handle cross-stack refactoring
export async function refactorStack(
  cfnClient: ICloudFormationClient,
  correspondence: ResourceCorrespondence,
  oldTemplate: Template,
  stackName: string,
): Promise<void> {
  const mappings = correspondence.pairs.map(toResourceMapping);

  // TODO Add an event progress tracker, like the one for deploy
  info('Performing stack refactoring');

  // Performing the name replacement in the template to send to the API.
  // This seems redundant, since CloudFormation could infer the template
  // from the current state + the mappings. But without this, the API
  // rejects the request.
  const resources = Object.fromEntries(
    Object.entries(oldTemplate.Resources).map(([k, v]) => {
      const mapping = mappings.find(m => m.Source?.LogicalResourceId === k);
      return mapping != null ? [mapping.Destination?.LogicalResourceId, v] : [k, v];
    }),
  );

  const template = {
    ...oldTemplate,
    Resources: resources,
  };

  const refactorCommand: CreateStackRefactorCommandInput = {
    StackDefinitions: [{
      StackName: stackName,
      TemplateBody: JSON.stringify(template),
    }],
    ResourceMappings: mappings,
  };

  const stackRefactor = await cfnClient.createStackRefactor(refactorCommand);

  info(`Stack refactor created: ${stackRefactor.StackRefactorId}`);

  await cfnClient.waitUntilStackRefactorCreateComplete({
    StackRefactorId: stackRefactor.StackRefactorId,
  });

  info('Stack refactor creation completed');

  await cfnClient.executeStackRefactor({
    StackRefactorId: stackRefactor.StackRefactorId,
  });

  info('Stack refactor execution started');

  await cfnClient.waitUntilStackRefactorExecuteComplete({
    StackRefactorId: stackRefactor.StackRefactorId,
  });

  info('Stack refactoring complete');

  function toResourceMapping(pair: RenamingPair): ResourceMapping {
    const from = [...pair[0]][0];
    const to = [...pair[1]][0];
    return {
      Source: {
        StackName: stackName,
        LogicalResourceId: from,
      },
      Destination: {
        StackName: stackName,
        LogicalResourceId: to,
      },
    };
  }
}

function index(resourceMap: ResourceMap): ResourceIndex {
  const result: ResourceIndex = new Map();
  resourceMap.forEach((resource, logicalId) => {
    const h = hashObject(resource);
    if (!result.has(h)) {
      result.set(h, new Set());
    }
    result.get(h)?.add(logicalId);
  });
  return result;
}

function renamingPairs(index1: ResourceIndex, index2: ResourceIndex): RenamingPair[] {
  const result: RenamingPair[] = [];

  const keyUnion = new Set([...index1.keys(), ...index2.keys()]);
  keyUnion.forEach((key) => {
    if (index1.has(key) && index2.has(key) && index1.get(key) !== index2.get(key)) {
      result.push(partitionedSymmetricDifference(index1.get(key)!, index2.get(key)!));
    }
  });

  return result.filter(c => c[0].size > 0 && c[1].size > 0);
}

/**
 * Returns a pair [s0 \ s1, s1 \ s0].
 */
function partitionedSymmetricDifference(s0: Set<string>, s1: Set<string>): [Set<string>, Set<string>] {
  return [difference(s0, s1), difference(s1, s0)];
}

function hashObject(obj: any): string {
  const hash = createHash('sha256');

  function addToHash(value: any) {
    if (typeof value === 'object') {
      if (value == null) {
        addToHash('null');
      } else if (Array.isArray(value)) {
        value.forEach(addToHash);
      } else {
        Object.keys(value).sort().forEach(key => {
          hash.update(key);
          addToHash(value[key]);
        });
      }
    } else {
      hash.update(typeof value + value.toString());
    }
  }

  const { Metadata, ...rest } = obj;
  addToHash(rest);

  return hash.digest('hex');
}

function difference<A>(xs: Set<A>, ys: Set<A>): Set<A> {
  return new Set([...xs].filter(x => !ys.has(x)));
}
