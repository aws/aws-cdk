/* eslint-disable import/no-extraneous-dependencies */
import * as pkglint from '@aws-cdk/pkglint';

export interface CodeGeneratorOptions {
  /**
   * How to import the core library.
   *
   * @default '@aws-cdk/core'
   */
  readonly coreImport?: string;
}

export interface AugmentationsGeneratorOptions {
  /**
   * Path of cloudwatch import to use when generating augmentation source
   * files.
   *
   * @default '@aws-cdk/aws-cloudwatch'
   */
  cloudwatchImport?: string;
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
 * A data structure holding information about a generated module.
 */
export interface ModuleMapEntry {
  name: string;
  definition?: pkglint.ModuleDefinition;
  scopes: string[];
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
