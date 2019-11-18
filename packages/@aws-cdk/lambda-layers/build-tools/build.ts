import { RuntimeFamily } from '@aws-cdk/aws-lambda';
import child_process = require('child_process');
import fs = require('fs-extra');
import path = require('path');
import { Layer } from '../lib';

interface PackageJson {
  devDependencies: { [key: string]: string };
}

async function buildLayer(layer: Layer, pkg: PackageJson) {
  switch (layer.runtimeFamily) {
    case RuntimeFamily.NODEJS:
      await buildJsLayer(layer, pkg);
      break;
    default:
      throw new Error('This runtime family is not supported');
  }
}

async function buildJsLayer(layer: Layer, pkg: PackageJson) {
  const basePath = path.join('layers', layer.name, 'nodejs');

  // Create folder for layer
  fs.ensureDirSync(basePath);

  // Create a dummy package.json with only 'dependencies' key
  const dependencies: { [key: string]: string } = {};
  for (const dep of layer.dependencies) {
    if (!pkg.devDependencies[dep]) {
      throw new Error(`Dependency '${dep}' used in layer '${layer.name}' must be declared in the 'devDependencies' of 'package.json'`);
    }
    dependencies[dep] = pkg.devDependencies[dep].replace(/[^\d.]/g, ''); // Lookup version in main `package.json` and use fixed version
  }

  fs.writeFileSync(path.join(basePath, 'package.json'), JSON.stringify({ dependencies }));

  // Install packages
  await npmInstall(basePath);
}

async function npmInstall(layerPath: string): Promise<void> {
  const child = child_process.spawn('npm', ['i', '--no-package-lock'], {
    stdio: [ 'inherit', 'inherit', 'inherit' ],
    cwd: layerPath,
  });
  return new Promise((ok, ko) => {
    child.once('exit', (status: any) => {
      if (status === 0) {
        return ok();
      } else {
        return ko(new Error(`Faild to install layer dependencies for layer located at ${layerPath}`));
      }
    });
    child.once('error', ko);
  });
}

async function main() {
  const pkg: PackageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  for (const layer of Object.values(Layer)) {
    await buildLayer(layer, pkg);
  }
}

main().catch(e => {
  // tslint:disable-next-line: no-console
  console.error(e);
  process.exit(-1);
});
