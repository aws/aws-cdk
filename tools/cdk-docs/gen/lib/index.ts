import fs = require('fs');
import jsiiReflect = require('jsii-reflect');
import path = require('path');

import render = require('./render');

const ts = new jsiiReflect.TypeSystem();
// tslint:disable:no-console

type Category = string | {
  doc?: string;
  type?: string;
  label: string;
  ids?: string[];
};

export async function main() {
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

  const constructType = ts.findClass('@aws-cdk/cdk.Construct');
  const constructs = ts.classes.filter(c => extendsType(c, constructType));

  const resources: { [service: string]: Category[] } = {};
  const services: { [key: string]: Category[]} = {};
  constructs
    .filter(c => c.fqn.startsWith('@aws-cdk/aws-'))
    .filter(c => !c.abstract)
    .filter(c => (c.initializer!.parameters.length === 3))
    .sort((a, b) => a.fqn.localeCompare(b.fqn))
    .forEach(c => {
      const [, serviceName] = c.assembly.name.split('/');
      const displayName = packageDisplayName(serviceName);
      if (!services[displayName]) {
        const readmeName = `${serviceName}-readme`;
        services[displayName] = [readmeName];
        resources[displayName] = [];
        fs.writeFileSync(`../docs/${readmeName}.md`, render.assemblyOverview(c.assembly, readmeName));
      }

      const resourceName = c.fqn.replace('/', '_');
      if (c.name.startsWith('Cfn')) {
        resources[displayName].push(resourceName);
      } else {
        services[displayName].push(resourceName);
      }

      fs.writeFileSync(`../docs/${resourceName}.md`, render.resourcePage(c, resourceName));
    });

  fs.writeFileSync('../docs/framework-reference.md', render.frameworkReferencePage('framework-reference'));
  fs.writeFileSync('../docs/service-reference.md', render.serviceReferencePage('service-reference'));

  const sidebars: any = {
    'Service Reference': ['service-reference']
  };
  for (const displayName of Object.keys(services)) {
    const service = services[displayName];
    const resourceIds = resources[displayName];

    sidebars[displayName] = [
      ...service,
      {
        type: "subcategory",
        label: "CloudFormation Resources",
        ids: resourceIds
      }
    ];
  }

  fs.writeFileSync(`../website/sidebars.json`, JSON.stringify({
    docs: sidebars,
    frameworkDocs: {'Framework Reference': ['framework-reference'] }
  }, null, 2));
}

function packageDisplayName(serviceName: string) {
  serviceName = serviceName.replace(/^aws-/, '');
  return serviceName.substr(0, 1).toUpperCase() + serviceName.substr(1);
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
