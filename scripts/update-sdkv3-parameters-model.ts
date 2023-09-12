/**
 * From the SDKv3 repository, build an index of all types that are are "Blob"s,
 * so we can properly convert input strings into `Uint8Arrays` in Custom Resources
 * that call the SDKv3 in an untyped way.
 */
import * as path from 'path';
import { promises as fs } from 'fs';

/**
 * For every Smithy .json file in a directory, extract relevant types into a mapping and render them to a TypeScript file
 */
async function main(argv: string[]) {
  if (!argv[0]) {
    throw new Error('Usage: update-sdkv3-parameters-model <DIRECTORY>');
  }
  const dir = argv[0];

  const blobMapping: TypeCoercionMap = {};
  const numberMapping: TypeCoercionMap = {};

  for (const entry of await fs.readdir(dir, { withFileTypes: true, encoding: 'utf-8' })) {
    if (entry.isFile() && entry.name.endsWith('.json')) {
      const contents = JSON.parse(await fs.readFile(path.join(dir, entry.name), { encoding: 'utf-8' }));
      if (contents.smithy !== '2.0') {
        console.error(`Skipping ${entry.name}`);
        continue;
      }
      try {
        await doFile(blobMapping, numberMapping, contents);
      } catch (e) {
        throw new Error(`Error handling ${entry.name}: ${e}`);
      }
    }
  }

  if (Object.entries(blobMapping).length === 0) {
    throw new Error('No mappings found!');
  }

  // Sort the map so we're independent of the order the OS gave us the files in, or what the filenames are
  const sortedMapping = Object.fromEntries(Object.entries(blobMapping).sort(sortByKey));

  console.log(JSON.stringify({
    uint88ArrayParameters: blobMapping,
    numberParameters: numberMapping,
  }))
}

/**
 * Recurse through all the types of a singly Smithy model, and record the blobs
 */
async function doFile(blobMap: TypeCoercionMap, numberMap: TypeCoercionMap, model: SmithyFile) {
  const shapes = model.shapes;

  const service = Object.values(shapes).find(isShape('service'));
  if (!service) {
    throw new Error('Did not find service');
  }
  const _shortName = (service.traits?.['aws.api#service']?.arnNamespace
    ?? service.traits?.['aws.api#service']?.endpointPrefix
    ?? service.traits?.['aws.auth#sigv4']?.name);
  if (!_shortName) {
    throw new Error('Service does not have shortname');
  }
  const shortName = _shortName;

  // Sort operations so we have a stable order to minimize future diffs
  const operations = service.operations ?? [];
  operations.sort((a, b) => a.target.localeCompare(b.target));

  for (const operationTarget of operations) {
    const operation = shapes[operationTarget.target];
    if (!isShape('operation')(operation)) {
      throw new Error(`Not an operation: ${operationTarget.target}`);
    }
    if (operation.input) {
      const [, opName] = operationTarget.target.split('#');
      recurse(operation.input.target, opName.toLowerCase(), [], []);
    }
  }

  /**
   * Recurse through type shapes, finding the blobs
   */
  function recurse(id: string, opName: string, memberPath: string[], seen: string[]) {
    if (id.startsWith('smithy.api#') || seen.includes(id)) {
      return;
    }
    seen = [...seen, id];
    const shape = shapes[id];

    if (isShape('blob')(shape)) {
      addToBlobs(opName, memberPath);
      return;
    }

    if (isNumber(shape)) {
      addToNumbers(opName, memberPath);
      return;
    }

    if (isShape('structure')(shape) || isShape('union')(shape)) {
      const allKeys = Object.keys(shape.members ?? {}).sort();
      for (const [field, member] of Object.entries(shape.members ?? {}).sort(sortByKey)) {
        recurse(member.target, opName, [...memberPath, uniquePrefix(field, allKeys)], seen);
      }
      return;
    }
    if (isShape('list')(shape)) {
      recurse(shape.member.target, opName, [...memberPath, '*'], seen);
      return;
    }
    if (isShape('map')(shape)) {
      // Keys can't be Uint8Arrays anyway in JS, so check only values
      recurse(shape.value.target, opName, [...memberPath, '*'], seen);
      return;
    }
  }

  /**
   * Return the shortest prefix of 'name' that is unique among 'names'
   */
  function uniquePrefix(name: string, names: string[]): string {
    for (let i = 1; i < name.length; i++) {
      const slice = name.substring(0, i);
      if (names.filter((n) => n.startsWith(slice)).length === 1) {
        return slice;
      }
    }
    return name;
  }

  function addToBlobs(opName: string, memberPath: string[]) {
    if (!blobMap[shortName]) {
      blobMap[shortName] = {};
    }
    if (!blobMap[shortName][opName]) {
      blobMap[shortName][opName] = [];
    }
    blobMap[shortName][opName].push(memberPath.join('.'));
  }

  function addToNumbers(opName: string, memberPath: string[]) {
    if (!numberMap[shortName]) {
      numberMap[shortName] = {};
    }
    if (!numberMap[shortName][opName]) {
      numberMap[shortName][opName] = [];
    }
    numberMap[shortName][opName].push(memberPath.join('.'));
  }
}

interface TypeCoercionMap {
  [service: string]: {
    [action: string]: string[]
  }
};

interface SmithyFile {
  shapes: Record<string, SmithyShape>;
}

type SmithyShape =
  | { type: 'service', operations?: SmithyTarget[], traits?: SmithyTraits }
  | { type: 'operation', input?: SmithyTarget, output: SmithyTarget, traits?: SmithyTraits }
  | { type: 'structure', members?: Record<string, SmithyTarget>, traits?: SmithyTraits }
  | { type: 'list', member: SmithyTarget }
  | { type: 'map', key: SmithyTarget, value: SmithyTarget }
  | { type: 'union', members?: Record<string, SmithyTarget> }
  | { type: string }
  ;

interface SmithyTarget {
  target: string
}

interface SmithyTraits {
  'aws.api#service'?: {
    sdkId?: string;
    arnNamespace?: string;
    cloudFormationName?: string;
    endpointPrefix?: string;
  };
  'aws.auth#sigv4'?: {
    name: string;
  };
}

function isShape<A extends string>(key: A) {
  return (x: SmithyShape): x is Extract<SmithyShape, { type: A }> => x.type === key;
}

function isNumber(shape: SmithyShape): boolean {
  return isShape('integer')(shape) ||
    isShape('float')(shape) ||
    isShape('double')(shape) ||
    isShape('long')(shape) ||
    isShape('short')(shape) ||
    isShape('bigInteger')(shape) ||
    isShape('bigDecimal')(shape) ||
    isShape('byte')(shape);
}

function sortByKey<A>(e1: [string, A], e2: [string, A]) {
  return e1[0].localeCompare(e2[0]);
}

main(process.argv.slice(2)).catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
