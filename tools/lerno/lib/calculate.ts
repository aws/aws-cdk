import crypto = require('crypto');
import fs = require('fs-extra');
import path = require('path');
import { executeTopo } from './topo';
import { AllBuildInputs, BuildInputs } from './types';
import { sorted, sortedEntries } from './util';

export function calculateBuildHashes(inputs: AllBuildInputs): Promise<Record<string, string>> {
  return executeTopo(Object.keys(inputs), {
    id: x => x,
    deps: x => inputs[x].internalDependencyNames,
    exec: async (pkgName, internalDepsHashes): Promise<string> => {
      const input: BuildInputs = inputs[pkgName];
      const parts: string[] = [];

      for (const fileName of sorted(input.sourceFiles)) {
        parts.push(`${path.relative(input.rootDirectory, fileName)}:${await fileHash(fileName)}`);
      }

      for (const [dep, version] of sortedEntries(input.externalDependencyVersion)) {
        parts.push(`${dep}:${version}`);
      }

      for (const internal of sorted(input.internalDependencyNames)) {
        parts.push(`${internal}:${internalDepsHashes[internal]}`);
      }

      const hash = crypto.createHash('sha1');
      hash.update(parts.join('\n'));
      return hash.digest('hex');
    },
  });
}

async function fileHash(fileName: string): Promise<string> {
  const hash = crypto.createHash('sha1');
  hash.update(await fs.readFile(fileName));
  return hash.digest('hex');
}