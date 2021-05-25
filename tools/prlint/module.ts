import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as path from 'path';

const modules: string[] = [];

export function findModulePaths(fuzz: string): string[] {
  if (modules.length === 0) {
    const repoRoot = path.join(__dirname, '..', '..');
    const lernaConfig = require(path.join(repoRoot, 'lerna.json'));
    const searchPaths: string[] = lernaConfig.packages;
    searchPaths.forEach(p => {
      const globMatches = glob.sync(path.join(repoRoot, p));
      const filtered = globMatches.filter(m => fs.existsSync(path.join(m, 'package.json')));
      modules.push(...filtered);
    });
  }
  
  const regex = new RegExp(`(?<=[-_/])${fuzz}$`)
  return modules.filter(m => regex.test(m));
}

export function moduleStability(loc: string): 'stable' | 'experimental' | undefined {
  if (!fs.existsSync(path.join(loc, 'package.json'))) {
    return undefined;
  }
  const pkgjson = require(path.join(loc, 'package.json'));
  return pkgjson.stability;
}