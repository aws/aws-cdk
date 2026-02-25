import * as path from 'node:path';
import * as fs from 'fs-extra';
import writeCloudFormationIncludeMapping from '../lib/cfn2ts/cloudformation-include';
import { generateAll } from '../lib/cfn2ts/index';
import generateServiceSubmoduleFiles from '../lib/cfn2ts/submodules';
import type { ModuleMap } from '../lib/module-topology';
import { writeModuleMap, moduleMapPath } from '../lib/module-topology';
import * as naming from '../lib/naming/index';

const libDir = process.cwd();
const isStable = libDir.endsWith('aws-cdk-lib');
const pkgJsonPath = path.join(libDir, 'package.json');
const topLevelIndexFilePath = path.join(libDir, 'index.ts');

const NON_SERVICE_SUBMODULES = ['core', 'interfaces'];

main().catch(e => {
  console.error(e);
  process.exitCode = 1;
});

async function main() {
  // Generate all L1s based on config in scope-map.json

  const generated = (await generateAll(libDir, {
    skippedServices: [],
    scopeMapPath: moduleMapPath,
    isStable,
    singleModule: isStable ? undefined : path.parse(libDir).name.replace('-alpha', ''),
  }));

  if (isStable) {
    await updateExportsAndEntryPoints(generated);
    writeModuleMap(generated);

    await writeCloudFormationIncludeMapping(generated, libDir);

    for (const nss of NON_SERVICE_SUBMODULES) {
      delete generated[nss];
    }
    await generateServiceSubmoduleFiles(generated, libDir);
  }
}

/**
 * Make every module in the module map visible
 *
 * Read `index.ts` and `package.json#exports`, and add exports for every
 * submodule that's not in there yet.
 */
async function updateExportsAndEntryPoints(modules: ModuleMap) {
  const pkgJson = await fs.readJson(pkgJsonPath);

  const indexStatements = new Array<string>();
  if (fs.existsSync(topLevelIndexFilePath)) {
    const indexFile = await fs.readFile(topLevelIndexFilePath);
    indexStatements.push(...indexFile.toString('utf-8').split('\n').filter(Boolean));
  }

  for (const [moduleName, { definition }] of Object.entries(modules)) {
    const moduleConfig = {
      name: definition?.moduleName ?? moduleName,
      submodule: definition?.submoduleName ?? naming.submoduleSymbolFromName(moduleName),
    };

    if (!pkgJson.exports) {
      pkgJson.exports = {};
    }

    const exportName = `./${moduleConfig.name}`;
    if (!pkgJson.exports[exportName]) {
      pkgJson.exports[exportName] = `./${moduleConfig.name}/index.js`;
    }

    if (!indexStatements.find(e => e.includes(moduleConfig.name))) {
      indexStatements.push(`export * as ${moduleConfig.submodule} from './${moduleConfig.name}';`);
    }
  }

  // sort exports
  pkgJson.exports = Object.fromEntries(Object.entries(pkgJson.exports).sort(([e1], [e2]) => e1.localeCompare(e2)));

  await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
  await fs.writeFile(topLevelIndexFilePath, indexStatements.sort((l1, l2) => l1.localeCompare(l2)).join('\n') + '\n');
}
