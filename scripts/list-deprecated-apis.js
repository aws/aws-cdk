#!/usr/bin/env node
const path = require('path');

const jsiiReflect = require('jsii-reflect');

async function main() {
  const typesystem = new jsiiReflect.TypeSystem();
  // Decdk depends on everything, so that's a perfect directory to load as closure
  await typesystem.loadNpmDependencies(path.resolve(__dirname, '..', 'packages', 'decdk'), { validate: false });

  process.stdout.write(`# List of deprecated APIs in v1\n`);
  process.stdout.write('\n');
  process.stdout.write(`| Module | API Element | Message |\n`);
  process.stdout.write(`|--------|-------------|---------|\n`);

  for (const assembly of typesystem.assemblies) {
    for (const type of assembly.types) {
      printIfDeprecated(assembly.fqn, type.name, type);

      if (type.isEnumType()) {
        type.members.forEach(e => printIfDeprecated(assembly.fqn, `${type.name}.${e.name}`, e));
      }
      if (type.isInterfaceType() || type.isClassType() || type.isDataType()) {
        type.ownProperties.forEach(p => printIfDeprecated(assembly.fqn, `${type.fqn}.${p.name}`, p));
        type.ownMethods.forEach(method => {
          printIfDeprecated(assembly.fqn, `${type.fqn}.${method.name}()`, method);
          method.parameters.forEach(p => printIfDeprecated(assembly.fqn, `${type.fqn}.${method.name}(): ${p.name}`, p));
        });
      }
    }
  }
}

function printIfDeprecated(mod, fqn, el) {
  try {
    if (el.docs.deprecated) {
      process.stdout.write(`| ${mod} | ${fqn} | ${el.docs.deprecationReason.replace(/^-/, '').replace(/\n/g, ' ').trim()} |\n`);
    }
  } catch (e) {
    console.error(`While processing ${fqn}:`, e);
  }
}

main().catch(e => console.error(e));


