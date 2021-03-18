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

const jsii_reflect = require('jsii-reflect');

const packageJson = require('./package.json');
const dependencies = packageJson.dependencies || {};
const peerDependencies = packageJson.peerDependencies || {};

async function main() {
  const constructLibrariesRoot = path.resolve('..');
  const constructLibrariesDirs = fs.readdirSync(constructLibrariesRoot);
  let errors = false;

  const typeSystem = new jsii_reflect.TypeSystem();
  const cfnType2L1Class = {};
  // load the @aws-cdk/core assembly first, to find the CfnResource class
  await typeSystem.load(path.resolve(constructLibrariesRoot, 'core'), { validate: false });
  const cfnResourceClass = typeSystem.findClass('@aws-cdk/core.CfnResource');

  for (const constructLibraryDir of constructLibrariesDirs) {
    const absConstructLibraryDir = path.resolve(constructLibrariesRoot, constructLibraryDir);
    if (!fs.statSync(absConstructLibraryDir).isDirectory()) { continue; } // .DS_Store

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

    // load the assembly of this package,
    // and find all subclasses of CfnResource to put them in cfnType2L1Class
    const assembly = await typeSystem.load(absConstructLibraryDir, { validate: false });
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

  fs.writeFileSync(path.join(__dirname, 'package.json'),
      JSON.stringify(packageJson, undefined, 2) + '\n');
  fs.writeFileSync(path.join(__dirname, 'cfn-types-2-classes.json'),
      JSON.stringify(cfnType2L1Class, undefined, 2) + '\n');

  if (errors) {
    console.error('errors found. updated package.json');
    process.exit(1);
  }
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
