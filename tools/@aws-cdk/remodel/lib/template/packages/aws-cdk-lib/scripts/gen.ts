import { generateAll, ModuleMap } from '@aws-cdk/cfn2ts';
import * as fs from 'fs-extra';
import * as path from 'path';
import { main as genRegionInfoBuiltins } from '../region-info/build-tools/generate-static-data';

const awsCdkLibDir = path.join(__dirname, '..');
const pkgJsonPath = path.join(awsCdkLibDir, 'package.json');
const topLevelIndexFilePath = path.join(awsCdkLibDir, 'index.ts');

main()
  .then(() => process.exit(0))
  // eslint-ignore-next-line no-console
  .catch(console.error)

async function main() {
  // Generate all L1s based on config in scope-map.json
  const scopeMapPath = path.join(__dirname, 'scope-map.json');

  const generated = await generateAll(awsCdkLibDir, {
    coreImport: '../../core',
    cloudwatchImport: '../../aws-cloudwatch',
    scopeMapPath,
  });

  // Add any new cfn modules to exports in package.json and index.ts
  await updatePackageJsonAndIndexFiles(generated);
  
  // Update scope-map config with any changes
  const newScopeMap = Object.entries(generated)
    .reduce((accum, [moduleName, { scopes }]) => {
      return {
        ...accum,
        [moduleName]: scopes,
      }
    }, {});
  await fs.writeJson(scopeMapPath, newScopeMap, { spaces: 2 });

  // Call build-tools within modules for other codegen
  // TODO: Move these up into aws-cdk-libs/scripts
  require('../aws-events-targets/build-tools/gen.js');
  require('../cloudformation-include/build.js');
  await genRegionInfoBuiltins();
}

async function updatePackageJsonAndIndexFiles(modules: ModuleMap) {
  const pkgJson = await fs.readJson(pkgJsonPath);

  const topLevelIndexFileEntries = new Array<string>();
  if (fs.existsSync(topLevelIndexFilePath)) {
    const indexFile = await fs.readFile(topLevelIndexFilePath);
    topLevelIndexFileEntries.push(...indexFile.toString('utf-8').split('\n'));
  }

  Object.entries(modules)
    .forEach(([moduleName, { module }]) => {
      let moduleConfig: { name: string, submodule: string };
      if (module) {
        moduleConfig = {
          name: module.moduleName,
          submodule: module.submoduleName,
        };
      } else {
        moduleConfig = {
          name: moduleName,
          submodule: moduleName.replace(/-/g, '_'),
        }
      }

      const exportName = `./${moduleConfig.name}`;
      if (!pkgJson.exports[exportName]) {
        pkgJson.exports[exportName] = `./${moduleConfig.name}/index.js`;
      }

      if (!topLevelIndexFileEntries.find(e => e.includes(moduleConfig.name))) {
        topLevelIndexFileEntries.push(`export * as ${moduleConfig.submodule} from './${moduleConfig.name}';`);
      }
    });

  await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
  await fs.writeFile(topLevelIndexFilePath, topLevelIndexFileEntries.join('\n'));
}
