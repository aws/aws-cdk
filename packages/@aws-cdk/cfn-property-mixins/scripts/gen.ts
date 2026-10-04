import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { cfnPropMixins } from '@aws-cdk/spec2cdk';
import type { ModuleMap, ModuleMapEntry, SubmoduleContribution } from '@aws-cdk/spec2cdk/lib/module-topology';
import { ensureFileContains, jsiiRcPathFor, writeJsiiRc } from '@aws-cdk/spec2cdk/lib/util/submodule-files';
import { CFN_PROPERTY_MIXINS_BASE_NAMES } from './config';

main().catch(e => {
  console.error(e);
  process.exitCode = 1;
});

async function main() {
  const pkgPath = path.join(__dirname, '..');
  const outputPath = path.join(pkgPath, 'lib', 'services');

  const result = await cfnPropMixins.generateAll({ outputPath, packageBases: CFN_PROPERTY_MIXINS_BASE_NAMES });

  await setupSubmodules(result.moduleMap, result.contributions, outputPath);
  await updateExportsAndEntryPoints(result.moduleMap, pkgPath);
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

  const barrels = new Map<string, { lines: string[]; jsiircNamespace: string }>();
  for (const c of contributions) {
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

  // services/<mod>/index.ts — directly exports generated content
  const subModuleIndex = path.join(modulePath, 'index.ts');
  const indexLines: string[] = [];
  for (const { lines } of barrels.values()) {
    indexLines.push(...lines);
  }
  await ensureFileContains(subModuleIndex, indexLines);
  await writeJsiiRc(jsiiRcPathFor(subModuleIndex), submodule.definition);

  // No separate barrel files needed — everything is in index.ts
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

    newExports[`./${moduleConfig.name}`] = `./lib/services/${moduleConfig.name}/index.js`;

    if (!serviceIndexExports.find(e => e.includes(moduleConfig.name))) {
      serviceIndexExports.push(`export * as ${moduleConfig.submodule} from './${moduleConfig.name}';`);
    }
  }

  pkgJson.exports = Object.fromEntries(Object.entries(newExports).sort(([e1], [e2]) => e1.localeCompare(e2)));

  await fs.writeFile(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
  await fs.writeFile(servicesIndexFilePath, serviceIndexExports.sort((l1, l2) => l1.localeCompare(l2)).join('\n') + '\n');
}
