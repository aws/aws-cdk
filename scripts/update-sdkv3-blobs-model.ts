/**
 * From the SDKv3 repository, build an index of all types that are are "Blob"s,
 * so we can properly convert input strings into `Uint8Arrays` in Custom Resources
 * that call the SDKv3 in an untyped way.
 */
import * as path from 'path';
import { promises as fs } from 'fs';

async function main(argv: string[]) {
  if (!argv[0]) {
    throw new Error('Usage: update-sdkv3-blobs-model <DIRECTORY>');
  }
  const root = argv[0];

  const mapping: BlobTypeMapping = {};

  const dir = path.join(root, 'codegen', 'sdk-codegen', 'aws-models');
  for (const entry of await fs.readdir(dir, { withFileTypes: true, encoding: 'utf-8' })) {
    if (entry.isFile() && entry.name.endsWith('.json')) {
      const contents = JSON.parse(await fs.readFile(path.join(dir, entry.name), { encoding: 'utf-8' }));
      if (contents.smithy !== '2.0') {
        console.error(`Skipping ${entry.name}`);
        continue;
      }
      try {
        await doFile(mapping, contents);
      } catch (e) {
        throw new Error(`Error handling ${entry.name}: ${e}`);
      }
    }
  }

  if (Object.entries(mapping).length === 0) {
    throw new Error('No mappings found!');
  }

  // Sort the map so we're independent of the order the OS gave us the files in, or what the filenames are
  const sortedMapping = Object.fromEntries(Object.entries(mapping).sort(sortByKey));

  renderMappingToTypeScript(sortedMapping);
}

async function doFile(mapping: BlobTypeMapping, model: SmithyFile) {
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

  function recurse(id: string, opName: string, memberPath: string[], seen: string[]) {
    if (id.startsWith('smithy.api#') || seen.includes(id)) {
      return;
    }
    seen.push(id);
    const shape = shapes[id];

    if (isShape('blob')(shape)) {
      addToMapping(opName, memberPath);
      return;
    }
    if (isShape('structure')(shape)) {
      for (const [field, member] of Object.entries(shape.members ?? {}).sort(sortByKey)) {
        recurse(member.target, opName, [...memberPath, field], seen);
      }
      return;
    }
    if (isShape('list')(shape)) {
      recurse(shape.member.target, opName, [...memberPath, '*'], seen);
      return;
    }
  }

  function addToMapping(opName: string, memberPath: string[]) {
    if (!mapping[shortName]) {
      mapping[shortName] = {};
    }
    if (!mapping[shortName][opName]) {
      mapping[shortName][opName] = [];
    }
    mapping[shortName][opName].push(memberPath.join('.'));
  }
}

interface BlobTypeMapping {
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
  | { type: string }
  ;

interface SmithyTarget { target: string };

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

function sortByKey<A>(e1: [string, A], e2: [string, A]) {
  return e1[0].localeCompare(e2[0]);
}

function renderMappingToTypeScript(sortedMapping: BlobTypeMapping) {
  const lines = new Array<string>();

  lines.push(
    `// This file was generated from the aws-sdk-js-v3 at ${new Date()}`,
    'export interface BlobTypeMapping {',
    '  [service: string]: {',
    '    [action: string]: string[]',
    '  }',
    '};'
  );

  lines.push('export const blobTypes: BlobTypeMapping = ' + JSON.stringify(sortedMapping, undefined, 2).replace(/"/g, '\'') + ';');

  console.log(lines.join('\n'));
}

main(process.argv.slice(2)).catch((e) => {
  console.error(e);
  process.exitCode = 1;
});


