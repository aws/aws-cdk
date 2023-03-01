import * as path from 'path';
import * as fs from 'fs-extra';

export async function findIntegFiles(dir: string): Promise<string[]> {
  const items = await fs.readdir(dir);

  const paths = await Promise.all(items.map(async (item) => {
    const resolved = path.resolve(dir, item);
    const stat = await fs.stat(resolved);
    if (stat.isDirectory()) {
      // it's a snapshot directory bring the whole thing
      if (/^integ\..*\.snapshot$/.test(item)) {
        return path.join(dir, item);
      }

      return findIntegFiles(path.join(dir, item));
    } else if (/^integ\..*\.ts$/.test(item)) {
      return path.join(dir, item);
    }
    return undefined;
  }));

  //TS compains about using `flatMap` above in place of map
  return paths.flat().filter(x => Boolean(x)) as string[];
}

export function rewritePath(importPath: string, currentModule: string, relativeDepth: number) {
  const base = 'aws-cdk-lib';
  let newModuleSpecifier = importPath;

  const selfImportPath = [
    ...new Array(relativeDepth - 1).fill('..'),
    'lib',
  ].join('/');
  const otherImportPath = new Array(relativeDepth).fill('..').join('/');

  if (importPath.startsWith(selfImportPath)) {
    const suffix = new RegExp(`${selfImportPath}/(.+)`).exec(importPath)?.[1];
    newModuleSpecifier = `${base}/${currentModule}`;
    + (importPath === selfImportPath ? '' : '/lib')
    + (suffix ? `/${suffix}` : '');
  } else if (importPath.startsWith(otherImportPath)) {
    newModuleSpecifier = importPath.replace(otherImportPath, 'aws-cdk-lib');
  }

  return newModuleSpecifier;
}

const integRegx = new RegExp('@aws-cdk-testing/framework-integ/test/(.+)/test');
const importRegex = new RegExp('from \'(.*)\'');
export async function rewriteIntegTestImports(filePath: string, relativeDepth: number) {
  const matches = integRegx.exec(filePath);
  const currentModule = matches?.[1];
  if (!currentModule) throw new Error(`Can't parse module from path ${filePath}`);

  const lines = (await fs.readFile(filePath, 'utf8'))
    .split('\n')
    .map((line) => {
      const importMatches = importRegex.exec(line);
      const importPath = importMatches?.[1];

      if (importPath) {
        const newPath = rewritePath(importPath, currentModule, relativeDepth);
        return line.replace(/(?<=.*from ')(.*)(?=')/, `${newPath}`);
      }

      return line;
    });

  await fs.writeFile(filePath, lines.join('\n'));
}
