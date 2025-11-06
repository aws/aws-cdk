import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import { Service } from '@aws-cdk/service-spec-types';
import * as fs from 'fs-extra';
import * as pkglint from './pkglint';
import { CodeGeneratorOptions, GenerateAllOptions, ModuleMap, ModuleMapScope } from './types';
import type { ModuleImportLocations } from '../cdk/cdk';
import { defaultFilePatterns, generateSome as generateModules } from '../generate';
import { log } from '../util';

export * from './types';

let serviceCache: Service[];

async function getAllScopes(field: keyof Service = 'name'): Promise<ModuleMapScope[]> {
  if (!serviceCache) {
    const db = await loadAwsServiceSpec();
    serviceCache = db.all('service');
  }

  return serviceCache.map((s) => ({ namespace: s[field] }));
}

export default async function generate(
  scopes: string | string[],
  outPath: string,
  options: CodeGeneratorOptions = {},
): Promise<void> {
  const coreImport = options.coreImport ?? 'aws-cdk-lib';
  let moduleScopes: ModuleMapScope[] = [];
  if (scopes === '*') {
    moduleScopes = await getAllScopes('cloudFormationNamespace');
  } else if (typeof scopes === 'string') {
    moduleScopes = [{ namespace: scopes }];
  }

  log.info(`cfn-resources: ${moduleScopes.map(s => s.namespace).join(', ')}`);
  await generateModules(
    {
      'aws-cdk-lib': {
        services: options.autoGenerateSuffixes ? computeServiceSuffixes(moduleScopes) : moduleScopes,
      },
    },
    {
      outputPath: outPath ?? 'lib',
      clearOutput: false,
      filePatterns: {
        resources: '%serviceShortName%.generated.ts',
        augmentations: '%serviceShortName%-augmentations.generated.ts',
        cannedMetrics: '%serviceShortName%-canned-metrics.generated.ts',
      },
      importLocations: {
        core: coreImport,
        coreHelpers: `${coreImport}/${coreImport === '.' ? '' : 'lib/'}helpers-internal`,
        coreErrors: `${coreImport}/${coreImport === '.' ? '' : 'lib/'}errors`,
      },
    },
  );
}

/**
 * Maps suffixes to services used to generated class names, given all the scopes that share the same package.
 */
function computeServiceSuffixes(scopes: ModuleMapScope[] = []): ModuleMapScope[] {
  const allScopes = scopes.map((scope) => scope.namespace);
  return scopes.map(
    (scope) => {
      // don't change if provided
      if (scope.suffix) {
        return scope;
      }

      return {
        ...scope,
        suffix: computeSuffix(scope.namespace, allScopes),
      };
    },
  );
}

/**
 * Finds a suffix for class names generated for a scope, given all the scopes that share the same package.
 * @param scope     the scope for which an affix is needed (e.g: AWS::ApiGatewayV2)
 * @param allScopes all the scopes hosted in the package (e.g: ["AWS::ApiGateway", "AWS::ApiGatewayV2"])
 * @returns the affix (e.g: "V2"), if any, or undefined.
 */
function computeSuffix(scope: string, allScopes: string[]): string | undefined {
  if (allScopes.length === 1) {
    return undefined;
  }
  const parts = scope.match(/^(.+)(V\d+)$/);
  if (!parts) {
    return undefined;
  }
  const [, root, version] = parts;
  if (allScopes.indexOf(root) !== -1) {
    return version;
  }
  return undefined;
}

/**
 * Generates L1s for all submodules of a monomodule. Modules to generate are
 * chosen based on the contents of the `scopeMapPath` file. This is intended for
 * use in generated L1s in aws-cdk-lib.
 *
 * This entrypoint is called from `aws-cdk-lib`s pre-build script. It is distinct
 * from the `generateAll()` function in a sibling module to this one.
 *
 * @param outPath The root directory to generate L1s in
 * @param param1  Options
 * @returns       A ModuleMap containing the ModuleDefinition and CFN scopes for each generated module.
 */
export async function legacyGenerateAll(
  outPath: string,
  { scopeMapPath, skippedServices, ...options }: GenerateAllOptions,
): Promise<ModuleMap> {
  const allScopes = await getAllScopes('cloudFormationNamespace');
  const scopes = skippedServices ? allScopes.filter((scope) => !skippedServices.includes(scope.namespace)) : allScopes;
  const moduleMap = await readScopeMap(scopeMapPath);

  // Make sure all scopes have their own dedicated package/namespace.
  // Adds new submodules for new namespaces.
  for (const scope of scopes) {
    const moduleDefinition = pkglint.createModuleDefinitionFromCfnNamespace(scope.namespace);
    const currentScopes = moduleMap[moduleDefinition.moduleName]?.scopes ?? [];
    // remove dupes, give precedence to data from module map
    const newScopes = Array.from(
      new Map([scope, ...currentScopes].map(s => [s.namespace, s])).values(),
    );

    // Add new modules to module map and return to caller
    moduleMap[moduleDefinition.moduleName] = {
      name: moduleDefinition.moduleName,
      definition: moduleDefinition,
      scopes: newScopes,
      resources: {},
      files: [],
    };
  }

  const coreModule = 'core';
  const coreImportLocations: ModuleImportLocations = {
    core: '.',
    coreHelpers: './helpers-internal',
    coreErrors: './errors',
  };

  const generated = await generateModules(
    Object.fromEntries(
      Object.entries(moduleMap).map(([moduleName, { scopes: services }]) => [
        moduleName,
        {
          services,
          moduleImportLocations: moduleName === coreModule ? coreImportLocations : undefined,
        },
      ]),
    ),
    {
      outputPath: outPath,
      clearOutput: false,
      filePatterns: {
        resources: '%moduleName%/lib/%serviceShortName%.generated.ts',
        augmentations: '%moduleName%/lib/%serviceShortName%-augmentations.generated.ts',
        cannedMetrics: '%moduleName%/lib/%serviceShortName%-canned-metrics.generated.ts',
      },
      importLocations: {
        core: options.coreImport,
        coreHelpers: `${options.coreImport}/lib/helpers-internal`,
        coreErrors: `${options.coreImport}/lib/errors`,
        cloudwatch: options.cloudwatchImport,
      },
    },
  );

  Object.keys(moduleMap).forEach((moduleName) => {
    // Add generated resources and files to module in map
    moduleMap[moduleName].resources = generated.modules[moduleName].map((m) => m.resources).reduce(mergeObjects, {});
    moduleMap[moduleName].files = generated.modules[moduleName].flatMap((m) => m.outputFiles);
  });

  return moduleMap;
}

/**
 * Reads the scope map from a file and transforms it into the type we need.
 */
async function readScopeMap(filepath: string): Promise<ModuleMap> {
  const scopeMap: Record<string, string[] | Array<ModuleMapScope>> = await fs.readJson(filepath);
  return Object.entries(scopeMap).reduce((moduleMap, [name, moduleScopes]) => {
    return {
      ...moduleMap,
      [name]: {
        name,
        scopes: moduleScopes.map(s => {
          if (typeof s === 'string') {
            return {
              namespace: s,
            };
          }

          return s;
        }),
        resources: {},
        files: [],
      },
    };
  }, {});
}

/**
 * Reduce compatible merge objects
 */
function mergeObjects<T>(all: T, res: T) {
  return {
    ...all,
    ...res,
  };
}
