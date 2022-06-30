#!/usr/bin/env node

/**
 * automatically creates a module for any CloudFormation namespaces that do not
 * have an AWS construct library.
 */

import * as path from 'path';
import * as pkglint from '@aws-cdk/pkglint';
import * as fs from 'fs-extra';
import * as cfnspec from '../lib';

// don't be a prude:
/* eslint-disable no-console */
/* eslint-disable quote-props */

async function main() {
  const root = path.join(__dirname, '..', '..');
  if (path.basename(root) !== '@aws-cdk') {
    throw new Error(`Something went wrong. We expected ${root} to be the "packages/@aws-cdk" directory. Did you move me?`);
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const cfnSpecPkgJson = require('../package.json');
  const version = cfnSpecPkgJson.version;
  const jestTypesVersion = cfnSpecPkgJson.devDependencies['@types/jest'];

  // iterate over all cloudformation namespaces
  for (const namespace of cfnspec.namespaces()) {
    const module = pkglint.createModuleDefinitionFromCfnNamespace(namespace);
    const lowcaseModuleName = module.moduleBaseName.toLocaleLowerCase();
    const packagePath = path.join(root, module.moduleName);

    // we already have a module for this namesapce, move on.
    if (await fs.pathExists(packagePath)) {
      const packageJsonPath = path.join(packagePath, 'package.json');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const packageJson = require(packageJsonPath);
      let scopes: string | string[] = packageJson['cdk-build'].cloudformation;
      if (typeof scopes === 'string') { scopes = [scopes]; }
      if (scopes.indexOf(namespace) !== -1) {
        // V2-style module is already modeled in the root package, nothing to be done!
        continue;
      } else if (await fs.pathExists(path.join(root, `${module.moduleFamily}-${module.moduleBaseName}`.toLocaleLowerCase()))) {
        // V2-style package already has it's own package (legacy behavior), nothing to be done!
        continue;
      } else {
        // V2-style package needs to be added to it's "V1" package... Get down to business!
        console.error(`Adding ${namespace} to ${module.packageName}`);
        scopes.push(namespace);
        packageJson['cdk-build'].cloudformation = scopes;
        await fs.writeJson(packageJsonPath, packageJson, { encoding: 'utf-8', spaces: 2 });
        const indexTsPath = path.join(packagePath, 'lib', 'index.ts');
        const indexTs = [
          (await fs.readFile(indexTsPath, { encoding: 'utf8' })).trimRight(),
          `// ${namespace} CloudFormation Resources:`,
          `export * from './${lowcaseModuleName}.generated';`,
        ].join('\n');
        await fs.writeFile(indexTsPath, indexTs, { encoding: 'utf8' });
        continue;
      }
    }

    async function write(relativePath: string, contents: string[] | string | object) {
      const fullPath = path.join(packagePath, relativePath);
      const dir = path.dirname(fullPath);
      await fs.mkdirp(dir);

      let data;
      if (typeof contents === 'string') {
        data = contents.trimLeft(); // trim first newline
      } else if (Array.isArray(contents)) {
        data = contents.join('\n');
      } else if (typeof contents === 'object') {
        data = JSON.stringify(contents, undefined, 2);
      } else {
        throw new Error('Invalid type of contents: ' + contents);
      }

      await fs.writeFile(fullPath, data + '\n');
    }

    console.log(`generating module for ${module.packageName}...`);

    const description = `${namespace} Construct Library`;

    await write('package.json', {
      name: module.packageName,
      version,
      description,
      main: 'lib/index.js',
      types: 'lib/index.d.ts',
      jsii: {
        outdir: 'dist',
        projectReferences: true,
        targets: {
          dotnet: {
            namespace: module.dotnetPackage,
            packageId: module.dotnetPackage,
            signAssembly: true,
            assemblyOriginatorKeyFile: '../../key.snk',
            iconUrl: 'https://raw.githubusercontent.com/aws/aws-cdk/main/logo/default-256-dark.png',
          },
          java: {
            package: `${module.javaGroupId}.${module.javaPackage}`,
            maven: {
              groupId: module.javaGroupId,
              artifactId: module.javaArtifactId,
            },
          },
          python: {
            classifiers: [
              'Framework :: AWS CDK',
              'Framework :: AWS CDK :: 1',
            ],
            distName: module.pythonDistName,
            module: module.pythonModuleName,
          },
        },
        metadata: {
          jsii: {
            rosetta: {
              strict: true,
            },
          },
        },
      },
      repository: {
        type: 'git',
        url: 'https://github.com/aws/aws-cdk.git',
        directory: `packages/${module.packageName}`,
      },
      homepage: 'https://github.com/aws/aws-cdk',
      scripts: {
        build: 'cdk-build',
        watch: 'cdk-watch',
        lint: 'cdk-lint',
        test: 'cdk-test',
        integ: 'cdk-integ',
        pkglint: 'pkglint -f',
        package: 'cdk-package',
        awslint: 'cdk-awslint',
        cfn2ts: 'cfn2ts',
        'build+test': 'yarn build && yarn test',
        'build+test+package': 'yarn build+test && yarn package',
        compat: 'cdk-compat',
        gen: 'cfn2ts',
        'rosetta:extract': 'yarn --silent jsii-rosetta extract',
        'build+extract': 'yarn build && yarn rosetta:extract',
        'build+test+extract': 'yarn build+test && yarn rosetta:extract',
      },
      'cdk-build': {
        cloudformation: namespace,
        jest: true,
        env: {
          AWSLINT_BASE_CONSTRUCT: 'true',
        },
      },
      keywords: [
        'aws',
        'cdk',
        'constructs',
        namespace,
        module.moduleName,
      ],
      author: {
        name: 'Amazon Web Services',
        url: 'https://aws.amazon.com',
        organization: true,
      },
      license: 'Apache-2.0',
      devDependencies: {
        '@aws-cdk/assertions': version,
        '@aws-cdk/cdk-build-tools': version,
        '@aws-cdk/cfn2ts': version,
        '@aws-cdk/pkglint': version,
        '@types/jest': jestTypesVersion,
      },
      dependencies: {
        '@aws-cdk/core': version,
      },
      peerDependencies: {
        '@aws-cdk/core': version,
      },
      engines: {
        node: '>= 14.15.0',
      },
      stability: 'experimental',
      maturity: 'cfn-only',
      awscdkio: {
        announce: false,
      },
      publishConfig: {
        tag: 'latest',
      },
    });

    await write('.gitignore', [
      '*.js',
      '*.js.map',
      '*.d.ts',
      'tsconfig.json',
      'node_modules',
      '*.generated.ts',
      'dist',
      '.jsii',
      '',
      '.LAST_BUILD',
      '.nyc_output',
      'coverage',
      '.nycrc',
      '.LAST_PACKAGE',
      '*.snk',
      'nyc.config.js',
      '!.eslintrc.js',
      '!jest.config.js',
      'junit.xml',
    ]);

    await write('.npmignore', [
      '# Don\'t include original .ts files when doing `npm pack`',
      '*.ts',
      '!*.d.ts',
      'coverage',
      '.nyc_output',
      '*.tgz',
      '',
      'dist',
      '.LAST_PACKAGE',
      '.LAST_BUILD',
      '!*.js',
      '',
      '# Include .jsii',
      '!.jsii',
      '',
      '*.snk',
      '',
      '*.tsbuildinfo',
      '',
      'tsconfig.json',
      '',
      '.eslintrc.js',
      'jest.config.js',
      '',
      '# exclude cdk artifacts',
      '**/cdk.out',
      'junit.xml',
      'test/',
      '!*.lit.ts',
    ]);

    await write('lib/index.ts', [
      `// ${namespace} CloudFormation Resources:`,
      `export * from './${lowcaseModuleName}.generated';`,
    ]);

    await write(`test/${lowcaseModuleName}.test.ts`, [
      "import '@aws-cdk/assertions';",
      "import {} from '../lib';",
      '',
      "test('No tests are specified for this package', () => {",
      '  expect(true).toBe(true);',
      '});',
    ]);

    await pkglint.createLibraryReadme(namespace, path.join(packagePath, 'README.md'));

    await write('.eslintrc.js', [
      "const baseConfig = require('@aws-cdk/cdk-build-tools/config/eslintrc');",
      "baseConfig.parserOptions.project = __dirname + '/tsconfig.json';",
      'module.exports = baseConfig;',
    ]);

    await write('jest.config.js', [
      "const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');",
      'module.exports = baseConfig;',
    ]);

    await write('rosetta/default.ts-fixture', [
      "import { Construct } from 'constructs';",
      "import { Stack } from '@aws-cdk/core';",
      '',
      'class MyStack extends Stack {',
      '  constructor(scope: Construct, id: string) {',
      '    /// here',
      '  }',
      '}',
    ]);

    const templateDir = path.join(__dirname, 'template');
    for (const file of await fs.readdir(templateDir)) {
      await fs.copy(path.join(templateDir, file), path.join(packagePath, file));
    }

    await addDependencyToMegaPackage(path.join('@aws-cdk', 'cloudformation-include'), module.packageName, version, ['dependencies', 'peerDependencies']);
    await addDependencyToMegaPackage('aws-cdk-lib', module.packageName, version, ['devDependencies']);
    await addDependencyToMegaPackage('monocdk', module.packageName, version, ['devDependencies']);
  }
}

/**
 * A few of our packages (e.g., aws-cdk-lib) require a dependency on every service package.
 * This automates adding the dependency (and peer dependency) to the package.json.
 */
async function addDependencyToMegaPackage(megaPackageName: string, packageName: string, version: string, dependencyTypes: string[]) {
  const packageJsonPath = path.join(__dirname, '..', '..', '..', megaPackageName, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  dependencyTypes.forEach(dependencyType => {
    const unorderedDeps = {
      ...packageJson[dependencyType],
      [packageName]: version,
    };
    packageJson[dependencyType] = {};
    Object.keys(unorderedDeps).sort().forEach(k => {
      packageJson[dependencyType][k] = unorderedDeps[k];
    });
  });
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
