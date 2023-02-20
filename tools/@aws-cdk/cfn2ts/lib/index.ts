import * as path from 'path';
import * as cfnSpec from '@aws-cdk/cfnspec';
import * as pkglint from '@aws-cdk/pkglint';
import * as fs from 'fs-extra';
import { AugmentationGenerator, AugmentationsGeneratorOptions } from './augmentation-generator';
import { CannedMetricsGenerator } from './canned-metrics-generator';
import CodeGenerator, { CodeGeneratorOptions } from './codegen';
import { packageName } from './genspec';

export default async function generate(
  scopes: string | string[],
  outPath: string,
  options: CodeGeneratorOptions & AugmentationsGeneratorOptions = { },
): Promise<string[]> {
  const outputFiles: string[] = [];
  if (outPath !== '.') { await fs.mkdirp(outPath); }

  if (scopes === '*') {
    scopes = cfnSpec.namespaces();
  } else if (typeof scopes === 'string') {
    scopes = [scopes];
  }

  for (const scope of scopes) {
    const spec = cfnSpec.filteredSpecification(s => s.startsWith(`${scope}::`));
    if (Object.keys(spec.ResourceTypes).length === 0) {
      throw new Error(`No resource was found for scope ${scope}`);
    }
    const name = packageName(scope);
    const affix = computeAffix(scope, scopes);

    const generator = new CodeGenerator(name, spec, affix, options);
    generator.emitCode();
    await generator.save(outPath);
    outputFiles.push(generator.outputFile);

    const augs = new AugmentationGenerator(name, spec, affix, options);
    if (augs.emitCode()) {
      await augs.save(outPath);
      outputFiles.push(augs.outputFile);
    }

    const canned = new CannedMetricsGenerator(name, scope);
    if (canned.generate()) {
      await canned.save(outPath);
      outputFiles.push(canned.outputFile);
    }
  }

  return outputFiles;
}

export interface GeneratorOptions extends CodeGeneratorOptions, AugmentationsGeneratorOptions {

  /**
    * Map of CFN Scopes to modules
    */
  scopeMap: Record<string, string[]>;
}

export interface ModuleMap {
  [moduleName: string]: {
    module?: pkglint.ModuleDefinition;
    scopes: string[];
  }
}

export async function generateAll(
  outPath: string,
  { scopeMap, ...options }: GeneratorOptions,
): Promise<ModuleMap> {
  const scopes = cfnSpec.namespaces();

  const moduleMap: ModuleMap = Object.entries(scopeMap)
    .reduce((accum, [name, moduleScopes]) => {
      return {
        ...accum,
        [name]: { scopes: moduleScopes },
      };
    }, {});

  // Make sure all scopes have their own dedicated package/namespace.
  // Adds new submodules for new namespaces.
  for (const scope of scopes) {
    const module = pkglint.createModuleDefinitionFromCfnNamespace(scope);
    const currentScopes = moduleMap[module.moduleName]?.scopes ?? [];
    // remove dupes
    const newScopes = [...new Set([...currentScopes, scope])];

    // Add new modules to module map and return to caller
    moduleMap[module.moduleName] = {
      scopes: newScopes,
      module,
    };
  }


  await Promise.all(Object.entries(moduleMap).map(
    async ([moduleName, { scopes: moduleScopes, module }]) => {
      const packagePath = path.join(outPath, moduleName);
      const sourcePath = path.join(packagePath, 'lib');

      const outputFiles = await generate(moduleScopes, sourcePath, options);

      if (!fs.existsSync(path.join(packagePath, 'index.ts'))) {
        let lines = moduleScopes.map((s: string) => `// ${s} Cloudformation Resources`);
        lines.push(...outputFiles.map((f) => `export * from './lib/${f.replace('.ts', '')}'`));

        await fs.writeFile(path.join(packagePath, 'index.ts'), lines.join('\n') + '\n');
      }

      // Create .jsiirc.json file if needed
      const excludeJsii = ['core'];
      if (
        !fs.existsSync(path.join(packagePath, '.jsiirc.json'))
        && !excludeJsii.includes(moduleName)
      ) {
        if (!module) {
          throw new Error(
            `Cannot infer path or namespace for submodule named "${moduleName}". Manually create ${packagePath}/.jsiirc.json file.`,
          );
        }

        const jsiirc = {
          targets: {
            java: {
              package: module.javaPackage,
            },
            dotnet: {
              package: module.dotnetPackage,
            },
            python: {
              module: module.pythonModuleName,
            },
          },
        };
        await fs.writeJson(path.join(packagePath, '.jsiirc.json'), jsiirc, { spaces: 2 });
      }
    }));

  return moduleMap;
}

/**
 * Finds an affix for class names generated for a scope, given all the scopes that share the same package.
 * @param scope     the scope for which an affix is needed (e.g: AWS::ApiGatewayV2)
 * @param allScopes all the scopes hosted in the package (e.g: ["AWS::ApiGateway", "AWS::ApiGatewayV2"])
 * @returns the affix (e.g: "V2"), if any, or an empty string.
 */
function computeAffix(scope: string, allScopes: string[]): string {
  if (allScopes.length === 1) {
    return '';
  }
  const parts = scope.match(/^(.+)(V\d+)$/);
  if (!parts) {
    return '';
  }
  const [, root, version] = parts;
  if (allScopes.indexOf(root) !== -1) {
    return version;
  }
  return '';
}
