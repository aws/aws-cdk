
import { generateAll as generateCfnPropsMixins } from './spec2mixins';
import { generateAll as generateLogsDeliveryMixins } from './spec2logs';
import { generateAll as generateEvents } from './spec2eventbridge';
import { generateAll as generateEncryptionAtRestMixins } from './spec2ear';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import type { ModuleMap, ModuleMapEntry } from '@aws-cdk/spec2cdk/lib/module-topology';
import type { ModuleDefinition } from '@aws-cdk/pkglint';

main().catch(e => {
  console.error(e);
  process.exitCode = 1;
});

async function main() {
  // the path to the mixins package
  const pkgPath = path.join(__dirname, '..');
  const outputPath = path.join(pkgPath, 'lib', 'services');

  const moduleMaps = [
    await generateCfnPropsMixins({ outputPath }),
    await generateLogsDeliveryMixins({ outputPath }),
    await generateEvents({ outputPath }),
    await generateEncryptionAtRestMixins({ outputPath }),
  ];

  const moduleMap = mergeModuleMaps(...moduleMaps);

  await submodules(moduleMap, outputPath);
  await updateExportsAndEntryPoints(moduleMap, pkgPath);
}

function mergeModuleMaps(...maps: ModuleMap[]): ModuleMap {
  const merged: ModuleMap = {};
  for (const map of maps) {
    for (const [name, entry] of Object.entries(map)) {
      if (!merged[name]) {
        merged[name] = entry;
      } else {
        merged[name] = {
          ...entry,
          files: [...new Set([...merged[name].files, ...entry.files])],
          resources: { ...merged[name].resources, ...entry.resources },
        };
      }
    }
  }
  return merged;
}

async function updateExportsAndEntryPoints(modules: ModuleMap, pkgPath: string) {
  const servicesIndexFilePath = path.join(pkgPath, 'lib', 'services', 'index.ts');
  const serviceIndexExports = new Array<string>();

  const pkgJsonPath = path.join(pkgPath, 'package.json');
  const pkgJson = JSON.parse((await fs.readFile(pkgJsonPath)).toString());

  // Clean up old service exports, keep only non-service exports
  const newExports: Record<string, string> = {};
  for (const [key, value] of Object.entries(pkgJson.exports)) {
    if (!key.startsWith('./aws-') && !key.startsWith('./alexa-')) {
      newExports[key] = value as string;
    }
  }

  for (const moduleName of Object.keys(modules)) {
    const moduleConfig = {
      name: moduleName,
      submodule: moduleName.replace(/-/g, '_'),
    };

    // @aws-cdk/mixins-preview/aws_s3 => ./lib/services/aws-s3/index.js
    const indexExportName = `./${moduleConfig.name}`;
    newExports[indexExportName] = `./lib/services/${moduleConfig.name}/index.js`;

    // @aws-cdk/mixins-preview/aws-s3 => `export * as aws_s3 from './aws-s3';`
    if (!serviceIndexExports.find(e => e.includes(moduleConfig.name))) {
      serviceIndexExports.push(`export * as ${moduleConfig.submodule} from './${moduleConfig.name}';`);
    }

    // @aws-cdk/mixins-preview/aws_s3/mixins => ./lib/services/aws-s3/mixins.js
    const mixinsExportName = `./${moduleConfig.name}/mixins`;
    newExports[mixinsExportName] = `./lib/services/${moduleConfig.name}/mixins.js`;

    // @aws-cdk/mixins-preview/aws_s3/events => ./lib/services/aws-s3/events.js
    const eventsFilePath = path.join(pkgPath, 'lib', 'services', moduleConfig.name, 'events.ts');
    if (existsSync(eventsFilePath)) {
      const eventsExportName = `./${moduleConfig.name}/events`;
      newExports[eventsExportName] = `./lib/services/${moduleConfig.name}/events.js`;
    }
  }

  // sort exports
  pkgJson.exports = Object.fromEntries(Object.entries(newExports).sort(([e1], [e2]) => e1.localeCompare(e2)));

  // package.json
  await fs.writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
  // lib/services/index.ts
  await fs.writeFile(servicesIndexFilePath, serviceIndexExports.sort((l1, l2) => l1.localeCompare(l2)).join('\n') + '\n');
}

async function submodules(modules: ModuleMap, outPath: string) {
  for (const submodule of Object.values(modules)) {
    await ensureSubmodule(submodule, outPath);
  }
}

async function ensureSubmodule(submodule: ModuleMapEntry, outPath: string) {
  const modulePath = path.join(outPath, submodule.name);
  // Ensure we have a module definition. Should not happen, but need to check.
  if (!submodule.definition) {
    throw new Error(
      `Cannot infer path or namespace for submodule named "${submodule.name}". Manually create ${modulePath}/.jsiirc.json files.`,
    );
  }

  // services/<mod>/index.ts
  // These exports make submodules out of 'mixins.ts', 'events.ts'
  const subModuleIndex = path.join(modulePath, 'index.ts');
  const indexLines: string[] = [];

  indexLines.push('export * as mixins from \'./mixins\';');

  const hasEvents = submodule.files.some(f => f.includes('events.generated.ts'));
  if (hasEvents) {
    indexLines.push('export * as events from \'./events\';');
  }

  // This file may contain handwritten lines, preserve.
  await ensureFileContains(subModuleIndex, indexLines);
  await writeJsiiModuleMetadata(subModuleIndex, submodule.definition);

  // services/<mod>/mixins.ts
  // This file exists so people can import it directly in JavaScript with a reasonable name:
  //
  // ```
  // import { X } from '@aws-cdk/mixins-preview/aws-s3/mixins';
  // ```
  // All it does is re-export the generated file. It can be manually edited so we don't
  // fully overwrite it.
  const mixinsModuleFile = path.join(modulePath, 'mixins.ts');
  const mixinsIndexLines: string[] = [];
  mixinsIndexLines.push('export * from \'./cfn-props-mixins.generated\';');

  if (existsSync(path.join(modulePath, 'logs-delivery-mixins.generated.ts'))) {
    mixinsIndexLines.push('export * from \'./logs-delivery-mixins.generated\';');
  }

  if (existsSync(path.join(modulePath, 'encryption-at-rest-mixins.generated.ts'))) {
    mixinsIndexLines.push('export * from \'./encryption-at-rest-mixins.generated\';');
  }

  await ensureFileContains(mixinsModuleFile, mixinsIndexLines);
  await writeJsiiModuleMetadata(mixinsModuleFile, submodule.definition, 'mixins');

  if (hasEvents) {
    // services/<mod>/events.ts
    // See mixins.ts for the motivation.
    const eventsModuleFile = path.join(modulePath, 'events.ts');
    await fs.writeFile(eventsModuleFile, 'export * from \'./events.generated\';\n');
    await writeJsiiModuleMetadata(eventsModuleFile, submodule.definition, 'events');
  }
}

async function writeJsiiModuleMetadata(moduleFile: string, moduleDef: ModuleDefinition, namespaceLc: string = '') {
  const base = path.basename(moduleFile, '.ts');
  const rcFile = base === 'index'
    ? path.join(path.dirname(moduleFile), '.jsiirc.json')
    : path.join(path.dirname(moduleFile), `.${base}.jsiirc.json`);

  const namespaceUc = ucfirst(namespaceLc ?? '');
  const dotnetNamespace = join(moduleDef.dotnetPackage, '.', namespaceUc);

  const mixinsJsiirc = {
    targets: {
      java: {
        package: join(moduleDef.javaPackage, '.', namespaceLc),
      },
      dotnet: {
        namespace: dotnetNamespace,
        packageId: dotnetNamespace,
      },
      python: {
        module: join(moduleDef.pythonModuleName, '.', namespaceLc),
      },
      go: {
        packageName: `preview${moduleDef.moduleName}${namespaceLc}`.replace(/[^a-z0-9.]/gi, ''),
      },
    },
  };
  await fs.writeFile(rcFile, JSON.stringify(mixinsJsiirc, null, 2) + '\n');
}

function ucfirst(x: string) {
  return x.charAt(0).toUpperCase() + x.slice(1);
}

function join(a: string, sep: string, b: string) {
  return b ? `${a}${sep}${b}` : a;
}

async function ensureFileContains(fileName: string, lines: string[]) {
  let currentLines = new Array<string>();

  // This index might contain hand-written mixins => ensure they are preserved
  if (existsSync(fileName)) {
    // load lines from file
    currentLines.push(...(await fs.readFile(fileName, 'utf-8')).split('\n')
      .filter(l => !l.includes('.generated')) // remove all generated files, they are added later anyway
      .filter(Boolean));
  }

  for (const line of lines) {
    if (!currentLines.includes(line)) {
      currentLines.push(line);
    }
  }

  await fs.writeFile(fileName, currentLines.sort().join('\n') + '\n');
}
