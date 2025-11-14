import * as fs from 'node:fs';
import * as path from 'node:path';
import type { ModuleDefinition } from '@aws-cdk/pkglint';
import { namespaceToModuleDefinition } from './util/jsii';

/**
 * A data structure holding information about a single scope in a generated module.
 */
export interface ModuleMapScope {
  readonly namespace: string;
  readonly suffix?: string;
  readonly deprecated?: string;
}

/**
 * A data structure holding information about a generated module.
 */
export interface ModuleMapEntry {
  name: string;
  definition?: ModuleDefinition;
  scopes: ModuleMapScope[];
  targets?: {
    dotnet?: { namespace?: string };
    java?: { package?: string };
    python?: { module?: string };
  };
  resources: Record<string, string>;
  files: string[];
}

/**
 * A data structure holding information about generated modules.
 * It maps module names to their full module definition, CFN scopes, resources and generated files.
 */
export interface ModuleMap {
  [moduleName: string]: ModuleMapEntry;
}

/**
 * Reads a module map from a file and transforms it into the type we need.
 */
export function readModuleMap(filepath: string): ModuleMap {
  const theMap: Record<string, { scopes: Array<ModuleMapScope>; targets?: ModuleMapEntry['targets'] }> = JSON.parse(fs.readFileSync(filepath).toString());
  return Object.entries(theMap).reduce((moduleMap, [name, loaded]) => {
    // We load the definition for the first scope
    let definition = undefined;
    if (loaded.scopes[0]?.namespace) {
      definition = namespaceToModuleDefinition(loaded.scopes[0].namespace);

      // update definition with values from targets
      if (loaded.targets) {
        definition = {
          ...definition,
          dotnetPackage: loaded.targets.dotnet?.namespace ?? definition.dotnetPackage,
          javaPackage: loaded.targets.java?.package ?? definition.javaPackage,
          pythonModuleName: loaded.targets.python?.module ?? definition.pythonModuleName,
        };
      }
    }

    return {
      ...moduleMap,
      [name]: {
        name,
        scopes: [...loaded.scopes],
        targets: { ...loaded.targets },
        definition,
        resources: {},
        files: [],
      },
    };
  }, {});
}

const moduleMapPath = path.join(__dirname, '..', '..', '..', '..', 'packages', 'aws-cdk-lib', 'scripts', 'scope-map.json');

/**
 * Loads the global module map from the `aws-cdk-lib` package.
 * It maps every `aws-cdk-lib` submodule to the AWS service prefix in that submodule.
 */
export function loadModuleMap(): ModuleMap {
  return readModuleMap(moduleMapPath);
}

/**
 * Updates the global module map in the `aws-cdk-lib` package.
 */
export function writeModuleMap(modules: ModuleMap) {
  const newScopeMap = Object.entries(modules)
    .sort(([modA], [modB]) => modA.localeCompare(modB))
    .reduce((scopeMap, [moduleName, { scopes, targets }]) => {
      return {
        ...scopeMap,
        [moduleName]: {
          scopes,
          targets: noEmpty(targets),
        },
      };
    }, {});

  fs.writeFileSync(moduleMapPath, JSON.stringify(newScopeMap, null, 2) + '\n');
}

function noEmpty<A extends object>(x: A | undefined): A | undefined {
  if (!x || Object.keys(x).length === 0) {
    return undefined;
  }
  return x;
}
