import * as path from 'path';
import * as cfnSpec from '@aws-cdk/cfnspec';
import * as pkglint from '@aws-cdk/pkglint';
import * as fs from 'fs-extra';
import { AugmentationGenerator, AugmentationsGeneratorOptions } from './augmentation-generator';
import { CannedMetricsGenerator } from './canned-metrics-generator';
import CodeGenerator, { CodeGeneratorOptions } from './codegen';
import { packageName } from './genspec';

interface GenerateOutput {
  outputFiles: string[];
  resources: Record<string, string>;
}

export default async function generate(
  scopes: string | string[],
  outPath: string,
  options: CodeGeneratorOptions & AugmentationsGeneratorOptions = { },
): Promise<GenerateOutput> {
  const result: GenerateOutput = {
    outputFiles: [],
    resources: {},
  };

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
    result.outputFiles.push(generator.outputFile);
    result.resources = {
      ...result.resources,
      ...generator.resources,
    };

    const augs = new AugmentationGenerator(name, spec, affix, options);
    if (augs.emitCode()) {
      await augs.save(outPath);
      result.outputFiles.push(augs.outputFile);
    }

    const canned = new CannedMetricsGenerator(name, scope);
    if (canned.generate()) {
      await canned.save(outPath);
      result.outputFiles.push(canned.outputFile);
    }
  }

  return result;
}

/**
 * Configuration options for the generateAll function
 */
export interface GenerateAllOptions extends CodeGeneratorOptions, AugmentationsGeneratorOptions {
  /**
    * Path of the file containing the map of module names to their CFN Scopes
    */
  scopeMapPath: string;
}

/**
 * A data structure holding information about generated modules. It maps
 * module names to their full module definition and their CFN scopes.
 */
export interface ModuleMap {
  [moduleName: string]: {
    module?: pkglint.ModuleDefinition;
    scopes: string[];
    resources: Record<string, string>;
  }
}

/**
 * Generates L1s for all submodules of a monomodule. Modules to generate are
 * chosen based on the contents of the `scopeMapPath` file. This is intended for
 * use in generated L1s in aws-cdk-lib.
 * @param outPath The root directory to generate L1s in
 * @param param1  Options
 * @returns       A ModuleMap containing the ModuleDefinition and CFN scopes for each generated module.
 */
export async function generateAll(
  outPath: string,
  { scopeMapPath, ...options }: GenerateAllOptions,
): Promise<ModuleMap> {
  const scopes = cfnSpec.namespaces();
  const moduleMap = await readScopeMap(scopeMapPath);

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
      resources: {},
    };
  }

  await Promise.all(Object.entries(moduleMap).map(
    async ([moduleName, { scopes: moduleScopes, module }]) => {
      const packagePath = path.join(outPath, moduleName);
      const sourcePath = path.join(packagePath, 'lib');

      const isCore = moduleName === 'core';
      const { outputFiles, resources } = await generate(moduleScopes, sourcePath, {
        ...options,
        coreImport: isCore ? '.' : options.coreImport,
      });

      if (!fs.existsSync(path.join(packagePath, 'index.ts'))) {
        let lines = moduleScopes.map((s: string) => `// ${s} Cloudformation Resources`);
        lines.push(...outputFiles.map((f) => `export * from './lib/${f.replace('.ts', '')}'`));

        await fs.writeFile(path.join(packagePath, 'index.ts'), lines.join('\n') + '\n');
      }

      // Create .jsiirc.json file if needed
      if (
        !fs.existsSync(path.join(packagePath, '.jsiirc.json'))
        && !isCore
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

      // Add generated resources to module in map
      moduleMap[moduleName].resources = resources;
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

/**
 * Reads the scope map from a file and transforms it into the type we need.
 */
async function readScopeMap(filepath: string) : Promise<ModuleMap> {
  const scopeMap: Record<string, string[]> = await fs.readJson(filepath);
  return Object.entries(scopeMap)
    .reduce((accum, [name, moduleScopes]) => {
      return {
        ...accum,
        [name]: { scopes: moduleScopes },
      };
    }, {});
}
