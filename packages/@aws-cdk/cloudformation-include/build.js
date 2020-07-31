/**
 * This build file has two purposes:
 *   1. It adds a dependency on each @aws-cdk/aws-xyz package with L1s to this package,
 *     similarly to how deps.js does for decdk.
 *   2. It generates the file cfn-types-2-classes.json that contains a mapping
 *     between the CloudFormation type and the fully-qualified name of the L1 class,
 *     used in the logic of the CfnInclude class.
 */

const fs = require('fs');
const path = require('path');

// Use the jsii-reflect from cdk-build-tools
const cdkBuildToolsPath = require.resolve('cdk-build-tools/package.json');
const jsiiReflectPath = require.resolve('jsii-reflect', { paths: [cdkBuildToolsPath] });
const jsii_reflect = require(jsiiReflectPath);

const packageJson = require('./package.json');
const dependencies = packageJson.dependencies || {};
const peerDependencies = packageJson.peerDependencies || {};

async function main() {
  await validatePackageJsonCompleteness();
  await buildL1Catalog();
}

/**
 * Validate that we have all requires packages in package.json
 */
async function validatePackageJsonCompleteness() {
  const sourcePath = path.resolve(process.env.NZM_PACKAGE_SOURCE || __dirname);

  const constructLibrariesRoot = path.resolve(sourcePath, '..');
  const constructLibrariesDirs = fs.readdirSync(constructLibrariesRoot);
  let errors = false;

  for (const constructLibraryDir of constructLibrariesDirs) {
    const absConstructLibraryDir = path.resolve(constructLibrariesRoot, constructLibraryDir);
    if (!fs.statSync(absConstructLibraryDir).isDirectory()) { continue; }

    const libraryPackageJson = require(path.join(absConstructLibraryDir, 'package.json'));

    const libraryDependencyVersion = dependencies[libraryPackageJson.name];
    if (libraryPackageJson.maturity === 'deprecated') {
      if (libraryDependencyVersion) {
        console.error(`Incorrect dependency on deprecated package: ${libraryPackageJson.name}`);
        errors = true;
        delete dependencies[libraryPackageJson.name];
        delete peerDependencies[libraryPackageJson.name];
      }
      // we don't want dependencies on deprecated modules,
      // even if they do contain L1s (like eks-legacy)
      continue;
    }

    // we're not interested in modules that don't use cfn2ts
    // (as they don't contain any L1s)
    const cfn2ts = (libraryPackageJson['cdk-build'] || {}).cloudformation;
    if (!cfn2ts) {
      continue;
    }

    const libraryVersion = libraryPackageJson.version;
    if (!libraryDependencyVersion) {
      console.error(`Missing dependency on package: ${libraryPackageJson.name}`);
      errors = true;
    } else if (libraryDependencyVersion !== libraryVersion) {
      console.error(`Incorrect dependency version for package ${libraryPackageJson.name}: expecting '${libraryVersion}', got: '${libraryDependencyVersion}'`);
      errors = true;
    }

    dependencies[libraryPackageJson.name] = libraryVersion;
    // dependencies need to be in both sections to satisfy pkglint
    peerDependencies[libraryPackageJson.name] = libraryVersion;
  }

  fs.writeFileSync(path.join(sourcePath, 'package.json'),
      JSON.stringify(packageJson, undefined, 2) + '\n');

  if (errors) {
    console.error('errors found. updated package.json');
    process.exit(1);
  }
}

/**
 * Build a catalog of resources types based on dependencies in package.json
 */
async function buildL1Catalog() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), { encoding: 'utf-8' }));

  const typeSystem = new jsii_reflect.TypeSystem();
  const cfnType2L1Class = {};
  // load the @aws-cdk/core assembly first, to find the CfnResource class
  await typeSystem.load(dependencyDir('@aws-cdk/core'), { validate: false });
  const cfnResourceClass = typeSystem.findClass('@aws-cdk/core.CfnResource');

  for (const packageName of Object.keys(packageJson.dependencies || {})) {
    const depDir = dependencyDir(packageName);
    const depPJ = require(`${depDir}/package.json`);
    if (!depPJ.jsii) { continue; }  // Skip non-jsii dependencies

    // load the assembly of this package,
    // and find all subclasses of CfnResource to put them in cfnType2L1Class
    const assembly = await typeSystem.load(depDir, { validate: false });
    for (let i = 0; i < assembly.classes.length; i++) {
      const classs = assembly.classes[i];
      if (classs.extends(cfnResourceClass)) {
        const properties = classs.spec.properties;
        const cfnResourceTypeNameProp = (properties || []).find(p => p.name === 'CFN_RESOURCE_TYPE_NAME');
        if (cfnResourceTypeNameProp) {
          const [moduleName, ...className] = classs.fqn.split('.');
          const module = require(moduleName);
          const jsClassFromModule = module[className.join('.')];
          cfnType2L1Class[jsClassFromModule.CFN_RESOURCE_TYPE_NAME] = classs.fqn;
        }
      }
    }
  }

  fs.writeFileSync(path.join(__dirname, 'cfn-types-2-classes.json'),
      JSON.stringify(cfnType2L1Class, undefined, 2) + '\n');
}

function dependencyDir(packageName) {
  return path.dirname(require.resolve(`${packageName}/package.json`));
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
