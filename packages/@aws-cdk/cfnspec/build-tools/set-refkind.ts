import fs = require('fs');
import path = require('path');
import util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    process.stderr.write(`Usage: set-refspec RESOURCE [RESOURCE] [...] KIND`);
    process.exit(1);
  }

  const kind = args[args.length - 1];
  const resources = args.slice(0, args.length - 1);

  const patchFile = path.join(__dirname, '..', 'spec-source', '600_RefKinds_patch.json');
  const patches = JSON.parse(await readFile(patchFile, { encoding: 'utf-8' }));

  for (const resource of resources) {
    patches.ResourceTypes[resource] = {
      patch: {
        operations: [
          {
            op: "add",
            path: "/RefKind",
            value: kind,
          }
        ],
        description: `Set RefKind of ${resource} to ${kind}`
      }
    };
  }

  await writeFile(patchFile, JSON.stringify(patches, undefined, 2), { encoding: 'utf-8' });
}

main().catch(e => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});