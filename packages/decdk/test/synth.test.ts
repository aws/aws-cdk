import cdk = require('@aws-cdk/cdk');
import { CloudAssembly } from '@aws-cdk/cx-api';
import fs = require('fs');
import reflect = require('jsii-reflect');
import path = require('path');
import { DeclarativeStack, loadTypeSystem, readTemplate, stackNameFromFileName } from '../lib';

const VALIDATE_ASSEMBLIES = true;

const dir = path.join(__dirname, '..', 'examples');

if (VALIDATE_ASSEMBLIES) {
  // With validation loading all assemblies takes 10s on my machine.
  // Without validation it's 600ms.
  //
  // Add a big margin for slower machines in case validation is enabled.
  jest.setTimeout(60 * 1000);
}

let _cachedTS: reflect.TypeSystem;
async function obtainTypeSystem() {
  // Load the typesystem only once, it's quite expensive
  if (!_cachedTS) {
    _cachedTS = await loadTypeSystem(VALIDATE_ASSEMBLIES);
  }
  return _cachedTS;
}

for (const templateFile of fs.readdirSync(dir)) {
  test(templateFile, async () => {
    const workingDirectory = dir;
    const template = await readTemplate(path.resolve(dir, templateFile));
    const typeSystem = await obtainTypeSystem();

    const app = new cdk.App();
    const stackName = stackNameFromFileName(templateFile);

    new DeclarativeStack(app, stackName, {
      workingDirectory,
      template,
      typeSystem
    });

    const assembly = new CloudAssembly(app.run().outdir);
    const output = assembly.stacks.find(x => x.name === stackName);
    if (!output) {
      throw new Error(`Unable to find stack ${stackName}`);
    }

    expect(output.template).toMatchSnapshot(stackName);
  });
}
