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

  await updatePackageJsonAndIndexFiles(generated);
}

async function updatePackageJsonAndIndexFiles(modules: ModuleDefinition[]) {
  const pkgJson = await fs.readJson(pkgJsonPath);

  const topLevelIndexFileEntries = new Array<string>();
  if (fs.existsSync(topLevelIndexFilePath)) {
    const indexFile = await fs.readFile(topLevelIndexFilePath);
    topLevelIndexFileEntries.push(...indexFile.toString('utf-8').split('\n'));
  }

  modules.forEach((module) => {
    if (!pkgJson.exports[`./${module.moduleName}`]) {
      pkgJson.exports[`./${module.moduleName}`] = `./lib/${module.moduleName}/index.js`;
    }
    if (!topLevelIndexFileEntries.find(e => e.includes(module.moduleName))) {
      topLevelIndexFileEntries.push(`export * as ${module.submoduleName} from './${module.moduleName}';`);
    }
  });

  await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
  await fs.writeFile(topLevelIndexFilePath, topLevelIndexFileEntries.join('\n'));
}
