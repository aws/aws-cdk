import * as yargs from 'yargs';
import * as path from 'path';

import { generateMissingExamples } from '../lib/generate-missing-examples';

function main() {
  const args = yargs
    .usage('Usage: cdk-generate-examples [ASSEMBLY..]')
    .argv;
  
  const assemblies = (args._.length > 0 ? args._ : ['.']).map((x) => path.resolve(x.toString()));
  generateMissingExamples(assemblies);
}

main();