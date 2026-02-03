#!/usr/bin/env node
const path = require('path');

const jsiiReflect = require('jsii-reflect');

class MarkdownPrinter {
  printHeader() {
    process.stdout.write(`# List of deprecated APIs in v1\n`);
    process.stdout.write('\n');
    process.stdout.write(`| Module | API Element | Message |\n`);
    process.stdout.write(`|--------|-------------|---------|\n`);
  }

  printIfDeprecated(mod, name, el) {
    try {
      if (el.docs.deprecated) {
        // Add zero-width spaces after . and _ to allow for line breaking long identifiers
        // (WindowsVersion.WINDOWS_SERVER_2012_RTM_CHINESE_TRADITIONAL_HONG_KONG_SAR_64BIT_BASE is a fun one...)
        // For consistency with the original format, replace the '#' separators with '.'
        const apiName = name.replace('#', '.').replace(/(\.|_)/g, '$1\u200B');

        // Some deprecation reasons start with '- ' for misguided reasons. Get rid of it, and also get rid of newlines.
        const reason = el.docs.deprecationReason.replace(/^-/, '').replace(/\n/g, ' ').trim();

        process.stdout.write(`| ${mod} | ${apiName} | ${reason} |\n`);
      }
    } catch (e) {
      console.error(`While processing ${mod}.${name}:`, e);
    }
  }
}

/** For use as input to the --strip-deprecated argument in jsii */
class StripDeprecatedPrinter {
  printHeader() { }

  printIfDeprecated(mod, name, el) {
    try {
      if (el.docs.deprecated) {
        // Remove the method parens
        process.stdout.write(`${mod}.${name.replace(/\(\)$/, '')}\n`);
      }
    } catch (e) {
      console.error(`While processing ${mod}.${name}:`, e);
    }
  }
}

async function main(printer) {
  const typesystem = new jsiiReflect.TypeSystem();
  // aws-cdk-lib depends on everything, so that's a perfect directory to load as closure
  await typesystem.loadNpmDependencies(path.resolve(__dirname, '..', 'packages', 'aws-cdk-lib'), { validate: false });

  printer.printHeader();

  for (const assembly of typesystem.assemblies) {
    for (const type of [assembly, ...assembly.allSubmodules].flatMap(x => x.types)) {
      const typeName = type.namespace ? `${type.namespace}.${type.name}` : type.name;
      printer.printIfDeprecated(assembly.fqn, typeName, type);

      if (type.isEnumType()) {
        type.members.forEach(e => printer.printIfDeprecated(assembly.fqn, `${typeName}#${e.name}`, e));
      }
      if (type.isInterfaceType() || type.isClassType() || type.isDataType()) {
        type.ownProperties.forEach(p => printer.printIfDeprecated(assembly.fqn, `${typeName}#${p.name}`, p));
        type.ownMethods.forEach(method => {
          printer.printIfDeprecated(assembly.fqn, `${typeName}#${method.name}()`, method);
          method.parameters.forEach(p => printer.printIfDeprecated(assembly.fqn, `${typeName}#${method.name}(): ${p.name}`, p));
        });
      }
    }
  }
}

const printer = (process.argv.length > 2 && process.argv[2] === '--plain')
  ? new StripDeprecatedPrinter()
  : new MarkdownPrinter();

main(printer).catch(e => console.error(e));


