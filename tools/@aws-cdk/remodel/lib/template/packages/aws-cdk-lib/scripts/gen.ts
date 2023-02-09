import { generateAll } from '@aws-cdk/cfn2ts';
import { ModuleDefinition } from '@aws-cdk/pkglint';
import * as fs from 'fs-extra';
import * as path from 'path';

const awsCdkLibDir = path.join(__dirname, '..');
const srcDir = path.join(awsCdkLibDir, 'lib');
const pkgJsonPath = path.join(awsCdkLibDir, 'package.json');
const topLevelIndexFilePath = path.join(srcDir, 'index.ts');



main()
  .then(() => process.exit(0))
  // eslint-ignore-next-line no-console
  .catch(console.error)

async function main() {
  const generated = await generateAll(srcDir, {
    coreImport: '../../core',
  });

  updatePackageJsonAndIndexFiles(generated);
}

function updatePackageJsonAndIndexFiles(modules: ModuleDefinition[]) {
  const pkgJson = fs.readJsonSync(pkgJsonPath);
  const topLevelIndexFileEntries = new Array<string>();
  if (fs.existsSync(topLevelIndexFilePath)) {
    topLevelIndexFileEntries.push(...(fs.readFileSync(topLevelIndexFilePath)).toString('utf-8').split('\n'));
  }

  modules.forEach((module) => {
    if (!pkgJson.exports[`./${module.moduleName}`]) {
      pkgJson.exports[`./${module.moduleName}`] = `./${module.moduleName}/index.js`;
    }
    if (!topLevelIndexFileEntries.find(e => e.includes(module.moduleName))) {
      topLevelIndexFileEntries.push(`export * as ${module.submoduleName} from './${module.moduleName}';`);
    }  
  });

  fs.writeJsonSync(pkgJsonPath, pkgJson, { spaces: 2 });
  fs.writeFileSync(topLevelIndexFilePath, topLevelIndexFileEntries.join('\n'));
}
