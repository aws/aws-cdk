import * as path from 'path';
import * as fs from 'fs-extra';
import * as yargs from 'yargs';
import { Bundle } from './api';

function versionNumber(): string {
  return fs.readJSONSync(path.join(__dirname, '..', 'package.json')).version;
}

async function buildCommands() {

  const argv = yargs
    .usage('Usage: node-bundle COMMAND')
    .option('entrypoint', { type: 'array', nargs: 1, desc: 'List of entrypoints to bundle', demandOption: true })
    .option('copyright', { type: 'string', desc: 'Copyright statement to be added to the notice file', demandOption: true })
    .option('external', { type: 'array', nargs: 1, default: [], desc: 'Packages in this list will be excluded from the bundle and added as dependencies (example: fsevents:optional)' })
    .option('license', { type: 'array', nargs: 1, default: [], desc: 'List of valid licenses' })
    .option('resources', { type: 'array', nargs: 1, default: [], desc: 'List of resources that need to be explicitly copied to the bundle (example: node_modules/proxy-agent/contextify.js:bin/contextify.js)' })
    .option('dont-attribute', { type: 'string', desc: 'Dependencies matching this regular expressions wont be added to the notice file' })
    .option('test', { type: 'string', desc: 'Validation command to sanity test the bundle after its created' })
    .command('validate', 'Validate the package is ready for bundling')
    .command('pack', 'Create the tarball')
    .command('fix', 'Fix whatever we can for bundling')
    .help()
    .version(versionNumber())
    .argv;

  const command = argv._[0];
  const resources: any = {};
  for (const resource of argv.resources as string[]) {
    const parts = resource.split(':');
    resources[parts[0]] = parts[1];
  }

  const bundle = new Bundle({
    packageDir: process.cwd(),
    copyright: argv.copyright,
    entrypoints: argv.entrypoint as string[],
    externals: argv.external as string[],
    licenses: argv.license as string[],
    resources: resources,
    dontAttribute: argv['dont-attribute'],
    test: argv.test,
  });

  switch (command) {
    case 'validate':
      const report = bundle.validate();
      if (report.violations.length > 0) {
        for (const violation of report.violations) {
          console.error(`- ${violation}`);
        }
        throw new Error('Violations detected (See above)');
      }
      break;
    case 'pack':
      bundle.pack();
      break;
    case 'fix':
      bundle.fix();
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }


}

buildCommands()
  .catch((err: Error) => {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  });
