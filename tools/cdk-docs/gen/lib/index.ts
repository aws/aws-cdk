import fs = require('fs');
import jsiiReflect = require('jsii-reflect');
import path = require('path');

const ts = new jsiiReflect.TypeSystem();
// tslint:disable:no-console

type Category = string | {
  doc?: string;
  type?: string;
  label: string;
  ids?: string[];
};

async function main() {
  // load all .jsii files into the type system
  for (const file of fs.readdirSync('./jsii')) {
    await ts.load(path.join('./jsii', file));
  }

  // ready to explore!

  const constructType = ts.findClass('@aws-cdk/cdk.Construct');
  const constructs = ts.classes.filter(c => extendsType(c, constructType));

  const services: { [key: string]: Category[]} = {};
  constructs
    .filter(c => c.fqn.startsWith('@aws-cdk/aws-'))
    .forEach(c => {
      const [, serviceName] = c.assembly.name.split('/');
      if (!services[serviceName]) {
        const readmeName = `${serviceName}-readme`;
        services[serviceName] = [readmeName];
        if (c.assembly.readme) {
          fs.writeFileSync(`../docs/${readmeName}.md`, `---
hide_title: true
sidebar_label: Overview
id: ${readmeName}
---
${c.assembly.readme.markdown}`);
        } else {
          fs.writeFileSync(`../docs/${readmeName}.md`, 'OOPS');
        }
      }
      services[serviceName].push(c.name);
    });

  fs.writeFileSync(`../website/sidebars.json`, JSON.stringify({
    docs: services
  }, null, 2));
}

export function extendsType(derived: jsiiReflect.Type, base: jsiiReflect.Type) {
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

main().catch(e => {
  console.error(e);
  process.exit(1);
});