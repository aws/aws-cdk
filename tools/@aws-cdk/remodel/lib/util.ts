import * as path from 'path';
import * as fs from 'fs-extra';

export async function discoverIntegPaths(dir: string): Promise<IntegPath[]> {
  const items = await fs.readdir(dir);

  const paths = await Promise.all(items.map(async (item) => {
    const resolved = path.resolve(dir, item);
    const stat = await fs.stat(resolved);
    if (stat.isDirectory()) {
      // it's a snapshot directory bring the whole thing
      if (/^integ\..*\.snapshot$/.test(item)) {
        return {
          path: path.join(dir, item),
          copy: false,
        };
      }

      return discoverIntegPaths(path.join(dir, item));
    } else if (/^integ\..*\.ts$/.test(item)) {
      return {
        path: path.join(dir, item),
        // Copy the .lit.ts items because they are still used in readmes in aws-cdk-lib
        copy: item.endsWith('.lit.ts'),
      };
    }
    return undefined;
  }));

  //TS compains about using `flatMap` above in place of map
  return paths.flat().filter(x => Boolean(x)) as IntegPath[];
}

interface IntegPath {
  path: string;
  copy: boolean;
}

export async function findIntegFiles(dir: string): Promise<IntegPath[]> {
  const discovered = await discoverIntegPaths(dir);

  // extra files used by integ test files
  const extraPaths = [
    'aws-cloudfront/test/test-origin.ts',
    {
      path: 'aws-eks/test/integ-tests-kubernetes-version.ts',
      copy: false,
    },
    'aws-eks/test/hello-k8s.ts',
    'aws-eks/test/pinger/function',
    'aws-eks/test/pinger/pinger.ts',
    'aws-eks/test/bucket-pinger/function',
    'aws-eks/test/bucket-pinger/bucket-pinger.ts',
    'aws-lambda-event-sources/test/test-function.ts',
    'custom-resources/test/provider-framework/integration-test-fixtures/s3-assert-handler',
    'custom-resources/test/provider-framework/integration-test-fixtures/s3-file-handler',
    'custom-resources/test/provider-framework/integration-test-fixtures/s3-assert.ts',
    'custom-resources/test/provider-framework/integration-test-fixtures/s3-file.ts',
    'pipelines/test/testhelpers/assets',
    'pipelines/test/testhelpers/compliance.ts',
    'pipelines/test/testhelpers/index.ts',
    'pipelines/test/testhelpers/legacy-pipeline.ts',
    'pipelines/test/testhelpers/modern-pipeline.ts',
    'pipelines/test/testhelpers/matchers.ts',
    'pipelines/test/testhelpers/test-app.ts',
  ].map((p) => {
    if (typeof p === 'string') {
      return {
        path: path.join(dir, p),
        copy: true,
      };
    }
    return p;
  });

  //TS compains about using `flatMap` above in place of map
  return [
    ...discovered,
    ...extraPaths,
  ];
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
    const subModulePath = new RegExp(`${selfImportPath}/(.+)`).exec(importPath)?.[1];
    const suffix = `${importPath === selfImportPath ? '' : '/lib'}${subModulePath ? `/${subModulePath}` : ''}`;
    newModuleSpecifier = `${base}/${currentModule}${suffix}`;
  } else if (importPath.startsWith(otherImportPath)) {
    if (importPath.includes('integ-tests')) {
      newModuleSpecifier = '@aws-cdk/integ-tests-alpha';
    } else if (importPath.includes('core')) {
      newModuleSpecifier = 'aws-cdk-lib';
    } else {
      newModuleSpecifier = importPath.replace(otherImportPath, 'aws-cdk-lib');
    }
  }

  return newModuleSpecifier;
}

// Capture the name of the paths current module
const integRegx = new RegExp('@aws-cdk-testing/framework-integ/test/(.+?)/test');
// Capture the path that the import refers to
const importRegex = new RegExp('from [\'"](.*)[\'"]');
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
        return line.replace(/(?<=.*from ["'])(.*)(?=["'])/, `${newPath}`);
      }

      return line;
    });

  await fs.writeFile(filePath, lines.join('\n'));
}

export async function addTypesReference(filePath: string) {
  const lines = (await fs.readFile(filePath, 'utf8'))
    .split('\n');

  const newContents = [
    '/// <reference path="../../../../../../../../../node_modules/aws-cdk-lib/custom-resources/lib/provider-framework/types.d.ts" />',
    ...lines,
  ].join('\n');

  await fs.writeFile(filePath, newContents);
}
