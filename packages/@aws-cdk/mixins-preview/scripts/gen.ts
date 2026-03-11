import { existsSync } from 'node:fs';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { GeneratorResult, ModuleMap, ModuleMapEntry, SubmoduleContribution } from '@aws-cdk/spec2cdk/lib/module-topology';
import { mergeModuleMaps } from '@aws-cdk/spec2cdk/lib/module-topology';
import { ensureFileContains, jsiiRcPathFor, writeJsiiRc } from '@aws-cdk/spec2cdk/lib/util/submodule-files';
import { generateAll as generateCfnPropsMixins } from './spec2mixins';
import { generateAll as generateEvents } from './spec2eventbridge';
import { generateAll as generateLogsDeliveryMixins } from './spec2logs';

const GO_PREFIX = 'preview';

main().catch(e => {
  console.error(e);
  process.exitCode = 1;
});

async function main() {
  const pkgPath = path.join(__dirname, '..');
  const outputPath = path.join(pkgPath, 'lib', 'services');

  const results: GeneratorResult[] = [
    await generateCfnPropsMixins({ outputPath }),
    await generateLogsDeliveryMixins({ outputPath }),
    await generateEvents({ outputPath }),
  ];

  const moduleMap = mergeModuleMaps(...results.map(r => r.moduleMap));
  const contributions = results.flatMap(r => r.contributions);

  await setupSubmodules(moduleMap, contributions, outputPath);
  await updateExportsAndEntryPoints(moduleMap, pkgPath);
}

async function setupSubmodules(modules: ModuleMap, contributions: SubmoduleContribution[], outPath: string) {
  for (const submodule of Object.values(modules)) {
    await ensureSubmodule(submodule, contributions, outPath);
  }
}

async function ensureSubmodule(submodule: ModuleMapEntry, contributions: SubmoduleContribution[], outPath: string) {
  const modulePath = path.join(outPath, submodule.name);
  if (!submodule.definition) {
    throw new Error(
      `Cannot infer path or namespace for submodule named "${submodule.name}". Manually create ${modulePath}/.jsiirc.json files.`,
    );
  }

  // Collect which barrel files this submodule needs, based on contributions
  // that have matching generated files
  const barrels = new Map<string, { lines: string[]; jsiircNamespace: string }>();
  for (const c of contributions) {
    // Only add contribution if the submodule has a matching generated file
    const hasFile = c.exportLines.some(line => {
      const match = line.match(/from\s+'\.\/(.+)'/);
      return match && submodule.files.some(f => f.includes(match[1]));
    });
    if (!hasFile) continue;

    const existing = barrels.get(c.barrelFile);
    if (existing) {
      existing.lines.push(...c.exportLines);
    } else {
      barrels.set(c.barrelFile, { lines: [...c.exportLines], jsiircNamespace: c.jsiircNamespace });
    }
  }

  // services/<mod>/index.ts — re-exports each barrel as a namespace
  const subModuleIndex = path.join(modulePath, 'index.ts');
  const indexLines = [...barrels.keys()].map(barrel => {
    const ns = path.basename(barrel, '.ts');
    return `export * as ${ns} from './${ns}';`;
  });
  await ensureFileContains(subModuleIndex, indexLines);
  await writeJsiiRc(jsiiRcPathFor(subModuleIndex), submodule.definition, { goPrefix: GO_PREFIX });

  // Write each barrel file
  for (const [barrelFile, { lines, jsiircNamespace }] of barrels) {
    const barrelPath = path.join(modulePath, barrelFile);
    await ensureFileContains(barrelPath, lines);
    await writeJsiiRc(jsiiRcPathFor(barrelPath), submodule.definition, { goPrefix: GO_PREFIX, namespaceSuffix: jsiircNamespace });
  }
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

    const indexExportName = `./${moduleConfig.name}`;
    newExports[indexExportName] = `./lib/services/${moduleConfig.name}/index.js`;

    if (!serviceIndexExports.find(e => e.includes(moduleConfig.name))) {
      serviceIndexExports.push(`export * as ${moduleConfig.submodule} from './${moduleConfig.name}';`);
    }

    const mixinsExportName = `./${moduleConfig.name}/mixins`;
    newExports[mixinsExportName] = `./lib/services/${moduleConfig.name}/mixins.js`;

    const eventsFilePath = path.join(pkgPath, 'lib', 'services', moduleConfig.name, 'events.ts');
    if (existsSync(eventsFilePath)) {
      const eventsExportName = `./${moduleConfig.name}/events`;
      newExports[eventsExportName] = `./lib/services/${moduleConfig.name}/events.js`;
    }
  }

  pkgJson.exports = Object.fromEntries(Object.entries(newExports).sort(([e1], [e2]) => e1.localeCompare(e2)));

  await fs.writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
  await fs.writeFile(servicesIndexFilePath, serviceIndexExports.sort((l1, l2) => l1.localeCompare(l2)).join('\n') + '\n');
}
