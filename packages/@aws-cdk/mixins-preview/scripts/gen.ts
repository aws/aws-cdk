import { generateAll } from './spec2mixins/generate';
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

  const moduleMap = await generateAll({
    outputPath: outputPath,
  });

  await submodules(moduleMap, outputPath);
  await updateExportsAndEntryPoints(moduleMap, pkgPath);
}

async function updateExportsAndEntryPoints(modules: ModuleMap, pkgPath: string) {
  const servicesIndexFilePath = path.join(pkgPath, 'lib', 'services', 'index.ts');
  const serviceIndexExports = new Array<string>();

  const pkgJsonPath = path.join(pkgPath, 'package.json');
  const pkgJson = JSON.parse((await fs.readFile(pkgJsonPath)).toString());

  for (const moduleName of Object.keys(modules)) {
    const moduleConfig = {
      name: moduleName,
      submodule: moduleName.replace(/-/g, '_'),
    };

    // @aws-cdk/mixins-preview/aws-s3 => `export * as aws_s3 from './aws-s3';`
    if (!serviceIndexExports.find(e => e.includes(moduleConfig.name))) {
      serviceIndexExports.push(`export * as ${moduleConfig.submodule} from './${moduleConfig.name}';`);
    }

    // @aws-cdk/mixins-preview/aws-s3 => ./lib/services/aws-s3/index.js
    pkgJson.exports[`./${moduleConfig.submodule}`] ??= `./lib/services/${moduleConfig.name}/index.js`;

    // @aws-cdk/mixins-preview/aws-s3/mixins => ./lib/services/aws-s3/mixins.js
    pkgJson.exports[`./${moduleConfig.submodule}/mixins`] ??= `./lib/services/${moduleConfig.name}/mixins.js`;
  }

  // sort exports
  pkgJson.exports = Object.fromEntries(Object.entries(pkgJson.exports).sort(([e1], [e2]) => e1.localeCompare(e2)));

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
  // This index might contain hand-written exports => ensure they are preserved
  {
    const subModuleIndex = path.join(modulePath, 'index.ts');
    const subModuleIndexExports = new Array<string>();
    if (existsSync(subModuleIndex)) {
      subModuleIndexExports.push(...(await fs.readFile(subModuleIndex)).toString().split('\n').filter(Boolean));
    }

    const mixinsExportStmt = 'export * as mixins from \'./mixins\';';
    if (!subModuleIndexExports.find(e => e.includes(mixinsExportStmt))) {
      subModuleIndexExports.push(mixinsExportStmt);
    }

    await fs.writeFile(subModuleIndex, subModuleIndexExports.sort().join('\n') + '\n');
  }

  // services/<mod>/mixins.ts
  // This index might contain hand-written mixins => ensure they are preserved
  {
    const mixinsIndex = path.join(modulePath, 'mixins.ts');
    const mixinsExports = new Array<string>();
    if (existsSync(mixinsIndex)) {
      mixinsExports.push(...(await fs.readFile(mixinsIndex)).toString().split('\n').filter(Boolean));
    }

    for (const file of submodule.files) {
      const f = path.relative(modulePath, path.join(outPath, file));
      const loc = `./${f.replace('.ts', '')}`;
      if (!mixinsExports.find(e => e.includes(loc))) {
        mixinsExports.push(`export * from '${loc}';`);
      }
    }

    await fs.writeFile(mixinsIndex, mixinsExports.sort().join('\n') + '\n');
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
        // go: {
        //   packageName: `mixins${submodule.definition.moduleName}`.replace(/[^a-z0-9.]/gi, ''),
        // },
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
        go: {
          packageName: `mixins${submodule.definition.moduleName}`.replace(/[^a-z0-9.]/gi, ''),
        },
      },
    };
    await fs.writeFile(mixinsJsiiRc, JSON.stringify(mixinsJsiirc, null, 2) + '\n');
  }
}

