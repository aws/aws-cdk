import fs = require('fs');
import jsiiReflect = require('jsii-reflect');
import path = require('path');

export async function loadTypeSystem() {
  const typeSystem = new jsiiReflect.TypeSystem();
  const packageJson = require('../package.json');

  for (const depName of Object.keys(packageJson.dependencies || {})) {
    const jsiiModuleDir = path.dirname(require.resolve(`${depName}/package.json`));
    if (!fs.existsSync(path.resolve(jsiiModuleDir, '.jsii'))) {
      continue;
    }
    await typeSystem.load(jsiiModuleDir);
  }

  return typeSystem;
}