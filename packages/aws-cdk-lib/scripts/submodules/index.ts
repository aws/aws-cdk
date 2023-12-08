import * as path from 'node:path';
import { createLibraryReadme } from '@aws-cdk/pkglint';
import * as fs from 'fs-extra';
import awsEventsTargets from './aws-events-targets';
import cloudformationInclude from './cloudformation-include';
import { ModuleMap, ModuleMapEntry } from '../codegen';

export default async function submodulesGen(modules: ModuleMap, outPath: string) {
  for (const submodule of Object.values(modules)) {
    if (submodule.name === 'core') {
      continue;
    }

    const submodulePath = path.join(outPath, submodule.name);
    await ensureSubmodule(submodule, submodulePath);
  }

  // Do specific code gen for certain submodules
  await awsEventsTargets(modules, outPath);
  await cloudformationInclude(modules, outPath);
}

async function ensureSubmodule(submodule: ModuleMapEntry, modulePath: string) {

  // README.md
  const readmePath = path.join(modulePath, 'README.md');
  if (!fs.existsSync(readmePath)) {
    await createLibraryReadme(submodule.scopes[0], readmePath);
  }

  // index.ts
  if (!fs.existsSync(path.join(modulePath, 'index.ts'))) {
    const lines = ['export * from \'./lib\';'];
    await fs.writeFile(path.join(modulePath, 'index.ts'), lines.join('\n') + '\n');
  }

  // lib/index.ts
  const sourcePath = path.join(modulePath, 'lib');
  if (!fs.existsSync(path.join(sourcePath, 'index.ts'))) {
    const lines = submodule.scopes.map((s: string) => `// ${s} Cloudformation Resources`);
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
          package: submodule.definition.dotnetPackage,
        },
        python: {
          module: submodule.definition.pythonModuleName,
        },
      },
    };
    await fs.writeJson(path.join(modulePath, '.jsiirc.json'), jsiirc, { spaces: 2 });
  }
}
