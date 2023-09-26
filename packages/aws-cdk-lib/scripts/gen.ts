import * as path from 'node:path';
import * as fs from 'fs-extra';
import { generateAll, ModuleMap } from './codegen';
import submodulesGen from './submodules';

const awsCdkLibDir = path.join(__dirname, '..');
const pkgJsonPath = path.join(awsCdkLibDir, 'package.json');
const topLevelIndexFilePath = path.join(awsCdkLibDir, 'index.ts');
const scopeMapPath = path.join(__dirname, 'scope-map.json');

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});

async function main() {
  // Generate all L1s based on config in scope-map.json

  const generated = (await generateAll(awsCdkLibDir, {
    coreImport: '../../core',
    cloudwatchImport: '../../aws-cloudwatch',
    scopeMapPath,
  }));

  await updateExportsAndEntryPoints(generated);
  await writeScopeMap(generated);
  await submodulesGen(generated, awsCdkLibDir);
}

async function writeScopeMap(modules: ModuleMap) {
  const newScopeMap = Object.entries(modules)
    .sort(([modA], [modB]) => modA.localeCompare(modB))
    .reduce((accum, [moduleName, { scopes }]) => {
      return {
        ...accum,
        [moduleName]: scopes,
      };
    }, {});
  await fs.writeJson(scopeMapPath, newScopeMap, { spaces: 2 });
}

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
      submodule: definition?.submoduleName ?? moduleName.replace(/-/g, '_'),
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
