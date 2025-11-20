import { generateAll as generateMixins } from './spec2mixins/generate';
import { generateAll as generateEvents } from './spec2eventbridge/generate';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import type { ModuleMap, ModuleMapEntry } from '@aws-cdk/spec2cdk/lib/module-topology';

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});

async function main() {
  // the path to the mixins package
  const pkgPath = path.join(__dirname, '..');
  const outputPath = path.join(pkgPath, 'lib', 'services');

  const mixinsModuleMap = await generateMixins({ outputPath });
  const eventsModuleMap = await generateEvents({ outputPath });

  const moduleMap = mergeModuleMaps(mixinsModuleMap, eventsModuleMap);

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

    // @aws-cdk/mixins-preview/aws-s3 => `export * as aws_s3 from './aws-s3';`
    if (!serviceIndexExports.find(e => e.includes(moduleConfig.name))) {
      serviceIndexExports.push(`export * as ${moduleConfig.submodule} from './${moduleConfig.name}';`);
    }

    // @aws-cdk/mixins-preview/aws-s3/mixins => ./lib/services/aws-s3/index.js
    const exportName = `./${moduleConfig.name}/mixins`;
    newExports[exportName] = `./lib/services/${moduleConfig.name}/mixins.js`;

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
  const subModuleIndex = path.join(modulePath, 'index.ts');
  const hasEvents = submodule.files.some(f => f.includes('.events.generated.ts'));
  const indexContent = hasEvents
    ? 'export * as mixins from \'./mixins\';\nexport * as events from \'./events\';\n'
    : 'export * as mixins from \'./mixins\';\n';
  await fs.writeFile(subModuleIndex, indexContent);

  // services/<mod>/mixins.ts
  {
    const mixinsIndex = path.join(modulePath, 'mixins.ts');
    const mixinsExports= new Array<string>();

    // This index might contain hand-written mixins => ensure they are preserved
    if (existsSync(mixinsIndex)) {
    // load lines from file
      mixinsExports.push(...(await fs.readFile(mixinsIndex)).toString().split('\n').filter(Boolean));
    }

    for (const file of submodule.files) {
      if (!file.includes('.events.generated.ts')) {
        const f = path.relative(modulePath, path.join(outPath, file));
        const loc = `./${f.replace('.ts', '')}`;
        if (!mixinsExports.find(e => e.includes(loc))) {
          mixinsExports.push(`export * from '${loc}';`);
        }
      }
    }

    await fs.writeFile(mixinsIndex, mixinsExports.sort().join('\n') + '\n');
  }

  // services/<mod>/events.ts
  {
    const eventsIndex = path.join(modulePath, 'events.ts');
    const eventsExports = new Array<string>();

    if (existsSync(eventsIndex)) {
      eventsExports.push(...(await fs.readFile(eventsIndex)).toString().split('\n').filter(Boolean));
    }

    for (const file of submodule.files) {
      if (file.includes('.events.generated.ts')) {
        const f = path.relative(modulePath, path.join(outPath, file));
        const loc = `./${f.replace('.ts', '')}`;
        if (!eventsExports.find(e => e.includes(loc))) {
          eventsExports.push(`export * from '${loc}';`);
        }
      }
    }

    if (eventsExports.length > 0) {
      await fs.writeFile(eventsIndex, eventsExports.sort().join('\n') + '\n');
    }
  }

  // .jsiirc.json
  {
    const subModuleJsiiRc = path.join(modulePath, '.jsiirc.json');
    const jsiirc = {
      targets: {
        java: {
          package: submodule.definition.javaPackage,
        },
        dotnet: {
          package: submodule.definition.dotnetPackage,
        },
        python: {
          module: submodule.definition.pythonModuleName,
        },
        go: {
          packageName: `mixins${submodule.definition.moduleName}`.replace(/[^a-z0-9.]/gi, ''),
        },
      },
    };
    await fs.writeFile(subModuleJsiiRc, JSON.stringify(jsiirc, null, 2) + '\n');}

  // .mixins.jsiirc.json
  {
    const mixinsJsiiRc = path.join(modulePath, '.mixins.jsiirc.json');
    const mixinsJsiirc = {
      targets: {
        java: {
          package: `${submodule.definition.javaPackage}.mixins`,
        },
        dotnet: {
          package: `${submodule.definition.dotnetPackage}.Mixins`,
        },
        python: {
          module: `${submodule.definition.pythonModuleName}.mixins`,
        },
      },
    };
    await fs.writeFile(mixinsJsiiRc, JSON.stringify(mixinsJsiirc, null, 2) + '\n');
  }
}

