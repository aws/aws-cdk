import fs = require('fs');
import jsiiReflect = require('jsii-reflect');
import path = require('path');
import yargs = require('yargs');

import { Docs, Sidebar } from './docusaurus';
import { Rendering } from './render';

const ts = new jsiiReflect.TypeSystem();
// tslint:disable:no-console

export async function main() {
  const args = yargs
    .env('GEN')
    .usage('Usage: gen')
    .option('javadoc', { type: 'string', alias: 'j', desc: 'Website root where JavaDocs are available' })
    .argv;

  const render = new Rendering({
    javadocPath: args.javadoc
  });

  // load all JSII from all dependencies
  const packageJson = require('../package.json');
  for (const depName of Object.keys(packageJson.dependencies || {})) {
    const jsiiModuleDir = path.dirname(require.resolve(`${depName}/package.json`));
    if (!fs.existsSync(path.resolve(jsiiModuleDir, '.jsii'))) {
      continue;
    }
    await ts.loadFile(path.resolve(jsiiModuleDir, '.jsii'));
  }

  // ready to explore!

  const docs = new Docs('../website', '../docs');

  const constructType = ts.findClass('@aws-cdk/cdk.Construct');
  const constructs = ts.classes.filter(c => extendsType(c, constructType));

  const resources = constructs
    .filter(c => c.fqn.startsWith('@aws-cdk/aws-'))
    .filter(c => !c.abstract)
    .filter(c => (c.initializer!.parameters.length === 3));

  docs.sidebar('docs').category('Service Reference').add(render.serviceReferencePage('service-reference'));
  documentResources(render, docs.sidebar('docs'), resources);

  docs.sidebar('framework-docs').category('Framework Reference').add(render.frameworkReferencePage('framework-reference'));

  await docs.write();
}

function documentResources(render: Rendering, sidebar: Sidebar, resources: jsiiReflect.ClassType[]) {
  resources
    .sort((a, b) => a.fqn.localeCompare(b.fqn))
    .forEach(c => {
      const [, serviceName] = c.assembly.name.split('/');
      const readmeName = `${serviceName}-readme`;

      const serviceCategory = sidebar.category(render.packageDisplayName(serviceName));
      if (serviceCategory.findDocument(readmeName) === undefined) {
        serviceCategory.add(render.assemblyOverview(c.assembly, readmeName));
      }
      const cfnCategory = serviceCategory.category('CloudFormation Resources');

      const resourceName = c.fqn.replace('/', '_');
      const resourceDoc = render.resourcePage(c, resourceName);

      // Decide which category to put this document in
      if (c.name.startsWith('Cfn')) {
        cfnCategory.add(resourceDoc);
      } else {
        serviceCategory.add(resourceDoc);
      }
    });
}

function extendsType(derived: jsiiReflect.Type, base: jsiiReflect.Type) {
  if (derived === base) {
    return true;
  }

  if (derived instanceof jsiiReflect.InterfaceType && base instanceof jsiiReflect.InterfaceType) {
    return derived.interfaces.some(x => x === base);
  }

  if (derived instanceof jsiiReflect.ClassType && base instanceof jsiiReflect.ClassType) {
    return derived.getAncestors().some(x => x === base);
  }

  return false;
}
