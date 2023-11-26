import * as path from 'path';
import * as fs from 'fs-extra';
import * as glob from 'glob';

let awsCdkLibPath: string;
const modules: string[] = [];
const awsCdkLibModules: string[] = [];

export function findModulePath(fuzz: string): string {
  discoverModules();

  const regex = new RegExp(`[-_/]${fuzz}($|-alpha)`);
  const matched = [
    ...modules.filter(m => regex.test(m)),
    ...(awsCdkLibModules.some(m => regex.test(m)) ? [awsCdkLibPath] : []),
  ];
  console.log({ matched });

  if (matched.length === 0) {
    throw new Error(`No module with name '${fuzz}' in the repo`);
  } else if (matched.length > 1) {
    // if multiple fuzzy matches, use an exact match
    // if there are multiple exact matches, give up and return the first
    return matched.find(m => path.basename(m) === fuzz) || matched[0];
  }
  return matched[0];
}

function discoverModules() {
  if (modules.length === 0) {
    if (!process.env.REPO_ROOT) {
      throw new Error('env REPO_ROOT must be set');
    }
    const repoRoot = process.env.REPO_ROOT;
    const lernaConfig = require(path.join(repoRoot, 'lerna.json')); // eslint-disable-line @typescript-eslint/no-require-imports
    const searchPaths: string[] = lernaConfig.packages;
    awsCdkLibPath = path.join(repoRoot, 'packages', 'aws-cdk-lib');
    searchPaths.forEach(p => {
      const globMatches = glob.sync(path.join(repoRoot, p, 'package.json'));
      const trimmed = globMatches.map(m => path.dirname(m));
      modules.push(...trimmed);
    });
    discoverAwsCdkLibModules();

    if (modules.length === 0 || awsCdkLibModules.length === 0) {
      throw new Error('unexpected: discovered no modules. ' +
        'Check that you have set REPO_ROOT correctly.');
    }
  }
}

function discoverAwsCdkLibModules() {
  if (!process.env.REPO_ROOT) {
    throw new Error('env REPO_ROOT must be set');
  }

  if (awsCdkLibModules.length === 0) {
    const pkgJson = fs.readJsonSync(path.join(awsCdkLibPath, 'package.json'));
    Object.keys(pkgJson.exports ?? {}).forEach((exportKey) => {
      const formatted = exportKey.replace('./', '');
      awsCdkLibModules.push(formatted);
    });
  }
}

export function moduleStability(loc: string): 'stable' | 'experimental' | undefined {
  if (!fs.existsSync(path.join(loc, 'package.json'))) {
    throw new Error(`unexpected: no package.json found at location "${loc}"`);
  }
  const pkgjson = require(path.join(loc, 'package.json')); // eslint-disable-line @typescript-eslint/no-require-imports
  return pkgjson.stability;
}
