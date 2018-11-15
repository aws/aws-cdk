import jsonschema = require('jsonschema');
import { Drop, Manifest } from './manifest';

// tslint:disable-next-line:no-var-requires
export const schema: jsonschema.Schema = require('../schema/manifest.schema.json');

/**
 * Validate that ``obj`` is a valid Cloud Assembly manifest document, both syntactically and semantically. The semantic
 * validation ensures all Drop references are valid (they point to an existing Drop in the same manifest document), and
 * that there are no cycles in the dependency graph described by the manifest.
 *
 * @param obj the object to be validated.
 *
 * @returns ``obj``
 * @throws Error if ``obj`` is not a Cloud Assembly manifest document or if it is semantically invalid.
 */
export function validateManifest(obj: unknown): Manifest {
  const validator = new jsonschema.Validator();
  const result = validator.validate(obj, schema);
  if (result.valid) {
    return validateSemantics(obj as Manifest);
  }
  throw new Error(`Invalid Cloud Assembly manifest: ${result}`);
}

function validateSemantics(manifest: Manifest): Manifest {
  const dependencyGraph: { [id: string]: Reference[] } = {};
  for (const logicalId of Object.keys(manifest.drops)) {
    assertValidLogicalId(logicalId);
    const drop = manifest.drops[logicalId];
    const references = dependencyGraph[logicalId] = listReferences(drop, logicalId);
    for (const ref of references) {
      if (!(ref.logicalId in manifest.drops)) {
        throw new Error(`${logicalId} depends on undefined drop through ${ref.context}.`);
      }
    }
  }
  assertNoCycles();
  return manifest;

  function assertNoCycles() {
    for (const logicalId of Object.keys(dependencyGraph)) {
      for (const reference of dependencyGraph[logicalId]) {
        reference.subreferences = dependencyGraph[reference.logicalId];
      }
    }
    const cycles = Object.keys(dependencyGraph)
                         .map(shortestCycle)
                         .filter(cycle => cycle.length > 0)
                         .sort((l, r) => l.length - r.length);
    if (cycles.length > 0) {
      const cyclesDecription = cycles.map(cycle => `- ${cycle.join(' => ')}`);
      throw new Error(`Found dependency cycles:\n${cyclesDecription.join('\n')}`);
    }

    function shortestCycle(fromId: string): string[] {
      const toProcess = dependencyGraph[fromId].map(ref => ({ ref, path: [fromId] }));
      const visited = new Set<string>();
      while (toProcess.length > 0) {
        const candidate = toProcess.pop()!;
        if (candidate.ref.logicalId === fromId) {
          return [...candidate.path, candidate.ref.context];
        }
        if (!visited.has(candidate.ref.logicalId)) {
          toProcess.unshift(...candidate.ref.subreferences!.map(ref => ({ ref, path: [...candidate.path, candidate.ref.context] })));
          visited.add(candidate.ref.logicalId);
        }
      }
      return [];
    }
  }
}

function assertValidLogicalId(str: string): void {
  const regex = /^[A-Za-z0-9+\/_-]{1,256}$/;
  if (!str.match(regex)) {
    throw new Error(`Invalid logical ID: ${str} (does not match ${regex})`);
  }
}

function listReferences(drop: Drop, dropId: string): Reference[] {
  const result = new Array<Reference>();
  for (const logicalId of drop.dependsOn || []) {
    result.push({ logicalId, context: `dependsOn ${logicalId}` });
  }
  result.push(...listTokens(drop, dropId));
  return result;
}

function listTokens(obj: unknown, path: string): Reference[] {
  const result = new Array<Reference>();
  if (typeof obj === 'string') {
    const tokens = obj.match(/\\*\$\{[A-Za-z0-9+\/_-]{1,256}\.[^}]+\}/g);
    for (const token of tokens || []) {
      const parts = token.match(/(\\*)(\$\{([A-Za-z0-9+\/_-]{1,256})\.[^}]+\})/)!;
      if (parts[1].length % 2 !== 0) {
        // This one's quoted, so skip it.
        continue;
      }
      result.push({
        logicalId: parts[3],
        context: `${path} "${parts[2]}"`
      });
    }
  } else if (typeof obj !== 'object' || obj == null) {
    return [];
  } else if (Array.isArray(obj)) {
    for (let i = 0 ; i < obj.length ; i++) {
      result.push(...listTokens(obj[i], `${path}[${i}]`));
    }
  } else {
    for (const key of Object.keys(obj)) {
      result.push(...listTokens((obj as any)[key], `${path}.${key}`));
    }
  }
  return result;
}

interface Reference {
  logicalId: string;
  context: string;
  subreferences?: Reference[];
}
