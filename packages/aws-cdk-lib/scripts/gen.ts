import * as path from 'node:path';
import { naming, topo } from '@aws-cdk/spec2cdk';
import { generateAll } from '@aws-cdk/spec2cdk/lib/cfn2ts';
import * as fs from 'fs-extra';
import generateServiceSubmoduleFiles from './submodules';
import writeCloudFormationIncludeMapping from './submodules/cloudformation-include';

const awsCdkLibDir = path.join(__dirname, '..');
const pkgJsonPath = path.join(awsCdkLibDir, 'package.json');
const topLevelIndexFilePath = path.join(awsCdkLibDir, 'index.ts');
const scopeMapPath = path.join(__dirname, 'scope-map.json');

const NON_SERVICE_SUBMODULES = ['core', 'interfaces'];

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});

async function main() {
  // Generate all L1s based on config in scope-map.json

  const generated = (await generateAll(awsCdkLibDir, {
    skippedServices: [],
    scopeMapPath,
  }));

  await updateExportsAndEntryPoints(generated);
  await topo.writeModuleMap(generated);
  await writeCloudFormationIncludeMapping(generated, awsCdkLibDir);

  for (const nss of NON_SERVICE_SUBMODULES) {
    delete generated[nss];
  }
  await generateServiceSubmoduleFiles(generated, awsCdkLibDir);
}

/**
 * Make every module in the module map visible
 *
 * Read `index.ts` and `package.json#exports`, and add exports for every
 * submodule that's not in there yet.
 */
async function updateExportsAndEntryPoints(modules: topo.ModuleMap) {
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
