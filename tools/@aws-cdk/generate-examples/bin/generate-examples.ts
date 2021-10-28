import * as path from 'path';
import * as yargs from 'yargs';

import { generateMissingExamples } from '../lib/generate-missing-examples';

async function main() {
  const args = yargs
    .usage('Usage: cdk-generate-examples [ASSEMBLY..]')
    .argv;

  const assemblies = (args._.length > 0 ? args._ : ['.']).map((x) => path.resolve(x.toString()));
  await generateMissingExamples(assemblies);
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});