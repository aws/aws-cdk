import * as fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { renderYargs, renderUserInputType, renderUserInputFuncs } from '@aws-cdk/user-input-gen';
import { makeConfig, YARGS_HELPERS } from '../lib/cli/cli-config';

async function main() {
  const config = await makeConfig();
  fs.writeFileSync('./lib/cli/parse-command-line-arguments.ts', await renderYargs(config, YARGS_HELPERS));
  fs.writeFileSync('./lib/cli/user-input.ts', await renderUserInputType(config));
  fs.writeFileSync('./lib/cli/convert-to-user-input.ts', await renderUserInputFuncs(config));
}

main().then(() => {
}).catch((e) => {
  throw e;
});
