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
        type.ownProperties.forEach(p => printIfDeprecated(assembly.fqn, `${type.name}.${p.name}`, p));
        type.ownMethods.forEach(method => {
          printIfDeprecated(assembly.fqn, `${type.name}.${method.name}()`, method);
          method.parameters.forEach(p => printIfDeprecated(assembly.fqn, `${type.name}.${method.name}(): ${p.name}`, p));
        });
      }
    }
  }
}

function printIfDeprecated(mod, name, el) {
  try {
    if (el.docs.deprecated) {
      // Add zero-width spaces after . and _ to allow for line breaking long identifiers
      // (WindowsVersion.WINDOWS_SERVER_2012_RTM_CHINESE_TRADITIONAL_HONG_KONG_SAR_64BIT_BASE is a fun one...)
      const apiName = name.replace(/(\.|_)/g, '$1\u200B');

      // Some deprecation reasons start with '- ' for misguided reasons. Get rid of it, and also get rid of newlines.
      const reason = el.docs.deprecationReason.replace(/^-/, '').replace(/\n/g, ' ').trim();

      process.stdout.write(`| ${mod} | ${apiName} | ${reason} |\n`);
    }
  } catch (e) {
    console.error(`While processing ${mod}.${name}:`, e);
  }
}

main().catch(e => console.error(e));


