import fs = require('fs-extra');
import path = require('path');
import YAML = require('yaml');
import { parseResourceName } from '../lib/cfnschema';

async function main() {
  const args = require('yargs')
    .usage('$0 <filename>', 'Hydrate a deconstruct file file', (yargs: any) => {
      yargs.positional('filename', { type: 'string', required: true });
    })
    .parse();

  const str = await fs.readFile(args.filename!, { encoding: 'utf-8' });
  const template = YAML.parse(str, { schema: 'yaml-1.1' });

  const filenameWithoutExtension = path.parse(args.filename!).name;

  // Create App and Stack to root replaced constructs under:w
  const cdk = requireClientModule('@aws-cdk/cdk');
  const app = new cdk.App(undefined);
  const stack = new cdk.Stack(app, filenameWithoutExtension);

  // Replace every resource that starts with CDK::
  for (const [logicalId, resourceProps] of Object.entries(template.Resources || {})) {
    const rprops: any = resourceProps;
    if (!rprops.Type) {
      throw new Error('Resource is missing type: ' + JSON.stringify(resourceProps));
    }

    const resName = parseResourceName(rprops.Type);
    if (resName) {
      const module = requireClientModule(resName.module);
      const constructor = module[resName.className];

      new constructor(stack, logicalId, rprops.Properties);
      delete template.Resources[logicalId];
    }
  }

  // Add an Include construct with what's left of the template
  new cdk.Include(stack, 'Include', { template });

  app.run();
}

function requireClientModule(moduleName: string): any {
  const modulePath = require.resolve(moduleName, { paths: [process.cwd()] });
  return require(modulePath);
}

main().catch(e => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});