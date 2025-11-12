import { loadAwsServiceSpec } from '@aws-cdk/aws-service-spec';
import type { ModuleImportLocations } from '../cdk/cdk';
import { generate as generateModules } from '../generate';
import { ModuleMap, readModuleMap } from '../module-topology';
import * as naming from '../naming';
import { jsii } from '../util';
import { getAllScopes } from '../util/db';

/**
 * Configuration options for the generateAll function
 */
export interface GenerateAllOptions {
  /**
   * Path of the file containing the map of module names to their CFN Scopes
   */
  readonly scopeMapPath: string;

  /**
   * List of service names to be skipped it will be in format AWS::Service like AWS::S3
   */
  readonly skippedServices?: string[];

  /**
   * How to import the core library.
   *
   * @default '@aws-cdk/core'
   */
  readonly coreImport?: string;

  /**
   * Automatically generate service suffixes
   *
   * @default false
   */
  readonly autoGenerateSuffixes?: boolean;

  /**
   * Path of cloudwatch import to use when generating augmentation source
   * files.
   *
   * @default '@aws-cdk/aws-cloudwatch'
   */
  cloudwatchImport?: string;
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
  { scopeMapPath, skippedServices, ...options }: GenerateAllOptions,
): Promise<ModuleMap> {
  const db = await loadAwsServiceSpec();
  const allScopes = getAllScopes(db, 'cloudFormationNamespace');
  const scopes = skippedServices ? allScopes.filter((scope) => !skippedServices.includes(scope.namespace)) : allScopes;
  const moduleMap = readModuleMap(scopeMapPath);

  // Make sure all scopes have their own dedicated package/namespace.
  // Adds new submodules for new namespaces.
  for (const scope of scopes) {
    const moduleName = naming.modulePartsFromNamespace(scope.namespace).moduleName;
    const currentScopes = moduleMap[moduleName]?.scopes ?? [];
    // remove dupes, give precedence to data from module map
    const newScopes = Array.from(
      new Map([scope, ...currentScopes].map(s => [s.namespace, s])).values(),
    );

    // Add new modules to module map and return to caller
    moduleMap[moduleName] = {
      name: moduleName,
      scopes: newScopes,
      definition: moduleMap[moduleName]?.definition ?? jsii.namespaceToModuleDefinition(scope.namespace),
      targets: moduleMap[moduleName]?.targets ?? undefined,
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
        grants: '%moduleName%/lib/%serviceShortName%-grants.generated.ts',
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
 * Reduce compatible merge objects
 */
function mergeObjects<T>(all: T, res: T) {
  return {
    ...all,
    ...res,
  };
}
