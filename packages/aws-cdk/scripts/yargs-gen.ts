import * as fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { renderYargs, renderCliType } from '@aws-cdk/yargs-gen';
import { makeConfig, YARGS_HELPERS } from '../lib/config';

async function main() {
  fs.writeFileSync('./lib/parse-command-line-arguments.ts', await renderYargs(await makeConfig(), YARGS_HELPERS));
  fs.writeFileSync('./lib/cli-type.ts', await renderCliType(await makeConfig()));
}

main().then(() => {
}).catch((e) => {
  throw e;
});
