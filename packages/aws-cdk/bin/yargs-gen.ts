import * as fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { renderYargs } from '@aws-cdk/yargs-gen';
import { makeConfig } from '../lib/config';

async function main() {
  // TODO: once the typewriter changes are in, we can remove this block of eslint
  const eslintBlock = `
/* eslint-disable comma-spacing */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable quote-props */
/* eslint-disable quotes */`;

  fs.writeFileSync('./lib/parse-command-line-arguments.ts', `${eslintBlock}\n`);
  fs.appendFileSync('./lib/parse-command-line-arguments.ts', await renderYargs(await makeConfig()));
}

main().then(() => {
}).catch((e) => {
  throw e;
});