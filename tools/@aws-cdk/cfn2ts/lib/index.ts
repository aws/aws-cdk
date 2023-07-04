import * as path from 'path';
import { promisify } from 'util';
import { gzip, constants as zlib } from 'zlib';

import * as cfnSpec from '@aws-cdk/cfnspec';
import * as pkglint from '@aws-cdk/pkglint';
import * as fs from 'fs-extra';
import { AugmentationGenerator, AugmentationsGeneratorOptions } from './augmentation-generator';
import { CannedMetricsGenerator } from './canned-metrics-generator';
import CodeGenerator, { CodeGeneratorOptions } from './codegen';
import { packageName } from './genspec';
import type { Schema, TypeName } from './schema';
import { upcaseFirst } from './util';

interface GenerateOutput {
  outputFiles: string[];
  resources: Schema['resources'];
  types: Schema['types'];
}

export default async function generate(
  scopes: string | string[],
  outPath: string,
  options: CodeGeneratorOptions & AugmentationsGeneratorOptions = { },
): Promise<GenerateOutput> {
  const result: GenerateOutput = {
    outputFiles: [],
    resources: new Map(),
    types: new Map(),
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

    for (const [cfn, resource] of generator.resources) {
      result.resources.set(cfn, {
        ...resource,
        construct: {
          ts: {
            ...resource.construct.ts,
            module: name,
          },
          dotnet: {
            ...resource.construct.dotnet,
            ns: upcaseFirst(name),
          },
          go: {
            ...resource.construct.go,
            module: name,
            package: name,
          },
          java: {
            ...resource.construct.java,
            package: name,
          },
          python: {
            ...resource.construct.python,
            module: name,
          },
        },
      });
    }
    for (const [fqn, type] of generator.types) {
      result.types.set(fqn, type);
    }

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
  readonly scopeMapPath: string;

  /**
   * Path of the file where a CFN resource schema should be written to. If
   * `undefined`, no schema file will be generated.
   */
  readonly cdkResourceSchemaPath?: string;
}

/**
 * A data structure holding information about a generated module.
 */
export interface ModuleMapEntry {
  name: string;
  definition?: pkglint.ModuleDefinition;
  scopes: string[];
  resources: Schema['resources'];
  types: Schema['types'];
  files: string[];
}

/**
 * A data structure holding information about generated modules.
 * It maps module names to their full module definition, CFN scopes, resources and generated files.
 */
export interface ModuleMap {
  [moduleName: string]: ModuleMapEntry
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
  { scopeMapPath, cdkResourceSchemaPath, ...options }: GenerateAllOptions,
): Promise<ModuleMap> {
  const cfnScopes = cfnSpec.namespaces();
  const moduleMap = await readScopeMap(scopeMapPath);

  // Make sure all scopes have their own dedicated package/namespace.
  // Adds new submodules for new namespaces.
  for (const scope of cfnScopes) {
    const moduleDefinition = pkglint.createModuleDefinitionFromCfnNamespace(scope);
    const currentScopes = moduleMap[moduleDefinition.moduleName]?.scopes ?? [];
    // remove dupes
    const newScopes = [...new Set([...currentScopes, scope])];

    // Add new modules to module map and return to caller
    moduleMap[moduleDefinition.moduleName] = {
      name: moduleDefinition.moduleName,
      definition: moduleDefinition,
      scopes: newScopes,
      resources: new Map(),
      types: new Map(),
      files: [],
    };
  }

  await Promise.all(Object.entries(moduleMap).map(
    async ([name, { scopes }]) => {
      const packagePath = path.join(outPath, name);
      const sourcePath = path.join(packagePath, 'lib');

      const isCore = name === 'core';
      const { outputFiles, resources, types } = await generate(scopes, sourcePath, {
        ...options,
        coreImport: isCore ? '.' : options.coreImport,
      });

      // Add generated resources and files to module in map
      moduleMap[name].resources = resources;
      moduleMap[name].types = types;
      moduleMap[name].files = outputFiles;
    }));

  if (cdkResourceSchemaPath) {
    const schema: Schema = {
      resources: new Map(),
      types: new Map(),
      version: JSON.parse(await fs.readFile(path.resolve(__dirname, '..', 'package.json'), 'utf-8')).version,
    };

    for (let [name, { definition, resources, types }] of Object.entries(moduleMap)) {
      if (definition === undefined) {
        if (name !== 'core') {
          throw new Error(`Missing module definition for ${name}!`);
        }
        definition = {
          namespace: 'core',
          moduleName: 'core',
          submoduleName: '',
          moduleFamily: '',
          moduleBaseName: 'core',
          packageName: 'aws-cdk-lib',
          dotnetPackage: 'Amazon.CDK',
          javaGroupId: 'software.amazon.awscdk',
          javaArtifactId: 'aws-cdk-lib',
          javaPackage: 'software.amazon.awscdk',
          goModuleName: 'github.com/aws/aws-cdk-go/awscdk/v2/',
          goPackageName: 'awscdk',
          pythonDistName: 'aws-cdk',
          pythonModuleName: 'aws_cdk',
        };
      }
      for (const [cfn, resource] of resources) {
        schema.resources.set(cfn, { ...resource, construct: rehomeTypeName(resource.construct, definition) });
      }
      for (const [fqn, type] of types) {
        schema.types.set(fqn, { ...type, name: rehomeTypeName(type.name, definition) });
      }
    }

    // Serialize the document to JSON.
    const document = JSON.stringify(
      schema,
      (_key, value) => {
        if (value instanceof Map) {
          return Object.fromEntries(value);
        } else if (value === false) {
          return undefined;
        } else {
          return value;
        }
      },
      2,
    );

    // Compress if the filename ends with `.gz`.
    const data = cdkResourceSchemaPath.endsWith('.gz')
      ? await promisify(gzip)(document, { level: zlib.Z_BEST_COMPRESSION })
      : document;

    // Write the file out.
    await fs.mkdir(path.dirname(cdkResourceSchemaPath), { recursive: true });
    await fs.writeFile(cdkResourceSchemaPath, data);
  }

  return moduleMap;
}

function rehomeTypeName(name: TypeName, definition: pkglint.ModuleDefinition): TypeName {
  return {
    ts: {
      ...name.ts,
      module: `aws-cdk-lib/${definition.moduleName}`,
    },
    dotnet: {
      ...name.dotnet,
      ns: definition.dotnetPackage,
    },
    go: {
      ...name.go,
      module: definition.goModuleName,
      package: definition.goPackageName,
    },
    java: {
      ...name.java,
      package: definition.javaPackage,
    },
    python: {
      ...name.python,
      module: definition.pythonModuleName,
    },
  };
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
        [name]: {
          name,
          scopes: moduleScopes,
          resources: {},
          files: [],
        },
      };
    }, {});
}
