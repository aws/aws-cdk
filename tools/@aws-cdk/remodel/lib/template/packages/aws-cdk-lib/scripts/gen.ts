import { generateAll } from '@aws-cdk/cfn2ts';
import * as fs from 'fs-extra';
import * as path from 'path';

const srcDir = path.join(__dirname, '..', 'lib');
const modulesGenerated = await generateAll(srcDir, {
  coreImport: 'aws-cdk-lib',
});

const awsCdkLibDir = path.join(__dirname, '..');

const pkgJsonPath = path.join(awsCdkLibDir, 'package.json');
const pkgJson = await fs.readJson(pkgJsonPath);
modulesGenerated.forEach((module) => {
  if (!pkgJson.exports[`./${module.moduleName}`]) {
    pkgJson.exports[`./${module.moduleName}`] = `./lib/${module.moduleName}/index.js`;
  }
});

const topLevelIndexFilePath = path.join(awsCdkLibDir, 'index.ts');
const topLevelIndexFileEntries: string[] = [];
if (fs.existsSync(topLevelIndexFilePath)) {
  topLevelIndexFileEntries.push(...(await fs.readFile(topLevelIndexFilePath)).toString('utf-8').split('\n'));
}

modulesGenerated.forEach((module) => {
  // Add export to top-level index.ts if it's not there yet.
  if (!topLevelIndexFileEntries.find(e => e.includes(module.moduleName))) {
    topLevelIndexFileEntries.push(`export * as ${module.submoduleName} from './lib/${module.moduleName}';`);
  }
  
  // Add export to the package.json if it's not there yet.
  if (!pkgJson.exports[`./${module.moduleName}`]) {
    pkgJson.exports[`./${module.moduleName}`] = `./lib/${module.moduleName}/index.js`;
  }
});


await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
await fs.writeFile(topLevelIndexFilePath, topLevelIndexFileEntries.join('\n'));