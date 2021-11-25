import * as fs from 'fs-extra';
import * as jsiiReflect from 'jsii-reflect';
import * as path from 'path';
import * as YAML from 'yaml';

/**
 * Reads a YAML/JSON template file.
 */
export async function readTemplate(templateFile: string) {
  const str = await fs.readFile(templateFile, { encoding: 'utf-8' });
  const template = YAML.parse(str, { schema: 'yaml-1.1' });
  return template;
}

export async function loadTypeSystem(validate = true) {
  const typeSystem = new jsiiReflect.TypeSystem();
  const packageJson = require('../package.json');

  for (const depName of Object.keys(packageJson.dependencies || {})) {
    try {
      const jsiiModuleDir = path.dirname(require.resolve(`${depName}/.jsii`));
      await typeSystem.load(jsiiModuleDir, { validate });

    } catch (e) {
      if (!['MODULE_NOT_FOUND', 'ERR_PACKAGE_PATH_NOT_EXPORTED'].includes((e as any).code)) {
        throw e;
      }
    }
  }

  return typeSystem;
}

export function stackNameFromFileName(fileName: string) {
  return path.parse(fileName).name.replace('.', '-');
}
