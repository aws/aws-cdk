import * as path from 'node:path';
import { createLibraryReadme, ModuleDefinition } from '@aws-cdk/pkglint';
import * as fs from 'fs-extra';
import { ModuleMap, ModuleMapEntry } from '../codegen';

/**
 * Make sure that a number of expected files exist for every service submodule
 *
 * Non-service submodules should not be passed to this function.
 */
export default async function generateServiceSubmoduleFiles(modules: ModuleMap, outPath: string) {
  for (const submodule of Object.values(modules)) {
    const submodulePath = path.join(outPath, submodule.name);
    await ensureSubmodule(submodule, submodulePath);
    await ensureInterfaceSubmoduleJsiiJsonRc(submodule, path.join(outPath, 'interfaces'));
  }
}

async function ensureSubmodule(submodule: ModuleMapEntry, modulePath: string) {
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
        // New codegen uses absolute paths
        if (path.isAbsolute(f)) {
          return path.relative(sourcePath, f);
        }
        // Old codegen uses a filename that's already relative to sourcePath
        return f;
      })
      .map((f) => `export * from './${f.replace('.ts', '')}';`));
    await fs.writeFile(path.join(sourcePath, 'index.ts'), lines.join('\n') + '\n');
  }

  // .jsiirc.json
  if (!fs.existsSync(path.join(modulePath, '.jsiirc.json'))) {
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

  const jsiiRcPath = path.join(interfacesModulePath, 'generated', `${submodule.name}-interfaces.generated.jsiirc.json`);

  const jsiirc = {
    targets: {
      ...combineLanguageNamespace('java', 'package', 'javaPackage'),
      ...combineLanguageNamespace('dotnet', 'namespace', 'dotnetPackage'),
      ...combineLanguageNamespace('python', 'module', 'pythonModuleName'),
      // No Go...
    },
  };
  await fs.writeJson(jsiiRcPath, jsiirc, { spaces: 2 });

  function combineLanguageNamespace(language: string, whatName: string, k: keyof ModuleDefinition) {
    const ns = `${interfacesModuleJsiiRc.targets[language][whatName]}.${lastPart(submodule.definition?.[k] ?? 'undefined')}`;
    if (ns.includes('undefined')) {
      throw new Error(`Could not build child namespace for language ${language} from ${JSON.stringify(interfacesModuleJsiiRc.targets[language])} and ${k} from ${JSON.stringify(submodule.definition)}`);
    }

    return { [language]: { [whatName]: ns } };
  }
}

function lastPart(x: string): string {
  return x.split('.').slice(-1)[0];
}
