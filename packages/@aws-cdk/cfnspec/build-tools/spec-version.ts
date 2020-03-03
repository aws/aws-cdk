import * as fs from 'fs-extra';

async function main() {
  const specFile = process.argv[2];
  const spec = await fs.readJSON(specFile);
  process.stdout.write(`${spec.ResourceSpecificationVersion}`);
}

main().catch(e => {
  process.stderr.write(e.stack);
  process.stderr.write('\n');
  process.exit(1);
});
