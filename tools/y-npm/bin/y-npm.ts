import 'source-map-support/register';

import colors = require('colors/safe');
import fs = require('fs-extra');
import { determineStorageDirectory } from '../lib/determine-storage-directory';
import { findAllPackages } from '../lib/find-all-packages';
import { debug, setVerbose } from '../lib/logging';
import { runNpmCommand } from '../lib/run-npm-command';
import { withVerdaccio } from '../lib/start-verdaccio';
import { withTemporaryFile } from '../lib/with-temporary-file';

async function main(argv: string[]): Promise<number> {
  // Disable colors if $Y_NPM_NO_COLOR is set to a truthy value
  if (process.env.Y_NPM_NO_COLOR) {
    colors.disable();
  }
  // Make verbose if $Y_NPM_VERBOSE is set to a truthy value
  if (process.env.Y_NPM_VERBOSE) {
    setVerbose(true);
    debug(`Verbose logging enabled by $Y_NPM_VERBOSE=${process.env.Y_NPM_VERBOSE}`);
  }
  debug(`Arguments: ${JSON.stringify(argv)}`);

  const storage = await determineStorageDirectory();
  if (argv.length === 1) {
    switch (argv[0]) {
    case 'y-ls':
      debug(`Invoking y-npm command: y-ls`);
      await listLocalPackages();
      return 0;
    }
  }

  return (await withTemporaryFile('npmrc', async npmrc => {
    return await withVerdaccio(storage, argv.find(arg => arg === 'publish') != null, async verdaccio => {
      const userConfig = `registry=http:${verdaccio.endpoint}\n${verdaccio.endpoint}:_authToken=none\n`;
      debug(`Writing user config to ${colors.green(npmrc)}:\n${colors.blue(userConfig)}`);
      await fs.writeFile(npmrc, userConfig);
      return await(await runNpmCommand(argv, { npm_config_registry: undefined, npm_config_userconfig: npmrc }));
    });
  })).exitCode;

  // ### Helper functions ###

  async function listLocalPackages(dir: string = storage) {
    for (const pkg of await findAllPackages(dir)) {
      process.stdout.write(`${colors.green(pkg.name)}@${colors.blue(pkg.maxVersion || '*')}\n`);
    }
  }
}

main(process.argv.slice(2))
  .then(exitCode => process.exit(exitCode))
  .catch(err => {
    // tslint:disable-next-line:no-console
    console.error(err.stack);
    process.exit(-1);
  });
