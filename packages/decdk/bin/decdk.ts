import * as cdk from '@aws-cdk/core';
import * as colors from 'colors/safe';
import { DeclarativeStack, loadTypeSystem, readTemplate, stackNameFromFileName } from '../lib';

async function main() {
  const args = require('yargs')
    .usage('$0 <filename>', 'Hydrate a deconstruct file', (yargs: any) => {
      yargs.positional('filename', { type: 'string', required: true });
    })
    .parse();

  const templateFile = args.filename;
  const template = await readTemplate(templateFile);
  const stackName = stackNameFromFileName(templateFile);
  const typeSystem = await loadTypeSystem();

  const app = new cdk.App();
  new DeclarativeStack(app, stackName, { template, typeSystem });
  app.synth();
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(colors.red(e));
  process.exit(1);
});
