import * as path from 'path';
import * as fs from 'fs-extra';
import * as yargs from 'yargs';
import { Bundle, BundleProps, BundleValidateOptions } from './api';

function versionNumber(): string {
  return fs.readJSONSync(path.join(__dirname, '..', 'package.json')).version;
}

async function buildCommands() {

  const argv = yargs
    .usage('Usage: node-bundle COMMAND')
    .option('entrypoint', { type: 'array', nargs: 1, desc: 'List of entrypoints to bundle' })
    .option('external', { type: 'array', nargs: 1, default: [], desc: 'Packages in this list will be excluded from the bundle and added as dependencies (example: fsevents:optional)' })
    .option('license', { type: 'array', nargs: 1, default: [], desc: 'List of valid licenses' })
    .option('resource', { type: 'array', nargs: 1, default: [], desc: 'List of resources that need to be explicitly copied to the bundle (example: node_modules/proxy-agent/contextify.js:bin/contextify.js)' })
    .option('dont-attribute', { type: 'string', desc: 'Dependencies matching this regular expressions wont be added to the notice file' })
    .option('test', { type: 'string', desc: 'Validation command to sanity test the bundle after its created' })
    .command('validate', 'Validate the package is ready for bundling', args => args
      .option('fix', { type: 'boolean', default: false, alias: 'f', desc: 'Fix any fixable violations' }),
    )
    .command('write', 'Write the bundled version of the project to a temp directory')
    .command('pack', 'Write the bundle and create the tarball')
    .help()
    .version(versionNumber())
    .argv;

  const command = argv._[0];

  function undefinedIfEmpty(arr?: any[]): string[] | undefined {
    if (!arr || arr.length === 0) return undefined;
    return arr as string[];
  }

  const entryPointsArg = undefinedIfEmpty(argv.entrypoint);
  const externalsArg = undefinedIfEmpty(argv.external);
  const licensesArg = undefinedIfEmpty(argv.license);
  const resourcesArg = undefinedIfEmpty(argv.resource) ?? [];

  const resources: any = {};
  for (const resource of resourcesArg) {
    const parts = resource.split(':');
    resources[parts[0]] = parts[1];
  }

  const props: BundleProps = {
    packageDir: process.cwd(),
    entryPoints: entryPointsArg,
    externals: externalsArg,
    licenses: licensesArg,
    resources: resources,
    dontAttribute: argv['dont-attribute'],
    test: argv.test,
  };

  const bundle = new Bundle(props);

  switch (command) {
    case 'validate':
      validate(bundle, { fix: argv.fix });
      break;
    case 'write':
      write(bundle);
      break;
    case 'pack':
      pack(bundle);
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

function write(bundle: Bundle) {
  const bundleDir = bundle.write();
  console.log(bundleDir);
}

function validate(bundle: Bundle, options: BundleValidateOptions = {}) {
  const report = bundle.validate(options);
  if (!report.success) {
    throw new Error(report.summary);
  }
}

function pack(bundle: Bundle) {
  bundle.pack();
}

buildCommands()
  .catch((err: Error) => {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  });
