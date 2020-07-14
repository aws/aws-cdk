#!/usr/bin/env node

/**
 * automatically creates a module for any CloudFormation namespaces that do not
 * have an AWS construct library.
 */

import * as path from 'path';
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
  const version = require('../package.json').version;

  // iterate over all cloudformation namespaces
  for (const namespace of cfnspec.namespaces()) {
    const [moduleFamily, moduleBaseName] = (namespace === 'AWS::Serverless' ? 'AWS::SAM' : namespace).split('::');

    const moduleName = `${moduleFamily}-${moduleBaseName.replace(/V\d+$/, '')}`.toLocaleLowerCase();
    const packagePath = path.join(root, moduleName);

    const lowcaseModuleName = moduleBaseName.toLocaleLowerCase();
    const packageName = `@aws-cdk/${moduleName}`;

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
      } else if (await fs.pathExists(path.join(root, `${moduleFamily}-${moduleBaseName}`.toLocaleLowerCase()))) {
        // V2-style package already has it's own package (legacy behavior), nothing to be done!
        continue;
      } else {
        // V2-style package needs to be added to it's "V1" package... Get down to business!
        console.error(`Adding ${namespace} to ${packageName}`);
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

    // dotnet names
    const dotnetPackage = `Amazon.CDK.${moduleFamily}.${moduleBaseName}`;

    // java names
    const javaGroupId = 'software.amazon.awscdk';
    const javaPackage = moduleFamily === 'AWS'
      ? `services.${lowcaseModuleName}`
      : `${moduleFamily.toLocaleLowerCase()}.${lowcaseModuleName}`;
    const javaArtifactId = moduleFamily === 'AWS'
      ? lowcaseModuleName
      : `${moduleFamily.toLocaleLowerCase()}-${lowcaseModuleName}`;

    // python names
    const pythonDistName = `aws-cdk.${moduleName}`;
    const pythonModuleName = pythonDistName.replace(/-/g, '_');

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

    console.log(`generating module for ${packageName}...`);

    await write('package.json', {
      name: packageName,
      version,
      description: `The CDK Construct Library for ${namespace}`,
      main: 'lib/index.js',
      types: 'lib/index.d.ts',
      jsii: {
        outdir: 'dist',
        targets: {
          dotnet: {
            namespace: dotnetPackage,
            packageId: dotnetPackage,
            signAssembly: true,
            assemblyOriginatorKeyFile: '../../key.snk',
            iconUrl: 'https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png',
          },
          java: {
            package: `${javaGroupId}.${javaPackage}`,
            maven: {
              groupId: javaGroupId,
              artifactId: javaArtifactId,
            },
          },
          python: {
            distName: pythonDistName,
            module: pythonModuleName,
          },
        },
      },
      repository: {
        type: 'git',
        url: 'https://github.com/aws/aws-cdk.git',
        directory: `packages/${packageName}`,
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
        'build+test+package': 'npm run build+test && npm run package',
        'build+test': 'npm run build && npm test',
        compat: 'cdk-compat',
      },
      'cdk-build': {
        cloudformation: namespace,
        jest: true,
      },
      keywords: [
        'aws',
        'cdk',
        'constructs',
        namespace,
        moduleName,
      ],
      author: {
        name: 'Amazon Web Services',
        url: 'https://aws.amazon.com',
        organization: true,
      },
      license: 'Apache-2.0',
      devDependencies: {
        '@aws-cdk/assert': version,
        'cdk-build-tools': version,
        'cfn2ts': version,
        'pkglint': version,
      },
      dependencies: {
        '@aws-cdk/core': version,
      },
      peerDependencies: {
        '@aws-cdk/core': version,
      },
      engines: {
        node: '>= 10.13.0 <13 || >=13.7.0',
      },
      stability: 'experimental',
      maturity: 'cfn-only',
      awscdkio: {
        announce: false,
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
    ]);

    await write('lib/index.ts', [
      `// ${namespace} CloudFormation Resources:`,
      `export * from './${lowcaseModuleName}.generated';`,
    ]);

    await write(`test/${lowcaseModuleName}.test.ts`, [
      "import '@aws-cdk/assert/jest';",
      "import {} from '../lib';",
      '',
      "test('No tests are specified for this package', () => {",
      '  expect(true).toBe(true);',
      '});',
    ]);

    await write('README.md', [
      `## ${namespace} Construct Library`,
      '<!--BEGIN STABILITY BANNER-->',
      '---',
      '',
      '![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)',
      '',
      '> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.',
      '',
      '---',
      '<!--END STABILITY BANNER-->',
      '',
      'This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.',
      '',
      '```ts',
      `import ${lowcaseModuleName} = require('${packageName}');`,
      '```',
    ]);

    await write('.eslintrc.js', [
      "const baseConfig = require('cdk-build-tools/config/eslintrc');",
      "baseConfig.parserOptions.project = __dirname + '/tsconfig.json';",
      'module.exports = baseConfig;',
    ]);

    await write('jest.config.js', [
      "const baseConfig = require('cdk-build-tools/config/jest.config');",
      'module.exports = baseConfig;',
    ]);

    const templateDir = path.join(__dirname, 'template');
    for (const file of await fs.readdir(templateDir)) {
      await fs.copy(path.join(templateDir, file), path.join(packagePath, file));
    }

    // update decdk
    const decdkPkgJsonPath = path.join(__dirname, '..', '..', '..', 'decdk', 'package.json');
    const decdkPkg = JSON.parse(await fs.readFile(decdkPkgJsonPath, 'utf8'));
    const unorderedDeps = {
      ...decdkPkg.dependencies,
      [packageName]: version,
    };
    decdkPkg.dependencies = {};
    Object.keys(unorderedDeps).sort().forEach(k => {
      decdkPkg.dependencies[k] = unorderedDeps[k];
    });
    await fs.writeFile(decdkPkgJsonPath, JSON.stringify(decdkPkg, null, 2) + '\n');
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
