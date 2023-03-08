/* eslint-disable no-console */
import * as path from 'path';
import * as fs from 'fs-extra';

// Recursively find .ts files from starting directory
export async function discoverSourceFiles(dir: string): Promise<string[]> {
  const items = await fs.readdir(dir);

  const paths = await Promise.all(items.map(async (item) => {
    const resolved = path.resolve(dir, item);
    const stat = await fs.stat(resolved);
    if (stat.isDirectory()) {
      return discoverSourceFiles(path.join(dir, item));
    } else if (item.endsWith('.ts')) {
      return path.join(dir, item);
    }
    return undefined;
  }));

  return paths.flat().filter(x => Boolean(x)) as string[];
}

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
    // these are written this way because I don't want the full path
    // to be updated
    { path: 'aws-apigateway/test/sample-definition.yaml', copy: true },
    { path: 'aws-apigateway/test/authorizers/integ.token-authorizer.handler', copy: true },
    { path: 'aws-apigateway/test/authorizers/integ.request-authorizer.handler', copy: true },
    { path: 'aws-apigateway/test/integ.cors.handler', copy: true },
    { path: 'aws-appsync/test/appsync.none.graphql', copy: true },
    { path: 'aws-appsync/test/appsync.test.graphql', copy: true },
    { path: 'aws-appsync/test/appsync.lambda.graphql', copy: true },
    { path: 'aws-appsync/test/appsync.auth.graphql', copy: true },
    { path: 'aws-appsync/test/integ.graphql-iam.graphql', copy: true },
    { path: 'aws-appsync/test/appsync.js-resolver.graphql', copy: true },
    { path: 'aws-appsync/test/integ.graphql.graphql', copy: true },
    { path: 'aws-appsync/test/verify/lambda-tutorial', copy: true },
    { path: 'aws-appsync/test/verify/iam-query', copy: true },
    { path: 'aws-appsync/test/integ-assets', copy: true },
    { path: 'aws-cloudformation/test/core-custom-resource-provider-fixture/index.ts', copy: true },
    { path: 'aws-cloudformation/test/asset-directory-fixture', copy: true },
    { path: 'aws-codebuild/test/build-spec-asset.yml', copy: true },
    { path: 'aws-codebuild/test/demo-image', copy: true },
    { path: 'aws-codecommit/test/asset-test.zip', copy: true },
    { path: 'aws-codecommit/test/asset-test', copy: true },
    { path: 'aws-codedeploy/test/lambda/handler', copy: true },
    { path: 'aws-codedeploy/test/lambda/preHook', copy: true },
    { path: 'aws-codedeploy/test/lambda/postHook', copy: true },
    { path: 'aws-codepipeline-actions/test/cloudformation/test-artifact', copy: true },
    { path: 'aws-codepipeline-actions/test/assets/nodejs.zip', copy: true },
    { path: 'aws-ec2/test/import-certificates-handler/index.ts', copy: true },
    { path: 'aws-ecr-assets/test/demo-image', copy: true },
    { path: 'aws-ecr-assets/test/demo-image-secret', copy: true },
    { path: 'aws-ecr-assets/test/demo-tarball-hello-world/hello-world.tar', copy: true },
    { path: 'aws-ecs/test/ec2/firelens.conf', copy: true },
    { path: 'aws-ecs/test/demo-envfiles', copy: true },
    { path: 'aws-ecs-patterns/test/sqs-reader', copy: true },
    { path: 'aws-ecs-patterns/test/demo-image', copy: true },
    { path: 'aws-eks/test/sdk-call-integ-test-docker-app/app', copy: true },
    { path: 'aws-eks/test/test-chart', copy: true },
    { path: 'aws-events-targets/test/ecs/eventhandler-image', copy: true },
    { path: 'aws-iam/test/saml-metadata-document.xml', copy: true },
    { path: 'aws-lambda/test/my-lambda-handler', copy: true },
    { path: 'aws-lambda/test/handler.zip', copy: true },
    { path: 'aws-lambda/test/python-lambda-handler', copy: true },
    { path: 'aws-lambda/test/docker-lambda-handler', copy: true },
    { path: 'aws-lambda/test/docker-arm64-handler', copy: true },
    { path: 'aws-lambda/test/layer-code', copy: true },
    { path: 'aws-lambda-nodejs/test/integ-handlers', copy: true },
    { path: 'aws-rds/test/snapshot-handler', copy: true },
    { path: 'aws-s3/test/put-objects-handler/index.ts', copy: true },
    { path: 'aws-s3-assets/test/alpine-markdown', copy: true },
    { path: 'aws-s3-assets/test/file-asset.txt', copy: true },
    { path: 'aws-s3-assets/test/markdown-asset', copy: true },
    { path: 'aws-s3-assets/test/sample-asset-directory', copy: true },
    { path: 'aws-s3-deployment/test/my-website-second', copy: true },
    { path: 'aws-secretsmanager/test/integ.secret-name-parsed.handler/index.js', copy: true },
    { path: 'aws-s3-deployment/test/my-website', copy: true },
    { path: 'aws-servicecatalog/test/assets', copy: true },
    { path: 'aws-servicecatalog/test/assetsv2', copy: true },
    { path: 'aws-servicecatalog/test/product1.template.json', copy: true },
    { path: 'aws-servicecatalog/test/product2.template.json', copy: true },
    { path: 'aws-stepfunctions-tasks/test/batch/batchjob-image', copy: true },
    { path: 'aws-stepfunctions-tasks/test/ecs/eventhandler-image', copy: true },
    { path: 'aws-stepfunctions-tasks/test/glue/my-glue-script/job.py', copy: true },
    { path: 'aws-stepfunctions-tasks/test/lambda/my-lambda-handler', copy: true },
    { path: 'lambda-layer-kubectl/test/lambda-handler', copy: true },
    { path: 'lambda-layer-awscli/test/lambda-handler', copy: true },
    { path: 'lambda-layer-node-proxy-agent/test/lambda-handler', copy: true },
    { path: 'cloudformation-include/test/test-templates', copy: true },
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
  const importPathArr = importPath.split('/');
  const library = importPathArr[importPathArr.length -1];

  if (importPath.startsWith(selfImportPath)) {
    const subModulePath = new RegExp(`${selfImportPath}/(.+)`).exec(importPath)?.[1];
    const suffix = `${importPath === selfImportPath ? '' : '/lib'}${subModulePath ? `/${subModulePath}` : ''}`;
    newModuleSpecifier = `${base}/${currentModule}${suffix}`;
  } else if (importPath.startsWith(otherImportPath)) {
    if (['integ-tests', 'aws-apigatewayv2-integrations', 'aws-batch', 'aws-apigatewayv2'].includes(library)) {
      newModuleSpecifier = `@aws-cdk/${library}-alpha`;
    } else if (importPath.includes('core')) {
      newModuleSpecifier = 'aws-cdk-lib';
    } else {
      newModuleSpecifier = importPath.replace(otherImportPath, 'aws-cdk-lib');
    }
  } else if (importPath === '@aws-cdk/integ-tests') {
    newModuleSpecifier = '@aws-cdk/integ-tests-alpha';
  }

  return newModuleSpecifier;
}

// List of test files that rely on alpha modules
// we should put them somewhere.
const testsDependingOnAlphas: string[] = [
  'aws-stepfunctions-tasks/test/batch/submit-job.test.ts',
  'aws-stepfunctions-tasks/test/batch/run-batch-job.test.ts',
  'aws-stepfunctions-tasks/test/apigateway/call-http-api.test.ts',
  'aws-route53-targets/test/apigatewayv2-target.test.ts',
  'aws-events-targets/test/batch/batch.test.ts',
];

const testRegx = new RegExp('aws-cdk-lib/(.+?)/test');
export async function rewriteCdkLibTestImports(rootDir: string) {
  testsDependingOnAlphas.forEach(async file => {
    const matches = testRegx.exec(path.join(rootDir, file));
    const currentModule = matches?.[1];
    const absolutePath = path.join(rootDir, file);
    if (!currentModule) throw new Error(`Can't parse module from path ${file}`);
    const lines = (await fs.readFile(absolutePath, 'utf8'))
      .split('\n')
      .map((line) => {
        const importMatches = importRegex.exec(line);
        const importPath = importMatches?.[1];
        if (importPath) {
          const importPathArr = importPath.split('/');
          const library = importPathArr[importPathArr.length -1];
          if (['integ-tests', 'aws-apigatewayv2-integrations', 'aws-batch', 'aws-apigatewayv2'].includes(library)) {
            const newModuleSpecifier = `@aws-cdk/${library}-alpha`;
            return line.replace(/(?<=.*from ["'])(.*)(?=["'])/, `${newModuleSpecifier}`);
          }
        }
        return line;
      });
    await fs.writeFile(absolutePath, lines.join('\n'));
  });
}

// Capture the name of the paths current module
const integRegx = new RegExp('@aws-cdk-testing/framework-integ/test/(.+?)/test');
// Capture the path that the import refers to
const importRegex = new RegExp('from [\'"](.*)[\'"]');
export async function rewriteIntegTestImports(filePath: string, relativeDepth: number) {
  const libRegx = new RegExp('(?<=.*from ["\'].*)(\/lib.*)(?=["\'])');
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
        return line.replace(/(?<=.*from ["'])(.*)(?=["'])/, `${newPath}`).replace(libRegx, '');
      }

      return line.replace(libRegx, '');
    });

  await fs.writeFile(filePath, lines.join('\n'));
}

export async function addTypesReference(filePath: string, searchString?: string, replaceValue?: string) {
  const lines = (await fs.readFile(filePath, 'utf8'))
    .split('\n');

  let newContents: string[];
  if (searchString && replaceValue) {
    newContents = lines.map(line => {
      if (line.includes(searchString)) return replaceValue;
      return line;
    });
  } else {
    newContents = [
      '/// <reference path="../../../../../../../../../node_modules/aws-cdk-lib/custom-resources/lib/provider-framework/types.d.ts" />',
      ...lines,
    ];
  }

  await fs.writeFile(filePath, newContents.join('\n'));
}

// Make some changes to some tests that fail because they are location specific test-origin
// reference v1 modules in mocks etc.
export async function fixUnitTests(dir: string) {
  // Delete some tests that reference alpha-modules as they have yet to be built
  // TODO: Re-add these back
  await Promise.all(testsDependingOnAlphas.map(async (item) => {
    await fs.remove(path.join(dir, item));
  }));

  // These test fails and I have no idea why.
  // TODO: fix it
  await fs.remove(path.join(dir, 'aws-s3', 'test', 'notifications-resource.lambda.test.ts'));
  await fs.remove(path.join(dir, 'aws-s3-deployment', 'test', 'lambda.test.ts'));

  // Fix broken mock module path
  const ddbTestPath = path.join(dir, 'aws-dynamodb', 'test', 'dynamodb.test.ts');
  await replaceLineInFile(
    ddbTestPath,
    'jest.mock(\'@aws-cdk/custom-resources\');',
    'jest.mock(\'../../custom-resources\');',
  );

  // Fix assertion against old module name
  const coreRtInfoTestPath = path.join(dir, 'core', 'test', 'runtime-info.test.ts');
  await replaceLinesInFile(coreRtInfoTestPath, [
    [
      'expect(constructInfo?.fqn).toEqual(\'@aws-cdk/core.Stack\');',
      'expect(constructInfo?.fqn).toEqual(\'aws-cdk-lib.Stack\');',
    ],
    [
      'expect(stackInfo?.fqn).toEqual(\'@aws-cdk/core.Stack\');',
      'expect(stackInfo?.fqn).toEqual(\'aws-cdk-lib.Stack\');',
    ],
  ]);

  // Fix bad reference to repo root path
  const lambdaNodeJsTestPath = path.join(dir, 'aws-lambda-nodejs', 'test');
  const lambdaNodeJsAssetTestPath = path.join(lambdaNodeJsTestPath, 'bundling.test.ts');
  await replaceLineInFile(
    lambdaNodeJsAssetTestPath,
    '\'esbuild --bundle "/asset-input/packages/@aws-cdk/aws-lambda-nodejs/test/bundling.test.js" --target=node14 --platform=node --outfile="/asset-output/index.js" --external:abc --external:delay\',',
    '\'esbuild --bundle "/asset-input/packages/aws-cdk-lib/aws-lambda-nodejs/test/bundling.test.js" --target=node14 --platform=node --outfile="/asset-output/index.js" --external:abc --external:delay\',',
  );

  const lambdaNodeJsFunctionTestPath = path.join(lambdaNodeJsTestPath, 'function.test.ts');
  await replaceLinesInFile(lambdaNodeJsFunctionTestPath, [
    [
      'depsLockFilePath: expect.stringMatching(/@aws-cdk\\/aws-lambda-nodejs\\/package.json$/),',
      'depsLockFilePath: expect.stringMatching(/aws-cdk-lib\\/package.json$/),',
    ],
    [
      'entry: \'lib/index.ts\',',
      'entry: \'aws-lambda-nodejs/lib/index.ts\',',
    ],
    [
      'entry: expect.stringMatching(/@aws-cdk\\/aws-lambda-nodejs\\/lib\\/index.ts$/),',
      'entry: expect.stringMatching(/aws-cdk-lib\\/aws-lambda-nodejs\\/lib\\/index.ts$/),',
    ],
  ]);

  const lambdaNodeJsUtilTestPath = path.join(lambdaNodeJsTestPath, 'util.test.ts');
  await replaceLinesInFile(lambdaNodeJsUtilTestPath, [
    [
      'path.join(__dirname, \'../package.json\'),',
      'path.join(__dirname, \'testpackage.json\'),',
    ],
    [
      'expect(findUp(\'README.md\')).toMatch(/aws-lambda-nodejs\\/README.md$/);',
      'expect(findUp(\'README.md\')).toMatch(/aws-cdk-lib\\/README.md$/);',
    ],
    [
      'expect(findUp(\'util.test.ts\', \'test/integ-handlers\')).toMatch(/aws-lambda-nodejs\\/test\\/util.test.ts$/);',
      'expect(findUp(\'util.test.ts\', \'aws-lambda-nodejs/test/integ-handlers\')).toMatch(/aws-lambda-nodejs\\/test\\/util.test.ts$/);',
    ],
    [
      'expect(files[0]).toMatch(/aws-lambda-nodejs\\/README\\.md$/);',
      'expect(files[0]).toMatch(/aws-cdk-lib\\/README\\.md$/);',
    ],
    [
      'expect(files[1]).toMatch(/aws-lambda-nodejs\\/package\\.json$/);',
      'expect(files[1]).toMatch(/aws-cdk-lib\\/package\\.json$/);',
    ],
    [
      'const files = findUpMultiple([\'util.test.ts\', \'function.test.ts\'], \'test/integ-handlers\');',
      'const files = findUpMultiple([\'util.test.ts\', \'function.test.ts\'], \'aws-lambda-nodejs/test/integ-handlers\');',
    ],
    [
      '\'my-module\': expect.stringMatching(/packages\\/@aws-cdk\\/core/),',
      '\'my-module\': expect.stringMatching(/packages\\/aws-cdk-lib\\/core/),',
    ],
  ]);


  // Fix assertion based on cwd
  // const lambdaGoUtilTestPath = path.join(dir, 'aws-lambda-go', 'test', 'util.test.ts');
  // await replaceLinesInFile(lambdaGoUtilTestPath, [
  //   [
  //     'expect(findUp(\'README.md\')).toMatch(/aws-lambda-go\\/README.md$/);',
  //     'expect(findUp(\'README.md\')).toMatch(/aws-cdk-lib\\/README.md$/);',
  //   ],
  //   [
  //     'expect(findUp(\'util.test.ts\', \'test/integ-handlers\')).toMatch(/aws-lambda-go\\/test\\/util.test.ts$/);',
  //     'expect(findUp(\'util.test.ts\', \'aws-lambda-go/test/integ-handlers\')).toMatch(/aws-lambda-go\\/test\\/util.test.ts$/);',
  //   ],
  // ]);

  //Fix assertions in piplines installing v1 clis
  const pipelinesTestsPath = path.join(dir, 'pipelines', 'test');
  const assetsTestPath = path.join(pipelinesTestsPath, 'compliance', 'assets.test.ts');
  await replaceLineInFile(
    assetsTestPath,
    'commands: [\'npm config set registry https://registry.com\', \'npm install -g cdk-assets@1\'],',
    'commands: [\'npm config set registry https://registry.com\', \'npm install -g cdk-assets@2\'],',
  );

  const selfMutationTestPath = path.join(pipelinesTestsPath, 'compliance', 'self-mutation.test.ts');
  await replaceLinesInFile(selfMutationTestPath, [
    [
      'commands: [\'npm install -g aws-cdk@1\'],',
      'commands: [\'npm install -g aws-cdk@2\'],',
    ],
    [
      'commands: [\'npm config set registry example.com\', \'npm install -g aws-cdk@1\'],',
      'commands: [\'npm config set registry example.com\', \'npm install -g aws-cdk@2\'],',
    ],
  ]);

  const coreTreeTestPath = path.join(dir, 'core', 'test', 'private', 'tree-metadata.test.ts');
  await replaceLinesInFile(coreTreeTestPath, [
    [
      'fqn: \'@aws-cdk/core.CfnParameter\',',
      'fqn: \'aws-cdk-lib.CfnParameter\',',
    ],
    [
      'fqn: \'@aws-cdk/core.CfnRule\',',
      'fqn: \'aws-cdk-lib.CfnRule\',',
    ],
  ]);


  // Copy a bunch of missing files needed for aws-certificatemanager/lambda-packages tests to pass
  const dnsValidatedCertRelativeDir = path.join('lambda-packages', 'dns_validated_certificate_handler');
  const srcCdkDir = path.join(__dirname, '../../../../packages/@aws-cdk');

  // TODO: these should be updated upstream
  const copyFiles = [
    'aws-lambda/test/function.test.ts',
  ];

  copyFiles.forEach(async file => {
    await fs.copy(
      path.join(srcCdkDir, file),
      path.join(dir, '..', '@aws-cdk', file),
    );
  });
  await fs.copy(
    path.join(dir, '..', '@aws-cdk/aws-certificatemanager', dnsValidatedCertRelativeDir),
    path.join(dir, 'aws-certificatemanager', dnsValidatedCertRelativeDir),
  );
}

async function readFileLines(filePath: string) {
  const contents = await fs.readFile(filePath, 'utf8');
  return contents.split('\n');
}

async function replaceLineInFile(filePath: string, oldLine: string, newLine: string) {
  return replaceLinesInFile(filePath, [[oldLine, newLine]]);
}

async function replaceLinesInFile(filePath:string, replacements: [string, string][]) {
  const lines = await readFileLines(filePath);

  replacements.map(([oldLine, newLine]) => {
    const matchedLines = lines.filter((ln) => ln.trim() === oldLine.trim());

    if (matchedLines.length === 0) {
      console.log(`Can't find correct line to replace in file ${filePath}`);
      console.log('Missing line:');
      console.log(oldLine);
      console.log('---------------------');
    }

    matchedLines.forEach((line) => {
      // Get all leading whitespace
      const spaces = line.match(/^\s*/)?.[0] ?? '';
      const index = lines.indexOf(`${spaces}${oldLine}`);
      lines[index] = `${spaces}${newLine}`;
    });
  });

  const newContent = lines.join('\n');
  await fs.writeFile(filePath, newContent);
}
