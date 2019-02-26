/**
 * Generates patches into the spec-source/600_RefKinds_patch.json document for any resource not having one yet.
 *
 * It will prompt the user for the RefKind to be applied for any new resource class, and offers completion assis for all
 * the known (already used at least once) RefKind values. New values can be introduced but they will need to be typed
 * twice (for confirmation of the user's intention).
 */

import fs = require('fs-extra');
import path = require('path');
import readline = require('readline');
import { filteredSpecification, namespaces } from '../lib';

const patchFile = path.join(__dirname, '..', 'spec-source', '600_RefKinds_patch.json');

async function main() {
  // tslint:disable-next-line:no-var-requires
  const patches = require(patchFile);
  const knownKindsSet = new Set<string>(Object.values(patches.ResourceTypes).map((patchSet: any) => patchSet.patch.operations[0].value));
  const knownKinds = [...knownKindsSet];

  const rl = readline.createInterface(process.stdin, process.stdout, (line: string) => {
    return [knownKinds.filter(kind => kind.startsWith(line)), line];
  });
  for (const namespace of namespaces()) {
    const spec = filteredSpecification(name => name.startsWith(namespace));
    for (const resource of Object.keys(spec.ResourceTypes)) {
      if (!(resource in patches.ResourceTypes)) {
        let value: string | undefined;
        while (!value) {
          value = await new Promise<string>(ok => rl.question(`RefKind of ${resource}: `, ok));
          if (!knownKindsSet.has(value)) {
            if (value !== '') {
              const confirm = await new Promise<string>(ok => rl.question('Type the same value again to confirm: ', ok));
              if (confirm !== value) {
                value = undefined;
              }
            }
          }
        }
        patches.ResourceTypes[resource] = {
          patch: {
            operations: [{ op: 'add', path: '/RefKind', value }],
            description: `Set RefKind of ${resource} to ${value}`,
          },
        };
      }
    }
  }
  await new Promise<void>(async (ok, ko) => {
    rl.once('close', () => fs.writeJson(patchFile, patches, { encoding: 'utf8', spaces: 2 }).then(ok).catch(ko));
    rl.close();
  });
}

main().catch(e => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(-1);
});
