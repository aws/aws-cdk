import * as path from 'node:path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createLibraryReadme } from '@aws-cdk/pkglint';
import * as fs from 'fs-extra';
import type { ModuleMap, ModuleMapEntry } from '../module-topology';

/**
 * Make sure that a number of expected files exist for every service submodule
 *
 * Non-service submodules should not be passed to this function.
 */
export default async function generateServiceSubmoduleFiles(modules: ModuleMap, outPath: string) {
  for (const submodule of Object.values(modules)) {
    await ensureSubmodule(submodule, outPath);
    await ensureInterfaceSubmoduleJsiiJsonRc(submodule, path.join(outPath, 'interfaces'));
  }
}

async function ensureSubmodule(submodule: ModuleMapEntry, outPath: string) {
  const modulePath = path.join(outPath, submodule.name);

  // README.md
  const readmePath = path.join(modulePath, 'README.md');
  if (!fs.existsSync(readmePath)) {
    await createLibraryReadme(submodule.scopes[0].namespace, readmePath);
  }

  // index.ts
  if (!fs.existsSync(path.join(modulePath, 'index.ts'))) {
    const lines = ['export * from \'./lib\';'];
    await fs.writeFile(path.join(modulePath, 'index.ts'), lines.join('\n') + '\n');
  }

  // lib/index.ts
  const sourcePath = path.join(modulePath, 'lib');
  if (!fs.existsSync(path.join(sourcePath, 'index.ts'))) {
    const lines = submodule.scopes.map(({ namespace }) => `// ${namespace} Cloudformation Resources`);
    lines.push(...submodule.files
      .map((f) => {
        // codegen returns paths relative to outpath
        return path.relative(sourcePath, path.join(outPath, f));
      })
      .map((f) => `export * from './${f.replace('.ts', '')}';`));
    await fs.writeFile(path.join(sourcePath, 'index.ts'), lines.join('\n') + '\n');
  }

  // .jsiirc.json
  // We always re-create this file. Any historic deviations are stored in scopes-map.json
  if (!submodule.definition) {
    throw new Error(
      `Cannot infer path or namespace for submodule named "${submodule.name}". Manually create ${modulePath}/.jsiirc.json file.`,
    );
  }

  const jsiirc = {
    targets: {
      java: {
        package: submodule.definition.javaPackage,
      },
      dotnet: {
        namespace: submodule.definition.dotnetPackage,
      },
      python: {
        module: submodule.definition.pythonModuleName,
      },
    },
  };
  await fs.writeJson(path.join(modulePath, '.jsiirc.json'), jsiirc, { spaces: 2 });
}

/**
 * Make a jsiirc file for every service-specific interfaces submodule
 *
 * Do that by taking the namespaces of the parent `interfaces` submodule and concatenating the last part
 * of the names corresponding services namespace.
 */
async function ensureInterfaceSubmoduleJsiiJsonRc(submodule: ModuleMapEntry, interfacesModulePath: string) {
  if (!submodule.definition) {
    throw new Error(`Cannot infer path or namespace for submodule named "${submodule.name}".`);
  }

  const interfacesModuleJsiiRcPath = path.join(interfacesModulePath, '.jsiirc.json');
  const interfacesModuleJsiiRc = JSON.parse(await fs.readFile(interfacesModuleJsiiRcPath, 'utf-8'));

  const jsiiRcPath = path.join(interfacesModulePath, 'generated', `.${submodule.name}-interfaces.generated.jsiirc.json`);

  const jsiirc = {
    targets: {
      ...combineLanguageNamespace('java', 'package', submodule.definition?.javaPackage),
      ...combineLanguageNamespace('dotnet', 'namespace', submodule.definition?.dotnetPackage),
      ...combineLanguageNamespace('python', 'module', submodule.definition?.pythonModuleName),
      ...combineLanguageNamespace('go', 'packageName', submodule.definition?.moduleName.replace(/[^a-z0-9.]/gi, '')),
    },
  };
  await fs.writeJson(jsiiRcPath, jsiirc, { spaces: 2 });

  function combineLanguageNamespace(language: string, whatName: string, fromDef?: string) {
    if (fromDef == null) {
      throw new Error(`Could not build child namespace for language ${language} from ${JSON.stringify(interfacesModuleJsiiRc.targets[language])} and definition ${JSON.stringify(submodule.definition)}`);
    }

    const nsParts = [interfacesModuleJsiiRc.targets[language][whatName], lastPart(fromDef)];
    const nsSep = language === 'go' ? '' : '.';

    return { [language]: { [whatName]: nsParts.join(nsSep) } };
  }
}

function lastPart(x: string): string {
  return x.split('.').slice(-1)[0];
}
